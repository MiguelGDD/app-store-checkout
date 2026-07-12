import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, typography } from '../theme';
import type { Product } from '../types';
import { formatCurrency } from '../utils/format';
import { ProductArtwork } from './ProductArtwork';

type CartLineItemProps = {
  product: Product;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function CartLineItem({
  product,
  quantity,
  onIncrement,
  onDecrement,
}: CartLineItemProps) {
  return (
    <View style={styles.card}>
      <View style={styles.artwork}>
        <ProductArtwork product={product} compact />
      </View>
      <View style={styles.copy}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        <View style={styles.controls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quitar una unidad"
            onPress={onDecrement}
            style={({ pressed }) => [styles.control, pressed && styles.pressed]}
          >
            <Text style={styles.controlLabel}>-</Text>
          </Pressable>
          <Text style={styles.quantity}>{quantity}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Agregar una unidad"
            onPress={onIncrement}
            style={({ pressed }) => [
              styles.control,
              styles.controlPrimary,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.controlLabel, styles.controlLabelPrimary]}>
              +
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  artwork: {
    width: 92,
  },
  copy: {
    flex: 1,
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: typography.body,
    fontWeight: '700',
  },
  price: {
    color: colors.primary,
    fontSize: typography.small,
    fontWeight: '800',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  control: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  controlLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  controlLabelPrimary: {
    color: colors.surface,
  },
  quantity: {
    minWidth: 20,
    color: colors.text,
    textAlign: 'center',
    fontSize: typography.body,
    fontWeight: '800',
  },
});
