export type CardBrand = 'visa' | 'mastercard' | 'unknown';

export function normalizeCardNumber(value: string): string {
  return value.replace(/\D/g, '');
}

export function detectCardBrand(value: string): CardBrand {
  const digits = normalizeCardNumber(value);

  if (digits.startsWith('4')) {
    return 'visa';
  }

  const firstTwoDigits = Number(digits.slice(0, 2));
  if (digits.length >= 2 && firstTwoDigits >= 51 && firstTwoDigits <= 55) {
    return 'mastercard';
  }

  const firstFourDigits = Number(digits.slice(0, 4));
  if (
    digits.length >= 4 &&
    firstFourDigits >= 2221 &&
    firstFourDigits <= 2720
  ) {
    return 'mastercard';
  }

  return 'unknown';
}

export function passesLuhnCheck(value: string): boolean {
  const digits = normalizeCardNumber(value);

  if (!digits) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function isValidCardNumber(value: string): boolean {
  const digits = normalizeCardNumber(value);
  const brand = detectCardBrand(digits);
  const hasValidLength =
    brand === 'visa'
      ? [13, 16, 19].includes(digits.length)
      : brand === 'mastercard' && digits.length === 16;

  return hasValidLength && passesLuhnCheck(digits);
}

export function isValidCardHolder(value: string): boolean {
  const names = value.trim().split(/\s+/).filter(Boolean);
  return names.length >= 2 && names.every(name => name.length >= 2);
}

export function isValidExpiry(value: string, now = new Date()): boolean {
  const [monthValue, yearValue] = value.split('/');

  if (
    !/^(0[1-9]|1[0-2])$/.test(monthValue ?? '') ||
    !/^\d{2}$/.test(yearValue ?? '')
  ) {
    return false;
  }

  const month = Number(monthValue);
  const year = 2000 + Number(yearValue);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return year > currentYear || (year === currentYear && month >= currentMonth);
}

export function isValidCvc(value: string, brand: CardBrand): boolean {
  return brand !== 'unknown' && /^\d{3}$/.test(value);
}
