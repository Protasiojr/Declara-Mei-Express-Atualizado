
import React from 'react';

const ProfilePage: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
            
            <div className="bg-gray-800 p-8 rounded-lg shadow-md border border-gray-700">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                        <img className="w-32 h-32 rounded-full object-cover" src="https://picsum.photos/200" alt="Profile" />
                        <button className="mt-4 w-full text-sm text-indigo-400 hover:text-indigo-300">Alterar Imagem</button>
                    </div>

                    {/* Profile Form */}
                    <div className="flex-grow w-full">
                        <form className="space-y-6">
                             <div>
                                <label className="block text-sm font-medium text-gray-400">Nome do Perfil</label>
                                <input type="text" defaultValue="Administrador" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400">Login (Email)</label>
                                <input type="email" defaultValue="admin@teste.com" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400">Nova Senha</label>
                                <input type="password" placeholder="Deixe em branco para não alterar" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Tipo de Perfil</label>
                                <input type="text" value="Administrador" disabled className="mt-1 block w-full bg-gray-900 border-gray-700 rounded-md text-gray-400 cursor-not-allowed" />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                                    Salvar Perfil
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
