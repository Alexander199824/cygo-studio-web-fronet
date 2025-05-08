import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { manicuristApi, userApi } from '../../utils/apiService';
import { Edit, Check, X, UserPlus } from 'lucide-react';

const ManicuristsManager = ({ onError }) => {
  const [manicurists, setManicurists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    specialty: '',
    biography: ''
  });

  useEffect(() => {
    const fetchManicurists = async () => {
      try {
        setLoading(true);
        const data = await manicuristApi.getAll();
        
        // Verificar la estructura de datos
        if (data && data.manicurists) {
          setManicurists(data.manicurists);
        } else if (Array.isArray(data)) {
          // Adaptación si la API devuelve directamente un array
          setManicurists(data);
        } else {
          console.warn('Formato de respuesta inesperado:', data);
          setManicurists([]);
        }
      } catch (err) {
        console.error('Error al cargar manicuristas:', err);
        onError(err.message || 'No se pudieron cargar las manicuristas');
      } finally {
        setLoading(false);
      }
    };

    fetchManicurists();
  }, [onError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Registrar nuevo usuario con rol de manicurista
      const userData = {
        ...formData,
        role: 'manicurist'
      };
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar manicurista');
      }
      
      // Recargar lista de manicuristas
      const data = await manicuristApi.getAll();
      if (data && data.manicurists) {
        setManicurists(data.manicurists);
      } else if (Array.isArray(data)) {
        setManicurists(data);
      }
      
      // Limpiar formulario
      setShowAddForm(false);
      setFormData({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        specialty: '',
        biography: ''
      });
    } catch (err) {
      console.error('Error al registrar manicurista:', err);
      onError(err.message || 'Error al registrar manicurista');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setLoading(true);
      await manicuristApi.toggleStatus(id);
      
      // Actualizar estado local
      setManicurists(manicurists.map(m => 
        m.id === id ? { ...m, active: !m.active } : m
      ));
    } catch (err) {
      console.error('Error al cambiar estado de manicurista:', err);
      onError(err.message || 'Error al cambiar estado de manicurista');
    } finally {
      setLoading(false);
    }
  };

  if (loading && manicurists.length === 0) {
    return <div className="text-center py-10">Cargando manicuristas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Manicuristas</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a385a] text-white rounded-md hover:bg-[#2c4a76] transition-colors"
        >
          <UserPlus size={18} />
          <span>{showAddForm ? 'Cancelar' : 'Agregar Manicurista'}</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Nueva Manicurista</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de Usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biografía
              </label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
              ></textarea>
            </div>
            
            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#1a385a] text-white rounded-md hover:bg-[#2c4a76] transition-colors"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Manicurista
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calificación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {manicurists.map(manicurist => (
              <tr key={manicurist.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-full" 
                        src={(manicurist.user?.profileImage || manicurist.profileImage) || '/images/manicurists/default.jpg'} 
                        alt={manicurist.user?.name || manicurist.name || 'Manicurista'}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {manicurist.user?.name || manicurist.name || 'Nombre no disponible'}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{manicurist.user?.username || manicurist.username || 'Sin usuario'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{manicurist.user?.email || manicurist.email || 'Sin email'}</div>
                  <div className="text-sm text-gray-500">{manicurist.user?.phone || manicurist.phone || 'Sin teléfono'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{manicurist.specialty || 'Sin especialidad'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900 mr-2">
                      {manicurist.rating ? manicurist.rating.toFixed(1) : 'N/A'}
                    </span>
                    {manicurist.rating > 0 && (
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ${i < Math.round(manicurist.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {manicurist.reviewCount || 0} reseñas
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    manicurist.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {manicurist.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleStatus(manicurist.id)}
                    className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                      manicurist.active
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {manicurist.active ? (
                      <>
                        <X size={14} className="mr-1" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <Check size={14} className="mr-1" />
                        Activar
                      </>
                    )}
                  </button>
                  
                  <Link
                    to={`/admin-dashboard/manicurists/${manicurist.id}`}
                    className="inline-flex items-center ml-2 px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit size={14} className="mr-1" />
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManicuristsManager;