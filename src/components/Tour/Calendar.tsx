import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CalendarProps {
  selectedDate: string;
  onChange: (date: string) => void;
  minDate?: Date;
  maxDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onChange,
  minDate = new Date(),
  maxDate,
}) => {
  // Default max date to 3 months from now if not provided
  const defaultMaxDate = new Date();
  defaultMaxDate.setMonth(defaultMaxDate.getMonth() + 3);
  
  const effectiveMaxDate = maxDate || defaultMaxDate;
  
  // Parse the selected date or use current date
  const parsedSelectedDate = selectedDate 
    ? new Date(selectedDate) 
    : new Date();
  
  const [currentMonth, setCurrentMonth] = useState(
    new Date(
      parsedSelectedDate.getFullYear(),
      parsedSelectedDate.getMonth(),
      1
    )
  );

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for first day of month
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // Generate days for the calendar
  const generateDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const days = generateDays();
  
  // Format date as YYYY-MM-DD
  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Check if a date is selectable
  const isDateSelectable = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    return date >= minDate && date <= effectiveMaxDate;
  };
  
  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };
  
  // Check if we can navigate to previous month
  const canNavigatePrevious = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    return prevMonth.getFullYear() >= minDate.getFullYear() && 
           prevMonth.getMonth() >= minDate.getMonth();
  };
  
  // Check if we can navigate to next month
  const canNavigateNext = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.getFullYear() <= effectiveMaxDate.getFullYear() && 
           nextMonth.getMonth() <= effectiveMaxDate.getMonth();
  };
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Handle date selection
  const handleDateClick = (day: number) => {
    const dateString = formatDateString(year, month, day);
    onChange(dateString);
  };
  
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center justify-between bg-gray-50 border-b">
        <button
          type="button"
          onClick={previousMonth}
          disabled={!canNavigatePrevious()}
          className={`
            p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200
            ${!canNavigatePrevious() ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="font-medium text-gray-900">
          {monthNames[month]} {year}
        </div>
        
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canNavigateNext()}
          className={`
            p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200
            ${!canNavigateNext() ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <FaChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Day labels */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 p-2 border-b bg-gray-50">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 p-2 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-10" />;
          }
          
          const dateString = formatDateString(year, month, day);
          const isSelected = dateString === selectedDate;
          const isToday = (
            new Date().getFullYear() === year &&
            new Date().getMonth() === month &&
            new Date().getDate() === day
          );
          const isSelectable = isDateSelectable(year, month, day);
          
          return (
            <button
              key={`day-${day}`}
              type="button"
              onClick={() => isSelectable && handleDateClick(day)}
              disabled={!isSelectable}
              className={`
                h-10 w-full rounded-md flex items-center justify-center text-sm
                transition-all duration-200 ease-in-out
                ${isSelected 
                  ? 'bg-blue-600 text-white font-medium' 
                  : isToday 
                    ? 'bg-blue-100 text-blue-800 font-medium' 
                    : isSelectable 
                      ? 'hover:bg-gray-100 text-gray-700' 
                      : 'text-gray-300 cursor-not-allowed'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;