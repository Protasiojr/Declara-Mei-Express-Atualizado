
import React, { useState } from 'react';

const quickProducts = [
    { id: 1, name: "Produto A", price: 10.00 },
    { id: 2, name: "Produto B", price: 25.50 },
    { id: 3, name: "Serviço X", price: 50.00 },
    { id: 4, name: "Produto C", price: 5.75 },
    { id: 5, name: "Produto D", price: 18.20 },
    { id: 6, name: "Produto E", price: 33.00 },
];

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

const PdvPage: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCashierOpen, setIsCashierOpen] = useState(false);

    const addToCart = (product: { id: number, name: string, price: number }) => {
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

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (!isCashierOpen) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center bg-gray-800 p-10 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-4">Caixa Fechado</h2>
                    <p className="text-gray-400 mb-6">Você precisa abrir o caixa para iniciar as vendas.</p>
                    <button 
                        onClick={() => setIsCashierOpen(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
                    >
                        Abrir Caixa
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            {/* Products Grid */}
            <div className="lg:w-2/3">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-4">Produtos para Venda Rápida</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {quickProducts.map(p => (
                            <button
                                key={p.id}
                                onClick={() => addToCart(p)}
                                className="bg-gray-700 p-4 rounded-lg text-center hover:bg-indigo-600 transition-colors"
                            >
                                <p className="font-semibold text-white">{p.name}</p>
                                <p className="text-sm text-gray-300">R$ {p.price.toFixed(2)}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Current Sale */}
            <div className="lg:w-1/3 flex flex-col">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex-grow flex flex-col">
                    <h2 className="text-2xl font-bold text-white mb-4">Venda Atual</h2>
                    <div className="flex-grow overflow-y-auto pr-2">
                        {cart.length === 0 ? (
                            <p className="text-gray-400">Nenhum item na venda.</p>
                        ) : (
                            <ul className="space-y-3">
                                {cart.map(item => (
                                    <li key={item.id} className="flex justify-between items-center text-gray-300">
                                        <div>
                                            <p className="font-medium text-white">{item.name}</p>
                                            <p className="text-sm">
                                                {item.quantity} x R$ {item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-white">
                                            R$ {(item.quantity * item.price).toFixed(2)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="border-t border-gray-700 mt-4 pt-4">
                        <div className="flex justify-between text-xl font-bold text-white">
                            <span>Total</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button className="bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700">
                                Cancelar Venda
                            </button>
                            <button className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
                                Pagamento
                            </button>
                        </div>
                         <button 
                            onClick={() => setIsCashierOpen(false)}
                            className="w-full mt-4 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-500"
                        >
                            Fechar Caixa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdvPage;
