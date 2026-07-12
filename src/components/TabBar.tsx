import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import type { TabId } from '../types';
import { useI18n } from '../i18n';
import { useResponsiveLayout } from '../utils/responsive';

type TabBarProps = {
  activeTab: TabId;
  cartCount: number;
  onNavigate: (screen: TabId) => void;
};

export function TabBar({ activeTab, cartCount, onNavigate }: TabBarProps) {
  const { t } = useI18n();
  const layout = useResponsiveLayout();
  const shellWidth = Math.min(
    layout.width - layout.pagePadding * 2,
    layout.contentMaxWidth,
  );
  const shellLeft = Math.max(
    layout.pagePadding,
    Math.round((layout.width - shellWidth) / 2),
  );
  const shellStyle = {
    width: shellWidth,
    left: shellLeft,
    bottom: layout.isCompact ? spacing.sm : spacing.md,
    paddingHorizontal: layout.isCompact ? spacing.xs : spacing.sm,
    paddingVertical: layout.isCompact ? 6 : spacing.sm,
    borderRadius: layout.isCompact ? radius.lg : radius.xl,
  };
  const labelSize = layout.isCompact ? 11 : typography.small;
  const badgeSize = layout.isCompact ? 8 : 9;
  const indicatorWidth = layout.isCompact ? 20 : 24;
  const tabs: Array<{ key: TabId; label: string }> = [
    { key: 'home', label: t('tab.home') },
    { key: 'catalog', label: t('tab.catalog') },
    { key: 'cart', label: t('tab.cart') },
    { key: 'checkout', label: t('tab.checkout') },
  ];

  return (
    <View style={[styles.shell, shellStyle]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        const showBadge = tab.key === 'cart' && cartCount > 0;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            onPress={() => onNavigate(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              isActive && styles.tabActive,
              pressed && styles.tabPressed,
            ]}
          >
            <Text
              style={[
                styles.label,
                { fontSize: labelSize },
                isActive && styles.labelActive,
              ]}
            >
              {tab.label}
            </Text>
            {showBadge ? (
              <View style={styles.badge}>
                <Text style={[styles.badgeLabel, { fontSize: badgeSize }]}>
                  {cartCount}
                </Text>
              </View>
            ) : null}
            {isActive ? (
              <View style={[styles.activeIndicator, { width: indicatorWidth }]} />
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 15, 28, 0.96)',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
  },
  tabActive: {
    backgroundColor: colors.surfaceHighlight,
  },
  tabPressed: {
    opacity: 0.88,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: colors.text,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 10,
    minWidth: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeLabel: {
    color: colors.backgroundDeep,
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 6,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});
