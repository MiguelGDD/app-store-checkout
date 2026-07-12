import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type {
  OrderSummary,
  ResponsiveLayout,
  ScreenId,
  TransactionStatus,
} from '../types';
import { formatCurrency } from '../utils/format';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { Pill } from '../components/Pill';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';
import { useI18n } from '../i18n';

type ResultTone = 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

type ConfirmationScreenProps = {
  layout: ResponsiveLayout;
  lastOrder: OrderSummary | null;
  transactionStatus: TransactionStatus | null;
  cartCount: number;
  onNavigate: (screen: ScreenId) => void;
};

const RESULT_COPY_BY_STATUS: Record<
  TransactionStatus,
  {
    labelKey: 'confirmation.pendingLabel' | 'confirmation.completedLabel' | 'confirmation.failedLabel';
    tone: ResultTone;
    titleKey: 'confirmation.pendingTitle' | 'confirmation.completedTitle' | 'confirmation.failedTitle';
    descriptionKey:
      | 'confirmation.pendingDescription'
      | 'confirmation.completedDescription'
      | 'confirmation.failedDescription';
  }
> = {
  pending: {
    labelKey: 'confirmation.pendingLabel',
    tone: 'warning',
    titleKey: 'confirmation.pendingTitle',
    descriptionKey: 'confirmation.pendingDescription',
  },
  completed: {
    labelKey: 'confirmation.completedLabel',
    tone: 'success',
    titleKey: 'confirmation.completedTitle',
    descriptionKey: 'confirmation.completedDescription',
  },
  failed: {
    labelKey: 'confirmation.failedLabel',
    tone: 'danger',
    titleKey: 'confirmation.failedTitle',
    descriptionKey: 'confirmation.failedDescription',
  },
};

const EMPTY_RESULT_COPY = {
  labelKey: 'confirmation.awaitingLabel' as const,
  tone: 'neutral' as ResultTone,
  titleKey: 'confirmation.emptyTitle' as const,
  descriptionKey: 'confirmation.emptyDescription' as const,
};

export function ConfirmationScreen({
  layout,
  lastOrder,
  transactionStatus,
  cartCount,
  onNavigate,
}: ConfirmationScreenProps) {
  const { t } = useI18n();
  const orderNumber = lastOrder?.number ?? 'SC-000';
  const orderDescription = lastOrder
    ? t('common.confirmedItemsTotal', {
        count: lastOrder.itemCount,
        total: formatCurrency(lastOrder.total),
      })
    : t('confirmation.emptyDescription');
  const resultCopy =
    transactionStatus ? RESULT_COPY_BY_STATUS[transactionStatus] : EMPTY_RESULT_COPY;

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow={t('confirmation.eyebrow')}
          title={t('confirmation.title')}
          description={t('confirmation.description')}
        />

        <AppCard tone="hero" style={styles.heroCard}>
          <Pill label={t(resultCopy.labelKey)} tone={resultCopy.tone} />
          <Text style={styles.resultTitle}>{t(resultCopy.titleKey)}</Text>
          <Text style={styles.heroTitle}>{orderNumber}</Text>
          <Text style={styles.heroDescription}>{t(resultCopy.descriptionKey)}</Text>
          <Text style={styles.orderDescription}>{orderDescription}</Text>
          <View style={styles.heroButtons}>
            <AppButton label={t('confirmation.backToHome')} onPress={() => onNavigate('home')} />
            <AppButton
              label={t('confirmation.openCart', { count: cartCount })}
              onPress={() => onNavigate('cart')}
              variant="secondary"
              compact
            />
          </View>
        </AppCard>

        <AppCard style={styles.noteCard}>
          <Text style={styles.noteTitle}>{t('confirmation.noteTitle')}</Text>
          <Text style={styles.noteText}>{t('confirmation.noteText')}</Text>
        </AppCard>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
  },
  heroCard: {
    gap: spacing.md,
  },
  resultTitle: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.hero,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  heroDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  orderDescription: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    fontWeight: '700',
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  noteCard: {
    gap: spacing.sm,
  },
  noteTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  noteText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
});
