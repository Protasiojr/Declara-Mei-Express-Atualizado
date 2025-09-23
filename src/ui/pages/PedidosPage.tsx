

import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircleIcon, Trash2Icon, PlusIcon } from '../components/icons';
import { Order, OrderStatus, OrderPaymentMethod, OrderItem, Customer, Product } from '../../domain/types';
import { mockOrders, initialMockCustomers, mockProducts } from '../../data/mocks';

const statusStyles: { [key in OrderStatus]: string } = {
    'Aberto': 'bg-blue-500/20 text-blue-300',
    'Pago': 'bg-green-500/20 text-green-300',
    'Entregue': 'bg-purple-500/20 text-purple-300',
    'Cancelado': 'bg-red-500/20 text-red-300',
};

const PedidosPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = useMemo(() => {
        if (!searchQuery) return orders;
        const lowercasedQuery = searchQuery.toLowerCase();
        return orders.filter(order =>
            order.id.toLowerCase().includes(lowercasedQuery) ||
            (order.customerName && order.customerName.toLowerCase().includes(lowercasedQuery)) ||
            order.status.toLowerCase().includes(lowercasedQuery)
        );
    }, [orders, searchQuery]);

    const handleOpenModal = (order: Order | null = null) => {
        setOrderToEdit(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setOrderToEdit(null);
    };

    const handleSaveOrder = (order: Order) => {
        if (orderToEdit) {
            setOrders(orders.map(o => o.id === order.id ? order : o));
        } else {
            setOrders([order, ...orders]);
        }
        handleCloseModal();
    };

    return (
        <div className="space-y-6">
            {isModalOpen && (
                 <PedidoModal
                    onClose={handleCloseModal}
                    onSave={handleSaveOrder}
                    orderToEdit={orderToEdit}
                />
            )}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Pedidos</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 w-full sm:w-auto"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Adicionar Novo Pedido
                </button>
            </div>

            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                <div className="relative mb-4">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por ID do Pedido, cliente ou status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-green-950 border border-green-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-green-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID Pedido</th>
                                <th scope="col" className="px-6 py-3">Cliente</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Valor Total</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{order.id}</th>
                                    <td className="px-6 py-4">{order.customerName || 'N/A'}</td>
                                    <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4">R$ {order.totalValue.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status]}`}>{order.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleOpenModal(order)} className="font-medium text-green-400 hover:underline">Detalhes</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// MODALS & HELPERS
const initialOrderState = (orderToEdit: Order | null): Order => {
    if (orderToEdit) return JSON.parse(JSON.stringify(orderToEdit)); // Deep copy
    return {
        id: `PED-${Date.now()}`,
        orderDate: new Date().toISOString().split('T')[0],
        status: 'Aberto',
        paymentMethod: 'Dinheiro',
        items: [],
        totalValue: 0,
        customerName: 'Cliente Avulso',
    };
};

const PedidoModal: React.FC<{
    onClose: () => void;
    onSave: (order: Order) => void;
    orderToEdit: Order | null;
}> = ({ onClose, onSave, orderToEdit }) => {
    const [order, setOrder] = useState<Order>(initialOrderState(orderToEdit));
    const [productSearch, setProductSearch] = useState('');
    const [itemToRemove, setItemToRemove] = useState<OrderItem | null>(null);

    const filteredProducts = useMemo(() => {
        if (!productSearch) return [];
        const lowercasedQuery = productSearch.toLowerCase();
        return mockProducts.filter(p => p.name.toLowerCase().includes(lowercasedQuery) || p.sku.toLowerCase().includes(lowercasedQuery));
    }, [productSearch]);

    useEffect(() => {
        const newTotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
        setOrder(o => ({ ...o, totalValue: newTotal }));
    }, [order.items]);
    
    const handleAddItem = (product: Product) => {
        const newItem: OrderItem = {
            id: `item-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            quantity: 1,
            unitPrice: product.sellPrice,
            subtotal: product.sellPrice,
        };
        setOrder(o => ({ ...o, items: [...o.items, newItem] }));
        setProductSearch('');
    };

    const handleRemoveItem = (itemId: string, justification: string) => {
        console.log(`Item ${itemId} removido. Justificativa: ${justification}`);
        setOrder(o => ({ ...o, items: o.items.filter(item => item.id !== itemId) }));
        setItemToRemove(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(order);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            {itemToRemove && <RemoveItemModal item={itemToRemove} onConfirm={handleRemoveItem} onCancel={() => setItemToRemove(null)} />}
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-green-800">
                <div className="p-6 border-b border-green-800 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">{orderToEdit ? 'Detalhes do Pedido' : 'Novo Pedido'} - {order.id}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField label="Cliente" name="customerName" value={order.customerName} onChange={e => setOrder({...order, customerName: e.target.value})} />
{/* FIX: Added children to SelectField to provide options, resolving missing property error. */}
                        <SelectField label="Status" name="status" value={order.status} onChange={e => setOrder({...order, status: e.target.value as OrderStatus})}>
                            {(['Aberto', 'Pago', 'Cancelado', 'Entregue'] as OrderStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                        </SelectField>
{/* FIX: Added children to SelectField to provide options, resolving missing property error. */}
                        <SelectField label="Forma de Pagamento" name="paymentMethod" value={order.paymentMethod} onChange={e => setOrder({...order, paymentMethod: e.target.value as OrderPaymentMethod})}>
                             {(['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'PIX', 'Fiado', 'Misto'] as OrderPaymentMethod[]).map(pm => <option key={pm} value={pm}>{pm}</option>)}
                        </SelectField>
                    </div>

                    <fieldset className="border border-green-800 p-4 rounded-lg">
                        <legend className="px-2 text-green-400 font-semibold">Itens do Pedido</legend>
                        <div className="space-y-2">
                            {order.items.map(item => (
                                <div key={item.id} className="flex items-center justify-between bg-green-800/50 p-2 rounded">
                                    <span className="text-white flex-1">{item.productName}</span>
                                    <span className="text-gray-300 flex-1">Qtd: {item.quantity} x R$ {item.unitPrice.toFixed(2)}</span>
                                    <span className="text-green-400 font-semibold flex-1 text-right">R$ {item.subtotal.toFixed(2)}</span>
                                    <button type="button" onClick={() => setItemToRemove(item)} className="ml-4 text-red-400 hover:text-red-300"><Trash2Icon className="w-5 h-5"/></button>
                                </div>
                            ))}
                             {order.items.length === 0 && <p className="text-center text-gray-500 py-4">Nenhum item adicionado.</p>}
                        </div>

                         <div className="relative mt-4">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <PlusIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar produto para adicionar ao pedido..."
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                                className="w-full bg-green-800 border-green-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400"
                            />
                            {filteredProducts.length > 0 && (
                                <ul className="absolute z-20 w-full mt-1 bg-green-950 border border-green-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                    {filteredProducts.map(p => <li key={p.id} onMouseDown={() => handleAddItem(p)} className="px-4 py-2 cursor-pointer hover:bg-green-700">{p.name}</li>)}
                                </ul>
                            )}
                        </div>
                    </fieldset>
                </form>

                <div className="p-4 bg-green-950/50 border-t border-green-800 rounded-b-lg flex justify-between items-center">
                    <div className="text-white text-xl font-bold">Total: <span className="text-green-400">R$ {order.totalValue.toFixed(2)}</span></div>
                    <div className="space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                        <button type="submit" onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Salvar Pedido</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RemoveItemModal: React.FC<{
    item: OrderItem;
    onConfirm: (itemId: string, justification: string) => void;
    onCancel: () => void;
}> = ({ item, onConfirm, onCancel }) => {
    const [justification, setJustification] = useState('');
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-md border border-red-800">
                <div className="p-6 border-b border-red-800">
                    <h2 className="text-xl font-bold text-red-400">Retirar Item do Pedido</h2>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-300">Você está retirando o item <strong className="text-white">{item.productName}</strong>. Por favor, forneça uma justificativa.</p>
                     <div>
                        <label htmlFor="justification" className="block text-sm font-medium text-gray-300">Justificativa</label>
                        <textarea id="justification" value={justification} onChange={e => setJustification(e.target.value)} rows={3} className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white"></textarea>
                    </div>
                </div>
                <div className="p-4 bg-green-950/50 border-t border-red-800 flex justify-end space-x-4">
                    <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                    <button type="button" onClick={() => onConfirm(item.id, justification)} disabled={!justification.trim()} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50">Confirmar Retirada</button>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, name, value, onChange }: { label: string, name: string, value?: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input type="text" id={name} name={name} value={value || ''} onChange={onChange} className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white" />
    </div>
);

const SelectField = ({ label, name, value, onChange, children }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white">{children}</select>
    </div>
);

export default PedidosPage;