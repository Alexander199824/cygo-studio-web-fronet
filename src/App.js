import React, { useState } from 'react';
import { AppointmentProvider } from './store/AppointmentContext';
import Navbar from './components/Navbar';
import WelcomeMessage from './components/WelcomeMessage';
import ManicuristSelection from './components/ManicuristSelection';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import AppointmentForm from './components/AppointmentForm';
import './styles/index.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <AppointmentProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          {showWelcome && (
            <WelcomeMessage onClose={() => setShowWelcome(false)} />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ManicuristSelection />
            <Calendar />
            <TimeSlots />
          </div>
          
          <AppointmentForm />
        </div>
      </div>
    </AppointmentProvider>
  );
}

export default App;