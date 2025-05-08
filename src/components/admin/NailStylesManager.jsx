import React, { useState, useEffect } from 'react';
import { nailStyleApi, serviceApi } from '../../utils/apiService';
import { Edit, Plus, Image, Check, X } from 'lucide-react';

const NailStylesManager = ({ onError }) => {
  const [nailStyles, setNailStyles] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    category: '',
    serviceId: '',
    manicuristId: null,
    active: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar estilos de uñas
        const stylesData = await nailStyleApi.getAll();
        setNailStyles(stylesData.nailStyles);
        
        // Cargar servicios para el selector
        const servicesData = await serviceApi.getAll({ active: true });
        setServices(servicesData.services);
        
        // Cargar categorías
        const categoriesData = await nailStyleApi.getCategories();
        setCategories(categoriesData.categories);
      } catch (err) {
        console.error('Error al cargar estilos de uñas:', err);
        onError('Error al cargar estilos de uñas');
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
      category: '',
      serviceId: '',
      manicuristId: null,
      active: true
    });
    setSelectedImage(null);
    setImagePreview('');
    setIsEditing(false);
  };

  const handleShowForm = (style = null) => {
    if (style) {
      setFormData({
        id: style.id,
        name: style.name,
        description: style.description || '',
        category: style.category || '',
        serviceId: style.serviceId,
        manicuristId: style.manicuristId,
        active: style.active
      });
      
      // Si tiene imagen, mostrar preview
      if (style.hasImage) {
        setImagePreview(`/api/nail-styles/${style.id}/image`);
      } else if (style.imageUrl) {
        setImagePreview(style.imageUrl);
      } else {
        setImagePreview('');
      }
      
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validar datos
      if (!formData.name || !formData.serviceId || !formData.category) {
        throw new Error('Por favor complete todos los campos obligatorios');
      }
      
      // Crear FormData para enviar la imagen
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      formDataObj.append('category', formData.category);
      formDataObj.append('serviceId', formData.serviceId);
      formDataObj.append('active', formData.active);
      
      if (formData.manicuristId) {
        formDataObj.append('manicuristId', formData.manicuristId);
      }
      
      if (selectedImage) {
        formDataObj.append('image', selectedImage);
      }
      
      let response;
      if (isEditing) {
        response = await nailStyleApi.update(formData.id, formDataObj);
        
        // Actualizar estilo en la lista
        setNailStyles(nailStyles.map(s => 
          s.id === formData.id ? response.nailStyle : s
        ));
      } else {
        response = await nailStyleApi.create(formDataObj);
        
        // Añadir nuevo estilo a la lista
        setNailStyles([...nailStyles, response.nailStyle]);
      }
      
      // Cerrar formulario y resetear
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error al guardar estilo de uñas:', err);
      onError(err.message || 'Error al guardar estilo de uñas');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setLoading(true);
      await nailStyleApi.toggleStatus(id);
      
      // Actualizar estado local
      setNailStyles(nailStyles.map(s => 
        s.id === id ? { ...s, active: !s.active } : s
      ));
    } catch (err) {
      console.error('Error al cambiar estado del estilo:', err);
      onError('Error al cambiar estado del estilo');
    } finally {
      setLoading(false);
    }
  };

  if (loading && nailStyles.length === 0) {
    return <div className="text-center py-10">Cargando estilos de uñas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestión de Estilos de Uñas</h2>
        <button
          onClick={() => handleShowForm()}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a385a] text-white rounded-md hover:bg-[#2c4a76] transition-colors"
        >
          <Plus size={18} />
          <span>Agregar Estilo</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">
            {isEditing ? 'Editar Estilo de Uñas' : 'Nuevo Estilo de Uñas'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Estilo*
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
                Servicio*
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                required
              >
                <option value="">Seleccionar servicio</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría*
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                list="style-categories"
                required
              />
              <datalist id="style-categories">
                {categories.map((category, index) => (
                  <option key={index} value={category} />
                ))}
              </datalist>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen
              </label>
              <div className="flex items-start space-x-5">
                <div className="flex-grow">
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-[#1a385a] hover:text-[#2c4a76]"
                        >
                          <span>Seleccionar archivo</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 2MB</p>
                    </div>
                  </div>
                </div>
                
                {imagePreview && (
                  <div className="w-40 h-40 relative">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview('');
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
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
                <span className="ml-2 text-sm">Estilo activo</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nailStyles.map(style => (
          <div 
            key={style.id} 
            className={`bg-white rounded-lg overflow-hidden border ${style.active ? 'border-gray-200' : 'border-red-200 opacity-60'}`}
          >
            <div className="h-48 relative bg-gray-100">
              {(style.hasImage || style.imageUrl) ? (
                <img
                  src={style.hasImage ? `/api/nail-styles/${style.id}/image` : style.imageUrl}
                  alt={style.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Image size={48} />
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleToggleStatus(style.id)}
                  className={`p-1 rounded-full ${
                    style.active
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {style.active ? <X size={16} /> : <Check size={16} />}
                </button>
                <button
                  onClick={() => handleShowForm(style)}
                  className="p-1 rounded-full bg-white text-gray-600 hover:bg-gray-100"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{style.name}</h3>
                  <span className="text-sm text-gray-500">{style.service?.name || 'Sin servicio'}</span>
                </div>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {style.category}
                </span>
              </div>
              {style.description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{style.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NailStylesManager;