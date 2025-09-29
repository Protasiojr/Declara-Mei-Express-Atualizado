import React, { useState, useEffect } from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PasswordStrengthMeter: React.FC<{ password?: string }> = ({ password = '' }) => {
  const [strength, setStrength] = useState({
    score: 0,
    label: 'Fraca',
    color: 'bg-red-500',
    width: 'w-0'
  });

  const [criteria, setCriteria] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    const newCriteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setCriteria(newCriteria);

    const score = Object.values(newCriteria).filter(Boolean).length;
    let newStrength = { score: 0, label: 'Fraca', color: 'bg-red-500', width: 'w-0' };

    if (score === 1) {
      newStrength = { score, label: 'Fraca', color: 'bg-red-500', width: 'w-1/4' };
    } else if (score === 2) {
      newStrength = { score, label: 'Média', color: 'bg-yellow-500', width: 'w-2/4' };
    } else if (score === 3) {
      newStrength = { score, label: 'Média', color: 'bg-yellow-500', width: 'w-3/4' };
    } else if (score === 4) {
      newStrength = { score, label: 'Forte', color: 'bg-green-500', width: 'w-full' };
    }
    setStrength(newStrength);
  }, [password]);

  const CriteriaItem: React.FC<{ met: boolean; children: React.ReactNode }> = ({ met, children }) => (
    <li className={`flex items-center text-xs ${met ? 'text-green-400' : 'text-gray-400'}`}>
       <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
         {met ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>}
      </svg>
      {children}
    </li>
  );

  return (
    <div>
      <div className="w-full bg-green-950 rounded-full h-2 my-2 border border-green-800">
        <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}></div>
      </div>
       <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            <CriteriaItem met={criteria.length}>Pelo menos 8 caracteres</CriteriaItem>
            <CriteriaItem met={criteria.uppercase}>Pelo menos 1 letra maiúscula</CriteriaItem>
            <CriteriaItem met={criteria.number}>Pelo menos 1 número</CriteriaItem>
            <CriteriaItem met={criteria.specialChar}>Pelo menos 1 caractere especial</CriteriaItem>
        </ul>
    </div>
  );
};


const RegistrationModal: React.FC<{
    onClose: () => void;
    onRegister: () => void;
}> = ({ onClose, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    // Lógica para enviar dados para o sistema aqui
    onRegister();
  };

  return (
     <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-green-900 rounded-lg shadow-xl w-full max-w-md border border-green-800 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-green-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Cadastro de Novo Usuário</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none" aria-label="Fechar">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-grow p-6 space-y-4">
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="reg-password"
                   className="block text-sm font-medium text-gray-300">Senha</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <PasswordStrengthMeter password={password} />
          </div>
          <div>
            <label htmlFor="confirm-password"
                   className="block text-sm font-medium text-gray-300">Confirmar Senha</label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </form>
        <div className="p-4 bg-green-950/50 border-t border-green-800 rounded-b-lg flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white font-semibold">
                Cancelar
            </button>
            <button type="submit" form="registration-form" onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold">
                Enviar
            </button>
        </div>
      </div>
    </div>
  );
};


const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/dashboard');
  };

  const handleRegister = () => {
    alert('Dados enviados com sucesso!');
    setIsModalOpen(false);
  };

  return (
    <>
    {isModalOpen && <RegistrationModal onClose={() => setIsModalOpen(false)} onRegister={handleRegister} />}
    <div className="min-h-screen flex items-center justify-center bg-green-950 text-gray-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-green-900 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Controla Fácil Express</h1>
          <p className="mt-2 text-gray-400">Faça login para continuar</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue="admin@teste.com"
              className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="password"
                   className="block text-sm font-medium text-gray-300">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              defaultValue="admin123"
              className="mt-1 block w-full px-3 py-2 bg-green-800 border border-green-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-green-400 hover:text-green-300">
                Esqueceu sua senha?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Entrar
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full flex justify-center py-2 px-4 border border-green-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-green-800 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
            >
              Cadastro
            </button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-green-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-green-900 text-gray-400">Ou continue com</span>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-green-700 rounded-md shadow-sm bg-green-800 text-sm font-medium text-gray-300 hover:bg-green-700"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 488 512" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 25.5 169.3 65.5l-63.5 61.4C333.5 112.5 294.3 96 248 96c-88.6 0-160.1 71.9-160.1 160.1s71.5 160.1 160.1 160.1c94.9 0 134.8-63.8 140.8-97.4H248v-73.8h236.4c2.5 12.8 3.6 26.4 3.6 40.2z" />
            </svg>
            Logar com conta Google
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;