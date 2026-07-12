import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ScreenId } from '../../types';

export type CheckoutState = {
  activeScreen: ScreenId;
  flowIndex: number;
  selectedProductId: string | null;
  lastCompletedTransactionNumber: string | null;
};

const initialState: CheckoutState = {
  activeScreen: 'home',
  flowIndex: 0,
  selectedProductId: null,
  lastCompletedTransactionNumber: null,
};

export function screenToFlowIndex(screen: ScreenId): number {
  return FLOW_INDEX_BY_SCREEN[screen];
}

const FLOW_INDEX_BY_SCREEN: Record<ScreenId, number> = {
  home: 0,
  catalog: 1,
  productDetail: 2,
  cart: 3,
  checkout: 4,
  confirmation: 5,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    navigateTo(state, action: PayloadAction<ScreenId>) {
      state.activeScreen = action.payload;
      if (action.payload !== 'productDetail') {
        state.selectedProductId = null;
      }
      state.flowIndex = screenToFlowIndex(action.payload);
    },
    openProductDetail(state, action: PayloadAction<{ productId: string }>) {
      state.activeScreen = 'productDetail';
      state.selectedProductId = action.payload.productId;
      state.flowIndex = screenToFlowIndex('productDetail');
    },
    checkoutCompleted(
      state,
      action: PayloadAction<{ transactionNumber: string }>,
    ) {
      state.activeScreen = 'confirmation';
      state.flowIndex = screenToFlowIndex('confirmation');
      state.selectedProductId = null;
      state.lastCompletedTransactionNumber = action.payload.transactionNumber;
    },
    checkoutReset(state) {
      state.activeScreen = 'home';
      state.flowIndex = 0;
      state.selectedProductId = null;
      state.lastCompletedTransactionNumber = null;
    },
  },
});

export const checkoutActions = checkoutSlice.actions;
export const checkoutReducer = checkoutSlice.reducer;
