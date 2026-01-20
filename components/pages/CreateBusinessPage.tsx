
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface CreateBusinessPageProps {
  navigate: (page: string, props?: Record<string, any>) => void;
}

const CreateBusinessPage: React.FC<CreateBusinessPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await api.createBusiness({ name, description, userId: user.id });
      navigate('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create business');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <h2 className="text-3xl font-bold text-white mb-6">{t('createNewBusiness')}</h2>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('businessName')}
            id="businessName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ex: Cafeteria Aconchego"
          />
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">{t('description')}</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Ex: Venda de cafés especiais e doces artesanais."
            ></textarea>
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={() => navigate('dashboard')}>
              {t('cancel')}
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {t('create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBusinessPage;
