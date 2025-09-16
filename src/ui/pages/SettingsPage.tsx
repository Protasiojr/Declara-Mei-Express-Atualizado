import React, { useState } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useSettings } from '../../app/context/SettingsContext';

interface DasGuide {
    id: string;
    period: string;
    value: number;
    dueDate: string;
    status: 'Pago';
}

const mockPaidDas: DasGuide[] = [
    { id: 'das1', period: '06/2024', value: 175.44, dueDate: '20/07/2024', status: 'Pago' },
    { id: 'das2', period: '05/2024', value: 174.44, dueDate: '20/06/2024', status: 'Pago' },
    { id: 'das3', period: '04/2024', value: 174.44, dueDate: '20/05/2024', status: 'Pago' },
];

const SettingsCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-green-900 rounded-lg shadow-md border border-green-800">
        <div className="p-6">
            <h3 className="text-lg font-semibold leading-6 text-white">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        <div className="border-t border-green-800 p-6">
            {children}
        </div>
    </div>
);

const DasGenerationModal: React.FC<{ isOpen: boolean; onClose: () => void; onGenerate: (period: { month: string, year: string }) => void; }> = ({ isOpen, onClose, onGenerate }) => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate({ month: month.toString().padStart(2, '0'), year: year.toString() });
    };

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-md border border-green-800">
                <div className="p-6 border-b border-green-800">
                    <h2 className="text-2xl font-bold text-white">Gerar Guia DAS</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="das-month" className="block text-sm font-medium text-gray-300">Mês de Apuração</label>
                            <select
                                id="das-month"
                                value={month}
                                onChange={(e) => setMonth(Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md text-white"
                            >
                                {months.map((m, index) => (
                                    <option key={index} value={index + 1}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="das-year" className="block text-sm font-medium text-gray-300">Ano de Apuração</label>
                            <input
                                type="number"
                                id="das-year"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md text-white"
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-green-950/50 border-t border-green-800 rounded-b-lg flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">
                            Cancelar
                        </button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">
                            Gerar DAS
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const SettingsPage: React.FC = () => {
    const { logout } = useAuth();
    const { meiLimit, setMeiLimit } = useSettings();
    const [isDasModalOpen, setIsDasModalOpen] = useState(false);
    const [paidDasList, setPaidDasList] = useState<DasGuide[]>(mockPaidDas);

    const handleGenerateDas = (period: { month: string, year: string }) => {
        setIsDasModalOpen(false);
        alert(`Guia DAS para o período ${period.month}/${period.year} gerada com sucesso! Simulação de download iniciada.`);
        
        const newDas: DasGuide = {
            id: `das${Date.now()}`,
            period: `${period.month}/${period.year}`,
            value: 176.44, // Mock value
            dueDate: `20/${String(Number(period.month) + 1).padStart(2, '0')}/${period.year}`,
            status: 'Pago',
        };
        setPaidDasList(prevList => [newDas, ...prevList]);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white">Configurações</h1>

            <DasGenerationModal
                isOpen={isDasModalOpen}
                onClose={() => setIsDasModalOpen(false)}
                onGenerate={handleGenerateDas}
            />
            
            <div className="space-y-8">
                <SettingsCard
                    title="Configurações Gerais"
                    description="Ajustes principais do sistema."
                >
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="mei-limit" className="block text-sm font-medium text-gray-300">
                                Limite de Faturamento MEI Anual
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-green-700 bg-green-800 text-gray-400 sm:text-sm">
                                    R$
                                </span>
                                <input
                                    type="number"
                                    id="mei-limit"
                                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md bg-green-950 border-green-700 focus:border-green-500 focus:ring-green-500 sm:text-sm text-white"
                                    value={meiLimit}
                                    onChange={(e) => setMeiLimit(Number(e.target.value))}
                                />
                            </div>
                             <p className="mt-2 text-xs text-gray-500">Este valor é usado no Dashboard para calcular o progresso do faturamento.</p>
                        </div>
                    </div>
                </SettingsCard>

                <SettingsCard
                    title="Configurações do DAS (Simples Nacional)"
                    description="Configure a integração para gerar a guia de recolhimento mensal (DAS) e consulte o histórico de guias pagas."
                >
                    <div className="space-y-6">
                        <h4 className="text-md font-semibold text-gray-200">Configuração da API</h4>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-300">Client ID da API</label>
                                <input type="password" placeholder="••••••••••••••••" className="mt-1 block w-full bg-green-950 border-green-700 rounded-md text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Client Secret da API</label>
                                <input type="password" placeholder="••••••••••••••••" className="mt-1 block w-full bg-green-950 border-green-700 rounded-md text-white" />
                            </div>
                        </div>
                        <div className="text-right">
                             <button
                                onClick={() => setIsDasModalOpen(true)}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
                            >
                                Gerar DAS
                            </button>
                        </div>

                        <div className="border-t border-green-700 pt-4">
                             <h4 className="text-md font-semibold text-gray-200 mb-4">Histórico de Guias Pagas</h4>
                             <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-300">
                                    <thead className="text-xs text-gray-400 uppercase bg-green-800/50">
                                        <tr>
                                            <th scope="col" className="px-4 py-2">Período</th>
                                            <th scope="col" className="px-4 py-2">Valor</th>
                                            <th scope="col" className="px-4 py-2">Vencimento</th>
                                            <th scope="col" className="px-4 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paidDasList.length > 0 ? paidDasList.map(das => (
                                            <tr key={das.id} className="border-b border-green-800/50">
                                                <td className="px-4 py-3 font-medium text-white">{das.period}</td>
                                                <td className="px-4 py-3">R$ {das.value.toFixed(2)}</td>
                                                <td className="px-4 py-3">{das.dueDate}</td>
                                                <td className="px-4 py-3">
                                                     <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                                                        {das.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-gray-500">Nenhuma guia paga encontrada.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </SettingsCard>
                
                <SettingsCard
                    title="Configurações de Email"
                    description="Configure o email para envio de relatórios e notificações."
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email do Gestor</label>
                            <input type="email" defaultValue="gestor@empresa.com" className="mt-1 block w-full bg-green-950 border-green-700 rounded-md text-white" />
                        </div>
                        <button className="flex items-center space-x-2 bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
                            <span>Logar com a conta Google</span>
                        </button>
                    </div>
                </SettingsCard>
                
                <div className="flex justify-between items-center">
                     <button
                        onClick={() => {if(confirm('Tem certeza que deseja salvar as alterações?')) alert('Configurações salvas!')}}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
                    >
                        Salvar Configurações
                    </button>
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700"
                    >
                        Sair do Sistema
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;