import React, { useState, useEffect } from 'react';
import { PlusCircleIcon } from '../components/icons';
import { Customer, CustomerType, Address } from '../../domain/types';
import { initialMockCustomers } from '../../data/mocks';

const initialCustomerState: Customer = {
    id: '',
    type: CustomerType.INDIVIDUAL,
    fullName: '',
    cpf: '',
    companyName: '',
    tradingName: '',
    cnpj: '',
    stateRegistration: '',
    contactName: '',
    phone: '',
    address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
    }
};

const CustomerModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (customer: Customer) => void;
    customerToEdit: Customer | null;
}> = ({ isOpen, onClose, onSave, customerToEdit }) => {
    const [customer, setCustomer] = useState<Customer>(initialCustomerState);

    useEffect(() => {
        if (customerToEdit) {
            setCustomer(customerToEdit);
        } else {
            setCustomer(initialCustomerState);
        }
    }, [customerToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomer(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...customer, id: customer.id || new Date().toISOString() });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-green-800">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">{customerToEdit ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="border-b border-green-800">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    type="button"
                                    onClick={() => setCustomer(prev => ({ ...prev, type: CustomerType.INDIVIDUAL }))}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                        customer.type === CustomerType.INDIVIDUAL ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'
                                    }`}
                                >
                                    Pessoa Física
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCustomer(prev => ({ ...prev, type: CustomerType.COMPANY }))}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                                        customer.type === CustomerType.COMPANY ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'
                                    }`}
                                >
                                    Pessoa Jurídica
                                </button>
                            </nav>
                        </div>
                        
                        {/* Conditional Fields */}
                        {customer.type === CustomerType.INDIVIDUAL ? (
                             <fieldset className="border border-green-800 p-4 rounded-lg">
                                <legend className="px-2 text-green-400 font-semibold">Pessoa Física</legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Nome Completo" name="fullName" value={customer.fullName} onChange={handleChange} required />
                                    <InputField label="CPF" name="cpf" value={customer.cpf} onChange={handleChange} />
                                    <InputField label="Telefone" name="phone" value={customer.phone} onChange={handleChange} required />
                                </div>
                            </fieldset>
                        ) : (
                            <fieldset className="border border-green-800 p-4 rounded-lg">
                                <legend className="px-2 text-green-400 font-semibold">Pessoa Jurídica</legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Razão Social" name="companyName" value={customer.companyName} onChange={handleChange} required />
                                    <InputField label="Nome Fantasia" name="tradingName" value={customer.tradingName} onChange={handleChange} />
                                    <InputField label="CNPJ" name="cnpj" value={customer.cnpj} onChange={handleChange} required />
                                    <InputField label="Inscrição Estadual" name="stateRegistration" value={customer.stateRegistration} onChange={handleChange} />
                                    <InputField label="Nome de Contato" name="contactName" value={customer.contactName} onChange={handleChange} />
                                    <InputField label="Telefone" name="phone" value={customer.phone} onChange={handleChange} required />
                                </div>
                            </fieldset>
                        )}
                        
                        {/* Address Fields */}
                        <fieldset className="border border-green-800 p-4 rounded-lg">
                            <legend className="px-2 text-green-400 font-semibold">Endereço</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="CEP" name="zipCode" value={customer.address.zipCode} onChange={handleAddressChange} />
                                <InputField label="Logradouro" name="street" value={customer.address.street} onChange={handleAddressChange} className="md:col-span-2" />
                                <InputField label="Número" name="number" value={customer.address.number} onChange={handleAddressChange} />
                                <InputField label="Complemento" name="complement" value={customer.address.complement} onChange={handleAddressChange} />
                                <InputField label="Bairro" name="neighborhood" value={customer.address.neighborhood} onChange={handleAddressChange} />
                                <InputField label="Cidade" name="city" value={customer.address.city} onChange={handleAddressChange} />
                                <InputField label="Estado" name="state" value={customer.address.state} onChange={handleAddressChange} />
                            </div>
                        </fieldset>

                        {/* Actions */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">
                                Cancelar
                            </button>
                            <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, name, type = 'text', value, onChange, required = false, className = '' }) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
        />
    </div>
);


const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(initialMockCustomers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

    const handleOpenModal = (customer: Customer | null = null) => {
        setCustomerToEdit(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCustomerToEdit(null);
    };

    const handleSaveCustomer = (customer: Customer) => {
        if (customerToEdit) {
            setCustomers(customers.map(c => c.id === customer.id ? customer : c));
        } else {
            setCustomers([...customers, customer]);
        }
        handleCloseModal();
    };

    const handleDeleteCustomer = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            setCustomers(customers.filter(c => c.id !== id));
        }
    };

    return (
        <div className="space-y-6">
             <CustomerModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveCustomer}
                customerToEdit={customerToEdit}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Clientes</h1>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 w-full sm:w-auto"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Adicionar Novo Cliente
                </button>
            </div>

            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-green-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome / Razão Social</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3">Telefone</th>
                                <th scope="col" className="px-6 py-3">Cidade</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                        {customer.type === CustomerType.INDIVIDUAL ? customer.fullName : customer.companyName}
                                    </th>
                                    <td className="px-6 py-4">{customer.type}</td>
                                    <td className="px-6 py-4">{customer.phone}</td>
                                    <td className="px-6 py-4">{customer.address.city}</td>
                                    <td className="px-6 py-4 space-x-4">
                                        <button onClick={() => handleOpenModal(customer)} className="font-medium text-green-400 hover:underline">Editar</button>
                                        <button onClick={() => handleDeleteCustomer(customer.id)} className="font-medium text-red-400 hover:underline">Excluir</button>
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

export default CustomersPage;