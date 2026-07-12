import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, radius, spacing, typography } from '../theme';
import type {
  CardPaymentDetails,
  OrderSummary,
  Product,
  ResponsiveLayout,
  ScreenId,
} from '../types';
import { formatCurrency, formatQuantity } from '../utils/format';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { EmptyState } from '../components/EmptyState';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';
import { useI18n } from '../i18n';

type CheckoutItem = {
  product: Product;
  quantity: number;
};

type CheckoutScreenProps = {
  layout: ResponsiveLayout;
  items: CheckoutItem[];
  itemCount: number;
  total: number;
  lastOrder: OrderSummary | null;
  flowIndex: number;
  isSubmitting: boolean;
  paymentError: string | null;
  onNavigate: (screen: ScreenId) => void;
  onPlaceOrder: (payment: CardPaymentDetails) => void;
};

function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
}

function isValidExpiry(value: string): boolean {
  const [month, year] = value.split('/');
  return /^(0[1-9]|1[0-2])$/.test(month ?? '') && /^\d{2}$/.test(year ?? '');
}

export function CheckoutScreen({
  layout,
  items,
  itemCount,
  total,
  isSubmitting,
  paymentError,
  onNavigate,
  onPlaceOrder,
}: CheckoutScreenProps) {
  const { t } = useI18n();
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const cardDigits = cardNumber.replace(/\s/g, '');
  const canPay =
    cardHolder.trim().length >= 5 &&
    /^\d{13,19}$/.test(cardDigits) &&
    isValidExpiry(expiry) &&
    /^\d{3,4}$/.test(cvc);

  const submitPayment = () => {
    if (canPay) {
      const [expMonth, expYear] = expiry.split('/');

      onPlaceOrder({
        number: cardDigits,
        expMonth,
        expYear,
        cvc,
        cardHolder: cardHolder.trim(),
      });
    }
  };

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow={t('checkout.eyebrow')}
          title={t('checkout.title')}
          description={t('checkout.description')}
        />

        <View style={styles.progress}>
          {['Carrito', 'Pago', 'Listo'].map((label, index) => (
            <View key={label} style={styles.progressItem}>
              <View
                style={[
                  styles.progressDot,
                  index <= 1 && styles.progressDotActive,
                ]}
              >
                <Text
                  style={[
                    styles.progressNumber,
                    index <= 1 && styles.progressNumberActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.progressLabel,
                  index === 1 && styles.progressLabelActive,
                ]}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>

        {items.length === 0 ? (
          <EmptyState
            title={t('checkout.emptyTitle')}
            description={t('checkout.emptyDescription')}
            actionLabel={t('checkout.emptyAction')}
            onAction={() => onNavigate('cart')}
          />
        ) : (
          <>
            <AppCard style={styles.paymentCard}>
              <View style={styles.cardHeading}>
                <Text style={styles.cardTitle}>{t('checkout.cardTitle')}</Text>
                <Text style={styles.secureLabel}>
                  {t('checkout.secureLabel')}
                </Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.inputLabel}>
                  {t('checkout.cardHolder')}
                </Text>
                <TextInput
                  autoCapitalize="words"
                  autoComplete="name"
                  value={cardHolder}
                  editable={!isSubmitting}
                  onChangeText={setCardHolder}
                  placeholder="Ana Perez"
                  placeholderTextColor={colors.textSoft}
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.inputLabel}>
                  {t('checkout.cardNumber')}
                </Text>
                <TextInput
                  autoComplete="cc-number"
                  inputMode="numeric"
                  value={cardNumber}
                  editable={!isSubmitting}
                  onChangeText={value => setCardNumber(formatCardNumber(value))}
                  placeholder="4242 4242 4242 4242"
                  placeholderTextColor={colors.textSoft}
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldRow}>
                <View style={[styles.field, styles.fieldHalf]}>
                  <Text style={styles.inputLabel}>{t('checkout.expiry')}</Text>
                  <TextInput
                    autoComplete="cc-exp"
                    inputMode="numeric"
                    value={expiry}
                    editable={!isSubmitting}
                    onChangeText={value => setExpiry(formatExpiry(value))}
                    placeholder="MM/AA"
                    placeholderTextColor={colors.textSoft}
                    style={styles.input}
                  />
                </View>
                <View style={[styles.field, styles.fieldHalf]}>
                  <Text style={styles.inputLabel}>{t('checkout.cvc')}</Text>
                  <TextInput
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    maxLength={4}
                    secureTextEntry
                    value={cvc}
                    editable={!isSubmitting}
                    onChangeText={value => setCvc(value.replace(/\D/g, ''))}
                    placeholder="123"
                    placeholderTextColor={colors.textSoft}
                    style={styles.input}
                  />
                </View>
              </View>
            </AppCard>

            <AppCard style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {formatQuantity(itemCount)}
                </Text>
                <Text style={styles.total}>{formatCurrency(total)}</Text>
              </View>
              <Text style={styles.securityNote}>
                {t('checkout.securityNote')}
              </Text>
              {paymentError ? (
                <Text accessibilityRole="alert" style={styles.paymentError}>
                  {paymentError}
                </Text>
              ) : null}
              <AppButton
                label={
                  isSubmitting
                    ? t('checkout.processing')
                    : t('checkout.payTotal', { total: formatCurrency(total) })
                }
                onPress={submitPayment}
                fullWidth
                disabled={!canPay || isSubmitting}
              />
              <AppButton
                label={t('checkout.backToCart')}
                onPress={() => onNavigate('cart')}
                variant="ghost"
                compact
                fullWidth
                disabled={isSubmitting}
              />
            </AppCard>
          </>
        )}
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  progressItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  progressDot: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  progressNumber: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: '800',
  },
  progressNumberActive: {
    color: colors.surface,
  },
  progressLabel: {
    color: colors.textSoft,
    fontSize: typography.micro,
    fontWeight: '700',
  },
  progressLabelActive: {
    color: colors.primary,
  },
  paymentCard: {
    gap: spacing.md,
  },
  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  secureLabel: {
    color: colors.success,
    fontSize: typography.micro,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  field: {
    gap: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fieldHalf: {
    flex: 1,
  },
  inputLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  input: {
    minHeight: 50,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: typography.body,
  },
  summaryCard: {
    gap: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  total: {
    color: colors.primary,
    fontFamily: fonts.display,
    fontSize: typography.title,
    fontWeight: '700',
  },
  securityNote: {
    color: colors.textSoft,
    fontSize: typography.small,
    lineHeight: 18,
  },
  paymentError: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
  },
});
