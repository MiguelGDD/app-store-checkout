import { decryptJson } from '../src/store/secureCodec';
import { cartActions } from '../src/store/cart/cartSlice';
import { catalogActions } from '../src/store/catalog/catalogSlice';
import { checkoutActions } from '../src/store/checkout/checkoutSlice';
import {
  selectActiveTab,
  selectCartCount,
  selectLatestOrderSummary,
  selectLatestTransactionStatus,
  selectSelectedProduct,
} from '../src/store/selectors';
import { store } from '../src/store/store';
import { transactionActions } from '../src/store/transaction/transactionSlice';
import { createCheckoutWorkflow } from '../src/store/workflows/checkoutWorkflow';
import { products } from '../src/data/demo';
import type { CardPaymentDetails } from '../src/types';

const backendProducts = products.slice(0, 2).map((product, index) => ({
  ...product,
  id: String(index + 1),
}));

const payment: CardPaymentDetails = {
  number: '4242 4242 4242 4242',
  expMonth: '12',
  expYear: '29',
  cvc: '123',
  cardHolder: 'Ana Perez',
};

function createBackendTransaction(status: 'APPROVED' | 'DECLINED' | 'PENDING') {
  return {
    id: 7,
    reference: 'backend-reference',
    totalAmount: backendProducts[0].price + backendProducts[1].price,
    baseFee: backendProducts[0].price + backendProducts[1].price,
    deliveryFee: 0,
    status,
    bankTransactionId: 'bank-transaction-7',
    createAt: '2026-07-12T00:00:00.000Z',
    updateAt: '2026-07-12T00:01:00.000Z',
  } as const;
}

type BackendTransaction = ReturnType<typeof createBackendTransaction>;

function createDeferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
}

function getCatalogStock(productId: string) {
  const product = store
    .getState()
    .catalog.items.find((item) => item.id === productId);

  return product?.stock ?? null;
}

function resetStore() {
  store.dispatch(cartActions.cartReset());
  store.dispatch(checkoutActions.checkoutReset());
  store.dispatch(transactionActions.clearTransactions());
  store.dispatch(
    catalogActions.replaceCatalog(backendProducts.map((product) => ({ ...product }))),
  );
}

describe('redux workflow', () => {
  beforeEach(() => {
    resetStore();
  });

  test('records encrypted transactions', () => {
    store.dispatch(
      transactionActions.recordTransaction({
        transactionId: 'txn-1',
        number: 'SC-001',
        itemCount: 2,
        total: 278000,
        status: 'pending',
        customer: {
          customerName: 'Jane Doe',
          customerEmail: 'jane@example.com',
          documentId: '123456789',
          paymentToken: 'token-1',
          paymentReference: 'SC-001',
        },
      }),
    );

    const latest = store.getState().transaction.latest;

    expect(latest?.summary.number).toBe('SC-001');
    expect(latest?.summary.status).toBe('pending');
    expect(latest?.encryptedSensitiveData).toBeTruthy();
    expect(latest?.encryptedSensitiveData).not.toContain('Jane Doe');
    expect(decryptJson(latest!.encryptedSensitiveData)).toMatchObject({
      customerEmail: 'jane@example.com',
      paymentReference: 'SC-001',
    });
  });

  test('optimistically updates stock on approved checkout and clears the cart', async () => {
    const initialStockOne = backendProducts[0].stock;
    const initialStockTwo = backendProducts[1].stock;
    const deferred = createDeferred<BackendTransaction>();
    const apiClient = {
      createTransaction: jest.fn().mockReturnValue(deferred.promise),
    };
    const submitCheckout = createCheckoutWorkflow(apiClient);
    store.dispatch(cartActions.itemAdded({ productId: backendProducts[0].id }));
    store.dispatch(cartActions.itemAdded({ productId: backendProducts[1].id }));
    store.dispatch(checkoutActions.navigateTo('checkout'));

    const checkoutPromise = store.dispatch(submitCheckout(payment));
    expect(getCatalogStock(backendProducts[0].id)).toBe(initialStockOne - 1);
    expect(getCatalogStock(backendProducts[1].id)).toBe(initialStockTwo - 1);

    deferred.resolve(createBackendTransaction('APPROVED'));
    await checkoutPromise;

    const state = store.getState();
    const summary = selectLatestOrderSummary(state);

    expect(apiClient.createTransaction).toHaveBeenCalledWith({
      customerId: 1,
      deliveryFee: 0,
      items: [
        { productId: 1, quantity: 1 },
        { productId: 2, quantity: 1 },
      ],
      payment: {
        ...payment,
        number: '4242424242424242',
      },
    });
    expect(selectCartCount(state)).toBe(0);
    expect(state.checkout.activeScreen).toBe('confirmation');
    expect(state.checkout.isSubmitting).toBe(false);
    expect(selectLatestTransactionStatus(state)).toBe('completed');
    expect(summary?.number).toBe('backend-reference');
    expect(summary?.itemCount).toBe(2);
    expect(summary?.total).toBe(
      backendProducts[0].price + backendProducts[1].price,
    );
    expect(getCatalogStock(backendProducts[0].id)).toBe(initialStockOne - 1);
    expect(getCatalogStock(backendProducts[1].id)).toBe(initialStockTwo - 1);
  });

  test('rolls back the optimistic stock change for pending backend checkouts', async () => {
    const initialStock = backendProducts[0].stock;
    const apiClient = {
      createTransaction: jest.fn().mockResolvedValue(createBackendTransaction('PENDING')),
    };
    const submitCheckout = createCheckoutWorkflow(apiClient);
    store.dispatch(cartActions.itemAdded({ productId: backendProducts[0].id }));
    store.dispatch(checkoutActions.navigateTo('checkout'));

    await store.dispatch(submitCheckout(payment));

    const state = store.getState();
    expect(getCatalogStock(backendProducts[0].id)).toBe(initialStock);
    expect(selectCartCount(state)).toBe(1);
    expect(state.checkout.activeScreen).toBe('confirmation');
    expect(selectLatestTransactionStatus(state)).toBe('pending');
  });

  test('keeps the cart when the backend declines the payment', async () => {
    const initialStock = backendProducts[0].stock;
    const submitCheckout = createCheckoutWorkflow({
      createTransaction: jest
        .fn()
        .mockResolvedValue(createBackendTransaction('DECLINED')),
    });
    store.dispatch(cartActions.itemAdded({ productId: backendProducts[0].id }));
    store.dispatch(checkoutActions.navigateTo('checkout'));

    await store.dispatch(submitCheckout(payment));

    const state = store.getState();
    expect(getCatalogStock(backendProducts[0].id)).toBe(initialStock);
    expect(selectCartCount(state)).toBe(1);
    expect(state.checkout.activeScreen).toBe('confirmation');
    expect(selectLatestTransactionStatus(state)).toBe('failed');
  });

  test('shows an error and preserves the cart when the API fails', async () => {
    const initialStock = backendProducts[0].stock;
    const submitCheckout = createCheckoutWorkflow({
      createTransaction: jest.fn().mockRejectedValue(new Error('offline')),
    });
    store.dispatch(cartActions.itemAdded({ productId: backendProducts[0].id }));
    store.dispatch(checkoutActions.navigateTo('checkout'));

    await store.dispatch(submitCheckout(payment));

    const state = store.getState();
    expect(getCatalogStock(backendProducts[0].id)).toBe(initialStock);
    expect(selectCartCount(state)).toBe(1);
    expect(state.checkout.activeScreen).toBe('checkout');
    expect(state.checkout.isSubmitting).toBe(false);
    expect(state.checkout.paymentError).toContain('No pudimos procesar');
    expect(selectLatestTransactionStatus(state)).toBeNull();
  });

  test('opens product detail and clears the selection when leaving it', () => {
    store.dispatch(
      checkoutActions.openProductDetail({ productId: backendProducts[0].id }),
    );

    let state = store.getState();

    expect(state.checkout.activeScreen).toBe('productDetail');
    expect(state.checkout.selectedProductId).toBe(backendProducts[0].id);
    expect(selectActiveTab(state)).toBe('catalog');
    expect(selectSelectedProduct(state)?.id).toBe(backendProducts[0].id);

    store.dispatch(checkoutActions.navigateTo('cart'));
    state = store.getState();

    expect(state.checkout.selectedProductId).toBeNull();
  });

  test('keeps the user on checkout when there are no items', async () => {
    const apiClient = { createTransaction: jest.fn() };
    const submitCheckout = createCheckoutWorkflow(apiClient);
    store.dispatch(checkoutActions.navigateTo('catalog'));

    await store.dispatch(submitCheckout(payment));

    expect(apiClient.createTransaction).not.toHaveBeenCalled();
    expect(store.getState().checkout.activeScreen).toBe('checkout');
  });
});
