
import type { User, Business, Transaction } from '../types';
import { TransactionType } from '../types';
import type { LoginCredentials, RegisterData, NewBusinessData, NewTransactionData } from './apiTypes';

// --- Helper Functions ---
const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const setToStorage = <T,>(key: string, value: T): void => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
};

// --- Initial Mock Data ---
const initialUsers: User[] = [
    { id: 'user-1', name: 'Demo User', email: 'demo@nubiabiz.com' },
];
const initialBusinesses: Business[] = [
    { id: 'biz-1', userId: 'user-1', name: 'Coffee Shop Moderno', description: 'Venda de cafés especiais e lanches gourmet.', createdAt: new Date().toISOString() },
    { id: 'biz-2', userId: 'user-1', name: 'Consultoria de TI', description: 'Serviços de tecnologia para pequenas empresas.', createdAt: new Date().toISOString() },
];
const initialTransactions: Transaction[] = [
    { id: 'txn-1', businessId: 'biz-1', description: 'Venda de 2 cappuccinos', amount: 18.00, type: TransactionType.SALE, date: new Date(Date.now() - 86400000).toISOString() },
    { id: 'txn-2', businessId: 'biz-1', description: 'Compra de grãos de café', amount: 150.00, type: TransactionType.EXPENSE, date: new Date(Date.now() - 172800000).toISOString() },
    { id: 'txn-3', businessId: 'biz-2', description: 'Projeto de website', amount: 2500.00, type: TransactionType.SALE, date: new Date().toISOString() },
];

// --- Initialize Storage ---
const usersDB = getFromStorage<User[]>('nubia_users', initialUsers);
const businessesDB = getFromStorage<Business[]>('nubia_businesses', initialBusinesses);
const transactionsDB = getFromStorage<Transaction[]>('nubia_transactions', initialTransactions);
const sessionDB = getFromStorage<{ userId: string | null }>('nubia_session', { userId: null });

// --- API Functions ---

export const api = {
    async login({ email, password }: LoginCredentials): Promise<User> {
        await simulateDelay(500);
        // Password check is omitted in this mock
        const user = usersDB.find(u => u.email === email);
        if (user) {
            sessionDB.userId = user.id;
            setToStorage('nubia_session', sessionDB);
            return user;
        }
        throw new Error('Invalid credentials');
    },

    async register({ name, email, password }: RegisterData): Promise<User> {
        await simulateDelay(500);
        if (usersDB.some(u => u.email === email)) {
            throw new Error('Email already in use');
        }
        const newUser: User = { id: `user-${Date.now()}`, name, email };
        usersDB.push(newUser);
        setToStorage('nubia_users', usersDB);
        sessionDB.userId = newUser.id;
        setToStorage('nubia_session', sessionDB);
        return newUser;
    },

    async logout(): Promise<void> {
        await simulateDelay(200);
        sessionDB.userId = null;
        setToStorage('nubia_session', sessionDB);
    },

    async getCurrentUser(): Promise<User | null> {
        await simulateDelay(100);
        if (sessionDB.userId) {
            return usersDB.find(u => u.id === sessionDB.userId) || null;
        }
        return null;
    },

    async getBusinessesForUser(userId: string): Promise<Business[]> {
        await simulateDelay(500);
        return businessesDB.filter(b => b.userId === userId);
    },

    async getBusinessById(businessId: string): Promise<Business | null> {
        await simulateDelay(300);
        return businessesDB.find(b => b.id === businessId) || null;
    },

    async createBusiness({ name, description, userId }: NewBusinessData): Promise<Business> {
        await simulateDelay(500);
        const newBusiness: Business = {
            id: `biz-${Date.now()}`,
            userId,
            name,
            description,
            createdAt: new Date().toISOString(),
        };
        businessesDB.push(newBusiness);
        setToStorage('nubia_businesses', businessesDB);
        return newBusiness;
    },

    async getTransactionsForBusiness(businessId: string): Promise<Transaction[]> {
        await simulateDelay(400);
        return transactionsDB.filter(t => t.businessId === businessId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    async addTransaction({ businessId, description, amount, type }: NewTransactionData): Promise<Transaction> {
        await simulateDelay(300);
        const newTransaction: Transaction = {
            id: `txn-${Date.now()}`,
            businessId,
            description,
            amount,
            type,
            date: new Date().toISOString(),
        };
        transactionsDB.push(newTransaction);
        setToStorage('nubia_transactions', transactionsDB);
        return newTransaction;
    },
};
