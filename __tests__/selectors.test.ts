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
  selectTransactionHistoryLastSyncedAt,
  selectTransactionHistory,
  selectTransactionHistorySyncError,
  selectTransactionHistorySyncStatus,
  selectTransactionHydrated,
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
    expect(selectActiveTab(store.getState())).toBe('catalog');

    store.dispatch(checkoutActions.navigateTo('productDetail'));
    expect(selectActiveTab(store.getState())).toBe('catalog');

    store.dispatch(checkoutActions.navigateTo('confirmation'));
    expect(selectActiveTab(store.getState())).toBe('checkout');

    store.dispatch(checkoutActions.navigateTo('history'));
    expect(selectActiveTab(store.getState())).toBe('history');

    expect(selectFlowIndexFromScreen('catalog')).toBe(0);
    expect(selectFlowIndexFromScreen('history')).toBe(0);
    expect(selectFlowIndexFromScreen('confirmation')).toBe(4);
  });

  it('selects the product detail record and falls back to null when it is missing', () => {
    expect(selectSelectedProduct(store.getState())).toBeNull();
    expect(selectTransactionHydrated(store.getState())).toBe(true);
    expect(selectTransactionHistoryLastSyncedAt(store.getState())).toBeNull();

    store.dispatch(
      checkoutActions.openProductDetail({ productId: products[0].id }),
    );
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
    store.dispatch(
      cartActions.itemAdded({ productId: products[1].id, quantity: 2 }),
    );

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
    expect(
      selectCartLineItems(augmentedState).every(item => item.quantity > 0),
    ).toBe(true);
  });

  it('summarizes the latest transaction record', () => {
    expect(selectLatestTransactionStatus(store.getState())).toBeNull();
    expect(selectLatestTransactionId(store.getState())).toBeNull();
    expect(selectLatestOrderSummary(store.getState())).toBeNull();
    expect(selectTransactionHistory(store.getState())).toEqual([]);

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
    expect(selectTransactionHistory(state)).toEqual([]);

    store.dispatch(
      transactionActions.transactionHistorySyncSucceeded({
        transactions: [
          {
            transactionId: 'remote-1',
            number: 'SC-900',
            itemCount: 3,
            total: 890000,
            status: 'completed',
            createdAt: '2026-07-12T00:00:00.000Z',
            updatedAt: '2026-07-12T00:05:00.000Z',
          },
        ],
        syncedAt: '2026-07-12T00:10:00.000Z',
      }),
    );

    const syncedState = store.getState();
    expect(selectTransactionHistorySyncStatus(syncedState)).toBe('succeeded');
    expect(selectTransactionHistorySyncError(syncedState)).toBeNull();
    expect(selectTransactionHistory(syncedState)).toEqual([
      {
        transactionId: 'remote-1',
        number: 'SC-900',
        itemCount: 3,
        total: 890000,
        status: 'completed',
        createdAt: '2026-07-12T00:00:00.000Z',
        updatedAt: '2026-07-12T00:05:00.000Z',
      },
    ]);

    const augmentedState = {
      ...syncedState,
      transaction: {
        ...syncedState.transaction,
        hydrated: false,
        remoteHistoryLastSyncedAt: '2026-07-12T00:10:00.000Z',
      },
    } as RootState;

    expect(selectTransactionHydrated(augmentedState)).toBe(false);
    expect(selectTransactionHistoryLastSyncedAt(augmentedState)).toBe(
      '2026-07-12T00:10:00.000Z',
    );
  });
});
