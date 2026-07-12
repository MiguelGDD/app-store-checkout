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
import { useI18n } from '../i18n';

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
  const { t } = useI18n();

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow={t('checkout.eyebrow')}
          title={t('checkout.title')}
          description={t('checkout.description')}
        />

        <AppCard style={styles.stepCard}>
          <Text style={styles.sectionLabel}>{t('common.flowProgress')}</Text>
          <FlowStepper steps={flowSteps} activeIndex={flowIndex} />
        </AppCard>

        {items.length === 0 ? (
          <EmptyState
            title={t('checkout.emptyTitle')}
            description={t('checkout.emptyDescription')}
            actionLabel={t('checkout.emptyAction')}
            onAction={() => onNavigate('cart')}
          />
        ) : (
          <View style={layout.isWide ? styles.columnsWide : styles.columnsStacked}>
            <AppCard style={styles.reviewCard}>
              <Text style={styles.sectionLabel}>{t('checkout.reviewTitle')}</Text>
              <Text style={styles.reviewTitle}>{formatQuantity(itemCount)}</Text>
              <Text style={styles.reviewDescription}>{t('checkout.reviewDescription')}</Text>
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
              <Text style={styles.sectionLabel}>{t('checkout.summaryTitle')}</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('checkout.summaryItems')}</Text>
                <Text style={styles.summaryValue}>{formatQuantity(itemCount)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('checkout.summaryPayment')}</Text>
                <Text style={styles.summaryValue}>{t('checkout.summaryPending')}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{t('common.total')}</Text>
                <Text style={styles.summaryValueStrong}>{formatCurrency(total)}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <AppButton
                label={t('checkout.placeDemoOrder')}
                onPress={onPlaceOrder}
                fullWidth
                disabled={itemCount === 0}
              />
              <AppButton
                label={t('checkout.backToCart')}
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
            <Text style={styles.orderLabel}>{t('checkout.latestOrderTitle')}</Text>
            <Text style={styles.orderTitle}>{lastOrder.number}</Text>
            <Text style={styles.orderDescription}>
              {t('checkout.latestOrderDescription', {
                count: lastOrder.itemCount,
                total: formatCurrency(lastOrder.total),
              })}
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
