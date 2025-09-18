import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircleIcon } from '../components/icons';
import { Employee, Address, DeliveryPerson } from '../../domain/types';
import { initialMockEmployees, initialMockDeliveryPersons } from '../../data/mocks';

const initialEmployeeState: Employee = {
    id: '',
    name: '',
    phone: '',
    pis: '',
    ctps: '',
    address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
    },
    vacationStart: '',
    vacationEnd: ''
};

const initialDeliveryPersonState: DeliveryPerson = {
    id: '',
    name: '',
    phone: '',
    deliveryCompany: '',
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

const EmployeeModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (employee: Employee) => void;
    employeeToEdit: Employee | null;
}> = ({ isOpen, onClose, onSave, employeeToEdit }) => {
    const [employee, setEmployee] = useState<Employee>(initialEmployeeState);

    useEffect(() => {
        if (employeeToEdit) {
            setEmployee(employeeToEdit);
        } else {
            setEmployee(initialEmployeeState);
        }
    }, [employeeToEdit, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmployee(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmployee(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...employee, id: employee.id || new Date().toISOString() });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-green-800">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">{employeeToEdit ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow p-6 space-y-6">
                    {/* Personal Info */}
                    <fieldset className="border border-green-800 p-4 rounded-lg">
                        <legend className="px-2 text-green-400 font-semibold">Dados Pessoais</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Nome" name="name" value={employee.name} onChange={handleChange} required />
                            <InputField label="Telefone" name="phone" value={employee.phone} onChange={handleChange} />
                            <InputField label="PIS" name="pis" value={employee.pis} onChange={handleChange} />
                            <InputField label="CTPS" name="ctps" value={employee.ctps} onChange={handleChange} />
                        </div>
                    </fieldset>

                    {/* Address */}
                    <fieldset className="border border-green-800 p-4 rounded-lg">
                        <legend className="px-2 text-green-400 font-semibold">Endereço</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField label="CEP" name="zipCode" value={employee.address.zipCode} onChange={handleAddressChange} />
                            <InputField label="Logradouro" name="street" value={employee.address.street} onChange={handleAddressChange} className="md:col-span-2" />
                            <InputField label="Número" name="number" value={employee.address.number} onChange={handleAddressChange} />
                            <InputField label="Complemento" name="complement" value={employee.address.complement} onChange={handleAddressChange} />
                            <InputField label="Bairro" name="neighborhood" value={employee.address.neighborhood} onChange={handleAddressChange} />
                            <InputField label="Cidade" name="city" value={employee.address.city} onChange={handleAddressChange} />
                            <InputField label="Estado" name="state" value={employee.address.state} onChange={handleAddressChange} />
                        </div>
                    </fieldset>

                    {/* Vacation */}
                    <fieldset className="border border-green-800 p-4 rounded-lg">
                        <legend className="px-2 text-green-400 font-semibold">Período de Férias</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Início das Férias" name="vacationStart" type="date" value={employee.vacationStart} onChange={handleChange} />
                            <InputField label="Fim das Férias" name="vacationEnd" type="date" value={employee.vacationEnd} onChange={handleChange} />
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
    );
};

const DeliveryPersonModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (deliveryPerson: DeliveryPerson) => void;
    deliveryPersonToEdit: DeliveryPerson | null;
}> = ({ isOpen, onClose, onSave, deliveryPersonToEdit }) => {
    const [deliveryPerson, setDeliveryPerson] = useState<DeliveryPerson>(initialDeliveryPersonState);

    useEffect(() => {
        setDeliveryPerson(deliveryPersonToEdit || initialDeliveryPersonState);
    }, [deliveryPersonToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDeliveryPerson(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDeliveryPerson(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...deliveryPerson, id: deliveryPerson.id || new Date().toISOString() });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-green-800">
                 <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">{deliveryPersonToEdit ? 'Editar Entregador' : 'Adicionar Novo Entregador'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow p-6 space-y-6">
                    <fieldset className="border border-green-800 p-4 rounded-lg">
                        <legend className="px-2 text-green-400 font-semibold">Dados do Entregador</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Nome" name="name" value={deliveryPerson.name} onChange={handleChange} required />
                            <InputField label="Telefone" name="phone" value={deliveryPerson.phone} onChange={handleChange} />
                            <InputField label="Empresa de Entrega" name="deliveryCompany" value={deliveryPerson.deliveryCompany} onChange={handleChange} />
                        </div>
                    </fieldset>

                    <fieldset className="border border-green-800 p-4 rounded-lg">
                        <legend className="px-2 text-green-400 font-semibold">Endereço</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField label="CEP" name="zipCode" value={deliveryPerson.address.zipCode} onChange={handleAddressChange} />
                            <InputField label="Logradouro" name="street" value={deliveryPerson.address.street} onChange={handleAddressChange} className="md:col-span-2" />
                            <InputField label="Número" name="number" value={deliveryPerson.address.number} onChange={handleAddressChange} />
                            <InputField label="Complemento" name="complement" value={deliveryPerson.address.complement} onChange={handleAddressChange} />
                            <InputField label="Bairro" name="neighborhood" value={deliveryPerson.address.neighborhood} onChange={handleAddressChange} />
                             <InputField label="Cidade" name="city" value={deliveryPerson.address.city} onChange={handleAddressChange} />
                            <InputField label="Estado" name="state" value={deliveryPerson.address.state} onChange={handleAddressChange} />
                        </div>
                    </fieldset>
                    
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Salvar</button>
                    </div>
                </form>
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


const EmployeesPage: React.FC = () => {
    // Employee states
    const [employees, setEmployees] = useState<Employee[]>(initialMockEmployees);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

    // Delivery Person states
    const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>(initialMockDeliveryPersons);
    const [isDeliveryPersonModalOpen, setIsDeliveryPersonModalOpen] = useState(false);
    const [deliveryPersonToEdit, setDeliveryPersonToEdit] = useState<DeliveryPerson | null>(null);

    // Shared states
    const [activeTab, setActiveTab] = useState<'employees' | 'deliveryPersons'>('employees');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEmployees = useMemo(() => {
        if (!searchQuery) return employees;
        const lowercasedQuery = searchQuery.toLowerCase();
        return employees.filter(employee =>
            employee.name.toLowerCase().includes(lowercasedQuery) ||
            employee.pis.includes(lowercasedQuery) ||
            employee.ctps.includes(lowercasedQuery)
        );
    }, [employees, searchQuery]);
    
    const filteredDeliveryPersons = useMemo(() => {
        if (!searchQuery) return deliveryPersons;
        const lowercasedQuery = searchQuery.toLowerCase();
        return deliveryPersons.filter(dp =>
            dp.name.toLowerCase().includes(lowercasedQuery) ||
            dp.deliveryCompany.toLowerCase().includes(lowercasedQuery)
        );
    }, [deliveryPersons, searchQuery]);

    // Employee Handlers
    const handleOpenEmployeeModal = (employee: Employee | null = null) => {
        setEmployeeToEdit(employee);
        setIsEmployeeModalOpen(true);
    };

    const handleCloseEmployeeModal = () => {
        setIsEmployeeModalOpen(false);
        setEmployeeToEdit(null);
    };

    const handleSaveEmployee = (employee: Employee) => {
        if (employeeToEdit) {
            setEmployees(employees.map(e => e.id === employee.id ? employee : e));
        } else {
            setEmployees([...employees, { ...employee, id: new Date().toISOString() }]);
        }
        handleCloseEmployeeModal();
    };

    const handleDeleteEmployee = (id: string) => {
        if(window.confirm('Tem certeza que deseja excluir este funcionário?')) {
            setEmployees(employees.filter(e => e.id !== id));
        }
    };
    
    // Delivery Person Handlers
    const handleOpenDeliveryPersonModal = (dp: DeliveryPerson | null = null) => {
        setDeliveryPersonToEdit(dp);
        setIsDeliveryPersonModalOpen(true);
    };

    const handleCloseDeliveryPersonModal = () => {
        setIsDeliveryPersonModalOpen(false);
        setDeliveryPersonToEdit(null);
    };

    const handleSaveDeliveryPerson = (dp: DeliveryPerson) => {
        if (deliveryPersonToEdit) {
            setDeliveryPersons(deliveryPersons.map(d => d.id === dp.id ? dp : d));
        } else {
            setDeliveryPersons([...deliveryPersons, { ...dp, id: new Date().toISOString() }]);
        }
        handleCloseDeliveryPersonModal();
    };
    
    const handleDeactivateDeliveryPerson = (id: string) => {
        if (window.confirm('Tem certeza que deseja desativar este entregador?')) {
            alert(`Entregador ${id} desativado. (Funcionalidade simulada)`);
            // In a real app, you would set a status flag, e.g., status: 'inactive'
        }
    };
    
    const handleAddOrder = (id: string) => {
        alert(`Funcionalidade "Adicionar Pedido" para o entregador ${id} não está implementada.`);
    };


    return (
        <div className="space-y-6">
            <EmployeeModal 
                isOpen={isEmployeeModalOpen}
                onClose={handleCloseEmployeeModal}
                onSave={handleSaveEmployee}
                employeeToEdit={employeeToEdit}
            />
             <DeliveryPersonModal 
                isOpen={isDeliveryPersonModalOpen}
                onClose={handleCloseDeliveryPersonModal}
                onSave={handleSaveDeliveryPerson}
                deliveryPersonToEdit={deliveryPersonToEdit}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Funcionários & Entregadores</h1>
                <button 
                    onClick={() => activeTab === 'employees' ? handleOpenEmployeeModal() : handleOpenDeliveryPersonModal()}
                    className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 w-full sm:w-auto"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    {activeTab === 'employees' ? 'Adicionar Funcionário' : 'Adicionar Entregador'}
                </button>
            </div>
            
            <div className="border-b border-green-800">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => { setActiveTab('employees'); setSearchQuery(''); }} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'employees' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'}`}>
                        Funcionários
                    </button>
                    <button onClick={() => { setActiveTab('deliveryPersons'); setSearchQuery(''); }} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'deliveryPersons' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'}`}>
                        Entregadores
                    </button>
                </nav>
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
                        placeholder={activeTab === 'employees' ? "Buscar por nome, PIS ou CTPS..." : "Buscar por nome ou empresa de entrega..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-green-950 border border-green-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                </div>
                 <div className="overflow-x-auto">
                     {activeTab === 'employees' ? (
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-green-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Nome</th>
                                    <th scope="col" className="px-6 py-3">Telefone</th>
                                    <th scope="col" className="px-6 py-3">CTPS</th>
                                    <th scope="col" className="px-6 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.length > 0 ? filteredEmployees.map(employee => (
                                    <tr key={employee.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{employee.name}</th>
                                        <td className="px-6 py-4">{employee.phone}</td>
                                        <td className="px-6 py-4">{employee.ctps}</td>
                                        <td className="px-6 py-4 space-x-4">
                                            <button onClick={() => handleOpenEmployeeModal(employee)} className="font-medium text-green-400 hover:underline">Editar</button>
                                            <button onClick={() => handleDeleteEmployee(employee.id)} className="font-medium text-red-400 hover:underline">Excluir</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                                            Nenhum funcionário encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                     ) : (
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-green-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Nome</th>
                                    <th scope="col" className="px-6 py-3">Empresa de Entrega</th>
                                    <th scope="col" className="px-6 py-3">Telefone</th>
                                    <th scope="col" className="px-6 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDeliveryPersons.length > 0 ? filteredDeliveryPersons.map(dp => (
                                    <tr key={dp.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{dp.name}</th>
                                        <td className="px-6 py-4">{dp.deliveryCompany}</td>
                                        <td className="px-6 py-4">{dp.phone}</td>
                                        <td className="px-6 py-4 space-x-4">
                                            <button onClick={() => handleOpenDeliveryPersonModal(dp)} className="font-medium text-green-400 hover:underline">Editar</button>
                                            <button onClick={() => handleDeactivateDeliveryPerson(dp.id)} className="font-medium text-yellow-400 hover:underline">Desativar</button>
                                            <button onClick={() => handleAddOrder(dp.id)} className="font-medium text-blue-400 hover:underline">Adicionar Pedido</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                                            Nenhum entregador encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                     )}
                </div>
            </div>
        </div>
    );
};

export default EmployeesPage;