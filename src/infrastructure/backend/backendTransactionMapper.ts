import type { TransactionStatus, TransactionSummary } from '../../types';
import type {
  BackendTransactionDto,
  BackendTransactionStatus,
} from './backendTypes';

export function mapBackendTransactionStatus(
  status: BackendTransactionStatus,
): TransactionStatus {
  if (status === 'APPROVED') {
    return 'completed';
  }

  if (status === 'PENDING') {
    return 'pending';
  }

  return 'failed';
}

function calculateItemCount(transaction: BackendTransactionDto): number {
  return (
    transaction.transactionProducts?.reduce(
      (total, item) => total + item.quantity,
      0,
    ) ?? 0
  );
}

export function mapBackendTransactionToTransactionSummary(
  transaction: BackendTransactionDto,
): TransactionSummary {
  return {
    transactionId: String(transaction.id),
    number: transaction.reference,
    itemCount: calculateItemCount(transaction),
    total: transaction.totalAmount,
    status: mapBackendTransactionStatus(transaction.status),
    createdAt: transaction.createAt,
    updatedAt: transaction.updateAt,
  };
}

export function mapBackendTransactionsToTransactionSummaries(
  transactions: BackendTransactionDto[],
): TransactionSummary[] {
  return transactions.map(mapBackendTransactionToTransactionSummary);
}
