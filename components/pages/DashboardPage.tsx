
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../services/api';
import type { Business, Transaction } from '../../types';
import { TransactionType } from '../../types';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface DashboardPageProps {
  navigate: (page: string, props?: Record<string, any>) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [financials, setFinancials] = useState<Record<string, { sales: number; expenses: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const userBusinesses = await api.getBusinessesForUser(user.id);
        setBusinesses(userBusinesses);

        const financialData: Record<string, { sales: number; expenses: number }> = {};
        for (const business of userBusinesses) {
            const transactions = await api.getTransactionsForBusiness(business.id);
            financialData[business.id] = transactions.reduce((acc, curr) => {
                if (curr.type === TransactionType.SALE) acc.sales += curr.amount;
                if (curr.type === TransactionType.EXPENSE) acc.expenses += curr.amount;
                return acc;
            }, { sales: 0, expenses: 0 });
        }
        setFinancials(financialData);
      } catch (error) {
        console.error("Failed to fetch businesses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, [user]);

  const sortedBusinesses = useMemo(() => {
    return [...businesses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [businesses]);

  const formatCurrency = (value: number) => {
      return new Intl.NumberFormat( 'pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">{t('myBusinesses')}</h2>
        <Button onClick={() => navigate('create-business')}>{t('createNewBusiness')}</Button>
      </div>

      {sortedBusinesses.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-lg">
          <p className="text-gray-400">{t('noBusinesses')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBusinesses.map(business => {
            const bizFinancials = financials[business.id] || { sales: 0, expenses: 0 };
            const balance = bizFinancials.sales - bizFinancials.expenses;
            return (
              <div 
                key={business.id}
                onClick={() => navigate('business-details', { businessId: business.id })}
                className="bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer transition-transform hover:scale-105 hover:bg-gray-700/50"
              >
                <h3 className="text-xl font-semibold text-primary-400 truncate">{business.name}</h3>
                <p className="text-gray-400 mt-2 h-10 overflow-hidden">{business.description}</p>
                <div className="mt-6 border-t border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('totalSales')}</span>
                    <span className="font-medium text-green-400">{formatCurrency(bizFinancials.sales)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('totalExpenses')}</span>
                    <span className="font-medium text-red-400">{formatCurrency(bizFinancials.expenses)}</span>
                  </div>
                   <div className="flex justify-between font-bold text-base">
                    <span className="text-gray-300">{t('balance')}</span>
                    <span className={balance >= 0 ? 'text-blue-400' : 'text-red-400'}>{formatCurrency(balance)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
