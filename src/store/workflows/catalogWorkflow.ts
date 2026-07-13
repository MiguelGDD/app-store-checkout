import type { AppThunk } from '../store';
import { catalogActions } from '../catalog/catalogSlice';
import {
  backendStoreApiClient,
  type BackendStoreApiPort,
} from '../../infrastructure/backend/backendApiClient';
import { mapBackendProductsToProducts } from '../../infrastructure/backend/backendProductMapper';
import { translate } from '../../i18n';

function resolveCatalogSyncError(): string {
  return translate('common.genericSyncError');
}

export function createCatalogSyncWorkflow(
  apiClient: Pick<BackendStoreApiPort, 'getProducts'> = backendStoreApiClient,
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
    } catch {
      dispatch(
        catalogActions.catalogSyncFailed({
          error: resolveCatalogSyncError(),
        }),
      );
    }
  };
}

export const syncCatalog = createCatalogSyncWorkflow();
