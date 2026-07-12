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
import { submitCheckout } from '../src/store/workflows/checkoutWorkflow';
import { products } from '../src/data/demo';

function resetStore() {
  store.dispatch(cartActions.cartReset());
  store.dispatch(checkoutActions.checkoutReset());
  store.dispatch(transactionActions.clearTransactions());
  store.dispatch(catalogActions.replaceCatalog(products));
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

  test('submits a checkout flow and clears the cart', async () => {
    store.dispatch(cartActions.itemAdded({ productId: products[0].id }));
    store.dispatch(cartActions.itemAdded({ productId: products[1].id }));
    store.dispatch(checkoutActions.navigateTo('checkout'));

    store.dispatch(submitCheckout());

    const state = store.getState();
    const summary = selectLatestOrderSummary(state);

    expect(selectCartCount(state)).toBe(0);
    expect(state.checkout.activeScreen).toBe('confirmation');
    expect(selectLatestTransactionStatus(state)).toBe('completed');
    expect(summary?.number).toBe('SC-001');
    expect(summary?.itemCount).toBe(2);
    expect(summary?.total).toBe(
      products[0].price + products[1].price,
    );
  });

  test('opens product detail and clears the selection when leaving it', () => {
    store.dispatch(
      checkoutActions.openProductDetail({ productId: products[0].id }),
    );

    let state = store.getState();

    expect(state.checkout.activeScreen).toBe('productDetail');
    expect(state.checkout.selectedProductId).toBe(products[0].id);
    expect(selectActiveTab(state)).toBe('catalog');
    expect(selectSelectedProduct(state)?.id).toBe(products[0].id);

    store.dispatch(checkoutActions.navigateTo('cart'));
    state = store.getState();

    expect(state.checkout.selectedProductId).toBeNull();
  });

  test('keeps the user on checkout when there are no items', () => {
    store.dispatch(checkoutActions.navigateTo('home'));

    store.dispatch(submitCheckout());

    expect(store.getState().checkout.activeScreen).toBe('checkout');
  });
});
