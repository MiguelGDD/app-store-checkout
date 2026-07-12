import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import type { Product } from '../types';
import { formatCurrency, formatQuantity } from '../utils/format';
import { useI18n } from '../i18n';
import { AppCard } from './AppCard';
import { Pill } from './Pill';

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
  const { t } = useI18n();

  return (
    <AppCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.copy}>
          <View style={styles.badgeRow}>
            <Pill label={product.badge} tone="neutral" />
            <Text style={styles.stock}>{t('cartLineItem.stock', { count: product.stock })}</Text>
          </View>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.quantity}>{formatQuantity(quantity)}</Text>
        </View>
        <View style={styles.controls}>
          <Pressable
            accessibilityRole="button"
            onPress={onDecrement}
            style={({ pressed }) => [
              styles.controlButton,
              pressed && styles.controlButtonPressed,
            ]}
          >
            <Text style={styles.controlLabel}>-</Text>
          </Pressable>
          <Text style={styles.count}>{quantity}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onIncrement}
            style={({ pressed }) => [
              styles.controlButton,
              styles.controlButtonAccent,
              pressed && styles.controlButtonPressed,
            ]}
          >
            <Text style={[styles.controlLabel, styles.controlLabelAccent]}>+</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        <View style={[styles.accentBar, { backgroundColor: product.accent }]} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  stock: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: '700',
  },
  name: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 22,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
  },
  quantity: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: '700',
    marginTop: 2,
  },
  controls: {
    width: 108,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  controlButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlButtonAccent: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryStrong,
  },
  controlButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  controlLabel: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
    marginTop: -1,
  },
  controlLabelAccent: {
    color: colors.backgroundDeep,
  },
  count: {
    minWidth: 24,
    textAlign: 'center',
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  footer: {
    gap: spacing.xs,
  },
  price: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  accentBar: {
    height: 3,
    borderRadius: 999,
  },
});
