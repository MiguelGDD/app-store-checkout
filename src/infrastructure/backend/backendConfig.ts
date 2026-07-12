import { BACKEND_BASE_URL } from '@env';

export const backendConfig = {
  baseUrl: BACKEND_BASE_URL.replace(/\/+$/, ''),
  apiKey: 'change-me',
  customerId: 1,
  deliveryFee: 0,
};
