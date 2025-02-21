// Usuarios de demo
const demoUsers = [
    { username: 'claudia', password: 'claudia123', role: 'manicurist', name: 'Claudia García', id: 1 },
    { username: 'sucel', password: 'sucel123', role: 'manicurist', name: 'Sucel Pérez', id: 2 },
    { username: 'maria', password: 'maria123', role: 'client', name: 'María Rodríguez', id: 101 },
    { username: 'ana', password: 'ana123', role: 'client', name: 'Ana López', id: 102 },
    { username: 'daniela', password: 'daniela123', role: 'client', name: 'Daniela Torres', id: 103 }
  ];
  
  // Verificar credenciales (simulando una API)
  export const loginUser = (username, password) => {
    return new Promise((resolve, reject) => {
      // Simular latencia de red
      setTimeout(() => {
        const user = demoUsers.find(
          user => user.username === username && user.password === password
        );
  
        if (user) {
          // Crear una copia sin la contraseña para almacenar en sessionStorage
          const { password, ...safeUserData } = user;
          
          // Almacenar datos del usuario en sessionStorage
          sessionStorage.setItem('currentUser', JSON.stringify(safeUserData));
          
          resolve(safeUserData);
        } else {
          reject(new Error('Usuario o contraseña incorrectos'));
        }
      }, 800);
    });
  };
  
  // Obtener el usuario actual desde sessionStorage
  export const getCurrentUser = () => {
    const userStr = sessionStorage.getItem('currentUser');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error al analizar datos de usuario:', error);
      return null;
    }
  };
  
  // Cerrar sesión
  export const logoutUser = () => {
    sessionStorage.removeItem('currentUser');
    
    // Redireccionar a la página de login
    window.location.href = '/login';
  };
  
  // Verificar si el usuario tiene acceso a una ruta específica
  export const checkAccess = (requiredRole) => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      return false;
    }
    
    if (!requiredRole) {
      return true; // Si no se requiere un rol específico, cualquier usuario autenticado tiene acceso
    }
    
    return currentUser.role === requiredRole;
  };
  
  // Redireccionar según el rol del usuario
  export const redirectByRole = () => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
    
    if (currentUser.role === 'client') {
      window.location.href = '/client-dashboard';
    } else if (currentUser.role === 'manicurist') {
      window.location.href = '/manicurist-dashboard';
    } else {
      // Rol desconocido o no válido
      logoutUser();
    }
  };