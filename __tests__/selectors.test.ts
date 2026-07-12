import { products } from '../src/data/demo';
import { cartActions } from '../src/store/cart/cartSlice';
import { catalogActions } from '../src/store/catalog/catalogSlice';
import { checkoutActions } from '../src/store/checkout/checkoutSlice';
import {
  selectActiveTab,
  selectCartCount,
  selectCartLineItems,
  selectCartTotal,
  selectFlowIndexFromScreen,
  selectLatestOrderSummary,
  selectLatestTransactionId,
  selectLatestTransactionStatus,
  selectSelectedProduct,
} from '../src/store/selectors';
import { store, type RootState } from '../src/store/store';
import { transactionActions } from '../src/store/transaction/transactionSlice';

function resetStore() {
  store.dispatch(cartActions.cartReset());
  store.dispatch(checkoutActions.checkoutReset());
  store.dispatch(transactionActions.clearTransactions());
  store.dispatch(catalogActions.replaceCatalog(products));
}

describe('selectors', () => {
  beforeEach(() => {
    resetStore();
  });

  it('maps screens to the active tab and flow index', () => {
    store.dispatch(checkoutActions.navigateTo('home'));
    expect(selectActiveTab(store.getState())).toBe('home');

    store.dispatch(checkoutActions.navigateTo('productDetail'));
    expect(selectActiveTab(store.getState())).toBe('catalog');

    store.dispatch(checkoutActions.navigateTo('confirmation'));
    expect(selectActiveTab(store.getState())).toBe('checkout');

    expect(selectFlowIndexFromScreen('catalog')).toBe(1);
    expect(selectFlowIndexFromScreen('confirmation')).toBe(5);
  });

  it('selects the product detail record and falls back to null when it is missing', () => {
    store.dispatch(checkoutActions.openProductDetail({ productId: products[0].id }));
    expect(selectSelectedProduct(store.getState())?.id).toBe(products[0].id);

    const missingState = {
      ...store.getState(),
      checkout: {
        ...store.getState().checkout,
        selectedProductId: 'missing-product',
      },
    } as RootState;

    expect(selectSelectedProduct(missingState)).toBeNull();
  });

  it('calculates cart totals and filters out empty quantities', () => {
    store.dispatch(cartActions.itemAdded({ productId: products[0].id }));
    store.dispatch(cartActions.itemAdded({ productId: products[1].id, quantity: 2 }));

    const state = store.getState();
    const augmentedState = {
      ...state,
      cart: {
        items: {
          ...state.cart.items,
          ghost: 0,
        },
      },
    } as RootState;

    expect(selectCartCount(augmentedState)).toBe(3);
    expect(selectCartTotal(augmentedState)).toBe(
      products[0].price + products[1].price * 2,
    );
    expect(selectCartLineItems(augmentedState)).toHaveLength(2);
    expect(selectCartLineItems(augmentedState).every((item) => item.quantity > 0)).toBe(true);
  });

  it('summarizes the latest transaction record', () => {
    expect(selectLatestTransactionStatus(store.getState())).toBeNull();
    expect(selectLatestTransactionId(store.getState())).toBeNull();
    expect(selectLatestOrderSummary(store.getState())).toBeNull();

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

    const state = store.getState();
    expect(selectLatestTransactionStatus(state)).toBe('pending');
    expect(selectLatestTransactionId(state)).toBe('txn-1');
    expect(selectLatestOrderSummary(state)).toEqual({
      number: 'SC-001',
      itemCount: 2,
      total: 278000,
    });
  });
});
