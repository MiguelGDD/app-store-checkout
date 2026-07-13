import { BACKEND_API_KEY, BACKEND_BASE_URL } from '@env';

export const backendConfig = {
  baseUrl: BACKEND_BASE_URL.replace(/\/+$/, ''),
  apiKey: BACKEND_API_KEY,
  customerId: 1,
  deliveryFee: 0,
};
