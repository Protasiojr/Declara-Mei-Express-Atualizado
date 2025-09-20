





export enum CustomerType {
  INDIVIDUAL = 'Pessoa Física',
  COMPANY = 'Pessoa Jurídica',
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Customer {
  id: string;
  type: CustomerType;
  // Individual
  fullName?: string;
  cpf?: string;
  // Company
  companyName?: string;
  tradingName?: string;
  cnpj?: string;
  stateRegistration?: string;
  contactName?: string;

  phone: string;
  address: Address;
}

export enum ProductType {
  RESALE = 'Revenda',
  INDUSTRIALIZED = 'Industrializado',
}

export interface Product {
  id: string;
  image?: string;
  name: string;
  barcode?: string;
  sku: string;
  category: string;
  description?: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  type: ProductType;
}

export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  pis: string;
  ctps: string;
  address: Address;
  vacationStart?: string;
  vacationEnd?: string;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  deliveryCompany: string;
  address: Address;
}

export interface Payable {
  id: string;
  description: string;
  category: string;
  value: number;
  dueDate: string;
  paid: boolean;
}

export interface Receivable {
  id: string;
  description: string;
  value: number;
  dueDate: string;
  received: boolean;
}

export interface Supplier {
  id: string;
  companyName: string;
  tradingName?: string;
  cnpj: string;
  stateRegistration?: string;
  contactName?: string;
  phone: string;
  address: Address;
  invoices?: string[];
}

export type DayOfWeek = 'Dom' | 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sab';

export interface Promotion {
  id: string;
  name: string;
  description: string;
  productId: string;
  productName: string;
  originalPrice: number;
  discountPercentage: number;
  promotionalPrice: number;
  startDate: string;
  endDate: string;
  daysOfWeek?: DayOfWeek[];
  status: 'Ativa' | 'Agendada' | 'Expirada';
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = 'Aberto' | 'Pago' | 'Cancelado' | 'Entregue';

export type OrderPaymentMethod = 'Dinheiro' | 'Cartão de Débito' | 'Cartão de Crédito' | 'PIX' | 'Fiado' | 'Misto';

export interface Order {
  id: string;
  customerId?: string;
  customerName?: string;
  orderDate: string;
  totalValue: number;
  status: OrderStatus;
  paymentMethod: OrderPaymentMethod;
  items: OrderItem[];
}

export type DeliveryStatus = 'Pendente' | 'Em trânsito' | 'Entregue' | 'Cancelada';
export type DeliveryResponsible = 'Entregador Próprio' | 'Motoboy' | 'Transportadora';

export interface Delivery {
    id: string;
    orderId: string;
    deliveryPersonId?: string;
    deliveryPersonName?: string;
    deliveryAddress: string;
    status: DeliveryStatus;
    estimatedDate: string;
    deliveryDate?: string;
    responsible: DeliveryResponsible;
    deliveryCost: number;
}

export interface AuditUser {
    id: string;
    name: string;
    lastLogin: string;
}

export interface UserAction {
    id: string;
    userId: string;
    timestamp: string;
    action: string;
    details: string;
}

export interface SystemLog {
    id: string;
    timestamp: string;
    level: 'INFO' | 'AVISO' | 'ERRO';
    message: string;
}

export type ContactType = 'Cliente' | 'Entregador' | 'Fornecedor' | 'Suporte' | 'Outro';

export interface ChatContact {
    id: string;
    name: string;
    phone: string;
    type: ContactType;
    avatar?: string;
    lastMessage?: string;
    lastMessageTimestamp?: string;
    unreadCount?: number;
}

export interface ChatMessage {
    id: string;
    text: string;
    timestamp: string;
    sender: 'me' | 'contact';
    status: 'sent' | 'delivered' | 'read';
}

export interface ChatConversation {
    contactId: string;
    messages: ChatMessage[];
}