import { apiGet, apiPost } from './api';

export type TransactionType = 'expense' | 'income';

export interface TransactionDTO {
  _id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO from backend
  addedBy: string;
  category?: string;
}

export interface CreateTransactionInput {
  description: string;
  amount: number;
  type: TransactionType;
  date?: string; // optional ISO
  category?: string;
}

export async function getTransactions(): Promise<TransactionDTO[]> {
  // Backend route example: /transactions (protected)
  return apiGet<TransactionDTO[]>('/transactions');
}

export async function createTransaction(input: CreateTransactionInput): Promise<TransactionDTO> {
  return apiPost<TransactionDTO>('/transactions', input);
}
