import { colors } from '../../theme';
import type { BackendProductDto } from './backendTypes';
import type { Product } from '../../types';

const accentPalette = [
  colors.primary,
  colors.secondary,
  colors.info,
  colors.warning,
  colors.success,
];

function resolveBadge(stock: number, index: number): string {
  if (stock <= 3) {
    return 'Low stock';
  }

  if (stock <= 8) {
    return index % 2 === 0 ? 'Hot' : 'Featured';
  }

  return index % 2 === 0 ? 'New' : 'Top pick';
}

export function mapBackendProductToProduct(
  product: BackendProductDto,
  index: number,
): Product {
  return {
    id: String(product.id),
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    badge: resolveBadge(product.stock, index),
    accent: accentPalette[index % accentPalette.length],
    imageUrl: product.image,
  };
}

export function mapBackendProductsToProducts(
  products: BackendProductDto[],
): Product[] {
  return products.map((product, index) =>
    mapBackendProductToProduct(product, index),
  );
}
