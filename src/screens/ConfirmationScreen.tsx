import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type { OrderSummary, ResponsiveLayout, ScreenId } from '../types';
import { formatCurrency } from '../utils/format';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { Pill } from '../components/Pill';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';

type ConfirmationScreenProps = {
  layout: ResponsiveLayout;
  lastOrder: OrderSummary | null;
  cartCount: number;
  onNavigate: (screen: ScreenId) => void;
};

export function ConfirmationScreen({
  layout,
  lastOrder,
  cartCount,
  onNavigate,
}: ConfirmationScreenProps) {
  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow="Confirmation"
          title="Flow complete"
          description="The shell now has a success landing state for the checkout sequence."
        />

        <AppCard tone="hero" style={styles.heroCard}>
          <Pill label="Order ready" tone="success" />
          <Text style={styles.heroTitle}>
            {lastOrder ? lastOrder.number : 'SC-000'}
          </Text>
          <Text style={styles.heroDescription}>
            {lastOrder
              ? `${lastOrder.itemCount} items confirmed for ${formatCurrency(lastOrder.total)}.`
              : 'Complete an order from checkout to populate this view.'}
          </Text>
          <View style={styles.heroButtons}>
            <AppButton label="Back to home" onPress={() => onNavigate('home')} />
            <AppButton
              label={`Open cart (${cartCount})`}
              onPress={() => onNavigate('cart')}
              variant="secondary"
              compact
            />
          </View>
        </AppCard>

        <AppCard style={styles.noteCard}>
          <Text style={styles.noteTitle}>What is already solved here</Text>
          <Text style={styles.noteText}>
            The app shell defines the flow, the responsive layout rules and the
            reusable components that the later tasks will reuse for Redux,
            backend integration and deployment instructions.
          </Text>
        </AppCard>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.lg,
  },
  heroCard: {
    gap: spacing.md,
  },
  heroTitle: {
    color: colors.text,
    fontSize: typography.hero,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  heroDescription: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  heroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  noteCard: {
    gap: spacing.sm,
  },
  noteTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
  },
  noteText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
  },
});
