import { Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  compact?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  fullWidth = false,
  compact = false,
  disabled = false,
  style,
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        fullWidth && styles.fullWidth,
        compact && styles.compact,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.labelPrimary,
          variant === 'secondary' && styles.labelSecondary,
          variant === 'ghost' && styles.labelGhost,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'flex-start',
  },
  compact: {
    minHeight: 40,
    paddingHorizontal: spacing.lg,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryStrong,
  },
  secondary: {
    backgroundColor: colors.surfaceHighlight,
    borderColor: colors.borderStrong,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  labelPrimary: {
    color: colors.backgroundDeep,
  },
  labelSecondary: {
    color: colors.text,
  },
  labelGhost: {
    color: colors.textMuted,
  },
});
