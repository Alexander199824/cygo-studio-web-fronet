import React from 'react';
import { useAppointment } from '../store/AppointmentContext';

const ManicuristSelection = () => {
  const { 
    manicurists, 
    selectedManicurist, 
    setSelectedManicurist,
    setSelectedTimeSlot
  } = useAppointment();

  const handleSelectManicurist = (id) => {
    setSelectedManicurist(id);
    setSelectedTimeSlot(null); // Reset time slot when changing manicurist
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Elige tu Manicurista
        </h2>
      </div>
      <div className="p-4">
        <div className="space-y-6">
          {manicurists.map(manicurist => (
            <div 
              key={manicurist.id}
              className={`flex flex-col md:flex-row items-center md:items-start gap-4 p-4 rounded-lg cursor-pointer border-2 transition-colors
                ${selectedManicurist === manicurist.id 
                  ? 'border-pink-600 bg-pink-50' 
                  : 'border-transparent hover:border-gray-200'}`}
              onClick={() => handleSelectManicurist(manicurist.id)}
            >
              {/* Foto de perfil más elegante */}
              <div className="flex-shrink-0 relative">
                <div className="w-24 h-24 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                  <img 
                    src={manicurist.avatar} 
                    alt={manicurist.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center
                  ${selectedManicurist === manicurist.id ? 'bg-pink-600 text-white' : 'bg-gray-200'}`}>
                  {selectedManicurist === manicurist.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="font-semibold text-lg">{manicurist.name}</div>
                <div className="text-gray-500 mb-2">{manicurist.specialty}</div>
                
                {/* Indicador de disponibilidad */}
                <div className="flex flex-wrap justify-center md:justify-start gap-1 mt-2">
                  {manicurist.timeSlots.filter(slot => slot.available).length > 3 ? (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Alta disponibilidad
                    </span>
                  ) : (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Disponibilidad limitada
                    </span>
                  )}
                  
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {manicurist.timeSlots.filter(slot => slot.available).length} horarios disponibles
                  </span>
                </div>
              </div>
              
              <div className="md:self-center mt-3 md:mt-0">
                <div className="w-8 h-8 rounded-full border border-pink-600 flex items-center justify-center">
                  {selectedManicurist === manicurist.id && 
                    <div className="w-4 h-4 rounded-full bg-pink-600"></div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManicuristSelection;