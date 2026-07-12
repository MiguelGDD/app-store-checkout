import { StyleSheet, Text, View } from 'react-native';

import { metrics, featuredProductId, flowSteps, products } from '../data/demo';
import { colors, spacing, typography } from '../theme';
import type { Metric, OrderSummary, ResponsiveLayout, ScreenId } from '../types';
import { formatCurrency, formatQuantity } from '../utils/format';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { FlowStepper } from '../components/FlowStepper';
import { MetricCard } from '../components/MetricCard';
import { Pill } from '../components/Pill';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';

type HomeScreenProps = {
  layout: ResponsiveLayout;
  cartCount: number;
  lastOrder: OrderSummary | null;
  flowIndex: number;
  onNavigate: (screen: ScreenId) => void;
};

export function HomeScreen({
  layout,
  cartCount,
  lastOrder,
  flowIndex,
  onNavigate,
}: HomeScreenProps) {
  const featuredProduct = products.find((product) => product.id === featuredProductId) ?? products[0];
  const metricCardWidth = layout.isWide
    ? '31%'
    : layout.isCompact
      ? '100%'
      : '48%';

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow="Task 1"
          title="App shell and navigation"
          description="This base defines the store checkout flow, the reusable layout pieces and the screen navigation that will be extended in the next tasks."
        />

        <AppCard tone="hero" style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Pill label="Shell ready" tone="primary" />
            <Text style={styles.heroCount}>{formatQuantity(cartCount)}</Text>
          </View>
          <Text style={styles.heroTitle}>Responsive checkout foundation</Text>
          <Text style={styles.heroDescription}>
            The layout stays compact on iPhone SE and opens up cleanly on larger
            screens without depending on any navigation library.
          </Text>
          <View style={styles.heroButtons}>
            <AppButton label="Open catalog" onPress={() => onNavigate('catalog')} />
            <AppButton
              label="Review cart"
              onPress={() => onNavigate('cart')}
              variant="secondary"
              compact
            />
          </View>
        </AppCard>

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
                accent={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'success'}
              />
            </View>
          ))}
        </View>

        <AppCard style={styles.featureCard}>
          <Text style={styles.sectionLabel}>Featured product</Text>
          <Text style={styles.featureTitle}>{featuredProduct.name}</Text>
          <Text style={styles.featureDescription}>{featuredProduct.description}</Text>
          <View style={styles.featureFooter}>
            <Text style={styles.featurePrice}>
              {formatCurrency(featuredProduct.price)}
            </Text>
            <Text style={styles.featureStock}>{featuredProduct.stock} items available</Text>
          </View>
        </AppCard>

        <AppCard style={styles.flowCard}>
          <Text style={styles.sectionLabel}>Flow map</Text>
          <FlowStepper steps={flowSteps} activeIndex={flowIndex} />
        </AppCard>

        {lastOrder ? (
          <AppCard style={styles.orderCard}>
            <Text style={styles.sectionLabel}>Latest order</Text>
            <Text style={styles.orderTitle}>Order {lastOrder.number}</Text>
            <Text style={styles.orderDescription}>
              {lastOrder.itemCount} items processed for {formatCurrency(lastOrder.total)}.
            </Text>
            <AppButton
              label="Open confirmation"
              onPress={() => onNavigate('confirmation')}
              variant="secondary"
              compact
            />
          </AppCard>
        ) : (
          <AppCard style={styles.orderCard}>
            <Text style={styles.sectionLabel}>Ready for task 2</Text>
            <Text style={styles.orderDescription}>
              The next branch can plug the backend contract and payment state into
              this shell without changing the screen structure.
            </Text>
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
