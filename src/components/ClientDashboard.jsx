import React, { useState, useEffect } from 'react';
import { User, Calendar, Palette, History } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Cargar información del usuario
    const user = getCurrentUser();
    if (!user || user.role !== 'client') {
      window.location.href = '/login';
      return;
    }
    
    setCurrentUser(user);
    setLoading(false);
    
    // Simular carga de datos del usuario
    loadUserData(user.id);
  }, []);
  
  // Función para cargar datos del usuario (simulada)
  const loadUserData = (userId) => {
    // En un entorno real, aquí harías una petición al backend
    console.log(`Cargando datos para usuario ID: ${userId}`);
  };
  
  // Datos de ejemplo
  const userProfile = {
    appointments: {
      upcoming: [
        {id: 1, date: '2025-03-01', time: '10:00', manicurist: 'Claudia', service: 'Uñas acrílicas', status: 'confirmed'},
        {id: 2, date: '2025-03-15', time: '11:00', manicurist: 'Sucel', service: 'Diseño artístico', status: 'pending'}
      ],
      past: [
        {id: 3, date: '2025-02-01', time: '14:00', manicurist: 'Claudia', service: 'Manicure tradicional', status: 'completed'},
        {id: 4, date: '2025-01-15', time: '09:00', manicurist: 'Sucel', service: 'Uñas gel', status: 'completed'},
        {id: 5, date: '2024-12-20', time: '13:00', manicurist: 'Claudia', service: 'Uñas francesas', status: 'completed'}
      ]
    },
    favoriteStyles: [
      {id: 1, name: 'Francesas Clásicas', imageUrl: '/images/nail-styles/french-classic.jpg'},
      {id: 5, name: 'Degradados', imageUrl: '/images/nail-styles/ombre-gradient.jpg'}
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button 
              className={`px-4 py-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'appointments' ? 'border-b-2 border-[#1a385a] text-[#1a385a]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('appointments')}
            >
              <Calendar size={16} />
              <span>Mis Citas</span>
            </button>
            <button 
              className={`px-4 py-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'styles' ? 'border-b-2 border-[#1a385a] text-[#1a385a]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('styles')}
            >
              <Palette size={16} />
              <span>Estilos Favoritos</span>
            </button>
            <button 
              className={`px-4 py-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'profile' ? 'border-b-2 border-[#1a385a] text-[#1a385a]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={16} />
              <span>Mi Perfil</span>
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'appointments' && renderAppointmentHistory()}
            {activeTab === 'styles' && renderFavoriteStyles()}
            {activeTab === 'profile' && renderProfileSettings()}
          </div>
        </div>
      </div>
    </div>
  );

  function renderAppointmentHistory() {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-medium text-lg mb-4">Próximas Citas</h3>
          {userProfile.appointments.upcoming.length > 0 ? (
            <div className="space-y-3">
              {userProfile.appointments.upcoming.map(appt => (
                <div key={appt.id} className="bg-white rounded-lg p-4 border border-[#1a385a]/10 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-[#1a385a]/10 rounded-full text-[#1a385a]">
                    <Calendar size={24} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{appt.service}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(appt.date).toLocaleDateString('es-ES', {
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric'
                          })} • {appt.time}
                        </p>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-200 flex-shrink-0">
                          <img 
                            src={`/images/manicurists/${appt.manicurist.toLowerCase()}.jpg`}
                            alt={appt.manicurist} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-800">{appt.manicurist}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full 
                        ${appt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      `}>
                        {appt.status === 'confirmed' ? 'Confirmada' : 
                         appt.status === 'pending' ? 'Pendiente' : ''}
                      </span>
                      <button className="text-xs px-2 py-1 border border-gray-300 rounded-full hover:bg-gray-50">
                        Reprogramar
                      </button>
                      <button className="text-xs px-2 py-1 border border-red-300 text-red-700 rounded-full hover:bg-red-50">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">No tienes citas próximas.</p>
          )}
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-4">Historial de Citas</h3>
          {userProfile.appointments.past.length > 0 ? (
            <div className="space-y-3">
              {userProfile.appointments.past.map(appt => (
                <div key={appt.id} className="bg-white rounded-lg p-4 border border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full text-gray-500">
                    <History size={24} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-gray-800">{appt.service}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(appt.date).toLocaleDateString('es-ES', {
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric'
                          })} • {appt.time}
                        </p>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-200 flex-shrink-0">
                          <img 
                            src={`/images/manicurists/${appt.manicurist.toLowerCase()}.jpg`}
                            alt={appt.manicurist} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-800">{appt.manicurist}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Completada
                      </span>
                      <button className="text-xs px-2 py-1 border border-[#1a385a] text-[#1a385a] rounded-full hover:bg-[#1a385a]/10">
                        Reservar Similar
                      </button>
                      <button className="text-xs px-2 py-1 border border-gray-300 rounded-full hover:bg-gray-50">
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">No tienes historial de citas.</p>
          )}
        </div>
      </div>
    );
  }

  function renderFavoriteStyles() {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-lg mb-4">Tus Estilos Favoritos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userProfile.favoriteStyles.map(style => (
            <div key={style.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={style.imageUrl} 
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-medium">{style.name}</h4>
                <div className="flex justify-between items-center mt-3">
                  <button className="text-xs px-3 py-2 bg-[#1a385a] text-white rounded-md hover:bg-[#2c4a76]">
                    Reservar Este Estilo
                  </button>
                  <button className="text-[#1a385a] hover:text-[#2c4a76]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center h-64">
            <div className="text-center p-6">
              <Palette size={32} className="mx-auto mb-3 text-gray-400" />
              <h4 className="font-medium mb-2">Explora más estilos</h4>
              <p className="text-sm text-gray-600 mb-4">Descubre nuevos diseños y tendencias</p>
              <button className="px-4 py-2 bg-[#1a385a]/10 text-[#1a385a] rounded-md hover:bg-[#1a385a]/20">
                Ver Catálogo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderProfileSettings() {
    return (
      <div className="max-w-2xl mx-auto">
        <h3 className="font-medium text-lg mb-6">Ajustes de Perfil</h3>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Profile"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1a385a] text-white flex items-center justify-center border-2 border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex-grow space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    defaultValue={currentUser?.name || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input 
                    type="tel" 
                    defaultValue="555-123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  defaultValue="maria@ejemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input 
                  type="password" 
                  defaultValue="********"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                />
              </div>
              
              <div className="pt-4">
                <h4 className="font-medium mb-2">Preferencias</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input id="notifications" type="checkbox" className="h-4 w-4 text-[#1a385a] border-gray-300 rounded" />
                    <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                      Recibir notificaciones por email
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input id="reminders" type="checkbox" className="h-4 w-4 text-[#1a385a] border-gray-300 rounded" />
                    <label htmlFor="reminders" className="ml-2 block text-sm text-gray-700">
                      Recordatorios de cita (24h antes)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input id="marketing" type="checkbox" className="h-4 w-4 text-[#1a385a] border-gray-300 rounded" />
                    <label htmlFor="marketing" className="ml-2 block text-sm text-gray-700">
                      Promociones y ofertas especiales
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2">
              Cancelar
            </button>
            <button className="px-4 py-2 bg-[#1a385a] text-white rounded-md hover:bg-[#2c4a76]">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default ClientDashboard;