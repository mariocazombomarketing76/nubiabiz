
import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import DashboardPage from './components/pages/DashboardPage';
import CreateBusinessPage from './components/pages/CreateBusinessPage';
import BusinessDetailsPage from './components/pages/BusinessDetailsPage';
import Header from './components/common/Header';
import { Route } from './types';

const AppContent: React.FC = () => {
    const { user, loading } = useAuth();
    const [route, setRoute] = useState<Route>({ page: 'dashboard' });

    const navigate = useCallback((page: string, props?: Record<string, any>) => {
        setRoute({ page, props });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                {/* Spinner can be added here if desired */}
            </div>
        );
    }
    
    if (!user) {
        let CurrentPage;
        switch (route.page) {
            case 'register':
                CurrentPage = <RegisterPage navigate={navigate} />;
                break;
            default:
                CurrentPage = <LoginPage navigate={navigate} />;
        }
        return (
             <div className="min-h-screen bg-gray-900">
                {CurrentPage}
            </div>
        )
    }

    const renderPage = () => {
        switch (route.page) {
            case 'dashboard':
                return <DashboardPage navigate={navigate} />;
            case 'create-business':
                return <CreateBusinessPage navigate={navigate} />;
            case 'business-details':
                return <BusinessDetailsPage navigate={navigate} businessId={route.props?.businessId} />;
            default:
                return <DashboardPage navigate={navigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <Header navigate={navigate} />
            <main className="p-4 sm:p-6 lg:p-8">
                {renderPage()}
            </main>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </LanguageProvider>
    );
};

export default App;
