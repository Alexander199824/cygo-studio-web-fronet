import React, { useState, useEffect } from 'react';
import { useAppointment } from '../store/AppointmentContext';
import { fetchNailStyles, uploadReferenceImages } from '../utils/apiService';
import { isValidImage, isValidImageSize, formatFileSize } from '../utils/imageUtils';

const NailStyleSelection = () => {
  const { updateFormField, formData } = useAppointment();
  const [customUpload, setCustomUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [predefinedStyles, setPredefinedStyles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  
  // Cargar los estilos predefinidos
  useEffect(() => {
    const loadStyles = async () => {
      setIsLoading(true);
      try {
        const styles = await fetchNailStyles();
        setPredefinedStyles(styles);
        
        // Extraer categorías únicas
        const uniqueCategories = ['todos', ...new Set(styles.map(style => style.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error al cargar estilos:', error);
        setErrorMessage('No se pudieron cargar los estilos predefinidos.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStyles();
  }, []);

  const handleStyleSelect = (styleId) => {
    setSelectedStyle(styleId);
    setCustomUpload(false);
    const selectedStyleData = predefinedStyles.find(style => style.id === styleId);
    updateFormField('nailStyle', {
      type: 'predefined',
      id: styleId,
      name: selectedStyleData.name,
      category: selectedStyleData.category
    });
  };

  const validateFile = (file) => {
    if (!isValidImage(file)) {
      setErrorMessage('Por favor, sube solo imágenes (JPG, PNG, GIF).');
      return false;
    }
    
    if (!isValidImageSize(file)) {
      setErrorMessage(`La imagen excede el tamaño máximo permitido (5MB). Tamaño actual: ${formatFileSize(file.size)}`);
      return false;
    }
    
    return true;
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setErrorMessage('');
    
    // Validar archivos
    const validFiles = files.filter(validateFile);
    if (validFiles.length === 0) return;
    
    // Simular progreso de carga
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      // Simulamos la subida de imágenes
      const result = await uploadReferenceImages(validFiles);
      setUploadProgress(100);
      
      // Añadir archivos a los ya subidos
      const newUploadedFiles = [...uploadedFiles, ...validFiles.map((file, index) => ({
        file,
        id: `local-${Date.now()}-${index}`,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }))];
      
      setUploadedFiles(newUploadedFiles);
      
      updateFormField('nailStyle', {
        type: 'custom',
        fileCount: newUploadedFiles.length,
        fileIds: newUploadedFiles.map(f => f.id)
      });
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      setErrorMessage('Ocurrió un error al subir las imágenes. Intenta nuevamente.');
    } finally {
      // Limpiamos el progreso después de un segundo
      setTimeout(() => {
        setUploadProgress(null);
        clearInterval(interval);
      }, 1000);
    }
  };

  const removeUploadedFile = (index) => {
    const newFiles = [...uploadedFiles];
    
    // Liberar URL de objeto para evitar fugas de memoria
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview);
    }
    
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    
    updateFormField('nailStyle', {
      type: 'custom',
      fileCount: newFiles.length,
      fileIds: newFiles.map(f => f.id)
    });
    
    if (newFiles.length === 0 && !selectedStyle) {
      updateFormField('nailStyle', null);
    }
  };

  const toggleCustomUpload = () => {
    setCustomUpload(!customUpload);
    if (!customUpload) {
      setSelectedStyle(null);
      if (uploadedFiles.length > 0) {
        updateFormField('nailStyle', { 
          type: 'custom', 
          fileCount: uploadedFiles.length,
          fileIds: uploadedFiles.map(f => f.id)
        });
      } else {
        updateFormField('nailStyle', null);
      }
    } else if (selectedStyle) {
      const selectedStyleData = predefinedStyles.find(style => style.id === selectedStyle);
      updateFormField('nailStyle', {
        type: 'predefined',
        id: selectedStyle,
        name: selectedStyleData.name,
        category: selectedStyleData.category
      });
    } else {
      updateFormField('nailStyle', null);
    }
  };

  const filterStylesByCategory = () => {
    if (selectedCategory === 'todos') {
      return predefinedStyles;
    }
    return predefinedStyles.filter(style => style.category === selectedCategory);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
            <path d="M2 2l7.586 7.586"></path>
            <circle cx="11" cy="11" r="2"></circle>
          </svg>
          Estilo de Uñas
        </h2>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            className={`style-toggle-btn ${!customUpload ? 'active' : ''}`}
            onClick={() => setCustomUpload(false)}
          >
            Catálogo de Estilos
          </button>
          <button 
            className={`style-toggle-btn ${customUpload ? 'active' : ''}`}
            onClick={toggleCustomUpload}
          >
            Subir Mis Referencias
          </button>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {errorMessage}
            <button 
              className="ml-2 text-red-800 font-medium" 
              onClick={() => setErrorMessage('')}
            >
              ×
            </button>
          </div>
        )}

        {!customUpload ? (
          <>
            {/* Filtro por categorías */}
            {categories.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors
                      ${selectedCategory === category 
                        ? 'bg-pink-100 text-pink-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            )}
            
            {isLoading ? (
              <div className="py-8 text-center text-gray-500">
                <svg className="animate-spin h-8 w-8 mx-auto text-pink-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Cargando estilos...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filterStylesByCategory().map(style => (
                  <div 
                    key={style.id}
                    onClick={() => handleStyleSelect(style.id)}
                    className={`nail-style-card cursor-pointer rounded-lg overflow-hidden
                      ${selectedStyle === style.id ? 'selected' : ''}`}
                  >
                    <div 
                      className="nail-style-image"
                      style={{ backgroundImage: `url(${style.imageUrl})` }}
                    ></div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm">{style.name}</h3>
                      <p className="text-xs text-gray-500">{style.description}</p>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {style.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div 
              className={`upload-zone ${uploadProgress !== null ? 'uploading-animation' : ''}`}
              onClick={() => {
                if (uploadProgress === null) {
                  document.getElementById('nail-style-upload').click();
                }
              }}
            >
              <input
                type="file"
                id="nail-style-upload"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploadProgress !== null}
              />
              {uploadProgress !== null ? (
                <div className="text-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-pink-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500">Subiendo imágenes... {uploadProgress}%</p>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-pink-300 mb-3 mx-auto">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p className="font-medium mb-1">Haz clic para subir imágenes</p>
                  <p className="text-sm">o arrastra y suelta tus referencias aquí</p>
                  <p className="text-xs mt-2 text-gray-400">JPG, PNG, GIF - Máximo 5 MB por imagen</p>
                </>
              )}
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Imágenes subidas ({uploadedFiles.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="uploaded-image-preview">
                      <img 
                        src={file.preview} 
                        alt={`Referencia ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeUploadedFile(index);
                        }}
                        className="remove-image-btn"
                        aria-label="Eliminar imagen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                      <div className="text-xs truncate p-1 bg-white border-t border-gray-100">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-4">
                  <button
                    onClick={() => document.getElementById('nail-style-upload').click()}
                    className="px-4 py-2 bg-pink-50 text-pink-600 rounded-md hover:bg-pink-100 transition-colors text-sm"
                    disabled={uploadProgress !== null}
                  >
                    Añadir más imágenes
                  </button>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
              <p className="font-medium mb-1">Consejos para mejores resultados:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sube imágenes claras y con buena iluminación</li>
                <li>Incluye diferentes ángulos si es posible</li>
                <li>Asegúrate que se vean bien los detalles del diseño</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NailStyleSelection;