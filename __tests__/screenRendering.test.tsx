import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import { TabBar } from '../src/components/TabBar';
import { products } from '../src/data/demo';
import { I18nProvider } from '../src/i18n';
import { CartScreen } from '../src/screens/CartScreen';
import { CheckoutScreen } from '../src/screens/CheckoutScreen';
import { CatalogScreen } from '../src/screens/CatalogScreen';
import { ConfirmationScreen } from '../src/screens/ConfirmationScreen';
import { HomeScreen } from '../src/screens/HomeScreen';
import { ProductDetailScreen } from '../src/screens/ProductDetailScreen';
import { createResponsiveLayout, useResponsiveLayout } from '../src/utils/responsive';
import type { OrderSummary, Product, ResponsiveLayout } from '../src/types';

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

function textContent(renderer: ReactTestRenderer.ReactTestRenderer) {
  return JSON.stringify(renderer.toJSON());
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

describe('screen rendering', () => {
  it('renders the home screen with the ready card and latest order', () => {
    const renderer = renderWithI18n(
      <HomeScreen
        layout={compactLayout}
        catalogItems={products}
        catalogStatus="succeeded"
        catalogError={null}
        catalogSource="backend"
        catalogLastSyncedAt="2026-07-12T00:00:00.000Z"
        cartCount={3}
        lastOrder={createOrderSummary()}
        flowIndex={2}
        onNavigate={jest.fn()}
        onOpenProduct={jest.fn()}
        onRetryCatalogSync={jest.fn()}
      />,
      compactLayout,
    );

    const output = textContent(renderer);
    expect(output).toContain('Base responsive para el flujo de compra');
    expect(output).toContain('Pedido SC-009');
    expect(output).toContain('Abrir catalogo');
  });

  it('renders the home screen fallback card when there is no order', () => {
    const renderer = renderWithI18n(
      <HomeScreen
        layout={wideLayout}
        catalogItems={products}
        catalogStatus="idle"
        catalogError={null}
        catalogSource="demo"
        catalogLastSyncedAt={null}
        cartCount={0}
        lastOrder={null}
        flowIndex={0}
        onNavigate={jest.fn()}
        onOpenProduct={jest.fn()}
        onRetryCatalogSync={jest.fn()}
      />,
      wideLayout,
    );

    expect(textContent(renderer)).toContain('Listo para pagar');
  });

  it('renders the catalog screen in both empty and populated states', () => {
    const emptyRenderer = renderWithI18n(
      <CatalogScreen
        layout={wideLayout}
        catalogItems={[]}
        catalogStatus="failed"
        catalogError="No connection"
        catalogSource="backend"
        catalogLastSyncedAt={null}
        cartQuantities={{}}
        onAddToCart={jest.fn()}
        onOpenProduct={jest.fn()}
        onRetryCatalogSync={jest.fn()}
      />,
      wideLayout,
    );

    expect(textContent(emptyRenderer)).toContain('No hay productos disponibles');

    const populatedRenderer = renderWithI18n(
      <CatalogScreen
        layout={compactLayout}
        catalogItems={products.slice(0, 2)}
        catalogStatus="succeeded"
        catalogError={null}
        catalogSource="backend"
        catalogLastSyncedAt="2026-07-12T00:00:00.000Z"
        cartQuantities={{ [products[0].id]: 2 }}
        onAddToCart={jest.fn()}
        onOpenProduct={jest.fn()}
        onRetryCatalogSync={jest.fn()}
      />,
      compactLayout,
    );

    const output = textContent(populatedRenderer);
    expect(output).toContain(products[0].name);
    expect(output).toContain('Agregar uno mas (2)');
  });

  it('renders the cart screen with empty and populated content', () => {
    const emptyRenderer = renderWithI18n(
      <CartScreen
        layout={compactLayout}
        items={[]}
        itemCount={0}
        total={0}
        lastOrder={null}
        onNavigate={jest.fn()}
        onIncrement={jest.fn()}
        onDecrement={jest.fn()}
      />,
      compactLayout,
    );

    expect(textContent(emptyRenderer)).toContain('Tu carrito esta vacio');

    const populatedRenderer = renderWithI18n(
      <CartScreen
        layout={wideLayout}
        items={[
          {
            product: renderProduct(),
            quantity: 2,
          },
        ]}
        itemCount={2}
        total={products[0].price * 2}
        lastOrder={createOrderSummary()}
        onNavigate={jest.fn()}
        onIncrement={jest.fn()}
        onDecrement={jest.fn()}
      />,
      wideLayout,
    );

    const output = textContent(populatedRenderer);
    expect(output).toContain('Resumen del pedido');
    expect(output).toContain('Pedido anterior');
  });

  it('renders the checkout screen for empty and populated carts', () => {
    const emptyRenderer = renderWithI18n(
      <CheckoutScreen
        layout={compactLayout}
        items={[]}
        itemCount={0}
        total={0}
        lastOrder={null}
        flowIndex={4}
        onNavigate={jest.fn()}
        onPlaceOrder={jest.fn()}
      />,
      compactLayout,
    );

    expect(textContent(emptyRenderer)).toContain('Aun no hay nada por confirmar');

    const populatedRenderer = renderWithI18n(
      <CheckoutScreen
        layout={wideLayout}
        items={[
          {
            product: renderProduct(),
            quantity: 2,
          },
        ]}
        itemCount={2}
        total={products[0].price * 2}
        lastOrder={createOrderSummary()}
        flowIndex={4}
        onNavigate={jest.fn()}
        onPlaceOrder={jest.fn()}
      />,
      wideLayout,
    );

    const output = textContent(populatedRenderer);
    expect(output).toContain('Resumen');
    expect(output).toContain('Ultimo pedido confirmado');
  });

  it('renders the product detail screen for missing and selected products', () => {
    const missingRenderer = renderWithI18n(
      <ProductDetailScreen
        layout={compactLayout}
        product={null}
        quantityInCart={0}
        flowIndex={2}
        onNavigate={jest.fn()}
        onAddToCart={jest.fn()}
      />,
      compactLayout,
    );

    expect(textContent(missingRenderer)).toContain('Producto no disponible');

    const selectedRenderer = renderWithI18n(
      <ProductDetailScreen
        layout={wideLayout}
        product={renderProduct()}
        quantityInCart={2}
        flowIndex={2}
        onNavigate={jest.fn()}
        onAddToCart={jest.fn()}
      />,
      wideLayout,
    );

    const output = textContent(selectedRenderer);
    expect(output).toContain('Agregar uno mas (2)');
    expect(output).toContain('Abrir carrito');
  });

  it('renders the confirmation screen for empty, pending and completed transactions', () => {
    const emptyRenderer = renderWithI18n(
      <ConfirmationScreen
        layout={compactLayout}
        lastOrder={null}
        transactionStatus={null}
        cartCount={0}
        onNavigate={jest.fn()}
      />,
      compactLayout,
    );

    expect(textContent(emptyRenderer)).toContain('Todavia no hay transaccion');

    const pendingRenderer = renderWithI18n(
      <ConfirmationScreen
        layout={wideLayout}
        lastOrder={createOrderSummary()}
        transactionStatus="pending"
        cartCount={2}
        onNavigate={jest.fn()}
      />,
      wideLayout,
    );

    expect(textContent(pendingRenderer)).toContain('La transaccion esta pendiente');

    const completedRenderer = renderWithI18n(
      <ConfirmationScreen
        layout={wideLayout}
        lastOrder={createOrderSummary()}
        transactionStatus="completed"
        cartCount={2}
        onNavigate={jest.fn()}
      />,
      wideLayout,
    );

    const output = textContent(completedRenderer);
    expect(output).toContain('Pago confirmado');
    expect(output).toContain('Abrir carrito (2)');
  });

  it('renders the tab bar with an active badge when the cart has items', () => {
    const renderer = renderWithI18n(
      <TabBar activeTab="cart" cartCount={3} onNavigate={jest.fn()} />,
      compactLayout,
    );

    const output = textContent(renderer);
    expect(output).toContain('Carrito');
    expect(output).toContain('3');
  });
});
