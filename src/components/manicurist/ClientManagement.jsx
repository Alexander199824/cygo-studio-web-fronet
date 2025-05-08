import React, { useState, useEffect } from 'react';
import { Search, User, Clock, Edit, MessageSquare } from 'lucide-react';
import { appointmentApi } from '../../utils/apiService';

const ClientManagement = ({ manicuristId }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientNote, setClientNote] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [clientAppointments, setClientAppointments] = useState([]);
  const [clientLoading, setClientLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        
        // En una aplicación real, obtendrías esto de una API
        // Aquí simulamos obtener clientes únicos de las citas pasadas
        const appointmentsResponse = await appointmentApi.getAll({
          manicuristId,
          status: 'completed'
        });
        
        // Extraer clientes únicos
        const uniqueClients = [];
        const clientIds = new Set();
        
        appointmentsResponse.appointments.forEach(appointment => {
          if (!clientIds.has(appointment.client.id)) {
            clientIds.add(appointment.client.id);
            uniqueClients.push({
              id: appointment.client.id,
              name: appointment.client.name,
              email: appointment.client.email,
              phone: appointment.client.phone,
              profileImage: appointment.client.profileImage,
              lastAppointment: appointment.date,
              totalAppointments: 1,
              notes: appointment.manicuristNote || ''
            });
          } else {
            // Actualizar conteo de citas para clientes existentes
            const clientIndex = uniqueClients.findIndex(c => c.id === appointment.client.id);
            uniqueClients[clientIndex].totalAppointments += 1;
            
            // Actualizar fecha de última cita si es más reciente
            if (new Date(appointment.date) > new Date(uniqueClients[clientIndex].lastAppointment)) {
              uniqueClients[clientIndex].lastAppointment = appointment.date;
            }
          }
        });
        
        setClients(uniqueClients);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (manicuristId) {
      fetchClients();
    }
  }, [manicuristId]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectClient = async (client) => {
    try {
      setSelectedClient(client);
      setClientNote(client.notes || '');
      setClientLoading(true);
      
      // Obtener citas del cliente
      const appointmentsResponse = await appointmentApi.getAll({
        manicuristId,
        clientId: client.id
      });
      
      setClientAppointments(appointmentsResponse.appointments);
    } catch (error) {
      console.error('Error al cargar citas del cliente:', error);
    } finally {
      setClientLoading(false);
    }
  };

  const handleOpenNoteModal = () => {
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    try {
      // Aquí normalmente guardarías la nota en la API
      // Por ahora solo actualizamos el estado local
      setClients(clients.map(c => 
        c.id === selectedClient.id 
          ? { ...c, notes: clientNote }
          : c
      ));
      
      setSelectedClient({ ...selectedClient, notes: clientNote });
      setShowNoteModal(false);
    } catch (error) {
      console.error('Error al guardar nota:', error);
    }
  };

  // Filtrar clientes según búsqueda
  const filteredClients = searchQuery
    ? clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clients;

  // Formatear fecha
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Lista de clientes */}
      <div className="md:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium">Mis Clientas</h3>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Buscar clienta..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Cargando clientas...
            </div>
          ) : filteredClients.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredClients.map(client => (
                <li 
                  key={client.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedClient?.id === client.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => handleSelectClient(client)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {client.profileImage ? (
                        <img 
                          src={client.profileImage} 
                          alt={client.name} 
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {client.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {client.email}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-gray-500 text-right">
                      <div>{client.totalAppointments} citas</div>
                      <div>Última: {formatDate(client.lastAppointment)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron clientas</h3>
              {searchQuery ? (
                <p className="mt-1 text-sm text-gray-500">
                  Prueba con una búsqueda diferente
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  Aún no tienes clientas con citas completadas
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Detalles del cliente */}
      <div className="md:col-span-2">
        {selectedClient ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-5">
                  {selectedClient.profileImage ? (
                    <img 
                      src={selectedClient.profileImage} 
                      alt={selectedClient.name} 
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-medium text-gray-900">
                      {selectedClient.name}
                    </h2>
                    <div className="mt-1 text-sm text-gray-500">
                      <p>{selectedClient.email}</p>
                      <p>{selectedClient.phone || 'Sin teléfono registrado'}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleOpenNoteModal}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center text-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {selectedClient.notes ? 'Editar Notas' : 'Añadir Notas'}
                </button>
              </div>
              
              {selectedClient.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                  <div className="flex items-center text-yellow-800 text-sm font-medium mb-1">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Notas privadas
                  </div>
                  <p className="text-sm text-gray-700">{selectedClient.notes}</p>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="font-medium mb-4">Historial de Citas</h3>
              
              {clientLoading ? (
                <div className="text-center py-4 text-gray-500">
                  Cargando historial...
                </div>
              ) : clientAppointments.length > 0 ? (
                <div className="space-y-4">
                  {clientAppointments.map(appointment => (
                    <div 
                      key={appointment.id} 
                      className="border border-gray-200 rounded-md p-4"
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">
                              {formatDate(appointment.date)} • {appointment.startTime.substring(0, 5)}
                            </span>
                          </div>
                          <p className="font-medium mt-1">{appointment.service.name}</p>
                          {appointment.nailStyle && (
                            <p className="text-sm text-gray-600">
                              Estilo: {appointment.nailStyle.name}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Estado: <span className={`${
                              appointment.status === 'completed' ? 'text-green-600' :
                              appointment.status === 'cancelled' ? 'text-red-600' :
                              appointment.status === 'confirmed' ? 'text-blue-600' :
                              'text-yellow-600'
                            }`}>
                              {appointment.status === 'completed' ? 'Completada' :
                               appointment.status === 'cancelled' ? 'Cancelada' :
                               appointment.status === 'confirmed' ? 'Confirmada' :
                               'Pendiente'}
                            </span>
                          </div>
                          
                          {appointment.clientRating > 0 && (
                            <div className="flex items-center justify-end mt-1">
                              <div className="flex text-yellow-400 mr-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg 
                                    key={i} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`h-4 w-4 ${i < appointment.clientRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm">{appointment.clientRating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {appointment.manicuristNote && (
                        <div className="mt-3 p-2 bg-gray-50 rounded-md">
                          <p className="text-xs font-medium text-gray-500">Nota de la cita:</p>
                          <p className="text-sm text-gray-700">{appointment.manicuristNote}</p>
                        </div>
                      )}
                      
                      {appointment.clientReview && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-md">
                          <p className="text-xs font-medium text-blue-600">Reseña del cliente:</p>
                          <p className="text-sm text-gray-700">{appointment.clientReview}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="font-medium text-gray-900 mb-1">Sin historial de citas</h3>
                  <p className="text-gray-600 text-sm">
                    No hay citas registradas para esta clienta.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Selecciona una clienta</h3>
            <p className="mt-1 text-sm text-gray-500">
              Selecciona una clienta de la lista para ver su información detallada.
            </p>
          </div>
        )}
      </div>
      
      {/* Modal para notas de cliente */}
      {showNoteModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-medium mb-4">Notas sobre {selectedClient.name}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Añade notas privadas sobre esta clienta
              </label>
              <textarea
                value={clientNote}
                onChange={(e) => setClientNote(e.target.value)}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                placeholder="Preferencias, estilo favorito, consejos para atenderla mejor..."
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Estas notas son privadas y solo visibles para ti.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-[#1a385a] text-white rounded-md hover:bg-[#2c4a76]"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;