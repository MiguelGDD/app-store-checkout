import type { ImageSourcePropType } from 'react-native';

export type LocalProductImage = {
  source: ImageSourcePropType;
  resizeMode: 'contain' | 'cover';
  scale: number;
};

const productImagesByName: Record<string, LocalProductImage> = {
  'smartphone x': {
    source: require('../../assets/products/smartphone-x.jpeg'),
    resizeMode: 'cover',
    scale: 1,
  },
  'smartwatch pro': {
    source: require('../../assets/products/smartwatch-pro.jpeg'),
    resizeMode: 'cover',
    scale: 1,
  },
  'wireless headphones': {
    source: require('../../assets/products/wireless-headphones.jpeg'),
    resizeMode: 'cover',
    scale: 1.35,
  },
};

export function resolveLocalProductImage(
  productName: string,
): LocalProductImage | null {
  return productImagesByName[productName.trim().toLowerCase()] ?? null;
}
