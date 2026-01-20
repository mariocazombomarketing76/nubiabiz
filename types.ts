
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
}

export enum TransactionType {
  SALE = 'SALE',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string;
  businessId: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
}

export interface Route {
    page: string;
    props?: Record<string, any>;
}
