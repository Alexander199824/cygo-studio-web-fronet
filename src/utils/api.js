/**
 * Simulación de API para interactuar con el backend
 */

// Simula obtención de manicuristas
export const fetchManicurists = async () => {
    // Simulamos un retraso de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 1,
        name: "Ana",
        specialty: "Especialista en uñas acrílicas",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
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
        name: "Carmen",
        specialty: "Especialista en diseños artísticos",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
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
  };
  
  // Simula obtención de horarios disponibles para una fecha y manicurista
  export const fetchAvailableSlots = async (manicuristId, date) => {
    // Simulamos un retraso de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const manicurists = await fetchManicurists();
    const manicurist = manicurists.find(m => m.id === manicuristId);
    
    if (!manicurist) {
      throw new Error('Manicurista no encontrada');
    }
    
    // En una aplicación real, aquí consultaríamos la disponibilidad real para la fecha
    return manicurist.timeSlots;
  };
  
  // Simula creación de una cita
  export const createAppointment = async (appointmentData) => {
    // Simulamos un retraso de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulamos validación
    if (!appointmentData.manicuristId || 
        !appointmentData.date ||
        !appointmentData.timeSlot ||
        !appointmentData.clientName ||
        !appointmentData.clientPhone) {
      throw new Error('Datos de cita incompletos');
    }
    
    // En una aplicación real, aquí enviaríamos los datos al servidor
    return {
      id: Math.floor(Math.random() * 10000),
      status: 'confirmed',
      ...appointmentData,
      createdAt: new Date().toISOString()
    };
  };
  
  // Simula envío de confirmación por correo
  export const sendConfirmationEmail = async (appointmentId, email) => {
    // Simulamos un retraso de red
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // En una aplicación real, aquí enviaríamos el correo de confirmación
    return {
      sent: true,
      to: email,
      appointmentId
    };
  };