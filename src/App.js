import React, { useState, useEffect } from 'react';
import { AppointmentProvider } from './store/AppointmentContext';
import Navbar from './components/Navbar';
import WelcomeMessage from './components/WelcomeMessage';
import Calendar from './components/Calendar';
import ManicuristSelection from './components/ManicuristSelection';
import TimeSlots from './components/TimeSlots';
import NailStyleSelection from './components/NailStyleSelection';
import AppointmentForm from './components/AppointmentForm';

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

  // Detectar cambio de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Renderizado condicional basado en vista móvil o escritorio
  const renderContent = () => {
    if (isMobileView) {
      // Vista móvil: mostrar componentes según el paso actual
      return (
        <div className="space-y-6">
          {currentStep === 1 && (
            <>
              <Calendar />
              <ManicuristSelection />
              <button 
                onClick={() => setCurrentStep(2)}
                className="w-full py-3 bg-pink-600 text-white rounded-md"
              >
                Continuar
              </button>
            </>
          )}
          
          {currentStep === 2 && (
            <>
              <TimeSlots />
              <NailStyleSelection />
              <div className="flex space-x-4">
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-md"
                >
                  Atrás
                </button>
                <button 
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 py-3 bg-pink-600 text-white rounded-md"
                >
                  Continuar
                </button>
              </div>
            </>
          )}
          
          {currentStep === 3 && (
            <>
              <AppointmentForm />
              <button 
                onClick={() => setCurrentStep(2)}
                className="w-full py-3 bg-gray-200 text-gray-800 rounded-md mt-4"
              >
                Atrás
              </button>
            </>
          )}
        </div>
      );
    } else {
      // Vista de escritorio: diseño más elegante de dos columnas
      return (
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 lg:order-2">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <ManicuristSelection />
                <Calendar />
              </div>
              <div className="space-y-6">
                <TimeSlots />
                <NailStyleSelection />
              </div>
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-4 lg:order-1">
            <div className="sticky top-24">
              <AppointmentForm />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <AppointmentProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          {showWelcome && (
            <WelcomeMessage onClose={() => setShowWelcome(false)} />
          )}
          
          {renderContent()}
        </div>
      </div>
    </AppointmentProvider>
  );
};

export default App;