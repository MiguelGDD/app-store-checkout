import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type PillProps = {
  label: string;
  tone?: 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
};

const toneStyles = {
  neutral: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: colors.border,
    textColor: colors.textMuted,
  },
  primary: {
    backgroundColor: 'rgba(255, 138, 61, 0.14)',
    borderColor: 'rgba(255, 138, 61, 0.28)',
    textColor: colors.primary,
  },
  secondary: {
    backgroundColor: 'rgba(57, 208, 179, 0.14)',
    borderColor: 'rgba(57, 208, 179, 0.28)',
    textColor: colors.secondary,
  },
  success: {
    backgroundColor: 'rgba(85, 214, 138, 0.14)',
    borderColor: 'rgba(85, 214, 138, 0.28)',
    textColor: colors.success,
  },
  warning: {
    backgroundColor: 'rgba(244, 184, 74, 0.14)',
    borderColor: 'rgba(244, 184, 74, 0.28)',
    textColor: colors.warning,
  },
  danger: {
    backgroundColor: 'rgba(255, 109, 122, 0.14)',
    borderColor: 'rgba(255, 109, 122, 0.28)',
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
