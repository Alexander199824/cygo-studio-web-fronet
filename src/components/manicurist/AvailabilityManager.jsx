import React, { useState, useEffect } from 'react';
import { availabilityApi } from '../../utils/apiService';

const AvailabilityManager = ({ manicuristId }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    isRecurring: true,
    dayOfWeek: 1, // Lunes por defecto
    specificDate: '',
    startTime: '09:00',
    endTime: '18:00',
    isAvailable: true
  });

  // Días de la semana
  const weekDays = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const response = await availabilityApi.getManicuristAvailability(manicuristId);
        setAvailabilities(response.availabilities);
      } catch (err) {
        console.error('Error al cargar disponibilidad:', err);
        setError('No se pudo cargar la disponibilidad');
      } finally {
        setLoading(false);
      }
    };

    if (manicuristId) {
      fetchAvailability();
    }
  }, [manicuristId]);

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
      
      // Preparar datos para la API
      const availabilityData = {
        ...formData,
        manicuristId,
        dayOfWeek: formData.isRecurring ? parseInt(formData.dayOfWeek) : null,
        specificDate: !formData.isRecurring ? formData.specificDate : null
      };
      
      const response = await availabilityApi.create(availabilityData);
      
      // Actualizar estado
      setAvailabilities([...availabilities, response.availability]);
      setShowAddForm(false);
      resetForm();
    } catch (err) {
      console.error('Error al crear disponibilidad:', err);
      setError('No se pudo crear la disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta disponibilidad?')) {
      return;
    }
    
    try {
      setLoading(true);
      await availabilityApi.delete(id);
      
      // Actualizar estado
      setAvailabilities(availabilities.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error al eliminar disponibilidad:', err);
      setError('No se pudo eliminar la disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      isRecurring: true,
      dayOfWeek: 1,
      specificDate: '',
      startTime: '09:00',
      endTime: '18:00',
      isAvailable: true
    });
  };

  if (loading && availabilities.length === 0) {
    return <div className="text-center py-10">Cargando disponibilidad...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Disponibilidad</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-[#1a385a] text-white rounded-md hover:bg-[#2c4a76] transition-colors"
        >
          {showAddForm ? 'Cancelar' : 'Agregar Disponibilidad'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
          <button 
            className="ml-2 text-sm underline"
            onClick={() => setError(null)}
          >
            Cerrar
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Nueva Disponibilidad</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Disponibilidad
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isRecurring"
                      checked={formData.isRecurring}
                      onChange={() => setFormData({...formData, isRecurring: true})}
                      className="h-4 w-4 text-[#1a385a]"
                    />
                    <span className="ml-2">Recurrente (Semanal)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isRecurring"
                      checked={!formData.isRecurring}
                      onChange={() => setFormData({...formData, isRecurring: false})}
                      className="h-4 w-4 text-[#1a385a]"
                    />
                    <span className="ml-2">Fecha Específica</span>
                  </label>
                </div>
              </div>

              {formData.isRecurring ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Día de la Semana
                  </label>
                  <select
                    name="dayOfWeek"
                    value={formData.dayOfWeek}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                  >
                    {weekDays.map((day, index) => (
                      <option key={index} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Específica
                  </label>
                  <input
                    type="date"
                    name="specificDate"
                    value={formData.specificDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                    required={!formData.isRecurring}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Fin
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#1a385a]"
                  />
                  <span className="ml-2">Disponible para citas</span>
                </label>
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
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-lg font-medium">Horarios Recurrentes</h3>
        {availabilities.filter(a => a.isRecurring).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availabilities
              .filter(a => a.isRecurring)
              .map(availability => (
                <div 
                  key={availability.id} 
                  className={`p-4 rounded-lg border ${availability.isAvailable 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{weekDays[availability.dayOfWeek]}</h4>
                      <p className="text-sm text-gray-600">
                        {availability.startTime.substring(0, 5)} - {availability.endTime.substring(0, 5)}
                      </p>
                      <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                        availability.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {availability.isAvailable ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(availability.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 py-4">No hay horarios recurrentes configurados.</p>
        )}

        <h3 className="text-lg font-medium mt-8">Fechas Específicas</h3>
        {availabilities.filter(a => !a.isRecurring).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availabilities
              .filter(a => !a.isRecurring)
              .map(availability => (
                <div 
                  key={availability.id} 
                  className={`p-4 rounded-lg border ${availability.isAvailable 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {new Date(availability.specificDate).toLocaleDateString()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {availability.startTime.substring(0, 5)} - {availability.endTime.substring(0, 5)}
                      </p>
                      <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                        availability.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {availability.isAvailable ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(availability.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 py-4">No hay fechas específicas configuradas.</p>
        )}
      </div>
    </div>
  );
};

export default AvailabilityManager;