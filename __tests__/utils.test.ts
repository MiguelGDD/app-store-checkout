import { createResponsiveLayout } from '../src/utils/responsive';
import {
  detectCardBrand,
  isValidCardHolder,
  isValidCardNumber,
  isValidCvc,
  isValidExpiry,
  passesLuhnCheck,
} from '../src/utils/cardValidation';
import {
  formatCurrency,
  formatOrderNumber,
  formatQuantity,
} from '../src/utils/format';

describe('credit card validation', () => {
  test('detects VISA and both Mastercard ranges', () => {
    expect(detectCardBrand('4242 4242')).toBe('visa');
    expect(detectCardBrand('5555 5555')).toBe('mastercard');
    expect(detectCardBrand('2221 0000')).toBe('mastercard');
    expect(detectCardBrand('3400 0000')).toBe('unknown');
  });

  test('requires a supported card with a valid Luhn checksum', () => {
    expect(passesLuhnCheck('')).toBe(false);
    expect(passesLuhnCheck('4242424242424242')).toBe(true);
    expect(isValidCardNumber('4242424242424242')).toBe(true);
    expect(isValidCardNumber('5555555555554444')).toBe(true);
    expect(isValidCardNumber('4242424242424241')).toBe(false);
    expect(isValidCardNumber('378282246310005')).toBe(false);
  });

  test('validates holder, expiry and CVC structure', () => {
    const now = new Date('2026-07-12T00:00:00.000Z');

    expect(isValidCardHolder('Ana Perez')).toBe(true);
    expect(isValidCardHolder('Ana')).toBe(false);
    expect(isValidExpiry('07-26', now)).toBe(false);
    expect(isValidExpiry('07/26', now)).toBe(true);
    expect(isValidExpiry('07/2x', now)).toBe(false);
    expect(isValidExpiry('06/26', now)).toBe(false);
    expect(isValidExpiry('13/29', now)).toBe(false);
    expect(
      isValidExpiry(
        {
          split: () => [undefined, undefined],
        } as never,
        now,
      ),
    ).toBe(false);
    expect(
      isValidExpiry(
        {
          split: () => ['07', undefined],
        } as never,
        now,
      ),
    ).toBe(false);
    expect(isValidCvc('123', 'visa')).toBe(true);
    expect(isValidCvc('12', 'visa')).toBe(false);
    expect(isValidCvc('1234', 'mastercard')).toBe(false);
    expect(isValidCvc('123', 'unknown')).toBe(false);
  });
});

describe('format helpers', () => {
  test('formats currency in COP style', () => {
    expect(formatCurrency(189000)).toBe('COP 189.000');
  });

  test('formats quantities with pluralization', () => {
    expect(formatQuantity(1)).toBe('1 producto');
    expect(formatQuantity(3)).toBe('3 productos');
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
