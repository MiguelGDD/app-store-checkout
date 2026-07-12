import { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { TabBar } from './components/TabBar';
import { colors } from './theme';
import { ConfirmationScreen } from './screens/ConfirmationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import type {
  CatalogSource,
  CatalogStatus,
  OrderSummary,
  Product,
  ResponsiveLayout,
  ScreenId,
} from './types';
import { useResponsiveLayout } from './utils/responsive';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  selectCatalogError,
  selectCatalogItems,
  selectCatalogLastSyncedAt,
  selectCatalogSource,
  selectCatalogStatus,
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
import { syncCatalog } from './store/workflows/catalogWorkflow';
import { submitCheckout } from './store/workflows/checkoutWorkflow';

type CartLineItem = {
  product: Product;
  quantity: number;
};

type ActiveScreenRendererProps = {
  layout: ResponsiveLayout;
  catalogItems: Product[];
  catalogStatus: CatalogStatus;
  catalogError: string | null;
  catalogSource: CatalogSource;
  catalogLastSyncedAt: string | null;
  cartItems: CartLineItem[];
  cartQuantities: Record<string, number>;
  cartCount: number;
  cartTotal: number;
  latestOrder: OrderSummary | null;
  flowIndex: number;
  navigate: (screen: ScreenId) => void;
  addToCart: (productId: string) => void;
  decrementItem: (productId: string) => void;
  retryCatalogSync: () => void;
  placeOrder: () => void;
};

function renderActiveScreen(
  activeScreen: ScreenId,
  props: ActiveScreenRendererProps,
) {
  if (activeScreen === 'home') {
    return (
      <HomeScreen
        layout={props.layout}
        catalogItems={props.catalogItems}
        catalogStatus={props.catalogStatus}
        catalogError={props.catalogError}
        catalogSource={props.catalogSource}
        catalogLastSyncedAt={props.catalogLastSyncedAt}
        cartCount={props.cartCount}
        lastOrder={props.latestOrder}
        flowIndex={props.flowIndex}
        onNavigate={props.navigate}
        onRetryCatalogSync={props.retryCatalogSync}
      />
    );
  }

  if (activeScreen === 'catalog') {
    return (
      <CatalogScreen
        layout={props.layout}
        catalogItems={props.catalogItems}
        catalogStatus={props.catalogStatus}
        catalogError={props.catalogError}
        catalogSource={props.catalogSource}
        catalogLastSyncedAt={props.catalogLastSyncedAt}
        cartQuantities={props.cartQuantities}
        onAddToCart={props.addToCart}
        onRetryCatalogSync={props.retryCatalogSync}
      />
    );
  }

  if (activeScreen === 'cart') {
    return (
      <CartScreen
        layout={props.layout}
        items={props.cartItems}
        itemCount={props.cartCount}
        total={props.cartTotal}
        lastOrder={props.latestOrder}
        onNavigate={props.navigate}
        onIncrement={props.addToCart}
        onDecrement={props.decrementItem}
      />
    );
  }

  if (activeScreen === 'checkout') {
    return (
      <CheckoutScreen
        layout={props.layout}
        items={props.cartItems}
        itemCount={props.cartCount}
        total={props.cartTotal}
        lastOrder={props.latestOrder}
        flowIndex={props.flowIndex}
        onNavigate={props.navigate}
        onPlaceOrder={props.placeOrder}
      />
    );
  }

  return (
    <ConfirmationScreen
      layout={props.layout}
      lastOrder={props.latestOrder}
      cartCount={props.cartCount}
      onNavigate={props.navigate}
    />
  );
}

export default function AppShell() {
  const dispatch = useAppDispatch();
  const layout = useResponsiveLayout();
  const activeScreen = useAppSelector(selectCheckoutActiveScreen);
  const activeTab = useAppSelector(selectActiveTab);
  const catalogItems = useAppSelector(selectCatalogItems);
  const catalogStatus = useAppSelector(selectCatalogStatus);
  const catalogError = useAppSelector(selectCatalogError);
  const catalogSource = useAppSelector(selectCatalogSource);
  const catalogLastSyncedAt = useAppSelector(selectCatalogLastSyncedAt);
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

  useEffect(() => {
    dispatch(syncCatalog());
  }, [dispatch]);

  const retryCatalogSync = () => {
    dispatch(syncCatalog());
  };

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
  const activeScreenContent = renderActiveScreen(activeScreen, {
    layout,
    catalogItems,
    catalogStatus,
    catalogError,
    catalogSource,
    catalogLastSyncedAt,
    cartItems,
    cartQuantities,
    cartCount,
    cartTotal,
    latestOrder,
    flowIndex,
    navigate,
    addToCart,
    decrementItem,
    retryCatalogSync,
    placeOrder,
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View pointerEvents="none" style={styles.backdrop}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />
        <View style={styles.glowThree} />
      </View>
      <View style={styles.screen}>
        {activeScreenContent}
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
