export type ScreenId =
  | 'home'
  | 'catalog'
  | 'productDetail'
  | 'cart'
  | 'checkout'
  | 'confirmation';

export type TabId = Exclude<ScreenId, 'productDetail' | 'confirmation'>;

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  badge: string;
  accent: string;
  imageUrl?: string | null;
};

export type CatalogStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type CatalogSource = 'demo' | 'backend';

export type CartMap = Record<string, number>;

export type OrderSummary = {
  number: string;
  itemCount: number;
  total: number;
};

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export type TransactionSensitiveData = {
  customerName: string;
  customerEmail: string;
  documentId: string;
  paymentToken: string;
  paymentReference: string;
};

export type TransactionSummary = OrderSummary & {
  transactionId: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
};

export type TransactionRecord = {
  summary: TransactionSummary;
  encryptedSensitiveData: string;
};

export type TransactionStateSnapshot = {
  latest: TransactionRecord | null;
  history: TransactionRecord[];
};

export type ResponsiveLayout = {
  width: number;
  isCompact: boolean;
  isWide: boolean;
  pagePadding: number;
  contentMaxWidth: number;
  gridColumns: number;
  bottomPadding: number;
  stackGap: number;
};

export type FlowStep = {
  title: string;
  description: string;
};

export type Metric = {
  label: string;
  value: string;
  description: string;
};
