import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { OrderSummary, ResponsiveLayout, ScreenId } from '../types';
import { formatCurrency, formatQuantity } from '../utils/format';
import type { Product } from '../types';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { CartLineItem } from '../components/CartLineItem';
import { EmptyState } from '../components/EmptyState';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';

type CartItem = {
  product: Product;
  quantity: number;
};

type CartScreenProps = {
  layout: ResponsiveLayout;
  items: CartItem[];
  itemCount: number;
  total: number;
  lastOrder: OrderSummary | null;
  onNavigate: (screen: ScreenId) => void;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
};

export function CartScreen({
  layout,
  items,
  itemCount,
  total,
  lastOrder,
  onNavigate,
  onIncrement,
  onDecrement,
}: CartScreenProps) {
  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow="Cart"
          title="Review selected items"
          description="This screen stays usable on narrow devices by stacking the summary under the line items."
        />

        {items.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Browse the catalog and add a few products before moving to checkout."
            actionLabel="Open catalog"
            onAction={() => onNavigate('catalog')}
          />
        ) : (
          <>
            <AppCard style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Order summary</Text>
                <Text style={styles.summaryMeta}>{formatQuantity(itemCount)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>Included</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryValueStrong}>{formatCurrency(total)}</Text>
              </View>
              <View style={styles.summaryButtons}>
                <AppButton label="Go to checkout" onPress={() => onNavigate('checkout')} />
                <AppButton
                  label="Keep browsing"
                  onPress={() => onNavigate('catalog')}
                  variant="secondary"
                  compact
                />
              </View>
            </AppCard>

            <View style={styles.lines}>
              {items.map((item) => (
                <CartLineItem
                  key={item.product.id}
                  product={item.product}
                  quantity={item.quantity}
                  onIncrement={() => onIncrement(item.product.id)}
                  onDecrement={() => onDecrement(item.product.id)}
                />
              ))}
            </View>
          </>
        )}

        {lastOrder ? (
          <AppCard style={styles.historyCard}>
            <Text style={styles.historyLabel}>Previous order</Text>
            <Text style={styles.historyTitle}>{lastOrder.number}</Text>
            <Text style={styles.historyDescription}>
              {lastOrder.itemCount} items were confirmed for {formatCurrency(lastOrder.total)}.
            </Text>
          </AppCard>
        ) : null}
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
  },
  summaryCard: {
    gap: spacing.sm,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  summaryMeta: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  summaryValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  summaryValueStrong: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '900',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  summaryButtons: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  lines: {
    gap: spacing.md,
  },
  historyCard: {
    gap: spacing.xs,
  },
  historyLabel: {
    color: colors.textSoft,
    fontSize: typography.micro,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  historyTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  historyDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
});
