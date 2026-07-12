import { StyleSheet, Text, View } from 'react-native';

import { products } from '../data/demo';
import { colors, spacing, typography } from '../theme';
import type { ResponsiveLayout } from '../types';
import { AppCard } from '../components/AppCard';
import { ProductCard } from '../components/ProductCard';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';

type CatalogScreenProps = {
  layout: ResponsiveLayout;
  cartQuantities: Record<string, number>;
  onAddToCart: (productId: string) => void;
};

export function CatalogScreen({
  layout,
  cartQuantities,
  onAddToCart,
}: CatalogScreenProps) {
  const productCardWidth = layout.gridColumns > 1 ? '48%' : '100%';

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow="Catalog"
          title="Browse products"
          description="The grid switches between one and two columns based on the available width so the layout keeps breathing room on small screens."
        />

        <AppCard style={styles.noteCard}>
          <Text style={styles.noteTitle}>Navigation preview</Text>
          <Text style={styles.noteDescription}>
            Add products here, move into cart review, then continue to checkout
            and confirmation with the same shell.
          </Text>
        </AppCard>

        <View style={styles.grid}>
          {products.map((product) => {
            const quantity = cartQuantities[product.id] ?? 0;

            return (
              <View
                key={product.id}
                style={[styles.gridItem, { width: productCardWidth }]}
              >
                <ProductCard
                  product={product}
                  quantity={quantity}
                  compact={layout.isCompact}
                  onAdd={() => onAddToCart(product.id)}
                />
              </View>
            );
          })}
        </View>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
  },
  noteCard: {
    gap: spacing.sm,
  },
  noteTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  noteDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  gridItem: {
    minWidth: 0,
  },
});
