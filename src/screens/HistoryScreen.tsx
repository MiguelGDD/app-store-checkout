import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { EmptyState } from '../components/EmptyState';
import { Pill } from '../components/Pill';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';
import { useI18n } from '../i18n';
import { colors, spacing, typography } from '../theme';
import type {
  ResponsiveLayout,
  ScreenId,
  TransactionStatus,
  TransactionSummary,
} from '../types';
import type { TransactionHistorySyncStatus } from '../store/transaction/transactionSlice';
import {
  formatCurrency,
  formatDateTime,
  formatQuantity,
} from '../utils/format';

type HistoryScreenProps = {
  layout: ResponsiveLayout;
  transactions: TransactionSummary[];
  syncStatus: TransactionHistorySyncStatus;
  syncError: string | null;
  onNavigate: (screen: ScreenId) => void;
  onRetrySync: () => void;
};

function statusTone(status: TransactionStatus) {
  if (status === 'completed') {
    return 'success' as const;
  }

  if (status === 'failed') {
    return 'danger' as const;
  }

  return 'warning' as const;
}

export function HistoryScreen({
  layout,
  transactions,
  syncStatus,
  syncError,
  onNavigate,
  onRetrySync,
}: HistoryScreenProps) {
  const { t } = useI18n();
  const isLoading = transactions.length === 0 && syncStatus !== 'succeeded';
  const hasError = syncStatus === 'failed';

  const statusLabel = (status: TransactionStatus) => {
    if (status === 'completed') {
      return t('history.statusCompleted');
    }

    if (status === 'failed') {
      return t('history.statusFailed');
    }

    return t('history.statusPending');
  };

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow={t('history.eyebrow')}
          title={t('history.title')}
          description={t('history.description')}
        />

        {isLoading ? (
          <AppCard>
            <Text style={styles.loading}>{t('history.loading')}</Text>
          </AppCard>
        ) : null}

        {hasError ? (
          <AppCard style={styles.errorCard}>
            <Text style={styles.errorTitle}>
              {t('history.syncErrorTitle')}
            </Text>
            <Text style={styles.errorDescription}>
              {syncError ?? t('history.syncErrorDescription')}
            </Text>
            <AppButton
              label={t('common.retrySync')}
              onPress={onRetrySync}
              variant="secondary"
              compact
            />
          </AppCard>
        ) : null}

        {!isLoading && !hasError && transactions.length === 0 ? (
          <EmptyState
            title={t('history.emptyTitle')}
            description={t('history.emptyDescription')}
            actionLabel={t('history.emptyAction')}
            onAction={() => onNavigate('catalog')}
          />
        ) : transactions.length > 0 ? (
          <View style={styles.list}>
            {transactions.map(transaction => (
              <AppCard
                key={transaction.transactionId}
                style={styles.transactionCard}
              >
                <View style={styles.cardHeader}>
                  <Pill
                    label={statusLabel(transaction.status)}
                    tone={statusTone(transaction.status)}
                  />
                  <Text style={styles.date}>
                    {formatDateTime(transaction.createdAt)}
                  </Text>
                </View>

                <View style={styles.orderBlock}>
                  <Text style={styles.orderIdLabel}>
                    {t('history.orderId')}
                  </Text>
                  <Text style={styles.orderId}>{transaction.number}</Text>
                  <Text style={styles.items}>
                    {formatQuantity(transaction.itemCount)}
                  </Text>
                </View>

                <View style={styles.totalBlock}>
                  <Text style={styles.totalLabel}>{t('history.total')}</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(transaction.total)}
                  </Text>
                </View>
              </AppCard>
            ))}
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
  loading: {
    color: colors.textMuted,
    fontSize: typography.body,
    textAlign: 'center',
  },
  errorCard: {
    gap: spacing.md,
  },
  errorTitle: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  errorDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  list: {
    gap: spacing.md,
  },
  transactionCard: {
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  date: {
    color: colors.textMuted,
    fontSize: typography.small,
    textAlign: 'right',
    flexShrink: 1,
  },
  orderBlock: {
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
  orderId: {
    width: '100%',
    color: colors.text,
    fontSize: typography.small,
    lineHeight: 18,
    fontWeight: '800',
    flexShrink: 1,
  },
  items: {
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
  totalValue: {
    color: colors.primary,
    fontSize: typography.subtitle,
    fontWeight: '900',
    flexShrink: 1,
  },
});
