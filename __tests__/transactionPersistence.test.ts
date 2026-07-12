import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  decryptJson,
  encryptJson,
  tryDecryptJson,
} from '../src/store/secureCodec';
import {
  clearEncryptedTransactionSnapshot,
  loadEncryptedTransactionSnapshot,
  previewEncryptedTransactionSnapshot,
  saveEncryptedTransactionSnapshot,
} from '../src/store/transactionStorage';
import type { TransactionStateSnapshot } from '../src/types';

describe('secure codec', () => {
  it('encrypts and decrypts JSON payloads', () => {
    const payload = {
      customerName: 'Jane Doe',
      paymentReference: 'SC-001',
    };

    const ciphertext = encryptJson(payload);

    expect(ciphertext).toBeTruthy();
    expect(ciphertext).not.toContain('Jane Doe');
    expect(decryptJson<typeof payload>(ciphertext)).toEqual(payload);
  });

  it('returns null when decryption fails', () => {
    expect(tryDecryptJson(null)).toBeNull();
    expect(tryDecryptJson('not-a-valid-ciphertext')).toBeNull();
  });
});

describe('transaction storage', () => {
  const snapshot: TransactionStateSnapshot = {
    latest: {
      summary: {
        transactionId: 'txn-1',
        number: 'SC-001',
        itemCount: 2,
        total: 278000,
        status: 'completed',
        createdAt: '2026-07-12T00:00:00.000Z',
        updatedAt: '2026-07-12T00:20:00.000Z',
      },
      encryptedSensitiveData: encryptJson({
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        documentId: '123456789',
        paymentToken: 'token-1',
        paymentReference: 'SC-001',
      }),
    },
    history: [],
  };

  it('persists, loads, previews and clears encrypted snapshots', async () => {
    expect(await loadEncryptedTransactionSnapshot()).toBeNull();

    await saveEncryptedTransactionSnapshot(snapshot);

    const storedKeys = await AsyncStorage.getAllKeys();
    expect(storedKeys).toHaveLength(1);
    expect((await AsyncStorage.getItem(storedKeys[0]!)) ?? '').not.toContain('Jane Doe');

    const loaded = await loadEncryptedTransactionSnapshot();
    expect(loaded).toEqual(snapshot);

    expect(previewEncryptedTransactionSnapshot(snapshot)).toEqual(snapshot);

    await clearEncryptedTransactionSnapshot();
    expect(await loadEncryptedTransactionSnapshot()).toBeNull();
  });

  it('ignores invalid encrypted payloads', async () => {
    await AsyncStorage.setItem(
      '@store-checkout/transaction-snapshot',
      'invalid-ciphertext',
    );

    await expect(loadEncryptedTransactionSnapshot()).resolves.toBeNull();
  });
});
