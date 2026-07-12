import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type {
  CatalogSource,
  CatalogStatus,
  Product,
  ResponsiveLayout,
} from '../types';
import { AppCard } from '../components/AppCard';
import { BackendSyncCard } from '../components/BackendSyncCard';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';
import { useI18n } from '../i18n';

type CatalogScreenProps = {
  layout: ResponsiveLayout;
  catalogItems: Product[];
  catalogStatus: CatalogStatus;
  catalogError: string | null;
  catalogSource: CatalogSource;
  catalogLastSyncedAt: string | null;
  cartQuantities: Record<string, number>;
  onAddToCart: (productId: string) => void;
  onOpenProduct: (productId: string) => void;
  onRetryCatalogSync: () => void;
};

export function CatalogScreen({
  layout,
  catalogItems,
  catalogStatus,
  catalogError,
  catalogSource,
  catalogLastSyncedAt,
  cartQuantities,
  onAddToCart,
  onOpenProduct,
  onRetryCatalogSync,
}: CatalogScreenProps) {
  const { t } = useI18n();
  const productCardWidth = layout.gridColumns > 1 ? '48%' : '100%';

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow={t('catalog.eyebrow')}
          title={t('catalog.title')}
          description={t('catalog.description')}
        />

        <BackendSyncCard
          status={catalogStatus}
          error={catalogError}
          source={catalogSource}
          lastSyncedAt={catalogLastSyncedAt}
          onRetry={onRetryCatalogSync}
        />

        <AppCard style={styles.noteCard}>
          <Text style={styles.noteTitle}>{t('catalog.noteTitle')}</Text>
          <Text style={styles.noteDescription}>{t('catalog.noteDescription')}</Text>
        </AppCard>

        {catalogItems.length === 0 ? (
          <EmptyState
            title={t('catalog.emptyTitle')}
            description={t('catalog.emptyDescription')}
            actionLabel={t('catalog.emptyAction')}
            onAction={onRetryCatalogSync}
          />
        ) : (
          <View style={styles.grid}>
            {catalogItems.map((product) => {
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
                    onOpenDetails={() => onOpenProduct(product.id)}
                  />
                </View>
              );
            })}
          </View>
        )}
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
