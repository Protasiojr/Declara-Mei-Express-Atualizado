import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    initialMockCustomers,
    mockProducts,
    mockPayables,
    mockReceivables,
    mockServices,
} from '../../data/mocks';
import { ProductType } from '../../domain/types';

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

const GenerateButton: React.FC<{ label?: string; onClick: () => void; }> = ({ label = "Gerar PDF", onClick }) => (
    <button onClick={onClick} className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">
        {label}
    </button>
);

const generatePdf = (title: string, head: any[][], body: any[][], filename: string) => {
    const doc = new jsPDF();
    doc.text(title, 14, 20);
    autoTable(doc, {
        head: head,
        body: body,
        startY: 25,
        theme: 'grid',
        styles: {
            font: 'helvetica',
            fontSize: 10,
            cellPadding: 2,
        },
        headStyles: {
            fillColor: [22, 101, 52], // green-800
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
    });
    doc.save(`${filename}.pdf`);
};

const ReportsPage: React.FC = () => {

    const handleGenerateSales = () => {
        const head = [['Data', 'Descrição', 'Valor (R$)']];
        const body = mockReceivables.map(r => [r.dueDate, r.description, r.value.toFixed(2)]);
        generatePdf('Relatório de Vendas por Período', head, body, 'relatorio_vendas');
    };

    const handleGenerateCustomers = () => {
        const head = [['Nome/Razão Social', 'CPF/CNPJ', 'Telefone', 'Cidade']];
        const body = initialMockCustomers.map(c => [
            c.fullName || c.companyName,
            c.cpf || c.cnpj,
            c.phone,
            c.address.city
        ]);
        generatePdf('Relatório de Clientes', head, body, 'relatorio_clientes');
    };
    
    const handleGenerateStockTurnover = () => {
        const head = [['Produto', 'Categoria', 'Estoque Atual', 'Preço Venda (R$)']];
        const body = mockProducts.map(p => [p.name, p.category, p.stock, p.sellPrice.toFixed(2)]);
        generatePdf('Relatório de Giro de Produtos', head, body, 'relatorio_giro_estoque');
    };

    const handleGenerateLowStock = () => {
        const head = [['Produto', 'Estoque Atual', 'Estoque Mínimo']];
        const body = mockProducts
            .filter(p => p.stock <= p.minStock)
            .map(p => [p.name, p.stock, p.minStock]);
        generatePdf('Relatório de Estoque Baixo', head, body, 'relatorio_estoque_baixo');
    };
    
    const handleGenerateCashFlow = () => {
        const head = [['Data', 'Descrição', 'Tipo', 'Valor (R$)']];
        const payables = mockPayables.map(p => [p.dueDate, p.description, 'Saída', `- ${p.value.toFixed(2)}`]);
        const receivables = mockReceivables.map(r => [r.dueDate, r.description, 'Entrada', `+ ${r.value.toFixed(2)}`]);
        const body = [...payables, ...receivables].sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
        generatePdf('Relatório de Fluxo de Caixa', head, body, 'relatorio_fluxo_caixa');
    };

    const handleGenerateProfitStatement = () => {
        const totalReceita = mockReceivables.reduce((sum, r) => sum + r.value, 0);
        const totalDespesa = mockPayables.reduce((sum, p) => sum + p.value, 0);
        const lucro = totalReceita - totalDespesa;
        const head = [['Descrição', 'Valor (R$)']];
        const body = [
            ['Total de Receitas', `+ ${totalReceita.toFixed(2)}`],
            ['Total de Despesas', `- ${totalDespesa.toFixed(2)}`],
            [{ content: 'Lucro/Prejuízo', styles: { fontStyle: 'bold' } }, { content: lucro.toFixed(2), styles: { fontStyle: 'bold' } }]
        ];
        generatePdf('Demonstrativo de Lucro', head, body, 'demonstrativo_lucro');
    };

    const handleGenerateCashierSessions = () => {
        const head = [['Data', 'Operador', 'Saldo Inicial (R$)', 'Total Vendas (R$)', 'Saldo Final (R$)']];
        const body = [ // Mock data for demonstration
            ['25/07/2024', 'Admin', '100.00', '1250.50', '1350.50'],
            ['26/07/2024', 'Admin', '150.00', '980.00', '1130.00'],
        ];
        generatePdf('Relatório de Sessões de Caixa', head, body, 'relatorio_sessoes_caixa');
    };

    const handleGenerateMonthlyBilling = () => {
        const head = [['Mês/Ano', 'Faturamento Bruto (R$)']];
        const body = [ // Mock data for demonstration
            ['01/2024', '5400.00'], ['02/2024', '4800.50'],
            ['03/2024', '6200.00'], ['04/2024', '5950.75'],
        ];
        generatePdf('Relatório Mensal de Faturamento', head, body, 'relatorio_faturamento_mensal');
    };

    const handleGenerateAnnualDeclaration = () => {
        const salesRevenue = mockReceivables.reduce((sum, r) => sum + r.value, 0);
        // Simulate revenue separation for MEI
        const totalResale = salesRevenue * 0.6; 
        const totalIndustrialized = salesRevenue * 0.1;
        const totalServices = salesRevenue * 0.3;
        const totalRevenue = totalResale + totalIndustrialized + totalServices;

        const head = [['Tipo de Receita', 'Valor Total Anual (R$)']];
        const body = [
            ['Revenda de Mercadorias', totalResale.toFixed(2)],
            ['Venda de Produtos Industrializados', totalIndustrialized.toFixed(2)],
            ['Prestação de Serviços', totalServices.toFixed(2)],
            ['', ''], // spacer
            [{ content: 'Receita Bruta Total', styles: { fontStyle: 'bold' } }, { content: totalRevenue.toFixed(2), styles: { fontStyle: 'bold' } }],
        ];
        generatePdf('Relatório Anual para Declaração (DASN-SIMEI)', head, body, 'relatorio_anual_dasn_simei');
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Relatórios</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReportCard title="Relatórios de Vendas por Período">
                    <DateRangePicker />
                    <GenerateButton onClick={handleGenerateSales} />
                </ReportCard>

                <ReportCard title="Relatórios de Clientes Ativos">
                    <DateRangePicker />
                    <GenerateButton onClick={handleGenerateCustomers} />
                </ReportCard>
                
                <ReportCard title="Relatório de Estoque">
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center bg-green-800/50 p-3 rounded-md">
                            <span>Giro de Produtos</span> <GenerateButton onClick={handleGenerateStockTurnover} />
                        </div>
                         <div className="flex justify-between items-center bg-green-800/50 p-3 rounded-md">
                            <span>Estoque Baixo</span> <GenerateButton onClick={handleGenerateLowStock} />
                        </div>
                    </div>
                </ReportCard>

                <ReportCard title="Relatório Financeiro">
                     <div className="flex flex-col space-y-4">
                        <div className="bg-green-800/50 p-3 rounded-md">
                            <p className="mb-2">Fluxo de Caixa</p>
                            <DateRangePicker />
                            <div className="mt-2 text-right"><GenerateButton onClick={handleGenerateCashFlow} /></div>
                        </div>
                         <div className="bg-green-800/50 p-3 rounded-md">
                            <p className="mb-2">Demonstrativo de Lucro</p>
                            <DateRangePicker />
                            <div className="mt-2 text-right"><GenerateButton onClick={handleGenerateProfitStatement} /></div>
                        </div>
                    </div>
                </ReportCard>

                <ReportCard title="Outros Relatórios">
                     <div className="flex flex-col space-y-4">
                         <div className="flex justify-between items-center bg-green-800/50 p-3 rounded-md">
                            <span>Relatório de Sessões de Caixa</span> <GenerateButton onClick={handleGenerateCashierSessions} />
                        </div>
                        <div className="flex justify-between items-center bg-green-800/50 p-3 rounded-md">
                            <span>Lista de Clientes</span> <GenerateButton onClick={handleGenerateCustomers} />
                        </div>
                         <div className="flex justify-between items-center bg-green-800/50 p-3 rounded-md">
                            <span>Relatório Mensal de Faturamento</span> <GenerateButton onClick={handleGenerateMonthlyBilling} />
                        </div>
                    </div>
                </ReportCard>

                <ReportCard title="Declaração Anual [DASN-SIMEI]">
                    <p className="text-sm text-gray-400 mb-4">Gere o relatório consolidado para a sua declaração anual.</p>
                    <GenerateButton onClick={handleGenerateAnnualDeclaration} label="Gerar Declaração Anual PDF"/>
                </ReportCard>
            </div>
        </div>
    );
};

export default ReportsPage;