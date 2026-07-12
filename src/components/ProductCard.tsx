import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { Product } from '../types';
import { formatCurrency } from '../utils/format';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { Pill } from './Pill';

type ProductCardProps = {
  product: Product;
  quantity: number;
  compact: boolean;
  onAdd: () => void;
};

export function ProductCard({
  product,
  quantity,
  compact,
  onAdd,
}: ProductCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.header}>
        <Pill label={product.badge} tone="primary" />
        <Text style={styles.stock}>{product.stock} in stock</Text>
      </View>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <View style={compact ? styles.footerStacked : styles.footerRow}>
        <View style={styles.priceBlock}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        </View>
        <AppButton
          compact
          fullWidth={compact}
          label={quantity > 0 ? `Add one more (${quantity})` : 'Add to cart'}
          onPress={onAdd}
        />
      </View>
      <View style={[styles.accentBar, { backgroundColor: product.accent }]} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    gap: spacing.sm,
  },
  header: {
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
    fontSize: typography.subtitle,
    fontWeight: '800',
    lineHeight: 26,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  footerStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  priceBlock: {
    flex: 1,
    minWidth: 0,
  },
  priceLabel: {
    color: colors.textSoft,
    fontSize: typography.micro,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    fontWeight: '800',
    marginBottom: 2,
  },
  price: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  accentBar: {
    height: 3,
    width: '100%',
    marginTop: spacing.sm,
    borderRadius: 999,
  },
});
