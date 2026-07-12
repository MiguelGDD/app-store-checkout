import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ScreenId } from '../../types';

export type CheckoutState = {
  activeScreen: ScreenId;
  flowIndex: number;
  selectedProductId: string | null;
  lastCompletedTransactionNumber: string | null;
  isSubmitting: boolean;
  paymentError: string | null;
};

const initialState: CheckoutState = {
  activeScreen: 'catalog',
  flowIndex: 0,
  selectedProductId: null,
  lastCompletedTransactionNumber: null,
  isSubmitting: false,
  paymentError: null,
};

export function screenToFlowIndex(screen: ScreenId): number {
  return FLOW_INDEX_BY_SCREEN[screen];
}

const FLOW_INDEX_BY_SCREEN: Record<ScreenId, number> = {
  home: 0,
  catalog: 0,
  productDetail: 1,
  cart: 2,
  checkout: 3,
  history: 0,
  confirmation: 4,
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
      state.isSubmitting = false;
      state.paymentError = null;
    },
    checkoutPaymentStarted(state) {
      state.isSubmitting = true;
      state.paymentError = null;
    },
    checkoutPaymentFailed(state, action: PayloadAction<{ error: string }>) {
      state.isSubmitting = false;
      state.paymentError = action.payload.error;
    },
    checkoutReset(state) {
      state.activeScreen = 'catalog';
      state.flowIndex = 0;
      state.selectedProductId = null;
      state.lastCompletedTransactionNumber = null;
      state.isSubmitting = false;
      state.paymentError = null;
    },
  },
});

export const checkoutActions = checkoutSlice.actions;
export const checkoutReducer = checkoutSlice.reducer;
