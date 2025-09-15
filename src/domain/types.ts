
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