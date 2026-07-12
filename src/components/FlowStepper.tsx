import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import type { FlowStep } from '../types';

type FlowStepperProps = {
  steps: FlowStep[];
  activeIndex: number;
};

export function FlowStepper({ steps, activeIndex }: FlowStepperProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isComplete = index <= activeIndex;

        return (
          <View key={step.title} style={styles.stepRow}>
            <View style={styles.markerColumn}>
              <View
                style={[
                  styles.marker,
                  isComplete ? styles.markerActive : styles.markerInactive,
                ]}
              >
                <Text
                  style={[
                    styles.markerLabel,
                    isComplete ? styles.markerLabelActive : styles.markerLabelInactive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              {index < steps.length - 1 ? (
                <View
                  style={[
                    styles.connector,
                    isComplete ? styles.connectorActive : styles.connectorInactive,
                  ]}
                />
              ) : null}
            </View>
            <View style={styles.copy}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  markerColumn: {
    alignItems: 'center',
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryStrong,
  },
  markerInactive: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  markerLabel: {
    fontSize: typography.small,
    fontWeight: '800',
  },
  markerLabelActive: {
    color: colors.backgroundDeep,
  },
  markerLabelInactive: {
    color: colors.textMuted,
  },
  connector: {
    width: 2,
    flex: 1,
    minHeight: 18,
    marginTop: 6,
    borderRadius: radius.pill,
  },
  connectorActive: {
    backgroundColor: colors.primary,
  },
  connectorInactive: {
    backgroundColor: colors.border,
  },
  copy: {
    flex: 1,
    paddingTop: 1,
  },
  stepTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '800',
    lineHeight: 20,
  },
  stepDescription: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 18,
    marginTop: 2,
  },
});
