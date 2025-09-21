
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SiteTemplate, TemplateTag } from '../../domain/types';
import { mockSiteTemplates } from '../../data/mocks';
import { SearchIcon, GlobeIcon, Trash2Icon, PlusCircleIcon } from '../components/icons';

// --- SUB-COMPONENTS ---

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
            isActive
                ? 'border-green-500 text-green-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'
        }`}
    >
        {label}
    </button>
);

const Card: React.FC<{ title: string; description: string; children: React.ReactNode; }> = ({ title, description, children }) => (
    <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1 mb-6">{description}</p>
        <div className="space-y-4">{children}</div>
    </div>
);

const InputField: React.FC<{ label: string; name: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; placeholder?: string; }> = ({ label, name, type = 'text', value, onChange, required = false, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-white" />
    </div>
);

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void; }> = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <button type="button" onClick={() => setEnabled(!enabled)} className={`${enabled ? 'bg-green-600' : 'bg-green-950'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-900`} role="switch" aria-checked={enabled}>
            <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
        </button>
    </div>
);

// --- DOMAIN TAB ---
const DomainTab: React.FC = () => {
    const [domainName, setDomainName] = useState('');
    const [searchResult, setSearchResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDomainActive, setIsDomainActive] = useState(true);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!domainName) return;
        setIsLoading(true);
        setSearchResult('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `O domínio '${domainName}' está disponível para registro? Responda apenas 'Disponível' ou 'Indisponível'.`,
            });
            setSearchResult(response.text.trim());
        } catch (error) {
            console.error("Erro ao verificar domínio:", error);
            setSearchResult('Erro ao verificar. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            {showRegisterModal && <RegisterDomainModal domain={domainName} onClose={() => setShowRegisterModal(false)} />}
            <Card title="Estado do Domínio" description="Ative ou desative seu domínio. Quando desativado, o site ficará fora do ar.">
                <ToggleSwitch label="Domínio Ativado" enabled={isDomainActive} setEnabled={setIsDomainActive} />
            </Card>

            <Card title="Pesquisar Domínio" description="Verifique se o domínio que você deseja está disponível para registro.">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <input type="text" value={domainName} onChange={(e) => setDomainName(e.target.value)} placeholder="exemplo.com.br" className="flex-grow bg-green-800 border-green-700 rounded-md text-white placeholder-gray-400" />
                    <button type="submit" disabled={isLoading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50">
                        {isLoading ? 'Verificando...' : 'Verificar'}
                    </button>
                </form>
                {searchResult && (
                    <div className={`mt-4 p-4 rounded-md text-center ${searchResult === 'Disponível' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        <p>O domínio <strong>{domainName}</strong> está: <strong>{searchResult}</strong>.</p>
                        {searchResult === 'Disponível' && (
                            <button onClick={() => setShowRegisterModal(true)} className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-lg font-semibold hover:bg-blue-500 text-sm">
                                Registrar Novo Domínio
                            </button>
                        )}
                    </div>
                )}
            </Card>

            <Card title="Configuração de API (Registro.br)" description="Configure suas credenciais para gerenciar domínios diretamente.">
                <InputField label="Client ID" name="registroBrId" value="" onChange={() => {}} placeholder="Seu Client ID do Registro.br" />
                <InputField label="Client Secret" name="registroBrSecret" type="password" value="" onChange={() => {}} placeholder="Sua chave secreta" />
                 <div className="text-right">
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">Salvar</button>
                </div>
            </Card>
        </div>
    );
};

// --- HOSTING TAB ---
const HostingTab: React.FC<{ purchasedTemplates: SiteTemplate[] }> = ({ purchasedTemplates }) => {
    const [isHostingActive, setIsHostingActive] = useState(true);
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<SiteTemplate | null>(purchasedTemplates.length > 0 ? purchasedTemplates[0] : null);

    return (
        <div className="space-y-6">
            {showTemplateModal && <ChooseTemplateModal templates={purchasedTemplates} current={selectedTemplate} onSelect={(tpl) => { setSelectedTemplate(tpl); setShowTemplateModal(false); }} onClose={() => setShowTemplateModal(false)} />}
            <Card title="Estado da Hospedagem" description="Ative ou desative sua hospedagem.">
                <ToggleSwitch label="Hospedagem Ativada" enabled={isHostingActive} setEnabled={setIsHostingActive} />
            </Card>
            
            <Card title="Administração do Site" description="Gerencie as configurações básicas do seu site.">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Título do Site" name="siteTitle" value="Minha Lanchonete" onChange={() => {}} />
                    <InputField label="Descrição (SEO)" name="siteDescription" value="Os melhores lanches da cidade!" onChange={() => {}} />
                    <ToggleSwitch label="Modo Manutenção" enabled={isMaintenanceMode} setEnabled={setIsMaintenanceMode} />
                    <div>
                         <label className="block text-sm font-medium text-gray-300">Template Atual</label>
                         <div className="mt-1 flex items-center justify-between bg-green-800 p-3 rounded-md">
                             <span>{selectedTemplate ? selectedTemplate.name : 'Nenhum selecionado'}</span>
                             <button type="button" onClick={() => setShowTemplateModal(true)} className="text-sm font-semibold text-green-400 hover:text-green-300">Trocar</button>
                         </div>
                    </div>
                 </div>
                 <div className="text-right pt-4 border-t border-green-800">
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">Salvar Configurações</button>
                </div>
            </Card>

            <Card title="Configuração de API (Hostinger)" description="Configure suas credenciais para gerenciar a hospedagem.">
                <InputField label="API Key" name="hostingerKey" type="password" value="" onChange={() => {}} placeholder="Sua chave de API da Hostinger" />
                 <div className="text-right">
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">Salvar</button>
                </div>
            </Card>
        </div>
    );
};

// --- TEMPLATES TAB ---
const TemplatesTab: React.FC<{ templates: SiteTemplate[]; onPurchase: (id: string) => void; onDelete: (id: string) => void; }> = ({ templates, onPurchase, onDelete }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<TemplateTag[]>([]);

    const allTags: TemplateTag[] = ['Lanchonete', 'Bar', 'Distribuidora de Bebidas', 'Venda de Açaí', 'Sorveteria', 'Pipoqueiro', 'Artesanato', 'Loja de personalizados', 'Barbearia', 'Manicure'];
    
    const filteredTemplates = useMemo(() => {
        return templates.filter(tpl => {
            const searchMatch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
            const tagMatch = selectedTags.length === 0 || selectedTags.every(tag => tpl.tags.includes(tag));
            return searchMatch && tagMatch;
        });
    }, [templates, searchQuery, selectedTags]);

    const handleTagClick = (tag: TemplateTag) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    return (
        <div className="space-y-6">
            <div className="bg-green-900 p-4 rounded-lg border border-green-800">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Buscar template..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-green-800 border-green-700 rounded-lg py-2 pl-10 pr-4 text-white" />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {allTags.map(tag => (
                        <button key={tag} onClick={() => handleTagClick(tag)} className={`px-3 py-1 text-xs rounded-full ${selectedTags.includes(tag) ? 'bg-green-600 text-white' : 'bg-green-800 text-gray-300'}`}>
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(tpl => <TemplateCard key={tpl.id} template={tpl} onPurchase={onPurchase} onDelete={onDelete} />)}
            </div>
        </div>
    );
};

const TemplateCard: React.FC<{ template: SiteTemplate; onPurchase: (id: string) => void; onDelete: (id: string) => void; }> = ({ template, onPurchase, onDelete }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    return (
        <>
            {showDeleteModal && <DeleteTemplateModal templateName={template.name} onConfirm={(reason) => { console.log(`Excluindo ${template.name}: ${reason}`); onDelete(template.id); setShowDeleteModal(false); }} onCancel={() => setShowDeleteModal(false)} />}
            <div className="bg-green-900 rounded-lg shadow-lg border border-green-800 overflow-hidden flex flex-col">
                <img src={template.imageUrl} alt={template.name} className="w-full h-[150px] object-cover" />
                <div className="p-4 flex flex-col flex-grow">
                    <h4 className="text-lg font-bold text-white">{template.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">por {template.author}</p>
                    <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => <svg key={i} className={`w-4 h-4 ${i < template.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                    </div>
                    <p className="text-sm text-gray-300 flex-grow">{template.description}</p>
                    <div className="flex flex-wrap gap-1 my-3">
                        {template.tags.map(tag => <span key={tag} className="text-xs bg-green-800 text-green-300 px-2 py-1 rounded">{tag}</span>)}
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-green-800">
                        <p className="text-xl font-bold text-green-400">R$ {template.price.toFixed(2)}</p>
                        {template.purchased ? (
                            <span className="font-semibold text-green-400">Comprado</span>
                        ) : (
                            <button onClick={() => onPurchase(template.id)} className="bg-green-600 text-white px-4 py-1 rounded-lg font-semibold hover:bg-green-500 text-sm">Comprar</button>
                        )}
                        <button onClick={() => setShowDeleteModal(true)} className="text-red-500 hover:text-red-400"><Trash2Icon className="w-5 h-5"/></button>
                    </div>
                </div>
            </div>
        </>
    );
};


// --- MODALS ---

const RegisterDomainModal: React.FC<{ domain: string; onClose: () => void }> = ({ domain, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-2xl border border-green-800 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-green-800"><h2 className="text-2xl font-bold text-white">Registrar Domínio: {domain}</h2></div>
            <div className="p-6 overflow-y-auto space-y-4">
                <p className="text-sm text-gray-400">Preencha os dados do titular para o registro.</p>
                <InputField label="Nome Completo / Razão Social" name="regName" value="" onChange={() => {}} required/>
                <InputField label="CPF / CNPJ" name="regDoc" value="" onChange={() => {}} required/>
                <InputField label="Email" name="regEmail" type="email" value="" onChange={() => {}} required/>
                <InputField label="Telefone" name="regPhone" value="" onChange={() => {}} required/>
                <InputField label="Endereço" name="regAddress" value="" onChange={() => {}} required/>
            </div>
            <div className="p-4 bg-green-950/50 border-t border-green-800 flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                <button type="submit" onClick={() => { alert(`Domínio ${domain} registrado! (Simulação)`); onClose(); }} className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Confirmar Registro</button>
            </div>
        </div>
    </div>
);

const ChooseTemplateModal: React.FC<{ templates: SiteTemplate[]; current: SiteTemplate | null; onSelect: (template: SiteTemplate) => void; onClose: () => void }> = ({ templates, current, onSelect, onClose }) => (
     <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-4xl border border-green-800 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-green-800"><h2 className="text-2xl font-bold text-white">Escolher Template</h2></div>
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(tpl => (
                    <div key={tpl.id} onClick={() => onSelect(tpl)} className={`rounded-lg overflow-hidden border-2 cursor-pointer ${current?.id === tpl.id ? 'border-green-500' : 'border-transparent hover:border-green-600'}`}>
                        <img src={tpl.imageUrl} alt={tpl.name} className="w-full h-32 object-cover"/>
                        <p className="p-2 bg-green-800 text-center font-semibold text-white">{tpl.name}</p>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-green-950/50 border-t border-green-800 flex justify-end">
                 <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Fechar</button>
            </div>
        </div>
    </div>
);

const DeleteTemplateModal: React.FC<{ templateName: string; onConfirm: (reason: string) => void; onCancel: () => void; }> = ({ templateName, onConfirm, onCancel }) => {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-md border border-red-800">
                <div className="p-6 border-b border-red-800"><h2 className="text-xl font-bold text-red-400">Excluir Template</h2></div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-300">Você está prestes a excluir o template <strong className="text-white">{templateName}</strong>. Por favor, informe o motivo.</p>
                    <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white" placeholder="Justificativa..."></textarea>
                </div>
                <div className="p-4 bg-green-950/50 border-t border-red-800 flex justify-end space-x-4">
                    <button onClick={onCancel} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 font-semibold text-white">Cancelar</button>
                    <button onClick={() => onConfirm(reason)} disabled={!reason.trim()} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white disabled:opacity-50">Confirmar Exclusão</button>
                </div>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const SitePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dominio');
    const [templates, setTemplates] = useState<SiteTemplate[]>(mockSiteTemplates);
    
    const purchasedTemplates = useMemo(() => templates.filter(t => t.purchased), [templates]);

    const handlePurchaseTemplate = (id: string) => {
        setTemplates(tpls => tpls.map(t => t.id === id ? { ...t, purchased: true } : t));
    };

    const handleDeleteTemplate = (id: string) => {
        setTemplates(tpls => tpls.filter(t => t.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Site</h1>
            </div>

            <div className="border-b border-green-800">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <TabButton label="Domínio" isActive={activeTab === 'dominio'} onClick={() => setActiveTab('dominio')} />
                    <TabButton label="Hospedagem" isActive={activeTab === 'hospedagem'} onClick={() => setActiveTab('hospedagem')} />
                    <TabButton label="Template de Sites" isActive={activeTab === 'templates'} onClick={() => setActiveTab('templates')} />
                </nav>
            </div>

            <div>
                {activeTab === 'dominio' && <DomainTab />}
                {activeTab === 'hospedagem' && <HostingTab purchasedTemplates={purchasedTemplates} />}
                {activeTab === 'templates' && <TemplatesTab templates={templates} onPurchase={handlePurchaseTemplate} onDelete={handleDeleteTemplate}/>}
            </div>
        </div>
    );
};

export default SitePage;
