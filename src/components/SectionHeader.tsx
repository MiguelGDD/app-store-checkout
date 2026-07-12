import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';

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
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  eyebrow: {
    color: colors.textSoft,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: typography.micro,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
});
