import React, { useState } from 'react';
import { loginUser } from '../utils/auth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await loginUser(username, password);
      
      // Redireccionar según el rol
      if (userData.role === 'manicurist') {
        window.location.href = '/manicurist-dashboard';
      } else {
        window.location.href = '/client-dashboard';
      }
    } catch (error) {
      setError('Usuario o contraseña incorrectos');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a385a] to-[#2c4a76] flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Cygo Studio</h1>
          <p className="text-gray-200 mt-2">Inicia sesión para acceder a tu cuenta</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a385a] focus:border-[#1a385a]"
                  placeholder="Nombre de usuario"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a385a] focus:border-[#1a385a]"
                  placeholder="Contraseña"
                  required
                />
                <div className="mt-1 flex justify-end">
                  <a href="#" className="text-sm text-[#1a385a] hover:text-[#2c4a76]">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a385a] hover:bg-[#2c4a76] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a385a] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <div className="text-center text-sm">
              <p className="text-gray-600">
                ¿Credenciales de demostración?
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-100 p-2 rounded">
                  <p className="font-medium">Manicuristas:</p>
                  <p>Usuario: claudia</p>
                  <p>Contraseña: claudia123</p>
                  <p className="mt-1">Usuario: sucel</p>
                  <p>Contraseña: sucel123</p>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <p className="font-medium">Clientas:</p>
                  <p>Usuario: maria</p>
                  <p>Contraseña: maria123</p>
                  <p className="mt-1">Usuario: ana</p>
                  <p>Contraseña: ana123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;