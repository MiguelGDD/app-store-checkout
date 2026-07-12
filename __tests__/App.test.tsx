/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { checkoutActions } from '../src/store/checkout/checkoutSlice';
import { store } from '../src/store/store';

jest.mock('../src/store/workflows/catalogWorkflow', () => ({
  syncCatalog: jest.fn(() => () => undefined),
}));

import App from '../App';

function resetNavigation() {
  store.dispatch(checkoutActions.checkoutReset());
}

test('renders correctly on home', async () => {
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
