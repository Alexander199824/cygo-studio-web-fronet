import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const AppointmentContext = createContext();

export const useAppointment = () => useContext(AppointmentContext);

export const AppointmentProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedManicurist, setSelectedManicurist] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    nailStyle: null
  });
  const [manicurists, setManicurists] = useState([]);
  const [services, setServices] = useState([]);
  const [nailStyles, setNailStyles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para hacer peticiones autenticadas
  const authFetch = async (url, options = {}) => {
    const token = getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la petición');
    }
    
    return response.json();
  };

  // Cargar manicuristas activos
  useEffect(() => {
    const fetchManicurists = async () => {
      try {
        setLoading(true);
        const data = await authFetch(`${API_URL}/manicurists?active=true`);
        
        // Transformar datos para el formato esperado por los componentes
        const transformedManicurists = data.manicurists.map(m => ({
          id: m.id,
          name: m.user.name,
          specialty: m.specialty,
          avatar: m.user.profileImage || '/images/manicurists/default.jpg',
          timeSlots: [] // Se cargará al seleccionar un manicurista
        }));
        
        setManicurists(transformedManicurists);
        setError(null);
      } catch (error) {
        console.error('Error al cargar manicuristas:', error);
        setError('No se pudieron cargar los manicuristas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchManicurists();
  }, []);

  // Cargar servicios activos
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await authFetch(`${API_URL}/services?active=true`);
        setServices(data.services);
        setError(null);
      } catch (error) {
        console.error('Error al cargar servicios:', error);
        setError('No se pudieron cargar los servicios');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  // Cargar disponibilidad del manicurista seleccionado
  useEffect(() => {
    if (!selectedManicurist) return;
    
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        
        // Formatear fecha para la API
        const formattedDate = selectedDate.toISOString().split('T')[0];
        
        const data = await authFetch(
          `${API_URL}/availability/manicurist/${selectedManicurist}?date=${formattedDate}`
        );
        
        // Transformar los datos para el formato esperado
        const timeSlots = [];
        
        // Filtrar y transformar horarios disponibles
        if (data.availabilities && data.availabilities.length > 0) {
          data.availabilities.forEach(avail => {
            if (avail.isAvailable) {
              const startTime = new Date(`2000-01-01T${avail.startTime}`);
              const endTime = new Date(`2000-01-01T${avail.endTime}`);
              
              // Crear slots de 1 hora entre startTime y endTime
              while (startTime < endTime) {
                const timeStr = startTime.toTimeString().substring(0, 5);
                
                // Verificar si ya hay una cita en ese horario
                const hasAppointment = data.appointments && data.appointments.some(apt => {
                  const aptTime = apt.startTime.substring(0, 5);
                  return aptTime === timeStr;
                });
                
                timeSlots.push({
                  time: timeStr,
                  available: !hasAppointment
                });
                
                startTime.setMinutes(startTime.getMinutes() + 60);
              }
            }
          });
        }
        
        // Actualizar manicuristas con slots de tiempo
        setManicurists(prev => 
          prev.map(m => 
            m.id === selectedManicurist 
              ? { ...m, timeSlots } 
              : m
          )
        );
        
        setError(null);
      } catch (error) {
        console.error('Error al cargar disponibilidad:', error);
        setError('No se pudo cargar la disponibilidad');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailability();
  }, [selectedManicurist, selectedDate]);

  // Cargar estilos de uñas para el servicio seleccionado
  useEffect(() => {
    if (!formData.service) return;
    
    const fetchNailStyles = async () => {
      try {
        setLoading(true);
        const data = await authFetch(`${API_URL}/nail-styles?serviceId=${formData.service}&active=true`);
        setNailStyles(data.nailStyles);
        setError(null);
      } catch (error) {
        console.error('Error al cargar estilos de uñas:', error);
        setError('No se pudieron cargar los estilos de uñas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNailStyles();
  }, [formData.service]);

  const updateFormField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return selectedManicurist && 
           selectedTimeSlot !== null && 
           formData.name.trim() !== '' && 
           formData.email.trim() !== '' && 
           formData.phone.trim() !== '' &&
           formData.service &&
           formData.nailStyle !== null;
  };

  // Enviar datos de la cita a la API
  const submitAppointment = async () => {
    if (!isFormValid()) return false;
    
    try {
      setLoading(true);
      
      const manicurist = manicurists.find(m => m.id === selectedManicurist);
      const timeSlot = manicurist.timeSlots[selectedTimeSlot];
      
      // Preparar datos para la API
      const appointmentData = {
        manicuristId: selectedManicurist,
        serviceId: parseInt(formData.service),
        nailStyleId: formData.nailStyle ? 
                    (formData.nailStyle.type === 'predefined' ? formData.nailStyle.id : null) : null,
        date: selectedDate.toISOString().split('T')[0],
        startTime: timeSlot.time + ':00',
        customRequests: formData.customRequests || '',
        referenceImages: formData.nailStyle && formData.nailStyle.type === 'custom' ? 
                        formData.nailStyle.fileIds : []
      };
      
      // Si el usuario está autenticado, usar su ID
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      if (currentUser && currentUser.role === 'client') {
        appointmentData.clientId = currentUser.id;
      } else {
        // Para usuarios no autenticados, enviar datos de cliente
        // La API creará un usuario temporal o asociará con uno existente
        appointmentData.clientData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        };
      }
      
      // Enviar a la API
      await authFetch(`${API_URL}/appointments`, {
        method: 'POST',
        body: JSON.stringify(appointmentData)
      });
      
      // Resetear el formulario
      setSelectedTimeSlot(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        nailStyle: null
      });
      
      setError(null);
      return true;
    } catch (error) {
      console.error('Error al crear cita:', error);
      setError('No se pudo crear la cita: ' + error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppointmentContext.Provider value={{
      selectedDate,
      setSelectedDate,
      selectedManicurist,
      setSelectedManicurist,
      selectedTimeSlot,
      setSelectedTimeSlot,
      formData,
      updateFormField,
      manicurists,
      services,
      nailStyles,
      loading,
      error,
      isFormValid,
      submitAppointment
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};