

import React, { useState, useMemo, useRef } from 'react';
import { PostTemplate, TemplateTag, SocialPlatform, ScheduledPost, DayOfWeek } from '../../domain/types';
import { mockPostTemplates, mockScheduledPosts } from '../../data/mocks';
import { SearchIcon, Trash2Icon, PlusCircleIcon } from '../components/icons';

// --- SUB-COMPONENTS ---

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
            isActive
                ? 'border-green-500 text-green-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'
        }`}
    >
        {label}
    </button>
);

const Card: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
        <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const InputField: React.FC<{ label: string; name: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean; }> = ({ label, name, type = 'text', value, onChange, placeholder, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-white" />
    </div>
);

const TextAreaField: React.FC<{ label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number; }> = ({ label, name, value, onChange, placeholder, rows=3 }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows}
            className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-white" />
    </div>
);


// --- TABS ---

const initialPostState: Omit<ScheduledPost, 'id' | 'status'> = {
    platform: 'Instagram',
    imageUrl: '',
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    recurringDays: []
};

const ScheduledPostsTab: React.FC<{ platform: SocialPlatform; posts: ScheduledPost[]; onAddPost: (post: Omit<ScheduledPost, 'id' | 'status'>) => void; }> = ({ platform, posts, onAddPost }) => {
    const [newPost, setNewPost] = useState(initialPostState);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPost(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDayToggle = (day: DayOfWeek) => {
        setNewPost(prev => {
            const currentDays = prev.recurringDays || [];
            const newDays = currentDays.includes(day)
                ? currentDays.filter(d => d !== day)
                : [...currentDays, day];
            return { ...prev, recurringDays: newDays };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddPost({ ...newPost, platform });
        setNewPost(initialPostState);
    };
    
    const weekDays: DayOfWeek[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title={`Nova Postagem para ${platform}`}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="w-full h-64 bg-green-800 rounded-md flex items-center justify-center relative overflow-hidden group">
                        {newPost.imageUrl ? (
                             <img src={newPost.imageUrl} alt="Preview da postagem" className="w-full h-full object-cover" />
                        ) : (
                             <p className="text-gray-400">Sua imagem aparecerá aqui</p>
                        )}
                        <button type="button" onClick={() => imageInputRef.current?.click()} className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlusCircleIcon className="w-8 h-8 mr-2"/> Adicionar Imagem
                        </button>
                        <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    </div>

                    <InputField label="Título" name="title" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} placeholder="Título da sua postagem" required/>
                    <TextAreaField label="Descrição" name="description" value={newPost.description} onChange={(e) => setNewPost({...newPost, description: e.target.value})} placeholder="Escreva uma legenda..."/>
                    
                    <fieldset className="border border-green-800 p-3 rounded-lg">
                        <legend className="px-2 text-green-400 text-sm font-semibold">Agendamento</legend>
                        <div className="grid grid-cols-2 gap-4">
                             <InputField label="Data" name="scheduledDate" type="date" value={newPost.scheduledDate} onChange={(e) => setNewPost({...newPost, scheduledDate: e.target.value})} required/>
                             <InputField label="Horário" name="scheduledTime" type="time" value={newPost.scheduledTime} onChange={(e) => setNewPost({...newPost, scheduledTime: e.target.value})} required/>
                        </div>
                        <div className="mt-3">
                             <label className="block text-sm font-medium text-gray-300 mb-2">Repetir nos dias (Opcional)</label>
                            <div className="flex flex-wrap gap-2">
                                {weekDays.map(day => (
                                    <button type="button" key={day} onClick={() => handleDayToggle(day)} className={`px-3 py-1 text-sm rounded-full ${newPost.recurringDays?.includes(day) ? 'bg-green-600 text-white' : 'bg-green-800 text-gray-300'}`}>
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </fieldset>

                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-500 disabled:opacity-50" disabled={!newPost.imageUrl || !newPost.title}>
                        Agendar Postagem
                    </button>
                </form>
            </Card>
            
            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                <h3 className="text-xl font-semibold text-white mb-6">Postagens Agendadas</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                     {posts.length > 0 ? posts.map(post => (
                        <div key={post.id} className="bg-green-800/50 p-3 rounded-lg flex items-start gap-4">
                            <img src={post.imageUrl} alt={post.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="font-bold text-white">{post.title}</p>
                                <p className="text-sm text-gray-300 truncate">{post.description}</p>
                                <p className="text-xs text-green-400 mt-1">
                                    {new Date(post.scheduledDate + 'T00:00:00').toLocaleDateString('pt-BR')} às {post.scheduledTime}
                                </p>
                                {post.recurringDays.length > 0 && (
                                     <p className="text-xs text-yellow-400 mt-1">Repete: {post.recurringDays.join(', ')}</p>
                                )}
                            </div>
                        </div>
                     )) : (
                        <p className="text-center text-gray-500 py-8">Nenhuma postagem programada para {platform}.</p>
                     )}
                </div>
            </div>
        </div>
    );
};


const SettingsTab: React.FC = () => (
    <Card title="Configurações de API">
        <div className="space-y-6">
            <InputField label="API Key do Instagram" name="instagramApi" type="password" value="" onChange={() => {}} placeholder="Sua chave de API" />
            <InputField label="API Key do Facebook" name="facebookApi" type="password" value="" onChange={() => {}} placeholder="Sua chave de API" />
            <InputField label="API Key do TikTok" name="tiktokApi" type="password" value="" onChange={() => {}} placeholder="Sua chave de API" />
            <InputField label="API Key do YouTube" name="youtubeApi" type="password" value="" onChange={() => {}} placeholder="Sua chave de API" />
            <div className="text-right">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">Salvar Credenciais</button>
            </div>
        </div>
    </Card>
);

const TemplatesTab: React.FC<{ templates: PostTemplate[]; onPurchase: (id: string) => void; onDelete: (id: string) => void; }> = ({ templates, onPurchase, onDelete }) => {
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
                <h3 className="text-lg font-semibold text-white mb-4">Biblioteca de Templates de Postagem</h3>
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Buscar Template de Postagem..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-green-800 border-green-700 rounded-lg py-2 pl-10 pr-4 text-white" />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {allTags.map(tag => (
                        <button key={tag} onClick={() => handleTagClick(tag)} className={`px-3 py-1 text-xs rounded-full transition-colors ${selectedTags.includes(tag) ? 'bg-green-600 text-white' : 'bg-green-800 text-gray-300 hover:bg-green-700'}`}>
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

const TemplateCard: React.FC<{ template: PostTemplate; onPurchase: (id: string) => void; onDelete: (id: string) => void; }> = ({ template, onPurchase, onDelete }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    return (
        <>
            {showDeleteModal && <DeleteTemplateModal templateName={template.name} onConfirm={(reason) => { console.log(`Excluindo ${template.name}: ${reason}`); onDelete(template.id); setShowDeleteModal(false); }} onCancel={() => setShowDeleteModal(false)} />}
            <div className="bg-green-900 rounded-lg shadow-lg border border-green-800 overflow-hidden flex flex-col">
                <img src={template.imageUrl} alt={template.name} className="w-full h-[150px] object-cover" />
                <div className="p-4 flex flex-col flex-grow">
                    <h4 className="text-lg font-bold text-white">{template.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">Criado por: {template.author}</p>
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
                        <button onClick={() => setShowDeleteModal(true)} className="text-red-500 hover:text-red-400 p-1"><Trash2Icon className="w-5 h-5"/></button>
                    </div>
                </div>
            </div>
        </>
    );
};

// --- MODALS ---

const DeleteTemplateModal: React.FC<{ templateName: string; onConfirm: (reason: string) => void; onCancel: () => void; }> = ({ templateName, onConfirm, onCancel }) => {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-md border border-red-800">
                <div className="p-6 border-b border-red-800"><h2 className="text-xl font-bold text-red-400">Excluir Template de Postagem</h2></div>
                <div className="p-6 space-y-4">
                    <p className="text-gray-300">Você tem certeza que deseja excluir o template <strong className="text-white">{templateName}</strong>? Por favor, informe o motivo.</p>
                    <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white" placeholder="Justificativa da exclusão..."></textarea>
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
const PostagensPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Instagram');
    const [templates, setTemplates] = useState<PostTemplate[]>(mockPostTemplates);
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(mockScheduledPosts);

    const handlePurchaseTemplate = (id: string) => {
        setTemplates(tpls => tpls.map(t => t.id === id ? { ...t, purchased: true } : t));
    };

    const handleDeleteTemplate = (id: string) => {
        setTemplates(tpls => tpls.filter(t => t.id !== id));
    };

    const handleAddPost = (postData: Omit<ScheduledPost, 'id' | 'status'>) => {
        const newPost: ScheduledPost = {
            ...postData,
            id: `sp-${Date.now()}`,
            status: 'Agendada'
        };
        setScheduledPosts(prev => [newPost, ...prev]);
        alert(`Post para ${postData.platform} agendado com sucesso!`);
    };
    
    const tabs: {name: SocialPlatform | 'Templates de Postagem' | 'Configurações'}[] = [
        { name: 'Templates de Postagem' }, 
        { name: 'Instagram' }, 
        { name: 'Facebook' }, 
        { name: 'TikTok' }, 
        { name: 'YouTube' }, 
        { name: 'Configurações' }
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Postagens Automáticas</h1>

            <div className="border-b border-green-800">
                <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                         <TabButton key={tab.name} label={tab.name} isActive={activeTab === tab.name} onClick={() => setActiveTab(tab.name)} />
                    ))}
                </nav>
            </div>

            <div>
                {activeTab === 'Templates de Postagem' && <TemplatesTab templates={templates} onPurchase={handlePurchaseTemplate} onDelete={handleDeleteTemplate}/>}
                {activeTab === 'Instagram' && <ScheduledPostsTab platform="Instagram" posts={scheduledPosts.filter(p => p.platform === 'Instagram')} onAddPost={handleAddPost} />}
                {activeTab === 'Facebook' && <ScheduledPostsTab platform="Facebook" posts={scheduledPosts.filter(p => p.platform === 'Facebook')} onAddPost={handleAddPost} />}
                {activeTab === 'TikTok' && <ScheduledPostsTab platform="TikTok" posts={scheduledPosts.filter(p => p.platform === 'TikTok')} onAddPost={handleAddPost} />}
                {activeTab === 'YouTube' && <ScheduledPostsTab platform="YouTube" posts={scheduledPosts.filter(p => p.platform === 'YouTube')} onAddPost={handleAddPost} />}
                {activeTab === 'Configurações' && <SettingsTab />}
            </div>
        </div>
    );
};

export default PostagensPage;