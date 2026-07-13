import { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import { TabBar } from './components/TabBar';
import { colors } from './theme';
import { ConfirmationScreen } from './screens/ConfirmationScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import type {
  CatalogSource,
  CatalogStatus,
  CardPaymentDetails,
  OrderSummary,
  Product,
  ResponsiveLayout,
  ScreenId,
  TransactionSummary,
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
  selectCheckoutIsSubmitting,
  selectCheckoutPaymentError,
  selectLatestOrderSummary,
  selectLatestTransactionStatus,
  selectSelectedProduct,
  selectTransactionHistory,
  selectTransactionHistorySyncError,
  selectTransactionHistorySyncStatus,
} from './store/selectors';
import { checkoutActions } from './store/checkout/checkoutSlice';
import { cartActions } from './store/cart/cartSlice';
import { transactionActions } from './store/transaction/transactionSlice';
import { loadEncryptedTransactionSnapshot } from './store/transactionStorage';
import { syncCatalog } from './store/workflows/catalogWorkflow';
import { submitCheckout } from './store/workflows/checkoutWorkflow';
import { syncTransactionHistory } from './store/workflows/transactionHistoryWorkflow';

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
  latestTransactionStatus: ReturnType<typeof selectLatestTransactionStatus>;
  transactionHistory: TransactionSummary[];
  transactionHistorySyncStatus: ReturnType<
    typeof selectTransactionHistorySyncStatus
  >;
  transactionHistorySyncError: string | null;
  selectedProduct: Product | null;
  selectedProductQuantity: number;
  flowIndex: number;
  isSubmitting: boolean;
  paymentError: string | null;
  navigate: (screen: ScreenId) => void;
  addToCart: (productId: string) => void;
  decrementItem: (productId: string) => void;
  openProductDetail: (productId: string) => void;
  retryCatalogSync: () => void;
  retryTransactionHistorySync: () => void;
  placeOrder: (payment: CardPaymentDetails) => void;
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
        onOpenProduct={props.openProductDetail}
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
        onOpenProduct={props.openProductDetail}
        onRetryCatalogSync={props.retryCatalogSync}
      />
    );
  }

  if (activeScreen === 'productDetail') {
    return (
      <ProductDetailScreen
        layout={props.layout}
        product={props.selectedProduct}
        quantityInCart={props.selectedProductQuantity}
        flowIndex={props.flowIndex}
        onNavigate={props.navigate}
        onAddToCart={props.addToCart}
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
        isSubmitting={props.isSubmitting}
        paymentError={props.paymentError}
        onNavigate={props.navigate}
        onPlaceOrder={props.placeOrder}
      />
    );
  }

  if (activeScreen === 'history') {
    return (
      <HistoryScreen
        layout={props.layout}
        transactions={props.transactionHistory}
        syncStatus={props.transactionHistorySyncStatus}
        syncError={props.transactionHistorySyncError}
        onNavigate={props.navigate}
        onRetrySync={props.retryTransactionHistorySync}
      />
    );
  }

  return (
    <ConfirmationScreen
      layout={props.layout}
      lastOrder={props.latestOrder}
      transactionStatus={props.latestTransactionStatus}
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
  const latestTransactionStatus = useAppSelector(selectLatestTransactionStatus);
  const transactionHistory = useAppSelector(selectTransactionHistory);
  const transactionHistorySyncStatus = useAppSelector(
    selectTransactionHistorySyncStatus,
  );
  const transactionHistorySyncError = useAppSelector(
    selectTransactionHistorySyncError,
  );
  const selectedProduct = useAppSelector(selectSelectedProduct);
  const flowIndex = useAppSelector(selectCheckoutFlowIndex);
  const isSubmitting = useAppSelector(selectCheckoutIsSubmitting);
  const paymentError = useAppSelector(selectCheckoutPaymentError);
  const selectedProductQuantity = selectedProduct
    ? cartQuantities[selectedProduct.id] ?? 0
    : 0;

  useEffect(() => {
    let cancelled = false;

    loadEncryptedTransactionSnapshot()
      .then(snapshot => {
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

  useEffect(() => {
    if (activeScreen === 'history') {
      dispatch(syncTransactionHistory());
    }
  }, [activeScreen, dispatch]);

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

  const openProductDetail = (productId: string) => {
    dispatch(checkoutActions.openProductDetail({ productId }));
  };

  const retryTransactionHistorySync = () => {
    dispatch(syncTransactionHistory());
  };

  const placeOrder = async (payment: CardPaymentDetails) => {
    await dispatch(submitCheckout(payment));
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
    latestTransactionStatus,
    transactionHistory,
    transactionHistorySyncStatus,
    transactionHistorySyncError,
    selectedProduct,
    selectedProductQuantity,
    flowIndex,
    isSubmitting,
    paymentError,
    navigate,
    addToCart,
    decrementItem,
    openProductDetail,
    retryCatalogSync,
    retryTransactionHistorySync,
    placeOrder,
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View pointerEvents="none" style={styles.backdrop}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />
      </View>
      <View style={styles.screen}>{activeScreenContent}</View>

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
    paddingTop: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  glowOne: {
    position: 'absolute',
    top: -130,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 300,
    backgroundColor: '#E2ECE5',
  },
  glowTwo: {
    position: 'absolute',
    bottom: 40,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: '#F1E2D8',
  },
  screen: {
    flex: 1,
  },
});
