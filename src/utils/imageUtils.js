/**
 * Utilidades para manejo de imágenes
 */

/**
 * Valida si un archivo es una imagen válida
 * @param {File} file - Archivo a validar
 * @returns {boolean} Verdadero si es una imagen válida
 */
export const isValidImage = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  };
  
  /**
   * Valida si un archivo de imagen no excede el tamaño máximo
   * @param {File} file - Archivo a validar
   * @param {number} maxSizeMB - Tamaño máximo en MB
   * @returns {boolean} Verdadero si no excede el tamaño
   */
  export const isValidImageSize = (file, maxSizeMB = 5) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };
  
  /**
   * Genera una vista previa de la imagen como URL de datos
   * @param {File} file - Archivo de imagen
   * @returns {Promise<string>} URL de datos de la imagen
   */
  export const getImagePreview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };
  
  /**
   * Optimiza una imagen (simulado - en producción usaríamos una librería real)
   * @param {File} file - Archivo de imagen a optimizar
   * @returns {Promise<File>} Archivo optimizado (simulado)
   */
  export const optimizeImage = async (file) => {
    // En producción, aquí usaríamos una librería como compressorjs
    // Por ahora simplemente devolvemos el mismo archivo después de un retraso simulado
    await new Promise(resolve => setTimeout(resolve, 500));
    return file;
  };
  
  /**
   * Comprueba si la imagen es apropiada (simulado)
   * @param {File} file - Archivo de imagen a verificar
   * @returns {Promise<boolean>} Verdadero si la imagen es apropiada
   */
  export const isAppropriateImage = async (file) => {
    // En producción, aquí podríamos usar un servicio de moderación de contenido
    // Por ahora simplemente devolvemos verdadero
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  };
  
  /**
   * Formatea el tamaño del archivo en forma legible
   * @param {number} bytes - Tamaño en bytes
   * @returns {string} Tamaño formateado
   */
  export const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };