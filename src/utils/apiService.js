import { getAuthToken } from './auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Función centralizada para hacer peticiones autenticadas
export const fetchApi = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error en la petición');
  }
  
  return response.json();
};

// API de Manicuristas
export const manicuristApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetchApi(`/manicurists${queryParams ? `?${queryParams}` : ''}`);
  },
  getById: (id) => fetchApi(`/manicurists/${id}`),
  update: (id, data) => fetchApi(`/manicurists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  toggleStatus: (id) => fetchApi(`/manicurists/${id}/status`, {
    method: 'PATCH'
  }),
  getServices: (id) => fetchApi(`/manicurists/${id}/services`),
  assignService: (id, serviceId, price) => fetchApi(`/manicurists/${id}/services`, {
    method: 'POST',
    body: JSON.stringify({ serviceId, price })
  }),
  removeService: (id, serviceId) => fetchApi(`/manicurists/${id}/services/${serviceId}`, {
    method: 'DELETE'
  })
};

// API de Servicios
export const serviceApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetchApi(`/services${queryParams ? `?${queryParams}` : ''}`);
  },
  getById: (id) => fetchApi(`/services/${id}`),
  create: (data) => fetchApi('/services', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetchApi(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  toggleStatus: (id) => fetchApi(`/services/${id}/status`, {
    method: 'PATCH'
  }),
  getCategories: () => fetchApi('/services/categories')
};

// API de Estilos de Uñas
export const nailStyleApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetchApi(`/nail-styles${queryParams ? `?${queryParams}` : ''}`);
  },
  getById: (id) => fetchApi(`/nail-styles/${id}`),
  create: (formData) => {
    // Esta petición usa FormData para enviar archivos
    return fetch(`${API_URL}/nail-styles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    }).then(response => {
      if (!response.ok) {
        throw new Error('Error al crear estilo de uñas');
      }
      return response.json();
    });
  },
  update: (id, formData) => {
    // Esta petición usa FormData para enviar archivos
    return fetch(`${API_URL}/nail-styles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    }).then(response => {
      if (!response.ok) {
        throw new Error('Error al actualizar estilo de uñas');
      }
      return response.json();
    });
  },
  toggleStatus: (id) => fetchApi(`/nail-styles/${id}/status`, {
    method: 'PATCH'
  }),
  getCategories: () => fetchApi('/nail-styles/categories')
};

// API de Citas
export const appointmentApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetchApi(`/appointments${queryParams ? `?${queryParams}` : ''}`);
  },
  getById: (id) => fetchApi(`/appointments/${id}`),
  create: (data) => fetchApi('/appointments', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetchApi(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  updateStatus: (id, status) => fetchApi(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  rate: (id, rating, review) => fetchApi(`/appointments/${id}/rate`, {
    method: 'PATCH',
    body: JSON.stringify({ rating, review })
  }),
  addNote: (id, note) => fetchApi(`/appointments/${id}/manicurist-note`, {
    method: 'PATCH',
    body: JSON.stringify({ note })
  }),
  sendReminder: (id) => fetchApi(`/appointments/${id}/send-reminder`, {
    method: 'POST'
  })
};

// API de Disponibilidad
export const availabilityApi = {
  getManicuristAvailability: (manicuristId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetchApi(`/availability/manicurist/${manicuristId}${queryParams ? `?${queryParams}` : ''}`);
  },
  create: (data) => fetchApi('/availability', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetchApi(`/availability/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => fetchApi(`/availability/${id}`, {
    method: 'DELETE'
  })
};

// API de Reseñas
export const reviewApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetchApi(`/reviews${queryParams ? `?${queryParams}` : ''}`);
  },
  getById: (id) => fetchApi(`/reviews/${id}`),
  create: (data) => fetchApi('/reviews', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetchApi(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  toggleApproval: (id) => fetchApi(`/reviews/${id}/approve`, {
    method: 'PATCH'
  })
};

// API de Pagos
export const paymentApi = {
  getByAppointment: (appointmentId) => fetchApi(`/payments/appointment/${appointmentId}`),
  create: (data) => fetchApi('/payments', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateStatus: (id, status) => fetchApi(`/payments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
};

// API de Usuarios
export const userApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return fetchApi(`/users${queryParams ? `?${queryParams}` : ''}`);
  },
  getById: (id) => fetchApi(`/users/${id}`),
  update: (id, formData) => {
    // Esta petición puede usar FormData para la imagen de perfil
    if (formData instanceof FormData) {
      return fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      }).then(response => {
        if (!response.ok) {
          throw new Error('Error al actualizar usuario');
        }
        return response.json();
      });
    } else {
      return fetchApi(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
    }
  },
  toggleStatus: (id) => fetchApi(`/users/${id}/status`, {
    method: 'PATCH'
  }),
  changeRole: (id, role) => fetchApi(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role })
  })
};