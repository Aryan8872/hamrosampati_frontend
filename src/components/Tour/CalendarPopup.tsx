import { BsChevronLeft, BsChevronRight, BsX } from "react-icons/bs";

export const dateUtils = {
    formatDate: (date: Date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return {
            day: date.getDate(),
            month: months[date.getMonth()],
            dayName: days[date.getDay()],
            fullDate: date.toDateString()
        };
    },
    generateCalendarDays: (currentMonth: Date) => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        const days: Date[] = [];
        const currentDate = new Date(startDate);
        for (let i = 0; i < 42; i++) {
            days.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return days;
    },
    isToday: (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },
    isCurrentMonth: (date: Date, currentMonth: Date) => {
        return date.getMonth() === currentMonth.getMonth();
    },
    isPastDate: (date: Date) => {
        return date < new Date(new Date().setHours(0, 0, 0, 0));
    }
};

interface CalendarDayProps {
    date: Date;
    currentMonth: Date;
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
}
const CalendarDay = ({ date, currentMonth, selectedDate, onDateSelect }: CalendarDayProps) => {
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const isToday = dateUtils.isToday(date);
    const isCurrentMonth = dateUtils.isCurrentMonth(date, currentMonth);
    const isPast = dateUtils.isPastDate(date);
    const getButtonClass = () => {
        const baseClass = "h-10 w-10 rounded-lg text-sm font-medium transition-colors";
        if (isSelected) return `${baseClass} bg-blue-600 text-white`;
        if (isToday) return `${baseClass} bg-blue-100 text-blue-600`;
        if (isCurrentMonth) return `${baseClass} hover:bg-gray-100 text-gray-900`;
        return `${baseClass} text-gray-400`;
    };
    return (
        <button
            onClick={() => onDateSelect(date)}
            disabled={isPast}
            className={`${getButtonClass()} ${isPast ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="button"
        >
            {date.getDate()}
        </button>
    );
};

interface CalendarGridProps {
    days: Date[];
    currentMonth: Date;
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
}
const CalendarGrid = ({ days, currentMonth, selectedDate, onDateSelect }: CalendarGridProps) => (
    <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">{day}</div>
        ))}
        {days.map((date, index) => (
            <CalendarDay
                key={index}
                date={date}
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onDateSelect={onDateSelect}
            />
        ))}
    </div>
);

export interface CalendarPopupProps {
    showCalendar: boolean;
    currentMonth: Date;
    selectedDate: Date | null;
    onClose: () => void;
    onDateSelect: (date: Date) => void;
    onMonthNavigate: (direction: number) => void;
}

export const CalendarPopup = ({ showCalendar, currentMonth, selectedDate, onClose, onDateSelect, onMonthNavigate }: CalendarPopupProps) => {
    if (!showCalendar) return null;
    const days = dateUtils.generateCalendarDays(currentMonth);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Select Date</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" type="button"><BsX size={20} /></button>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => onMonthNavigate(-1)} className="p-2 hover:bg-gray-100 rounded" type="button"><BsChevronLeft size={20} /></button>
                    <h4 className="text-lg font-medium">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h4>
                    <button onClick={() => onMonthNavigate(1)} className="p-2 hover:bg-gray-100 rounded" type="button"><BsChevronRight size={20} /></button>
                </div>
                <CalendarGrid days={days} currentMonth={currentMonth} selectedDate={selectedDate} onDateSelect={onDateSelect} />
                <div className="flex gap-2">
                    <button onClick={onClose} className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50" type="button">Cancel</button>
                    <button onClick={onClose} className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700" type="button">Done</button>
                </div>
            </div>
        </div>
    );
}; 