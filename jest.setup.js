/* eslint-env jest */

const mockAsyncStorageMemory = new Map();

jest.mock('@react-native-async-storage/async-storage', () => {
  const mockStorage = {
    getItem: jest.fn(async (key) => mockAsyncStorageMemory.get(key) ?? null),
    setItem: jest.fn(async (key, value) => {
      mockAsyncStorageMemory.set(key, value);
    }),
    removeItem: jest.fn(async (key) => {
      mockAsyncStorageMemory.delete(key);
    }),
    clear: jest.fn(async () => {
      mockAsyncStorageMemory.clear();
    }),
    getAllKeys: jest.fn(async () => Array.from(mockAsyncStorageMemory.keys())),
    multiGet: jest.fn(async (keys) =>
      keys.map((key) => [key, mockAsyncStorageMemory.get(key) ?? null]),
    ),
    multiSet: jest.fn(async (entries) => {
      entries.forEach(([key, value]) => {
        mockAsyncStorageMemory.set(key, value);
      });
    }),
    multiRemove: jest.fn(async (keys) => {
      keys.forEach((key) => {
        mockAsyncStorageMemory.delete(key);
      });
    }),
  };

  return {
    __esModule: true,
    default: mockStorage,
  };
});

beforeEach(() => {
  mockAsyncStorageMemory.clear();
});
