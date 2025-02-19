import React, { useState } from 'react';
import { useAppointment } from '../store/AppointmentContext';
import { formatDate, formatTime } from '../utils/dateUtils';

const AppointmentSummary = ({ onConfirm }) => {
  const { 
    selectedDate, 
    selectedManicurist,
    selectedTimeSlot,
    formData,
    manicurists,
    isFormValid
  } = useAppointment();
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!isFormValid()) {
    return null;
  }
  
  const manicurist = manicurists.find(m => m.id === selectedManicurist);
  const timeSlot = manicurist.timeSlots[selectedTimeSlot];
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const renderNailStyle = () => {
    if (!formData.nailStyle) return null;
    
    if (formData.nailStyle.type === 'predefined') {
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{formData.nailStyle.name}</span>
        </div>
      );
    } else if (formData.nailStyle.type === 'custom') {
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{formData.nailStyle.fileCount} {formData.nailStyle.fileCount === 1 ? 'imagen' : 'imágenes'} de referencia</span>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 border-2 border-pink-100">
      <div 
        className="px-4 py-3 border-b border-gray-200 bg-pink-50 cursor-pointer flex justify-between items-center"
        onClick={toggleExpand}
      >
        <h2 className="font-semibold flex items-center gap-2 text-pink-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Resumen de tu Cita
        </h2>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha y Hora</h3>
              <p>{formatDate(selectedDate)} a las {timeSlot.time}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Manicurista</h3>
              <div className="flex items-center gap-2">
                {manicurist.avatar && (
                  <img 
                    src={manicurist.avatar} 
                    alt={manicurist.name} 
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <p>{manicurist.name} ({manicurist.specialty})</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Cliente</h3>
              <p>{formData.name}</p>
              <p className="text-sm text-gray-500">{formData.email} | {formData.phone}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Servicio</h3>
              <p>{formData.service || 'Servicio no especificado'}</p>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estilo de Uñas</h3>
              {renderNailStyle()}
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-4 pt-4">
            <p className="text-sm text-gray-500 mb-3">
              Por favor verifica que todos los datos sean correctos antes de confirmar tu cita.
            </p>
            <button
              onClick={onConfirm}
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-colors"
            >
              Confirmar Cita
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentSummary;