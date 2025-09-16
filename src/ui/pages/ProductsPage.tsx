

import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircleIcon, PackageIcon } from '../components/icons';
import { mockProducts, mockServices } from '../../data/mocks';
import { Product, Service, ProductType } from '../../domain/types';

const InputField = ({ label, name, type = 'text', value, onChange, required = false, step, className = '' }: { label: string, name: string, type?: string, value?: string | number, onChange: (e: any) => void, required?: boolean, step?: string, className?: string }) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
            step={step}
            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
        />
    </div>
);

const TextAreaField = ({ label, name, value, onChange, rows = 3 }: { label: string, name: string, value?: string, onChange: (e: any) => void, rows?: number }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            rows={rows}
            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
        />
    </div>
);

const SelectField = ({ label, name, value, onChange, children }: { label: string, name: string, value: string, onChange: (e: any) => void, children: React.ReactNode }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
        >
            {children}
        </select>
    </div>
);


const initialProductState: Product = {
    id: '',
    name: '',
    barcode: '',
    sku: '',
    category: '',
    description: '',
    costPrice: 0,
    sellPrice: 0,
    stock: 0,
    minStock: 0,
    unit: 'un',
    type: ProductType.RESALE,
    image: '',
};

const ProductModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    productToEdit: Product | null;
}> = ({ isOpen, onClose, onSave, productToEdit }) => {
    const [product, setProduct] = useState<Product>(initialProductState);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (productToEdit) {
            setProduct(productToEdit);
            setImagePreview(productToEdit.image || null);
        } else {
            setProduct(initialProductState);
            setImagePreview(null);
        }
    }, [productToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setProduct(prev => ({ ...prev, image: result }));
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateBarcode = () => {
        // EAN-13 like structure (not a valid checksum, just random 13 digits)
        const barcode = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
        setProduct(prev => ({ ...prev, barcode: barcode }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...product, id: product.id || new Date().toISOString() });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-green-800">
                <div className="p-6 border-b border-green-800">
                    <h2 className="text-2xl font-bold text-white">{productToEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3 flex flex-col items-center space-y-4">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg bg-green-800" />
                            ) : (
                                <div className="w-40 h-40 bg-green-800 rounded-lg flex items-center justify-center text-gray-400">
                                    <PackageIcon className="w-16 h-16" />
                                </div>
                            )}
                            <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
                            <label htmlFor="image-upload" className="cursor-pointer text-center w-full bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600">
                                Adicionar Imagem
                            </label>
                        </div>
                        <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Nome do Produto" name="name" value={product.name} onChange={handleChange} required />
                            <InputField label="Categoria" name="category" value={product.category} onChange={handleChange} />
                            <div>
                                <label htmlFor="barcode" className="block text-sm font-medium text-gray-300">Código de Barras</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="barcode"
                                        id="barcode"
                                        value={product.barcode || ''}
                                        onChange={handleChange}
                                        className="flex-1 block w-full min-w-0 rounded-none rounded-l-md bg-green-800 border-green-700 text-white focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleGenerateBarcode}
                                        className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-green-700 bg-green-700 text-white hover:bg-green-600 text-sm whitespace-nowrap"
                                    >
                                        Gerar Código de Barras
                                    </button>
                                </div>
                            </div>
                            <InputField label="SKU/Código" name="sku" value={product.sku} onChange={handleChange} required />
                        </div>
                    </div>

                    <TextAreaField label="Descrição" name="description" value={product.description} onChange={handleChange} />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InputField label="Preço Custo" name="costPrice" type="number" step="0.01" value={product.costPrice} onChange={handleChange} required />
                        <InputField label="Preço Venda" name="sellPrice" type="number" step="0.01" value={product.sellPrice} onChange={handleChange} required />
                        <InputField label="Estoque Atual" name="stock" type="number" value={product.stock} onChange={handleChange} required />
                        <InputField label="Estoque Mínimo" name="minStock" type="number" value={product.minStock} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Unidade de Medida" name="unit" value={product.unit} onChange={handleChange} required />
                        <SelectField label="Tipo" name="type" value={product.type} onChange={handleChange}>
                            <option value={ProductType.RESALE}>Revenda</option>
                            <option value={ProductType.INDUSTRIALIZED}>Industrializado</option>
                        </SelectField>
                    </div>
                </form>
                <div className="p-4 bg-green-950/50 border-t border-green-800 rounded-b-lg flex justify-end space-x-4">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                    <button type="submit" onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Salvar</button>
                </div>
            </div>
        </div>
    );
};

const ProductsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    const filteredProducts = useMemo(() => products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchQuery))
    ), [products, searchQuery]);

    const filteredServices = mockServices.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (product: Product | null) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProductToEdit(null);
    };

    const handleSaveProduct = (product: Product) => {
        if (productToEdit) {
            setProducts(products.map(p => p.id === product.id ? product : p));
        } else {
            setProducts([...products, product]);
        }
        handleCloseModal();
    };
    
    const handleDeleteProduct = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };


    return (
        <div className="space-y-6">
            <ProductModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveProduct}
                productToEdit={productToEdit}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Produtos e Serviços</h1>
                <button 
                    onClick={() => activeTab === 'products' ? handleOpenModal(null) : alert('Adicionar serviço não implementado.')}
                    className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 w-full sm:w-auto"
                >
                    <PlusCircleIcon className="w-5 h-5 mr-2" />
                    {activeTab === 'products' ? 'Adicionar Produto' : 'Adicionar Serviço'}
                </button>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Buscar por nome ou código de barras..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-green-950 border border-green-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
            </div>

            <div className="border-b border-green-800">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'products' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'
                        }`}
                    >
                        Produtos
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'services' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'
                        }`}
                    >
                        Serviços
                    </button>
                </nav>
            </div>
            
            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                {activeTab === 'products' ? <ProductsTable products={filteredProducts} onEdit={handleOpenModal} onDelete={handleDeleteProduct} /> : <ServicesTable services={filteredServices} />}
            </div>
        </div>
    );
};

const ProductsTable: React.FC<{ products: Product[], onEdit: (product: Product) => void, onDelete: (id: string) => void }> = ({ products, onEdit, onDelete }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-green-800">
                <tr>
                    <th scope="col" className="px-6 py-3">Nome do Produto</th>
                    <th scope="col" className="px-6 py-3">Categoria</th>
                    <th scope="col" className="px-6 py-3">Preço Venda</th>
                    <th scope="col" className="px-6 py-3">Estoque Atual</th>
                    <th scope="col" className="px-6 py-3">Ações</th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? products.map(p => (
                    <tr key={p.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                        <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                        <td className="px-6 py-4">{p.category}</td>
                        <td className="px-6 py-4">R$ {p.sellPrice.toFixed(2)}</td>
                        <td className="px-6 py-4">{p.stock}</td>
                        <td className="px-6 py-4 space-x-4">
                            <button onClick={() => onEdit(p)} className="font-medium text-green-400 hover:underline">Editar</button>
                            <button onClick={() => onDelete(p.id)} className="font-medium text-red-400 hover:underline">Excluir</button>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                            Nenhum produto encontrado.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

const ServicesTable: React.FC<{ services: Service[] }> = ({ services }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-green-800">
                <tr>
                    <th scope="col" className="px-6 py-3">Nome do Serviço</th>
                    <th scope="col" className="px-6 py-3">Preço</th>
                    <th scope="col" className="px-6 py-3">Ações</th>
                </tr>
            </thead>
            <tbody>
                {services.length > 0 ? services.map(s => (
                    <tr key={s.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                        <td className="px-6 py-4 font-medium text-white">{s.name}</td>
                        <td className="px-6 py-4">R$ {s.price.toFixed(2)}</td>
                        <td className="px-6 py-4 space-x-4">
                            <button className="font-medium text-green-400 hover:underline">Editar</button>
                            <button className="font-medium text-red-400 hover:underline">Excluir</button>
                        </td>
                    </tr>
                )) : (
                     <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                            Nenhum serviço encontrado.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default ProductsPage;