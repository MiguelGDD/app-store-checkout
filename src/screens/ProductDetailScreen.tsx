import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing, typography } from '../theme';
import type { Product, ResponsiveLayout, ScreenId } from '../types';
import { formatCurrency } from '../utils/format';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { EmptyState } from '../components/EmptyState';
import { Pill } from '../components/Pill';
import { ProductArtwork } from '../components/ProductArtwork';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';
import { useI18n } from '../i18n';

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
  onNavigate,
  onAddToCart,
}: ProductDetailScreenProps) {
  const { t } = useI18n();

  if (!product) {
    return (
      <ScreenFrame layout={layout}>
        <EmptyState
          title={t('productDetail.missingTitle')}
          description={t('productDetail.missingDescription')}
          actionLabel={t('productDetail.missingAction')}
          onAction={() => onNavigate('catalog')}
        />
      </ScreenFrame>
    );
  }

  const actionLabel =
    quantityInCart > 0
      ? t('productDetail.addOneMore', { count: quantityInCart })
      : t('productDetail.addToCart');

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow={t('productDetail.eyebrow')}
          title={product.name}
        />

        <AppCard tone="hero" style={styles.card}>
          <ProductArtwork product={product} />
          <View style={styles.metaRow}>
            <Pill label={product.badge} tone="primary" />
            <Text style={styles.stock}>
              {t('common.inStock', { count: product.stock })}
            </Text>
          </View>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.actions}>
            <AppButton
              label={actionLabel}
              onPress={() => onAddToCart(product.id)}
              fullWidth
            />
            <AppButton
              label={
                quantityInCart > 0
                  ? t('productDetail.openCart')
                  : t('productDetail.backToCatalog')
              }
              onPress={() =>
                onNavigate(quantityInCart > 0 ? 'cart' : 'catalog')
              }
              variant="secondary"
              compact
              fullWidth
            />
          </View>
        </AppCard>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
  },
  card: {
    gap: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stock: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  price: {
    color: colors.primary,
    fontFamily: fonts.display,
    fontSize: typography.title,
    fontWeight: '700',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
