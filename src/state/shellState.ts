import { products } from '../data/demo';
import type { CartMap, OrderSummary, Product, ScreenId } from '../types';
import { formatOrderNumber } from '../utils/format';

export type ShellState = {
  activeScreen: ScreenId;
  cart: CartMap;
  lastOrder: OrderSummary | null;
  orderCount: number;
};

export type ShellAction =
  | { type: 'NAVIGATE'; screen: ScreenId }
  | { type: 'ADD_TO_CART'; productId: string }
  | { type: 'DECREMENT_ITEM'; productId: string }
  | { type: 'PLACE_ORDER' };

export const initialShellState: ShellState = {
  activeScreen: 'home',
  cart: {},
  lastOrder: null,
  orderCount: 0,
};

const catalogIndex = new Map(products.map((product) => [product.id, product]));

function getCartEntries(cart: CartMap): Array<{ product: Product; quantity: number }> {
  return products
    .map((product) => ({
      product,
      quantity: cart[product.id] ?? 0,
    }))
    .filter((entry) => entry.quantity > 0);
}

export function selectCartItems(
  cart: CartMap,
): Array<{ product: Product; quantity: number }> {
  return getCartEntries(cart);
}

export function selectCartCount(cart: CartMap): number {
  return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

export function selectCartTotal(cart: CartMap): number {
  return getCartEntries(cart).reduce((sum, entry) => {
    return sum + entry.product.price * entry.quantity;
  }, 0);
}

export function shellReducer(
  state: ShellState,
  action: ShellAction,
): ShellState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        activeScreen: action.screen,
      };
    case 'ADD_TO_CART': {
      const product = catalogIndex.get(action.productId);

      if (!product) {
        return state;
      }

      const currentQuantity = state.cart[action.productId] ?? 0;

      return {
        ...state,
        cart: {
          ...state.cart,
          [action.productId]: currentQuantity + 1,
        },
      };
    }
    case 'DECREMENT_ITEM': {
      const currentQuantity = state.cart[action.productId] ?? 0;

      if (currentQuantity <= 1) {
        const nextCart = { ...state.cart };
        delete nextCart[action.productId];

        return {
          ...state,
          cart: nextCart,
        };
      }

      return {
        ...state,
        cart: {
          ...state.cart,
          [action.productId]: currentQuantity - 1,
        },
      };
    }
    case 'PLACE_ORDER': {
      const entries = getCartEntries(state.cart);
      const itemCount = entries.reduce((sum, entry) => sum + entry.quantity, 0);
      const total = entries.reduce(
        (sum, entry) => sum + entry.product.price * entry.quantity,
        0,
      );

      if (itemCount === 0) {
        return {
          ...state,
          activeScreen: 'checkout',
        };
      }

      const nextOrderCount = state.orderCount + 1;

      return {
        ...state,
        activeScreen: 'confirmation',
        cart: {},
        lastOrder: {
          number: formatOrderNumber(nextOrderCount),
          itemCount,
          total,
        },
        orderCount: nextOrderCount,
      };
    }
    default:
      return state;
  }
}
