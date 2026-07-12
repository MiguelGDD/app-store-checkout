import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type {
  OrderSummary,
  Product,
  ResponsiveLayout,
  ScreenId,
} from '../types';
import { formatCurrency, formatQuantity } from '../utils/format';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { CartLineItem } from '../components/CartLineItem';
import { EmptyState } from '../components/EmptyState';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';
import { useI18n } from '../i18n';

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
  onNavigate,
  onIncrement,
  onDecrement,
}: CartScreenProps) {
  const { t } = useI18n();

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow={t('cart.eyebrow')}
          title={t('cart.title')}
          description={items.length > 0 ? formatQuantity(itemCount) : undefined}
        />

        {items.length === 0 ? (
          <EmptyState
            title={t('cart.emptyTitle')}
            description={t('cart.emptyDescription')}
            actionLabel={t('cart.emptyAction')}
            onAction={() => onNavigate('catalog')}
          />
        ) : (
          <>
            <View style={styles.lines}>
              {items.map(item => (
                <CartLineItem
                  key={item.product.id}
                  product={item.product}
                  quantity={item.quantity}
                  onIncrement={() => onIncrement(item.product.id)}
                  onDecrement={() => onDecrement(item.product.id)}
                />
              ))}
            </View>

            <AppCard style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('common.subtotal')}</Text>
                <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('common.delivery')}</Text>
                <Text style={styles.summaryIncluded}>
                  {t('common.included')}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>{t('common.total')}</Text>
                <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
              </View>
              <AppButton
                label={t('cart.goToCheckout')}
                onPress={() => onNavigate('checkout')}
                fullWidth
              />
            </AppCard>
          </>
        )}
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
  },
  lines: {
    gap: spacing.sm,
  },
  summaryCard: {
    gap: spacing.md,
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
  summaryIncluded: {
    color: colors.success,
    fontSize: typography.body,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  totalLabel: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  totalValue: {
    color: colors.primary,
    fontSize: typography.subtitle,
    fontWeight: '900',
  },
});
