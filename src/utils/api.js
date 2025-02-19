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
  
  // Simula obtención de estilos de uñas predefinidos
  export const fetchNailStyles = async () => {
    // Simulamos un retraso de red
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return [
      { 
        id: 1, 
        name: 'Francesas Clásicas', 
        imageUrl: '/images/nail-styles/french-classic.jpg', 
        description: 'Elegante y minimalista',
        category: 'clásico' 
      },
      { 
        id: 2, 
        name: 'Acrílicas Decoradas', 
        imageUrl: '/images/nail-styles/acrylic-decorated.jpg', 
        description: 'Con pedrería y detalles',
        category: 'decorado' 
      },
      { 
        id: 3, 
        name: 'Efecto Mármol', 
        imageUrl: '/images/nail-styles/marble-effect.jpg', 
        description: 'Moderno y sofisticado',
        category: 'tendencia' 
      },
      { 
        id: 4, 
        name: 'Diseños Geométricos', 
        imageUrl: '/images/nail-styles/geometric-design.jpg', 
        description: 'Contemporáneo',
        category: 'artístico' 
      },
      { 
        id: 5, 
        name: 'Degradados', 
        imageUrl: '/images/nail-styles/ombre-gradient.jpg', 
        description: 'Suaves transiciones de color',
        category: 'tendencia' 
      },
      { 
        id: 6, 
        name: 'Glitter & Brillos', 
        imageUrl: '/images/nail-styles/glitter-shine.jpg', 
        description: 'Para ocasiones especiales',
        category: 'especial' 
      },
    ];
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
        !appointmentData.clientPhone ||
        !appointmentData.nailStyle) {
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
  
  // Simula subida de imagenes de referencia
  export const uploadReferenceImages = async (files) => {
    // Simulamos un retraso de red para simular la subida
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simulamos respuesta con URLs de imágenes subidas
    const uploadedUrls = files.map((_, index) => ({
      id: `img-${Date.now()}-${index}`,
      url: `https://randomuser.me/api/portraits/thumb/women/${10 + index}.jpg`,
      thumbnailUrl: `https://randomuser.me/api/portraits/thumb/women/${10 + index}.jpg`,
    }));
    
    return {
      success: true,
      uploadedFiles: uploadedUrls
    };
  };