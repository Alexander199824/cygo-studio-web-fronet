import React from 'react';
import { useAppointment } from '../store/AppointmentContext';

const AppointmentForm = () => {
  const { 
    formData, 
    updateFormField,
    isFormValid,
    submitAppointment
  } = useAppointment();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const success = submitAppointment();
      if (success) {
        alert('¡Cita reservada exitosamente!');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold">Datos de Contacto</h2>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => updateFormField('name', e.target.value)}
              placeholder="Tu nombre completo" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => updateFormField('email', e.target.value)}
              placeholder="tu@email.com" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Teléfono</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => updateFormField('phone', e.target.value)}
              placeholder="Tu teléfono" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Servicio Deseado</label>
            <input 
              type="text" 
              value={formData.service}
              onChange={(e) => updateFormField('service', e.target.value)}
              placeholder="Ej: Uñas acrílicas, Manicure tradicional" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="md:col-span-2">
            <button 
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-3 rounded-md transition-colors focus:outline-none
                ${isFormValid()
                  ? 'bg-pink-600 hover:bg-pink-700 text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
              `}
            >
              {isFormValid() ? 'Reservar Cita' : 'Complete todos los campos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;