import { createSelector } from '@reduxjs/toolkit';

import type { OrderSummary, ScreenId, TabId } from '../types';
import type { RootState } from './store';
import { screenToFlowIndex } from './checkout/checkoutSlice';

export const selectCatalogItems = (state: RootState) => state.catalog.items;
export const selectCatalogStatus = (state: RootState) => state.catalog.status;
export const selectCatalogError = (state: RootState) => state.catalog.error;
export const selectCatalogSource = (state: RootState) => state.catalog.source;
export const selectCatalogLastSyncedAt = (state: RootState) =>
  state.catalog.lastSyncedAt;
export const selectCartItemsMap = (state: RootState) => state.cart.items;
export const selectCheckoutActiveScreen = (state: RootState) =>
  state.checkout.activeScreen;
export const selectCheckoutFlowIndex = (state: RootState) =>
  state.checkout.flowIndex;
export const selectActiveTab = (state: RootState): TabId =>
  state.checkout.activeScreen === 'confirmation'
    ? 'checkout'
    : state.checkout.activeScreen;
export const selectLatestTransactionRecord = (state: RootState) =>
  state.transaction.latest;
export const selectTransactionHydrated = (state: RootState) =>
  state.transaction.hydrated;

export const selectCartLineItems = createSelector(
  [selectCatalogItems, selectCartItemsMap],
  (catalogItems, cartItems) =>
    catalogItems
      .map((product) => ({
        product,
        quantity: cartItems[product.id] ?? 0,
      }))
      .filter((item) => item.quantity > 0),
);

export const selectCartCount = createSelector([selectCartItemsMap], (cartItems) =>
  Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0),
);

export const selectCartTotal = createSelector(
  [selectCatalogItems, selectCartItemsMap],
  (catalogItems, cartItems) =>
    catalogItems.reduce((sum, product) => {
      const quantity = cartItems[product.id] ?? 0;
      return sum + product.price * quantity;
    }, 0),
);

export const selectCartQuantities = selectCartItemsMap;

export const selectLatestOrderSummary = createSelector(
  [selectLatestTransactionRecord],
  (record): OrderSummary | null => {
    if (!record) {
      return null;
    }

    return {
      number: record.summary.number,
      itemCount: record.summary.itemCount,
      total: record.summary.total,
    };
  },
);

export const selectLatestTransactionId = createSelector(
  [selectLatestTransactionRecord],
  (record) => record?.summary.transactionId ?? null,
);

export const selectFlowIndexFromScreen = (screen: ScreenId) =>
  screenToFlowIndex(screen);
