import React from 'react';
import { useAppointment } from '../store/AppointmentContext';

const TimeSlots = () => {
  const { 
    selectedManicurist, 
    manicurists, 
    selectedDate,
    selectedTimeSlot,
    setSelectedTimeSlot
  } = useAppointment();

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderSlots = () => {
    if (!selectedManicurist) {
      return (
        <div className="text-center py-8 text-gray-500">
          Por favor, selecciona primero una manicurista
        </div>
      );
    }

    const manicurist = manicurists.find(m => m.id === selectedManicurist);
    
    return (
      <div className="space-y-4">
        <div className="text-sm font-medium">
          Horarios de {manicurist.name} para el {formatDate(selectedDate)}:
        </div>
        <div className="grid grid-cols-2 gap-2">
          {manicurist.timeSlots.map((slot, index) => (
            <button
              key={index}
              className={`p-2 rounded-md transition-all
                ${slot.available 
                  ? selectedTimeSlot === index
                    ? 'bg-pink-50 border-2 border-pink-500 text-gray-800'
                    : 'bg-white border border-gray-300 hover:border-pink-500 text-gray-800 hover:-translate-y-1 hover:shadow-md' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              disabled={!slot.available}
              onClick={() => slot.available && setSelectedTimeSlot(index)}
            >
              {slot.time}
              {slot.available ? 
                <span className="ml-1 text-green-500 text-xs">Disponible</span> : 
                <span className="ml-1 text-gray-400 text-xs">Ocupado</span>
              }
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Horarios Disponibles
        </h2>
      </div>
      <div className="p-4">
        {renderSlots()}
      </div>
    </div>
  );
};

export default TimeSlots;