import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logoutUser, getCurrentUser } from '../utils/auth';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;
  const isClient = currentUser?.role === 'client';
  
  const handleLogout = () => {
    logoutUser();
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-[#1a385a]">
                Cygo Studio
              </Link>
            </div>
            
            {/* Enlaces de navegación para pantallas medianas y grandes */}
            <div className="hidden md:ml-6 md:flex md:space-x-4 md:items-center">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Inicio
              </Link>
              
              {isLoggedIn ? (
                // Mostrar enlaces según el rol si hay usuario
                isClient ? (
                  <>
                    <Link to="/client-dashboard" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                      Mis Citas
                    </Link>
                    <Link to="/client-dashboard/styles" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                      Catálogo
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/manicurist-dashboard" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                      Citas
                    </Link>
                    <Link to="/manicurist-dashboard/availability" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                      Disponibilidad
                    </Link>
                    <Link to="/manicurist-dashboard/clients" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                      Clientas
                    </Link>
                  </>
                )
              ) : (
                // Mostrar enlaces para visitantes
                <>
                  <Link to="/services" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Servicios
                  </Link>
                  <Link to="/gallery" className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Galería
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Sección de usuario */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              // Mostrar perfil y opciones para usuarios logueados
              <div className="flex items-center">
                <div className="relative">
                  <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                </div>
                
                <div className="ml-4 relative">
                  <div className="flex items-center">
                    <button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={isClient 
                            ? "https://randomuser.me/api/portraits/women/44.jpg" 
                            : `/images/manicurists/${currentUser.username}.jpg`
                          } 
                          alt="Perfil"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    </button>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-700">
                        {currentUser.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {isClient ? 'Cliente' : 'Manicurista'}
                      </div>
                    </div>
                    <div className="ml-4">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center text-gray-600 hover:text-[#1a385a]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm6.293 11.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 1.414L7.414 10l1.879 1.879z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 text-sm">Salir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Mostrar botón de inicio de sesión para visitantes
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 border border-[#1a385a] text-[#1a385a] rounded-md hover:bg-[#1a385a]/10 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
          
          {/* Botón de menú móvil */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#1a385a] hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-2">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Inicio
            </Link>
            
            {isLoggedIn ? (
              // Menú móvil para usuarios logueados
              isClient ? (
                <>
                  <Link to="/client-dashboard" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Mis Citas
                  </Link>
                  <Link to="/client-dashboard/styles" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Catálogo
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/manicurist-dashboard" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Citas
                  </Link>
                  <Link to="/manicurist-dashboard/availability" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Disponibilidad
                  </Link>
                  <Link to="/manicurist-dashboard/clients" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Clientas
                  </Link>
                </>
              )
            ) : (
              // Menú móvil para visitantes
              <>
                <Link to="/services" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Servicios
                </Link>
                <Link to="/gallery" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  Galería
                </Link>
                <Link to="/login" className="block px-3 py-2 rounded-md text-[#1a385a] hover:bg-[#1a385a]/10">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
          
          {isLoggedIn && (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={isClient 
                        ? "https://randomuser.me/api/portraits/women/44.jpg" 
                        : `/images/manicurists/${currentUser.username}.jpg`
                      } 
                      alt="Perfil"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-700">{currentUser.name}</div>
                  <div className="text-xs text-gray-500">{isClient ? 'Cliente' : 'Manicurista'}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Link to="/profile" className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Mi Perfil</span>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Cerrar Sesión</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;