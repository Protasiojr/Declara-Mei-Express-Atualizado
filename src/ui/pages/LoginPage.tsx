import React from 'react';
import { useAuth } from '../../app/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/dashboard');
  };

  return (
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
  );
};

export default LoginPage;