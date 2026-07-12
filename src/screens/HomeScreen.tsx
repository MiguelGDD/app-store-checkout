import { StyleSheet, Text, View } from 'react-native';

import { featuredProductId, products as demoProducts } from '../data/demo';
import { colors, fonts, spacing, typography } from '../theme';
import type {
  CatalogSource,
  CatalogStatus,
  OrderSummary,
  Product,
  ResponsiveLayout,
  ScreenId,
} from '../types';
import { formatCurrency, formatQuantity } from '../utils/format';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { ProductArtwork } from '../components/ProductArtwork';
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

export function HomeScreen({
  layout,
  catalogItems,
  cartCount,
  lastOrder,
  onNavigate,
  onOpenProduct,
}: HomeScreenProps) {
  const { t } = useI18n();
  const featuredProduct =
    catalogItems.find(product => product.id === featuredProductId) ??
    catalogItems[0] ??
    demoProducts[0];

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow={t('home.eyebrow')}
          title={t('home.title')}
          description={t('home.description')}
        />

        <AppCard tone="hero" style={styles.heroCard}>
          <ProductArtwork product={featuredProduct} />
          <View style={styles.heroCopy}>
            <Text style={styles.productLabel}>
              {t('common.featuredProduct')}
            </Text>
            <Text style={styles.productName}>{featuredProduct.name}</Text>
            <Text style={styles.productPrice}>
              {formatCurrency(featuredProduct.price)}
            </Text>
          </View>
          <View style={styles.actions}>
            <AppButton
              label={t('common.openCatalog')}
              onPress={() => onNavigate('catalog')}
              style={styles.action}
            />
            <AppButton
              label={t('common.viewDetail')}
              onPress={() => onOpenProduct(featuredProduct.id)}
              variant="secondary"
              compact
              style={styles.action}
            />
          </View>
        </AppCard>

        {cartCount > 0 ? (
          <AppCard style={styles.compactCard}>
            <View style={styles.compactCopy}>
              <Text style={styles.compactTitle}>{t('home.cartReady')}</Text>
              <Text style={styles.compactDescription}>
                {formatQuantity(cartCount)}
              </Text>
            </View>
            <AppButton
              label={t('common.reviewCart')}
              onPress={() => onNavigate('cart')}
              variant="secondary"
              compact
            />
          </AppCard>
        ) : null}

        {lastOrder ? (
          <View style={styles.lastOrder}>
            <Text style={styles.lastOrderLabel}>{t('common.latestOrder')}</Text>
            <Text style={styles.lastOrderValue}>{lastOrder.number}</Text>
          </View>
        ) : null}
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
  },
  heroCard: {
    gap: spacing.lg,
  },
  heroCopy: {
    gap: 3,
  },
  productLabel: {
    color: colors.textSoft,
    fontSize: typography.micro,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  productName: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: 25,
    fontWeight: '700',
  },
  productPrice: {
    color: colors.primary,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  compactCopy: {
    flex: 1,
    gap: 2,
  },
  compactTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  compactDescription: {
    color: colors.textMuted,
    fontSize: typography.small,
  },
  lastOrder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  lastOrderLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
  },
  lastOrderValue: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '800',
  },
});
