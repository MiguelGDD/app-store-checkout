import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CartState = {
  items: Record<string, number>;
};

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    itemAdded(
      state,
      action: PayloadAction<{ productId: string; quantity?: number }>,
    ) {
      const quantity = action.payload.quantity ?? 1;
      const currentQuantity = state.items[action.payload.productId] ?? 0;
      state.items[action.payload.productId] = currentQuantity + Math.max(1, quantity);
    },
    itemDecremented(state, action: PayloadAction<{ productId: string }>) {
      const currentQuantity = state.items[action.payload.productId] ?? 0;

      if (currentQuantity <= 1) {
        delete state.items[action.payload.productId];
        return;
      }

      state.items[action.payload.productId] = currentQuantity - 1;
    },
    itemRemoved(state, action: PayloadAction<{ productId: string }>) {
      delete state.items[action.payload.productId];
    },
    cartReset(state) {
      state.items = {};
    },
  },
});

export const cartActions = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
