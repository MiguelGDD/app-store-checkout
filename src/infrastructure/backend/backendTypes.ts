import type { CardPaymentDetails } from '../../types';

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

export type BackendCustomerDto = {
  id: number;
  name?: string;
  email?: string;
};

export type BackendTransactionProductDto = {
  id: number;
  quantity: number;
  unitAmount: number;
  createAt: string;
  updateAt: string;
  product: BackendProductDto;
};

export type BackendTransactionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'DECLINED'
  | 'VOIDED'
  | 'ERROR';

export type BackendCreateTransactionInput = {
  customerId: number;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  payment: CardPaymentDetails;
  deliveryFee?: number;
};

export type BackendTransactionDto = {
  id: number;
  reference: string;
  totalAmount: number;
  baseFee: number;
  deliveryFee: number;
  status: BackendTransactionStatus;
  bankTransactionId: string | null;
  createAt: string;
  updateAt: string;
  customer?: BackendCustomerDto;
  transactionProducts?: BackendTransactionProductDto[];
};

export type BackendApiErrorPayload = {
  message?: string;
  error?: string;
  statusCode?: number;
};
