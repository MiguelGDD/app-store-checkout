import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { ResponsiveLayout } from '../types';
import { resolveResponsiveChoice } from '../utils/responsive';

type ScreenFrameProps = {
  layout: ResponsiveLayout;
  children: ReactNode;
};

export function ScreenFrame({ layout, children }: ScreenFrameProps) {
  const contentPaddingTop = resolveResponsiveChoice(layout, {
    compact: 12,
    wide: 20,
    defaultValue: 16,
  });
  const contentContainerStyle = {
    paddingHorizontal: layout.pagePadding,
    paddingBottom: layout.bottomPadding,
    paddingTop: contentPaddingTop,
  };
  const innerStyle = {
    maxWidth: layout.contentMaxWidth,
    gap: layout.stackGap,
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.inner, innerStyle]}>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 16,
  },
  inner: {
    width: '100%',
  },
});
