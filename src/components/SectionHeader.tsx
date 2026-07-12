import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { resolveResponsiveChoice, useResponsiveLayout } from '../utils/responsive';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  const layout = useResponsiveLayout();
  const containerLayoutStyle: StyleProp<ViewStyle> = resolveResponsiveChoice(layout, {
    compact: styles.containerCompact,
    defaultValue: styles.containerWide,
  });
  const eyebrowLayoutStyle: StyleProp<TextStyle> = resolveResponsiveChoice(layout, {
    compact: styles.eyebrowCompact,
    defaultValue: styles.eyebrowWide,
  });
  const titleLayoutStyle: StyleProp<TextStyle> = resolveResponsiveChoice(layout, {
    compact: styles.titleCompact,
    wide: styles.titleWide,
    defaultValue: null,
  });
  const descriptionLayoutStyle: StyleProp<TextStyle> = resolveResponsiveChoice(layout, {
    compact: styles.descriptionCompact,
    defaultValue: styles.descriptionWide,
  });

  return (
    <View style={[styles.container, containerLayoutStyle]}>
      <Text style={[styles.eyebrow, eyebrowLayoutStyle]}>
        {eyebrow}
      </Text>
      <Text style={[styles.title, titleLayoutStyle]}>
        {title}
      </Text>
      {description ? (
        <Text style={[styles.description, descriptionLayoutStyle]}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  containerCompact: {
    gap: 4,
  },
  containerWide: {
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    fontSize: typography.micro,
    fontWeight: '800',
  },
  eyebrowCompact: {
    letterSpacing: 0.9,
  },
  eyebrowWide: {
    letterSpacing: 1.2,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  titleCompact: {
    fontSize: 22,
    lineHeight: 28,
  },
  titleWide: {
    fontSize: 26,
    lineHeight: 34,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  descriptionCompact: {
    fontSize: 14,
    lineHeight: 20,
  },
  descriptionWide: {
    fontSize: 15,
    lineHeight: 23,
  },
});
