import { useWindowDimensions } from 'react-native';

import type { ResponsiveLayout } from '../types';

type ResponsiveChoice<T> = {
  compact?: T;
  wide?: T;
  defaultValue: T;
};

export function resolveResponsiveChoice<T>(
  layout: Pick<ResponsiveLayout, 'isCompact' | 'isWide'>,
  choice: ResponsiveChoice<T>,
): T {
  if (layout.isCompact && choice.compact !== undefined) {
    return choice.compact;
  }

  if (layout.isWide && choice.wide !== undefined) {
    return choice.wide;
  }

  return choice.defaultValue;
}

export function createResponsiveLayout(width: number): ResponsiveLayout {
  const isCompact = width < 390;
  const isWide = width >= 720;
  const pagePadding = resolveResponsiveChoice(
    { isCompact, isWide },
    {
      compact: 16,
      wide: 28,
      defaultValue: 20,
    },
  );
  const contentMaxWidth = isWide ? 920 : 640;
  const gridColumns = width >= 620 ? 2 : 1;
  const bottomPadding = resolveResponsiveChoice(
    { isCompact, isWide },
    {
      compact: 128,
      wide: 160,
      defaultValue: 144,
    },
  );
  const stackGap = resolveResponsiveChoice(
    { isCompact, isWide },
    {
      compact: 12,
      wide: 20,
      defaultValue: 16,
    },
  );

  return {
    width,
    isCompact,
    isWide,
    pagePadding,
    contentMaxWidth,
    gridColumns,
    bottomPadding,
    stackGap,
  };
}

export function useResponsiveLayout(): ResponsiveLayout {
  const { width } = useWindowDimensions();

  return createResponsiveLayout(width);
}
