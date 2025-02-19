import React from 'react';
import { useAppointment } from '../store/AppointmentContext';

const Calendar = () => {
  const { selectedDate, setSelectedDate } = useAppointment();
  
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  
  const prevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };
  
  const nextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };
  
  const selectDay = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };
  
  // Generar el calendario
  const renderCalendar = () => {
    const today = new Date();
    const rows = [];
    let cells = [];
    let day = 1;
    
    // Encabezado con días de la semana
    const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    const weekDayHeader = (
      <tr key="weekdays">
        {weekDays.map((d, i) => (
          <th key={i} className="text-center py-2 text-xs font-medium text-gray-500">
            {d}
          </th>
        ))}
      </tr>
    );
    rows.push(weekDayHeader);
    
    // Generar filas con días
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          // Celdas vacías antes del primer día
          cells.push(<td key={`empty-${j}`}></td>);
        } else if (day > daysInMonth) {
          // Celdas vacías después del último día
          cells.push(<td key={`empty-end-${j}`}></td>);
        } else {
          // Determinar si este día es el seleccionado o es hoy
          const isSelected = day === selectedDate.getDate() && 
                            month === selectedDate.getMonth() && 
                            year === selectedDate.getFullYear();
                            
          const isToday = day === today.getDate() && 
                         month === today.getMonth() && 
                         year === today.getFullYear();
                         
          cells.push(
            <td key={day} className="text-center py-1">
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-colors
                  ${isSelected 
                    ? 'bg-pink-600 text-white' 
                    : 'hover:bg-gray-100'}
                  ${isToday && !isSelected ? 'border border-pink-300' : ''}
                `}
                onClick={() => selectDay(day)}
              >
                {day}
              </button>
            </td>
          );
          day++;
        }
      }
      
      if (day <= daysInMonth || i === 0) {
        rows.push(<tr key={i}>{cells}</tr>);
        cells = [];
      }
    }
    
    return rows;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Calendario
        </h2>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button 
            className="text-gray-600 hover:text-pink-600" 
            onClick={prevMonth}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div className="font-medium">
            {monthNames[month]} {year}
          </div>
          <button 
            className="text-gray-600 hover:text-pink-600"
            onClick={nextMonth}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        <table className="w-full">
          <tbody>
            {renderCalendar()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;