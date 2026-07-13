import { products } from '../src/data/demo';
import { cartActions, cartReducer } from '../src/store/cart/cartSlice';
import {
  checkoutActions,
  checkoutReducer,
  screenToFlowIndex,
} from '../src/store/checkout/checkoutSlice';
import { decryptJson } from '../src/store/secureCodec';
import {
  transactionActions,
  transactionReducer,
} from '../src/store/transaction/transactionSlice';

describe('cart reducer', () => {
  it('adds, decrements, removes and resets items', () => {
    let state = cartReducer(
      undefined,
      cartActions.itemAdded({ productId: 'p-1', quantity: 0 }),
    );
    expect(state.items['p-1']).toBe(1);

    state = cartReducer(
      state,
      cartActions.itemAdded({ productId: 'p-1', quantity: 2 }),
    );
    expect(state.items['p-1']).toBe(3);

    state = cartReducer(
      state,
      cartActions.itemDecremented({ productId: 'p-1' }),
    );
    expect(state.items['p-1']).toBe(2);

    state = cartReducer(
      state,
      cartActions.itemDecremented({ productId: 'p-1' }),
    );
    expect(state.items['p-1']).toBe(1);

    state = cartReducer(
      state,
      cartActions.itemDecremented({ productId: 'p-1' }),
    );
    expect(state.items['p-1']).toBeUndefined();

    state = cartReducer(state, cartActions.itemRemoved({ productId: 'p-1' }));
    expect(state.items).toEqual({});

    state = cartReducer(state, cartActions.itemAdded({ productId: 'p-2' }));
    state = cartReducer(state, cartActions.cartReset());
    expect(state.items).toEqual({});
  });
});

describe('checkout reducer', () => {
  it('maps screens to flow indexes and preserves product selection only when staying on product detail', () => {
    expect(screenToFlowIndex('home')).toBe(0);
    expect(screenToFlowIndex('catalog')).toBe(0);
    expect(screenToFlowIndex('productDetail')).toBe(1);
    expect(screenToFlowIndex('cart')).toBe(2);
    expect(screenToFlowIndex('checkout')).toBe(3);
    expect(screenToFlowIndex('confirmation')).toBe(4);

    let state = checkoutReducer(
      undefined,
      checkoutActions.openProductDetail({ productId: products[0].id }),
    );

    expect(state.activeScreen).toBe('productDetail');
    expect(state.selectedProductId).toBe(products[0].id);
    expect(state.flowIndex).toBe(1);

    state = checkoutReducer(state, checkoutActions.navigateTo('productDetail'));
    expect(state.selectedProductId).toBe(products[0].id);
    expect(state.flowIndex).toBe(1);

    state = checkoutReducer(state, checkoutActions.navigateTo('cart'));
    expect(state.activeScreen).toBe('cart');
    expect(state.selectedProductId).toBeNull();
    expect(state.flowIndex).toBe(2);

    state = checkoutReducer(
      state,
      checkoutActions.checkoutCompleted({ transactionNumber: 'SC-001' }),
    );
    expect(state.activeScreen).toBe('confirmation');
    expect(state.selectedProductId).toBeNull();
    expect(state.flowIndex).toBe(4);
    expect(state.lastCompletedTransactionNumber).toBe('SC-001');

    state = checkoutReducer(state, checkoutActions.checkoutReset());
    expect(state).toEqual({
      activeScreen: 'catalog',
      flowIndex: 0,
      selectedProductId: null,
      lastCompletedTransactionNumber: null,
      isSubmitting: false,
      paymentError: null,
    });
  });
});

describe('transaction reducer', () => {
  const customer = {
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    documentId: '123456789',
    paymentToken: 'token-1',
    paymentReference: 'SC-001',
  };

  it('creates encrypted records and keeps the last ten entries', () => {
    let state = transactionReducer(
      undefined,
      transactionActions.recordTransaction({
        transactionId: 'txn-1',
        number: 'SC-001',
        itemCount: 2,
        total: 278000,
        customer,
      }),
    );

    expect(state.latest?.summary.status).toBe('pending');
    expect(state.latest?.summary.createdAt).toBe(
      state.latest?.summary.updatedAt,
    );
    expect(state.latest?.encryptedSensitiveData).toBeTruthy();
    expect(state.latest?.encryptedSensitiveData).not.toContain('Jane Doe');
    expect(
      decryptJson<typeof customer>(state.latest!.encryptedSensitiveData),
    ).toEqual(customer);

    for (let index = 2; index <= 11; index += 1) {
      state = transactionReducer(
        state,
        transactionActions.recordTransaction({
          transactionId: `txn-${index}`,
          number: `SC-${String(index).padStart(3, '0')}`,
          itemCount: index,
          total: index * 1000,
          status: 'pending',
          customer,
          createdAt: `2026-07-12T0${index % 10}:00:00.000Z`,
          updatedAt: `2026-07-12T0${index % 10}:15:00.000Z`,
        }),
      );
    }

    expect(state.history).toHaveLength(10);
    expect(state.latest?.summary.transactionId).toBe('txn-11');
    expect(state.history[0].summary.transactionId).toBe('txn-11');
    expect(state.history[9].summary.transactionId).toBe('txn-2');
  });

  it('updates the latest status, hydrates snapshots and clears data', () => {
    let state = transactionReducer(
      undefined,
      transactionActions.updateTransactionStatus({
        transactionId: 'missing',
        status: 'failed',
      }),
    );

    expect(state.latest).toBeNull();
    expect(state.hydrated).toBe(false);

    state = transactionReducer(
      state,
      transactionActions.hydrateTransactions({
        latest: {
          summary: {
            transactionId: 'txn-1',
            number: 'SC-001',
            itemCount: 1,
            total: 1000,
            status: 'pending',
            createdAt: '2026-07-12T00:00:00.000Z',
            updatedAt: '2026-07-12T00:00:00.000Z',
          },
          encryptedSensitiveData: 'cipher',
        },
        history: [],
      }),
    );

    expect(state.hydrated).toBe(true);
    expect(state.latest?.summary.status).toBe('pending');

    state = transactionReducer(
      state,
      transactionActions.updateTransactionStatus({
        transactionId: 'txn-1',
        status: 'completed',
        updatedAt: '2026-07-12T00:30:00.000Z',
      }),
    );

    expect(state.latest?.summary.status).toBe('completed');
    expect(state.latest?.summary.updatedAt).toBe('2026-07-12T00:30:00.000Z');
    expect(state.history[0].summary.status).toBe('completed');

    state = transactionReducer(
      state,
      transactionActions.transactionHistorySyncStarted(),
    );
    expect(state.remoteHistoryStatus).toBe('loading');
    expect(state.remoteHistoryError).toBeNull();

    state = transactionReducer(
      state,
      transactionActions.transactionHistorySyncSucceeded({
        transactions: [
          {
            transactionId: 'remote-1',
            number: 'SC-900',
            itemCount: 3,
            total: 3000,
            status: 'completed',
            createdAt: '2026-07-12T01:00:00.000Z',
            updatedAt: '2026-07-12T01:05:00.000Z',
          },
        ],
        syncedAt: '2026-07-12T01:10:00.000Z',
      }),
    );
    expect(state.remoteHistoryStatus).toBe('succeeded');
    expect(state.remoteHistory).toHaveLength(1);
    expect(state.remoteHistoryLastSyncedAt).toBe('2026-07-12T01:10:00.000Z');

    state = transactionReducer(
      state,
      transactionActions.transactionHistorySyncFailed({
        error: 'No se pudo sincronizar',
      }),
    );
    expect(state.remoteHistoryStatus).toBe('failed');
    expect(state.remoteHistoryError).toBe('No se pudo sincronizar');

    state = transactionReducer(state, transactionActions.clearTransactions());
    expect(state).toEqual({
      latest: null,
      history: [],
      hydrated: true,
      remoteHistory: [],
      remoteHistoryStatus: 'idle',
      remoteHistoryError: null,
      remoteHistoryLastSyncedAt: null,
    });

    state = transactionReducer(
      state,
      transactionActions.hydrateTransactions(null),
    );
    expect(state).toEqual({
      latest: null,
      history: [],
      hydrated: true,
      remoteHistory: [],
      remoteHistoryStatus: 'idle',
      remoteHistoryError: null,
      remoteHistoryLastSyncedAt: null,
    });
  });
});
