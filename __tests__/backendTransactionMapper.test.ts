import {
  mapBackendTransactionStatus,
  mapBackendTransactionToTransactionSummary,
  mapBackendTransactionsToTransactionSummaries,
} from '../src/infrastructure/backend/backendTransactionMapper';

describe('backend transaction mapper', () => {
  it('maps provider statuses to frontend transaction statuses', () => {
    expect(mapBackendTransactionStatus('APPROVED')).toBe('completed');
    expect(mapBackendTransactionStatus('PENDING')).toBe('pending');
    expect(mapBackendTransactionStatus('DECLINED')).toBe('failed');
  });

  it('maps transactions without line items to an empty item count', () => {
    const summary = mapBackendTransactionToTransactionSummary({
      id: 7,
      reference: 'checkout-reference',
      totalAmount: 2500000,
      baseFee: 2500000,
      deliveryFee: 0,
      status: 'APPROVED',
      bankTransactionId: 'bank-7',
      createAt: '2026-07-12T00:00:00.000Z',
      updateAt: '2026-07-12T00:01:00.000Z',
    } as never);

    expect(summary).toMatchObject({
      transactionId: '7',
      number: 'checkout-reference',
      itemCount: 0,
      status: 'completed',
    });
  });

  it('maps multiple transactions to summaries', () => {
    const summaries = mapBackendTransactionsToTransactionSummaries([
      {
        id: 11,
        reference: 'remote-111',
        totalAmount: 1000,
        baseFee: 1000,
        deliveryFee: 0,
        status: 'DECLINED',
        createAt: '2026-07-12T00:00:00.000Z',
        updateAt: '2026-07-12T00:10:00.000Z',
        transactionProducts: [
          {
            id: 1,
            quantity: 2,
            unitAmount: 500,
            createAt: '2026-07-12T00:00:00.000Z',
            updateAt: '2026-07-12T00:00:00.000Z',
            product: {
              id: 1,
              name: 'Compact bag',
              description: 'Travel friendly',
              price: 500,
              stock: 4,
              image: null,
              createAt: '2026-07-12T00:00:00.000Z',
              updateAt: '2026-07-12T00:00:00.000Z',
            },
          },
        ],
      } as never,
    ]);

    expect(summaries).toEqual([
      expect.objectContaining({
        transactionId: '11',
        itemCount: 2,
        status: 'failed',
      }),
    ]);
  });
});
