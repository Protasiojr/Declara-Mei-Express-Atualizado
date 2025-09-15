

import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';
import { useCompany } from '../../app/context/CompanyContext';
import {
    HomeIcon, UsersIcon, ShoppingCartIcon, PackageIcon, DollarSignIcon,
    BuildingIcon, UserCircleIcon, FileTextIcon, SettingsIcon, LogOutIcon, ChevronDownIcon,
    ArchiveIcon, TruckIcon, MenuIcon
} from './icons';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/pdv', label: 'PDV', icon: ShoppingCartIcon },
    { path: '/clientes', label: 'Clientes', icon: UsersIcon },
    { path: '/fornecedores', label: 'Fornecedores', icon: TruckIcon },
    { path: '/produtos', label: 'Produtos', icon: PackageIcon },
    { path: '/estoque', label: 'Estoque', icon: ArchiveIcon },
    { path: '/financeiro', label: 'Financeiro', icon: DollarSignIcon },
    { path: '/funcionarios', label: 'Funcionário', icon: UsersIcon },
    { path: '/relatorios', label: 'Relatório', icon: FileTextIcon },
    { path: '/empresa', label: 'Empresa', icon: BuildingIcon },
    { path: '/perfil', label: 'Perfil', icon: UserCircleIcon },
    { path: '/configuracoes', label: 'Configuração', icon: SettingsIcon },
];

const Sidebar: React.FC<{ isSidebarOpen: boolean, setIsSidebarOpen: (isOpen: boolean) => void }> = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { logo } = useCompany();
    const location = useLocation();

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname, setIsSidebarOpen]);


    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-60 z-30 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
                aria-hidden="true"
            ></div>
            <aside className={`fixed inset-y-0 left-0 w-64 bg-green-950 text-gray-300 flex flex-col border-r border-green-800 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="pt-4 pb-2 border-b border-green-800 text-center">
                    <h1 className="text-xl font-bold text-white">Declara Mei Express</h1>
                    {logo && (
                        <div className="px-4 py-4">
                            <img src={logo} alt="Logo da Empresa" className="max-w-full h-auto mx-auto my-2 rounded-md max-h-56" />
                        </div>
                    )}
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                                    isActive ? 'bg-green-600 text-white' : 'hover:bg-green-800 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 mr-3" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-green-800">
                    <p className="text-xs text-gray-500">Desenvolvido por João Protásio Jr.</p>
                    <p className="text-xs text-gray-500">Versão 1.0</p>
                </div>
            </aside>
        </>
    );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { logout } = useAuth();
    return (
        <header className="h-16 bg-green-900 text-gray-300 flex items-center justify-between lg:justify-end px-4 sm:px-6 border-b border-green-800">
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-md hover:bg-green-800 text-gray-300"
                aria-label="Abrir menu"
            >
                <MenuIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button className="flex items-center space-x-2">
                        <img className="w-8 h-8 rounded-full" src="https://picsum.photos/100" alt="User" />
                        <span>Admin</span>
                        <ChevronDownIcon className="w-4 h-4" />
                    </button>
                </div>
                <button onClick={logout} className="p-2 rounded-full hover:bg-green-800" title="Sair">
                    <LogOutIcon className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="min-h-screen bg-green-900 text-gray-100">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-green-900 p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;