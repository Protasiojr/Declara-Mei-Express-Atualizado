

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChatContact, ContactType, ChatConversation, ChatMessage } from '../../domain/types';
import { mockChatContacts, mockConversations } from '../../data/mocks';
import { SearchIcon, PlusIcon, MessageSquareIcon, SendIcon, MoreVerticalIcon, Trash2Icon, PaperclipIcon, TelegramIcon, UsersIcon, TruckIcon, BuildingIcon, HeadphonesIcon, UserPlusIcon } from '../components/icons';

type ActiveTab = 'Telegram' | 'Clientes' | 'Entregadores' | 'Fornecedores' | 'Suporte' | 'Adicionar Contato';

const ChatPage: React.FC = () => {
    const [contacts, setContacts] = useState<ChatContact[]>(mockChatContacts);
    const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('Clientes');
    const [searchQuery, setSearchQuery] = useState('');
    const [modal, setModal] = useState<'details' | 'edit' | 'delete' | null>(null);
    const [contactForModal, setContactForModal] = useState<ChatContact | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const attachmentInputRef = useRef<HTMLInputElement>(null);

    const tabs: { name: ActiveTab; icon: React.FC<{className?: string}>; label: string }[] = [
        { name: 'Telegram', icon: TelegramIcon, label: 'Config. Telegram' },
        { name: 'Clientes', icon: UsersIcon, label: 'Clientes' },
        { name: 'Entregadores', icon: TruckIcon, label: 'Entregadores' },
        { name: 'Fornecedores', icon: BuildingIcon, label: 'Fornecedores' },
        { name: 'Suporte', icon: HeadphonesIcon, label: 'Suporte' },
        { name: 'Adicionar Contato', icon: UserPlusIcon, label: 'Adicionar Contato' },
    ];

    const filteredContacts = useMemo(() => {
        const byTab = contacts.filter(c => {
            switch(activeTab) {
                case 'Clientes': return c.type === 'Cliente';
                case 'Entregadores': return c.type === 'Entregador';
                case 'Fornecedores': return c.type === 'Fornecedor';
                case 'Suporte': return c.type === 'Suporte';
                default: return false;
            }
        });

        if (!searchQuery) return byTab;
        const lowercasedQuery = searchQuery.toLowerCase();
        return byTab.filter(c => c.name.toLowerCase().includes(lowercasedQuery) || c.phone.includes(lowercasedQuery));
    }, [contacts, activeTab, searchQuery]);

    const activeConversation = useMemo(() => {
        if (!selectedContactId) return null;
        return conversations.find(c => c.contactId === selectedContactId);
    }, [conversations, selectedContactId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [activeConversation]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContactId) return;

        const message: ChatMessage = {
            id: `msg-${Date.now()}`,
            text: newMessage,
            sender: 'me',
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        setConversations(prev => {
            const convoExists = prev.some(c => c.contactId === selectedContactId);
            if (convoExists) {
                return prev.map(c => c.contactId === selectedContactId ? { ...c, messages: [...c.messages, message] } : c);
            } else {
                return [...prev, { contactId: selectedContactId, messages: [message] }];
            }
        });

        setNewMessage('');
    };
    
    const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log('Arquivo selecionado:', file.name, file.type);
            alert(`Anexo "${file.name}" selecionado. Funcionalidade de envio não implementada.`);
        }
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleSaveContact = (contact: ChatContact) => {
        if (modal === 'edit' && contactForModal) {
            setContacts(contacts.map(c => c.id === contact.id ? contact : c));
        } else {
             setContacts(prev => [{...contact, id: `contact-${Date.now()}`}, ...prev]);
        }
        setActiveTab(contact.type === 'Outro' ? 'Clientes' : `${contact.type}s` as ActiveTab); // Simple mapping
        setModal(null);
    };
    
    const handleDeleteContact = (id: string) => {
        setContacts(contacts.filter(c => c.id !== id));
        if(selectedContactId === id) setSelectedContactId(null);
        setModal(null);
    };

    const selectedContact = contacts.find(c => c.id === selectedContactId);

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-green-950 text-gray-200 border border-green-800 rounded-lg overflow-hidden">
            {/* Left Column: Contact List */}
            <div className="w-1/3 border-r border-green-800 flex flex-col">
                <div className="p-4 border-b border-green-800">
                    <h2 className="text-xl font-bold text-white">Chat DME</h2>
                    <div className="relative mt-2">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input type="text" placeholder="Pesquisar contato..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                               className="w-full bg-green-900 border border-green-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"/>
                    </div>
                </div>

                <div className="flex justify-around p-2 bg-green-900 border-b border-green-800 text-sm">
                    {tabs.map(tab => (
                        <button key={tab.name} onClick={() => setActiveTab(tab.name)} title={tab.label}
                                className={`p-2 rounded-md ${activeTab === tab.name ? 'bg-green-600 text-white' : 'text-gray-400 hover:bg-green-800 hover:text-white'}`}>
                            <tab.icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'Telegram' && <TelegramConfigTab />}
                    {activeTab === 'Adicionar Contato' && <AddContactTab onSave={handleSaveContact} onCancel={() => setActiveTab('Clientes')}/>}
                    {['Clientes', 'Entregadores', 'Fornecedores', 'Suporte'].includes(activeTab) && (
                        <ul>
                            {filteredContacts.map(contact => (
                                <ContactPreview key={contact.id} contact={contact} isSelected={selectedContactId === contact.id}
                                                onSelect={() => setSelectedContactId(contact.id)}
                                                onAction={(action) => { setContactForModal(contact); setModal(action); }}/>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Right Column: Chat Window */}
            <div className="w-2/3 flex flex-col">
                {selectedContact ? (
                    <>
                        <div className="p-4 flex items-center justify-between border-b border-green-800 bg-green-900">
                            <h3 className="text-lg font-semibold text-white">{selectedContact.name}</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-green-950/50 space-y-4">
                            {activeConversation?.messages.map(msg => (
                                <MessageBubble key={msg.id} message={msg}/>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        
                        <div className="p-4 bg-green-900">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                <button type="button" onClick={() => attachmentInputRef.current?.click()} className="p-3 text-gray-400 hover:text-white rounded-full hover:bg-green-800">
                                    <PaperclipIcon className="w-5 h-5"/>
                                </button>
                                <input type="file" ref={attachmentInputRef} onChange={handleAttachment} className="hidden" accept="video/*,audio/*,image/*" />
                                <input type="text" placeholder="Digite uma mensagem..." value={newMessage} onChange={e => setNewMessage(e.target.value)}
                                       className="flex-1 bg-green-800 border-green-700 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500"/>
                                <button type="submit" className="bg-green-600 rounded-full p-3 text-white hover:bg-green-500">
                                    <SendIcon className="w-5 h-5"/>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <MessageSquareIcon className="w-24 h-24 mb-4"/>
                        <h2 className="text-xl">Selecione uma conversa</h2>
                        <p>Inicie uma nova conversa ou continue uma existente.</p>
                    </div>
                )}
            </div>
            
            {/* Modals */}
            {modal && contactForModal && (
                <ContactModal type={modal} contact={contactForModal} onClose={() => setModal(null)} onSave={handleSaveContact} onDelete={handleDeleteContact} />
            )}
        </div>
    );
};

const ContactPreview: React.FC<{ contact: ChatContact; isSelected: boolean; onSelect: () => void; onAction: (action: 'details' | 'edit' | 'delete') => void; }> = ({ contact, isSelected, onSelect, onAction }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <li onClick={onSelect} className={`flex items-center justify-between p-3 cursor-pointer border-b border-green-800 ${isSelected ? 'bg-green-800' : 'hover:bg-green-800/50'}`}>
            <div className="flex-1">
                <h4 className="font-semibold text-white">{contact.name}</h4>
                <p className="text-sm text-gray-400 truncate">{contact.lastMessage}</p>
            </div>
            <div className="text-right ml-2">
                <p className="text-xs text-gray-500 mb-1">{contact.lastMessageTimestamp}</p>
                {contact.unreadCount && contact.unreadCount > 0 && <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">{contact.unreadCount}</span>}
            </div>
            <div className="relative" ref={menuRef}>
                <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }} className="p-2 ml-2 rounded-full hover:bg-green-700"><MoreVerticalIcon className="w-5 h-5"/></button>
                {isMenuOpen && (
                    <div className="absolute right-0 top-8 w-40 bg-green-950 border border-green-700 rounded-md shadow-lg z-10">
                         <a href="#" onClick={(e) => { e.preventDefault(); onAction('details'); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-green-800">Ver detalhes</a>
                         <a href="#" onClick={(e) => { e.preventDefault(); onAction('edit'); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-green-800">Editar</a>
                         <a href="#" onClick={(e) => { e.preventDefault(); onAction('delete'); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-red-400 hover:bg-green-800">Excluir</a>
                    </div>
                )}
            </div>
        </li>
    );
};

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isMe = message.sender === 'me';
    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${isMe ? 'bg-green-700 text-white' : 'bg-green-800 text-gray-200'}`}>
                <p>{message.text}</p>
                <p className="text-xs text-right mt-1 opacity-70">{message.timestamp}</p>
            </div>
        </div>
    );
};

const TelegramConfigTab: React.FC = () => (
    <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Configuração da API do Telegram</h3>
        <p className="text-sm text-gray-400">Insira seu token de API do Telegram para habilitar as notificações e o chat com os clientes.</p>
        <div>
            <label htmlFor="telegram-token" className="block text-sm font-medium text-gray-300 mb-1">Token do Bot</label>
            <input type="password" id="telegram-token" placeholder="Cole seu token aqui" className="w-full bg-green-800 border-green-700 rounded-md py-2 px-4 text-white"/>
        </div>
        <div className="text-right">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-500">Salvar</button>
        </div>
    </div>
);

const AddContactTab: React.FC<{onSave: (contact: ChatContact) => void; onCancel: () => void}> = ({onSave, onCancel}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState<ContactType>('Cliente');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: '', name, phone, type });
        setName(''); setPhone(''); setType('Cliente');
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
             <h3 className="text-lg font-semibold text-white">Adicionar Novo Contato</h3>
             <InputField label="Nome" value={name} onChange={setName} required/>
             <InputField label="Número (+55 11 98888-7777)" value={phone} onChange={setPhone} required/>
             <SelectField label="Tipo de Contato" value={type} onChange={(val) => setType(val as ContactType)}>
                 {(['Cliente', 'Entregador', 'Fornecedor', 'Suporte', 'Outro'] as ContactType[]).map(t => <option key={t} value={t}>{t}</option>)}
             </SelectField>
             <div className="flex justify-end gap-4">
                 <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                 <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Salvar Contato</button>
             </div>
        </form>
    )
};

const ContactModal: React.FC<{ type: 'details' | 'edit' | 'delete', contact: ChatContact, onClose: () => void, onSave: (contact: ChatContact) => void, onDelete: (id: string) => void }> = ({ type, contact, onClose, onSave, onDelete }) => {
    const [editedContact, setEditedContact] = useState(contact);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(editedContact);
    };

    const renderContent = () => {
        switch (type) {
            case 'details':
                return (
                    <div className="p-6 space-y-2">
                        <p><strong className="text-gray-400">Nome:</strong> {contact.name}</p>
                        <p><strong className="text-gray-400">Telefone:</strong> {contact.phone}</p>
                        <p><strong className="text-gray-400">Tipo:</strong> {contact.type}</p>
                    </div>
                );
            case 'edit':
                return (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <InputField label="Nome" value={editedContact.name} onChange={(val) => setEditedContact({...editedContact, name: val})}/>
                        <InputField label="Telefone" value={editedContact.phone} onChange={(val) => setEditedContact({...editedContact, phone: val})}/>
                        <SelectField label="Tipo" value={editedContact.type} onChange={(val) => setEditedContact({...editedContact, type: val as ContactType})}>
                            {(['Cliente', 'Entregador', 'Fornecedor', 'Suporte', 'Outro'] as ContactType[]).map(t => <option key={t} value={t}>{t}</option>)}
                        </SelectField>
                    </form>
                );
            case 'delete':
                return (
                    <div className="p-6">
                        <p>Tem certeza que deseja excluir o contato <strong className="text-white">{contact.name}</strong>? Esta ação não pode ser desfeita.</p>
                    </div>
                );
        }
    };
    
    const renderFooter = () => {
         switch (type) {
            case 'details':
                return <button onClick={onClose} className="px-4 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Fechar</button>;
            case 'edit':
                return <>
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">Salvar</button>
                </>;
            case 'delete':
                 return <>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Cancelar</button>
                    <button onClick={() => onDelete(contact.id)} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold">Excluir</button>
                </>;
        }
    };

    const titles = { details: 'Detalhes do Contato', edit: 'Editar Contato', delete: 'Excluir Contato' };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-lg border border-green-800">
                <div className="p-6 border-b border-green-800 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">{titles[type]}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>
                {renderContent()}
                <div className="p-4 bg-green-950/50 border-t border-green-800 flex justify-end gap-4">{renderFooter()}</div>
            </div>
        </div>
    );
};

// HELPER COMPONENTS
const InputField = ({ label, value, onChange, required=false }: { label: string, value: string, onChange: (val: string) => void, required?: boolean }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} required={required} className="w-full bg-green-800 border-green-700 rounded-md py-2 px-4 text-white"/>
    </div>
);
const SelectField = ({ label, value, onChange, children }: { label: string, value: string, onChange: (val: string) => void, children: React.ReactNode }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-green-800 border-green-700 rounded-md py-2 px-4 text-white">
            {children}
        </select>
    </div>
);


export default ChatPage;