import { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { TabBar } from './components/TabBar';
import { colors } from './theme';
import { ConfirmationScreen } from './screens/ConfirmationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import type { ScreenId } from './types';
import { useResponsiveLayout } from './utils/responsive';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  selectActiveTab,
  selectCartCount,
  selectCartLineItems,
  selectCartQuantities,
  selectCartTotal,
  selectCheckoutActiveScreen,
  selectCheckoutFlowIndex,
  selectLatestOrderSummary,
} from './store/selectors';
import { checkoutActions } from './store/checkout/checkoutSlice';
import { cartActions } from './store/cart/cartSlice';
import { transactionActions } from './store/transaction/transactionSlice';
import { loadEncryptedTransactionSnapshot } from './store/transactionStorage';
import { submitCheckout } from './store/workflows/checkoutWorkflow';

export default function AppShell() {
  const dispatch = useAppDispatch();
  const layout = useResponsiveLayout();
  const activeScreen = useAppSelector(selectCheckoutActiveScreen);
  const activeTab = useAppSelector(selectActiveTab);
  const cartItems = useAppSelector(selectCartLineItems);
  const cartQuantities = useAppSelector(selectCartQuantities);
  const cartCount = useAppSelector(selectCartCount);
  const cartTotal = useAppSelector(selectCartTotal);
  const latestOrder = useAppSelector(selectLatestOrderSummary);
  const flowIndex = useAppSelector(selectCheckoutFlowIndex);

  useEffect(() => {
    let cancelled = false;

    loadEncryptedTransactionSnapshot()
      .then((snapshot) => {
        if (!cancelled) {
          dispatch(transactionActions.hydrateTransactions(snapshot));
        }
      })
      .catch(() => {
        if (!cancelled) {
          dispatch(transactionActions.hydrateTransactions(null));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const navigate = (screen: ScreenId) => {
    dispatch(checkoutActions.navigateTo(screen));
  };

  const addToCart = (productId: string) => {
    dispatch(cartActions.itemAdded({ productId }));
  };

  const decrementItem = (productId: string) => {
    dispatch(cartActions.itemDecremented({ productId }));
  };

  const placeOrder = () => {
    dispatch(submitCheckout());
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
        {activeScreen === 'home' ? (
          <HomeScreen
            layout={layout}
            cartCount={cartCount}
            lastOrder={latestOrder}
            flowIndex={flowIndex}
            onNavigate={navigate}
          />
        ) : null}
        {activeScreen === 'catalog' ? (
          <CatalogScreen
            layout={layout}
            cartQuantities={cartQuantities}
            onAddToCart={addToCart}
          />
        ) : null}
        {activeScreen === 'cart' ? (
          <CartScreen
            layout={layout}
            items={cartItems}
            itemCount={cartCount}
            total={cartTotal}
            lastOrder={latestOrder}
            onNavigate={navigate}
            onIncrement={addToCart}
            onDecrement={decrementItem}
          />
        ) : null}
        {activeScreen === 'checkout' ? (
          <CheckoutScreen
            layout={layout}
            items={cartItems}
            itemCount={cartCount}
            total={cartTotal}
            lastOrder={latestOrder}
            flowIndex={flowIndex}
            onNavigate={navigate}
            onPlaceOrder={placeOrder}
          />
        ) : null}
        {activeScreen === 'confirmation' ? (
          <ConfirmationScreen
            layout={layout}
            lastOrder={latestOrder}
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
