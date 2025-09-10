/**
 * Transaction/Payment model for admin dashboard
 * Based on the backend payments table schema
 */

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_method: PaymentMethod;
  reference_type: ReferenceType;
  reference_id: string;
  transaction_id: string | null;
  created_at: string | null;
  completed_at: string | null;
}

export type TransactionStatus = 
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'paypal'
  | 'stripe'
  | 'wallet'
  | 'other';

export type ReferenceType = 
  | 'post_boost'
  | 'subscription'
  | 'wallet_topup'
  | 'premium_feature'
  | 'other';

export interface TransactionFilters {
  status?: TransactionStatus;
  referenceType?: ReferenceType;
  paymentMethod?: PaymentMethod;
  currency?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'amount' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface TransactionSummary {
  totalTransactions: number;
  totalAmount: number;
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  currency: string;
  period: {
    from: string;
    to: string;
  };
}

// Backend response interfaces
interface BackendTransactionResponse {
  success: boolean;
  data: Transaction[];
  count: number;
}

interface BackendTransactionListResponse {
  success: boolean;
  data: {
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  };
  count: number;
}

// Export backend response types for service use
export type { BackendTransactionResponse, BackendTransactionListResponse };





