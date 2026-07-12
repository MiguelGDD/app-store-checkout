import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { products as demoProducts } from '../../data/demo';
import type { CatalogSource, CatalogStatus, Product } from '../../types';

export type CatalogState = {
  items: Product[];
  status: CatalogStatus;
  error: string | null;
  source: CatalogSource;
  lastSyncedAt: string | null;
};

const initialState: CatalogState = {
  items: demoProducts,
  status: 'idle',
  error: null,
  source: 'demo',
  lastSyncedAt: null,
};

function clampStock(stock: number) {
  return Math.max(0, stock);
}

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    catalogSyncStarted(state) {
      state.status = 'loading';
      state.error = null;
    },
    catalogSyncSucceeded(
      state,
      action: PayloadAction<{
        items: Product[];
        source?: CatalogSource;
        lastSyncedAt?: string;
      }>,
    ) {
      state.items = action.payload.items;
      state.status = 'succeeded';
      state.error = null;
      state.source = action.payload.source ?? 'backend';
      state.lastSyncedAt = action.payload.lastSyncedAt ?? new Date().toISOString();
    },
    catalogSyncFailed(state, action: PayloadAction<{ error: string }>) {
      state.status = 'failed';
      state.error = action.payload.error;
    },
    replaceCatalog(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
      state.status = 'succeeded';
      state.error = null;
      state.source = 'demo';
      state.lastSyncedAt = null;
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
