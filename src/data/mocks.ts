import { Customer, CustomerType, Employee } from '../domain/types';

export const initialMockCustomers: Customer[] = [
    { 
        id: '1', 
        type: CustomerType.INDIVIDUAL,
        fullName: 'Cliente Feliz',
        cpf: '111.222.333-44',
        phone: '(11) 99999-8888',
        address: {
            street: 'Rua das Alegrias',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01001-000'
        }
    },
    { 
        id: '2', 
        type: CustomerType.COMPANY,
        companyName: 'Empresa Parceira LTDA',
        tradingName: 'Empresa Parceira',
        cnpj: '12.345.678/0001-99',
        stateRegistration: 'Isento',
        contactName: 'Sr. Contato',
        phone: '(21) 88888-7777',
        address: {
            street: 'Avenida Brasil',
            number: '1000',
            neighborhood: 'Bonsucesso',
            city: 'Rio de Janeiro',
            state: 'RJ',
            zipCode: '21040-360'
        }
    },
    {
        id: '3',
        type: CustomerType.INDIVIDUAL,
        fullName: 'Sr. Silva',
        cpf: '444.555.666-77',
        phone: '(31) 77777-6666',
        address: {
            street: 'Rua dos Inconfidentes',
            number: '500',
            neighborhood: 'Savassi',
            city: 'Belo Horizonte',
            state: 'MG',
            zipCode: '30140-120'
        }
    }
];

export const pdvMockCustomers: Customer[] = [
    { 
        id: '1', 
        type: CustomerType.INDIVIDUAL,
        fullName: 'Cliente Feliz',
        cpf: '111.222.333-44',
        phone: '(11) 99999-8888',
        address: { street: 'Rua das Alegrias', number: '123', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', zipCode: '01001-000' }
    },
    { 
        id: '2', 
        type: CustomerType.COMPANY,
        companyName: 'Empresa Parceira LTDA',
        tradingName: 'Empresa Parceira',
        cnpj: '12.345.678/0001-99',
        stateRegistration: 'Isento',
        contactName: 'Sr. Contato',
        phone: '(21) 88888-7777',
        address: { street: 'Avenida Brasil', number: '1000', neighborhood: 'Bonsucesso', city: 'Rio de Janeiro', state: 'RJ', zipCode: '21040-360' }
    },
    {
        id: '3',
        type: CustomerType.INDIVIDUAL,
        fullName: 'Sr. Silva',
        cpf: '444.555.666-77',
        phone: '(31) 77777-6666',
        address: { street: 'Rua dos Inconfidentes', number: '500', neighborhood: 'Savassi', city: 'Belo Horizonte', state: 'MG', zipCode: '30140-120' }
    }
];

export const mockProducts = [
    { id: 1, name: 'Produto A', category: 'Eletrônicos', barcode: '789000000001', sku: 'PA-001', price: 10.00, stock: 100 },
    { id: 2, name: 'Produto B', category: 'Material Escritório', barcode: '789000000002', sku: 'PB-002', price: 25.50, stock: 50 },
    { id: 3, name: 'Produto C', category: 'Alimentos', barcode: '789000000003', sku: 'PC-003', price: 5.75, stock: 200 },
    { id: 4, name: 'Produto D', category: 'Bebidas', barcode: '789000000004', sku: 'PD-004', price: 18.20, stock: 150 },
    { id: 5, name: 'Produto E', category: 'Limpeza', barcode: '789000000005', sku: 'PE-005', price: 33.00, stock: 80 },
    { id: 6, name: 'Produto F', category: 'Higiene', barcode: '789000000006', sku: 'PF-006', price: 12.00, stock: 120 },
];
export const mockServices = [
    { id: 101, name: 'Serviço X', price: 50.00 },
    { id: 102, name: 'Serviço Y', price: 150.00 },
    { id: 103, name: 'Serviço Z', price: 120.00 },
];

export const searchablePdvItems = [
    ...mockProducts.map(p => ({ ...p, type: 'product', price: p.price, id: `prod-${p.id}` })),
    ...mockServices.map(s => ({ ...s, type: 'service', price: s.price, id: `serv-${s.id}` }))
];


export const mockPayables = [
    { id: 1, desc: 'Aluguel', category: 'Despesas Fixas', value: 'R$ 800,00', due: '10/07/2025', paid: false },
    { id: 2, desc: 'Fornecedor A', category: 'Compras', value: 'R$ 450,00', due: '15/07/2025', paid: false },
    { id: 3, desc: 'Internet', category: 'Despesas Fixas', value: 'R$ 99,00', due: '05/07/2025', paid: true },
];

export const mockReceivables = [
    { id: 1, desc: 'Venda #123 - Cliente Feliz', value: 'R$ 300,00', due: '20/07/2025', received: false },
    { id: 2, desc: 'Serviço Y - Empresa Parceira', value: 'R$ 120,00', due: '01/08/2025', received: false },
    { id: 3, desc: 'Venda #121 - Sr. Silva', value: 'R$ 80,00', due: '01/07/2025', received: true },
];

export const initialMockEmployees: Employee[] = [
    { 
        id: '1', 
        name: 'João da Silva', 
        phone: '(11) 91234-5678', 
        pis: '120.12345.67-8',
        ctps: '1234567-89',
        address: {
            street: 'Rua das Flores',
            number: '123',
            complement: 'Apto 101',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01001-000'
        },
        vacationStart: '2025-01-01',
        vacationEnd: '2025-01-30'
    },
    { 
        id: '2', 
        name: 'Maria Oliveira', 
        phone: '(21) 98765-4321',
        pis: '120.87654.32-1',
        ctps: '9876543-21',
        address: {
            street: 'Avenida Copacabana',
            number: '500',
            complement: '',
            neighborhood: 'Copacabana',
            city: 'Rio de Janeiro',
            state: 'RJ',
            zipCode: '22020-001'
        }
    },
];