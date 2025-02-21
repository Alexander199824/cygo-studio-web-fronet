import React, { useState } from 'react';
import { useAppointment } from '../store/AppointmentContext';
import AppointmentSummary from './AppointmentSummary';

const AppointmentForm = () => {
  const { 
    formData, 
    updateFormField,
    isFormValid,
    submitAppointment
  } = useAppointment();
  
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const success = submitAppointment();
      if (success) {
        setShowSuccessMessage(true);
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      }
    }
  };

  // Renderiza el estilo de uñas seleccionado (si hay alguno)
  const renderSelectedStyle = () => {
    if (!formData.nailStyle) return null;

    if (formData.nailStyle.type === 'predefined') {
      return (
        <div className="text-sm bg-[#1a385a]/10 p-2 rounded">
          Estilo seleccionado: <span className="font-medium">{formData.nailStyle.name}</span>
        </div>
      );
    } else if (formData.nailStyle.type === 'custom') {
      return (
        <div className="text-sm bg-[#1a385a]/10 p-2 rounded">
          <span className="font-medium">{formData.nailStyle.fileCount} {formData.nailStyle.fileCount === 1 ? 'imagen' : 'imágenes'}</span> de referencia subida{formData.nailStyle.fileCount === 1 ? '' : 's'}
        </div>
      );
    }

    return null;
  };

  const handleConfirmAppointment = () => {
    const success = submitAppointment();
    if (success) {
      setShowSuccessMessage(true);
      // Ocultar el mensaje después de 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  };

  return (
    <>
      {isFormValid() && (
        <AppointmentSummary onConfirm={handleConfirmAppointment} />
      )}
      
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 animate-pulse">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span className="font-medium">¡Cita reservada exitosamente!</span>
          </div>
          <p className="mt-2 text-sm">
            Te hemos enviado un correo de confirmación con los detalles de tu cita.
          </p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => updateFormField('email', e.target.value)}
                placeholder="tu@email.com" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Teléfono</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => updateFormField('phone', e.target.value)}
                placeholder="Tu teléfono" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Servicio Deseado</label>
              <input 
                type="text" 
                value={formData.service}
                onChange={(e) => updateFormField('service', e.target.value)}
                placeholder="Ej: Uñas acrílicas, Manicure tradicional" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
              />
            </div>
            
            <div className="md:col-span-2">
              {renderSelectedStyle()}
            </div>
            
            <div className="md:col-span-2">
              <button 
                type="submit"
                disabled={!isFormValid()}
                className={`w-full py-3 rounded-md transition-colors focus:outline-none
                  ${isFormValid()
                    ? 'bg-[#1a385a] hover:bg-[#2c4a76] text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
                `}
              >
                {isFormValid() ? 'Reservar Cita' : 'Complete todos los campos'}
              </button>
              {!isFormValid() && !formData.nailStyle && (
                <p className="text-sm text-red-500 mt-2">
                  No olvides seleccionar un estilo de uñas o subir tus referencias
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AppointmentForm;