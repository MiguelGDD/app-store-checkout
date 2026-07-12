import {
  backendStoreApiClient,
  type BackendStoreApiPort,
} from '../../infrastructure/backend/backendApiClient';
import { backendConfig } from '../../infrastructure/backend/backendConfig';
import type {
  BackendCreateTransactionInput,
  BackendTransactionStatus,
} from '../../infrastructure/backend/backendTypes';
import { translate } from '../../i18n';
import type { CardPaymentDetails, TransactionStatus } from '../../types';
import type { AppDispatch, AppThunk } from '../store';
import { selectCartCount, selectCartLineItems } from '../selectors';
import { cartActions } from '../cart/cartSlice';
import { catalogActions } from '../catalog/catalogSlice';
import { checkoutActions } from '../checkout/checkoutSlice';
import { transactionActions } from '../transaction/transactionSlice';

type CheckoutApiPort = Pick<BackendStoreApiPort, 'createTransaction'>;

function mapTransactionStatus(
  status: BackendTransactionStatus,
): TransactionStatus {
  if (status === 'APPROVED') {
    return 'completed';
  }

  if (status === 'PENDING') {
    return 'pending';
  }

  return 'failed';
}

function buildRequest(
  payment: CardPaymentDetails,
  lineItems: ReturnType<typeof selectCartLineItems>,
): BackendCreateTransactionInput | null {
  const items = lineItems.map(({ product, quantity }) => ({
    productId: Number(product.id),
    quantity,
  }));

  if (
    items.some(
      ({ productId, quantity }) =>
        !Number.isInteger(productId) || productId < 1 || quantity < 1,
    )
  ) {
    return null;
  }

  return {
    customerId: backendConfig.customerId,
    deliveryFee: backendConfig.deliveryFee,
    items,
    payment: {
      ...payment,
      number: payment.number.replace(/\s/g, ''),
    },
  };
}

function updatePurchasedStock(
  dispatch: AppDispatch,
  lineItems: ReturnType<typeof selectCartLineItems>,
  direction: 1 | -1,
) {
  lineItems.forEach(({ product, quantity }) => {
    dispatch(
      catalogActions.adjustProductStock({
        productId: product.id,
        delta: quantity * direction,
      }),
    );
  });
}

export function createCheckoutWorkflow(
  apiClient: CheckoutApiPort = backendStoreApiClient,
) {
  return (payment: CardPaymentDetails): AppThunk<Promise<void>> =>
    async (dispatch, getState) => {
      const state = getState();
      const lineItems = selectCartLineItems(state);
      const itemCount = selectCartCount(state);

      if (state.checkout.isSubmitting) {
        return;
      }

      if (lineItems.length === 0) {
        dispatch(checkoutActions.navigateTo('checkout'));
        return;
      }

      const request = buildRequest(payment, lineItems);

      if (!request) {
        dispatch(
          checkoutActions.checkoutPaymentFailed({
            error: translate('checkout.invalidCart'),
          }),
        );
        return;
      }

      dispatch(checkoutActions.checkoutPaymentStarted());
      // Sync inventory optimistically and roll back if the checkout is not approved.
      updatePurchasedStock(dispatch, lineItems, -1);

      try {
        const response = await apiClient.createTransaction(request);
        const status = mapTransactionStatus(response.status);

        if (status !== 'completed') {
          updatePurchasedStock(dispatch, lineItems, 1);
        }

        dispatch(
          transactionActions.recordTransaction({
            transactionId: String(response.id),
            number: response.reference,
            itemCount,
            total: response.totalAmount,
            status,
            createdAt: response.createAt,
            updatedAt: response.updateAt,
            customer: {
              customerName: payment.cardHolder,
              customerEmail: `customer-${backendConfig.customerId}@configured.local`,
              documentId: String(backendConfig.customerId),
              paymentToken: response.bankTransactionId ?? 'not-provided',
              paymentReference: response.reference,
            },
          }),
        );

        if (status === 'completed') {
          dispatch(cartActions.cartReset());
        }

        dispatch(
          checkoutActions.checkoutCompleted({
            transactionNumber: response.reference,
          }),
        );
      } catch {
        updatePurchasedStock(dispatch, lineItems, 1);
        dispatch(
          checkoutActions.checkoutPaymentFailed({
            error: translate('checkout.paymentError'),
          }),
        );
      }
    };
}

export const submitCheckout = createCheckoutWorkflow();
