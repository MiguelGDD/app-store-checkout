import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  TransactionRecord,
  TransactionSensitiveData,
  TransactionStateSnapshot,
  TransactionStatus,
  TransactionSummary,
} from '../../types';
import { encryptJson } from '../secureCodec';

export type TransactionHistorySyncStatus =
  | 'idle'
  | 'loading'
  | 'succeeded'
  | 'failed';

export type TransactionState = TransactionStateSnapshot & {
  hydrated: boolean;
  remoteHistory: TransactionSummary[];
  remoteHistoryStatus: TransactionHistorySyncStatus;
  remoteHistoryError: string | null;
  remoteHistoryLastSyncedAt: string | null;
};

export type CreateTransactionInput = {
  transactionId: string;
  number: string;
  itemCount: number;
  total: number;
  status?: TransactionStatus;
  customer: TransactionSensitiveData;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateTransactionStatusInput = {
  transactionId: string;
  status: TransactionStatus;
  updatedAt?: string;
};

const initialState: TransactionState = {
  latest: null,
  history: [],
  hydrated: false,
  remoteHistory: [],
  remoteHistoryStatus: 'idle',
  remoteHistoryError: null,
  remoteHistoryLastSyncedAt: null,
};

function createSummary(input: CreateTransactionInput): TransactionSummary {
  const createdAt = input.createdAt ?? new Date().toISOString();
  const updatedAt = input.updatedAt ?? createdAt;

  return {
    transactionId: input.transactionId,
    number: input.number,
    itemCount: input.itemCount,
    total: input.total,
    status: input.status ?? 'pending',
    createdAt,
    updatedAt,
  };
}

function recordFromInput(input: CreateTransactionInput): TransactionRecord {
  return {
    summary: createSummary(input),
    encryptedSensitiveData: encryptJson(input.customer),
  };
}

function updateLatestRecord(
  record: TransactionRecord,
  status: TransactionStatus,
  updatedAt: string,
): TransactionRecord {
  return {
    ...record,
    summary: {
      ...record.summary,
      status,
      updatedAt,
    },
  };
}

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    recordTransaction: {
      reducer(state, action: PayloadAction<TransactionRecord>) {
        state.latest = action.payload;
        state.history = [action.payload, ...state.history].slice(0, 10);
        state.hydrated = true;
      },
      prepare(input: CreateTransactionInput) {
        return { payload: recordFromInput(input) };
      },
    },
    updateTransactionStatus(
      state,
      action: PayloadAction<UpdateTransactionStatusInput>,
    ) {
      if (!state.latest) {
        return;
      }

      const updatedAt = action.payload.updatedAt ?? new Date().toISOString();
      const updatedLatest = updateLatestRecord(
        state.latest,
        action.payload.status,
        updatedAt,
      );

      state.latest = updatedLatest;
      state.history = [updatedLatest, ...state.history.slice(1)];
      state.hydrated = true;
    },
    transactionHistorySyncStarted(state) {
      state.remoteHistoryStatus = 'loading';
      state.remoteHistoryError = null;
    },
    transactionHistorySyncSucceeded(
      state,
      action: PayloadAction<{
        transactions: TransactionSummary[];
        syncedAt?: string;
      }>,
    ) {
      state.remoteHistory = action.payload.transactions;
      state.remoteHistoryStatus = 'succeeded';
      state.remoteHistoryError = null;
      state.remoteHistoryLastSyncedAt =
        action.payload.syncedAt ?? new Date().toISOString();
    },
    transactionHistorySyncFailed(
      state,
      action: PayloadAction<{ error: string }>,
    ) {
      state.remoteHistoryStatus = 'failed';
      state.remoteHistoryError = action.payload.error;
    },
    hydrateTransactions(
      state,
      action: PayloadAction<TransactionStateSnapshot | null>,
    ) {
      if (!action.payload) {
        state.latest = null;
        state.history = [];
        state.hydrated = true;
        return;
      }

      state.latest = action.payload.latest;
      state.history = action.payload.history;
      state.hydrated = true;
    },
    clearTransactions(state) {
      state.latest = null;
      state.history = [];
      state.hydrated = true;
      state.remoteHistory = [];
      state.remoteHistoryStatus = 'idle';
      state.remoteHistoryError = null;
      state.remoteHistoryLastSyncedAt = null;
    },
  },
});

export const transactionActions = transactionSlice.actions;
export const transactionReducer = transactionSlice.reducer;
