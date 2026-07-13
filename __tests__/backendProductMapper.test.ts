import {
  mapBackendProductToProduct,
  mapBackendProductsToProducts,
} from '../src/infrastructure/backend/backendProductMapper';

describe('backend product mapper', () => {
  it('maps stock ranges to the expected badges and accent colors', () => {
    const products = mapBackendProductsToProducts([
      {
        id: 1,
        name: 'Compact bag',
        description: 'Travel friendly',
        price: 120000,
        stock: 5,
        image: null,
        createAt: '2026-07-12T00:00:00.000Z',
        updateAt: '2026-07-12T00:00:00.000Z',
      },
      {
        id: 2,
        name: 'Audio buds',
        description: 'Noise cancelling',
        price: 220000,
        stock: 10,
        image: 'https://example.com/audio-buds.png',
        createAt: '2026-07-12T00:00:00.000Z',
        updateAt: '2026-07-12T00:00:00.000Z',
      },
    ]);

    expect(products[0]).toMatchObject({
      id: '1',
      badge: 'Popular',
      accent: expect.any(String),
    });
    expect(products[1]).toMatchObject({
      id: '2',
      badge: 'Recomendado',
      imageUrl: 'https://example.com/audio-buds.png',
    });
  });

  it('maps low stock products to the low stock badge', () => {
    const product = mapBackendProductToProduct(
      {
        id: 3,
        name: 'Laptop sleeve',
        description: 'Protective case',
        price: 89000,
        stock: 2,
        image: null,
        createAt: '2026-07-12T00:00:00.000Z',
        updateAt: '2026-07-12T00:00:00.000Z',
      },
      0,
    );

    expect(product.badge).toBe('Stock bajo');
    expect(product.id).toBe('3');
  });
});
