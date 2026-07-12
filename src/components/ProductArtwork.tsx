import { Image, StyleSheet, Text, View } from 'react-native';

import { resolveLocalProductImage } from '../assets/productImages';
import { colors, fonts, radius } from '../theme';
import type { Product } from '../types';

type ProductArtworkProps = {
  product: Product;
  compact?: boolean;
};

export function ProductArtwork({
  product,
  compact = false,
}: ProductArtworkProps) {
  const initial = product.name.trim().charAt(0).toUpperCase();
  const localImage = resolveLocalProductImage(product.name);

  return (
    <View
      accessibilityLabel={`Imagen de ${product.name}`}
      style={[
        styles.frame,
        compact ? styles.frameCompact : styles.frameRegular,
        { backgroundColor: `${product.accent}18` },
      ]}
    >
      {localImage ? (
        <Image
          source={localImage.source}
          resizeMode={localImage.resizeMode}
          fadeDuration={0}
          accessible={false}
          style={[
            styles.image,
            localImage.scale !== 1 && {
              transform: [{ scale: localImage.scale }],
            },
          ]}
        />
      ) : (
        <>
          <View
            style={[styles.orbit, { borderColor: `${product.accent}55` }]}
          />
          <View style={[styles.tile, { backgroundColor: product.accent }]}>
            <Text style={styles.initial}>{initial}</Text>
          </View>
          <View style={[styles.dot, { backgroundColor: product.accent }]} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  frameRegular: {
    height: 150,
  },
  frameCompact: {
    height: 84,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
  },
  orbit: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 132,
    borderWidth: 1,
  },
  tile: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-7deg' }],
  },
  initial: {
    color: colors.surface,
    fontFamily: fonts.display,
    fontSize: 36,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    right: 20,
    bottom: 18,
    width: 12,
    height: 12,
    borderRadius: 12,
  },
});
