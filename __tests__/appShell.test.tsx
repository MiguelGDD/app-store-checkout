import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Platform, StatusBar } from 'react-native';

import App from '../App';
import { products } from '../src/data/demo';
import { checkoutActions } from '../src/store/checkout/checkoutSlice';
import { cartActions } from '../src/store/cart/cartSlice';
import { catalogActions } from '../src/store/catalog/catalogSlice';
import { transactionActions } from '../src/store/transaction/transactionSlice';
import { store } from '../src/store/store';
import { createResponsiveLayout, useResponsiveLayout } from '../src/utils/responsive';
import {
  loadEncryptedTransactionSnapshot,
  saveEncryptedTransactionSnapshot,
} from '../src/store/transactionStorage';
import { syncCatalog } from '../src/store/workflows/catalogWorkflow';
import { submitCheckout } from '../src/store/workflows/checkoutWorkflow';
import { syncTransactionHistory } from '../src/store/workflows/transactionHistoryWorkflow';

let mockHomeProps: any;
let mockCatalogProps: any;
let mockProductDetailProps: any;
let mockCartProps: any;
let mockCheckoutProps: any;
let mockHistoryProps: any;
let mockConfirmationProps: any;
let mockTabBarProps: any;

jest.mock('../src/utils/responsive', () => {
  const actual = jest.requireActual('../src/utils/responsive');

  return {
    __esModule: true,
    ...actual,
    useResponsiveLayout: jest.fn(),
  };
});

jest.mock('../src/store/transactionStorage', () => ({
  __esModule: true,
  loadEncryptedTransactionSnapshot: jest.fn(),
  saveEncryptedTransactionSnapshot: jest.fn(() => Promise.resolve()),
}));

jest.mock('../src/store/workflows/catalogWorkflow', () => ({
  __esModule: true,
  syncCatalog: jest.fn(() => () => undefined),
}));

jest.mock('../src/store/workflows/checkoutWorkflow', () => ({
  __esModule: true,
  submitCheckout: jest.fn(() => async () => undefined),
}));

jest.mock('../src/store/workflows/transactionHistoryWorkflow', () => ({
  __esModule: true,
  syncTransactionHistory: jest.fn(() => () => undefined),
}));

jest.mock('../src/screens/HomeScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    __esModule: true,
    HomeScreen: (props: any) => {
      mockHomeProps = props;
      return <Text testID="home-screen">home</Text>;
    },
  };
});

jest.mock('../src/screens/CatalogScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    __esModule: true,
    CatalogScreen: (props: any) => {
      mockCatalogProps = props;
      return <Text testID="catalog-screen">catalog</Text>;
    },
  };
});

jest.mock('../src/screens/ProductDetailScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    __esModule: true,
    ProductDetailScreen: (props: any) => {
      mockProductDetailProps = props;
      return <Text testID="product-detail-screen">detail</Text>;
    },
  };
});

jest.mock('../src/screens/CartScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    __esModule: true,
    CartScreen: (props: any) => {
      mockCartProps = props;
      return <Text testID="cart-screen">cart</Text>;
    },
  };
});

jest.mock('../src/screens/CheckoutScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    __esModule: true,
    CheckoutScreen: (props: any) => {
      mockCheckoutProps = props;
      return <Text testID="checkout-screen">checkout</Text>;
    },
  };
});

jest.mock('../src/screens/HistoryScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    __esModule: true,
    HistoryScreen: (props: any) => {
      mockHistoryProps = props;
      return <Text testID="history-screen">history</Text>;
    },
  };
});

jest.mock('../src/screens/ConfirmationScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    __esModule: true,
    ConfirmationScreen: (props: any) => {
      mockConfirmationProps = props;
      return <Text testID="confirmation-screen">confirmation</Text>;
    },
  };
});

jest.mock('../src/components/TabBar', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    __esModule: true,
    TabBar: (props: any) => {
      mockTabBarProps = props;
      return <Text testID="tab-bar">tabs</Text>;
    },
  };
});

const mockedUseResponsiveLayout = useResponsiveLayout as jest.MockedFunction<
  typeof useResponsiveLayout
>;
const mockedLoadEncryptedTransactionSnapshot = jest.mocked(
  loadEncryptedTransactionSnapshot,
);
const mockedSaveEncryptedTransactionSnapshot = jest.mocked(
  saveEncryptedTransactionSnapshot,
);
const mockedSyncCatalog = jest.mocked(syncCatalog);
const mockedSubmitCheckout = jest.mocked(submitCheckout);
const mockedSyncTransactionHistory = jest.mocked(syncTransactionHistory);

const compactLayout = createResponsiveLayout(375);

function resetStore() {
  ReactTestRenderer.act(() => {
    store.dispatch(cartActions.cartReset());
    store.dispatch(checkoutActions.checkoutReset());
    store.dispatch(transactionActions.clearTransactions());
    store.dispatch(catalogActions.replaceCatalog(products));
  });
}

function resetCapturedProps() {
  mockHomeProps = undefined;
  mockCatalogProps = undefined;
  mockProductDetailProps = undefined;
  mockCartProps = undefined;
  mockCheckoutProps = undefined;
  mockHistoryProps = undefined;
  mockConfirmationProps = undefined;
  mockTabBarProps = undefined;
}

async function renderApp() {
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });

  return renderer!;
}

describe('AppShell', () => {
  beforeEach(() => {
    resetStore();
    resetCapturedProps();
    mockedUseResponsiveLayout.mockReturnValue(compactLayout);
    mockedLoadEncryptedTransactionSnapshot.mockReset();
    mockedSaveEncryptedTransactionSnapshot.mockClear();
    mockedSyncCatalog.mockClear();
    mockedSubmitCheckout.mockClear();
    mockedSyncTransactionHistory.mockClear();
  });

  it('hydrates transactions, syncs the catalog and renders every branch', async () => {
    mockedLoadEncryptedTransactionSnapshot.mockResolvedValue({
      latest: {
        summary: {
          transactionId: 'txn-1',
          number: 'SC-001',
          itemCount: 1,
          total: 1000,
          status: 'completed',
          createdAt: '2026-07-12T00:00:00.000Z',
          updatedAt: '2026-07-12T00:30:00.000Z',
        },
        encryptedSensitiveData: 'cipher',
      },
      history: [],
    });

    store.dispatch(checkoutActions.navigateTo('home'));
    let renderer = await renderApp();
    expect(mockHomeProps).toBeTruthy();
    expect(mockedSyncCatalog).toHaveBeenCalled();
    expect(mockTabBarProps.activeTab).toBe('catalog');
    const homeProps = mockHomeProps;
    ReactTestRenderer.act(() => {
      homeProps.onRetryCatalogSync();
      homeProps.onNavigate('catalog');
      homeProps.onOpenProduct(products[0].id);
    });
    expect(mockedSyncCatalog).toHaveBeenCalled();
    ReactTestRenderer.act(() => {
      renderer.unmount();
    });

    resetCapturedProps();
    resetStore();
    mockedLoadEncryptedTransactionSnapshot.mockResolvedValue({
      latest: null,
      history: [],
    });
    store.dispatch(checkoutActions.navigateTo('catalog'));
    renderer = await renderApp();
    expect(mockCatalogProps).toBeTruthy();
    const catalogProps = mockCatalogProps;
    ReactTestRenderer.act(() => {
      catalogProps.onAddToCart(products[0].id);
      catalogProps.onRetryCatalogSync();
      catalogProps.onOpenProduct(products[0].id);
    });
    expect(store.getState().cart.items[products[0].id]).toBe(1);
    ReactTestRenderer.act(() => {
      renderer.unmount();
    });

    resetCapturedProps();
    resetStore();
    mockedLoadEncryptedTransactionSnapshot.mockResolvedValue({
      latest: null,
      history: [],
    });
    store.dispatch(checkoutActions.openProductDetail({ productId: products[0].id }));
    renderer = await renderApp();
    expect(mockProductDetailProps).toBeTruthy();
    const productDetailProps = mockProductDetailProps;
    ReactTestRenderer.act(() => {
      productDetailProps.onAddToCart(products[0].id);
      productDetailProps.onNavigate('cart');
    });
    expect(store.getState().checkout.selectedProductId).toBeNull();
    ReactTestRenderer.act(() => {
      renderer.unmount();
    });

    resetCapturedProps();
    resetStore();
    mockedLoadEncryptedTransactionSnapshot.mockResolvedValue({
      latest: null,
      history: [],
    });
    store.dispatch(cartActions.itemAdded({ productId: products[0].id }));
    store.dispatch(checkoutActions.navigateTo('cart'));
    renderer = await renderApp();
    expect(mockCartProps).toBeTruthy();
    const cartProps = mockCartProps;
    ReactTestRenderer.act(() => {
      cartProps.onIncrement(products[0].id);
      cartProps.onDecrement(products[0].id);
      cartProps.onNavigate('checkout');
    });
    expect(store.getState().checkout.activeScreen).toBe('checkout');
    ReactTestRenderer.act(() => {
      renderer.unmount();
    });

    resetCapturedProps();
    resetStore();
    mockedLoadEncryptedTransactionSnapshot.mockResolvedValue({
      latest: null,
      history: [],
    });
    store.dispatch(cartActions.itemAdded({ productId: products[0].id }));
    store.dispatch(checkoutActions.navigateTo('checkout'));
    renderer = await renderApp();
    expect(mockCheckoutProps).toBeTruthy();
    const checkoutProps = mockCheckoutProps;
    ReactTestRenderer.act(() => {
      checkoutProps.onPlaceOrder({
        number: '4242424242424242',
        expMonth: '12',
        expYear: '29',
        cvc: '123',
        cardHolder: 'Ana Perez',
      });
      checkoutProps.onNavigate('cart');
    });
    expect(mockedSubmitCheckout).toHaveBeenCalled();
    ReactTestRenderer.act(() => {
      renderer.unmount();
    });

    resetCapturedProps();
    resetStore();
    mockedLoadEncryptedTransactionSnapshot.mockResolvedValue({
      latest: null,
      history: [],
    });
    store.dispatch(checkoutActions.navigateTo('history'));
    renderer = await renderApp();
    expect(mockHistoryProps).toBeTruthy();
    const historyProps = mockHistoryProps;
    ReactTestRenderer.act(() => {
      historyProps.onRetrySync();
      historyProps.onNavigate('catalog');
    });
    expect(mockedSyncTransactionHistory).toHaveBeenCalled();
    ReactTestRenderer.act(() => {
      renderer.unmount();
    });

    resetCapturedProps();
    resetStore();
    mockedLoadEncryptedTransactionSnapshot.mockResolvedValue({
      latest: null,
      history: [],
    });
    store.dispatch(checkoutActions.navigateTo('confirmation'));
    renderer = await renderApp();
    expect(mockConfirmationProps).toBeTruthy();
    const confirmationProps = mockConfirmationProps;
    ReactTestRenderer.act(() => {
      confirmationProps.onNavigate('catalog');
    });

    expect(renderer.root.findByProps({ testID: 'tab-bar' })).toBeTruthy();
    ReactTestRenderer.act(() => {
      renderer.unmount();
    });
  });

  it('hydrates transactions when the snapshot is available', async () => {
    mockedLoadEncryptedTransactionSnapshot.mockResolvedValue({
      latest: {
        summary: {
          transactionId: 'txn-2',
          number: 'SC-002',
          itemCount: 2,
          total: 2000,
          status: 'pending',
          createdAt: '2026-07-12T00:00:00.000Z',
          updatedAt: '2026-07-12T00:00:00.000Z',
        },
        encryptedSensitiveData: 'cipher',
      },
      history: [],
    });

    const renderer = await renderApp();

    expect(store.getState().transaction.hydrated).toBe(true);
    expect(store.getState().transaction.latest?.summary.number).toBe('SC-002');
    ReactTestRenderer.act(() => {
      renderer.unmount();
    });
  });

  it('falls back to an empty transaction snapshot when hydration fails', async () => {
    mockedLoadEncryptedTransactionSnapshot.mockRejectedValue(new Error('offline'));

    const renderer = await renderApp();

    expect(store.getState().transaction.hydrated).toBe(true);
    expect(store.getState().transaction.latest).toBeNull();
    ReactTestRenderer.act(() => {
      renderer.unmount();
    });
  });

  it('ignores late hydration results after unmount', async () => {
    let resolveDeferred!: (value: {
      latest: null;
      history: [];
    }) => void;
    const deferred = new Promise<{
      latest: null;
      history: [];
    }>(resolve => {
      resolveDeferred = resolve;
    });

    mockedLoadEncryptedTransactionSnapshot.mockReturnValue(deferred as never);

    await ReactTestRenderer.act(async () => {
      store.dispatch(
        transactionActions.recordTransaction({
          transactionId: 'txn-sentinel',
          number: 'SC-999',
          itemCount: 1,
          total: 1000,
          customer: {
            customerName: 'Jane Doe',
            customerEmail: 'jane@example.com',
            documentId: '123456789',
            paymentToken: 'token-1',
            paymentReference: 'SC-999',
          },
        }),
      );
    });

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<App />);
    });

    ReactTestRenderer.act(() => {
      renderer!.unmount();
    });

    await ReactTestRenderer.act(async () => {
      resolveDeferred({ latest: null, history: [] });
      await deferred;
    });

    expect(store.getState().transaction.latest?.summary.transactionId).toBe(
      'txn-sentinel',
    );
  });

  it('ignores late rejected hydration results after unmount', async () => {
    let rejectDeferred!: (reason?: unknown) => void;
    const deferred = new Promise<never>((_, reject) => {
      rejectDeferred = reject;
    });

    mockedLoadEncryptedTransactionSnapshot.mockReturnValue(deferred as never);

    await ReactTestRenderer.act(async () => {
      store.dispatch(
        transactionActions.recordTransaction({
          transactionId: 'txn-sentinel-rejected',
          number: 'SC-998',
          itemCount: 1,
          total: 1000,
          customer: {
            customerName: 'Jane Doe',
            customerEmail: 'jane@example.com',
            documentId: '123456789',
            paymentToken: 'token-1',
            paymentReference: 'SC-998',
          },
        }),
      );
    });

    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<App />);
    });

    ReactTestRenderer.act(() => {
      renderer!.unmount();
    });

    await ReactTestRenderer.act(async () => {
      rejectDeferred(new Error('offline'));
      await deferred.catch(() => undefined);
    });

    expect(store.getState().transaction.latest?.summary.transactionId).toBe(
      'txn-sentinel-rejected',
    );
  });

  it('supports the iOS root inset branch', async () => {
    const originalOS = Platform.OS;
    (Platform as typeof Platform & { OS: string }).OS = 'ios';

    try {
      mockedLoadEncryptedTransactionSnapshot.mockResolvedValue({
        latest: null,
        history: [],
      });

      const renderer = await renderApp();

      expect(renderer.root.findByProps({ testID: 'tab-bar' })).toBeTruthy();
      ReactTestRenderer.act(() => {
        renderer.unmount();
      });
    } finally {
      (Platform as typeof Platform & { OS: string }).OS = originalOS;
    }
  });

  it('supports the status bar height branch when a value is available', async () => {
    const originalOS = Platform.OS;
    const originalHeight = StatusBar.currentHeight;
    (Platform as typeof Platform & { OS: string }).OS = 'android';
    (StatusBar as typeof StatusBar & { currentHeight?: number }).currentHeight = 24;

    try {
      mockedLoadEncryptedTransactionSnapshot.mockResolvedValue({
        latest: null,
        history: [],
      });

      const renderer = await renderApp();

      expect(renderer.root.findByProps({ testID: 'tab-bar' })).toBeTruthy();
      ReactTestRenderer.act(() => {
        renderer.unmount();
      });
    } finally {
      (Platform as typeof Platform & { OS: string }).OS = originalOS;
      (StatusBar as typeof StatusBar & { currentHeight?: number }).currentHeight =
        originalHeight;
    }
  });
});
