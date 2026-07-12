import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import type { ResponsiveLayout } from '../types';

type ScreenFrameProps = {
  layout: ResponsiveLayout;
  children: ReactNode;
};

export function ScreenFrame({ layout, children }: ScreenFrameProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: layout.pagePadding,
          paddingBottom: layout.bottomPadding,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.inner, { maxWidth: layout.contentMaxWidth }]}>
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
    paddingTop: 18,
  },
  inner: {
    width: '100%',
    gap: 18,
  },
});
