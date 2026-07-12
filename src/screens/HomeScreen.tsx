import { StyleSheet, Text, View } from 'react-native';

import { metrics, featuredProductId, flowSteps, products as demoProducts } from '../data/demo';
import { colors, spacing, typography } from '../theme';
import type {
  CatalogSource,
  CatalogStatus,
  Metric,
  OrderSummary,
  Product,
  ResponsiveLayout,
  ScreenId,
} from '../types';
import { formatCurrency, formatQuantity } from '../utils/format';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { BackendSyncCard } from '../components/BackendSyncCard';
import { FlowStepper } from '../components/FlowStepper';
import { MetricCard } from '../components/MetricCard';
import { Pill } from '../components/Pill';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';
import { useI18n } from '../i18n';

type HomeScreenProps = {
  layout: ResponsiveLayout;
  catalogItems: Product[];
  catalogStatus: CatalogStatus;
  catalogError: string | null;
  catalogSource: CatalogSource;
  catalogLastSyncedAt: string | null;
  cartCount: number;
  lastOrder: OrderSummary | null;
  flowIndex: number;
  onNavigate: (screen: ScreenId) => void;
  onOpenProduct: (productId: string) => void;
  onRetryCatalogSync: () => void;
};

const METRIC_ACCENTS = ['primary', 'secondary', 'success'] as const;

function getMetricCardWidth(layout: ResponsiveLayout) {
  if (layout.isWide) {
    return '31%';
  }

  if (layout.isCompact) {
    return '100%';
  }

  return '48%';
}

function getMetricAccent(index: number) {
  return METRIC_ACCENTS[index] ?? 'success';
}

export function HomeScreen({
  layout,
  catalogItems,
  catalogStatus,
  catalogError,
  catalogSource,
  catalogLastSyncedAt,
  cartCount,
  lastOrder,
  flowIndex,
  onNavigate,
  onOpenProduct,
  onRetryCatalogSync,
}: HomeScreenProps) {
  const { t } = useI18n();
  const featuredProduct =
    catalogItems.find((product) => product.id === featuredProductId) ??
    catalogItems[0] ??
    demoProducts[0];
  const metricCardWidth = getMetricCardWidth(layout);

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow={t('home.eyebrow')}
          title={t('home.title')}
          description={t('home.description')}
        />

        <AppCard tone="hero" style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Pill label={t('home.shellReady')} tone="primary" />
            <Text style={styles.heroCount}>{formatQuantity(cartCount)}</Text>
          </View>
          <Text style={styles.heroTitle}>{t('home.heroTitle')}</Text>
          <Text style={styles.heroDescription}>{t('home.heroDescription')}</Text>
          <View style={styles.heroButtons}>
            <AppButton label={t('common.openCatalog')} onPress={() => onNavigate('catalog')} />
            <AppButton
              label={t('common.reviewCart')}
              onPress={() => onNavigate('cart')}
              variant="secondary"
              compact
            />
          </View>
        </AppCard>

        <BackendSyncCard
          status={catalogStatus}
          error={catalogError}
          source={catalogSource}
          lastSyncedAt={catalogLastSyncedAt}
          onRetry={onRetryCatalogSync}
        />

        <View style={styles.metricGrid}>
          {metrics.map((metric: Metric, index) => (
            <View
              key={metric.label}
              style={[
                styles.metricItem,
                { width: metricCardWidth },
              ]}
            >
              <MetricCard
                label={metric.label}
                value={metric.value}
                description={metric.description}
                accent={getMetricAccent(index)}
              />
            </View>
          ))}
        </View>

        <AppCard style={styles.featureCard}>
          <Text style={styles.sectionLabel}>{t('common.featuredProduct')}</Text>
          <Text style={styles.featureTitle}>{featuredProduct.name}</Text>
          <Text style={styles.featureDescription}>{featuredProduct.description}</Text>
          <View style={styles.featureFooter}>
            <Text style={styles.featurePrice}>
              {formatCurrency(featuredProduct.price)}
            </Text>
            <Text style={styles.featureStock}>
              {t('home.featuredStock', { count: featuredProduct.stock })}
            </Text>
          </View>
          <View style={styles.featureActions}>
            <AppButton
              label={t('common.viewDetail')}
              onPress={() => onOpenProduct(featuredProduct.id)}
              variant="secondary"
              compact
            />
          </View>
        </AppCard>

        <AppCard style={styles.flowCard}>
          <Text style={styles.sectionLabel}>{t('common.flowMap')}</Text>
          <FlowStepper steps={flowSteps} activeIndex={flowIndex} />
        </AppCard>

        {lastOrder ? (
          <AppCard style={styles.orderCard}>
            <Text style={styles.sectionLabel}>{t('common.latestOrder')}</Text>
            <Text style={styles.orderTitle}>
              {t('common.orderNumber', { number: lastOrder.number })}
            </Text>
            <Text style={styles.orderDescription}>
              {t('common.orderItemsProcessed', {
                count: lastOrder.itemCount,
                total: formatCurrency(lastOrder.total),
              })}
            </Text>
            <AppButton
              label={t('common.openConfirmation')}
              onPress={() => onNavigate('confirmation')}
              variant="secondary"
              compact
            />
          </AppCard>
        ) : (
          <AppCard style={styles.orderCard}>
            <Text style={styles.sectionLabel}>{t('home.readyCardTitle')}</Text>
            <Text style={styles.orderDescription}>{t('home.readyCardDescription')}</Text>
          </AppCard>
        )}
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
  },
  heroCard: {
    gap: spacing.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  heroCount: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.hero,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  heroDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metricItem: {
    minWidth: 0,
  },
  featureCard: {
    gap: spacing.xs,
  },
  sectionLabel: {
    color: colors.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: typography.micro,
    fontWeight: '800',
  },
  featureTitle: {
    color: colors.text,
    fontSize: typography.title,
    lineHeight: 30,
    fontWeight: '800',
  },
  featureDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  featureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  featureActions: {
    marginTop: spacing.xs,
  },
  featurePrice: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  featureStock: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: '700',
  },
  flowCard: {
    gap: spacing.md,
  },
  orderCard: {
    gap: spacing.sm,
  },
  orderTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
    lineHeight: 26,
  },
  orderDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
});
