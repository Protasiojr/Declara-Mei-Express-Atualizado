

import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircleIcon, Trash2Icon } from '../components/icons';
import { Delivery, DeliveryStatus, DeliveryResponsible, Order, DeliveryPerson } from '../../domain/types';
import { mockDeliveries, mockOrders, initialMockDeliveryPersons } from '../../data/mocks';

const statusStyles: { [key in DeliveryStatus]: string } = {
    'Pendente': 'bg-yellow-500/20 text-yellow-300',
    'Em trânsito': 'bg-blue-500/20 text-blue-300',
    'Entregue': 'bg-green-500/20 text-green-300',
    'Cancelada': 'bg-red-500/20 text-red-300',
};

const EntregasPage: React.FC = () => {
    const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeModal, setActiveModal] = useState<'form' | 'assign' | 'cancel' | null>(null);
    const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
    
    const filteredDeliveries = useMemo(() => {
        if (!searchQuery) return deliveries;
        const lowercasedQuery = searchQuery.toLowerCase();
        return deliveries.filter(d =>
            d.id.toLowerCase().includes(lowercasedQuery) ||
            d.orderId.toLowerCase().includes(lowercasedQuery) ||
            (d.deliveryPersonName && d.deliveryPersonName.toLowerCase().includes(lowercasedQuery)) ||
            d.status.toLowerCase().includes(lowercasedQuery)
        );
    }, [deliveries, searchQuery]);

    const handleOpenModal = (modalType: 'form' | 'assign' | 'cancel', delivery: Delivery | null = null) => {
        setSelectedDelivery(delivery);
        setActiveModal(modalType);
    };
    
    const handleCloseModal = () => {
        setSelectedDelivery(null);
        setActiveModal(null);
    };

    const handleSaveDelivery = (delivery: Delivery) => {
        if (selectedDelivery) {
            setDeliveries(deliveries.map(d => d.id === delivery.id ? delivery : d));
        } else {
            setDeliveries([delivery, ...deliveries]);
        }
        handleCloseModal();
    };

    const handleAssign = (deliveryId: string, deliveryPerson: DeliveryPerson) => {
        setDeliveries(deliveries.map(d =>
            d.id === deliveryId
                ? { ...d, deliveryPersonId: deliveryPerson.id, deliveryPersonName: deliveryPerson.name, status: 'Em trânsito' }
                : d
        ));
        handleCloseModal();
    };

    const handleCancel = (deliveryId: string, justification: string) => {
        console.log(`Entrega ${deliveryId} cancelada. Justificativa: ${justification}`);
        setDeliveries(deliveries.map(d =>
            d.id === deliveryId
                ? { ...d, status: 'Cancelada' }
                : d
        ));
        handleCloseModal();
    };


    return (
        <div className="space-y-6">
            {activeModal === 'form' && <DeliveryModal onClose={handleCloseModal} onSave={handleSaveDelivery} deliveryToEdit={selectedDelivery} />}
            {activeModal === 'assign' && selectedDelivery && <AssignModal delivery={selectedDelivery} onAssign={handleAssign} onCancel={handleCloseModal} />}
            {activeModal === 'cancel' && selectedDelivery && <CancelModal delivery={selectedDelivery} onConfirm={handleCancel} onCancel={handleCloseModal} />}
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Gestão de Entregas</h1>
                <button
                    onClick={() => handleOpenModal('form')}
                    className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 w-full sm:w-auto"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Nova Entrega
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
                        placeholder="Buscar por ID da entrega, pedido, entregador ou status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-green-950 border border-green-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-green-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">ID Entrega</th>
                                <th scope="col" className="px-6 py-3">Pedido</th>
                                <th scope="col" className="px-6 py-3">Entregador</th>
                                <th scope="col" className="px-6 py-3">Data Previsão</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDeliveries.map(delivery => (
                                <tr key={delivery.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                                    <td className="px-6 py-4 font-medium text-white">{delivery.id}</td>
                                    <td className="px-6 py-4">{delivery.orderId}</td>
                                    <td className="px-6 py-4">{delivery.deliveryPersonName || 'Não atribuído'}</td>
                                    <td className="px-6 py-4">{new Date(delivery.estimatedDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[delivery.status]}`}>{delivery.status}</span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button onClick={() => handleOpenModal('form', delivery)} className="font-medium text-green-400 hover:underline">Editar</button>
                                        <button onClick={() => handleOpenModal('assign', delivery)} className="font-medium text-blue-400 hover:underline">Atribuir</button>
                                        <button onClick={() => handleOpenModal('cancel', delivery)} className="font-medium text-red-400 hover:underline">Cancelar</button>
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

const initialDeliveryState = (deliveryToEdit: Delivery | null): Delivery => {
    if (deliveryToEdit) return { ...deliveryToEdit };
    return {
        id: `ENT-${Date.now()}`,
        orderId: '',
        deliveryAddress: '',
        status: 'Pendente',
        estimatedDate: new Date().toISOString().split('T')[0],
        responsible: 'Motoboy',
        deliveryCost: 0
    };
};

const DeliveryModal: React.FC<{
    onClose: () => void;
    onSave: (delivery: Delivery) => void;
    deliveryToEdit: Delivery | null;
}> = ({ onClose, onSave, deliveryToEdit }) => {
    const [delivery, setDelivery] = useState<Delivery>(initialDeliveryState(deliveryToEdit));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (name === 'orderId' && value) {
            const selectedOrder = mockOrders.find(o => o.id === value);
            // This is a simplified address fetch. In a real app, you'd fetch customer details.
            const address = `Pedido para: ${selectedOrder?.customerName || 'N/A'}`;
            setDelivery(d => ({ ...d, orderId: value, deliveryAddress: address }));
        } else {
            setDelivery(d => ({ ...d, [name]: type === 'number' ? parseFloat(value) : value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(delivery);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-green-800">
                <div className="p-6 border-b border-green-800"><h2 className="text-2xl font-bold text-white">{deliveryToEdit ? 'Editar' : 'Nova'} Entrega</h2></div>
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow p-6 space-y-4">
{/* FIX: Added children to SelectField to provide options, resolving missing property error. */}
                    <SelectField label="Pedido Vinculado" name="orderId" value={delivery.orderId} onChange={handleChange} required>
                        <option value="">Selecione um pedido</option>
                        {mockOrders.map(o => <option key={o.id} value={o.id}>{o.id} - {o.customerName}</option>)}
                    </SelectField>
                    <TextAreaField label="Endereço de Entrega" name="deliveryAddress" value={delivery.deliveryAddress} onChange={handleChange} required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Data de Previsão" name="estimatedDate" type="date" value={delivery.estimatedDate} onChange={handleChange} required />
                        <InputField label="Custo da Entrega" name="deliveryCost" type="number" value={delivery.deliveryCost} onChange={handleChange} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{/* FIX: Added children to SelectField to provide options, resolving missing property error. */}
                        <SelectField label="Status" name="status" value={delivery.status} onChange={handleChange}>
                           {(['Pendente', 'Em trânsito', 'Entregue', 'Cancelada'] as DeliveryStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                        </SelectField>
{/* FIX: Added children to SelectField to provide options, resolving missing property error. */}
                         <SelectField label="Responsável" name="responsible" value={delivery.responsible} onChange={handleChange}>
                           {(['Entregador Próprio', 'Motoboy', 'Transportadora'] as DeliveryResponsible[]).map(r => <option key={r} value={r}>{r}</option>)}
                        </SelectField>
                    </div>
                </form>
                <div className="p-4 bg-green-950/50 border-t border-green-800 flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                    <button type="submit" onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Salvar</button>
                </div>
            </div>
        </div>
    );
};

const AssignModal: React.FC<{
    delivery: Delivery;
    onAssign: (deliveryId: string, deliveryPerson: DeliveryPerson) => void;
    onCancel: () => void;
}> = ({ delivery, onAssign, onCancel }) => {
    const [selectedDPId, setSelectedDPId] = useState(delivery.deliveryPersonId || '');

    const handleConfirm = () => {
        const selectedDP = initialMockDeliveryPersons.find(dp => dp.id === selectedDPId);
        if (selectedDP) {
            onAssign(delivery.id, selectedDP);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
             <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-md border border-green-800">
                <div className="p-6 border-b border-green-800"><h2 className="text-xl font-bold text-white">Atribuir Entregador</h2></div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-300">Selecione um entregador para a entrega <strong className="text-white">{delivery.id}</strong>.</p>
{/* FIX: Added children to SelectField to provide options, resolving missing property error. */}
                    <SelectField label="Entregador" name="deliveryPerson" value={selectedDPId} onChange={e => setSelectedDPId(e.target.value)} required>
                        <option value="">Selecione um entregador</option>
                        {initialMockDeliveryPersons.map(dp => <option key={dp.id} value={dp.id}>{dp.name} - {dp.deliveryCompany}</option>)}
                    </SelectField>
                </div>
                <div className="p-4 bg-green-950/50 border-t border-green-800 flex justify-end space-x-4">
                    <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 font-semibold text-white">Cancelar</button>
                    <button onClick={handleConfirm} disabled={!selectedDPId} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-white disabled:opacity-50">Atribuir e Despachar</button>
                </div>
            </div>
        </div>
    );
};

const CancelModal: React.FC<{
    delivery: Delivery;
    onConfirm: (deliveryId: string, justification: string) => void;
    onCancel: () => void;
}> = ({ delivery, onConfirm, onCancel }) => {
    const [justification, setJustification] = useState('');
    return (
         <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-md border border-red-800">
                <div className="p-6 border-b border-red-800"><h2 className="text-xl font-bold text-red-400">Cancelar Entrega</h2></div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-300">Tem certeza que deseja cancelar a entrega <strong className="text-white">{delivery.id}</strong>? Esta ação não pode ser desfeita.</p>
                    <TextAreaField label="Justificativa" name="justification" value={justification} onChange={e => setJustification(e.target.value)} required />
                </div>
                <div className="p-4 bg-green-950/50 border-t border-red-800 flex justify-end space-x-4">
                    <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 font-semibold text-white">Voltar</button>
                    <button onClick={() => onConfirm(delivery.id, justification)} disabled={!justification.trim()} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white disabled:opacity-50">Confirmar Cancelamento</button>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, name, type = 'text', value, onChange, required=false }: { label: string, name: string, type?: string, value?: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input type={type} id={name} name={name} value={value || ''} onChange={onChange} required={required} step={type === 'number' ? '0.01' : undefined} className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white" />
    </div>
);
const TextAreaField = ({ label, name, value, onChange, required=false }: { label: string, name: string, value?: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, required?: boolean }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <textarea id={name} name={name} value={value || ''} onChange={onChange} required={required} rows={3} className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white"></textarea>
    </div>
);
const SelectField = ({ label, name, value, onChange, required=false, children }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, required?: boolean, children: React.ReactNode }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} required={required} className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white">{children}</select>
    </div>
);

export default EntregasPage;