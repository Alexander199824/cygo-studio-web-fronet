import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../utils/apiService';
import { Calendar, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

const AppointmentsManager = ({ onError }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        
        // Preparar parámetros de filtro
        const params = {};
        
        if (filter !== 'all') {
          params.status = filter;
        }
        
        if (dateRange.startDate) {
          params.startDate = dateRange.startDate;
        }
        
        if (dateRange.endDate) {
          params.endDate = dateRange.endDate;
        }
        
        const data = await appointmentApi.getAll(params);
        setAppointments(data.appointments);
      } catch (err) {
        console.error('Error al cargar citas:', err);
        onError('Error al cargar citas');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [onError, filter, dateRange]);

  const handleChangeStatus = async (id, status) => {
    try {
      setLoading(true);
      await appointmentApi.updateStatus(id, status);
      
      // Actualizar el estado local
      setAppointments(appointments.map(a => 
        a.id === id ? { ...a, status } : a
      ));
    } catch (err) {
      console.error('Error al cambiar estado de cita:', err);
      onError('Error al cambiar estado de cita');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (id) => {
    try {
      setLoading(true);
      await appointmentApi.sendReminder(id);
      alert('Recordatorio enviado correctamente');
    } catch (err) {
      console.error('Error al enviar recordatorio:', err);
      onError('Error al enviar recordatorio');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtrar citas por búsqueda
  const filteredAppointments = searchQuery
    ? appointments.filter(a => 
        a.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.service.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : appointments;

  // Obtener el estado de la cita como un componente
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pendiente
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle size={12} className="mr-1" />
            Confirmada
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Completada
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Cancelada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <AlertTriangle size={12} className="mr-1" />
            Desconocido
          </span>
        );
    }
  };

  if (loading && appointments.length === 0) {
    return <div className="text-center py-10">Cargando citas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Citas</h2>
        <div className="flex items-center gap-2">
          <a 
            href="/admin-dashboard/appointments/calendar"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a385a] text-white rounded-md hover:bg-[#2c4a76] transition-colors"
          >
            <Calendar size={18} />
            <span>Ver Calendario</span>
          </a>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Filtros */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
            >
              <option value="all">Todas las citas</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar cliente o servicio..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manicurista
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.map(appointment => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-full" 
                        src={appointment.client.profileImage || '/images/placeholder.jpg'} 
                        alt="" 
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.client.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.client.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(appointment.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.startTime.substring(0, 5)} - {appointment.endTime.substring(0, 5)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.service.name}</div>
                  {appointment.nailStyle && (
                    <div className="text-xs text-gray-500">
                      Estilo: {appointment.nailStyle.name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.manicurist.user.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {appointment.manicurist.specialty}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(appointment.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-1">
                    {appointment.status === 'pending' && (
                      <button
                        onClick={() => handleChangeStatus(appointment.id, 'confirmed')}
                        className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Confirmar
                      </button>
                    )}
                    
                    {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                      <button
                        onClick={() => handleChangeStatus(appointment.id, 'cancelled')}
                        className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                      >
                        <XCircle size={14} className="mr-1" />
                        Cancelar
                      </button>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleSendReminder(appointment.id)}
                          className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                        >
                          <Clock size={14} className="mr-1" />
                          Recordatorio
                        </button>
                        
                        <button
                          onClick={() => handleChangeStatus(appointment.id, 'completed')}
                          className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Completar
                        </button>
                      </>
                    )}
                    
                    
                      href={`/admin-dashboard/appointments/${appointment.id}`}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Ver
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron citas</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Intenta ajustar los filtros o crear una nueva cita.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsManager;