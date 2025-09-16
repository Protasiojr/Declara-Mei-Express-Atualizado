

import React, { useState } from 'react';
import { PlusCircleIcon } from '../components/icons';
// FIX: Imports will now work after adding exports to mocks file.
import { mockProducts, mockServices } from '../../data/mocks';
import { Product, Service } from '../../domain/types';

const ProductsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchQuery))
    );

    const filteredServices = mockServices.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Produtos e Serviços</h1>
                <button className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 w-full sm:w-auto">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    {activeTab === 'products' ? 'Adicionar Produto' : 'Adicionar Serviço'}
                </button>
            </div>

            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Buscar por nome ou código de barras..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-green-950 border border-green-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
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
                {activeTab === 'products' ? <ProductsTable products={filteredProducts} /> : <ServicesTable services={filteredServices} />}
            </div>
        </div>
    );
};

const ProductsTable: React.FC<{ products: Product[] }> = ({ products }) => (
    <div className="overflow-x-auto">
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
                {products.length > 0 ? products.map(p => (
                    <tr key={p.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                        <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                        <td className="px-6 py-4">{p.category}</td>
                        {/* FIX: Changed p.price to p.sellPrice and added formatting. */}
                        <td className="px-6 py-4">R$ {p.sellPrice.toFixed(2)}</td>
                        <td className="px-6 py-4">{p.stock}</td>
                        <td className="px-6 py-4 space-x-2">
                            <a href="#" className="font-medium text-green-400 hover:underline">Editar</a>
                            <a href="#" className="font-medium text-red-400 hover:underline">Excluir</a>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                            Nenhum produto encontrado.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

const ServicesTable: React.FC<{ services: Service[] }> = ({ services }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-green-800">
                <tr>
                    <th scope="col" className="px-6 py-3">Nome do Serviço</th>
                    <th scope="col" className="px-6 py-3">Preço</th>
                    <th scope="col" className="px-6 py-3">Ações</th>
                </tr>
            </thead>
            <tbody>
                {services.length > 0 ? services.map(s => (
                    <tr key={s.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                        <td className="px-6 py-4 font-medium text-white">{s.name}</td>
                        {/* FIX: Added currency formatting. */}
                        <td className="px-6 py-4">R$ {s.price.toFixed(2)}</td>
                        <td className="px-6 py-4 space-x-2">
                            <a href="#" className="font-medium text-green-400 hover:underline">Editar</a>
                            <a href="#" className="font-medium text-red-400 hover:underline">Excluir</a>
                        </td>
                    </tr>
                )) : (
                     <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                            Nenhum serviço encontrado.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default ProductsPage;