
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import CustomersPage from './pages/CustomersPage';
import EmployeesPage from './pages/EmployeesPage';
import PdvPage from './pages/PdvPage';
import ProductsPage from './pages/ProductsPage';
import FinancialPage from './pages/FinancialPage';
import CompanyPage from './pages/CompanyPage';
import ProfilePage from './pages/ProfilePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Company Context
interface CompanyContextType {
  logo: string | null;
  setLogo: (logo: string | null) => void;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logo, setLogoState] = useState<string | null>(null);

  useEffect(() => {
    const storedLogo = localStorage.getItem('companyLogo');
    if (storedLogo) {
      setLogoState(storedLogo);
    }
  }, []);

  const setLogo = (newLogo: string | null) => {
    setLogoState(newLogo);
    if (newLogo) {
      localStorage.setItem('companyLogo', newLogo);
    } else {
      localStorage.removeItem('companyLogo');
    }
  };

  return (
    <CompanyContext.Provider value={{ logo, setLogo }}>
      {children}
    </CompanyContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CompanyProvider>
        <AppRoutes />
      </CompanyProvider>
    </AuthProvider>
  );
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
                                    <Route path="/funcionarios" element={<EmployeesPage />} />
                                    {/* FIX: Corrected typo from `e_lement` to `element` */}
                                    <Route path="/clientes" element={<CustomersPage />} />
                                    <Route path="/pdv" element={<PdvPage />} />
                                    <Route path="/produtos" element={<ProductsPage />} />
                                    <Route path="/financeiro" element={<FinancialPage />} />
                                    <Route path="/empresa" element={<CompanyPage />} />
                                    <Route path="/perfil" element={<ProfilePage />} />
                                    <Route path="/relatorios" element={<ReportsPage />} />
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

export default App;
