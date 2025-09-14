
import React, { useState } from 'react';
import { PlusCircleIcon } from '../components/icons';

const mockProducts = [
    { id: 1, name: 'Produto A', category: 'Eletrônicos', price: 'R$ 10.00', stock: 100 },
    { id: 2, name: 'Produto B', category: 'Material Escritório', price: 'R$ 25.50', stock: 50 },
    { id: 3, name: 'Produto C', category: 'Alimentos', price: 'R$ 5.75', stock: 200 },
];
const mockServices = [
    { id: 1, name: 'Serviço X', price: 'R$ 50.00' },
    { id: 2, name: 'Serviço Y', price: 'R$ 120.00' },
];

const ProductsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Produtos e Serviços</h1>
                <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    {activeTab === 'products' ? 'Adicionar Produto' : 'Adicionar Serviço'}
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'products' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                        }`}
                    >
                        Produtos
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'services' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                        }`}
                    >
                        Serviços
                    </button>
                </nav>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                {activeTab === 'products' ? <ProductsTable /> : <ServicesTable />}
            </div>
        </div>
    );
};

const ProductsTable: React.FC = () => (
    <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
                <th scope="col" className="px-6 py-3">Nome do Produto</th>
                <th scope="col" className="px-6 py-3">Categoria</th>
                <th scope="col" className="px-6 py-3">Preço Venda</th>
                <th scope="col" className="px-6 py-3">Estoque Atual</th>
                <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
        </thead>
        <tbody>
            {mockProducts.map(p => (
                <tr key={p.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4">{p.category}</td>
                    <td className="px-6 py-4">{p.price}</td>
                    <td className="px-6 py-4">{p.stock}</td>
                    <td className="px-6 py-4 space-x-2">
                        <a href="#" className="font-medium text-indigo-400 hover:underline">Editar</a>
                        <a href="#" className="font-medium text-red-400 hover:underline">Excluir</a>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const ServicesTable: React.FC = () => (
     <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
                <th scope="col" className="px-6 py-3">Nome do Serviço</th>
                <th scope="col" className="px-6 py-3">Preço</th>
                <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
        </thead>
        <tbody>
            {mockServices.map(s => (
                <tr key={s.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-white">{s.name}</td>
                    <td className="px-6 py-4">{s.price}</td>
                    <td className="px-6 py-4 space-x-2">
                        <a href="#" className="font-medium text-indigo-400 hover:underline">Editar</a>
                        <a href="#" className="font-medium text-red-400 hover:underline">Excluir</a>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default ProductsPage;
