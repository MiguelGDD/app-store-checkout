import React from 'react';
import { Image, Platform } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { products } from '../src/data/demo';
import { AppButton } from '../src/components/AppButton';
import { CardBrandLogos } from '../src/components/CardBrandLogos';
import { CartLineItem } from '../src/components/CartLineItem';
import { Pill } from '../src/components/Pill';
import { ProductArtwork } from '../src/components/ProductArtwork';
import { ProductCard } from '../src/components/ProductCard';
import { TabBar } from '../src/components/TabBar';
import { I18nProvider, translate } from '../src/i18n';
import { HomeScreen } from '../src/screens/HomeScreen';
import { CatalogScreen } from '../src/screens/CatalogScreen';
import { CartScreen } from '../src/screens/CartScreen';
import { CheckoutScreen } from '../src/screens/CheckoutScreen';
import { ConfirmationScreen } from '../src/screens/ConfirmationScreen';
import { HistoryScreen } from '../src/screens/HistoryScreen';
import { ProductDetailScreen } from '../src/screens/ProductDetailScreen';
import { createResponsiveLayout, useResponsiveLayout } from '../src/utils/responsive';
import type {
  OrderSummary,
  Product,
  ResponsiveLayout,
} from '../src/types';

jest.mock('../src/utils/responsive', () => {
  const actual = jest.requireActual('../src/utils/responsive');

  return {
    __esModule: true,
    ...actual,
    useResponsiveLayout: jest.fn(),
  };
});

const mockedUseResponsiveLayout = useResponsiveLayout as jest.MockedFunction<
  typeof useResponsiveLayout
>;

const compactLayout = createResponsiveLayout(375);
const wideLayout = createResponsiveLayout(768);

function renderWithI18n(ui: React.ReactElement, layout: ResponsiveLayout) {
  mockedUseResponsiveLayout.mockReturnValue(layout);

  let renderer: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <I18nProvider locale="es">{ui}</I18nProvider>,
    );
  });

  return renderer!;
}

function findAppButton(
  renderer: ReactTestRenderer.ReactTestRenderer,
  label: string,
) {
  const button = renderer.root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      node.props.accessibilityLabel === label &&
      typeof node.props.onPress === 'function',
  )[0];

  expect(button).toBeTruthy();
  return button!;
}

function pressAppButton(
  renderer: ReactTestRenderer.ReactTestRenderer,
  label: string,
) {
  const button = findAppButton(renderer, label);

  ReactTestRenderer.act(() => {
    button.props.onPress();
  });
}

function createOrderSummary(): OrderSummary {
  return {
    number: 'SC-009',
    itemCount: 2,
    total: products[0].price + products[1].price,
  };
}

function renderProduct(): Product {
  return {
    ...products[0],
  };
}

describe('UI interaction coverage', () => {
  it('covers pressed and disabled button states', () => {
    const enabledRenderer = renderWithI18n(
      <AppButton label="Primario" onPress={jest.fn()} variant="primary" />,
      compactLayout,
    );
    const enabledPressable = enabledRenderer.root.findAll(
      node =>
        node.props.accessibilityRole === 'button' &&
        node.props.accessibilityLabel === 'Primario',
    )[0];
    expect(() => enabledPressable.props.style({ pressed: true })).not.toThrow();

    const disabledRenderer = renderWithI18n(
      <AppButton
        label="Deshabilitado"
        onPress={jest.fn()}
        variant="ghost"
        disabled
      />,
      compactLayout,
    );
    const disabledPressable = disabledRenderer.root.findAll(
      node =>
        node.props.accessibilityRole === 'button' &&
        node.props.accessibilityLabel === 'Deshabilitado',
    )[0];
    expect(() => disabledPressable.props.style({ pressed: true })).not.toThrow();
  });

  it('covers brand logo combinations and pill fallbacks', () => {
    expect(
      renderWithI18n(<CardBrandLogos detectedBrand="visa" />, compactLayout).toJSON(),
    ).toBeTruthy();
    expect(
      renderWithI18n(
        <CardBrandLogos detectedBrand="mastercard" />,
        compactLayout,
      ).toJSON(),
    ).toBeTruthy();
    expect(
      renderWithI18n(<CardBrandLogos detectedBrand="unknown" />, compactLayout).toJSON(),
    ).toBeTruthy();

    expect(
      renderWithI18n(
        <Pill label="Fallback" tone={'mystery' as never} />,
        compactLayout,
      ).toJSON(),
    ).toBeTruthy();

    expect(
      renderWithI18n(<Pill label="Neutral" />, compactLayout).toJSON(),
    ).toBeTruthy();
  });

  it('covers product artwork image scaling and product card detail toggles', () => {
    const scaledRenderer = renderWithI18n(
      <ProductArtwork
        product={{
          ...renderProduct(),
          id: '2',
          name: 'Wireless Headphones',
        }}
      />,
      compactLayout,
    );
    expect(scaledRenderer.root.findAllByType(Image)).toHaveLength(1);

    const withDetailsRenderer = renderWithI18n(
      <ProductCard
        product={renderProduct()}
        quantity={0}
        compact
        onAdd={jest.fn()}
        onOpenDetails={jest.fn()}
      />,
      compactLayout,
    );
    expect(withDetailsRenderer.root.findAllByType(AppButton)).toHaveLength(2);

    const withoutDetailsRenderer = renderWithI18n(
      <ProductCard
        product={renderProduct()}
        quantity={0}
        compact
        onAdd={jest.fn()}
      />,
      compactLayout,
    );
    expect(withoutDetailsRenderer.root.findAllByType(AppButton)).toHaveLength(1);
  });

  it('covers cart line item controls and tab navigation', () => {
    const onIncrement = jest.fn();
    const onDecrement = jest.fn();
    const cartLineItemRenderer = renderWithI18n(
      <CartLineItem
        product={renderProduct()}
        quantity={2}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
      compactLayout,
    );

    const decrementButton = cartLineItemRenderer.root.findByProps({
      accessibilityLabel: 'Quitar una unidad',
    });
    const incrementButton = cartLineItemRenderer.root.findByProps({
      accessibilityLabel: 'Agregar una unidad',
    });
    expect(() => decrementButton.props.style({ pressed: true })).not.toThrow();
    expect(() => incrementButton.props.style({ pressed: true })).not.toThrow();

    ReactTestRenderer.act(() => {
      decrementButton.props.onPress();
      incrementButton.props.onPress();
    });

    expect(onDecrement).toHaveBeenCalledTimes(1);
    expect(onIncrement).toHaveBeenCalledTimes(1);

    const tabNavigate = jest.fn();
    const tabRenderer = renderWithI18n(
      <TabBar activeTab="cart" cartCount={3} onNavigate={tabNavigate} />,
      compactLayout,
    );
    const tabs = tabRenderer.root.findAll(
      node => node.props.accessibilityRole === 'button',
    );
    expect(() => tabs[0]!.props.style({ pressed: true })).not.toThrow();
    ReactTestRenderer.act(() => {
      tabs[0]!.props.onPress();
    });
    expect(tabNavigate).toHaveBeenCalledWith('catalog');
  });

  it('covers home, catalog and cart screen actions', () => {
    const onNavigate = jest.fn();
    const onOpenProduct = jest.fn();
    const onRetryCatalogSync = jest.fn();

    const homeRenderer = renderWithI18n(
      <HomeScreen
        layout={wideLayout}
        catalogItems={products}
        catalogStatus="succeeded"
        catalogError={null}
        catalogSource="backend"
        catalogLastSyncedAt="2026-07-12T00:00:00.000Z"
        cartCount={2}
        lastOrder={createOrderSummary()}
        flowIndex={1}
        onNavigate={onNavigate}
        onOpenProduct={onOpenProduct}
        onRetryCatalogSync={onRetryCatalogSync}
      />,
      wideLayout,
    );
    pressAppButton(homeRenderer, translate('common.openCatalog'));
    pressAppButton(homeRenderer, translate('common.viewDetail'));
    expect(onNavigate).toHaveBeenCalledWith('catalog');
    expect(onOpenProduct).toHaveBeenCalledWith(products[0].id);

    const catalogRenderer = renderWithI18n(
      <CatalogScreen
        layout={wideLayout}
        catalogItems={[products[0]]}
        catalogStatus="failed"
        catalogError={null}
        catalogSource="backend"
        catalogLastSyncedAt={null}
        cartQuantities={{}}
        onAddToCart={jest.fn()}
        onOpenProduct={onOpenProduct}
        onRetryCatalogSync={onRetryCatalogSync}
      />,
      wideLayout,
    );
    pressAppButton(catalogRenderer, translate('backendSync.retrySync'));
    pressAppButton(catalogRenderer, translate('productCard.viewDetails'));
    pressAppButton(catalogRenderer, translate('productCard.addToCart'));
    expect(onRetryCatalogSync).toHaveBeenCalledTimes(1);
    expect(onOpenProduct).toHaveBeenCalledWith(products[0].id);

    const onCatalogNavigate = jest.fn();
    const onIncrement = jest.fn();
    const onDecrement = jest.fn();
    const cartRenderer = renderWithI18n(
      <CartScreen
        layout={compactLayout}
        items={[
          {
            product: renderProduct(),
            quantity: 2,
          },
        ]}
        itemCount={2}
        total={products[0].price * 2}
        lastOrder={createOrderSummary()}
        onNavigate={onCatalogNavigate}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
      />,
      compactLayout,
    );
    const cartButtons = cartRenderer.root.findAllByType(AppButton);
    const checkoutButton = cartButtons.find(
      button => button.props.label === translate('cart.goToCheckout'),
    );
    expect(checkoutButton).toBeTruthy();
    ReactTestRenderer.act(() => {
      checkoutButton!.props.onPress();
    });
    const cartLineItem = cartRenderer.root.findByType(CartLineItem);
    ReactTestRenderer.act(() => {
      cartLineItem.props.onIncrement();
      cartLineItem.props.onDecrement();
    });
    expect(onCatalogNavigate).toHaveBeenCalledWith('checkout');
    expect(onIncrement).toHaveBeenCalledWith(products[0].id);
    expect(onDecrement).toHaveBeenCalledWith(products[0].id);
  });

  it('covers the home review cart action directly', () => {
    const onNavigate = jest.fn();
    const onOpenProduct = jest.fn();

    const homeRenderer = renderWithI18n(
      <HomeScreen
        layout={compactLayout}
        catalogItems={products}
        catalogStatus="succeeded"
        catalogError={null}
        catalogSource="backend"
        catalogLastSyncedAt="2026-07-12T00:00:00.000Z"
        cartCount={1}
        lastOrder={null}
        flowIndex={1}
        onNavigate={onNavigate}
        onOpenProduct={onOpenProduct}
        onRetryCatalogSync={jest.fn()}
      />,
      compactLayout,
    );

    const reviewCartButton = homeRenderer.root.findAll(
      node =>
        node.props.accessibilityRole === 'button' &&
        node.props.accessibilityLabel === translate('common.reviewCart'),
    )[0];

    expect(() => reviewCartButton.props.style({ pressed: true })).not.toThrow();

    ReactTestRenderer.act(() => {
      reviewCartButton.props.onPress();
    });

    expect(onNavigate).toHaveBeenCalledWith('cart');
  });

  it('covers empty states and wide layout fallbacks', () => {
    const onNavigate = jest.fn();
    const onOpenProduct = jest.fn();
    const onRetryCatalogSync = jest.fn();

    expect(
      renderWithI18n(
        <HomeScreen
          layout={wideLayout}
          catalogItems={[]}
          catalogStatus="failed"
          catalogError={null}
          catalogSource="demo"
          catalogLastSyncedAt={null}
          cartCount={0}
          lastOrder={null}
          flowIndex={0}
          onNavigate={onNavigate}
          onOpenProduct={onOpenProduct}
          onRetryCatalogSync={onRetryCatalogSync}
        />,
        wideLayout,
      ).toJSON(),
    ).toBeTruthy();

    const emptyCartRenderer = renderWithI18n(
      <CartScreen
        layout={wideLayout}
        items={[]}
        itemCount={0}
        total={0}
        lastOrder={null}
        onNavigate={onNavigate}
        onIncrement={jest.fn()}
        onDecrement={jest.fn()}
      />,
      wideLayout,
    );
    pressAppButton(emptyCartRenderer, translate('cart.emptyAction'));
    expect(onNavigate).toHaveBeenCalledWith('catalog');

    const wideTabsRenderer = renderWithI18n(
      <TabBar activeTab="history" cartCount={0} onNavigate={onNavigate} />,
      wideLayout,
    );
    expect(wideTabsRenderer.toJSON()).toBeTruthy();
  });

  it('covers checkout, confirmation, history and product detail screen actions', () => {
    const onNavigate = jest.fn();
    const onPlaceOrder = jest.fn();

    const emptyCheckoutRenderer = renderWithI18n(
      <CheckoutScreen
        layout={compactLayout}
        items={[]}
        itemCount={0}
        total={0}
        lastOrder={null}
        flowIndex={4}
        isSubmitting={false}
        paymentError={null}
        onNavigate={onNavigate}
        onPlaceOrder={onPlaceOrder}
      />,
      compactLayout,
    );
    pressAppButton(emptyCheckoutRenderer, translate('checkout.emptyAction'));
    expect(onNavigate).toHaveBeenCalledWith('cart');

    const populatedCheckoutRenderer = renderWithI18n(
      <CheckoutScreen
        layout={wideLayout}
        items={[
          {
            product: renderProduct(),
            quantity: 1,
          },
        ]}
        itemCount={1}
        total={products[0].price}
        lastOrder={createOrderSummary()}
        flowIndex={4}
        isSubmitting={false}
        paymentError={null}
        onNavigate={onNavigate}
        onPlaceOrder={onPlaceOrder}
      />,
      wideLayout,
    );
    pressAppButton(
      populatedCheckoutRenderer,
      translate('checkout.payWithCreditCard'),
    );
    pressAppButton(populatedCheckoutRenderer, translate('checkout.backToCart'));
    const closeButton = populatedCheckoutRenderer.root.findByProps({
      testID: 'close-card-payment',
    });
    ReactTestRenderer.act(() => {
      closeButton.props.onPress();
    });
    expect(() =>
      populatedCheckoutRenderer.root.findByProps({
        testID: 'close-card-payment',
      }),
    ).toThrow();

    const onConfirmationNavigate = jest.fn();
    const confirmationRenderer = renderWithI18n(
      <ConfirmationScreen
        layout={compactLayout}
        lastOrder={createOrderSummary()}
        transactionStatus="completed"
        cartCount={1}
        onNavigate={onConfirmationNavigate}
      />,
      compactLayout,
    );
    pressAppButton(confirmationRenderer, translate('confirmation.backToHome'));
    expect(onConfirmationNavigate).toHaveBeenCalledWith('catalog');

    const failedConfirmationRenderer = renderWithI18n(
      <ConfirmationScreen
        layout={wideLayout}
        lastOrder={createOrderSummary()}
        transactionStatus="failed"
        cartCount={1}
        onNavigate={onConfirmationNavigate}
      />,
      wideLayout,
    );
    expect(failedConfirmationRenderer.toJSON()).toBeTruthy();

    const emptyConfirmationRenderer = renderWithI18n(
      <ConfirmationScreen
        layout={compactLayout}
        lastOrder={null}
        transactionStatus={null}
        cartCount={0}
        onNavigate={onConfirmationNavigate}
      />,
      compactLayout,
    );
    expect(emptyConfirmationRenderer.toJSON()).toBeTruthy();

    const historyNavigate = jest.fn();
    const retrySync = jest.fn();
    const errorHistoryRenderer = renderWithI18n(
      <HistoryScreen
        layout={wideLayout}
        transactions={[]}
        syncStatus="failed"
        syncError={null}
        onNavigate={historyNavigate}
        onRetrySync={retrySync}
      />,
      wideLayout,
    );
    pressAppButton(errorHistoryRenderer, translate('common.retrySync'));
    expect(retrySync).toHaveBeenCalledTimes(1);

    const emptyHistoryRenderer = renderWithI18n(
      <HistoryScreen
        layout={compactLayout}
        transactions={[]}
        syncStatus="succeeded"
        syncError={null}
        onNavigate={historyNavigate}
        onRetrySync={retrySync}
      />,
      compactLayout,
    );
    pressAppButton(emptyHistoryRenderer, translate('history.emptyAction'));
    expect(historyNavigate).toHaveBeenCalledWith('catalog');

    const productDetailNavigate = jest.fn();
    const addToCart = jest.fn();
    const missingProductRenderer = renderWithI18n(
      <ProductDetailScreen
        layout={compactLayout}
        product={null}
        quantityInCart={0}
        flowIndex={2}
        onNavigate={productDetailNavigate}
        onAddToCart={addToCart}
      />,
      compactLayout,
    );
    pressAppButton(
      missingProductRenderer,
      translate('productDetail.missingAction'),
    );
    expect(productDetailNavigate).toHaveBeenCalledWith('catalog');

    const selectedProductRenderer = renderWithI18n(
      <ProductDetailScreen
        layout={wideLayout}
        product={renderProduct()}
        quantityInCart={2}
        flowIndex={2}
        onNavigate={productDetailNavigate}
        onAddToCart={addToCart}
      />,
      wideLayout,
    );
    pressAppButton(
      selectedProductRenderer,
      translate('productDetail.addOneMore', { count: 2 }),
    );
    pressAppButton(selectedProductRenderer, translate('productDetail.openCart'));
    expect(addToCart).toHaveBeenCalledWith(products[0].id);
    expect(productDetailNavigate).toHaveBeenCalledWith('cart');

    const backToCatalogRenderer = renderWithI18n(
      <ProductDetailScreen
        layout={compactLayout}
        product={renderProduct()}
        quantityInCart={0}
        flowIndex={2}
        onNavigate={productDetailNavigate}
        onAddToCart={addToCart}
      />,
      compactLayout,
    );
    pressAppButton(
      backToCatalogRenderer,
      translate('productDetail.backToCatalog'),
    );
    expect(productDetailNavigate).toHaveBeenCalledWith('catalog');
  });

  it('covers checkout form formatting, brand labels and modal branches', () => {
    const originalOS = Platform.OS;
    (Platform as typeof Platform & { OS: string }).OS = 'ios';

    try {
      const onNavigate = jest.fn();
      const onPlaceOrder = jest.fn();
      const checkoutRenderer = renderWithI18n(
        <CheckoutScreen
          layout={wideLayout}
          items={[
            {
              product: renderProduct(),
              quantity: 1,
            },
          ]}
          itemCount={1}
          total={products[0].price}
          lastOrder={createOrderSummary()}
          flowIndex={4}
          isSubmitting
          paymentError="No se pudo procesar"
          onNavigate={onNavigate}
          onPlaceOrder={onPlaceOrder}
        />,
        wideLayout,
      );

      pressAppButton(
        checkoutRenderer,
        translate('checkout.payWithCreditCard'),
      );

      const cardHolderInput = checkoutRenderer.root.findByProps({
        placeholder: 'Ana Perez',
      });
      const cardNumberInput = checkoutRenderer.root.findByProps({
        placeholder: '4242 4242 4242 4242',
      });
      const expiryInput = checkoutRenderer.root.findByProps({
        placeholder: 'MM/AA',
      });
      const cvcInput = checkoutRenderer.root.findByProps({
        placeholder: '123',
      });

      ReactTestRenderer.act(() => {
        cardHolderInput.props.onChangeText('Ana Perez');
        cardNumberInput.props.onChangeText('4242 4242 4242 4242');
        cardNumberInput.props.onChangeText('5555 5555 5555 4444');
        expiryInput.props.onChangeText('07');
        expiryInput.props.onChangeText('0730');
        cvcInput.props.onChangeText('123');
      });

      const submitButton = checkoutRenderer.root.findByProps({
        testID: 'submit-card-payment',
      });
      expect(submitButton.props.label).toBe(translate('checkout.processing'));

      const closeButton = checkoutRenderer.root.findByProps({
        testID: 'close-card-payment',
      });
      ReactTestRenderer.act(() => {
        closeButton.props.onPress();
      });

      expect(
        checkoutRenderer.root.findByProps({ testID: 'close-card-payment' }),
      ).toBeTruthy();
      expect(onNavigate).not.toHaveBeenCalledWith('cart');
      expect(onPlaceOrder).not.toHaveBeenCalled();
    } finally {
      (Platform as typeof Platform & { OS: string }).OS = originalOS;
    }
  });

  it('covers the android checkout modal branch', () => {
    const originalOS = Platform.OS;
    (Platform as typeof Platform & { OS: string }).OS = 'android';

    try {
      const androidCheckoutRenderer = renderWithI18n(
        <CheckoutScreen
          layout={compactLayout}
          items={[
            {
              product: renderProduct(),
              quantity: 1,
            },
          ]}
          itemCount={1}
          total={products[0].price}
          lastOrder={createOrderSummary()}
          flowIndex={4}
          isSubmitting={false}
          paymentError={null}
          onNavigate={jest.fn()}
          onPlaceOrder={jest.fn()}
        />,
        compactLayout,
      );

      pressAppButton(
        androidCheckoutRenderer,
        translate('checkout.payWithCreditCard'),
      );

      expect(androidCheckoutRenderer.root.findByProps({ testID: 'close-card-payment' })).toBeTruthy();
    } finally {
      (Platform as typeof Platform & { OS: string }).OS = originalOS;
    }
  });
});
