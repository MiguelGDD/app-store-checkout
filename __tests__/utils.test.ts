import { createResponsiveLayout } from '../src/utils/responsive';
import { formatCurrency, formatOrderNumber, formatQuantity } from '../src/utils/format';

describe('format helpers', () => {
  test('formats currency in COP style', () => {
    expect(formatCurrency(189000)).toBe('COP 189.000');
  });

  test('formats quantities with pluralization', () => {
    expect(formatQuantity(1)).toBe('1 item');
    expect(formatQuantity(3)).toBe('3 items');
  });

  test('formats order numbers with leading zeros', () => {
    expect(formatOrderNumber(7)).toBe('SC-007');
  });
});

describe('responsive layout', () => {
  test('keeps compact layout for small widths', () => {
    const layout = createResponsiveLayout(375);

    expect(layout.isCompact).toBe(true);
    expect(layout.gridColumns).toBe(1);
    expect(layout.pagePadding).toBe(16);
  });

  test('switches to two columns on larger widths', () => {
    const layout = createResponsiveLayout(768);

    expect(layout.isWide).toBe(true);
    expect(layout.gridColumns).toBe(2);
    expect(layout.contentMaxWidth).toBe(920);
  });
});
