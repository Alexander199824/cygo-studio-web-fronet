import React, { useState, useEffect } from 'react';
import { Calendar, User, Search, Edit, Check, AlertTriangle, Clock } from 'lucide-react';
import { getCurrentUser } from '../utils/auth';
import { appointmentApi, availabilityApi } from '../utils/apiService';
import AppointmentList from './manicurist/AppointmentList';
import AvailabilityManager from './manicurist/AvailabilityManager';
import ClientManagement from './manicurist/ClientManagement';

const ManicuristDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [currentUser, setCurrentUser] = useState(null);
  const [manicuristProfile, setManicuristProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState({
    upcoming: [],
    completed: []
  });
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Cargar información del usuario
    const user = getCurrentUser();
    if (!user || user.role !== 'manicurist') {
      window.location.href = '/login';
      return;
    }
    
    setCurrentUser(user);
    
    // Cargar perfil de manicurista y citas
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Obtener perfil de manicurista
        const profileRes = await fetch(`/api/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
          }
        });
        const profileData = await profileRes.json();
        
        if (profileData.user && profileData.user.manicuristProfile) {
          setManicuristProfile(profileData.user.manicuristProfile);
          
          // Cargar citas próximas
          const upcomingRes = await appointmentApi.getAll({
            manicuristId: profileData.user.manicuristProfile.id,
            status: 'confirmed,pending',
            startDate: new Date().toISOString().split('T')[0]
          });
          
          // Cargar citas completadas
          const completedRes = await appointmentApi.getAll({
            manicuristId: profileData.user.manicuristProfile.id,
            status: 'completed',
            endDate: new Date().toISOString().split('T')[0]
          });
          
          setAppointments({
            upcoming: upcomingRes.appointments,
            completed: completedRes.appointments
          });
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('No se pudieron cargar los datos. Intente nuevamente más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentApi.updateStatus(appointmentId, newStatus);
      
      // Actualizar lista de citas
      if (newStatus === 'completed') {
        setAppointments(prev => ({
          upcoming: prev.upcoming.filter(a => a.id !== appointmentId),
          completed: [...prev.completed, prev.upcoming.find(a => a.id === appointmentId)]
        }));
      } else if (newStatus === 'cancelled') {
        setAppointments(prev => ({
          ...prev,
          upcoming: prev.upcoming.filter(a => a.id !== appointmentId)
        }));
      }
    } catch (err) {
      console.error('Error al cambiar estado de cita:', err);
      setError('No se pudo actualizar el estado de la cita.');
    }
  };

  const handleAddClientNote = async (appointmentId, note) => {
    try {
      await appointmentApi.addNote(appointmentId, note);
      
      // Actualizar notas en la UI
      setAppointments(prev => ({
        upcoming: prev.upcoming.map(a => 
          a.id === appointmentId ? { ...a, manicuristNote: note } : a
        ),
        completed: prev.completed.map(a => 
          a.id === appointmentId ? { ...a, manicuristNote: note } : a
        )
      }));
    } catch (err) {
      console.error('Error al añadir nota:', err);
      setError('No se pudo guardar la nota.');
    }
  };

  const handleSendReminder = async (appointmentId) => {
    try {
      await appointmentApi.sendReminder(appointmentId);
      alert('Recordatorio enviado correctamente');
    } catch (err) {
      console.error('Error al enviar recordatorio:', err);
      setError('No se pudo enviar el recordatorio.');
    }
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
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 border-b border-red-100">
              {error}
              <button 
                className="ml-2 text-sm underline"
                onClick={() => setError(null)}
              >
                Cerrar
              </button>
            </div>
          )}
          
          <div className="p-6">
            {activeTab === 'appointments' && (
              <AppointmentList 
                appointments={appointments}
                onStatusChange={handleAppointmentStatusChange}
                onAddNote={handleAddClientNote}
                onSendReminder={handleSendReminder}
              />
            )}
            {activeTab === 'availability' && (
              <AvailabilityManager 
                manicuristId={manicuristProfile?.id}
              />
            )}
            {activeTab === 'clients' && (
              <ClientManagement 
                manicuristId={manicuristProfile?.id}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManicuristDashboard;