import React, { useState, useEffect } from 'react';
import { Calendar, User, Search, Edit, Check, AlertTriangle, Clock } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';

const ManicuristDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showClientNoteModal, setShowClientNoteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientNote, setClientNote] = useState('');
  
  useEffect(() => {
    // Cargar información del usuario
    const user = getCurrentUser();
    if (!user || user.role !== 'manicurist') {
      window.location.href = '/login';
      return;
    }
    
    setCurrentUser(user);
    setLoading(false);
  }, []);
  
  // Datos de ejemplo - Perfiles de manicuristas
  const manicuristProfiles = {
    claudia: {
      id: 1,
      name: "Claudia García",
      specialty: "Especialista en uñas acrílicas",
      avatar: "/images/manicurists/claudia.jpg"
    },
    sucel: {
      id: 2,
      name: "Sucel Pérez",
      specialty: "Especialista en diseños artísticos",
      avatar: "/images/manicurists/sucel.jpg"
    }
  };
  
  // Datos de ejemplo - Citas
  const appointments = {
    claudia: {
      upcoming: [
        {
          id: 101,
          clientName: "María Rodríguez",
          date: "2025-02-26",
          time: "10:00",
          service: "Uñas acrílicas con diseño",
          status: "confirmed"
        },
        {
          id: 103,
          clientName: "Daniela Torres",
          date: "2025-02-27",
          time: "09:00",
          service: "Uñas de gel con piedras",
          status: "confirmed"
        }
      ],
      completed: [
        {
          id: 104,
          clientName: "Laura Vega",
          date: "2025-02-20",
          time: "14:00",
          service: "Uñas francesas",
          status: "completed",
          rating: 5
        }
      ]
    },
    sucel: {
      upcoming: [
        {
          id: 102,
          clientName: "Ana López",
          date: "2025-02-26",
          time: "12:00",
          service: "Manicure tradicional",
          status: "pending"
        }
      ],
      completed: [
        {
          id: 105,
          clientName: "María Rodríguez",
          date: "2025-02-15",
          time: "11:00",
          service: "Uñas acrílicas",
          status: "completed",
          rating: 4
        }
      ]
    }
  };
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Confirmada</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pendiente</span>;
      case 'completed':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Completada</span>;
      default:
        return null;
    }
  };
  
  const renderRatingStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star}
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  // Obtener las citas de la manicurista seleccionada
  const currentAppointments = currentUser ? appointments[currentUser.username] : null;
  
  function renderClientTab() {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 mx-auto text-[#1a385a] mb-4" />
        <h3 className="text-xl font-medium mb-2">Gestión de Clientes</h3>
        <p className="text-gray-600 mb-6">
          Revisa información de tus clientas y añade notas privadas
        </p>
        <button className="px-4 py-2 bg-[#1a385a] text-white rounded-md">
          Ver Clientes
        </button>
      </div>
    );
  }
  
  function renderAvailabilityTab() {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 mx-auto text-[#1a385a] mb-4" />
        <h3 className="text-xl font-medium mb-2">Gestión de Disponibilidad</h3>
        <p className="text-gray-600 mb-6">
          Aquí puedes configurar tus horarios disponibles para citas
        </p>
        <button className="px-4 py-2 bg-[#1a385a] text-white rounded-md">
          Editar Horarios
        </button>
      </div>
    );
  }
  
  function renderAppointmentsTab() {
    if (!currentAppointments) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg">Próximas Citas</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cita..."
                className="px-3 py-2 pr-8 text-sm border border-gray-300 rounded-md"
              />
              <Search className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {currentAppointments.upcoming.length > 0 ? (
            <div className="space-y-4">
              {currentAppointments.upcoming.map(appt => (
                <div key={appt.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{appt.clientName}</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(appt.date)} • {appt.time}
                      </p>
                      <p className="mt-2">{appt.service}</p>
                    </div>
                    <div>
                      {getStatusBadge(appt.status)}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    <button className="px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded-md text-sm">
                      <Edit className="h-3 w-3 inline mr-1" />
                      Notas
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">
                      <Check className="h-3 w-3 inline mr-1" />
                      Completar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">No hay citas próximas</h3>
              <p className="text-gray-600 text-sm">
                Disfruta de tu tiempo libre o programa nuevas citas
              </p>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-4">Citas Completadas</h3>
          
          {currentAppointments.completed.length > 0 ? (
            <div className="space-y-4">
              {currentAppointments.completed.map(appt => (
                <div key={appt.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">{appt.clientName}</h4>
                      <p className="text-xs text-gray-500">
                        {formatDate(appt.date)} • {appt.time}
                      </p>
                      <p className="text-sm mt-1">{appt.service}</p>
                    </div>
                    <div>
                      <div className="flex items-center">
                        {renderRatingStars(appt.rating)}
                        <span className="ml-2 text-sm text-gray-600">{appt.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No hay citas recientes completadas</p>
            </div>
          )}
        </div>
      </div>
    );
  }

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
              className={`px-4 py-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'availability' ? 'border-b-2 border-[#1a385a] text-[#1a385a]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('availability')}
            >
              <Clock size={16} />
              <span>Disponibilidad</span>
            </button>
            <button 
              className={`px-4 py-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'clients' ? 'border-b-2 border-[#1a385a] text-[#1a385a]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('clients')}
            >
              <User size={16} />
              <span>Clientas</span>
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'appointments' && renderAppointmentsTab()}
            {activeTab === 'availability' && renderAvailabilityTab()}
            {activeTab === 'clients' && renderClientTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManicuristDashboard;