import React, { useState } from 'react';
import { PlusCircleIcon } from '../components/icons';
import { mockProducts, mockServices } from '../../data/mocks';


const ProductsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Produtos e Serviços</h1>
                <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    {activeTab === 'products' ? 'Adicionar Produto' : 'Adicionar Serviço'}
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-green-800">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'products' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'
                        }`}
                    >
                        Produtos
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'services' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'
                        }`}
                    >
                        Serviços
                    </button>
                </nav>
            </div>
            
            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                {activeTab === 'products' ? <ProductsTable /> : <ServicesTable />}
            </div>
        </div>
    );
};

const ProductsTable: React.FC = () => (
    <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-green-800">
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
                <tr key={p.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4">{p.category}</td>
                    <td className="px-6 py-4">{p.price}</td>
                    <td className="px-6 py-4">{p.stock}</td>
                    <td className="px-6 py-4 space-x-2">
                        <a href="#" className="font-medium text-green-400 hover:underline">Editar</a>
                        <a href="#" className="font-medium text-red-400 hover:underline">Excluir</a>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const ServicesTable: React.FC = () => (
     <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-green-800">
            <tr>
                <th scope="col" className="px-6 py-3">Nome do Serviço</th>
                <th scope="col" className="px-6 py-3">Preço</th>
                <th scope="col" className="px-6 py-3">Ações</th>
            </tr>
        </thead>
        <tbody>
            {mockServices.map(s => (
                <tr key={s.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                    <td className="px-6 py-4 font-medium text-white">{s.name}</td>
                    <td className="px-6 py-4">{s.price}</td>
                    <td className="px-6 py-4 space-x-2">
                        <a href="#" className="font-medium text-green-400 hover:underline">Editar</a>
                        <a href="#" className="font-medium text-red-400 hover:underline">Excluir</a>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

export default ProductsPage;