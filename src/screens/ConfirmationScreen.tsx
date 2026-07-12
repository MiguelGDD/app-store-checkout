import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import type {
  OrderSummary,
  ResponsiveLayout,
  ScreenId,
  TransactionStatus,
} from '../types';
import { formatCurrency } from '../utils/format';
import { AppButton } from '../components/AppButton';
import { AppCard } from '../components/AppCard';
import { Pill } from '../components/Pill';
import { ScreenFrame } from '../components/ScreenFrame';
import { SectionHeader } from '../components/SectionHeader';

type ResultTone = 'neutral' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

type ConfirmationScreenProps = {
  layout: ResponsiveLayout;
  lastOrder: OrderSummary | null;
  transactionStatus: TransactionStatus | null;
  cartCount: number;
  onNavigate: (screen: ScreenId) => void;
};

const RESULT_COPY_BY_STATUS: Record<
  TransactionStatus,
  {
    label: string;
    tone: ResultTone;
    title: string;
    description: string;
  }
> = {
  pending: {
    label: 'Pending',
    tone: 'warning',
    title: 'Transaction is pending',
    description:
      'The checkout workflow created the transaction and is waiting for the final payment resolution.',
  },
  completed: {
    label: 'Completed',
    tone: 'success',
    title: 'Payment confirmed',
    description:
      'The pending transaction was resolved successfully and the order is ready to be delivered.',
  },
  failed: {
    label: 'Failed',
    tone: 'danger',
    title: 'Payment failed',
    description:
      'The transaction was marked as failed. The cart can be retried without losing the shell state.',
  },
};

const EMPTY_RESULT_COPY = {
  label: 'Awaiting order',
  tone: 'neutral' as ResultTone,
  title: 'No transaction yet',
  description:
    'Complete an order from checkout to create the pending transaction and see the final result here.',
};

export function ConfirmationScreen({
  layout,
  lastOrder,
  transactionStatus,
  cartCount,
  onNavigate,
}: ConfirmationScreenProps) {
  const orderNumber = lastOrder?.number ?? 'SC-000';
  const orderDescription = lastOrder
    ? `${lastOrder.itemCount} items confirmed for ${formatCurrency(lastOrder.total)}.`
    : 'Complete an order from checkout to populate this view.';
  const resultCopy =
    transactionStatus ? RESULT_COPY_BY_STATUS[transactionStatus] : EMPTY_RESULT_COPY;

  return (
    <ScreenFrame layout={layout}>
      <View style={styles.stack}>
        <SectionHeader
          eyebrow="Result"
          title="Transaction outcome"
          description="The final screen reflects the transaction status after the checkout workflow creates the pending record."
        />

        <AppCard tone="hero" style={styles.heroCard}>
          <Pill label={resultCopy.label} tone={resultCopy.tone} />
          <Text style={styles.resultTitle}>{resultCopy.title}</Text>
          <Text style={styles.heroTitle}>{orderNumber}</Text>
          <Text style={styles.heroDescription}>{resultCopy.description}</Text>
          <Text style={styles.orderDescription}>{orderDescription}</Text>
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
          <Text style={styles.noteTitle}>What the flow already covers</Text>
          <Text style={styles.noteText}>
            The app shell now covers product detail, cart review, checkout and
            a transaction result screen that can represent pending, completed
            or failed states.
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
  resultTitle: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
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
  orderDescription: {
    color: colors.text,
    fontSize: typography.body,
    lineHeight: 22,
    fontWeight: '700',
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
