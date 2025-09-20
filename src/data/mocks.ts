





// FIX: Added missing exports to resolve import errors in multiple components.
import { Customer, CustomerType, Employee, Product, ProductType, Service, Payable, Receivable, Supplier, Promotion, DeliveryPerson, DayOfWeek, Order, Delivery, AuditUser, UserAction, SystemLog, ChatContact, ChatConversation } from '../domain/types';

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


export const mockOrders: Order[] = [
    {
        id: 'PED-001',
        customerId: '1',
        customerName: 'Cliente Feliz',
        orderDate: '2024-07-28',
        totalValue: 124.9,
        status: 'Entregue',
        paymentMethod: 'PIX',
        items: [
            { id: 'item-1-1', productId: 'prod1', productName: 'Produto A', quantity: 1, unitPrice: 99.9, subtotal: 99.9 },
            { id: 'item-1-2', productId: 'prod6', productName: 'Caneca Personalizada', quantity: 1, unitPrice: 25.0, subtotal: 25.0 }
        ]
    },
    {
        id: 'PED-002',
        customerId: '2',
        customerName: 'Empresa Parceira LTDA',
        orderDate: '2024-07-29',
        totalValue: 170.0,
        status: 'Pago',
        paymentMethod: 'Cartão de Crédito',
        items: [
            { id: 'item-2-1', productId: 'prod2', productName: 'Produto B', quantity: 20, unitPrice: 8.5, subtotal: 170.0 }
        ]
    },
    {
        id: 'PED-003',
        customerName: 'Cliente Avulso',
        orderDate: '2024-07-30',
        totalValue: 7.0,
        status: 'Aberto',
        paymentMethod: 'Dinheiro',
        items: [
            { id: 'item-3-1', productId: 'prod4', productName: 'Produto D', quantity: 2, unitPrice: 3.5, subtotal: 7.0 }
        ]
    },
    {
        id: 'PED-004',
        customerId: '3',
        customerName: 'Sr. Silva',
        orderDate: '2024-07-30',
        totalValue: 15,
        status: 'Cancelado',
        paymentMethod: 'Fiado',
        items: [
            { id: 'item-4-1', productId: 'prod3', productName: 'Produto C', quantity: 1, unitPrice: 15, subtotal: 15.0 }
        ]
    }
];

export const mockDeliveries: Delivery[] = [
    {
        id: 'ENT-001',
        orderId: 'PED-001',
        deliveryPersonId: 'dp1',
        deliveryPersonName: 'João da Entrega',
        deliveryAddress: 'Rua das Alegrias, 123, Centro, São Paulo, SP',
        status: 'Entregue',
        estimatedDate: '2024-07-28',
        deliveryDate: '2024-07-28',
        responsible: 'Motoboy',
        deliveryCost: 15.00
    },
    {
        id: 'ENT-002',
        orderId: 'PED-002',
        deliveryPersonId: 'dp2',
        deliveryPersonName: 'Maria Transportes',
        deliveryAddress: 'Avenida Brasil, 1000, Bonsucesso, Rio de Janeiro, RJ',
        status: 'Em trânsito',
        estimatedDate: '2024-07-31',
        responsible: 'Transportadora',
        deliveryCost: 50.00
    },
    {
        id: 'ENT-003',
        orderId: 'PED-003',
        deliveryAddress: 'A ser retirado na loja',
        status: 'Pendente',
        estimatedDate: '2024-08-01',
        responsible: 'Entregador Próprio',
        deliveryCost: 0
    },
        {
        id: 'ENT-004',
        orderId: 'PED-004',
        deliveryAddress: 'Rua dos Inconfidentes, 500, Savassi, Belo Horizonte, MG',
        status: 'Cancelada',
        estimatedDate: '2024-07-30',
        responsible: 'Motoboy',
        deliveryCost: 12.00
    }
];

export const mockAuditUsers: AuditUser[] = [
    { id: 'user1', name: 'Administrador', lastLogin: '30/07/2024 10:00:00' },
    { id: 'emp1', name: 'Carlos Alberto', lastLogin: '29/07/2024 15:30:00' },
    { id: 'emp2', name: 'Fernanda Lima', lastLogin: '30/07/2024 09:15:23' },
];

export const mockUserActions: UserAction[] = [
    // Admin actions
    { id: 'act1', userId: 'user1', timestamp: '30/07/2024 10:00:00', action: 'Login', details: 'Login bem-sucedido do IP 192.168.1.1' },
    { id: 'act2', userId: 'user1', timestamp: '30/07/2024 10:05:12', action: 'Criação de Produto', details: 'Produto "Caneca Personalizada" (SKU-006) criado.' },
    { id: 'act3', userId: 'user1', timestamp: '30/07/2024 10:15:45', action: 'Abertura de Caixa', details: 'Caixa aberto com saldo inicial de R$ 100,00.' },
    { id: 'act4', userId: 'user1', timestamp: '30/07/2024 10:20:03', action: 'Venda Realizada', details: 'Venda #PED-003 registrada no valor de R$ 7,00.' },
    // Carlos actions
    { id: 'act5', userId: 'emp1', timestamp: '29/07/2024 15:30:00', action: 'Login', details: 'Login bem-sucedido do IP 192.168.1.5' },
    { id: 'act6', userId: 'emp1', timestamp: '29/07/2024 15:32:10', action: 'Cadastro de Cliente', details: 'Cliente "Sr. Silva" cadastrado.' },
    // Fernanda actions
    { id: 'act7', userId: 'emp2', timestamp: '30/07/2024 09:15:23', action: 'Login', details: 'Login bem-sucedido do IP 192.168.1.8' },
    { id: 'act8', userId: 'emp2', timestamp: '30/07/2024 09:18:00', action: 'Ajuste de Estoque', details: 'Produto "Produto C" (SKU-003) ajustado para 3 unidades. Motivo: Contagem de inventário.' },
];

export const mockSystemLogs: SystemLog[] = [
    { id: 'log1', timestamp: '30/07/2024 10:00:00', level: 'INFO', message: 'Servidor iniciado com sucesso.' },
    { id: 'log2', timestamp: '30/07/2024 10:05:12', level: 'INFO', message: 'Operação de escrita no banco de dados (produtos) concluída.' },
    { id: 'log3', timestamp: '30/07/2024 10:18:30', level: 'AVISO', message: 'A resposta da API de CEP demorou mais que o esperado (1500ms).' },
    { id: 'log4', timestamp: '30/07/2024 10:25:00', level: 'ERRO', message: 'Falha ao conectar ao serviço de emissão de NF-e. Endpoint indisponível.' },
    { id: 'log5', timestamp: '30/07/2024 10:30:00', level: 'INFO', message: 'Backup diário automático iniciado.' },
    { id: 'log6', timestamp: '30/07/2024 10:35:15', level: 'ERRO', message: 'Tentativa de login falhou para o usuário "visitante" a partir do IP 203.0.113.10.' },
];

export const mockChatContacts: ChatContact[] = [
    {
        id: 'cli1',
        name: 'Cliente Feliz',
        phone: '+5511999998888',
        type: 'Cliente',
        lastMessage: 'Ok, obrigado!',
        lastMessageTimestamp: '10:45',
        unreadCount: 0,
    },
    {
        id: 'cli2',
        name: 'Empresa Parceira',
        phone: '+5521888887777',
        type: 'Cliente',
        lastMessage: 'Pode me enviar o orçamento atualizado?',
        lastMessageTimestamp: 'Ontem',
        unreadCount: 2,
    },
    {
        id: 'ent1',
        name: 'João da Entrega',
        phone: '+5511911112222',
        type: 'Entregador',
        lastMessage: 'A caminho para a próxima entrega.',
        lastMessageTimestamp: '11:30',
        unreadCount: 0,
    },
    {
        id: 'for1',
        name: 'Fornecedor Tech',
        phone: '+551155554444',
        type: 'Fornecedor',
        lastMessage: 'Seu pedido foi despachado.',
        lastMessageTimestamp: 'Sexta-feira',
        unreadCount: 0,
    },
    {
        id: 'sup1',
        name: 'Suporte DME',
        phone: '+5511987654321',
        type: 'Suporte',
        lastMessage: 'Sua solicitação #123 foi resolvida.',
        lastMessageTimestamp: '14:20',
        unreadCount: 0,
    },
];

export const mockConversations: ChatConversation[] = [
    {
        contactId: 'cli1',
        messages: [
            { id: 'msg1', text: 'Bom dia! Gostaria de saber sobre o status do meu pedido PED-001.', sender: 'contact', timestamp: '10:40', status: 'read' },
            { id: 'msg2', text: 'Olá! Seu pedido já foi entregue.', sender: 'me', timestamp: '10:42', status: 'read' },
            { id: 'msg3', text: 'Ok, obrigado!', sender: 'contact', timestamp: '10:45', status: 'read' },
        ]
    },
    {
        contactId: 'cli2',
        messages: [
            { id: 'msg4', text: 'Boa tarde, a fatura deste mês já foi emitida?', sender: 'me', timestamp: 'Ontem', status: 'read' },
            { id: 'msg5', text: 'Olá, boa tarde! Sim, já enviei para o seu email.', sender: 'contact', timestamp: 'Ontem', status: 'delivered' },
            { id: 'msg6', text: 'Pode me enviar o orçamento atualizado?', sender: 'contact', timestamp: 'Ontem', status: 'delivered' },
        ]
    },
    {
        contactId: 'ent1',
        messages: [
            { id: 'msg7', text: 'A caminho para a próxima entrega.', sender: 'contact', timestamp: '11:30', status: 'read' },
        ]
    },
    {
        contactId: 'for1',
        messages: [
            { id: 'msg8', text: 'Seu pedido foi despachado.', sender: 'contact', timestamp: 'Sexta-feira', status: 'read' },
        ]
    },
    {
        contactId: 'sup1',
        messages: [
            { id: 'msg9', text: 'Sua solicitação #123 foi resolvida.', sender: 'contact', timestamp: '14:20', status: 'read' },
        ]
    }
];