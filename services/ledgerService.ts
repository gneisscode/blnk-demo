import { axiosWithoutToken } from '@/utils/axios';

export interface Ledger {
  ledger_id: string;
  name: string;
  meta_data?: {
    project_owner?: string;
    description?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateLedgerRequest {
  name: string;
  meta_data?: {
    project_owner?: string;
    description?: string;
    [key: string]: any;
  };
}

export const ledgerService = {
  // Get all ledgers
  getAllLedgers: async () => {
    const response = await axiosWithoutToken.get<Ledger[]>('/api/ledgers');
    return response.data;
  },

  // Get a single ledger by ID
  getLedger: async (ledgerId: string) => {
    const response = await axiosWithoutToken.get<Ledger>(`/api/ledgers?ledgerId=${ledgerId}`);
    return response.data;
  },

  // Create a new ledger
  createLedger: async (data: CreateLedgerRequest) => {
    const response = await axiosWithoutToken.post<Ledger>('/api/ledgers', {
      name: data.name,
      meta_data: data.meta_data || {}
    });
    return response.data;
  },

  // Update a ledger
  updateLedger: async (ledgerId: string, data: Partial<CreateLedgerRequest>) => {
    const response = await axiosWithoutToken.patch<Ledger>(`/api/ledgers?ledgerId=${ledgerId}`, {
      name: data.name,
      meta_data: data.meta_data
    });
    return response.data;
  },

  // Delete a ledger
  deleteLedger: async (ledgerId: string) => {
    await axiosWithoutToken.delete(`/api/ledgers?ledgerId=${ledgerId}`);
  }
}; 