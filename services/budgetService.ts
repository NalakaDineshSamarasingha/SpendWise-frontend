import { apiDelete, apiGet, apiPost, apiPut } from './api';

export type TimeframeType = 'weekly' | 'monthly' | 'custom';

export interface CategoryBudget {
  category: string; // use canonical category name (e.g., 'Food')
  limit: number; // positive number in the same currency as transactions
}

export interface Budget {
  id: string;
  name: string;
  timeframe: TimeframeType;
  // Date-only strings in local timezone, formatted as YYYY-MM-DD
  startDate?: string;
  endDate?: string;
  categories: CategoryBudget[];
  createdAt: string; // ISO or date-only
}

export async function listBudgets(): Promise<Budget[]> {
  const list = await apiGet<Budget[]>('/budget');
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface CreateBudgetInput {
  name: string;
  timeframe: TimeframeType;
  // Date-only strings in local timezone, formatted as YYYY-MM-DD
  startDate: string;
  endDate: string;
  categories: CategoryBudget[];
}

export async function createBudget(input: CreateBudgetInput): Promise<Budget> {
  // server expects timeframe, start/end, categories; returns DTO with id
  return apiPost<Budget>('/budget', input);
}

export async function updateBudget(id: string, patch: Partial<Omit<Budget, 'id' | 'createdAt'>>): Promise<Budget | undefined> {
  return apiPut<Budget>(`/budget/${id}`, patch);
}

export async function deleteBudget(id: string): Promise<void> {
  await apiDelete(`/budget/${id}`);
}

export function isDateInRange(isoDate: string, startDateStr?: string, endDateStr?: string): boolean {
  const d = new Date(isoDate).getTime();
  const s = startDateStr ? parseBudgetStartMs(startDateStr) : Number.NEGATIVE_INFINITY;
  const e = endDateStr ? parseBudgetEndMs(endDateStr) : Number.POSITIVE_INFINITY;
  return d >= s && d <= e;
}

export function getActiveBudgetsForDate(budgets: Budget[], dateIso: string): Budget[] {
  return budgets.filter(b => isDateInRange(dateIso, b.startDate, b.endDate));
}

// removed generateId: IDs come from server

// Helpers to interpret stored budget date strings robustly (supports YYYY-MM-DD or full ISO)
export function parseBudgetStartMs(dateStr: string): number {
  if (dateStr.includes('T')) {
    // legacy full ISO string
    const d = new Date(dateStr);
    return d.getTime();
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
  return dt.getTime();
}

export function parseBudgetEndMs(dateStr: string): number {
  if (dateStr.includes('T')) {
    // legacy full ISO string
    const d = new Date(dateStr);
    return d.getTime();
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, 23, 59, 59, 999);
  return dt.getTime();
}
