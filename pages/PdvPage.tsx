import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircleIcon } from '../components/icons';
import { Customer, CustomerType, Address } from '../types';

const quickProducts = [
    { id: 1, name: "Produto A", price: 10.00 },
    { id: 2, name: "Produto B", price: 25.50 },
    { id: 3, name: "Serviço X", price: 50.00 },
    { id: 4, name: "Produto C", price: 5.75 },
    { id: 5, name: "Produto D", price: 18.20 },
    { id: 6, name: "Produto E", price: 33.00 },
    { id: 7, name: "Produto F", price: 12.00 },
    { id: 8, name: "Serviço Y", price: 150.00 },
];

const mockCustomers: Customer[] = [
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

const initialCustomerState: Customer = {
    id: '',
    type: CustomerType.INDIVIDUAL,
    fullName: '',
    cpf: '',
    companyName: '',
    tradingName: '',
    cnpj: '',
    stateRegistration: '',
    contactName: '',
    phone: '',
    address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
    }
};


interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}
type PaymentMethod = 'Dinheiro' | 'Cartão de Débito' | 'Cartão de Crédito' | 'PIX';
interface Sale {
    id: string;
    items: CartItem[];
    total: number;
    paymentMethod: PaymentMethod;
    paidAmount?: number;
    change?: number;
    timestamp: string;
    customer?: Customer;
}
interface CashierMovement {
    id: string;
    type: 'Entrada' | 'Saída';
    description: string;
    amount: number;
    timestamp: string;
}
type ActiveModal = 'openCashier' | 'payment' | 'history' | 'movements' | 'closeCashier' | 'newCustomer' | null;

const PdvPage: React.FC = () => {
    const [isCashierOpen, setIsCashierOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [initialBalance, setInitialBalance] = useState(0);
    const [cashierMovements, setCashierMovements] = useState<CashierMovement[]>([]);
    const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        if (!isCashierOpen) {
            setActiveModal('openCashier');
        } else {
            setActiveModal(null);
        }
    }, [isCashierOpen]);

    const handleOpenCashier = (balance: number) => {
        const timestamp = new Date().toLocaleString('pt-BR');
        setInitialBalance(balance);
        setCashierMovements([{ id: `mov-0`, type: 'Entrada', description: 'Saldo Inicial', amount: balance, timestamp }]);
        setIsCashierOpen(true);
    };

    const addToCart = (product: { id: number, name: string, price: number }) => {
        if (!isCashierOpen) return;
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const handleCancelSale = () => {
        setCart([]);
        setSelectedCustomer(null);
    }
    
    const handleFinalizeSale = (paymentMethod: PaymentMethod, paidAmount?: number) => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (total <= 0) return;
        
        const timestamp = new Date().toLocaleString('pt-BR');
        const newSale: Sale = {
            id: `V${Date.now()}`,
            items: [...cart], total, paymentMethod, timestamp, customer: selectedCustomer ?? undefined
        };
        if (paymentMethod === 'Dinheiro' && paidAmount && paidAmount >= total) {
            newSale.paidAmount = paidAmount;
            newSale.change = paidAmount - total;
        }

        const newMovement: CashierMovement = {
            id: `M${Date.now()}`,
            type: 'Entrada',
            description: `Venda #${newSale.id} (${paymentMethod})`,
            amount: total, timestamp,
        };

        setSalesHistory(prev => [newSale, ...prev].slice(0, 20));
        setCashierMovements(prev => [...prev, newMovement]);
        setCart([]);
        setSelectedCustomer(null);
        setActiveModal(null);
    };

    const handleSaveNewCustomer = (customer: Customer) => {
        setCustomers(prev => [...prev, customer]);
        setSelectedCustomer(customer);
        setActiveModal('payment');
    };

    const handleCloseCashier = () => {
        setIsCashierOpen(false);
        setCart([]);
        setSelectedCustomer(null);
        setInitialBalance(0);
        setCashierMovements([]);
        setSalesHistory([]);
        setActiveModal(null);
    }

    const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

    const renderModal = () => {
        switch (activeModal) {
            case 'openCashier':
                return <OpenCashierModal onOpen={handleOpenCashier} />;
            case 'payment':
                return <PaymentModal 
                            total={total} 
                            onCancel={() => { setActiveModal(null); setSelectedCustomer(null); }} 
                            onFinalize={handleFinalizeSale} 
                            customers={customers} 
                            selectedCustomer={selectedCustomer}
                            onSelectCustomer={setSelectedCustomer}
                            onAddNewCustomer={() => setActiveModal('newCustomer')}
                        />;
            case 'history':
                return <HistoryModal sales={salesHistory} onClose={() => setActiveModal(null)} />;
            case 'movements':
                return <MovementsModal movements={cashierMovements} onClose={() => setActiveModal(null)} />;
            case 'closeCashier':
                return <CloseCashierModal movements={cashierMovements} initialBalance={initialBalance} onClose={() => setActiveModal(null)} onConfirm={handleCloseCashier} />;
            case 'newCustomer':
                return <CustomerModal 
                            isOpen={true} 
                            onClose={() => setActiveModal('payment')} 
                            onSave={handleSaveNewCustomer} 
                            customerToEdit={null}
                        />;
            default:
                return null;
        }
    };
    
    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            {renderModal()}
            <div className="lg:w-2/3">
                <div className="bg-green-900 p-4 rounded-lg border border-green-800">
                    <h2 className="text-xl font-bold text-white mb-4">Produtos para Venda Rápida</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {quickProducts.map(p => (
                            <button key={p.id} onClick={() => addToCart(p)} className="bg-green-800 p-4 rounded-lg text-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isCashierOpen}>
                                <p className="font-semibold text-white">{p.name}</p>
                                <p className="text-sm text-gray-300">R$ {p.price.toFixed(2)}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:w-1/3 flex flex-col">
                <div className="bg-green-900 p-6 rounded-lg border border-green-800 flex-grow flex flex-col">
                    <h2 className="text-2xl font-bold text-white mb-4">Venda Atual</h2>
                    <div className="flex-grow overflow-y-auto pr-2 min-h-[200px]">
                        {cart.length === 0 ? (<p className="text-gray-400">Nenhum item na venda.</p>) : (
                            <ul className="space-y-3">
                                {cart.map(item => (
                                    <li key={item.id} className="flex justify-between items-center text-gray-300">
                                        <div>
                                            <p className="font-medium text-white">{item.name}</p>
                                            <p className="text-sm">{item.quantity} x R$ {item.price.toFixed(2)}</p>
                                        </div>
                                        <p className="font-semibold text-white">R$ {(item.quantity * item.price).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="border-t border-green-800 mt-4 pt-4">
                        <div className="flex justify-between text-xl font-bold text-white mb-6">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setActiveModal('history')} className="bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50" disabled={!isCashierOpen}>Histórico</button>
                            <button onClick={() => setActiveModal('movements')} className="bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50" disabled={!isCashierOpen}>Mov. Caixa</button>
                            <button onClick={handleCancelSale} className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50" disabled={!isCashierOpen || cart.length === 0}>Cancelar Venda</button>
                            <button onClick={() => setActiveModal('payment')} className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 disabled:opacity-50" disabled={!isCashierOpen || cart.length === 0}>Pagamento</button>
                        </div>
                         <button onClick={() => setActiveModal('closeCashier')} className="w-full mt-4 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50" disabled={!isCashierOpen}>Fechar Caixa</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Modal: React.FC<{ title: string; children: React.ReactNode; footer: React.ReactNode; size?: string }> = ({ title, children, footer, size = 'max-w-md' }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className={`bg-green-900 rounded-lg shadow-xl w-full ${size} border border-green-800 flex flex-col max-h-[90vh]`}>
            <div className="p-6 border-b border-green-800">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">{children}</div>
            <div className="p-4 bg-green-950/50 border-t border-green-800 rounded-b-lg">{footer}</div>
        </div>
    </div>
);

const OpenCashierModal: React.FC<{ onOpen: (balance: number) => void }> = ({ onOpen }) => {
    const [balance, setBalance] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onOpen(parseFloat(balance) || 0);
    };
    return (
        <Modal title="Abrir Caixa" footer={
            <div className="flex justify-end">
                <button type="submit" form="open-cashier-form" className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Abrir Caixa</button>
            </div>
        }>
            <form id="open-cashier-form" onSubmit={handleSubmit}>
                <label htmlFor="initial-balance" className="block text-sm font-medium text-gray-300">Saldo Inicial</label>
                <input type="number" id="initial-balance" value={balance} onChange={e => setBalance(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md text-white"
                    placeholder="R$ 0,00" autoFocus required />
            </form>
        </Modal>
    );
};

const PaymentModal: React.FC<{
    total: number;
    onCancel: () => void;
    onFinalize: (method: PaymentMethod, paidAmount?: number) => void;
    customers: Customer[];
    selectedCustomer: Customer | null;
    onSelectCustomer: (customer: Customer | null) => void;
    onAddNewCustomer: () => void;
}> = ({ total, onCancel, onFinalize, customers, selectedCustomer, onSelectCustomer, onAddNewCustomer }) => {
    const [method, setMethod] = useState<PaymentMethod>('Dinheiro');
    const [paidAmount, setPaidAmount] = useState('');
    const [search, setSearch] = useState('');
    const [showCustomerList, setShowCustomerList] = useState(false);

    const filteredCustomers = useMemo(() => {
        if (!search) return [];
        const lowercasedSearch = search.toLowerCase();
        return customers.filter(c =>
            (c.fullName?.toLowerCase() || '').includes(lowercasedSearch) ||
            (c.companyName?.toLowerCase() || '').includes(lowercasedSearch) ||
            (c.cpf?.replace(/[^\d]/g, '').includes(lowercasedSearch)) ||
            (c.cnpj?.replace(/[^\d]/g, '').includes(lowercasedSearch))
        );
    }, [search, customers]);

    const change = method === 'Dinheiro' && paidAmount ? parseFloat(paidAmount) - total : 0;
    
    return (
        <Modal title="Pagamento" footer={
            <div className="flex justify-between items-center">
                <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                <button onClick={() => onFinalize(method, parseFloat(paidAmount))} className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold disabled:opacity-50" disabled={method === 'Dinheiro' && change < 0}>Finalizar Venda</button>
            </div>
        }>
            <div className="space-y-6">
                <div className="text-center">
                    <p className="text-gray-400">Total a Pagar</p>
                    <p className="text-4xl font-bold text-white">R$ {total.toFixed(2)}</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="customer-search" className="block text-sm font-medium text-gray-300">Procurar Cliente (Opcional)</label>
                    <div className="flex items-center gap-2 relative">
                        <div className="flex-grow">
                             <input
                                type="text"
                                id="customer-search"
                                value={selectedCustomer ? (selectedCustomer.fullName || selectedCustomer.companyName) ?? '' : search}
                                onChange={(e) => { setSearch(e.target.value); onSelectCustomer(null); setShowCustomerList(true); }}
                                onFocus={() => setShowCustomerList(true)}
                                onBlur={() => setTimeout(() => setShowCustomerList(false), 200)}
                                placeholder="Digite nome, CPF/CNPJ"
                                className="w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                            {showCustomerList && filteredCustomers.length > 0 && !selectedCustomer && (
                                <ul className="absolute z-10 w-full mt-1 bg-green-950 border border-green-700 rounded-md shadow-lg max-h-32 overflow-y-auto">
                                    {filteredCustomers.map(c => (
                                        <li
                                            key={c.id}
                                            onMouseDown={() => {
                                                onSelectCustomer(c);
                                                setSearch('');
                                                setShowCustomerList(false);
                                            }}
                                            className="px-3 py-2 cursor-pointer hover:bg-green-700 text-white"
                                        >
                                            <p className="font-semibold">{c.fullName || c.companyName}</p>
                                            <p className="text-xs text-gray-400">{c.cpf || c.cnpj}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={onAddNewCustomer}
                            title="Cadastrar Novo Cliente"
                            className="flex-shrink-0 flex items-center justify-center p-2 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-600"
                        >
                            <PlusCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {(['Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'PIX'] as PaymentMethod[]).map(m => (
                        <button key={m} onClick={() => setMethod(m)} className={`p-3 rounded-lg font-semibold ${method === m ? 'bg-green-600 text-white' : 'bg-green-800 text-gray-300 hover:bg-green-700'}`}>{m}</button>
                    ))}
                </div>
                {method === 'Dinheiro' && (
                    <div className="space-y-4 border-t border-green-800 pt-4">
                         <div>
                            <label htmlFor="paid-amount" className="text-sm font-medium text-gray-300">Valor Recebido</label>
                            <input type="number" id="paid-amount" value={paidAmount} onChange={e => setPaidAmount(e.target.value)}
                                className="mt-1 w-full px-3 py-2 bg-green-800 border-green-700 rounded-md text-white" placeholder="R$ 0,00" />
                        </div>
                        <div className="flex justify-between text-lg">
                            <span className="text-gray-300">Troco</span>
                            <span className={`font-bold ${change < 0 ? 'text-red-400' : 'text-green-400'}`}>R$ {change.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

const HistoryModal: React.FC<{ sales: Sale[]; onClose: () => void }> = ({ sales, onClose }) => (
    <Modal title="Histórico de Vendas (Últimas 20)" size="max-w-3xl" footer={<div className="text-right"><button onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 font-semibold text-white">Fechar</button></div>}>
        <div className="space-y-2">
            {sales.length === 0 ? <p className="text-gray-400">Nenhuma venda registrada nesta sessão.</p> : sales.map(s => (
                <div key={s.id} className="bg-green-800/50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-white">Venda #{s.id}</p>
                            <p className="text-sm text-gray-400">{s.timestamp}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-green-400">R$ {s.total.toFixed(2)}</p>
                            <p className="text-xs text-gray-300">{s.paymentMethod}</p>
                        </div>
                    </div>
                    {s.customer && (
                        <div className="border-t border-green-700/50 mt-2 pt-2 text-xs">
                            <p className="text-gray-300">Cliente: <span className="font-semibold text-white">{s.customer.fullName || s.customer.companyName}</span></p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </Modal>
);

const MovementsModal: React.FC<{ movements: CashierMovement[]; onClose: () => void }> = ({ movements, onClose }) => (
    <Modal title="Movimento de Caixa" size="max-w-2xl" footer={<div className="text-right"><button onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 font-semibold text-white">Fechar</button></div>}>
        <ul className="space-y-2">
            {movements.map(m => (
                <li key={m.id} className="bg-green-800/50 p-3 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-white">{m.description}</p>
                        <p className="text-sm text-gray-400">{m.timestamp}</p>
                    </div>
                    <p className={`font-bold text-lg ${m.type === 'Entrada' ? 'text-green-400' : 'text-red-400'}`}>
                        {m.type === 'Entrada' ? '+' : '-'} R$ {m.amount.toFixed(2)}
                    </p>
                </li>
            ))}
        </ul>
    </Modal>
);

const CloseCashierModal: React.FC<{ movements: CashierMovement[]; initialBalance: number; onClose: () => void; onConfirm: () => void }> = ({ movements, initialBalance, onClose, onConfirm }) => {
    const summary = useMemo(() => {
        const sales = movements.filter(m => m.description.startsWith('Venda'));
        const totalSales = sales.reduce((sum, m) => sum + m.amount, 0);
        const cashSales = sales.filter(m => m.description.includes('(Dinheiro)')).reduce((sum, m) => sum + m.amount, 0);
        const cardSales = sales.filter(m => m.description.includes('(Cartão')).reduce((sum, m) => sum + m.amount, 0);
        const pixSales = sales.filter(m => m.description.includes('(PIX)')).reduce((sum, m) => sum + m.amount, 0);
        const otherIncomes = movements.filter(m => m.type === 'Entrada' && !m.description.startsWith('Venda') && m.description !== 'Saldo Inicial').reduce((sum, m) => sum + m.amount, 0);
        const outcomes = movements.filter(m => m.type === 'Saída').reduce((sum, m) => sum + m.amount, 0);
        const expectedBalance = initialBalance + cashSales + otherIncomes - outcomes;
        return { totalSales, cashSales, cardSales, pixSales, otherIncomes, outcomes, expectedBalance };
    }, [movements, initialBalance]);
    
    return (
        <Modal title="Fechamento de Caixa" footer={
            <div className="flex justify-between items-center">
                <button onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 font-semibold text-white">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white">Confirmar Fechamento</button>
            </div>
        }>
            <div className="space-y-3 text-gray-300">
                <p className="text-sm text-yellow-400">Atenção: Esta ação encerrará a sessão de vendas atual e zerará os registros. Os relatórios consolidados estarão disponíveis na página de Relatórios.</p>
                <SummaryRow label="Saldo Inicial" value={initialBalance} />
                <SummaryRow label="Vendas em Dinheiro" value={summary.cashSales} positive />
                <SummaryRow label="Vendas em Cartão" value={summary.cardSales} positive />
                <SummaryRow label="Vendas em PIX" value={summary.pixSales} positive />
                <SummaryRow label="Outras Entradas" value={summary.otherIncomes} positive />
                <SummaryRow label="Saídas" value={summary.outcomes} />
                <div className="border-t border-green-700 my-2"></div>
                <div className="flex justify-between text-lg font-bold text-white">
                    <span>Saldo Final Esperado</span>
                    <span>R$ {summary.expectedBalance.toFixed(2)}</span>
                </div>
            </div>
        </Modal>
    );
};

const SummaryRow: React.FC<{ label: string; value: number; positive?: boolean }> = ({ label, value, positive }) => (
    <div className="flex justify-between items-center text-sm border-b border-green-800/50 py-2">
        <span>{label}</span>
        <span className={`font-semibold ${value > 0 && positive ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-white'}`}>
            R$ {value.toFixed(2)}
        </span>
    </div>
);

// Customer Modal Components copied from CustomersPage
const InputField: React.FC<{ label: string; name: string; type?: string; value: string | undefined | null; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; required?: boolean; className?: string }> = ({ label, name, type = 'text', value, onChange, required = false, className = '' }) => (
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

const CustomerModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (customer: Customer) => void;
    customerToEdit: Customer | null;
}> = ({ isOpen, onClose, onSave, customerToEdit }) => {
    const [customer, setCustomer] = useState<Customer>(initialCustomerState);

    useEffect(() => {
        if (customerToEdit) {
            setCustomer(customerToEdit);
        } else {
            setCustomer(initialCustomerState);
        }
    }, [customerToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomer(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...customer, id: customer.id || new Date().toISOString() });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-4xl border border-green-800 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-green-800">
                    <h2 className="text-2xl font-bold text-white">{customerToEdit ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
                </div>
                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="border-b border-green-800">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                <button
                                    type="button"
                                    onClick={() => setCustomer(prev => ({ ...prev, type: CustomerType.INDIVIDUAL }))}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${customer.type === CustomerType.INDIVIDUAL ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'}`}
                                >
                                    Pessoa Física
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCustomer(prev => ({ ...prev, type: CustomerType.COMPANY }))}
                                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${customer.type === CustomerType.COMPANY ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'}`}
                                >
                                    Pessoa Jurídica
                                </button>
                            </nav>
                        </div>
                        
                        {customer.type === CustomerType.INDIVIDUAL ? (
                             <fieldset className="border border-green-800 p-4 rounded-lg">
                                <legend className="px-2 text-green-400 font-semibold">Pessoa Física</legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Nome Completo" name="fullName" value={customer.fullName} onChange={handleChange} required />
                                    <InputField label="CPF" name="cpf" value={customer.cpf} onChange={handleChange} />
                                    <InputField label="Telefone" name="phone" value={customer.phone} onChange={handleChange} required />
                                </div>
                            </fieldset>
                        ) : (
                            <fieldset className="border border-green-800 p-4 rounded-lg">
                                <legend className="px-2 text-green-400 font-semibold">Pessoa Jurídica</legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Razão Social" name="companyName" value={customer.companyName} onChange={handleChange} required />
                                    <InputField label="Nome Fantasia" name="tradingName" value={customer.tradingName} onChange={handleChange} />
                                    <InputField label="CNPJ" name="cnpj" value={customer.cnpj} onChange={handleChange} required />
                                    <InputField label="Inscrição Estadual" name="stateRegistration" value={customer.stateRegistration} onChange={handleChange} />
                                    <InputField label="Nome de Contato" name="contactName" value={customer.contactName} onChange={handleChange} />
                                    <InputField label="Telefone" name="phone" value={customer.phone} onChange={handleChange} required />
                                </div>
                            </fieldset>
                        )}
                        
                        <fieldset className="border border-green-800 p-4 rounded-lg">
                            <legend className="px-2 text-green-400 font-semibold">Endereço</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="CEP" name="zipCode" value={customer.address.zipCode} onChange={handleAddressChange} />
                                <InputField label="Logradouro" name="street" value={customer.address.street} onChange={handleAddressChange} className="md:col-span-2" />
                                <InputField label="Número" name="number" value={customer.address.number} onChange={handleAddressChange} />
                                <InputField label="Complemento" name="complement" value={customer.address.complement} onChange={handleAddressChange} />
                                <InputField label="Bairro" name="neighborhood" value={customer.address.neighborhood} onChange={handleAddressChange} />
                                <InputField label="Cidade" name="city" value={customer.address.city} onChange={handleAddressChange} />
                                <InputField label="Estado" name="state" value={customer.address.state} onChange={handleAddressChange} />
                            </div>
                        </fieldset>

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

export default PdvPage;
