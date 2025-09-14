
import React from 'react';
import { PlusCircleIcon } from '../components/icons';

const mockCustomers = [
    { id: 1, name: 'Cliente Feliz', type: 'Pessoa Física', phone: '(11) 99999-8888', city: 'São Paulo' },
    { id: 2, name: 'Empresa Parceira', type: 'Pessoa Jurídica', phone: '(21) 88888-7777', city: 'Rio de Janeiro' },
    { id: 3, name: 'Sr. Silva', type: 'Pessoa Física', phone: '(31) 77777-6666', city: 'Belo Horizonte' },
];

const CustomersPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Clientes</h1>
                <button className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Adicionar Novo Cliente
                </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome / Razão Social</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3">Telefone</th>
                                <th scope="col" className="px-6 py-3">Cidade</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockCustomers.map(customer => (
                                <tr key={customer.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{customer.name}</th>
                                    <td className="px-6 py-4">{customer.type}</td>
                                    <td className="px-6 py-4">{customer.phone}</td>
                                    <td className="px-6 py-4">{customer.city}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <a href="#" className="font-medium text-indigo-400 hover:underline">Editar</a>
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

export default CustomersPage;
