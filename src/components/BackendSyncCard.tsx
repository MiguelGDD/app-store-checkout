import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { CatalogSource, CatalogStatus } from '../types';
import { formatDateTime } from '../utils/format';
import { useI18n } from '../i18n';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { Pill } from './Pill';

type PillTone = 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

type BackendSyncCardProps = {
  status: CatalogStatus;
  error: string | null;
  source: CatalogSource;
  lastSyncedAt: string | null;
  onRetry: () => void;
};

const STATUS_TONE_BY_CATALOG_STATE: Record<CatalogStatus, PillTone> = {
  idle: 'neutral',
  loading: 'primary',
  succeeded: 'success',
  failed: 'danger',
};

export function BackendSyncCard({
  status,
  error,
  source,
  lastSyncedAt,
  onRetry,
}: BackendSyncCardProps) {
  const { t } = useI18n();
  const isLoading = status === 'loading';
  const isSuccess = status === 'succeeded';
  const isError = status === 'failed';
  const actionLabel = isError ? t('backendSync.retrySync') : t('backendSync.refreshCatalog');
  const statusLabelByCatalogState: Record<CatalogStatus, string> = {
    idle: t('backendSync.idle'),
    loading: t('backendSync.loading'),
    succeeded: t('backendSync.connected'),
    failed: t('backendSync.needsAttention'),
  };
  const sourceLabelByCatalogSource: Record<CatalogSource, string> = {
    backend: t('backendSync.remoteCatalog'),
    demo: t('backendSync.demoFallback'),
  };

  return (
    <AppCard tone="strong" style={styles.card}>
      <View style={styles.header}>
        <Pill
          label={statusLabelByCatalogState[status]}
          tone={STATUS_TONE_BY_CATALOG_STATE[status]}
        />
        <Text style={styles.sourceLabel}>{sourceLabelByCatalogSource[source]}</Text>
      </View>

      <Text style={styles.title}>{t('backendSync.title')}</Text>
      <Text style={styles.description}>{t('backendSync.description')}</Text>

      {isLoading ? (
        <View style={styles.stateRow}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.stateText}>{t('backendSync.loadingText')}</Text>
        </View>
      ) : null}

      {isSuccess && lastSyncedAt ? (
        <Text style={styles.successText}>
          {t('backendSync.lastSync')} {formatDateTime(lastSyncedAt)}
        </Text>
      ) : null}

      {isError ? (
        <Text style={styles.errorText}>{error ?? t('backendSync.genericError')}</Text>
      ) : null}

      <AppButton
        label={actionLabel}
        onPress={onRetry}
        variant="secondary"
        compact
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sourceLabel: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stateText: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  successText: {
    color: colors.success,
    fontSize: typography.body,
    lineHeight: 21,
    fontWeight: '700',
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.body,
    lineHeight: 21,
    fontWeight: '700',
  },
});
