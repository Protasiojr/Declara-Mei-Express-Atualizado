import React, { useState, useEffect } from 'react';
import { PlusCircleIcon } from '../components/icons';
import { Employee, Address } from '../../domain/types';
import { initialMockEmployees } from '../../data/mocks';

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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-green-800">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">{employeeToEdit ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
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
    const [employees, setEmployees] = useState<Employee[]>(initialMockEmployees);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

    const handleOpenModal = (employee: Employee | null = null) => {
        setEmployeeToEdit(employee);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEmployeeToEdit(null);
    };

    const handleSaveEmployee = (employee: Employee) => {
        if (employeeToEdit) {
            setEmployees(employees.map(e => e.id === employee.id ? employee : e));
        } else {
            setEmployees([...employees, employee]);
        }
        handleCloseModal();
    };

    const handleDeleteEmployee = (id: string) => {
        if(window.confirm('Tem certeza que deseja excluir este funcionário?')) {
            setEmployees(employees.filter(e => e.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <EmployeeModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveEmployee}
                employeeToEdit={employeeToEdit}
            />
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Funcionários</h1>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Adicionar Funcionário
                </button>
            </div>

            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                 <div className="overflow-x-auto">
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
                            {employees.map(employee => (
                                <tr key={employee.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{employee.name}</th>
                                    <td className="px-6 py-4">{employee.phone}</td>
                                    <td className="px-6 py-4">{employee.ctps}</td>
                                    <td className="px-6 py-4 space-x-4">
                                        <button onClick={() => handleOpenModal(employee)} className="font-medium text-green-400 hover:underline">Editar</button>
                                        <button onClick={() => handleDeleteEmployee(employee.id)} className="font-medium text-red-400 hover:underline">Excluir</button>
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

export default EmployeesPage;