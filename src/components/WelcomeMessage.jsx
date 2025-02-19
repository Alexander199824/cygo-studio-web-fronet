import React from 'react';

const WelcomeMessage = ({ onClose }) => {
  return (
    <div className="bg-white p-4 mb-6 rounded-lg border border-gray-200 shadow-sm welcome-alert">
      <div className="text-lg font-semibold mb-2">¡Bienvenida a Cygo Studio! 👋</div>
      <div className="mt-2">
        <p className="mb-2">Para reservar tu cita, sigue estos pasos:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Elige a tu manicurista preferida</li>
          <li>Selecciona la fecha deseada en el calendario</li>
          <li>Escoge un horario disponible de tu manicurista</li>
          <li>Completa tus datos y ¡listo!</li>
        </ol>
        <button 
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default WelcomeMessage;