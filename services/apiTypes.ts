
import { TransactionType } from '../types';

export type LoginCredentials = {
    email: string;
    password?: string; // Password not used in mock
};

export type RegisterData = {
    name: string;
    email: string;
    password?: string; // Password not used in mock
};

export type NewBusinessData = {
    name: string;
    description: string;
    userId: string;
};

export type NewTransactionData = {
    businessId: string;
    description: string;
    amount: number;
    type: TransactionType;
};
