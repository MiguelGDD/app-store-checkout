import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ScreenId } from '../../types';

export type CheckoutState = {
  activeScreen: ScreenId;
  flowIndex: number;
  lastCompletedTransactionNumber: string | null;
};

const initialState: CheckoutState = {
  activeScreen: 'home',
  flowIndex: 0,
  lastCompletedTransactionNumber: null,
};

export function screenToFlowIndex(screen: ScreenId): number {
  return FLOW_INDEX_BY_SCREEN[screen];
}

const FLOW_INDEX_BY_SCREEN: Record<ScreenId, number> = {
  home: 0,
  catalog: 1,
  cart: 2,
  checkout: 3,
  confirmation: 3,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    navigateTo(state, action: PayloadAction<ScreenId>) {
      state.activeScreen = action.payload;
      state.flowIndex = screenToFlowIndex(action.payload);
    },
    checkoutCompleted(
      state,
      action: PayloadAction<{ transactionNumber: string }>,
    ) {
      state.activeScreen = 'confirmation';
      state.flowIndex = screenToFlowIndex('confirmation');
      state.lastCompletedTransactionNumber = action.payload.transactionNumber;
    },
    checkoutReset(state) {
      state.activeScreen = 'home';
      state.flowIndex = 0;
      state.lastCompletedTransactionNumber = null;
    },
  },
});

export const checkoutActions = checkoutSlice.actions;
export const checkoutReducer = checkoutSlice.reducer;
