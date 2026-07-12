import { Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import type { ResponsiveLayout } from '../types';
import {
  resolveResponsiveChoice,
  useResponsiveLayout,
} from '../utils/responsive';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  testID?: string;
  accessibilityLabel?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  compact?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

type ButtonMetrics = {
  minHeight: number;
  paddingHorizontal: number;
};

function getButtonMetrics(
  layout: ResponsiveLayout,
  compact: boolean,
): ButtonMetrics {
  if (compact) {
    return {
      minHeight: resolveResponsiveChoice(layout, {
        compact: 38,
        defaultValue: 40,
      }),
      paddingHorizontal: resolveResponsiveChoice(layout, {
        compact: spacing.md,
        defaultValue: spacing.lg,
      }),
    };
  }

  return {
    minHeight: resolveResponsiveChoice(layout, {
      wide: 52,
      defaultValue: 48,
    }),
    paddingHorizontal: resolveResponsiveChoice(layout, {
      wide: spacing.xl + 4,
      defaultValue: spacing.xl,
    }),
  };
}

export function AppButton({
  label,
  onPress,
  testID,
  accessibilityLabel,
  variant = 'primary',
  fullWidth = false,
  compact = false,
  disabled = false,
  style,
}: AppButtonProps) {
  const layout = useResponsiveLayout();
  const buttonMetrics = getButtonMetrics(layout, compact);

  return (
    <Pressable
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? label}
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
        {
          minHeight: buttonMetrics.minHeight,
          paddingHorizontal: buttonMetrics.paddingHorizontal,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          layout.isWide && styles.labelWide,
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
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'flex-start',
  },
  compact: {},
  fullWidth: {
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryStrong,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
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
  labelWide: {
    fontSize: 16,
  },
  labelPrimary: {
    color: colors.surface,
  },
  labelSecondary: {
    color: colors.primary,
  },
  labelGhost: {
    color: colors.textMuted,
  },
});
