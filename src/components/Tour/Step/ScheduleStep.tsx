import React, { useState } from 'react';

import { CiCalendar } from 'react-icons/ci';
import Calendar from '../Calendar';
import { TourRequestData } from '../TourRequestForm';
import TimeSlotPicker from '../TimePicker';

interface SchedulingStepProps {
    formData: TourRequestData;
    updateFormData: (data: Partial<TourRequestData>) => void;
    onNext: () => void;
    onBack: () => void;
}

const SchedulingStep: React.FC<SchedulingStepProps> = ({
    formData,
    updateFormData,
    onNext,
    onBack,
}) => {
    const [errors, setErrors] = useState<{
        date?: string;
        timeSlot?: string;
    }>({});

   
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 20; hour++) {
            if (hour % 2 === 0) { // Just adding some slots every 2 hours for demo
                const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
                const amPm = hour < 12 ? 'AM' : 'PM';
                slots.push(`${formattedHour}:00 ${amPm}`);
            }
        }
        return slots;
    };

    const availableTimeSlots = generateTimeSlots();

    const validateForm = () => {
        const newErrors: {
            date?: string;
            timeSlot?: string;
        } = {};

        if (!formData.preferredDate) {
            newErrors.date = 'Please select a date';
        }

        if (!formData.preferredTime) {
            newErrors.timeSlot = 'Please select a time slot before continuing.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (validateForm()) {
            onNext();
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Schedule Your Tour</h2>
                <p className="text-gray-600 mt-1">
                    Select a date and time that works for you
                </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center">
                        <CiCalendar className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Select a Date</h3>
                    </div>

                    {errors.date && (
                        <p className="text-sm text-red-500">{errors.date}</p>
                    )}

                    <Calendar
                        selectedDate={formData.preferredDate}
                        onChange={(preferredDate) => updateFormData({ preferredDate })}
                    />
                </div>

                {formData.preferredDate && (
                    <div className="space-y-4 animate-fadeIn">
                        <h3 className="text-lg font-medium text-gray-900">Select a Time</h3>
                        {errors.timeSlot && (
                            <p className="text-sm text-red-500 font-semibold">{errors.timeSlot}</p>
                        )}
                        <TimeSlotPicker
                            selectedTime={formData.preferredTime}
                            onChange={(preferredTime) => updateFormData({ preferredTime })}
                            availableSlots={availableTimeSlots}
                        />
                    </div>
                )}

         
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={onBack}
                >
                    Back
                </button>

                <button
                    onClick={handleContinue}
                    disabled={!formData.preferredTime}
                    className={`px-4 py-2 rounded ${!formData.preferredTime ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default SchedulingStep;