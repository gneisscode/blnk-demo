import { axiosWithoutToken } from '@/utils/axios';

export interface Transaction {
  transaction_id: string;
  ledger_id: string;
  source_balance_id: string;
  destination_balance_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionRequest {
  ledger_id: string;
  source_balance_id: string;
  destination_balance_id: string;
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

export const transactionService = {
  // Get all transactions
  getAllTransactions: async () => {
    const response = await axiosWithoutToken.get<Transaction[]>('/api/transactions');
    return response.data;
  },

  // Get a single transaction by ID
  getTransaction: async (transactionId: string) => {
    const response = await axiosWithoutToken.get<Transaction>(`/api/transactions?transactionId=${transactionId}`);
    return response.data;
  },

  // Create a new transaction
  createTransaction: async (data: CreateTransactionRequest) => {
    const response = await axiosWithoutToken.post<Transaction>('/api/transactions', data);
    return response.data;
  },

  // Get transactions by ledger ID
  getTransactionsByLedger: async (ledgerId: string) => {
    const response = await axiosWithoutToken.get<Transaction[]>(`/api/transactions?ledgerId=${ledgerId}`);
    return response.data;
  },

  // Get transactions by balance ID
  getTransactionsByBalance: async (balanceId: string) => {
    const response = await axiosWithoutToken.get<Transaction[]>(`/api/transactions?balanceId=${balanceId}`);
    return response.data;
  },

  // Hold a transaction (create pending transaction)
  holdTransaction: async (data: CreateTransactionRequest) => {
    const response = await axiosWithoutToken.post<Transaction>('/api/transactions?action=hold', data);
    return response.data;
  },

  // Commit a held transaction
  commitTransaction: async (transactionId: string) => {
    const response = await axiosWithoutToken.post<Transaction>(`/api/transactions?transactionId=${transactionId}&action=commit`);
    return response.data;
  },

  // Void a held transaction
  voidTransaction: async (transactionId: string) => {
    const response = await axiosWithoutToken.post<Transaction>(`/api/transactions?transactionId=${transactionId}&action=void`);
    return response.data;
  }
}; 