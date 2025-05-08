import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ClientDashboard from './components/ClientDashboard';
import ManicuristDashboard from './components/ManicuristDashboard';
import AdminDashboard from './components/AdminDashboard';
import AppointmentBooking from './components/AppointmentBooking';
import AppointmentConfirmed from './components/AppointmentConfirmed';
import { AppointmentProvider } from './store/AppointmentContext';
import Navbar from './components/Navbar';
import { getCurrentUser, checkAccess } from './utils/auth';

// Componente para proteger rutas
const ProtectedRoute = ({ children, requiredRole }) => {
  const hasAccess = checkAccess(requiredRole);
  
  if (!hasAccess) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  
  useEffect(() => {
    // Verificar autenticación inicial
    getCurrentUser();
    setInitialCheckDone(true);
  }, []);
  
  if (!initialCheckDone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <AppointmentProvider>
        <Navbar />
        
        <Routes>
          {/* Ruta principal - página de citas */}
          <Route path="/" element={<AppointmentBooking />} />
          
          {/* Ruta de confirmación de cita */}
          <Route path="/appointment-confirmed" element={<AppointmentConfirmed />} />
          
          {/* Ruta de login */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas */}
          <Route
            path="/client-dashboard/*"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/manicurist-dashboard/*"
            element={
              <ProtectedRoute requiredRole="manicurist">
                <ManicuristDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Nueva ruta para el panel de administración */}
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute requiredRole="superadmin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Ruta para 404 - página no encontrada */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-pink-600 mb-4">404</h1>
                <h2 className="text-2xl font-medium text-gray-800 mb-6">Página no encontrada</h2>
                <a 
                  href="/"
                  className="px-5 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  Volver al Inicio
                </a>
              </div>
            </div>
          } />
        </Routes>
      </AppointmentProvider>
    </BrowserRouter>
  );
}

export default App;