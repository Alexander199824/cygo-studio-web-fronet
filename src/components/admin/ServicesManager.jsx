import React, { useState, useEffect } from 'react';
import { serviceApi } from '../../utils/apiService';
import { Edit, Plus, Trash2, Check, X } from 'lucide-react';

const ServicesManager = ({ onError }) => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    active: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar servicios
        const servicesData = await serviceApi.getAll();
        setServices(servicesData.services);
        
        // Cargar categorías
        const categoriesData = await serviceApi.getCategories();
        setCategories(categoriesData.categories);
      } catch (err) {
        console.error('Error al cargar servicios:', err);
        onError('Error al cargar servicios');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onError]);

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      active: true
    });
    setIsEditing(false);
  };

  const handleShowForm = (service = null) => {
    if (service) {
      setFormData({
        id: service.id,
        name: service.name,
        description: service.description || '',
        price: service.price,
        duration: service.duration,
        category: service.category || '',
        active: service.active
      });
      setIsEditing(true);
    } else {
      resetForm();
    }
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validar datos
      if (!formData.name || !formData.price || !formData.duration) {
        throw new Error('Por favor complete todos los campos obligatorios');
      }
      
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration)
      };
      
      let response;
      if (isEditing) {
        response = await serviceApi.update(formData.id, serviceData);
        
        // Actualizar servicio en la lista
        setServices(services.map(s => 
          s.id === formData.id ? response.service : s
        ));
      } else {
        response = await serviceApi.create(serviceData);
        
        // Añadir nuevo servicio a la lista
        setServices([...services, response.service]);
      }
      
      // Cerrar formulario y resetear
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error al guardar servicio:', err);
      onError(err.message || 'Error al guardar servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setLoading(true);
      await serviceApi.toggleStatus(id);
      
      // Actualizar estado local
      setServices(services.map(s => 
        s.id === id ? { ...s, active: !s.active } : s
      ));
    } catch (err) {
      console.error('Error al cambiar estado del servicio:', err);
      onError('Error al cambiar estado del servicio');
    } finally {
      setLoading(false);
    }
  };

  if (loading && services.length === 0) {
    return <div className="text-center py-10">Cargando servicios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Servicios</h2>
        <button
          onClick={() => handleShowForm()}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a385a] text-white rounded-md hover:bg-[#2c4a76] transition-colors"
        >
          <Plus size={18} />
          <span>Agregar Servicio</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">
            {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Servicio*
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
                Categoría
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                list="categories"
              />
              <datalist id="categories">
                {categories.map((category, index) => (
                  <option key={index} value={category} />
                ))}
              </datalist>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (Q)*
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (minutos)*
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="15"
                step="15"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#1a385a] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm">Servicio activo</span>
              </label>
            </div>
            
            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
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
                Servicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duración
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
            {services.map(service => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{service.name}</div>
                  <div className="text-xs text-gray-500">{service.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {service.category ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {service.category}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Q{service.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{service.duration} min</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    service.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleStatus(service.id)}
                    className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${
                      service.active
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {service.active ? (
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
                  <button
                    onClick={() => handleShowForm(service)}
                    className="inline-flex items-center ml-2 px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit size={14} className="mr-1" />
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesManager;