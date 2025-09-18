
// FIX: Added missing exports to resolve import errors in multiple components.
import { Customer, CustomerType, Employee, Product, ProductType, Service, Payable, Receivable, Supplier, Promotion, DeliveryPerson, DayOfWeek } from '../domain/types';

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
    // FIX: Completed missing customer data.
    {
        id: '3',
        type: CustomerType.INDIVIDUAL,
        fullName: 'Sr. Silva',
        cpf: '444.555.666-77',
        phone: '(31) 77777-6666',
        address: { street: 'Rua dos Inconfidentes', number: '500', neighborhood: 'Savassi', city: 'Belo Horizonte', state: 'MG', zipCode: '30140-120' }
    }
];

export const initialMockEmployees: Employee[] = [
    {
        id: 'emp1',
        name: 'Carlos Alberto',
        phone: '(11) 98765-4321',
        pis: '123.45678.90-1',
        ctps: '1234567 001-SP',
        address: {
            street: 'Rua dos Trabalhadores',
            number: '456',
            neighborhood: 'Vila Operária',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '02002-000'
        }
    },
    {
        id: 'emp2',
        name: 'Fernanda Lima',
        phone: '(21) 91234-5678',
        pis: '987.65432.10-9',
        ctps: '7654321 002-RJ',
        address: {
            street: 'Avenida Copacabana',
            number: '789',
            neighborhood: 'Copacabana',
            city: 'Rio de Janeiro',
            state: 'RJ',
            zipCode: '22020-001'
        }
    }
];

export const initialMockDeliveryPersons: DeliveryPerson[] = [
    {
        id: 'dp1',
        name: 'João da Entrega',
        phone: '(11) 91111-2222',
        deliveryCompany: 'Entrega Rápida Express',
        address: {
            street: 'Rua das Entregas',
            number: '100',
            neighborhood: 'Logística',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '04004-004'
        }
    },
    {
        id: 'dp2',
        name: 'Maria Transportes',
        phone: '(21) 93333-4444',
        deliveryCompany: 'Própria',
        address: {
            street: 'Avenida dos Pacotes',
            number: '200',
            neighborhood: 'Comércio',
            city: 'Rio de Janeiro',
            state: 'RJ',
            zipCode: '22022-022'
        }
    }
];

export const mockProducts: Product[] = [
    { id: 'prod1', name: 'Produto A', sku: 'SKU-001', category: 'Eletrônicos', costPrice: 50, sellPrice: 99.9, stock: 15, minStock: 5, unit: 'un', type: ProductType.RESALE, barcode: '789000000001' },
    { id: 'prod2', name: 'Produto B', sku: 'SKU-002', category: 'Limpeza', costPrice: 5, sellPrice: 8.5, stock: 50, minStock: 20, unit: 'un', type: ProductType.RESALE, barcode: '789000000002' },
    { id: 'prod3', name: 'Produto C', sku: 'SKU-003', category: 'Alimentos', costPrice: 10, sellPrice: 15, stock: 3, minStock: 10, unit: 'kg', type: ProductType.INDUSTRIALIZED, barcode: '789000000003' },
    { id: 'prod4', name: 'Produto D', sku: 'SKU-004', category: 'Bebidas', costPrice: 2, sellPrice: 3.5, stock: 100, minStock: 30, unit: 'un', type: ProductType.RESALE, barcode: '789000000004' },
    { id: 'prod5', name: 'Produto E', sku: 'SKU-005', category: 'Papelaria', costPrice: 1, sellPrice: 2.5, stock: 0, minStock: 10, unit: 'un', type: ProductType.RESALE, barcode: '789000000005' },
    { id: 'prod6', name: 'Caneca Personalizada', sku: 'SKU-006', category: 'Presentes', costPrice: 8, sellPrice: 25.0, stock: 20, minStock: 5, unit: 'un', type: ProductType.INDUSTRIALIZED, barcode: '789000000006' }
];

export const mockServices: Service[] = [
    { id: 'serv1', name: 'Serviço X', price: 150 },
    { id: 'serv2', name: 'Serviço Y', price: 200 },
    { id: 'serv3', name: 'Consultoria', price: 350 },
];

// This type is defined locally in PdvPage.tsx, so we cast the items to match.
export const searchablePdvItems = [
    ...mockProducts.map(p => ({
        id: p.id,
        name: p.name,
        barcode: p.barcode,
        sku: p.sku,
        category: p.category,
        price: p.sellPrice,
        stock: p.stock,
        type: 'product' as const
    })),
    ...mockServices.map(s => ({
        id: s.id,
        name: s.name,
        price: s.price,
        type: 'service' as const
    }))
];

export const mockPayables: Payable[] = [
    { id: 'pay1', description: 'Aluguel', category: 'Despesa Fixa', value: 800, dueDate: '10/08/2024', paid: false },
    { id: 'pay2', description: 'Fornecedor Tech', category: 'Compra', value: 350, dueDate: '01/08/2024', paid: false },
    { id: 'pay3', description: 'Conta de Luz', category: 'Despesa Variável', value: 100, dueDate: '25/07/2024', paid: true },
];

export const mockReceivables: Receivable[] = [
    { id: 'rec1', description: 'Venda #123', value: 250, dueDate: '15/08/2024', received: false },
    { id: 'rec2', description: 'Serviço de Consultoria', value: 170, dueDate: '28/07/2024', received: true },
];

export const initialMockSuppliers: Supplier[] = [
    {
        id: 'sup1',
        companyName: 'Fornecedor Tech LTDA',
        cnpj: '98.765.432/0001-11',
        contactName: 'Sra. Roberta',
        phone: '(11) 5555-4444',
        address: {
            street: 'Rua das Indústrias',
            number: '789',
            neighborhood: 'Distrito Industrial',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '03003-000'
        }
    },
    {
        id: 'sup2',
        companyName: 'Distribuidora de Alimentos S.A.',
        tradingName: 'Distribuidora Sabor',
        cnpj: '11.222.333/0001-44',
        contactName: 'Sr. Mário',
        phone: '(31) 4444-3333',
        address: {
            street: 'Avenida dos Sabores',
            number: '101',
            neighborhood: 'Centro',
            city: 'Belo Horizonte',
            state: 'MG',
            zipCode: '30110-001'
        }
    }
];

export const mockPromotions: Promotion[] = [
    {
        id: 'promo1',
        name: 'Queima de Estoque Produto C',
        description: 'Desconto para zerar o estoque!',
        productId: 'prod3',
        productName: 'Produto C',
        originalPrice: 15,
        discountPercentage: 20,
        promotionalPrice: 12,
        startDate: '2024-07-01',
        endDate: '2024-07-31',
        status: 'Ativa'
    },
    {
        id: 'promo2',
        name: 'Promoção de Inverno',
        description: 'Desconto especial para canecas',
        productId: 'prod6',
        productName: 'Caneca Personalizada',
        originalPrice: 25,
        discountPercentage: 10,
        promotionalPrice: 22.5,
        startDate: '2024-08-01',
        endDate: '2024-08-15',
        status: 'Agendada'
    }
];