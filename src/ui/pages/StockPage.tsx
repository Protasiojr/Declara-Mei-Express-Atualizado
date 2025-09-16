import React, { useState, useMemo } from 'react';
import { Product } from '../../domain/types';
import { mockProducts } from '../../data/mocks';
import { PlusIcon, WrenchIcon } from '../components/icons';

// Componente reutilizável para modais dentro desta página
const Modal: React.FC<{ title: string; children: React.ReactNode; footer: React.ReactNode; onClose: () => void; }> = ({ title, children, footer, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
        <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-md border border-green-800 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-green-800 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none" aria-label="Fechar">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">{children}</div>
            <div className="p-4 bg-green-950/50 border-t border-green-800 rounded-b-lg">{footer}</div>
        </div>
    </div>
);

// Componente reutilizável para campos de formulário dentro desta página
const InputField: React.FC<{ label: string; name: string; type?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; disabled?: boolean; }> = ({ label, name, type = 'text', value, onChange, required = false, disabled = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            type={type} id={name} name={name} value={value} onChange={onChange} required={required} disabled={disabled}
            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-green-950 disabled:cursor-not-allowed" />
    </div>
);


const StockPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeModal, setActiveModal] = useState<'entry' | 'adjust' | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Estado para os formulários dos modais
    const [entryQuantity, setEntryQuantity] = useState('');
    const [adjustQuantity, setAdjustQuantity] = useState('');
    const [adjustReason, setAdjustReason] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchQuery) {
            return products;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return products.filter(product =>
            product.name.toLowerCase().includes(lowercasedQuery) ||
            (product.barcode && product.barcode.includes(lowercasedQuery))
        );
    }, [products, searchQuery]);


    const handleOpenModal = (product: Product, modalType: 'entry' | 'adjust') => {
        setSelectedProduct(product);
        setActiveModal(modalType);
        if (modalType === 'adjust') {
            setAdjustQuantity(product.stock.toString());
        }
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        setActiveModal(null);
        setEntryQuantity('');
        setAdjustQuantity('');
        setAdjustReason('');
    };

    const handleRegisterEntry = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || !entryQuantity) return;
        
        const quantity = parseInt(entryQuantity, 10);
        if (isNaN(quantity) || quantity <= 0) return;
        
        // Em um app real, você também registraria os detalhes da entrada (data, fornecedor, custo)
        setProducts(products.map(p =>
            p.id === selectedProduct.id
                ? { ...p, stock: p.stock + quantity }
                : p
        ));
        
        handleCloseModal();
    };

    const handleAdjustStock = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || !adjustQuantity || !adjustReason) return;
        
        const newStock = parseInt(adjustQuantity, 10);
        if (isNaN(newStock) || newStock < 0) return;
        
        // Em um app real, você registraria este ajuste com o motivo
        setProducts(products.map(p =>
            p.id === selectedProduct.id
                ? { ...p, stock: newStock }
                : p
        ));
        handleCloseModal();
    };

    const getStockStatus = (product: Product) => {
        if (product.stock <= 0) {
            return { text: 'Esgotado', color: 'bg-red-500/20 text-red-300' };
        }
        if (product.stock <= product.minStock) {
            return { text: 'Estoque Baixo', color: 'bg-yellow-500/20 text-yellow-300' };
        }
        return { text: 'OK', color: 'bg-green-500/20 text-green-300' };
    };

    // Alerta de estoque mínimo é gerenciado pelo status visual na tabela.
    
    const turnoverReport = useMemo(() => {
        // A lógica de "mais vendidos" aqui é uma simulação baseada na proximidade do estoque mínimo.
        // Um app real calcularia isso com base no histórico de vendas.
        const sortedByStockRatio = [...products]
            .filter(p => p.minStock > 0)
            .sort((a, b) => (a.stock / a.minStock) - (b.stock / b.minStock));
        
        const bestSellers = sortedByStockRatio.slice(0, 5);
        const stagnant = sortedByStockRatio.slice(-5).reverse();
        return { bestSellers, stagnant };
    }, [products]);

    const renderModals = () => {
        if (!selectedProduct) return null;

        if (activeModal === 'entry') {
            return (
                <Modal title={`Registrar Entrada: ${selectedProduct.name}`} onClose={handleCloseModal} footer={
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                        <button type="submit" form="entry-form" className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Confirmar Entrada</button>
                    </div>
                }>
                    <form id="entry-form" onSubmit={handleRegisterEntry} className="space-y-4">
                        <InputField label="Produto" name="productName" value={selectedProduct.name} onChange={() => {}} disabled />
                        <InputField label="Quantidade de Entrada" name="entryQuantity" type="number" value={entryQuantity} onChange={(e) => setEntryQuantity(e.target.value)} required />
                        <p className="text-sm text-gray-400">Estoque atual: {selectedProduct.stock}</p>
                    </form>
                </Modal>
            );
        }

        if (activeModal === 'adjust') {
            return (
                <Modal title={`Ajuste Manual: ${selectedProduct.name}`} onClose={handleCloseModal} footer={
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                        <button type="submit" form="adjust-form" className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Salvar Ajuste</button>
                    </div>
                }>
                    <form id="adjust-form" onSubmit={handleAdjustStock} className="space-y-4">
                         <InputField label="Produto" name="productName" value={selectedProduct.name} onChange={() => {}} disabled />
                         <InputField label="Nova Quantidade em Estoque" name="adjustQuantity" type="number" value={adjustQuantity} onChange={(e) => setAdjustQuantity(e.target.value)} required />
                         <div>
                            <label htmlFor="adjustReason" className="block text-sm font-medium text-gray-300">Motivo do Ajuste</label>
                            <select id="adjustReason" value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} required
                                 className="mt-1 block w-full pl-3 pr-10 py-2 bg-green-800 border-green-700 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md text-white">
                                <option value="">Selecione um motivo</option>
                                <option value="Contagem de inventário">Contagem de inventário</option>
                                <option value="Perda ou Dano">Perda ou Dano</option>
                                <option value="Avaria">Avaria</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                    </form>
                </Modal>
            );
        }

        return null;
    };


    return (
        <div className="space-y-6">
            {renderModals()}
            <h1 className="text-3xl font-bold text-white">Gestão de Estoque</h1>

            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                <h2 className="text-xl font-semibold text-white mb-4">Inventário de Produtos</h2>

                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar produto por nome ou código de barras..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-green-950 border border-green-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-green-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">Produto</th>
                                <th scope="col" className="px-6 py-3 text-center">Estoque Atual</th>
                                <th scope="col" className="px-6 py-3 text-center">Estoque Mínimo</th>
                                <th scope="col" className="px-6 py-3 text-center">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => {
                                    const status = getStockStatus(product);
                                    return (
                                        <tr key={product.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700/50">
                                            <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{product.name}</th>
                                            <td className="px-6 py-4 text-center font-mono">{product.stock} {product.unit}</td>
                                            <td className="px-6 py-4 text-center font-mono">{product.minStock} {product.unit}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                    {status.text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center space-x-2">
                                                <button onClick={() => handleOpenModal(product, 'entry')} className="p-2 rounded-md bg-blue-600/50 text-blue-300 hover:bg-blue-600/80" title="Registrar Entrada">
                                                    <PlusIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleOpenModal(product, 'adjust')} className="p-2 rounded-md bg-yellow-600/50 text-yellow-300 hover:bg-yellow-600/80" title="Ajuste Manual">
                                                    <WrenchIcon className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                <h2 className="text-xl font-semibold text-white mb-4">Relatórios de Giro de Produtos</h2>
                 <p className="text-sm text-gray-400 mb-4">Análise simplificada baseada na relação entre estoque atual e mínimo. Produtos com estoque baixo são considerados de "alto giro".</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-green-400 mb-2">Produtos com Maior Giro (Mais Vendidos)</h3>
                        <ul className="space-y-2">
                            {turnoverReport.bestSellers.map(p => (
                                <li key={p.id} className="bg-green-800/50 p-3 rounded-md flex justify-between text-sm">
                                    <span className="text-white">{p.name}</span>
                                    <span className="text-gray-400">Estoque: <span className="font-semibold text-yellow-400">{p.stock}</span></span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-red-400 mb-2">Produtos com Menor Giro (Encalhados)</h3>
                         <ul className="space-y-2">
                            {turnoverReport.stagnant.map(p => (
                                <li key={p.id} className="bg-green-800/50 p-3 rounded-md flex justify-between text-sm">
                                    <span className="text-white">{p.name}</span>
                                    <span className="text-gray-400">Estoque: <span className="font-semibold text-white">{p.stock}</span></span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockPage;