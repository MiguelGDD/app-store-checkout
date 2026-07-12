import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { useResponsiveLayout } from '../utils/responsive';

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

  return (
    <View style={[styles.container, layout.isCompact ? styles.containerCompact : styles.containerWide]}>
      <Text
        style={[
          styles.eyebrow,
          layout.isCompact ? styles.eyebrowCompact : styles.eyebrowWide,
        ]}
      >
        {eyebrow}
      </Text>
      <Text
        style={[
          styles.title,
          layout.isCompact ? styles.titleCompact : layout.isWide ? styles.titleWide : null,
        ]}
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            styles.description,
            layout.isCompact ? styles.descriptionCompact : styles.descriptionWide,
          ]}
        >
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
