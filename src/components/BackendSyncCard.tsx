import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { CatalogSource, CatalogStatus } from '../types';
import { formatDateTime } from '../utils/format';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { Pill } from './Pill';

type BackendSyncCardProps = {
  status: CatalogStatus;
  error: string | null;
  source: CatalogSource;
  lastSyncedAt: string | null;
  onRetry: () => void;
};

function resolveStatusLabel(status: CatalogStatus): string {
  switch (status) {
    case 'loading':
      return 'Syncing';
    case 'succeeded':
      return 'Connected';
    case 'failed':
      return 'Needs attention';
    default:
      return 'Idle';
  }
}

function resolveTone(status: CatalogStatus) {
  switch (status) {
    case 'loading':
      return 'primary' as const;
    case 'succeeded':
      return 'success' as const;
    case 'failed':
      return 'danger' as const;
    default:
      return 'neutral' as const;
  }
}

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

  return (
    <AppCard tone="strong" style={styles.card}>
      <View style={styles.header}>
        <Pill label={resolveStatusLabel(status)} tone={resolveTone(status)} />
        <Text style={styles.sourceLabel}>
          {source === 'backend' ? 'Remote catalog' : 'Demo fallback'}
        </Text>
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
        label={isError ? 'Retry sync' : 'Refresh catalog'}
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
