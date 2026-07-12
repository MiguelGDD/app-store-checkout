import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { CardBrandLogos } from '../components/CardBrandLogos';
import { EmptyState } from '../components/EmptyState';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';
import { useI18n } from '../i18n';
import { colors, fonts, radius, spacing, typography } from '../theme';
import type {
  CardPaymentDetails,
  OrderSummary,
  Product,
  ResponsiveLayout,
  ScreenId,
} from '../types';
import {
  detectCardBrand,
  isValidCardHolder,
  isValidCardNumber,
  isValidCvc,
  isValidExpiry,
  normalizeCardNumber,
} from '../utils/cardValidation';
import { formatCurrency, formatQuantity } from '../utils/format';

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
  return normalizeCardNumber(value)
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
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const cardDigits = normalizeCardNumber(cardNumber);
  const cardBrand = detectCardBrand(cardDigits);
  const holderValid = isValidCardHolder(cardHolder);
  const numberValid = isValidCardNumber(cardDigits);
  const expiryValid = isValidExpiry(expiry);
  const cvcValid = isValidCvc(cvc, cardBrand);
  const canPay = holderValid && numberValid && expiryValid && cvcValid;
  const detectedCardLabel =
    cardBrand === 'visa'
      ? t('checkout.cardDetectedVisa')
      : cardBrand === 'mastercard'
      ? t('checkout.cardDetectedMastercard')
      : t('checkout.cardNotDetected');

  const openPayment = () => {
    setValidationAttempted(false);
    setIsPaymentOpen(true);
  };

  const closePayment = () => {
    if (!isSubmitting) {
      setIsPaymentOpen(false);
      setValidationAttempted(false);
    }
  };

  const submitPayment = () => {
    setValidationAttempted(true);

    if (!canPay || isSubmitting) {
      return;
    }

    const [expMonth, expYear] = expiry.split('/');

    onPlaceOrder({
      number: cardDigits,
      expMonth,
      expYear,
      cvc,
      cardHolder: cardHolder.trim(),
    });
  };

  return (
    <>
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
            <AppCard style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {formatQuantity(itemCount)}
                </Text>
                <Text style={styles.total}>{formatCurrency(total)}</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.methodTitle}>
                {t('checkout.paymentMethod')}
              </Text>
              <CardBrandLogos detectedBrand="unknown" />
              <Text style={styles.securityNote}>
                {t('checkout.acceptedCards')}
              </Text>
              <AppButton
                testID="credit-card-payment-button"
                label={t('checkout.payWithCreditCard')}
                onPress={openPayment}
                fullWidth
              />
              <AppButton
                label={t('checkout.backToCart')}
                onPress={() => onNavigate('cart')}
                variant="ghost"
                compact
                fullWidth
              />
            </AppCard>
          )}
        </View>
      </ScreenFrame>

      {isPaymentOpen ? (
        <Modal
          visible
          transparent
          animationType="slide"
          statusBarTranslucent
          onRequestClose={closePayment}
        >
          <View style={styles.modalRoot}>
            <Pressable
              testID="credit-card-backdrop"
              accessibilityRole="button"
              accessibilityLabel={t('checkout.closePayment')}
              onPress={closePayment}
              style={styles.backdrop}
            />
            <KeyboardAvoidingView
              pointerEvents="box-none"
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.sheetPlacement}
            >
              <View style={[styles.sheet, layout.isWide && styles.sheetWide]}>
                <View style={styles.sheetHandle} />
                <ScrollView
                  contentContainerStyle={styles.sheetContent}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.cardHeading}>
                    <View style={styles.headingCopy}>
                      <Text style={styles.cardTitle}>
                        {t('checkout.cardTitle')}
                      </Text>
                      <Text style={styles.secureLabel}>
                        {t('checkout.secureLabel')}
                      </Text>
                    </View>
                    <AppButton
                      testID="close-card-payment"
                      label={t('checkout.closePayment')}
                      onPress={closePayment}
                      variant="ghost"
                      compact
                      disabled={isSubmitting}
                    />
                  </View>

                  <View style={styles.brandBlock}>
                    <CardBrandLogos detectedBrand={cardBrand} />
                    <Text
                      style={[
                        styles.detectedBrand,
                        cardBrand !== 'unknown' && styles.detectedBrandActive,
                      ]}
                    >
                      {detectedCardLabel}
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
                      style={[
                        styles.input,
                        validationAttempted &&
                          !holderValid &&
                          styles.inputInvalid,
                      ]}
                    />
                    {validationAttempted && !holderValid ? (
                      <Text accessibilityRole="alert" style={styles.fieldError}>
                        {t('checkout.invalidCardHolder')}
                      </Text>
                    ) : null}
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
                      onChangeText={value =>
                        setCardNumber(formatCardNumber(value))
                      }
                      placeholder="4242 4242 4242 4242"
                      placeholderTextColor={colors.textSoft}
                      style={[
                        styles.input,
                        validationAttempted &&
                          !numberValid &&
                          styles.inputInvalid,
                      ]}
                    />
                    {validationAttempted && !numberValid ? (
                      <Text accessibilityRole="alert" style={styles.fieldError}>
                        {t('checkout.invalidCardNumber')}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.fieldRow}>
                    <View style={[styles.field, styles.fieldHalf]}>
                      <Text style={styles.inputLabel}>
                        {t('checkout.expiry')}
                      </Text>
                      <TextInput
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        value={expiry}
                        editable={!isSubmitting}
                        onChangeText={value => setExpiry(formatExpiry(value))}
                        placeholder="MM/AA"
                        placeholderTextColor={colors.textSoft}
                        style={[
                          styles.input,
                          validationAttempted &&
                            !expiryValid &&
                            styles.inputInvalid,
                        ]}
                      />
                      {validationAttempted && !expiryValid ? (
                        <Text
                          accessibilityRole="alert"
                          style={styles.fieldError}
                        >
                          {t('checkout.invalidExpiry')}
                        </Text>
                      ) : null}
                    </View>
                    <View style={[styles.field, styles.fieldHalf]}>
                      <Text style={styles.inputLabel}>{t('checkout.cvc')}</Text>
                      <TextInput
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        maxLength={3}
                        secureTextEntry
                        value={cvc}
                        editable={!isSubmitting}
                        onChangeText={value => setCvc(value.replace(/\D/g, ''))}
                        placeholder="123"
                        placeholderTextColor={colors.textSoft}
                        style={[
                          styles.input,
                          validationAttempted &&
                            !cvcValid &&
                            styles.inputInvalid,
                        ]}
                      />
                      {validationAttempted && !cvcValid ? (
                        <Text
                          accessibilityRole="alert"
                          style={styles.fieldError}
                        >
                          {t('checkout.invalidCvc')}
                        </Text>
                      ) : null}
                    </View>
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
                    testID="submit-card-payment"
                    label={
                      isSubmitting
                        ? t('checkout.processing')
                        : t('checkout.payTotal', {
                            total: formatCurrency(total),
                          })
                    }
                    onPress={submitPayment}
                    fullWidth
                    disabled={isSubmitting}
                  />
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      ) : null}
    </>
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
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  methodTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: typography.subtitle,
    fontWeight: '700',
  },
  securityNote: {
    color: colors.textSoft,
    fontSize: typography.small,
    lineHeight: 18,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(23, 35, 30, 0.58)',
  },
  sheetPlacement: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    maxHeight: '92%',
    paddingTop: spacing.sm,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetWide: {
    maxWidth: 720,
    alignSelf: 'center',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  sheetHandle: {
    width: 44,
    height: 4,
    alignSelf: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.borderStrong,
  },
  sheetContent: {
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headingCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: typography.title,
    fontWeight: '700',
  },
  secureLabel: {
    color: colors.success,
    fontSize: typography.micro,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  brandBlock: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  detectedBrand: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  detectedBrandActive: {
    color: colors.success,
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
  inputInvalid: {
    borderColor: colors.danger,
  },
  fieldError: {
    color: colors.danger,
    fontSize: typography.small,
    lineHeight: 17,
  },
  paymentError: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 18,
  },
});
