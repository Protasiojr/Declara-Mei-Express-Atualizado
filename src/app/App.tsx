


import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import { ProfileProvider } from './context/ProfileContext';
import { SettingsProvider } from './context/SettingsContext';

import MainLayout from '../ui/components/Layout';
import DashboardPage from '../ui/pages/DashboardPage';
import LoginPage from '../ui/pages/LoginPage';
import CustomersPage from '../ui/pages/CustomersPage';
import EmployeesPage from '../ui/pages/EmployeesPage';
import PdvPage from '../ui/pages/PdvPage';
import ProductsPage from '../ui/pages/ProductsPage';
import StockPage from '../ui/pages/StockPage';
import FinancialPage from '../ui/pages/FinancialPage';
import CompanyPage from '../ui/pages/CompanyPage';
import ProfilePage from '../ui/pages/ProfilePage';
import ReportsPage from '../ui/pages/ReportsPage';
import SettingsPage from '../ui/pages/SettingsPage';
import SuppliersPage from '../ui/pages/SuppliersPage';
import DasPage from '../ui/pages/DasPage';
import NotaFiscalPage from '../ui/pages/NotaFiscalPage';
import PromotionsPage from '../ui/pages/PromotionsPage';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="/dashboard" element={<DashboardPage />} />
                                    <Route path="/pdv" element={<PdvPage />} />
                                    <Route path="/clientes" element={<CustomersPage />} />
                                    <Route path="/fornecedores" element={<SuppliersPage />} />
                                    <Route path="/produtos" element={<ProductsPage />} />
                                    <Route path="/promocoes" element={<PromotionsPage />} />
                                    <Route path="/estoque" element={<StockPage />} />
                                    <Route path="/financeiro" element={<FinancialPage />} />
                                    <Route path="/funcionarios" element={<EmployeesPage />} />
                                    <Route path="/relatorios" element={<ReportsPage />} />
                                    <Route path="/nota-fiscal" element={<NotaFiscalPage />} />
                                    <Route path="/das" element={<DasPage />} />
                                    <Route path="/empresa" element={<CompanyPage />} />
                                    <Route path="/perfil" element={<ProfilePage />} />
                                    <Route path="/configuracoes" element={<SettingsPage />} />
                                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                </Routes>
                            </MainLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </HashRouter>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CompanyProvider>
        <ProfileProvider>
            <SettingsProvider>
                <AppRoutes />
            </SettingsProvider>
        </ProfileProvider>
      </CompanyProvider>
    </AuthProvider>
  );
};

export default App;
