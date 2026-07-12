import { StyleSheet, Text, View } from 'react-native';

import { flowSteps } from '../data/demo';
import { colors, spacing, typography } from '../theme';
import type { OrderSummary, ResponsiveLayout, ScreenId } from '../types';
import { formatCurrency, formatQuantity } from '../utils/format';
import type { Product } from '../types';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { EmptyState } from '../components/EmptyState';
import { FlowStepper } from '../components/FlowStepper';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';

type CheckoutItem = {
  product: Product;
  quantity: number;
};

type CheckoutScreenProps = {
  layout: ResponsiveLayout;
  items: CheckoutItem[];
  itemCount: number;
  total: number;
  lastOrder: OrderSummary | null;
  flowIndex: number;
  onNavigate: (screen: ScreenId) => void;
  onPlaceOrder: () => void;
};

export function CheckoutScreen({
  layout,
  items,
  itemCount,
  total,
  lastOrder,
  flowIndex,
  onNavigate,
  onPlaceOrder,
}: CheckoutScreenProps) {
  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow="Checkout"
          title="Confirm payment shell"
          description="This screen is intentionally structured for the future payment integration. The flow already knows how to land on a confirmation view."
        />

        <AppCard style={styles.stepCard}>
          <Text style={styles.sectionLabel}>Flow progress</Text>
          <FlowStepper steps={flowSteps} activeIndex={flowIndex} />
        </AppCard>

        {items.length === 0 ? (
          <EmptyState
            title="Nothing to confirm yet"
            description="Add products in the catalog and review them in the cart before you continue."
            actionLabel="Open cart"
            onAction={() => onNavigate('cart')}
          />
        ) : (
          <View style={layout.isWide ? styles.columnsWide : styles.columnsStacked}>
            <AppCard style={styles.reviewCard}>
              <Text style={styles.sectionLabel}>Review</Text>
              <Text style={styles.reviewTitle}>{formatQuantity(itemCount)}</Text>
              <Text style={styles.reviewDescription}>
                The cart data is already connected to the shell, so the backend
                and payment payload can be plugged in later without rewriting the
                navigation.
              </Text>
              <View style={styles.reviewLines}>
                {items.map((item) => (
                  <View key={item.product.id} style={styles.reviewLine}>
                    <Text style={styles.reviewLineName}>{item.product.name}</Text>
                    <Text style={styles.reviewLineValue}>
                      {formatQuantity(item.quantity)}
                    </Text>
                  </View>
                ))}
              </View>
            </AppCard>

            <AppCard style={styles.summaryCard}>
              <Text style={styles.sectionLabel}>Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Items</Text>
                <Text style={styles.summaryValue}>{formatQuantity(itemCount)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Payment</Text>
                <Text style={styles.summaryValue}>Sandbox ready</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total</Text>
                <Text style={styles.summaryValueStrong}>{formatCurrency(total)}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <AppButton
                label="Place demo order"
                onPress={onPlaceOrder}
                fullWidth
                disabled={itemCount === 0}
              />
              <AppButton
                label="Back to cart"
                onPress={() => onNavigate('cart')}
                variant="secondary"
                compact
                fullWidth
              />
            </AppCard>
          </View>
        )}

        {lastOrder ? (
          <AppCard style={styles.orderCard}>
            <Text style={styles.orderLabel}>Latest confirmed order</Text>
            <Text style={styles.orderTitle}>{lastOrder.number}</Text>
            <Text style={styles.orderDescription}>
              {lastOrder.itemCount} items for {formatCurrency(lastOrder.total)}.
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
  stepCard: {
    gap: spacing.md,
  },
  sectionLabel: {
    color: colors.textSoft,
    fontSize: typography.micro,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  columnsStacked: {
    gap: spacing.md,
  },
  columnsWide: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  reviewCard: {
    flex: 1,
    gap: spacing.sm,
  },
  reviewTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  reviewDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  reviewLines: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  reviewLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reviewLineName: {
    flex: 1,
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  reviewLineValue: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: '700',
  },
  summaryCard: {
    flex: 1,
    gap: spacing.sm,
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
  orderCard: {
    gap: spacing.xs,
  },
  orderLabel: {
    color: colors.textSoft,
    fontSize: typography.micro,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '800',
  },
  orderTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  orderDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
});
