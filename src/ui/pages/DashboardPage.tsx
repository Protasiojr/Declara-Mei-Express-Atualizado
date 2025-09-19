import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArchiveIcon, TrendingDownIcon, TrendingUpIcon, ArrowRightLeftIcon, FactoryIcon, WrenchIcon, UserCircleIcon, ClockIcon, ClipboardListIcon, TruckIcon } from '../components/icons';
import { useSettings } from '../../app/context/SettingsContext';
import { mockOrders, mockDeliveries, mockProducts } from '../../data/mocks';

const StatCard: React.FC<{ title: string; value: React.ReactNode; icon: React.ReactNode; status?: React.ReactNode; statusColor?: string }> = ({ title, value, icon, status, statusColor = 'text-green-400' }) => (
    <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
        <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            {icon}
        </div>
        <div className="text-3xl font-semibold text-white mt-2">{value}</div>
        {status && <div className={`text-xs mt-2 ${statusColor}`}>{status}</div>}
    </div>
);

const SalesSummary: React.FC = () => {
    const [activeTab, setActiveTab] = useState('daily');

    const renderContent = () => {
        switch (activeTab) {
            case 'monthly':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-400">Faturamento do Mês</p>
                            <p className="text-2xl font-semibold text-white mt-1">R$ 7.850,00</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Dia de Maior Venda</p>
                            <p className="text-2xl font-semibold text-white mt-1">23/07</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Ticket Médio Mensal</p>
                            <p className="text-2xl font-semibold text-white mt-1">R$ 85,32</p>
                        </div>
                    </div>
                );
            case 'annual':
                 return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                         <div>
                            <p className="text-sm text-gray-400">Faturamento Anual</p>
                            <p className="text-2xl font-semibold text-white mt-1">R$ 75.430,00</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Mês de Maior Venda</p>
                            <p className="text-2xl font-semibold text-white mt-1">Dezembro</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Meta Anual (81k)</p>
                            <p className="text-2xl font-semibold text-green-400 mt-1">93%</p>
                        </div>
                    </div>
                );
            case 'daily':
            default:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-sm text-gray-400">Vendas Hoje</p>
                            <p className="text-2xl font-semibold text-white mt-1">R$ 345,50</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Transações Hoje</p>
                            <p className="text-2xl font-semibold text-white mt-1">8</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Ticket Médio Hoje</p>
                            <p className="text-2xl font-semibold text-white mt-1">R$ 43,18</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-green-800 pb-4 mb-4">
                 <h3 className="text-lg font-semibold text-white mb-2 sm:mb-0">Resumo de Vendas</h3>
                 <div className="flex space-x-1 bg-green-950 p-1 rounded-lg self-start sm:self-center">
                    <button onClick={() => setActiveTab('daily')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'daily' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-green-800'}`}>Diário</button>
                    <button onClick={() => setActiveTab('monthly')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'monthly' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-green-800'}`}>Mensal</button>
                    <button onClick={() => setActiveTab('annual')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'annual' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-green-800'}`}>Anual</button>
                 </div>
            </div>
            {renderContent()}
        </div>
    );
};

const annualData = [
    { name: 'Jan', faturamento: 4000 }, { name: 'Fev', faturamento: 3000 },
    { name: 'Mar', faturamento: 5000 }, { name: 'Abr', faturamento: 4500 },
    { name: 'Mai', faturamento: 6000 }, { name: 'Jun', faturamento: 5500 },
    { name: 'Jul', faturamento: 7000 }, { name: 'Ago', faturamento: 6500 },
    { name: 'Set', faturamento: 7200 }, { name: 'Out', faturamento: 8000 },
    { name: 'Nov', faturamento: 7500 }, { name: 'Dez', faturamento: 9000 },
];

const topProducts = [
    { name: 'Produto A', sales: 150 }, { name: 'Produto B', sales: 120 },
    { name: 'Serviço X', sales: 110 }, { name: 'Produto C', sales: 95 },
];

const topClients = [
    { name: 'Cliente Feliz', value: 'R$ 2,500.00' }, { name: 'Empresa Parceira', value: 'R$ 1,800.00' },
    { name: 'Sr. Silva', value: 'R$ 1,250.00' }, { name: 'Dona Maria', value: 'R$ 980.00' },
];

const MeiLimitProgress: React.FC<{ currentRevenue: number; limit: number }> = ({ currentRevenue, limit }) => {
    const percentage = limit > 0 ? (currentRevenue / limit) * 100 : 0;

    const getProgressBarColor = () => {
        if (percentage > 90) return 'bg-red-500';
        if (percentage > 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
            <h3 className="text-lg font-semibold text-white mb-2">Progresso do Limite Anual MEI</h3>
            <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                <span>{formatCurrency(currentRevenue)}</span>
                <span className="font-bold">{percentage.toFixed(2)}%</span>
                <span>{formatCurrency(limit)}</span>
            </div>
            <div className="w-full bg-green-950 rounded-full h-4 border border-green-800 overflow-hidden">
                <div
                    className={`h-4 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
                    style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                ></div>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { meiLimit } = useSettings();
    const annualRevenue = annualData.reduce((sum, month) => sum + month.faturamento, 0);
    const newOrdersCount = mockOrders.filter(order => order.status === 'Aberto').length;
    const pendingDeliveriesCount = mockDeliveries.filter(delivery => delivery.status === 'Pendente').length;
    
    const lowStockProducts = useMemo(() => 
        mockProducts.filter(p => p.stock > 0 && p.stock <= p.minStock), 
    []);

    const outOfStockProducts = useMemo(() => 
        mockProducts.filter(p => p.stock <= 0), 
    []);

    const lowStockCount = lowStockProducts.length + outOfStockProducts.length;

    const topLowStockProducts = useMemo(() => 
        [...outOfStockProducts, ...lowStockProducts].slice(0, 10),
    [outOfStockProducts, lowStockProducts]);
    
    const [loginTime] = useState(new Date());
    const [cashierState, setCashierState] = useState({ isOpen: false, openTime: '' });
    const [sessionDuration, setSessionDuration] = useState('00:00:00');

    useEffect(() => {
        const checkCashierStatus = () => {
            try {
                const storedStatus = localStorage.getItem('cashierStatus');
                if (storedStatus) {
                    const { isOpen, openTime } = JSON.parse(storedStatus);
                    setCashierState({ isOpen, openTime });
                } else {
                    setCashierState({ isOpen: false, openTime: '' });
                }
            } catch (e) {
                console.error("Failed to parse cashierStatus from localStorage", e);
                setCashierState({ isOpen: false, openTime: '' });
            }
        };

        checkCashierStatus();
        window.addEventListener('storage', checkCashierStatus);

        return () => window.removeEventListener('storage', checkCashierStatus);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const diff = now.getTime() - loginTime.getTime();

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const format = (n: number) => n.toString().padStart(2, '0');

            setSessionDuration(`${format(hours)}:${format(minutes)}:${format(seconds)}`);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [loginTime]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>

            <div className="bg-green-900 p-4 rounded-lg shadow-md border border-green-800 flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-3">
                    <UserCircleIcon className="w-8 h-8 text-green-400 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-400">Usuário Logado</p>
                        <p className="font-semibold text-white">Administrador</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                     <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Tipo de Usuário</p>
                        <p className="font-semibold text-white">Admin</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ClockIcon className="w-8 h-8 text-green-400 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-gray-400">Tempo de Sessão</p>
                        <p className="font-semibold text-white font-mono">{sessionDuration}</p>
                    </div>
                </div>
            </div>

            <MeiLimitProgress currentRevenue={annualRevenue} limit={meiLimit} />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Estado do Caixa"
                    value={
                        <div className="flex items-center gap-2">
                            <span className={`relative flex h-3 w-3`}>
                                {cashierState.isOpen && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                <span className={`relative inline-flex rounded-full h-3 w-3 ${cashierState.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            </span>
                            <span>{cashierState.isOpen ? 'Aberto' : 'Fechado'}</span>
                        </div>
                    }
                    status={cashierState.isOpen ? `Desde ${cashierState.openTime}` : ''}
                    statusColor={cashierState.isOpen ? "text-green-400" : "text-gray-400"}
                    icon={<ArchiveIcon className={`w-6 h-6 ${cashierState.isOpen ? 'text-green-400' : 'text-red-400'}`} />}
                />
                <StatCard
                    title="Novos Pedidos"
                    value={newOrdersCount}
                    icon={<ClipboardListIcon className="w-6 h-6 text-blue-400" />}
                    status={
                        <Link to="/pedidos" className="font-semibold text-blue-400 hover:underline">
                            Ver pedidos
                        </Link>
                    }
                />
                <StatCard
                    title="Novas Entregas"
                    value={pendingDeliveriesCount}
                    icon={<TruckIcon className="w-6 h-6 text-blue-400" />}
                    status={
                        <Link to="/entregas" className="font-semibold text-blue-400 hover:underline">
                            Ver entregas
                        </Link>
                    }
                />
                <StatCard
                    title="Estoque Baixo"
                    value={lowStockCount}
                    icon={<ArchiveIcon className="w-6 h-6 text-yellow-400" />}
                    status={
                        <Link to="/estoque" className="font-semibold text-yellow-400 hover:underline">
                            Ver estoque
                        </Link>
                    }
                    statusColor="text-yellow-400"
                />
                <StatCard 
                    title="Contas a Pagar" 
                    value="R$ 1.250,00" 
                    status="3 vencendo hoje" 
                    statusColor="text-yellow-400"
                    icon={<TrendingDownIcon className="w-6 h-6 text-yellow-400" />}
                />
                <StatCard 
                    title="Contas a Receber" 
                    value="R$ 3.800,00" 
                    status="5 a receber hoje" 
                    statusColor="text-green-400" 
                    icon={<TrendingUpIcon className="w-6 h-6 text-green-400" />}
                />
                <StatCard 
                    title="Lucro do Mês" 
                    value="R$ 4.500,00" 
                    status="+15% vs Mês Anterior" 
                    icon={<TrendingUpIcon className="w-6 h-6 text-green-400" />}
                />
            </div>

            {/* Main Chart and Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Annual Revenue Chart */}
                <div className="lg:col-span-2 bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Resumo do Faturamento Anual</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={annualData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#166534" />
                                <XAxis dataKey="name" stroke="#6EE7B7" />
                                <YAxis stroke="#6EE7B7" />
                                <Tooltip contentStyle={{ backgroundColor: '#064E3B', border: '1px solid #166534' }} />
                                <Legend />
                                <Bar dataKey="faturamento" fill="#4ADE80" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Lists */}
                <div className="space-y-6">
                     <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Top 10 Produtos Mais Vendidos</h3>
                        <ul className="space-y-3">
                            {topProducts.map((p, i) => (
                                <li key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{p.name}</span>
                                    <span className="font-semibold text-green-400">{p.sales} vendas</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Top 10 Clientes Mais Ativos</h3>
                        <ul className="space-y-3">
                            {topClients.map((c, i) => (
                                <li key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{c.name}</span>
                                    <span className="font-semibold text-green-400">{c.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Top 10 Produtos com Estoque Baixo</h3>
                        <ul className="space-y-3">
                            {topLowStockProducts.length > 0 ? topLowStockProducts.map((p, i) => (
                                <li key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{p.name}</span>
                                    <span className={`font-semibold ${p.stock <= 0 ? 'text-red-400' : 'text-yellow-400'}`}>
                                        Estoque: {p.stock}
                                    </span>
                                </li>
                            )) : (
                                <li className="text-center text-gray-500">Nenhum produto com estoque baixo.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            
            <SalesSummary />

             {/* Sales Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatCard 
                    title="Revenda de Produtos" 
                    value="R$ 12.345,67" 
                    icon={<ArrowRightLeftIcon className="w-6 h-6 text-green-400" />} 
                />
                 <StatCard 
                    title="Produtos Industrializados" 
                    value="R$ 5.432,10" 
                    icon={<FactoryIcon className="w-6 h-6 text-green-400" />} 
                />
                 <StatCard 
                    title="Serviços Prestados" 
                    value="R$ 8.765,43" 
                    icon={<WrenchIcon className="w-6 h-6 text-green-400" />} 
                />
            </div>
        </div>
    );
};

export default DashboardPage;