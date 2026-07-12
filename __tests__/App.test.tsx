/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { checkoutActions } from '../src/store/checkout/checkoutSlice';
import { store } from '../src/store/store';
import { products } from '../src/data/demo';

jest.mock('../src/store/workflows/catalogWorkflow', () => ({
  syncCatalog: jest.fn(() => () => undefined),
}));

import App from '../App';

function resetNavigation() {
  store.dispatch(checkoutActions.checkoutReset());
}

test('renders the catalog by default', async () => {
  await ReactTestRenderer.act(async () => {
    resetNavigation();
    ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });
});

test('renders catalog screen when navigation changes', async () => {
  await ReactTestRenderer.act(async () => {
    resetNavigation();
    store.dispatch(checkoutActions.navigateTo('catalog'));
    ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });
});

test('renders product detail screen when a product is selected', async () => {
  await ReactTestRenderer.act(async () => {
    resetNavigation();
    store.dispatch(
      checkoutActions.openProductDetail({ productId: products[0].id }),
    );
    ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });
});

test('renders purchase history when navigation changes', async () => {
  await ReactTestRenderer.act(async () => {
    resetNavigation();
    store.dispatch(checkoutActions.navigateTo('history'));
    ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });
});
