

import React, { useState, useEffect, useRef } from 'react';
import { PlusCircleIcon, FilePlusIcon, Trash2Icon } from '../components/icons';
import { Supplier, Address } from '../../domain/types';
import { initialMockSuppliers } from '../../data/mocks';

const initialSupplierState: Supplier = {
    id: '',
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
    },
    invoices: []
};

const SupplierModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (supplier: Supplier) => void;
    supplierToEdit: Supplier | null;
}> = ({ isOpen, onClose, onSave, supplierToEdit }) => {
    const [supplier, setSupplier] = useState<Supplier>(initialSupplierState);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (supplierToEdit) {
            setSupplier(supplierToEdit);
        } else {
            setSupplier(initialSupplierState);
        }
    }, [supplierToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSupplier(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSupplier(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileNames = Array.from(e.target.files).map(file => file.name);
            setSupplier(prev => ({
                ...prev,
                invoices: [...(prev.invoices || []), ...fileNames]
            }));
        }
    };

    const removeInvoice = (fileName: string) => {
        setSupplier(prev => ({
            ...prev,
            invoices: prev.invoices?.filter(name => name !== fileName)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...supplier, id: supplier.id || new Date().toISOString() });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-green-800">
                <div className="p-6 border-b border-green-800">
                    <h2 className="text-2xl font-bold text-white">{supplierToEdit ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow p-6 space-y-6">
                    <fieldset className="border border-green-800 p-4 rounded-lg">
                        <legend className="px-2 text-green-400 font-semibold">Dados Cadastrais</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Razão Social" name="companyName" value={supplier.companyName} onChange={handleChange} required />
                            <InputField label="Nome Fantasia" name="tradingName" value={supplier.tradingName} onChange={handleChange} />
                            <InputField label="CNPJ" name="cnpj" value={supplier.cnpj} onChange={handleChange} required />
                            <InputField label="Inscrição Estadual" name="stateRegistration" value={supplier.stateRegistration} onChange={handleChange} />
                            <InputField label="Nome de Contato" name="contactName" value={supplier.contactName} onChange={handleChange} />
                            <InputField label="Telefone" name="phone" value={supplier.phone} onChange={handleChange} required />
                        </div>
                    </fieldset>
                    
                    <fieldset className="border border-green-800 p-4 rounded-lg">
                        <legend className="px-2 text-green-400 font-semibold">Endereço</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField label="CEP" name="zipCode" value={supplier.address.zipCode} onChange={handleAddressChange} />
                            <InputField label="Logradouro" name="street" value={supplier.address.street} onChange={handleAddressChange} className="md:col-span-2" />
                            <InputField label="Número" name="number" value={supplier.address.number} onChange={handleAddressChange} />
                            <InputField label="Complemento" name="complement" value={supplier.address.complement} onChange={handleAddressChange} />
                            <InputField label="Bairro" name="neighborhood" value={supplier.address.neighborhood} onChange={handleAddressChange} />
                            <InputField label="Cidade" name="city" value={supplier.address.city} onChange={handleAddressChange} />
                            <InputField label="Estado" name="state" value={supplier.address.state} onChange={handleAddressChange} />
                        </div>
                    </fieldset>

                    <fieldset className="border border-green-800 p-4 rounded-lg">
                        <legend className="px-2 text-green-400 font-semibold">Notas Fiscais (Opcional)</legend>
                        <div className="space-y-3">
                            {supplier.invoices && supplier.invoices.length > 0 && (
                                <ul className="space-y-2">
                                    {supplier.invoices.map((name, index) => (
                                        <li key={index} className="flex items-center justify-between bg-green-800/50 p-2 rounded-md text-sm">
                                            <span className="text-gray-300 truncate">{name}</span>
                                            <button type="button" onClick={() => removeInvoice(name)} className="text-red-400 hover:text-red-300">
                                                <Trash2Icon className="w-4 h-4"/>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-green-700 rounded-lg text-green-400 hover:bg-green-800/50 hover:border-green-600">
                                <FilePlusIcon className="w-5 h-5 mr-2" />
                                Adicionar Arquivo
                            </button>
                        </div>
                    </fieldset>

                </form>
                <div className="p-4 bg-green-950/50 border-t border-green-800 rounded-b-lg flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                    <button type="submit" onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Salvar</button>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, name, type = 'text', value, onChange, required = false, className = '' } : { label: string, name: string, type?: string, value?: string, onChange: (e: any) => void, required?: boolean, className?: string }) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            type={type} id={name} name={name} value={value || ''} onChange={onChange} required={required}
            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
        />
    </div>
);


const SuppliersPage: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>(initialMockSuppliers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);

    const handleOpenModal = (supplier: Supplier | null = null) => {
        setSupplierToEdit(supplier);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSupplierToEdit(null);
    };

    const handleSaveSupplier = (supplier: Supplier) => {
        if (supplierToEdit) {
            setSuppliers(suppliers.map(s => s.id === supplier.id ? supplier : s));
        } else {
            setSuppliers([...suppliers, { ...supplier, id: new Date().toISOString() }]);
        }
        handleCloseModal();
    };

    const handleDeleteSupplier = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
            setSuppliers(suppliers.filter(s => s.id !== id));
        }
    };

    return (
        <div className="space-y-6">
             <SupplierModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveSupplier}
                supplierToEdit={supplierToEdit}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Fornecedores</h1>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 w-full sm:w-auto"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Adicionar Novo Fornecedor
                </button>
            </div>

            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-green-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">Razão Social</th>
                                <th scope="col" className="px-6 py-3">Contato</th>
                                <th scope="col" className="px-6 py-3">Telefone</th>
                                <th scope="col" className="px-6 py-3">Cidade</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map(supplier => (
                                <tr key={supplier.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                                        {supplier.companyName}
                                    </th>
                                    <td className="px-6 py-4">{supplier.contactName}</td>
                                    <td className="px-6 py-4">{supplier.phone}</td>
                                    <td className="px-6 py-4">{supplier.address.city}</td>
                                    <td className="px-6 py-4 space-x-4">
                                        <button onClick={() => handleOpenModal(supplier)} className="font-medium text-green-400 hover:underline">Editar</button>
                                        <button onClick={() => handleDeleteSupplier(supplier.id)} className="font-medium text-red-400 hover:underline">Excluir</button>
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

export default SuppliersPage;