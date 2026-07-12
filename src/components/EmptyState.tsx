import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.iconRow}>
        <View style={styles.dot} />
        <View style={styles.dotSecondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <AppButton label={actionLabel} onPress={onAction} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: spacing.md,
  },
  iconRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  dotSecondary: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: colors.secondary,
  },
  title: {
    color: colors.text,
    fontSize: typography.subtitle,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
    textAlign: 'center',
  },
});
