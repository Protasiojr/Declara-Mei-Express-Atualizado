
import React from 'react';

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
        <h2 className="text-xl font-semibold text-white mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
        </div>
    </div>
);

const FormField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        <input 
            type="text" 
            defaultValue={value}
            className="mt-1 block w-full bg-green-800 border-green-700 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500"
        />
    </div>
);

const CompanyPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Dados da Empresa</h1>
            
            <form className="space-y-6">
                <FormSection title="Dados Cadastrais">
                    <FormField label="Nome da Empresa" value="Minha Empresa MEI" />
                    <FormField label="Empreendedor" value="João Protásio Jr." />
                    <FormField label="CNPJ" value="12.345.678/0001-90" />
                    <FormField label="Data da Criação" value="01/01/2024" />
                </FormSection>

                <FormSection title="Endereço">
                    <FormField label="CEP" value="12345-678" />
                    <FormField label="Rua/Logradouro" value="Rua das Flores" />
                    <FormField label="Número" value="123" />
                    <FormField label="Complemento" value="Sala 1" />
                    <FormField label="Bairro" value="Centro" />
                    <FormField label="Cidade" value="São Paulo" />
                    <FormField label="Estado" value="SP" />
                </FormSection>

                <div className="flex justify-end">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyPage;