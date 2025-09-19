import React from 'react';
import { useSettings } from '../../app/context/SettingsContext';

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

const SettingsPage: React.FC = () => {
    const { meiLimit, setMeiLimit, employeeLimit, setEmployeeLimit } = useSettings();

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white">Configurações</h1>
            
            <div className="space-y-8">
                <SettingsCard
                    title="Configurações Gerais"
                    description="Ajustes principais do sistema e regras de negócio do MEI."
                >
                    <div className="space-y-6">
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

                        <div>
                            <label htmlFor="employee-limit" className="block text-sm font-medium text-gray-300">
                                Limite de Funcionários Permitidos
                            </label>
                            <input
                                type="number"
                                id="employee-limit"
                                className="mt-1 block w-full bg-green-950 border-green-700 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500"
                                value={employeeLimit}
                                onChange={(e) => setEmployeeLimit(Number(e.target.value))}
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Altere a quantidade de funcionários de acordo com as regras atuais do MEI. Para 2025, o limite é de 1 funcionário.
                            </p>
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
                
                <div className="flex justify-end items-center">
                     <button
                        onClick={() => {if(confirm('Tem certeza que deseja salvar as alterações?')) alert('Configurações salvas!')}}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
                    >
                        Salvar Configurações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;