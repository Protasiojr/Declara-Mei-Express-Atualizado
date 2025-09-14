
import React from 'react';
import { useAuth } from '../App';
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
          <h1 className="text-3xl font-bold text-white">Declara Mei Express</h1>
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
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.03-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.578.688.48A10.001 10.001 0 0020 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
            </svg>
            Logar com conta Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;