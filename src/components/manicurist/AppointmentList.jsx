import React, { useState } from 'react';
import { Calendar, Clock, Check, X, AlertTriangle, Edit, Send } from 'lucide-react';

const AppointmentList = ({ appointments, onStatusChange, onAddNote, onSendReminder }) => {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar citas por búsqueda
  const filteredUpcoming = searchQuery 
    ? appointments.upcoming.filter(appt => 
        appt.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.service.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : appointments.upcoming;

  const filteredCompleted = searchQuery
    ? appointments.completed.filter(appt => 
        appt.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.service.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : appointments.completed;

  const handleOpenNoteModal = (appointment) => {
    setCurrentAppointment(appointment);
    setNoteText(appointment.manicuristNote || '');
    setNoteModalOpen(true);
  };

  const handleSaveNote = () => {
    if (currentAppointment) {
      onAddNote(currentAppointment.id, noteText);
      setNoteModalOpen(false);
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
    switch (status) {
      case 'confirmed':
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Confirmada
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </span>
        );
      case 'completed':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Completada
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
            <X className="h-3 w-3 mr-1" />
            Cancelada
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Desconocido
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">Próximas Citas</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar cita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 pr-8 text-sm border border-gray-300 rounded-md"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
        
        {filteredUpcoming.length > 0 ? (
          <div className="space-y-4">
            {filteredUpcoming.map(appt => (
              <div key={appt.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[#1a385a]/10 rounded-full text-[#1a385a]">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <h4 className="font-medium text-gray-900">{appt.client.name}</h4>
                        {getStatusBadge(appt.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(appt.date)} • {appt.startTime.substring(0, 5)}
                      </p>
                      <p className="text-sm mt-1 font-medium">{appt.service.name}</p>
                      {appt.nailStyle && (
                        <p className="text-xs text-gray-500">
                          Estilo: {appt.nailStyle.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 flex flex-wrap gap-2 justify-end">
                    <button 
                      onClick={() => handleOpenNoteModal(appt)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                    >
                      <Edit size={14} className="mr-1" />
                      Notas
                    </button>
                    
                    {appt.status === 'confirmed' && (
                      <>
                        <button 
                          onClick={() => onSendReminder(appt.id)}
                          className="px-3 py-1 text-sm border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 flex items-center"
                        >
                          <Send size={14} className="mr-1" />
                          Recordatorio
                        </button>
                        
                        <button 
                          onClick={() => onStatusChange(appt.id, 'completed')}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                        >
                          <Check size={14} className="mr-1" />
                          Completar
                        </button>
                      </>
                    )}
                    
                    {appt.status === 'pending' && (
                      <button 
                        onClick={() => onStatusChange(appt.id, 'confirmed')}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      >
                        <Check size={14} className="mr-1" />
                        Confirmar
                      </button>
                    )}
                    
                    {(appt.status === 'pending' || appt.status === 'confirmed') && (
                      <button 
                        onClick={() => onStatusChange(appt.id, 'cancelled')}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                      >
                        <X size={14} className="mr-1" />
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
                
                {appt.manicuristNote && (
                  <div className="mt-3 p-2 bg-gray-50 rounded-md">
                    <p className="text-xs font-medium text-gray-500">Nota:</p>
                    <p className="text-sm text-gray-700">{appt.manicuristNote}</p>
                  </div>
                )}
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
        
        {filteredCompleted.length > 0 ? (
          <div className="space-y-4">
            {filteredCompleted.map(appt => (
              <div key={appt.id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-gray-500">
                      <Check size={20} />
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <h4 className="font-medium text-gray-800">{appt.client.name}</h4>
                        {getStatusBadge(appt.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(appt.date)} • {appt.startTime.substring(0, 5)}
                      </p>
                      <p className="text-sm mt-1">{appt.service.name}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0">
                    {appt.clientRating > 0 && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">Calificación:</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-4 w-4 ${i < appt.clientRating ? 'text-yellow-400' : 'text-gray-300'}`}
                              viewBox="0 0 20 20" 
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <button 
                        onClick={() => handleOpenNoteModal(appt)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                      >
                        <Edit size={14} className="mr-1" />
                        {appt.manicuristNote ? 'Editar Nota' : 'Añadir Nota'}
                      </button>
                    </div>
                  </div>
                </div>
                
                {appt.clientReview && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-md">
                    <p className="text-xs font-medium text-blue-600">Reseña del cliente:</p>
                    <p className="text-sm text-gray-700">{appt.clientReview}</p>
                  </div>
                )}
                
                {appt.manicuristNote && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md">
                    <p className="text-xs font-medium text-gray-500">Nota:</p>
                    <p className="text-sm text-gray-700">{appt.manicuristNote}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No hay citas recientes completadas</p>
          </div>
        )}
      </div>
      
      {noteModalOpen && currentAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-medium mb-4">Notas para la cita de {currentAppointment.client.name}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Añade notas privadas sobre esta clienta o cita
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                placeholder="Escribe tus notas aquí..."
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Estas notas son privadas y solo visibles para ti.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setNoteModalOpen(false)}
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

export default AppointmentList;