/**
 * Funciones de utilidad para manejar fechas
 */

/**
 * Formatea una fecha al formato DD/MM/YYYY
 * @param {Date} date - Objeto Date a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };
  
  /**
   * Formatea una hora al formato HH:MM
   * @param {string} time - Hora en formato "HH:MM"
   * @returns {string} Hora formateada
   */
  export const formatTime = (time) => {
    return time;
  };
  
  /**
   * Comprueba si una fecha es hoy
   * @param {Date} date - Fecha a comprobar
   * @returns {boolean} True si la fecha es hoy
   */
  export const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  /**
   * Obtiene los nombres de los meses en español
   * @returns {Array} Array con los nombres de los meses
   */
  export const getMonthNames = () => {
    return [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  };
  
  /**
   * Obtiene los nombres cortos de los días de la semana en español
   * @returns {Array} Array con los nombres cortos de los días
   */
  export const getWeekdayShortNames = () => {
    return ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  };