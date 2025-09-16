
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../app/context/CompanyContext';
import { PlusCircleIcon, BarcodeIcon, Trash2Icon, PlusIcon, MinusIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, PrinterIcon } from '../components/icons';
import { Customer, CustomerType, Address } from '../../domain/types';
// FIX: Corrected import to use exported member from mocks.
import { searchablePdvItems, pdvMockCustomers } from '../../data/mocks';

// Define explicit types for searchable items to enable discriminated union type checking.
// This resolves type errors when accessing properties specific to products (sku, barcode).
interface SearchableProduct {
    id: string;
    name: string;
    barcode?: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    type: 'product';
}

interface SearchableService {
    id: string;
    name: string;
    price: number;
    type: 'service';
}

type SearchableItem = SearchableProduct | SearchableService;


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
    id: string;
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
type CashMovementType = 'Sangria' | 'Suprimento';

type ActiveModal = 'openCashier' | 'payment' | 'history' | 'movements' | 'closeCashier' | 'newCustomer' | 'cashMovement' | 'receipt' | null;

const quickProducts = searchablePdvItems.filter(item => item.type === 'product').slice(0, 10) as SearchableProduct[];

const PdvPage: React.FC = () => {
    const initialCashierData = useMemo(() => {
        try {
            const storedStatus = localStorage.getItem('cashierStatus');
            if (storedStatus) {
                const { isOpen, openTime } = JSON.parse(storedStatus);
                return { isOpen, openTime: isOpen ? openTime : null };
            }
        } catch (error) {
            console.error("Failed to parse cashierStatus from localStorage", error);
        }
        return { isOpen: false, openTime: null };
    }, []);

    const [isCashierOpen, setIsCashierOpen] = useState(initialCashierData.isOpen);
    const navigate = useNavigate();
    const [cashierOpenTime, setCashierOpenTime] = useState<string | null>(initialCashierData.openTime);
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [initialBalance, setInitialBalance] = useState(0);
    const [cashierMovements, setCashierMovements] = useState<CashierMovement[]>([]);
    const [salesHistory, setSalesHistory] = useState<Sale[]>([]);
    const [customers, setCustomers] = useState<Customer[]>(pdvMockCustomers);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
    const [lastSale, setLastSale] = useState<Sale | null>(null);
    const [cashMovementType, setCashMovementType] = useState<CashMovementType>('Sangria');
    const searchInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (!isCashierOpen) {
            setActiveModal('openCashier');
        } else {
            setActiveModal(null);
            searchInputRef.current?.focus();
        }
    }, [isCashierOpen]);

    useEffect(() => {
        if (searchQuery.length > 1) {
            const lowercasedQuery = searchQuery.toLowerCase();
            setSearchResults(
                (searchablePdvItems as SearchableItem[]).filter(item =>
                    item.name.toLowerCase().includes(lowercasedQuery) ||
                    (item.type === 'product' && (item.sku?.toLowerCase().includes(lowercasedQuery) || item.barcode?.includes(lowercasedQuery)))
                )
            );
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleOpenCashier = (balance: number) => {
        const timestamp = new Date().toLocaleString('pt-BR');
        const openTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        try {
            localStorage.setItem('cashierStatus', JSON.stringify({ isOpen: true, openTime }));
        } catch (error) {
            console.error("Failed to set cashierStatus in localStorage", error);
        }
        setInitialBalance(balance);
        setCashierMovements([{ id: `mov-0`, type: 'Entrada', description: 'Saldo Inicial', amount: balance, timestamp }]);
        setCashierOpenTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        setIsCashierOpen(true);
    };

    const addToCart = (product: { id: string, name: string, price: number }) => {
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
        setSearchQuery('');
        setSearchResults([]);
        searchInputRef.current?.focus();
    };
    
    const updateCartQuantity = (productId: string, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.id !== productId);
            }
            return prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery) {
            const exactMatch = (searchablePdvItems as SearchableItem[]).find(item => item.type === 'product' && (item.barcode === searchQuery || item.sku === searchQuery));
            if (exactMatch) {
                addToCart(exactMatch);
            } else if (searchResults.length > 0) {
                addToCart(searchResults[0]);
            }
        }
    };

    const handleCancelSale = () => {
        setCart([]);
        setSelectedCustomer(null);
    }
    
    const handleFinalizeSale = (paymentMethod: PaymentMethod, paidAmount?: number) => {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (total <= 0) return;
        
        // TODO: Implement automatic stock reduction here
        // For each item in `cart`, find the corresponding product in a global state
        // and decrease its `stock` property by `item.quantity`.

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
        setLastSale(newSale);
        setCart([]);
        setSelectedCustomer(null);
        setActiveModal('receipt');
    };

    const handleSaveNewCustomer = (customer: Customer) => {
        setCustomers(prev => [...prev, customer]);
        setSelectedCustomer(customer);
        setActiveModal('payment');
    };
    
    const handleAddCashMovement = (type: CashMovementType, amount: number, description: string) => {
        const newMovement: CashierMovement = {
            id: `M${Date.now()}`,
            type: type === 'Suprimento' ? 'Entrada' : 'Saída',
            description: `${type}: ${description}`,
            amount,
            timestamp: new Date().toLocaleString('pt-BR')
        };
        setCashierMovements(prev => [...prev, newMovement]);
        setActiveModal(null);
    };

    const handleCloseCashier = () => {
        try {
            localStorage.removeItem('cashierStatus');
        } catch (error) {
            console.error("Failed to remove cashierStatus from localStorage", error);
        }
        setIsCashierOpen(false);
        setCart([]);
        setSelectedCustomer(null);
        setInitialBalance(0);
        setCashierMovements([]);
        setSalesHistory([]);
        setCashierOpenTime(null);
        setActiveModal(null);
    }

    const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

    const renderModal = () => {
        switch (activeModal) {
            case 'openCashier': return <OpenCashierModal onOpen={handleOpenCashier} onCancel={() => navigate('/dashboard')} />;
            case 'payment': return <PaymentModal total={total} onCancel={() => { setActiveModal(null); setSelectedCustomer(null); }} onFinalize={handleFinalizeSale} customers={customers} selectedCustomer={selectedCustomer} onSelectCustomer={setSelectedCustomer} onAddNewCustomer={() => setActiveModal('newCustomer')} />;
            case 'history': return <HistoryModal sales={salesHistory} onClose={() => setActiveModal(null)} />;
            case 'movements': return <MovementsModal movements={cashierMovements} onClose={() => setActiveModal(null)} />;
            // FIX: Replaced incorrect component name with correct one.
            case 'closeCashier': return <CloseCashierModal movements={cashierMovements} initialBalance={initialBalance} onClose={() => setActiveModal(null)} onConfirm={handleCloseCashier} />;
            // FIX: Replaced incorrect component name with correct one.
            case 'newCustomer': return <CustomerModal isOpen={true} onClose={() => setActiveModal('payment')} onSave={handleSaveNewCustomer} customerToEdit={null} />;
            // FIX: Replaced incorrect component name with correct one.
            case 'cashMovement': return <CashMovementModal type={cashMovementType} onClose={() => setActiveModal(null)} onConfirm={handleAddCashMovement} />;
            // FIX: Replaced incorrect component name with correct one.
            case 'receipt': return lastSale && <ReceiptModal sale={lastSale} onClose={() => { setLastSale(null); setActiveModal(null); searchInputRef.current?.focus(); }} />;
            default: return null;
        }
    };
    
    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            {renderModal()}
            <div className="lg:w-2/3 flex flex-col gap-4">
                <div className="bg-green-900 p-4 rounded-lg border border-green-800">
                    <form onSubmit={handleSearchSubmit} className="relative mb-4">
                        <label htmlFor="product-search" className="sr-only">Buscar Produto</label>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BarcodeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            id="product-search"
                            placeholder="Ler código de barras ou buscar produto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            disabled={!isCashierOpen}
                            className="block w-full bg-green-950 border border-green-700 rounded-lg py-2 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                        {searchResults.length > 0 && (
                             <ul className="absolute z-10 w-full mt-1 bg-green-950 border border-green-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {searchResults.map(item => (
                                    <li key={item.id} onMouseDown={() => addToCart(item)} className="px-4 py-3 cursor-pointer hover:bg-green-800 text-white">
                                        <p className="font-semibold">{item.name}</p>
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <span>R$ {item.price.toFixed(2)}</span>
                                            {item.type === 'product' && <span>SKU: {item.sku}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </form>
                </div>

                <div className="bg-green-900 p-4 rounded-lg border border-green-800 flex-grow">
                    <h3 className="text-lg font-semibold text-white mb-4">Acesso Rápido</h3>
                    {isCashierOpen ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {quickProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    className="bg-green-800 p-3 rounded-lg text-center hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!isCashierOpen}
                                >
                                    <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                                    <p className="text-green-400 text-xs mt-1">R$ {product.price.toFixed(2)}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            <p>Abra o caixa para ver os produtos.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:w-1/3 flex flex-col">
                <div className="bg-green-900 p-4 rounded-lg border border-green-800 flex-grow flex flex-col">
                    <h2 className="text-2xl font-bold text-white mb-4">Venda Atual</h2>
                    <div className="flex-grow overflow-y-auto pr-2 min-h-[200px] space-y-2">
                        {cart.length === 0 ? (<p className="text-gray-400 text-center py-10">Carrinho vazio.</p>) : (
                            cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between text-gray-300 bg-green-800/50 p-2 rounded-md">
                                    <div className="flex-grow">
                                        <p className="font-medium text-white">{item.name}</p>
                                        <p className="text-sm text-green-400 font-mono">R$ {(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full hover:bg-green-700"><MinusIcon className="w-4 h-4" /></button>
                                        <span className="font-mono text-white w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full hover:bg-green-700"><PlusIcon className="w-4 h-4" /></button>
                                        <button onClick={() => updateCartQuantity(item.id, 0)} className="p-1 rounded-full hover:bg-red-500/50 text-red-400"><Trash2Icon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="border-t border-green-800 mt-4 pt-4">
                        <div className="flex justify-between text-xl font-bold text-white mb-4">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>

                        <div className="border border-green-800 rounded-lg p-3 mb-4 space-y-2 text-sm">
                            <h4 className="font-bold text-white text-base text-center mb-2">Controle de Caixa</h4>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status:</span>
                                <span className={`font-semibold ${isCashierOpen ? 'text-green-400' : 'text-red-400'}`}>
                                    {isCashierOpen ? 'Aberto' : 'Fechado'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Operador:</span>
                                <span className="text-white font-semibold">Admin</span>
                            </div>
                            {isCashierOpen && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Abertura do Caixa:</span>
                                        <span className="text-white font-semibold">{cashierOpenTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Saldo inicial:</span>
                                        <span className="text-white font-semibold">R$ {initialBalance.toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-2">
                             <button onClick={() => { setCashMovementType('Sangria'); setActiveModal('cashMovement'); }} className="flex items-center justify-center gap-2 bg-yellow-600/50 text-yellow-300 py-2 rounded-lg font-semibold hover:bg-yellow-600/80 disabled:opacity-50" disabled={!isCashierOpen}><ArrowDownCircleIcon className="w-5"/> Sangria</button>
                             <button onClick={() => { setCashMovementType('Suprimento'); setActiveModal('cashMovement'); }} className="flex items-center justify-center gap-2 bg-blue-600/50 text-blue-300 py-2 rounded-lg font-semibold hover:bg-blue-600/80 disabled:opacity-50" disabled={!isCashierOpen}><ArrowUpCircleIcon className="w-5"/> Suprimento</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setActiveModal('history')} className="bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50" disabled={!isCashierOpen}>Histórico</button>
                            <button onClick={() => setActiveModal('movements')} className="bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-50" disabled={!isCashierOpen}>Mov. Caixa</button>
                            <button onClick={handleCancelSale} className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50" disabled={!isCashierOpen || cart.length === 0}>Cancelar</button>
                            <button onClick={() => setActiveModal('payment')} className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 disabled:opacity-50" disabled={!isCashierOpen || cart.length === 0}>Pagamento</button>
                        </div>
                         <button onClick={() => setActiveModal('closeCashier')} className="w-full mt-2 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50" disabled={!isCashierOpen}>Fechar Caixa</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// FIX: Added missing modal component definitions
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

const OpenCashierModal: React.FC<{ onOpen: (balance: number) => void; onCancel: () => void; }> = ({ onOpen, onCancel }) => {
    const [balance, setBalance] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onOpen(parseFloat(balance) || 0);
    };
    return (
        <Modal title="Abrir Caixa" footer={
            <div className="flex justify-between">
                <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
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
                        <p className="text-xs text-gray-400">{m.timestamp}</p>
                    </div>
                    <span className={`font-bold text-lg ${m.type === 'Entrada' ? 'text-green-400' : 'text-red-400'}`}>
                        {m.type === 'Entrada' ? '+' : '-'} R$ {m.amount.toFixed(2)}
                    </span>
                </li>
            ))}
        </ul>
    </Modal>
);

const CloseCashierModal: React.FC<{
    movements: CashierMovement[];
    initialBalance: number;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ movements, initialBalance, onClose, onConfirm }) => {
    const summary = useMemo(() => {
        const sales = movements.filter(m => m.description.startsWith('Venda')).reduce((sum, m) => sum + m.amount, 0);
        const cashEntries = movements.filter(m => m.type === 'Entrada' && m.description.includes('(Dinheiro)')).reduce((sum, m) => sum + m.amount, 0);
        const supplies = movements.filter(m => m.type === 'Entrada' && m.description.startsWith('Suprimento')).reduce((sum, m) => sum + m.amount, 0);
        const withdrawals = movements.filter(m => m.type === 'Saída' && m.description.startsWith('Sangria')).reduce((sum, m) => sum + m.amount, 0);
        const totalEntries = initialBalance + cashEntries + supplies;
        const expectedCash = totalEntries - withdrawals;
        return { sales, supplies, withdrawals, expectedCash };
    }, [movements, initialBalance]);

    return (
        <Modal title="Fechar Caixa" size="max-w-lg" footer={
            <div className="flex justify-between">
                <button onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 font-semibold text-white">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-semibold text-white">Confirmar Fechamento</button>
            </div>
        }>
            <div className="space-y-3 text-white">
                <p className="text-center text-gray-400">Confira os valores antes de fechar o caixa.</p>
                <div className="bg-green-800/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between"><span className="text-gray-300">Saldo Inicial:</span> <span>R$ {initialBalance.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Vendas (Total):</span> <span>R$ {summary.sales.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Suprimentos:</span> <span className="text-green-400">+ R$ {summary.supplies.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-300">Sangrias:</span> <span className="text-red-400">- R$ {summary.withdrawals.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-lg border-t border-green-700 pt-2 mt-2"><span >Valor Esperado em Caixa:</span> <span className="text-green-400">R$ {summary.expectedCash.toFixed(2)}</span></div>
                </div>
            </div>
        </Modal>
    );
};

const CashMovementModal: React.FC<{ type: CashMovementType, onClose: () => void, onConfirm: (type: CashMovementType, amount: number, description: string) => void }> = ({ type, onClose, onConfirm }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(type, parseFloat(amount), description);
    };

    return (
        <Modal title={type} footer={
            <div className="flex justify-between">
                <button onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                <button type="submit" form="cash-movement-form" className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Confirmar</button>
            </div>
        }>
            <form id="cash-movement-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="movement-amount" className="block text-sm font-medium text-gray-300">Valor</label>
                    <input type="number" id="movement-amount" value={amount} onChange={e => setAmount(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md text-white"
                        placeholder="R$ 0,00" autoFocus required />
                </div>
                <div>
                    <label htmlFor="movement-description" className="block text-sm font-medium text-gray-300">Descrição/Motivo</label>
                    <input type="text" id="movement-description" value={description} onChange={e => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md text-white"
                        required />
                </div>
            </form>
        </Modal>
    );
};

const ReceiptModal: React.FC<{ sale: Sale, onClose: () => void }> = ({ sale, onClose }) => {
    const { logo } = useCompany();
    const receiptRef = useRef<HTMLDivElement>(null);
    const handlePrint = () => window.print();

    return (
        <Modal title="Recibo" size="max-w-md" footer={
            <div className="flex justify-between">
                <button onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Fechar</button>
                <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold"><PrinterIcon className="w-5" /> Imprimir</button>
            </div>
        }>
            <div ref={receiptRef} className="bg-gray-100 text-gray-800 p-4 font-mono text-sm">
                <div className="text-center">
                    {logo && <img src={logo} alt="Logo" className="mx-auto h-16 w-auto mb-2"/>}
                    <h3 className="font-bold text-lg">Minha Empresa MEI</h3>
                    <p>Rua das Flores, 123 - Centro</p>
                    <p>CNPJ: 12.345.678/0001-90</p>
                </div>
                <hr className="my-2 border-gray-400 border-dashed"/>
                <p>CUPOM NÃO FISCAL</p>
                <p>Venda: #{sale.id}</p>
                <p>Data: {sale.timestamp}</p>
                {sale.customer && <p>Cliente: {sale.customer.fullName || sale.customer.companyName}</p>}
                <hr className="my-2 border-gray-400 border-dashed"/>
                <table className="w-full">
                    <thead><tr><th className="text-left">Item</th><th className="text-right">Qtd</th><th className="text-right">Vl. Un.</th><th className="text-right">Total</th></tr></thead>
                    <tbody>
                        {sale.items.map(item => <tr key={item.id}><td>{item.name}</td><td className="text-right">{item.quantity}</td><td className="text-right">{item.price.toFixed(2)}</td><td className="text-right">{(item.quantity * item.price).toFixed(2)}</td></tr>)}
                    </tbody>
                </table>
                <hr className="my-2 border-gray-400 border-dashed"/>
                <div className="text-right font-bold">
                    <p>TOTAL: R$ {sale.total.toFixed(2)}</p>
                </div>
                <hr className="my-2 border-gray-400 border-dashed"/>
                <p>Pagamento: {sale.paymentMethod}</p>
                {sale.paidAmount && <p>Valor Pago: R$ {sale.paidAmount.toFixed(2)}</p>}
                {sale.change && <p>Troco: R$ {sale.change.toFixed(2)}</p>}
                 <p className="text-center mt-4">Obrigado pela preferência!</p>
            </div>
        </Modal>
    );
};

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
    
    // This is not inside a Modal component because it has custom styling
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-green-800">
                <div className="p-6 border-b border-green-800">
                     <h2 className="text-2xl font-bold text-white">{customerToEdit ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow p-6 space-y-6">
                    <div className="border-b border-green-800">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                             <button type="button" onClick={() => setCustomer(prev => ({ ...prev, type: CustomerType.INDIVIDUAL }))}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${customer.type === CustomerType.INDIVIDUAL ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'}`}>
                                Pessoa Física
                            </button>
                            <button type="button" onClick={() => setCustomer(prev => ({ ...prev, type: CustomerType.COMPANY }))}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${customer.type === CustomerType.COMPANY ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'}`}>
                                Pessoa Jurídica
                            </button>
                        </nav>
                    </div>
                    {customer.type === CustomerType.INDIVIDUAL ? (
                         <fieldset className="border border-green-800 p-4 rounded-lg"><legend className="px-2 text-green-400 font-semibold">Pessoa Física</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Nome Completo" name="fullName" value={customer.fullName} onChange={handleChange} required />
                                <InputField label="CPF" name="cpf" value={customer.cpf} onChange={handleChange} />
                                <InputField label="Telefone" name="phone" value={customer.phone} onChange={handleChange} required />
                            </div>
                        </fieldset>
                    ) : (
                        <fieldset className="border border-green-800 p-4 rounded-lg"><legend className="px-2 text-green-400 font-semibold">Pessoa Jurídica</legend>
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
                    <fieldset className="border border-green-800 p-4 rounded-lg"><legend className="px-2 text-green-400 font-semibold">Endereço</legend>
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
                </form>
                 <div className="p-4 bg-green-950/50 border-t border-green-800 rounded-b-lg flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                    <button type="submit" formAction="submit" onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Salvar</button>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, name, type = 'text', value, onChange, required = false, className = '' }: { label: string, name: string, type?: string, value?: string, onChange: (e: any) => void, required?: boolean, className?: string }) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            type={type} id={name} name={name} value={value || ''} onChange={onChange} required={required}
            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-white" />
    </div>
);


export default PdvPage;
