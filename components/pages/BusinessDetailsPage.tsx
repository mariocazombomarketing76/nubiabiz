
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../services/api';
import type { Business, Transaction } from '../../types';
import { TransactionType } from '../../types';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import Input from '../ui/Input';

interface BusinessDetailsPageProps {
  navigate: (page: string, props?: Record<string, any>) => void;
  businessId?: string;
}

const TransactionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (desc: string, amount: number) => void;
  type: TransactionType;
}> = ({ isOpen, onClose, onSave, type }) => {
    const { t } = useLanguage();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    const handleSave = () => {
        if(description && amount) {
            onSave(description, parseFloat(amount));
            setDescription('');
            setAmount('');
        }
    }
    
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md m-4">
                <h3 className="text-xl font-bold mb-4">{type === TransactionType.SALE ? t('registerSale') : t('registerExpense')}</h3>
                <div className="space-y-4">
                    <Input label={t('description')} value={description} onChange={e => setDescription(e.target.value)} />
                    <Input label={t('amount')} type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="secondary" onClick={onClose}>{t('cancel')}</Button>
                    <Button onClick={handleSave}>{t('save')}</Button>
                </div>
            </div>
        </div>
    )
}


const BusinessDetailsPage: React.FC<BusinessDetailsPageProps> = ({ navigate, businessId }) => {
  const { t } = useLanguage();
  const [business, setBusiness] = useState<Business | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>(TransactionType.SALE);

  const fetchData = useCallback(async () => {
    if (!businessId) {
        navigate('dashboard');
        return;
    }
    try {
        setLoading(true);
        const [bizDetails, bizTransactions] = await Promise.all([
            api.getBusinessById(businessId),
            api.getTransactionsForBusiness(businessId),
        ]);
        setBusiness(bizDetails);
        setTransactions(bizTransactions);
    } catch (error) {
        console.error("Failed to fetch business details", error);
    } finally {
        setLoading(false);
    }
  }, [businessId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const { totalSales, totalExpenses, balance } = useMemo(() => {
      return transactions.reduce((acc, tx) => {
          if(tx.type === TransactionType.SALE) acc.totalSales += tx.amount;
          else acc.totalExpenses += tx.amount;
          acc.balance = acc.totalSales - acc.totalExpenses;
          return acc;
      }, { totalSales: 0, totalExpenses: 0, balance: 0 });
  }, [transactions]);
  
  const handleAddTransaction = async (description: string, amount: number) => {
      if(!businessId) return;
      await api.addTransaction({ businessId, description, amount, type: modalType });
      setIsModalOpen(false);
      fetchData(); // Refresh data
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!business) {
    return <p className="text-center text-gray-400">Business not found.</p>;
  }

  return (
    <div className="container mx-auto">
        <TransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddTransaction} type={modalType} />
        <button onClick={() => navigate('dashboard')} className="text-primary-400 hover:text-primary-300 mb-4">&larr; {t('dashboard')}</button>
        <h2 className="text-3xl font-bold text-white mb-2">{business.name}</h2>
        <p className="text-gray-400 mb-8">{business.description}</p>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg"><div className="text-sm text-gray-400">{t('totalSales')}</div><div className="text-2xl font-bold text-green-400">{formatCurrency(totalSales)}</div></div>
            <div className="bg-gray-800 p-4 rounded-lg"><div className="text-sm text-gray-400">{t('totalExpenses')}</div><div className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</div></div>
            <div className="bg-gray-800 p-4 rounded-lg"><div className="text-sm text-gray-400">{t('balance')}</div><div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-400' : 'text-red-400'}`}>{formatCurrency(balance)}</div></div>
        </div>

        {/* Actions & History */}
        <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{t('transactionsHistory')}</h3>
                <div className="space-x-2">
                    <Button onClick={() => { setModalType(TransactionType.SALE); setIsModalOpen(true); }}>{t('registerSale')}</Button>
                    <Button variant="secondary" onClick={() => { setModalType(TransactionType.EXPENSE); setIsModalOpen(true); }}>{t('registerExpense')}</Button>
                </div>
            </div>
            
            {transactions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{t('noTransactions')}</p>
            ) : (
                <div className="flow-root">
                    <ul role="list" className="-mb-8">
                        {transactions.map((tx, txIdx) => (
                            <li key={tx.id}>
                                <div className="relative pb-8">
                                    {txIdx !== transactions.length - 1 ? <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-600" aria-hidden="true" /> : null}
                                    <div className="relative flex space-x-3 items-center">
                                        <div>
                                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-gray-800 ${tx.type === TransactionType.SALE ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {tx.type === TransactionType.SALE ? '💰' : '💸'}
                                            </span>
                                        </div>
                                        <div className="flex min-w-0 flex-1 justify-between space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-300">{tx.description}</p>
                                                <p className="mt-0.5 text-xs text-gray-500">{formatDate(tx.date)}</p>
                                            </div>
                                            <div className={`text-right text-sm font-semibold whitespace-nowrap ${tx.type === TransactionType.SALE ? 'text-green-400' : 'text-red-400'}`}>
                                                {tx.type === TransactionType.EXPENSE && '-'}{formatCurrency(tx.amount)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
  );
};

export default BusinessDetailsPage;
