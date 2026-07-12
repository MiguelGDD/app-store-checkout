import React from 'react';
import { Image, TextInput } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';

import { TabBar } from '../src/components/TabBar';
import { ProductArtwork } from '../src/components/ProductArtwork';
import { products } from '../src/data/demo';
import { I18nProvider } from '../src/i18n';
import { CartScreen } from '../src/screens/CartScreen';
import { CheckoutScreen } from '../src/screens/CheckoutScreen';
import { CatalogScreen } from '../src/screens/CatalogScreen';
import { ConfirmationScreen } from '../src/screens/ConfirmationScreen';
import { HistoryScreen } from '../src/screens/HistoryScreen';
import { HomeScreen } from '../src/screens/HomeScreen';
import { ProductDetailScreen } from '../src/screens/ProductDetailScreen';
import {
  createResponsiveLayout,
  useResponsiveLayout,
} from '../src/utils/responsive';
import type {
  OrderSummary,
  Product,
  ResponsiveLayout,
  TransactionStatus,
  TransactionSummary,
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

function createTransactionSummary(
  status: TransactionStatus,
  index: number,
): TransactionSummary {
  return {
    transactionId: `txn-${index}`,
    number: `88701886-5f4e-4601-9282-5bb5089d402${index}`,
    itemCount: index,
    total: 2500000 * index,
    status,
    createdAt: `2026-07-12T0${index}:00:00.000Z`,
    updatedAt: `2026-07-12T0${index}:00:00.000Z`,
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
    expect(output).toContain('Compra simple, pago seguro');
    expect(output).toContain('SC-009');
    expect(output).toContain('Ver productos');
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

    expect(textContent(renderer)).toContain('Compra simple, pago seguro');
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

    expect(textContent(emptyRenderer)).toContain(
      'No hay productos disponibles',
    );

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
    expect(output).toContain('Agregar (2)');
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
    expect(output).toContain('Subtotal');
    expect(output).toContain('Ir al pago');
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
        isSubmitting={false}
        paymentError={null}
        onNavigate={jest.fn()}
        onPlaceOrder={jest.fn()}
      />,
      compactLayout,
    );

    expect(textContent(emptyRenderer)).toContain(
      'Aun no hay nada por confirmar',
    );

    const onPlaceOrder = jest.fn();
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
        isSubmitting={false}
        paymentError={null}
        onNavigate={jest.fn()}
        onPlaceOrder={onPlaceOrder}
      />,
      wideLayout,
    );

    let output = textContent(populatedRenderer);
    expect(output).toContain('Pay with credit card');
    expect(output).toContain('VISA');
    expect(output).toContain('mastercard');
    expect(populatedRenderer.root.findAllByType(TextInput)).toHaveLength(0);

    const openPaymentButton = populatedRenderer.root.findByProps({
      testID: 'credit-card-payment-button',
    });
    ReactTestRenderer.act(() => {
      openPaymentButton.props.onPress();
    });

    output = textContent(populatedRenderer);
    expect(output).toContain('Tarjeta de credito');
    expect(output).toContain('Sandbox');

    const inputs = populatedRenderer.root.findAllByType(TextInput);
    const paymentButton = populatedRenderer.root.findByProps({
      testID: 'submit-card-payment',
    });

    ReactTestRenderer.act(() => {
      paymentButton.props.onPress();
    });
    expect(onPlaceOrder).not.toHaveBeenCalled();
    expect(textContent(populatedRenderer)).toContain(
      'Ingresa un numero VISA o Mastercard valido',
    );
    ReactTestRenderer.act(() => {
      inputs[0].props.onChangeText('Ana Perez');
      inputs[1].props.onChangeText('4242424242424242');
      inputs[2].props.onChangeText('1229');
      inputs[3].props.onChangeText('123');
    });

    expect(inputs[1].props.value).toBe('4242 4242 4242 4242');
    expect(inputs[2].props.value).toBe('12/29');
    expect(textContent(populatedRenderer)).toContain('Tarjeta VISA detectada');
    expect(paymentButton.props.disabled).toBe(false);

    ReactTestRenderer.act(() => {
      paymentButton.props.onPress();
    });
    expect(onPlaceOrder).toHaveBeenCalledTimes(1);
    expect(onPlaceOrder).toHaveBeenCalledWith({
      number: '4242424242424242',
      expMonth: '12',
      expYear: '29',
      cvc: '123',
      cardHolder: 'Ana Perez',
    });
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

  it('uses bundled product images and keeps the artwork fallback', () => {
    const localImageRenderer = renderWithI18n(
      <ProductArtwork
        product={{ ...renderProduct(), id: '1', name: 'Smartphone X' }}
      />,
      compactLayout,
    );
    expect(localImageRenderer.root.findAllByType(Image)).toHaveLength(1);

    const fallbackRenderer = renderWithI18n(
      <ProductArtwork product={renderProduct()} />,
      compactLayout,
    );
    expect(fallbackRenderer.root.findAllByType(Image)).toHaveLength(0);
    expect(textContent(fallbackRenderer)).toContain('S');
  });

  it('renders the confirmation screen for empty, pending and completed transactions', () => {
    const fullOrderId = '88701886-5f4e-4601-9282-5bb5089d402c';
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

    expect(textContent(pendingRenderer)).toContain(
      'La transaccion esta pendiente',
    );

    const completedRenderer = renderWithI18n(
      <ConfirmationScreen
        layout={wideLayout}
        lastOrder={{ ...createOrderSummary(), number: fullOrderId }}
        transactionStatus="completed"
        cartCount={2}
        onNavigate={jest.fn()}
      />,
      wideLayout,
    );

    const output = textContent(completedRenderer);
    expect(output).toContain('Pago confirmado');
    expect(output).toContain('ID de compra');
    expect(output).toContain(fullOrderId);
    expect(output).toContain('Total pagado');
    expect(output).toContain('Seguir comprando');
  });

  it('renders loading, empty and populated purchase history states', () => {
    const loadingRenderer = renderWithI18n(
      <HistoryScreen
        layout={compactLayout}
        transactions={[]}
        hydrated={false}
        onNavigate={jest.fn()}
      />,
      compactLayout,
    );

    expect(textContent(loadingRenderer)).toContain('Cargando historial');

    const emptyRenderer = renderWithI18n(
      <HistoryScreen
        layout={compactLayout}
        transactions={[]}
        hydrated
        onNavigate={jest.fn()}
      />,
      compactLayout,
    );

    expect(textContent(emptyRenderer)).toContain('Aun no tienes compras');

    const transactions = [
      createTransactionSummary('completed', 1),
      createTransactionSummary('pending', 2),
      createTransactionSummary('failed', 3),
    ];
    const populatedRenderer = renderWithI18n(
      <HistoryScreen
        layout={wideLayout}
        transactions={transactions}
        hydrated
        onNavigate={jest.fn()}
      />,
      wideLayout,
    );
    const output = textContent(populatedRenderer);

    expect(output).toContain('Historial de compras');
    expect(output).toContain(transactions[0].number);
    expect(output).toContain('Aprobada');
    expect(output).toContain('Pendiente');
    expect(output).toContain('Fallida');
    expect(output).toContain('COP');
  });

  it('renders the tab bar with an active badge when the cart has items', () => {
    const renderer = renderWithI18n(
      <TabBar activeTab="cart" cartCount={3} onNavigate={jest.fn()} />,
      compactLayout,
    );

    const output = textContent(renderer);
    expect(output).toContain('Carrito');
    expect(output).toContain('Historial');
    expect(output).toContain('3');
  });
});
