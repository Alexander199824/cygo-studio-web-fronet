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
        <div className="space-y-4">
          {manicurists.map(manicurist => (
            <div 
              key={manicurist.id}
              className={`flex items-start space-x-3 p-4 rounded-lg cursor-pointer border-2 transition-colors
                ${selectedManicurist === manicurist.id 
                  ? 'border-pink-600 bg-pink-50' 
                  : 'border-transparent hover:border-gray-200'}`}
              onClick={() => handleSelectManicurist(manicurist.id)}
            >
              <div className="flex-shrink-0">
                <div className="w-4 h-4 rounded-full border border-pink-600 flex items-center justify-center">
                  {selectedManicurist === manicurist.id && 
                    <div className="w-2 h-2 rounded-full bg-pink-600"></div>}
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium">{manicurist.name}</div>
                <div className="text-sm text-gray-500">{manicurist.specialty}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManicuristSelection;