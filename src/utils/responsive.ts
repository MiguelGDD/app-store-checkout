import { useWindowDimensions } from 'react-native';

import type { ResponsiveLayout } from '../types';

export function createResponsiveLayout(width: number): ResponsiveLayout {
  const isCompact = width < 390;
  const isWide = width >= 720;
  const pagePadding = isCompact ? 16 : width < 600 ? 20 : 24;
  const contentMaxWidth = isWide ? 920 : 640;
  const gridColumns = width >= 620 ? 2 : 1;
  const bottomPadding = isWide ? 152 : 140;

  return {
    width,
    isCompact,
    isWide,
    pagePadding,
    contentMaxWidth,
    gridColumns,
    bottomPadding,
    stackGap: isCompact ? 12 : 16,
  };
}

export function useResponsiveLayout(): ResponsiveLayout {
  const { width } = useWindowDimensions();

  return createResponsiveLayout(width);
}
