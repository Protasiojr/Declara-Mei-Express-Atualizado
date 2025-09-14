
import React from 'react';
import { PlusCircleIcon } from '../components/icons';

const mockEmployees = [
    { id: 1, name: 'João da Silva', phone: '(11) 91234-5678', ctps: '1234567-89' },
    { id: 2, name: 'Maria Oliveira', phone: '(21) 98765-4321', ctps: '9876543-21' },
];

const EmployeesPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Funcionários</h1>
                <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">
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
                            {mockEmployees.map(employee => (
                                <tr key={employee.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{employee.name}</th>
                                    <td className="px-6 py-4">{employee.phone}</td>
                                    <td className="px-6 py-4">{employee.ctps}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <a href="#" className="font-medium text-green-400 hover:underline">Editar</a>
                                        <a href="#" className="font-medium text-red-400 hover:underline">Excluir</a>
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