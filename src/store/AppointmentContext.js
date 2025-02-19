import React, { createContext, useState, useContext } from 'react';

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
    nailStyle: null // Nuevo campo para el estilo de uñas
  });

  // Datos de manicuristas
  const manicurists = [
    {
      id: 1,
      name: "Claudia",
      specialty: "Especialista en uñas acrílicas",
      avatar: "/images/manicurists/claudia.jpg", // Reemplazar con foto real
      timeSlots: [
        { time: "09:00", available: true },
        { time: "10:00", available: false },
        { time: "11:00", available: true },
        { time: "12:00", available: true },
        { time: "13:00", available: false },
        { time: "14:00", available: true },
      ]
    },
    {
      id: 2,
      name: "Sucel",
      specialty: "Especialista en diseños artísticos",
      avatar: "/images/manicurists/sucel.jpg", // Reemplazar con foto real
      timeSlots: [
        { time: "09:00", available: false },
        { time: "10:00", available: true },
        { time: "11:00", available: true },
        { time: "12:00", available: false },
        { time: "13:00", available: true }, 
        { time: "14:00", available: false },
      ]
    }
  ];

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
           formData.nailStyle !== null; // Verificamos que se haya seleccionado un estilo
  };

  const submitAppointment = () => {
    if (!isFormValid()) return false;
    
    // Aquí iría la lógica para enviar la cita al backend
    console.log('Cita creada:', {
      manicurist: manicurists.find(m => m.id === selectedManicurist).name,
      date: selectedDate,
      timeSlot: manicurists.find(m => m.id === selectedManicurist)
                         .timeSlots[selectedTimeSlot].time,
      client: formData
    });
    
    // Resetear el formulario después de enviar
    setSelectedTimeSlot(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      nailStyle: null
    });
    
    return true;
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
      isFormValid,
      submitAppointment
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};