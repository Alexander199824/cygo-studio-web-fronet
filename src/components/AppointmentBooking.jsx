import React, { useState } from 'react';
import { useAppointment } from '../store/AppointmentContext';
import Calendar from './Calendar';
import ManicuristSelection from './ManicuristSelection';
import TimeSlots from './TimeSlots';
import WelcomeMessage from './WelcomeMessage';
import NailStyleSelection from './NailStyleSelection';
import AppointmentSummary from './AppointmentSummary';

const AppointmentBooking = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [step, setStep] = useState(1);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const { updateFormField, formData, submitAppointment, isFormValid } = useAppointment();

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirmAppointment = () => {
    const success = submitAppointment();
    if (success) {
      setShowSignupPrompt(true);
    }
  };

  const handleCreateAccount = () => {
    // Redirigir a la página de registro con los datos pre-llenados
    window.location.href = `/register?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}`;
  };

  const handleSkipSignup = () => {
    // Redirigir a una página de confirmación o a la página principal
    window.location.href = '/appointment-confirmed';
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ManicuristSelection />;
      case 2:
        return <Calendar />;
      case 3:
        return <TimeSlots />;
      case 4:
        return (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Tus Datos
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => updateFormField('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => updateFormField('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => updateFormField('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
                  <select
                    value={formData.service}
                    onChange={(e) => updateFormField('service', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  >
                    <option value="">Selecciona un servicio</option>
                    <option value="Manicure tradicional">Manicure tradicional</option>
                    <option value="Uñas acrílicas">Uñas acrílicas</option>
                    <option value="Uñas de gel">Uñas de gel</option>
                    <option value="Diseño artístico">Diseño artístico</option>
                    <option value="Uñas francesas">Uñas francesas</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return <NailStyleSelection />;
      case 6:
        return <AppointmentSummary onConfirm={handleConfirmAppointment} />;
      default:
        return null;
    }
  };

  // Modal de registro después de confirmar la cita
  const renderSignupPrompt = () => {
    if (!showSignupPrompt) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md mx-auto p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">¡Cita confirmada!</h3>
            <p className="text-gray-600 mb-6">
              Tu cita ha sido agendada correctamente. Te enviaremos un recordatorio por correo electrónico.
            </p>
            
            <div className="bg-pink-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-pink-800 mb-2">¿Te gustaría crear una cuenta?</h4>
              <p className="text-sm text-pink-700 mb-4">
                Con una cuenta podrás:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 mb-4 text-left">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Gestionar y ver el historial de tus citas
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Recibir ofertas y promociones exclusivas
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Agendar citas más rápido la próxima vez
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCreateAccount}
                className="w-full py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
              >
                Crear cuenta
              </button>
              <button
                onClick={handleSkipSignup}
                className="w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Continuar sin cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {showWelcome && <WelcomeMessage onClose={handleCloseWelcome} />}
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reserva tu Cita</h1>
        <p className="text-gray-600">Completa los siguientes pasos para agendar tu manicure</p>
      </div>
      
      {/* Indicador de pasos */}
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className={`relative flex flex-col items-center ${i <= step ? 'text-pink-600' : 'text-gray-400'}`}
            >
              <div 
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  i < step ? 'bg-pink-600 border-pink-600 text-white' :
                  i === step ? 'border-pink-600 text-pink-600' : 'border-gray-300'
                }`}
              >
                {i < step ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  i
                )}
              </div>
              <div className="absolute -bottom-6 text-xs font-medium whitespace-nowrap">
                {i === 1 && 'Manicurista'}
                {i === 2 && 'Fecha'}
                {i === 3 && 'Horario'}
                {i === 4 && 'Datos'}
                {i === 5 && 'Estilo'}
                {i === 6 && 'Confirmar'}
              </div>
            </div>
          ))}
          <div className="absolute left-0 right-0 h-0.5 bg-gray-200 top-4 -z-10">
            <div 
              className="h-full bg-pink-600 transition-all" 
              style={{ width: `${(step - 1) * 20}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="mt-12">
        {renderStep()}
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrevStep}
          disabled={step === 1}
          className={`px-6 py-2 rounded-md ${
            step === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Anterior
        </button>
        
        {step < 6 && (
          <button
            onClick={handleNextStep}
            className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Siguiente
          </button>
        )}
      </div>

      {renderSignupPrompt()}
    </div>
  );
};

export default AppointmentBooking;