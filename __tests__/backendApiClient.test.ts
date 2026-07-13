import {
  BackendApiError,
  createBackendStoreApiClient,
} from '../src/infrastructure/backend/backendApiClient';
import { backendConfig } from '../src/infrastructure/backend/backendConfig';

type MockResponse = {
  ok: boolean;
  status: number;
  text: jest.Mock<Promise<string>, []>;
};

function createResponse(status: number, body: string): MockResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: jest.fn().mockResolvedValue(body),
  };
}

describe('backend api client', () => {
  const globalWithFetch = globalThis as unknown as {
    fetch?: typeof fetch;
  };
  const originalFetch = globalWithFetch.fetch;

  afterEach(() => {
    globalWithFetch.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('loads backend products from the API', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      createResponse(
        200,
        JSON.stringify([
          {
            id: 1,
            name: 'Laptop',
            description: 'Lightweight laptop',
            price: 4200000,
            stock: 7,
            image: 'https://example.com/laptop.png',
            createAt: '2026-07-12T00:00:00.000Z',
            updateAt: '2026-07-12T00:00:00.000Z',
          },
        ]),
      ),
    );

    globalWithFetch.fetch = fetchMock as unknown as typeof fetch;

    const client = createBackendStoreApiClient();
    const products = await client.getProducts();

    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      id: 1,
      name: 'Laptop',
      stock: 7,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      `${backendConfig.baseUrl}/products`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'x-api-key': backendConfig.apiKey,
        }),
      }),
    );
  });

  it('loads backend transactions from the API', async () => {
    const transactions = [
      {
        id: 7,
        reference: 'checkout-reference',
        totalAmount: 2500000,
        baseFee: 2500000,
        deliveryFee: 0,
        status: 'APPROVED',
        bankTransactionId: 'bank-7',
        customer: {
          id: 1,
          name: 'Ana Perez',
        },
        transactionProducts: [
          {
            id: 11,
            quantity: 2,
            unitAmount: 1250000,
            createAt: '2026-07-12T00:00:00.000Z',
            updateAt: '2026-07-12T00:00:00.000Z',
            product: {
              id: 1,
              name: 'Laptop',
              description: 'Lightweight laptop',
              price: 1250000,
              stock: 7,
              image: 'https://example.com/laptop.png',
              createAt: '2026-07-12T00:00:00.000Z',
              updateAt: '2026-07-12T00:00:00.000Z',
            },
          },
        ],
        createAt: '2026-07-12T00:00:00.000Z',
        updateAt: '2026-07-12T00:01:00.000Z',
      },
    ];
    const fetchMock = jest
      .fn()
      .mockResolvedValue(createResponse(200, JSON.stringify(transactions)));
    globalWithFetch.fetch = fetchMock as unknown as typeof fetch;

    const client = createBackendStoreApiClient();

    await expect(client.getTransactions()).resolves.toEqual(transactions);
    expect(fetchMock).toHaveBeenCalledWith(
      `${backendConfig.baseUrl}/transactions`,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'x-api-key': backendConfig.apiKey,
        }),
      }),
    );
  });

  it('creates a backend payment transaction', async () => {
    const transaction = {
      id: 7,
      reference: 'checkout-reference',
      totalAmount: 2500000,
      baseFee: 2500000,
      deliveryFee: 0,
      status: 'APPROVED',
      bankTransactionId: 'bank-7',
      createAt: '2026-07-12T00:00:00.000Z',
      updateAt: '2026-07-12T00:01:00.000Z',
    };
    const request = {
      customerId: 1,
      deliveryFee: 0,
      items: [{ productId: 1, quantity: 1 }],
      payment: {
        number: '4242424242424242',
        expMonth: '12',
        expYear: '29',
        cvc: '123',
        cardHolder: 'Ana Perez',
      },
    };
    const fetchMock = jest
      .fn()
      .mockResolvedValue(createResponse(201, JSON.stringify(transaction)));
    globalWithFetch.fetch = fetchMock as unknown as typeof fetch;

    const client = createBackendStoreApiClient();

    await expect(client.createTransaction(request)).resolves.toEqual(
      transaction,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `${backendConfig.baseUrl}/transactions`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(request),
        headers: expect.objectContaining({
          'x-api-key': backendConfig.apiKey,
        }),
      }),
    );
  });

  it('throws a typed error when the API rejects the request', async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      createResponse(
        500,
        JSON.stringify({
          message: 'Backend unavailable',
          statusCode: 500,
        }),
      ),
    );

    globalWithFetch.fetch = fetchMock as unknown as typeof fetch;

    const client = createBackendStoreApiClient();

    await expect(client.getProducts()).rejects.toMatchObject({
      name: 'BackendApiError',
      message: 'Backend unavailable',
      status: 500,
    });
  });

  it('throws when fetch is not available', async () => {
    globalWithFetch.fetch = undefined;

    const client = createBackendStoreApiClient();

    await expect(client.getProducts()).rejects.toBeInstanceOf(BackendApiError);
  });
});
