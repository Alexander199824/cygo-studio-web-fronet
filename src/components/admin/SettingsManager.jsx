import React, { useState, useEffect } from 'react';
import { userApi } from '../../utils/apiService';
import { Settings } from 'lucide-react';

const SettingsManager = ({ onError }) => {
  const [settings, setSettings] = useState({
    siteTitle: 'Cygo Studio',
    siteDescription: 'Estudio de manicure profesional',
    contactEmail: 'contacto@cygostudio.com',
    contactPhone: '+502 12345678',
    address: 'Ciudad de Guatemala, Guatemala',
    enableNotifications: true,
    enableReminders: true,
    paymentMethods: {
      cash: true,
      card: true,
      transfer: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // En una implementación real, cargarías la configuración desde el backend
    const loadSettings = async () => {
      try {
        setLoading(true);
        // Simular carga de configuración
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error('Error al cargar configuración:', err);
        onError('Error al cargar la configuración');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [onError]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error al guardar configuración:', err);
      onError('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Configuración del Sistema</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Información del Sitio</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio
              </label>
              <input
                type="text"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email de Contacto
              </label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a385a]"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Notificaciones</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableNotifications"
                name="enableNotifications"
                checked={settings.enableNotifications}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#1a385a] border-gray-300 rounded"
              />
              <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-700">
                Activar notificaciones por correo electrónico
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableReminders"
                name="enableReminders"
                checked={settings.enableReminders}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#1a385a] border-gray-300 rounded"
              />
              <label htmlFor="enableReminders" className="ml-2 block text-sm text-gray-700">
                Enviar recordatorios automáticos de citas
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Métodos de Pago</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="paymentMethods.cash"
                name="paymentMethods.cash"
                checked={settings.paymentMethods.cash}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#1a385a] border-gray-300 rounded"
              />
              <label htmlFor="paymentMethods.cash" className="ml-2 block text-sm text-gray-700">
                Efectivo
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="paymentMethods.card"
                name="paymentMethods.card"
                checked={settings.paymentMethods.card}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#1a385a] border-gray-300 rounded"
              />
              <label htmlFor="paymentMethods.card" className="ml-2 block text-sm text-gray-700">
                Tarjeta de crédito/débito
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="paymentMethods.transfer"
                name="paymentMethods.transfer"
                checked={settings.paymentMethods.transfer}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#1a385a] border-gray-300 rounded"
              />
              <label htmlFor="paymentMethods.transfer" className="ml-2 block text-sm text-gray-700">
                Transferencia bancaria
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          {saved && (
            <div className="mr-4 flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Configuración guardada
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#1a385a] text-white rounded-md hover:bg-[#2c4a76] transition-colors"
          >
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;