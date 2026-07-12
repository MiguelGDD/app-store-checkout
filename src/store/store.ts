import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import { cartReducer } from './cart/cartSlice';
import { catalogReducer } from './catalog/catalogSlice';
import { checkoutReducer } from './checkout/checkoutSlice';
import { transactionReducer } from './transaction/transactionSlice';
import { saveEncryptedTransactionSnapshot } from './transactionStorage';

const transactionPersistenceMiddleware = createListenerMiddleware();

transactionPersistenceMiddleware.startListening({
  predicate: (_action, currentState, previousState) => {
    const current = currentState as RootState;
    const previous = previousState as RootState;

    return current.transaction !== previous.transaction;
  },
  effect: async (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;

    await saveEncryptedTransactionSnapshot({
      latest: state.transaction.latest,
      history: state.transaction.history,
    });
  },
});

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    transaction: transactionReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).prepend(transactionPersistenceMiddleware.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnValue = void> = (
  dispatch: AppDispatch,
  getState: () => RootState,
) => ReturnValue;
