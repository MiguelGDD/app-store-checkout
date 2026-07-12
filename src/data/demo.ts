import { colors } from '../theme';
import type { FlowStep, Metric, Product } from '../types';

export const products: Product[] = [
  {
    id: 'adaptive-bag',
    name: 'Adaptive bag',
    description: 'Carry-on ready with padded sections and a weather-resistant shell.',
    price: 189000,
    stock: 7,
    badge: 'Featured',
    accent: colors.primary,
  },
  {
    id: 'travel-pouch',
    name: 'Travel pouch',
    description: 'Compact organizer for cables, cards and the tiny stuff that gets lost.',
    price: 98000,
    stock: 12,
    badge: 'New',
    accent: colors.secondary,
  },
  {
    id: 'noise-buds',
    name: 'Noise buds',
    description: 'Lightweight buds with a calm profile for long work sessions.',
    price: 242000,
    stock: 5,
    badge: 'Hot',
    accent: colors.info,
  },
  {
    id: 'laptop-sleeve',
    name: 'Laptop sleeve',
    description: 'Soft lined sleeve sized for daily carry and quick checks.',
    price: 132000,
    stock: 9,
    badge: 'Core',
    accent: colors.warning,
  },
  {
    id: 'daily-tote',
    name: 'Daily tote',
    description: 'Minimal tote with reinforced handles and a clean profile.',
    price: 89000,
    stock: 14,
    badge: 'Top pick',
    accent: colors.success,
  },
];

export const metrics: Metric[] = [
  {
    label: 'Screens',
    value: '5',
    description: 'Home, catalog, cart, checkout and confirmation.',
  },
  {
    label: 'State',
    value: 'Redux ready',
    description: 'Slices and secure transaction storage are now wired in.',
  },
  {
    label: 'Layout',
    value: 'Responsive',
    description: 'Compact first and ready to scale on larger screens.',
  },
];

export const flowSteps: FlowStep[] = [
  {
    title: 'Shell',
    description: 'Open the app shell and review the responsive layout.',
  },
  {
    title: 'Catalog',
    description: 'Browse products and jump into the detail screen.',
  },
  {
    title: 'Detail',
    description: 'Inspect the selected product before adding it.',
  },
  {
    title: 'Cart',
    description: 'Inspect quantities and totals before checkout.',
  },
  {
    title: 'Checkout',
    description: 'Create the pending transaction and confirm the payment state.',
  },
  {
    title: 'Result',
    description: 'Show the final transaction outcome on the result screen.',
  },
];

export const featuredProductId = 'adaptive-bag';
