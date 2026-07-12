import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing, typography } from '../theme';
import type { Product } from '../types';
import { formatCurrency } from '../utils/format';
import { useI18n } from '../i18n';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { ProductArtwork } from './ProductArtwork';

type ProductCardProps = {
  product: Product;
  quantity: number;
  compact: boolean;
  onAdd: () => void;
  onOpenDetails?: () => void;
};

export function ProductCard({
  product,
  quantity,
  onAdd,
  onOpenDetails,
}: ProductCardProps) {
  const { t } = useI18n();

  return (
    <AppCard style={styles.card}>
      <ProductArtwork product={product} />
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.stock}>
          {t('productCard.stock', { count: product.stock })}
        </Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {product.description}
      </Text>
      <Text style={styles.price}>{formatCurrency(product.price)}</Text>
      <View style={styles.actions}>
        {onOpenDetails ? (
          <AppButton
            compact
            label={t('productCard.viewDetails')}
            onPress={onOpenDetails}
            variant="secondary"
            style={styles.action}
          />
        ) : null}
        <AppButton
          compact
          label={
            quantity > 0
              ? t('productCard.inCart', { count: quantity })
              : t('productCard.addToCart')
          }
          onPress={onAdd}
          style={styles.action}
        />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  stock: {
    color: colors.textSoft,
    fontSize: typography.micro,
    fontWeight: '700',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
    minHeight: 36,
  },
  price: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  action: {
    flex: 1,
    minWidth: 0,
  },
});
