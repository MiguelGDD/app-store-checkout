import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { colors, radius, spacing } from '../theme';

type AppCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'default' | 'hero' | 'strong';
};

export function AppCard({ children, style, tone = 'default' }: AppCardProps) {
  return (
    <View
      style={[
        styles.base,
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
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  hero: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
  },
  strong: {
    backgroundColor: colors.surfaceHighlight,
    borderColor: colors.borderStrong,
  },
});
