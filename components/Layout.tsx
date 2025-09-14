
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import {
    HomeIcon, UsersIcon, ShoppingCartIcon, PackageIcon, DollarSignIcon,
    BuildingIcon, UserCircleIcon, FileTextIcon, SettingsIcon, LogOutIcon, ChevronDownIcon
} from './icons';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/funcionarios', label: 'Funcionário', icon: UsersIcon },
    { path: '/clientes', label: 'Clientes', icon: UsersIcon },
    { path: '/pdv', label: 'PDV', icon: ShoppingCartIcon },
    { path: '/produtos', label: 'Produtos', icon: PackageIcon },
    { path: '/financeiro', label: 'Financeiro', icon: DollarSignIcon },
    { path: '/empresa', label: 'Empresa', icon: BuildingIcon },
    { path: '/perfil', label: 'Perfil', icon: UserCircleIcon },
    { path: '/relatorios', label: 'Relatório', icon: FileTextIcon },
    { path: '/configuracoes', label: 'Configuração', icon: SettingsIcon },
];

const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col border-r border-gray-700">
            <div className="h-16 flex items-center justify-center border-b border-gray-700">
                <h1 className="text-xl font-bold text-white">Declara Mei Express</h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                                isActive ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <p className="text-xs text-gray-500">Desenvolvido por João Protásio Jr.</p>
                <p className="text-xs text-gray-500">Versão 1.0</p>
            </div>
        </aside>
    );
};

const Header: React.FC = () => {
    const { logout } = useAuth();
    return (
        <header className="h-16 bg-gray-800 text-gray-300 flex items-center justify-end px-6 border-b border-gray-700">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button className="flex items-center space-x-2">
                        <img className="w-8 h-8 rounded-full" src="https://picsum.photos/100" alt="User" />
                        <span>Admin</span>
                        <ChevronDownIcon className="w-4 h-4" />
                    </button>
                </div>
                <button onClick={logout} className="p-2 rounded-full hover:bg-gray-700" title="Sair">
                    <LogOutIcon className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-800 text-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
