import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { AppCard } from './AppCard';
import { Pill } from './Pill';

type MetricCardProps = {
  label: string;
  value: string;
  description: string;
  accent?: 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
};

export function MetricCard({
  label,
  value,
  description,
  accent = 'neutral',
}: MetricCardProps) {
  return (
    <AppCard style={styles.card}>
      <View style={styles.topRow}>
        <Pill label={label} tone={accent} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.description}>{description}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  value: {
    color: colors.text,
    fontSize: typography.subtitle,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
  },
});
