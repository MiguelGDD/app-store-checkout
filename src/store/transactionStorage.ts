import AsyncStorage from '@react-native-async-storage/async-storage';

import type { TransactionStateSnapshot } from '../types';
import { decryptJson, encryptJson, tryDecryptJson } from './secureCodec';

const STORAGE_KEY = '@store-checkout/transaction-snapshot';

export async function loadEncryptedTransactionSnapshot(): Promise<TransactionStateSnapshot | null> {
  const ciphertext = await AsyncStorage.getItem(STORAGE_KEY);

  if (!ciphertext) {
    return null;
  }

  return tryDecryptJson<TransactionStateSnapshot>(ciphertext);
}

export async function saveEncryptedTransactionSnapshot(
  snapshot: TransactionStateSnapshot,
): Promise<void> {
  const ciphertext = encryptJson(snapshot);
  await AsyncStorage.setItem(STORAGE_KEY, ciphertext);
}

export async function clearEncryptedTransactionSnapshot(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function previewEncryptedTransactionSnapshot(
  snapshot: TransactionStateSnapshot,
): TransactionStateSnapshot {
  const ciphertext = encryptJson(snapshot);
  return decryptJson<TransactionStateSnapshot>(ciphertext);
}
