
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard: React.FC<{ title: string; value: string; status?: string; statusColor?: string }> = ({ title, value, status, statusColor = 'text-green-400' }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className="text-3xl font-semibold text-white mt-2">{value}</p>
        {status && <p className={`text-xs mt-2 ${statusColor}`}>{status}</p>}
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
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-700 pb-4 mb-4">
                 <h3 className="text-lg font-semibold text-white mb-2 sm:mb-0">Resumo de Vendas</h3>
                 <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg self-start sm:self-center">
                    <button onClick={() => setActiveTab('daily')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'daily' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Diário</button>
                    <button onClick={() => setActiveTab('monthly')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Mensal</button>
                    <button onClick={() => setActiveTab('annual')} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${activeTab === 'annual' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Anual</button>
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

const DashboardPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Estado do Caixa" value="Aberto" status="Desde 08:00" statusColor="text-green-400" />
                <StatCard title="Contas a Pagar" value="R$ 1.250,00" status="3 vencendo hoje" statusColor="text-yellow-400"/>
                <StatCard title="Contas a Receber" value="R$ 3.800,00" status="5 a receber hoje" statusColor="text-green-400" />
                <StatCard title="Lucro do Mês" value="R$ 4.500,00" status="+15% vs Mês Anterior" />
            </div>

            {/* Main Chart and Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Annual Revenue Chart */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Resumo do Faturamento Anual</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={annualData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                <XAxis dataKey="name" stroke="#A0AEC0" />
                                <YAxis stroke="#A0AEC0" />
                                <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }} />
                                <Legend />
                                <Bar dataKey="faturamento" fill="#6366F1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Lists */}
                <div className="space-y-6">
                     <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Top 10 Produtos Mais Vendidos</h3>
                        <ul className="space-y-3">
                            {topProducts.map((p, i) => (
                                <li key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{p.name}</span>
                                    <span className="font-semibold text-indigo-400">{p.sales} vendas</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Top 10 Clientes Mais Ativos</h3>
                        <ul className="space-y-3">
                            {topClients.map((c, i) => (
                                <li key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">{c.name}</span>
                                    <span className="font-semibold text-indigo-400">{c.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            
            <SalesSummary />

             {/* Sales Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatCard title="Revenda de Produtos" value="R$ 12.345,67" />
                 <StatCard title="Produtos Industrializados" value="R$ 5.432,10" />
                 <StatCard title="Serviços Prestados" value="R$ 8.765,43" />
            </div>
        </div>
    );
};

export default DashboardPage;
