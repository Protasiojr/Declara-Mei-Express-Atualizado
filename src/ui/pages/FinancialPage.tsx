import React, { useState } from 'react';
import { PlusCircleIcon } from '../components/icons';
import { mockPayables, mockReceivables } from '../../data/mocks';

const FinancialPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('payable');

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Financeiro</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-500/20 p-6 rounded-lg border border-red-500">
                    <h3 className="text-red-300">Total a Pagar</h3>
                    <p className="text-2xl font-bold text-white mt-1">R$ 1.250,00</p>
                </div>
                <div className="bg-green-500/20 p-6 rounded-lg border border-green-500">
                    <h3 className="text-green-300">Total a Receber</h3>
                    <p className="text-2xl font-bold text-white mt-1">R$ 420,00</p>
                </div>
                <div className="bg-blue-500/20 p-6 rounded-lg border border-blue-500">
                    <h3 className="text-blue-300">Saldo Previsto</h3>
                    <p className="text-2xl font-bold text-white mt-1">- R$ 830,00</p>
                </div>
            </div>
            
            <div className="flex justify-between items-center">
                 <div className="border-b border-green-800">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('payable')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payable' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                            Contas a Pagar
                        </button>
                        <button onClick={() => setActiveTab('receivable')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'receivable' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}>
                            Contas a Receber
                        </button>
                    </nav>
                </div>
                <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Adicionar Despesa
                </button>
            </div>

            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                {activeTab === 'payable' ? <PayablesTable /> : <ReceivablesTable />}
            </div>
        </div>
    );
};

const PayablesTable: React.FC = () => (
    <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-green-800">
            <tr>
                <th className="px-6 py-3">Descrição</th><th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Vencimento</th><th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Ações</th>
            </tr>
        </thead>
        <tbody>
            {mockPayables.map(p => (
                <tr key={p.id} className="border-b border-green-800 hover:bg-green-700">
                    <td className="px-6 py-4 text-white">{p.desc}</td><td className="px-6 py-4">{p.value}</td>
                    <td className="px-6 py-4">{p.due}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.paid ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                            {p.paid ? 'Pago' : 'Pendente'}
                        </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                         {!p.paid && <a href="#" className="font-medium text-green-400 hover:underline">Pagar</a>}
                         <a href="#" className="font-medium text-green-400 hover:underline">Editar</a>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const ReceivablesTable: React.FC = () => (
     <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-green-800">
            <tr>
                <th className="px-6 py-3">Descrição</th><th className="px-6 py-3">Valor</th>
                <th className="px-6 py-3">Vencimento</th><th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Ações</th>
            </tr>
        </thead>
        <tbody>
            {mockReceivables.map(r => (
                <tr key={r.id} className="border-b border-green-800 hover:bg-green-700">
                    <td className="px-6 py-4 text-white">{r.desc}</td><td className="px-6 py-4">{r.value}</td>
                    <td className="px-6 py-4">{r.due}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.received ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                            {r.received ? 'Recebido' : 'A receber'}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        {!r.received && <a href="#" className="font-medium text-green-400 hover:underline">Receber</a>}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default FinancialPage;