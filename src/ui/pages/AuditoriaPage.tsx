import React, { useState, useMemo } from 'react';
import { AuditUser, UserAction, SystemLog } from '../../domain/types';
import { mockAuditUsers, mockUserActions, mockSystemLogs } from '../../data/mocks';

const HistoryModal: React.FC<{
    user: AuditUser;
    actions: UserAction[];
    onClose: () => void;
}> = ({ user, actions, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-green-800">
                <div className="p-6 border-b border-green-800 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Histórico de Ações: {user.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none" aria-label="Fechar">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <ul className="space-y-3">
                        {actions.length > 0 ? actions.map(action => (
                            <li key={action.id} className="p-3 bg-green-800/50 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-white">{action.action}</p>
                                        <p className="text-sm text-gray-300">{action.details}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 whitespace-nowrap pl-4">{action.timestamp}</p>
                                </div>
                            </li>
                        )) : (
                            <li className="text-center text-gray-500 py-4">Nenhuma ação registrada para este usuário.</li>
                        )}
                    </ul>
                </div>
                <div className="p-4 bg-green-950/50 border-t border-green-800 rounded-b-lg flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">Fechar</button>
                </div>
            </div>
        </div>
    );
};


const AuditoriaPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'auditoria' | 'logs'>('auditoria');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AuditUser | null>(null);

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return mockAuditUsers;
        const lowercasedQuery = searchQuery.toLowerCase();
        return mockAuditUsers.filter(user => user.name.toLowerCase().includes(lowercasedQuery));
    }, [searchQuery]);

    const filteredLogs = useMemo(() => {
        if (!searchQuery) return mockSystemLogs;
        const lowercasedQuery = searchQuery.toLowerCase();
        return mockSystemLogs.filter(log => log.message.toLowerCase().includes(lowercasedQuery) || log.level.toLowerCase().includes(lowercasedQuery));
    }, [searchQuery]);

    const handleOpenHistory = (user: AuditUser) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseHistory = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const logStatusStyles = {
        'INFO': 'bg-blue-500/20 text-blue-300',
        'AVISO': 'bg-yellow-500/20 text-yellow-300',
        'ERRO': 'bg-red-500/20 text-red-300',
    };

    return (
        <div className="space-y-6">
            {isModalOpen && selectedUser && (
                <HistoryModal
                    user={selectedUser}
                    actions={mockUserActions.filter(action => action.userId === selectedUser.id)}
                    onClose={handleCloseHistory}
                />
            )}
            <h1 className="text-3xl font-bold text-white">Auditoria e Logs do Sistema</h1>

            <div className="border-b border-green-800">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('auditoria')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'auditoria' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'}`}>
                        Auditoria de Usuários
                    </button>
                    <button onClick={() => setActiveTab('logs')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'logs' ? 'border-green-500 text-green-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-green-600'}`}>
                        Logs do Sistema
                    </button>
                </nav>
            </div>

            <div className="bg-green-900 p-6 rounded-lg shadow-md border border-green-800">
                <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder={activeTab === 'auditoria' ? "Buscar por nome do usuário..." : "Buscar por mensagem ou nível do log..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-green-950 border border-green-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                </div>
                <div className="overflow-x-auto">
                    {activeTab === 'auditoria' ? (
                        <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-green-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Usuário</th>
                                    <th scope="col" className="px-6 py-3">Último Acesso</th>
                                    <th scope="col" className="px-6 py-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                                        <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                        <td className="px-6 py-4">{user.lastLogin}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleOpenHistory(user)} className="font-medium text-green-400 hover:underline">
                                                Ver Histórico
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <table className="w-full text-sm text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-green-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Timestamp</th>
                                    <th scope="col" className="px-6 py-3">Nível</th>
                                    <th scope="col" className="px-6 py-3">Mensagem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map(log => (
                                    <tr key={log.id} className="bg-green-900 border-b border-green-800 hover:bg-green-700">
                                        <td className="px-6 py-4 whitespace-nowrap">{log.timestamp}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${logStatusStyles[log.level]}`}>{log.level}</span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-white">{log.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuditoriaPage;
