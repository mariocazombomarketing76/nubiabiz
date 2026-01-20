
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface LoginPageProps {
  navigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const [email, setEmail] = useState('demo@nubiabiz.com');
  const [password, setPassword] = useState('password'); // Mock password
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">{t('loginTitle')}</h2>
          <p className="mt-2 text-center text-sm text-gray-400">{t('loginWelcome')}</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div>
            <Button type="submit" isLoading={isLoading} fullWidth>
              {t('login')}
            </Button>
          </div>
        </form>
         <p className="mt-2 text-center text-sm text-gray-400">
            {t('registerPrompt')}{' '}
            <button onClick={() => navigate('register')} className="font-medium text-primary-400 hover:text-primary-300">
                {t('register')}
            </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
