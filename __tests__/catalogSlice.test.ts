import { catalogActions, catalogReducer } from '../src/store/catalog/catalogSlice';
import { products as demoProducts } from '../src/data/demo';

describe('catalog slice', () => {
  it('marks the catalog as loading and clears errors', () => {
    const state = catalogReducer(
      {
        items: demoProducts,
        status: 'failed',
        error: 'Previous error',
        source: 'backend',
        lastSyncedAt: '2026-07-11T00:00:00.000Z',
      },
      catalogActions.catalogSyncStarted(),
    );

    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('stores backend products on sync success', () => {
    const state = catalogReducer(
      undefined,
      catalogActions.catalogSyncSucceeded({
        items: [
          {
            ...demoProducts[0],
            id: '10',
            stock: 4,
          },
        ],
        source: 'backend',
        lastSyncedAt: '2026-07-12T00:00:00.000Z',
      }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.status).toBe('succeeded');
    expect(state.source).toBe('backend');
    expect(state.lastSyncedAt).toBe('2026-07-12T00:00:00.000Z');
  });

  it('stores the sync error without removing the current catalog', () => {
    const state = catalogReducer(
      undefined,
      catalogActions.catalogSyncFailed({
        error: 'Connection timeout',
      }),
    );

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Connection timeout');
    expect(state.items).toHaveLength(demoProducts.length);
  });

  it('updates the stock and clamps values at zero', () => {
    const catalog = catalogReducer(
      undefined,
      catalogActions.replaceCatalog([
        {
          ...demoProducts[0],
          id: '42',
          stock: 2,
        },
      ]),
    );

    const reducedStock = catalogReducer(
      catalog,
      catalogActions.adjustProductStock({
        productId: '42',
        delta: -7,
      }),
    );

    expect(reducedStock.items[0].stock).toBe(0);

    const updatedStock = catalogReducer(
      reducedStock,
      catalogActions.setProductStock({
        productId: '42',
        stock: 9,
      }),
    );

    expect(updatedStock.items[0].stock).toBe(9);
  });

  it('ignores updates for unknown products', () => {
    const state = catalogReducer(
      undefined,
      catalogActions.setProductStock({
        productId: 'missing',
        stock: 100,
      }),
    );

    expect(state.items).toHaveLength(demoProducts.length);
  });
});
