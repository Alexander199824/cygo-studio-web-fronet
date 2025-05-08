import React, { useState } from 'react';
import { Users, Scissors, Image, Calendar, MessageSquare, Settings } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import ManicuristsManager from './admin/ManicuristsManager';
import ServicesManager from './admin/ServicesManager';
import NailStylesManager from './admin/NailStylesManager';
import AppointmentsManager from './admin/AppointmentsManager';
import ReviewsManager from './admin/ReviewsManager';
import SettingsManager from './admin/SettingsManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('manicurists');
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [error, setError] = useState(null);
  
  // Verificar si es superadmin
  if (!currentUser || currentUser.role !== 'superadmin') {
    window.location.href = '/login';
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Administración</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
            <button 
              className="ml-2 text-sm underline"
              onClick={() => setError(null)}
            >
              Cerrar
            </button>
          </div>
        )}
        
        <div className="flex">
          {/* Sidebar de navegación */}
          <div className="w-64 bg-white shadow-sm rounded-lg p-4 mr-6">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('manicurists')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'manicurists' 
                    ? 'bg-[#1a385a] text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Users size={18} className="mr-2" />
                <span>Manicuristas</span>
              </button>
              
              <button
                onClick={() => setActiveTab('services')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'services' 
                    ? 'bg-[#1a385a] text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Scissors size={18} className="mr-2" />
                <span>Servicios</span>
              </button>
              
              <button
                onClick={() => setActiveTab('nailStyles')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'nailStyles' 
                    ? 'bg-[#1a385a] text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Image size={18} className="mr-2" />
                <span>Estilos de Uñas</span>
              </button>
              
              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'appointments' 
                    ? 'bg-[#1a385a] text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Calendar size={18} className="mr-2" />
                <span>Citas</span>
              </button>
              
              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'reviews' 
                    ? 'bg-[#1a385a] text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <MessageSquare size={18} className="mr-2" />
                <span>Reseñas</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'settings' 
                    ? 'bg-[#1a385a] text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Settings size={18} className="mr-2" />
                <span>Configuración</span>
              </button>
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="flex-1 bg-white shadow-sm rounded-lg p-6">
            {activeTab === 'manicurists' && (
              <ManicuristsManager onError={setError} />
            )}
            
            {activeTab === 'services' && (
              <ServicesManager onError={setError} />
            )}
            
            {activeTab === 'nailStyles' && (
              <NailStylesManager onError={setError} />
            )}
            
            {activeTab === 'appointments' && (
              <AppointmentsManager onError={setError} />
            )}
            
            {activeTab === 'reviews' && (
              <ReviewsManager onError={setError} />
            )}
            
            {activeTab === 'settings' && (
              <SettingsManager onError={setError} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;