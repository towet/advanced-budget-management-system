export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  amount: number;
  spent: number;
  category: string;
  period: 'monthly' | 'yearly';
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  receipt?: string;
  budgetId?: string;
}

export interface Income {
  id: string;
  userId: string;
  amount: number;
  source: string;
  date: string;
  recurring: boolean;
  budgetId?: string;
}