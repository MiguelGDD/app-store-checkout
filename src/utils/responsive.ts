import { useWindowDimensions } from 'react-native';

import type { ResponsiveLayout } from '../types';

export function createResponsiveLayout(width: number): ResponsiveLayout {
  const isCompact = width < 390;
  const isWide = width >= 720;
  let pagePadding = 20;

  if (isCompact) {
    pagePadding = 16;
  } else if (isWide) {
    pagePadding = 28;
  }

  const contentMaxWidth = isWide ? 920 : 640;
  const gridColumns = width >= 620 ? 2 : 1;
  const bottomPadding = isWide ? 160 : isCompact ? 128 : 144;

  return {
    width,
    isCompact,
    isWide,
    pagePadding,
    contentMaxWidth,
    gridColumns,
    bottomPadding,
    stackGap: isCompact ? 12 : isWide ? 20 : 16,
  };
}

export function useResponsiveLayout(): ResponsiveLayout {
  const { width } = useWindowDimensions();

  return createResponsiveLayout(width);
}
