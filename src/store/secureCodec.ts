import CryptoJS from 'crypto-js';

const SECURE_KEY = 'store-checkout::transaction-v2';

export function encryptJson<T>(value: T): string {
  return CryptoJS.AES.encrypt(JSON.stringify(value), SECURE_KEY).toString();
}

export function decryptJson<T>(ciphertext: string): T {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECURE_KEY);
  const json = bytes.toString(CryptoJS.enc.Utf8);

  if (!json) {
    throw new Error('Unable to decrypt transaction payload.');
  }

  return JSON.parse(json) as T;
}

export function tryDecryptJson<T>(ciphertext: string | null): T | null {
  if (!ciphertext) {
    return null;
  }

  try {
    return decryptJson<T>(ciphertext);
  } catch {
    return null;
  }
}
