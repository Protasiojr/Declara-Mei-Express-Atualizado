import React from 'react';

const Card: React.FC<{ title: string; description?: string; children: React.ReactNode; }> = ({ title, description, children }) => (
    <div className="bg-green-900 rounded-lg shadow-md border border-green-800">
        <div className="p-6">
            <h3 className="text-lg font-semibold leading-6 text-white">{title}</h3>
            {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
        </div>
        <div className="border-t border-green-800 p-6">
            {children}
        </div>
    </div>
);

const NotaFiscalPage: React.FC = () => {

    const handleSaveApiConfig = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Configurações da API salvas com sucesso! (Simulação)');
    };
    
    const handleIssueInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        if(confirm('Tem certeza que deseja emitir esta Nota Fiscal?')) {
            alert('Nota Fiscal emitida com sucesso! (Simulação)');
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white">Emissão de Nota Fiscal</h1>

            <div className="space-y-8">
                <Card
                    title="Configuração da API de Emissão"
                    description="Insira suas credenciais para se conectar ao serviço de emissão de notas fiscais do MEI."
                >
                    <form onSubmit={handleSaveApiConfig} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Client ID da API</label>
                            <input type="password" placeholder="••••••••••••••••" className="mt-1 block w-full bg-green-950 border-green-700 rounded-md text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Client Secret da API</label>
                            <input type="password" placeholder="••••••••••••••••" className="mt-1 block w-full bg-green-950 border-green-700 rounded-md text-white" />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
                            >
                                Salvar Configuração
                            </button>
                        </div>
                    </form>
                </Card>
                
                <Card title="Emitir Nova Nota Fiscal">
                     <form onSubmit={handleIssueInvoice} className="space-y-4">
                        <div>
                            <label htmlFor="customer" className="block text-sm font-medium text-gray-300">
                                Tomador do Serviço (Cliente)
                            </label>
                             <input
                                type="text"
                                id="customer"
                                placeholder="Digite para buscar um cliente cadastrado"
                                className="mt-1 block w-full bg-green-950 border-green-700 rounded-md text-white"
                            />
                        </div>
                         <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                                Descrição do Serviço / Venda
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                placeholder="Ex: Venda de Produto X e Prestação de Serviço Y"
                                className="mt-1 block w-full bg-green-950 border-green-700 rounded-md text-white"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="value" className="block text-sm font-medium text-gray-300">
                                Valor da Nota
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-green-700 bg-green-800 text-gray-400 sm:text-sm">
                                    R$
                                </span>
                                <input
                                    type="number"
                                    id="value"
                                    step="0.01"
                                    placeholder="0,00"
                                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md bg-green-950 border-green-700 focus:border-green-500 focus:ring-green-500 sm:text-sm text-white"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 text-base"
                            >
                                Emitir Nota Fiscal
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default NotaFiscalPage;
