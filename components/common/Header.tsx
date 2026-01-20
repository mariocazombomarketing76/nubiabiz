
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import Button from '../ui/Button';

interface HeaderProps {
  navigate: (page: string, props?: Record<string, any>) => void;
}

const Header: React.FC<HeaderProps> = ({ navigate }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    navigate('login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  if (!user) {
    return null;
  }

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold text-primary-400 cursor-pointer"
              onClick={() => navigate('dashboard')}
            >
              NubiaBiz
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={toggleLanguage} variant="ghost">
              {language === 'pt' ? 'EN' : 'PT'}
            </Button>
            <Button onClick={handleLogout} variant="secondary">
              {t('logout')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
