import React from 'react';
import { Link } from 'react-router-dom';

const AppointmentConfirmed = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ¡Cita Confirmada!
          </h2>
          
          <p className="mt-2 text-center text-sm text-gray-600">
            Tu cita ha sido agendada exitosamente. Hemos enviado los detalles a tu correo electrónico.
          </p>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-md mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Detalles de tu Cita:</h3>
          <div className="space-y-2 text-sm text-gray-500">
            <p>
              Si necesitas modificar o cancelar tu cita, por favor contáctanos telefónicamente 
              al menos 24 horas antes de tu cita programada.
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col gap-3">
          <Link 
            to="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a385a] hover:bg-[#2c4a76] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a385a]"
          >
            Volver al Inicio
          </Link>
          
          <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a385a]"
            onClick={() => window.print()}
          >
            Imprimir Confirmación
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            ¿Te gustaría crear una cuenta para gestionar tus citas fácilmente?
          </p>
          <Link 
            to="/register"
            className="text-[#1a385a] hover:text-[#2c4a76] font-medium"
          >
            Crear cuenta ahora →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmed;