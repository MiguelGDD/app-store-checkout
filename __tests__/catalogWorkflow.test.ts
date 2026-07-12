import { BackendApiError } from '../src/infrastructure/backend/backendApiClient';
import { catalogActions } from '../src/store/catalog/catalogSlice';
import { createCatalogSyncWorkflow } from '../src/store/workflows/catalogWorkflow';

describe('catalog workflow', () => {
  it('loads catalog data and maps backend products to the store format', async () => {
    const apiClient = {
      getProducts: jest.fn().mockResolvedValue([
        {
          id: 1,
          name: 'Compact bag',
          description: 'Travel friendly',
          price: 120000,
          stock: 2,
          image: null,
          createAt: '2026-07-12T00:00:00.000Z',
          updateAt: '2026-07-12T00:00:00.000Z',
        },
        {
          id: 2,
          name: 'Audio buds',
          description: 'Noise cancelling',
          price: 220000,
          stock: 7,
          image: null,
          createAt: '2026-07-12T00:00:00.000Z',
          updateAt: '2026-07-12T00:00:00.000Z',
        },
        {
          id: 3,
          name: 'Laptop sleeve',
          description: 'Protective case',
          price: 89000,
          stock: 12,
          image: null,
          createAt: '2026-07-12T00:00:00.000Z',
          updateAt: '2026-07-12T00:00:00.000Z',
        },
      ]),
    };
    const dispatch = jest.fn();
    const workflow = createCatalogSyncWorkflow(apiClient as never)();

    await workflow(dispatch, jest.fn());

    expect(dispatch.mock.calls[0][0]).toEqual(catalogActions.catalogSyncStarted());
    expect(dispatch.mock.calls[1][0].type).toBe(
      catalogActions.catalogSyncSucceeded.type,
    );
    expect(dispatch.mock.calls[1][0].payload.items).toMatchObject([
      expect.objectContaining({
        id: '1',
        badge: 'Low stock',
      }),
      expect.objectContaining({
        id: '2',
        badge: 'Featured',
      }),
      expect.objectContaining({
        id: '3',
        badge: 'New',
      }),
    ]);
  });

  it('stores a readable error when the backend call fails', async () => {
    const apiClient = {
      getProducts: jest
        .fn()
        .mockRejectedValue(new BackendApiError('Backend offline', 503)),
    };
    const dispatch = jest.fn();
    const workflow = createCatalogSyncWorkflow(apiClient as never)();

    await workflow(dispatch, jest.fn());

    expect(dispatch.mock.calls[0][0]).toEqual(catalogActions.catalogSyncStarted());
    expect(dispatch.mock.calls[1][0]).toEqual(
      catalogActions.catalogSyncFailed({
        error: 'Backend offline',
      }),
    );
  });
});
