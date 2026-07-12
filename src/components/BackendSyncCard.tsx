import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { CatalogSource, CatalogStatus } from '../types';
import { formatDateTime } from '../utils/format';
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

const STATUS_LABEL_BY_CATALOG_STATE: Record<CatalogStatus, string> = {
  idle: 'Idle',
  loading: 'Syncing',
  succeeded: 'Connected',
  failed: 'Needs attention',
};

const STATUS_TONE_BY_CATALOG_STATE: Record<CatalogStatus, PillTone> = {
  idle: 'neutral',
  loading: 'primary',
  succeeded: 'success',
  failed: 'danger',
};

const SOURCE_LABEL_BY_CATALOG_SOURCE: Record<CatalogSource, string> = {
  backend: 'Remote catalog',
  demo: 'Demo fallback',
};

export function BackendSyncCard({
  status,
  error,
  source,
  lastSyncedAt,
  onRetry,
}: BackendSyncCardProps) {
  const isLoading = status === 'loading';
  const isSuccess = status === 'succeeded';
  const isError = status === 'failed';
  const actionLabel = isError ? 'Retry sync' : 'Refresh catalog';

  return (
    <AppCard tone="strong" style={styles.card}>
      <View style={styles.header}>
        <Pill
          label={STATUS_LABEL_BY_CATALOG_STATE[status]}
          tone={STATUS_TONE_BY_CATALOG_STATE[status]}
        />
        <Text style={styles.sourceLabel}>{SOURCE_LABEL_BY_CATALOG_SOURCE[source]}</Text>
      </View>

      <Text style={styles.title}>Backend API client</Text>
      <Text style={styles.description}>
        The catalog is loaded through a centralized HTTP adapter and mapped into
        Redux state before the UI renders the product cards.
      </Text>

      {isLoading ? (
        <View style={styles.stateRow}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.stateText}>Loading products from the backend...</Text>
        </View>
      ) : null}

      {isSuccess && lastSyncedAt ? (
        <Text style={styles.successText}>
          Last sync: {formatDateTime(lastSyncedAt)}
        </Text>
      ) : null}

      {isError ? <Text style={styles.errorText}>{error}</Text> : null}

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
