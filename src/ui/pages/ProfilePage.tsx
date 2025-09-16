import React, { useRef, useState } from 'react';
import { useProfile } from '../../app/context/ProfileContext';

const ProfilePage: React.FC = () => {
    const { profileImage, setProfileImage } = useProfile();
    const [profileType, setProfileType] = useState('Administrador');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                setProfileImage(imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Perfil salvo com sucesso!');
    };

    const UserProfileIcon = () => (
        <div className="w-32 h-32 rounded-full bg-green-800 flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
        </div>
    );

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
            
            <div className="bg-green-900 p-8 rounded-lg shadow-md border border-green-800">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Profile Picture */}
                    <div className="flex-shrink-0 text-center">
                         {profileImage ? (
                            <img className="w-32 h-32 rounded-full object-cover" src={profileImage} alt="Foto de perfil do usuário" />
                        ) : (
                            <UserProfileIcon />
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/png, image/jpeg"
                        />
                        <button onClick={handleButtonClick} className="mt-4 w-full bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600">
                            Alterar Imagem
                        </button>
                    </div>

                    {/* Profile Form */}
                    <div className="flex-grow w-full">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                             <div>
                                <label className="block text-sm font-medium text-gray-400">Nome do Perfil</label>
                                <input type="text" defaultValue="Administrador" className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400">Login (Email)</label>
                                <input type="email" defaultValue="admin@teste.com" className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400">Nova Senha</label>
                                <input type="password" placeholder="Deixe em branco para não alterar" className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white" />
                            </div>
                            <div>
                                <label htmlFor="profileType" className="block text-sm font-medium text-gray-400">Tipo de Perfil</label>
                                <select
                                    id="profileType"
                                    value={profileType}
                                    onChange={(e) => setProfileType(e.target.value)}
                                    className="mt-1 block w-full bg-green-800 border-green-700 rounded-md text-white focus:ring-green-500 focus:border-green-500"
                                >
                                    <option>Administrador</option>
                                    <option>Usuário</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
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