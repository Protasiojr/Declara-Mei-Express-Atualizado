
import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircleIcon, BarcodeIcon } from '../components/icons';
import { Product, Promotion, DayOfWeek } from '../../domain/types';
import { mockProducts, mockPromotions } from '../../data/mocks';

const initialPromotionState: Omit<Promotion, 'id' | 'status'> = {
    name: '',
    description: '',
    productId: '',
    productName: '',
    originalPrice: 0,
    discountPercentage: 0,
    promotionalPrice: 0,
    startDate: '',
    endDate: '',
    daysOfWeek: [],
};

const PromotionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (promotion: Omit<Promotion, 'id' | 'status'>, id?: string) => void;
    promotionToEdit: Promotion | null;
}> = ({ isOpen, onClose, onSave, promotionToEdit }) => {
    const [promotion, setPromotion] = useState(initialPromotionState);
    const [productSearch, setProductSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const filteredProducts = useMemo(() => {
        if (productSearch.length < 2) return [];
        const lowercasedSearch = productSearch.toLowerCase();
        return mockProducts.filter(p => 
            p.name.toLowerCase().includes(lowercasedSearch) || 
            p.sku.toLowerCase().includes(lowercasedSearch) ||
            p.barcode?.includes(productSearch)
        );
    }, [productSearch]);

    useEffect(() => {
        if (promotionToEdit) {
            const product = mockProducts.find(p => p.id === promotionToEdit.productId);
            setSelectedProduct(product || null);
            setPromotion(promotionToEdit);
        } else {
            setPromotion(initialPromotionState);
            setSelectedProduct(null);
        }
    }, [promotionToEdit, isOpen]);
    
    useEffect(() => {
        if (selectedProduct) {
             const originalPrice = selectedProduct.sellPrice;
             const discount = promotion.discountPercentage || 0;
             const promotionalPrice = originalPrice - (originalPrice * (discount / 100));
             setPromotion(p => ({ 
                 ...p, 
                 productId: selectedProduct.id,
                 productName: selectedProduct.name,
                 originalPrice: originalPrice,
                 promotionalPrice: promotionalPrice,
            }));
        }
    }, [selectedProduct, promotion.discountPercentage]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        setPromotion(p => ({ ...p, [name]: val }));
    };
    
    const handleDayToggle = (day: DayOfWeek) => {
        setPromotion(p => {
            const currentDays = p.daysOfWeek || [];
            const newDays = currentDays.includes(day)
                ? currentDays.filter(d => d !== day)
                : [...currentDays, day];
            return { ...p, daysOfWeek: newDays };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(promotion, promotionToEdit?.id);
    };

    if (!isOpen) return null;
    
    const weekDays: DayOfWeek[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-green-800">
                <div className="p-6 border-b border-green-800">
                    <h2 className="text-2xl font-bold text-white">{promotionToEdit ? 'Editar' : 'Adicionar Nova'} Promoção</h2>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow p-6 space-y-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-300">Produto da Promoção</label>
                        <input
                            type="text"
                            placeholder="Buscar produto por nome, SKU ou Código de Barras..."
                            value={selectedProduct ? selectedProduct.name : productSearch}
                            onChange={(e) => {
                                setProductSearch(e.target.value);
                                setSelectedProduct(null);
                            }}
                            disabled={!!promotionToEdit}
                            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md text-white disabled:bg-green-950"
                        />
                        {filteredProducts.length > 0 && !selectedProduct && (
                             <ul className="absolute z-10 w-full mt-1 bg-green-950 border border-green-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {filteredProducts.map(p => (
                                    <li key={p.id} onMouseDown={() => { setSelectedProduct(p); setProductSearch(''); }} className="px-4 py-2 cursor-pointer hover:bg-green-800 text-white">
                                        {p.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    {selectedProduct && (
                        <>
                            <InputField label="Nome da Promoção" name="name" value={promotion.name} onChange={handleChange} placeholder="Ex: Dia dos Pais" required />
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Descrição</label>
                                <textarea name="description" value={promotion.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md text-white" placeholder="Ex: Promoção referente ao dia dos pais" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <InputField label="Período - Início" name="startDate" type="date" value={promotion.startDate} onChange={handleChange} required/>
                               <InputField label="Período - Fim" name="endDate" type="date" value={promotion.endDate} onChange={handleChange} required/>
                            </div>
                            <div>
                                 <label className="block text-sm font-medium text-gray-300 mb-2">Selecione os dias da semana (Opcional)</label>
                                <div className="flex flex-wrap gap-2">
                                    {weekDays.map(day => (
                                        <button type="button" key={day} onClick={() => handleDayToggle(day)} className={`px-3 py-1 text-sm rounded-full ${promotion.daysOfWeek?.includes(day) ? 'bg-green-600 text-white' : 'bg-green-800 text-gray-300'}`}>
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <InputField label="Porcentagem de Desconto (%)" name="discountPercentage" type="number" value={promotion.discountPercentage} onChange={handleChange} required />
                                <InputField label="Valor do Produto (R$)" name="originalPrice" type="number" value={promotion.originalPrice.toFixed(2)} onChange={()=>{}} disabled />
                                <InputField label="Valor em Promoção (R$)" name="promotionalPrice" type="number" value={promotion.promotionalPrice.toFixed(2)} onChange={()=>{}} disabled />
                            </div>
                        </>
                    )}
                </form>
                <div className="p-4 bg-green-950/50 border-t border-green-800 rounded-b-lg flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                    <button type="submit" onClick={handleSubmit} disabled={!selectedProduct} className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold disabled:opacity-50">Salvar</button>
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<{
    label: string;
    name: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;
}> = ({ label, name, type = 'text', value, onChange, required = false, placeholder = '', disabled=false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} disabled={disabled}
            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md text-white disabled:bg-green-950 disabled:cursor-not-allowed"/>
    </div>
);

const PromotionsPage: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [promotionToEdit, setPromotionToEdit] = useState<Promotion | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return mockProducts;
        return mockProducts.filter(p => p.barcode?.includes(searchQuery));
    }, [searchQuery]);

    const getStatus = (promo: Pick<Promotion, 'startDate' | 'endDate'>): 'Ativa' | 'Agendada' | 'Expirada' => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const start = new Date(promo.startDate + 'T00:00:00');
        const end = new Date(promo.endDate + 'T23:59:59');

        if (now > end) return 'Expirada';
        if (now < start) return 'Agendada';
        return 'Ativa';
    };

    const handleSavePromotion = (promoData: Omit<Promotion, 'id' | 'status'>, id?: string) => {
        if (id) {
            setPromotions(promos => promos.map(p => p.id === id ? { ...p, ...promoData, status: getStatus(promoData) } : p));
        } else {
            const newPromo: Promotion = {
                ...promoData,
                id: `promo${Date.now()}`,
                status: getStatus(promoData)
            };
            setPromotions(promos => [newPromo, ...promos]);
        }
        setIsModalOpen(false);
        setPromotionToEdit(null);
    };

    const handleOpenModal = (promo: Promotion | null = null) => {
        setPromotionToEdit(promo);
        setIsModalOpen(true);
    };
    
    const statusStyles = {
        'Ativa': 'bg-green-500/20 text-green-300',
        'Agendada': 'bg-blue-500/20 text-blue-300',
        'Expirada': 'bg-gray-500/20 text-gray-400',
    };

    return (
        <div className="space-y-6">
            <PromotionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePromotion}
                promotionToEdit={promotionToEdit}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Gestão de Promoções</h1>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 w-full sm:w-auto"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    Adicionar Nova Promoção
                </button>
            </div>
            
            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                <h2 className="text-xl font-semibold text-white mb-4">Lista de Produtos</h2>
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><BarcodeIcon className="h-5 w-5 text-gray-400" /></div>
                    <input type="text" placeholder="Pesquisar produto por código de barras..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-green-950 border border-green-700 rounded-lg py-2 pl-10 pr-4 text-white" />
                </div>
                <div className="overflow-x-auto max-h-72">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-green-800 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Produto</th>
                                <th scope="col" className="px-6 py-3">Preço Original</th>
                                <th scope="col" className="px-6 py-3">Estoque</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => (
                                <tr key={p.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700/50">
                                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                                    <td className="px-6 py-4">R$ {p.sellPrice.toFixed(2)}</td>
                                    <td className="px-6 py-4">{p.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                <h2 className="text-xl font-semibold text-white mb-4">Histórico de Promoções</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-green-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome da Promoção</th>
                                <th scope="col" className="px-6 py-3">Produto</th>
                                <th scope="col" className="px-6 py-3">Período</th>
                                <th scope="col" className="px-6 py-3">Desconto</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map(p => (
                                <tr key={p.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700/50">
                                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                                    <td className="px-6 py-4">{p.productName}</td>
                                    <td className="px-6 py-4">{new Date(p.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} - {new Date(p.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4">{p.discountPercentage}%</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[p.status]}`}>{p.status}</span></td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleOpenModal(p)} className="font-medium text-green-400 hover:underline">Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PromotionsPage;