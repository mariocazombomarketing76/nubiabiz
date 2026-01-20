
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface RegisterPageProps {
  navigate: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register({ name, email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="absolute top-4 right-4">
        <Button onClick={toggleLanguage} variant="ghost">
          {language === 'pt' ? 'EN' : 'PT'}
        </Button>
      </div>
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-4xl font-bold text-primary-400">NubiaBiz</h1>
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">{t('registerTitle')}</h2>
          <p className="mt-2 text-center text-sm text-gray-400">{t('registerWelcome')}</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <Input
              id="name"
              type="text"
              label={t('name')}
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              id="email"
              type="email"
              label={t('email')}
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              type="password"
              label={t('password')}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <Button type="submit" isLoading={isLoading} fullWidth>
              {t('register')}
            </Button>
          </div>
        </form>
         <p className="mt-2 text-center text-sm text-gray-400">
            {t('loginPrompt')}{' '}
            <button onClick={() => navigate('login')} className="font-medium text-primary-400 hover:text-primary-300">
                {t('login')}
            </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
