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
    value: 'Flux ready',
    description: 'Reducer-based shell prepared for Redux migration.',
  },
  {
    label: 'Layout',
    value: 'Responsive',
    description: 'Compact first and ready to scale on larger screens.',
  },
];

export const flowSteps: FlowStep[] = [
  {
    title: 'Discover',
    description: 'Open the shell, review the layout and move into the catalog.',
  },
  {
    title: 'Select',
    description: 'Add products to the cart and keep the state in sync.',
  },
  {
    title: 'Review',
    description: 'Inspect the cart, quantities and totals before checkout.',
  },
  {
    title: 'Confirm',
    description: 'Finish the flow and land on the confirmation screen.',
  },
];

export const featuredProductId = 'adaptive-bag';
