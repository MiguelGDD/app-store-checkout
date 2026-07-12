import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { products as demoProducts } from '../../data/demo';
import type { Product } from '../../types';

export type CatalogState = {
  items: Product[];
};

const initialState: CatalogState = {
  items: demoProducts,
};

function clampStock(stock: number) {
  return Math.max(0, stock);
}

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    replaceCatalog(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    setProductStock(
      state,
      action: PayloadAction<{ productId: string; stock: number }>,
    ) {
      const product = state.items.find((item) => item.id === action.payload.productId);

      if (!product) {
        return;
      }

      product.stock = clampStock(action.payload.stock);
    },
    adjustProductStock(
      state,
      action: PayloadAction<{ productId: string; delta: number }>,
    ) {
      const product = state.items.find((item) => item.id === action.payload.productId);

      if (!product) {
        return;
      }

      product.stock = clampStock(product.stock + action.payload.delta);
    },
  },
});

export const catalogActions = catalogSlice.actions;
export const catalogReducer = catalogSlice.reducer;
