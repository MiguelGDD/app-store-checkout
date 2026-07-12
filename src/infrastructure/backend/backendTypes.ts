export type BackendProductDto = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  createAt: string;
  updateAt: string;
};

export type BackendApiErrorPayload = {
  message?: string;
  error?: string;
  statusCode?: number;
};
