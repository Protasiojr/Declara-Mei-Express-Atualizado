
import React, { useState } from 'react';
import { useAuth } from '../App';

const SettingsCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700">
        <div className="p-6">
            <h3 className="text-lg font-semibold leading-6 text-white">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{description}</p>
        </div>
        <div className="border-t border-gray-700 p-6">
            {children}
        </div>
    </div>
);

const SettingsPage: React.FC = () => {
    const { logout } = useAuth();
    const [meiLimit, setMeiLimit] = useState(81000);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white">Configurações</h1>
            
            <div className="space-y-8">
                <SettingsCard
                    title="Configurações Gerais"
                    description="Ajustes principais do sistema."
                >
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="mei-limit" className="block text-sm font-medium text-gray-300">
                                Limite de Faturamento MEI [2025]
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-600 bg-gray-700 text-gray-400 sm:text-sm">
                                    R$
                                </span>
                                <input
                                    type="number"
                                    id="mei-limit"
                                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md bg-gray-900 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white"
                                    value={meiLimit}
                                    onChange={(e) => setMeiLimit(Number(e.target.value))}
                                />
                            </div>
                             <p className="mt-2 text-xs text-gray-500">Este valor pode ser alterado pelo Administrador do Sistema.</p>
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
                            <input type="email" defaultValue="gestor@empresa.com" className="mt-1 block w-full bg-gray-900 border-gray-600 rounded-md text-white" />
                        </div>
                        <button className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600">
                            <span>Logar com a conta Google</span>
                        </button>
                    </div>
                </SettingsCard>
                
                <div className="flex justify-between items-center">
                     <button
                        onClick={() => {if(confirm('Tem certeza que deseja salvar as alterações?')) alert('Configurações salvas!')}}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
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
