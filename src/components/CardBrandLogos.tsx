import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import type { CardBrand } from '../utils/cardValidation';

type CardBrandLogosProps = {
  detectedBrand: CardBrand;
};

export function CardBrandLogos({ detectedBrand }: CardBrandLogosProps) {
  const visaActive = detectedBrand === 'unknown' || detectedBrand === 'visa';
  const mastercardActive =
    detectedBrand === 'unknown' || detectedBrand === 'mastercard';

  return (
    <View style={styles.container} accessibilityLabel="VISA y Mastercard">
      <View
        testID="card-brand-visa"
        style={[styles.logo, styles.visa, !visaActive && styles.inactive]}
      >
        <Text style={styles.visaLabel}>VISA</Text>
      </View>
      <View
        testID="card-brand-mastercard"
        style={[
          styles.logo,
          styles.mastercard,
          !mastercardActive && styles.inactive,
        ]}
      >
        <View style={styles.circles}>
          <View style={[styles.circle, styles.circleRed]} />
          <View style={[styles.circle, styles.circleOrange]} />
        </View>
        <Text style={styles.mastercardLabel}>mastercard</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    height: 34,
    minWidth: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  visa: {
    paddingHorizontal: spacing.sm,
  },
  visaLabel: {
    color: '#17357A',
    fontSize: typography.body,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -0.8,
  },
  mastercard: {
    minWidth: 70,
    paddingHorizontal: 6,
  },
  circles: {
    width: 31,
    height: 16,
  },
  circle: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: radius.pill,
  },
  circleRed: {
    left: 2,
    backgroundColor: '#EA001B',
  },
  circleOrange: {
    right: 2,
    backgroundColor: '#FF9900',
    opacity: 0.88,
  },
  mastercardLabel: {
    color: colors.text,
    fontSize: 7,
    fontWeight: '700',
    marginTop: -1,
  },
  inactive: {
    opacity: 0.25,
  },
});
