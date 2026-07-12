import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type PillProps = {
  label: string;
  tone?: 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
};

const toneStyles = {
  neutral: {
    backgroundColor: colors.backgroundSoft,
    borderColor: colors.border,
    textColor: colors.textMuted,
  },
  primary: {
    backgroundColor: '#E2EEE8',
    borderColor: '#BED5CA',
    textColor: colors.primary,
  },
  secondary: {
    backgroundColor: '#F8E9E3',
    borderColor: '#EAC5B8',
    textColor: colors.secondary,
  },
  success: {
    backgroundColor: '#E4F1E8',
    borderColor: '#BED8C6',
    textColor: colors.success,
  },
  warning: {
    backgroundColor: '#FAEEDB',
    borderColor: '#E7CCA1',
    textColor: colors.warning,
  },
  danger: {
    backgroundColor: '#F8E5E2',
    borderColor: '#E5BBB5',
    textColor: colors.danger,
  },
};

export function Pill({ label, tone = 'neutral' }: PillProps) {
  const currentTone = toneStyles[tone] ?? toneStyles.neutral;

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: currentTone.backgroundColor,
          borderColor: currentTone.borderColor,
        },
      ]}
    >
      <Text style={[styles.label, { color: currentTone.textColor }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: {
    fontSize: typography.micro,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
});
