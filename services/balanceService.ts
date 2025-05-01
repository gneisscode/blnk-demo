import { axiosWithoutToken } from '@/utils/axios';

export interface Balance {
  balance_id: string;
  ledger_id: string;
  currency: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBalanceRequest {
  ledger_id: string;
  currency: string;
  amount?: number;
}

export const balanceService = {
  // Get all balances
  getAllBalances: async () => {
    const response = await axiosWithoutToken.get<Balance[]>('/api/balances');
    return response.data;
  },

  // Get a single balance by ID
  getBalance: async (balanceId: string) => {
    const response = await axiosWithoutToken.get<Balance>(`/api/balances?balanceId=${balanceId}`);
    return response.data;
  },

  // Create a new balance
  createBalance: async (data: CreateBalanceRequest) => {
    const response = await axiosWithoutToken.post<Balance>('/api/balances', data);
    return response.data;
  },

  // Get balances by ledger ID
  getBalancesByLedger: async (ledgerId: string) => {
    const response = await axiosWithoutToken.get<Balance[]>(`/api/balances?ledgerId=${ledgerId}`);
    return response.data;
  },

  // Get balance history
  getBalanceHistory: async (balanceId: string) => {
    const response = await axiosWithoutToken.get(`/api/balances?balanceId=${balanceId}&history=true`);
    return response.data;
  }
}; 