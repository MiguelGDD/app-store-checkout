import {
  backendStoreApiClient,
  type BackendStoreApiPort,
} from '../../infrastructure/backend/backendApiClient';
import { backendConfig } from '../../infrastructure/backend/backendConfig';
import { mapBackendTransactionsToTransactionSummaries } from '../../infrastructure/backend/backendTransactionMapper';
import { translate } from '../../i18n';
import { transactionActions } from '../transaction/transactionSlice';
import type { AppThunk } from '../store';

type TransactionHistoryApiPort = Pick<BackendStoreApiPort, 'getTransactions'>;

function resolveTransactionHistorySyncError() {
  return translate('history.syncErrorDescription');
}

export function createTransactionHistoryWorkflow(
  apiClient: TransactionHistoryApiPort = backendStoreApiClient,
) {
  return (): AppThunk<Promise<void>> => async (dispatch) => {
    dispatch(transactionActions.transactionHistorySyncStarted());

    try {
      const backendTransactions = await apiClient.getTransactions();
      const customerTransactions = backendTransactions.filter(
        transaction => transaction.customer?.id === backendConfig.customerId,
      );

      dispatch(
        transactionActions.transactionHistorySyncSucceeded({
          transactions: mapBackendTransactionsToTransactionSummaries(
            customerTransactions,
          ),
        }),
      );
    } catch {
      dispatch(
        transactionActions.transactionHistorySyncFailed({
          error: resolveTransactionHistorySyncError(),
        }),
      );
    }
  };
}

export const syncTransactionHistory = createTransactionHistoryWorkflow();
