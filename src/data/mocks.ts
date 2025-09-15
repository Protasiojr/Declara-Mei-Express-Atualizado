
import { Customer, CustomerType, Employee, Product, ProductType, Service, Payable, Receivable } from '../domain/types';

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
    // FIX: Completed the truncated customer object.
    {
        id: '3',
        type: CustomerType.INDIVIDUAL,
        fullName: 'Sr. Silva',
        cpf: '444.555.666-77',
        phone: '(31) 77777-6666',
        address: { street: 'Rua dos Inconfidentes', number: '500', neighborhood: 'Savassi', city: 'Belo Horizonte', state: 'MG', zipCode: '30140-120' }
    }
];

export const mockProducts: Product[] = [
    { id: 'p1', name: 'Produto A', barcode: '123456789', sku: 'PA001', category: 'Eletrônicos', description: 'Um produto eletrônico A', costPrice: 50, sellPrice: 99.9, stock: 100, minStock: 10, unit: 'un', type: ProductType.RESALE },
    { id: 'p2', name: 'Produto B', barcode: '987654321', sku: 'PB002', category: 'Roupas', description: 'Um produto de vestuário B', costPrice: 25, sellPrice: 59.9, stock: 200, minStock: 20, unit: 'pç', type: ProductType.RESALE },
    { id: 'p3', name: 'Produto Industrializado C', barcode: '112233445', sku: 'PC003', category: 'Alimentos', description: 'Um produto alimentício C', costPrice: 5, sellPrice: 12.5, stock: 50, minStock: 5, unit: 'un', type: ProductType.INDUSTRIALIZED },
    { id: 'p4', name: 'Produto D', barcode: '556677889', sku: 'PD004', category: 'Eletrônicos', description: 'Um produto eletrônico D', costPrice: 150, sellPrice: 249.9, stock: 30, minStock: 5, unit: 'un', type: ProductType.RESALE },
];

export const mockServices: Service[] = [
    { id: 's1', name: 'Serviço X', price: 150.00 },
    { id: 's2', name: 'Serviço Y', price: 200.00 },
    { id: 's3', name: 'Serviço Z', price: 75.50 },
];

export const initialMockEmployees: Employee[] = [
    { id: 'e1', name: 'João Funcionário', phone: '(11) 98765-4321', pis: '123.45678.90-1', ctps: '1234567', address: { street: 'Rua do Trabalho', number: '1', neighborhood: 'Vila Operária', city: 'São Paulo', state: 'SP', zipCode: '02002-000' } },
    { id: 'e2', name: 'Maria Colaboradora', phone: '(21) 91234-5678', pis: '987.65432.10-9', ctps: '7654321', address: { street: 'Avenida Central', number: '2', neighborhood: 'Centro', city: 'Rio de Janeiro', state: 'RJ', zipCode: '20002-000' } },
];

export const mockPayables: Payable[] = [
    { id: 'pay1', description: 'Aluguel', category: 'Despesa Fixa', value: 800.00, dueDate: '2024-08-05', paid: false },
    { id: 'pay2', description: 'Fornecedor A', category: 'Compra de Mercadoria', value: 450.00, dueDate: '2024-08-10', paid: false },
    { id: 'pay3', description: 'Conta de Luz', category: 'Despesa Fixa', value: 150.00, dueDate: '2024-07-28', paid: true },
];

export const mockReceivables: Receivable[] = [
    { id: 'rec1', description: 'Venda para Cliente Feliz', value: 300.00, dueDate: '2024-08-15', received: false },
    { id: 'rec2', description: 'Serviço para Empresa Parceira', value: 120.00, dueDate: '2024-08-20', received: false },
    { id: 'rec3', description: 'Venda para Sr. Silva', value: 250.00, dueDate: '2024-07-25', received: true },
];

interface SearchableProduct {
    id: string; name: string; barcode?: string; sku: string; category: string; price: number; stock: number; type: 'product';
}
interface SearchableService {
    id: string; name: string; price: number; type: 'service';
}
type SearchableItem = SearchableProduct | SearchableService;

export const searchablePdvItems: SearchableItem[] = [
    ...mockProducts.map(p => ({
        id: p.id,
        name: p.name,
        barcode: p.barcode,
        sku: p.sku,
        category: p.category,
        price: p.sellPrice,
        stock: p.stock,
        type: 'product' as const,
    })),
    ...mockServices.map(s => ({
        id: s.id,
        name: s.name,
        price: s.price,
        type: 'service' as const,
    })),
];
