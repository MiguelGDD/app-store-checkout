import { StyleSheet, Text, View } from 'react-native';

import { flowSteps } from '../data/demo';
import { colors, spacing, typography } from '../theme';
import type { Product, ResponsiveLayout, ScreenId } from '../types';
import { formatCurrency, formatQuantity } from '../utils/format';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { EmptyState } from '../components/EmptyState';
import { FlowStepper } from '../components/FlowStepper';
import { Pill } from '../components/Pill';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';

type ProductDetailScreenProps = {
  layout: ResponsiveLayout;
  product: Product | null;
  quantityInCart: number;
  flowIndex: number;
  onNavigate: (screen: ScreenId) => void;
  onAddToCart: (productId: string) => void;
};

export function ProductDetailScreen({
  layout,
  product,
  quantityInCart,
  flowIndex,
  onNavigate,
  onAddToCart,
}: ProductDetailScreenProps) {
  if (!product) {
    return (
      <ScreenFrame layout={layout}>
        <View style={styles.stack}>
          <SectionHeader
            eyebrow="Product detail"
            title="Product not available"
            description="The selected product could not be loaded from the current catalog."
          />

          <EmptyState
            title="Missing product"
            description="Return to the catalog and open another product to continue the flow."
            actionLabel="Back to catalog"
            onAction={() => onNavigate('catalog')}
          />
        </View>
      </ScreenFrame>
    );
  }

  const actionLabel = quantityInCart > 0 ? `Add one more (${quantityInCart})` : 'Add to cart';

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow="Product detail"
          title={product.name}
          description="Inspect the product, add it to the cart and continue the checkout flow without leaving the shell."
        />

        <AppCard tone="hero" style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Pill label={product.badge} tone="primary" />
            <Pill label={`${formatQuantity(product.stock)} in stock`} tone="neutral" />
          </View>

          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.meta}>
            In cart: {formatQuantity(quantityInCart)}
          </Text>

          <View style={styles.actions}>
            <AppButton
              label={actionLabel}
              onPress={() => onAddToCart(product.id)}
              fullWidth
              compact
            />
            <AppButton
              label="Open cart"
              onPress={() => onNavigate('cart')}
              variant="secondary"
              compact
              fullWidth
            />
            <AppButton
              label="Back to catalog"
              onPress={() => onNavigate('catalog')}
              variant="ghost"
              compact
              fullWidth
            />
          </View>

          <View style={[styles.accentBar, { backgroundColor: product.accent }]} />
        </AppCard>

        <AppCard style={styles.flowCard}>
          <Text style={styles.sectionLabel}>Flow progress</Text>
          <FlowStepper steps={flowSteps} activeIndex={flowIndex} />
        </AppCard>

        <AppCard style={styles.noteCard}>
          <Text style={styles.noteTitle}>Why this screen exists</Text>
          <Text style={styles.noteText}>
            The detail view gives the reviewer a place to inspect the selected
            product before moving it into cart review and checkout.
          </Text>
        </AppCard>
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
  price: {
    color: colors.text,
    fontSize: typography.hero,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  meta: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  accentBar: {
    height: 3,
    width: '100%',
    marginTop: spacing.xs,
    borderRadius: 999,
  },
  flowCard: {
    gap: spacing.md,
  },
  sectionLabel: {
    color: colors.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: typography.micro,
    fontWeight: '800',
  },
  noteCard: {
    gap: spacing.sm,
  },
  noteTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  noteText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
});
