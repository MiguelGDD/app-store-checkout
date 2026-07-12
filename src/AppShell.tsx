import { useReducer } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { TabBar } from './components/TabBar';
import { colors } from './theme';
import { ConfirmationScreen } from './screens/ConfirmationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import {
  initialShellState,
  selectCartCount,
  selectCartItems,
  selectCartTotal,
  shellReducer,
} from './state/shellState';
import type { ScreenId, TabId } from './types';
import { useResponsiveLayout } from './utils/responsive';

export default function AppShell() {
  const layout = useResponsiveLayout();
  const [state, dispatch] = useReducer(shellReducer, initialShellState);

  const cartItems = selectCartItems(state.cart);
  const cartCount = selectCartCount(state.cart);
  const cartTotal = selectCartTotal(state.cart);
  const activeTab: TabId =
    state.activeScreen === 'confirmation' ? 'checkout' : state.activeScreen;

  const navigate = (screen: ScreenId) => {
    dispatch({ type: 'NAVIGATE', screen });
  };

  const addToCart = (productId: string) => {
    dispatch({ type: 'ADD_TO_CART', productId });
  };

  const decrementItem = (productId: string) => {
    dispatch({ type: 'DECREMENT_ITEM', productId });
  };

  const placeOrder = () => {
    dispatch({ type: 'PLACE_ORDER' });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View pointerEvents="none" style={styles.backdrop}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />
        <View style={styles.glowThree} />
      </View>
      <View style={styles.screen}>
        {state.activeScreen === 'home' ? (
          <HomeScreen
            layout={layout}
            cartCount={cartCount}
            lastOrder={state.lastOrder}
            onNavigate={navigate}
          />
        ) : null}
        {state.activeScreen === 'catalog' ? (
          <CatalogScreen
            layout={layout}
            cartQuantities={state.cart}
            onAddToCart={addToCart}
          />
        ) : null}
        {state.activeScreen === 'cart' ? (
          <CartScreen
            layout={layout}
            items={cartItems}
            itemCount={cartCount}
            total={cartTotal}
            lastOrder={state.lastOrder}
            onNavigate={navigate}
            onIncrement={addToCart}
            onDecrement={decrementItem}
          />
        ) : null}
        {state.activeScreen === 'checkout' ? (
          <CheckoutScreen
            layout={layout}
            items={cartItems}
            itemCount={cartCount}
            total={cartTotal}
            lastOrder={state.lastOrder}
            onNavigate={navigate}
            onPlaceOrder={placeOrder}
          />
        ) : null}
        {state.activeScreen === 'confirmation' ? (
          <ConfirmationScreen
            layout={layout}
            lastOrder={state.lastOrder}
            cartCount={cartCount}
            onNavigate={navigate}
          />
        ) : null}
      </View>

      <TabBar
        activeTab={activeTab}
        cartCount={cartCount}
        onNavigate={navigate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'ios' ? 24 : StatusBar.currentHeight ?? 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  glowOne: {
    position: 'absolute',
    top: -80,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(255, 138, 61, 0.14)',
  },
  glowTwo: {
    position: 'absolute',
    top: 100,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: 'rgba(57, 208, 179, 0.10)',
  },
  glowThree: {
    position: 'absolute',
    bottom: 50,
    left: '18%',
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(123, 167, 255, 0.12)',
  },
  screen: {
    flex: 1,
  },
});
