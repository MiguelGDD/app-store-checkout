import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { colors, radius, spacing } from '../theme';
import {
  resolveResponsiveChoice,
  useResponsiveLayout,
} from '../utils/responsive';

type AppCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'default' | 'hero' | 'strong';
};

export function AppCard({ children, style, tone = 'default' }: AppCardProps) {
  const layout = useResponsiveLayout();
  const layoutStyle: StyleProp<ViewStyle> = resolveResponsiveChoice(layout, {
    compact: styles.compact,
    wide: styles.wide,
    defaultValue: null,
  });

  return (
    <View
      style={[
        styles.base,
        layoutStyle,
        tone === 'hero' && styles.hero,
        tone === 'strong' && styles.strong,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    shadowColor: '#425249',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  compact: {
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  wide: {
    padding: spacing.xxl,
    borderRadius: radius.xl,
  },
  hero: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.borderStrong,
  },
  strong: {
    backgroundColor: colors.surfaceHighlight,
    borderColor: colors.borderStrong,
  },
});
