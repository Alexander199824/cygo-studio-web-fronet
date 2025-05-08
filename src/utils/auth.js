// Reemplazar el archivo completo con esta implementación
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Verificar credenciales (usando la API real)
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error de autenticación');
    }

    const data = await response.json();
    
    // Almacenar token y datos del usuario en sessionStorage
    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('currentUser', JSON.stringify(data.user));
    
    return data.user;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Registrar nuevo usuario
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al registrar usuario');
    }

    const data = await response.json();
    
    // Almacenar token y datos del usuario
    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('currentUser', JSON.stringify(data.user));
    
    return data.user;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// Obtener el usuario actual desde sessionStorage
export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem('currentUser');
  const token = sessionStorage.getItem('authToken');
  
  if (!userStr || !token) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error al analizar datos de usuario:', error);
    return null;
  }
};

// Obtener token de autenticación
export const getAuthToken = () => {
  return sessionStorage.getItem('authToken');
};

// Cerrar sesión
export const logoutUser = () => {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('currentUser');
  
  // Redireccionar a la página de login
  window.location.href = '/login';
};

// Verificar si el usuario tiene acceso a una ruta específica
export const checkAccess = (requiredRole) => {
  const currentUser = getCurrentUser();
  const token = getAuthToken();
  
  if (!currentUser || !token) {
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
  
  if (currentUser.role === 'superadmin') {
    window.location.href = '/admin-dashboard';
  } else if (currentUser.role === 'client') {
    window.location.href = '/client-dashboard';
  } else if (currentUser.role === 'manicurist') {
    window.location.href = '/manicurist-dashboard';
  } else {
    // Rol desconocido o no válido
    logoutUser();
  }
};