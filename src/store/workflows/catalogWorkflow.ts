import type { AppThunk } from '../store';
import { catalogActions } from '../catalog/catalogSlice';
import {
  BackendApiError,
  backendStoreApiClient,
  type BackendStoreApiPort,
} from '../../infrastructure/backend/backendApiClient';
import { mapBackendProductsToProducts } from '../../infrastructure/backend/backendProductMapper';

function resolveCatalogSyncError(error: unknown): string {
  if (error instanceof BackendApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to sync catalog from backend.';
}

export function createCatalogSyncWorkflow(
  apiClient: BackendStoreApiPort = backendStoreApiClient,
) {
  return (): AppThunk => async (dispatch) => {
    dispatch(catalogActions.catalogSyncStarted());

    try {
      const backendProducts = await apiClient.getProducts();
      const items = mapBackendProductsToProducts(backendProducts);

      dispatch(
        catalogActions.catalogSyncSucceeded({
          items,
          source: 'backend',
        }),
      );
    } catch (error) {
      dispatch(
        catalogActions.catalogSyncFailed({
          error: resolveCatalogSyncError(error),
        }),
      );
    }
  };
}

export const syncCatalog = createCatalogSyncWorkflow();
