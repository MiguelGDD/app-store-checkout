import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, spacing, typography } from '../theme';
import type {
  OrderSummary,
  ResponsiveLayout,
  ScreenId,
  TransactionStatus,
} from '../types';
import { formatCurrency } from '../utils/format';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';
import { useI18n } from '../i18n';

type ConfirmationScreenProps = {
  layout: ResponsiveLayout;
  lastOrder: OrderSummary | null;
  transactionStatus: TransactionStatus | null;
  cartCount: number;
  onNavigate: (screen: ScreenId) => void;
};

export function ConfirmationScreen({
  layout,
  lastOrder,
  transactionStatus,
  onNavigate,
}: ConfirmationScreenProps) {
  const { t } = useI18n();
  const isEmpty = !transactionStatus && !lastOrder;
  const isCompleted = transactionStatus === 'completed';
  const isFailed = transactionStatus === 'failed';
  const title = isEmpty
    ? t('confirmation.emptyTitle')
    : isCompleted
    ? t('confirmation.completedTitle')
    : isFailed
    ? t('confirmation.failedTitle')
    : t('confirmation.pendingTitle');
  const description = isEmpty
    ? t('confirmation.emptyDescription')
    : isCompleted
    ? t('confirmation.completedDescription')
    : isFailed
    ? t('confirmation.failedDescription')
    : t('confirmation.pendingDescription');

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow={t('confirmation.eyebrow')}
          title={t('confirmation.title')}
        />

        <AppCard tone="hero" style={styles.card}>
          <View
            style={[
              styles.resultIcon,
              isFailed ? styles.resultIconFailed : styles.resultIconSuccess,
            ]}
          >
            <Text style={styles.resultMark}>{isFailed ? '!' : 'OK'}</Text>
          </View>
          <Text style={styles.resultTitle}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {lastOrder ? (
            <View style={styles.orderBox}>
              <View style={styles.orderDetails}>
                <Text style={styles.orderIdLabel}>
                  {t('confirmation.orderId')}
                </Text>
                <Text style={styles.orderLabel}>{lastOrder.number}</Text>
                <Text style={styles.orderItems}>
                  {lastOrder.itemCount} productos
                </Text>
              </View>
              <View style={styles.totalBlock}>
                <Text style={styles.totalLabel}>
                  {t('confirmation.totalPaid')}
                </Text>
                <Text style={styles.orderTotal}>
                  {formatCurrency(lastOrder.total)}
                </Text>
              </View>
            </View>
          ) : null}

          <AppButton
            label={t('confirmation.backToHome')}
            onPress={() => onNavigate('catalog')}
            fullWidth
          />
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
    alignItems: 'center',
    gap: spacing.md,
  },
  resultIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultIconSuccess: {
    backgroundColor: colors.primary,
  },
  resultIconFailed: {
    backgroundColor: colors.danger,
  },
  resultMark: {
    color: colors.surface,
    fontSize: 34,
    fontWeight: '900',
  },
  resultTitle: {
    color: colors.text,
    fontFamily: fonts.display,
    fontSize: typography.title,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  orderBox: {
    width: '100%',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  orderDetails: {
    width: '100%',
    gap: spacing.xs,
  },
  orderIdLabel: {
    color: colors.textSoft,
    fontSize: typography.micro,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  orderLabel: {
    width: '100%',
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 18,
    fontWeight: '800',
    flexShrink: 1,
  },
  orderItems: {
    color: colors.textMuted,
    fontSize: typography.small,
  },
  totalBlock: {
    width: '100%',
    gap: spacing.xs,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  orderTotal: {
    color: colors.primary,
    fontSize: typography.title,
    fontWeight: '900',
    flexShrink: 1,
  },
});
