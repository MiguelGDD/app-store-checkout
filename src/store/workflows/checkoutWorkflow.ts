import type { AppThunk } from '../store';
import {
  selectCartCount,
  selectCartLineItems,
  selectCartTotal,
} from '../selectors';
import { cartActions } from '../cart/cartSlice';
import { checkoutActions } from '../checkout/checkoutSlice';
import { transactionActions } from '../transaction/transactionSlice';

function buildTransactionNumber(index: number): string {
  return `SC-${String(index).padStart(3, '0')}`;
}

export const submitCheckout = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const lineItems = selectCartLineItems(state);
  const itemCount = selectCartCount(state);
  const total = selectCartTotal(state);

  if (lineItems.length === 0) {
    dispatch(checkoutActions.navigateTo('checkout'));
    return;
  }

  const nextSequence = state.transaction.history.length + 1;
  const number = buildTransactionNumber(nextSequence);
  const transactionId = `txn-${Date.now()}-${nextSequence}`;
  const createdAt = new Date().toISOString();

  dispatch(
    transactionActions.recordTransaction({
      transactionId,
      number,
      itemCount,
      total,
      status: 'pending',
      createdAt,
      updatedAt: createdAt,
      customer: {
        customerName: 'Comprador de prueba',
        customerEmail: 'comprador@ejemplo.com',
        documentId: '1000000000',
        paymentToken: `token-${transactionId}`,
        paymentReference: number,
      },
    }),
  );

  dispatch(
    transactionActions.updateTransactionStatus({
      transactionId,
      status: 'completed',
      updatedAt: new Date().toISOString(),
    }),
  );

  dispatch(cartActions.cartReset());
  dispatch(
    checkoutActions.checkoutCompleted({
      transactionNumber: number,
    }),
  );
};
