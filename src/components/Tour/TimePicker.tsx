import React from 'react';

interface TimeSlotPickerProps {
    selectedTime: string;
    onChange: (time: string) => void;
    availableSlots: string[];
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
    selectedTime,
    onChange,
    availableSlots,
}) => {
    // Group time slots into morning, afternoon, and evening
    const groupedSlots = {
        morning: availableSlots.filter(slot => {
            const hour = parseInt(slot.split(':')[0]);
            return hour >= 8 && hour < 12;
        }),
        afternoon: availableSlots.filter(slot => {
            const hour = parseInt(slot.split(':')[0]);
            return hour >= 12 && hour < 17;
        }),
        evening: availableSlots.filter(slot => {
            const hour = parseInt(slot.split(':')[0]);
            return hour >= 17 && hour <= 20;
        }),
    };

    const timeGroups = [
        { id: 'morning', label: 'Morning', slots: groupedSlots.morning },
        { id: 'afternoon', label: 'Afternoon', slots: groupedSlots.afternoon },
        { id: 'evening', label: 'Evening', slots: groupedSlots.evening },
    ];

    return (
        <div className="space-y-4">
            {timeGroups.map(group => (
                <div key={group.id} className={group.slots.length === 0 ? 'opacity-50' : ''}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{group.label}</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {group.slots.length > 0 ? (
                            group.slots.map(slot => (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => onChange(slot)}
                                    className={`
                    py-2 px-3 text-sm rounded-md transition-all duration-200
                    ${selectedTime === slot
                                            ? 'bg-blue-600 text-white font-medium border border-blue-600'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                                        }
                  `}
                                >
                                    {slot}
                                </button>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 col-span-4">No available slots</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TimeSlotPicker;