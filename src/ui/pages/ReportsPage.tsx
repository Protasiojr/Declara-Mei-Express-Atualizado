import React from 'react';

const ReportCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const DateRangePicker: React.FC = () => (
    <div className="flex items-center space-x-4">
        <div>
            <label className="text-sm text-gray-400">Data Inicial</label>
            <input type="date" className="w-full bg-green-800 border-green-700 rounded-md text-white" />
        </div>
        <div>
            <label className="text-sm text-gray-400">Data Final</label>
            <input type="date" className="w-full bg-green-800 border-green-700 rounded-md text-white" />
        </div>
    </div>
);

const GenerateButton: React.FC<{ label?: string }> = ({ label = "Gerar PDF" }) => (
    <button className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">
        {label}
    </button>
);


const ReportsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Relatórios</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReportCard title="Relatórios de Vendas por Período">
                    <DateRangePicker />
                    <GenerateButton />
                </ReportCard>

                <ReportCard title="Relatórios de Clientes Ativos">
                    <DateRangePicker />
                    <GenerateButton />
                </ReportCard>
                
                <ReportCard title="Relatório de Estoque">
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center bg-green-800/50 p-3 rounded-md">
                            <span>Giro de Produtos</span> <GenerateButton />
                        </div>
                         <div className="flex justify-between items-center bg-green-800/50 p-3 rounded-md">
                            <span>Estoque Baixo</span> <GenerateButton />
                        </div>
                    </div>
                </ReportCard>

                <ReportCard title="Relatório Financeiro">
                     <div className="flex flex-col space-y-4">
                        <div className="bg-green-800/50 p-3 rounded-md">
                            <p className="mb-2">Fluxo de Caixa</p>
                            <DateRangePicker />
                            <div className="mt-2 text-right"><GenerateButton /></div>
                        </div>
                         <div className="bg-green-800/50 p-3 rounded-md">
                            <p className="mb-2">Demonstrativo de Lucro</p>
                            <DateRangePicker />
                            <div className="mt-2 text-right"><GenerateButton /></div>
                        </div>
                    </div>
                </ReportCard>

                <ReportCard title="Outros Relatórios">
                     <div className="flex flex-col space-y-4">
                         <div className="flex justify-between items-center bg-green-800/50 p-3 rounded-md">
                            <span>Relatório de Sessões de Caixa</span> <GenerateButton />
                        </div>
                        <div className="flex justify-between items-center bg-green-800/50 p-3 rounded-md">
                            <span>Lista de Clientes</span> <GenerateButton />
                        </div>
                         <div className="flex justify-between items-center bg-green-800/50 p-3 rounded-md">
                            <span>Relatório Mensal de Faturamento</span> <GenerateButton />
                        </div>
                    </div>
                </ReportCard>

                <ReportCard title="Declaração Anual [DASN-SIMEI]">
                    <p className="text-sm text-gray-400 mb-4">Gere o relatório consolidado para a sua declaração anual.</p>
                    <GenerateButton label="Gerar Declaração Anual PDF"/>
                </ReportCard>
            </div>
        </div>
    );
};

export default ReportsPage;