import { StyleSheet, View } from 'react-native';

import { spacing } from '../theme';
import type {
  CatalogSource,
  CatalogStatus,
  Product,
  ResponsiveLayout,
} from '../types';
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
  const showSyncState =
    catalogStatus === 'loading' || catalogStatus === 'failed';

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow={t('catalog.eyebrow')}
          title={t('catalog.title')}
          description={t('catalog.description')}
        />

        {showSyncState ? (
          <BackendSyncCard
            status={catalogStatus}
            error={catalogError}
            source={catalogSource}
            lastSyncedAt={catalogLastSyncedAt}
            onRetry={onRetryCatalogSync}
          />
        ) : null}

        {catalogItems.length === 0 ? (
          <EmptyState
            title={t('catalog.emptyTitle')}
            description={t('catalog.emptyDescription')}
            actionLabel={t('catalog.emptyAction')}
            onAction={onRetryCatalogSync}
          />
        ) : (
          <View style={styles.grid}>
            {catalogItems.map(product => (
              <View
                key={product.id}
                style={[styles.gridItem, { width: productCardWidth }]}
              >
                <ProductCard
                  product={product}
                  quantity={cartQuantities[product.id] ?? 0}
                  compact={layout.isCompact}
                  onAdd={() => onAddToCart(product.id)}
                  onOpenDetails={() => onOpenProduct(product.id)}
                />
              </View>
            ))}
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
