import { BsChevronRight } from "react-icons/bs";

export interface DateDisplayProps {
    selectedDate: Date | null;
}

const dateUtils = {
    formatDate: (date: Date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return {
            day: date.getDate(),
            month: months[date.getMonth()],
            dayName: days[date.getDay()],
            fullDate: date.toDateString()
        };
    }
};

const DateDisplay = ({ selectedDate }: DateDisplayProps) => {
    if (selectedDate) {
        const formattedDate = dateUtils.formatDate(selectedDate);
        return (
            <div className="flex gap-2">
                <div className="border-2 border-blue-500 bg-blue-50 rounded-lg px-4 py-3 text-center min-w-[80px]">
                    <div className="font-semibold text-lg text-gray-800">
                        {formattedDate.day}{formattedDate.month}
                    </div>
                    <div className="text-sm text-gray-500">
                        {formattedDate.dayName}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="flex gap-2">
            <div className="border-2 border-blue-500 bg-blue-50 rounded-lg px-4 py-3 text-center min-w-[80px]">
                <div className="font-semibold text-lg text-gray-800">1Mar</div>
                <div className="text-sm text-gray-500">Wed</div>
            </div>
            <div className="border rounded-lg px-4 py-3 text-center min-w-[80px] text-gray-400">
                <div className="font-semibold text-lg">2 Mar</div>
                <div className="text-sm">Tue</div>
            </div>
            <div className="border rounded-lg px-4 py-3 text-center min-w-[80px] text-gray-400">
                <div className="font-semibold text-lg">3 Mar</div>
                <div className="text-sm">Fri</div>
            </div>
            <button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100">
                <BsChevronRight size={16} />
            </button>
        </div>
    );
};

export default DateDisplay; 