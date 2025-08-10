import { useState } from 'react';
import { FaCalendar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { UserType } from '../../types/payloadType';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

export interface TourFormData {
    name: string;
    phone: string;
    email: string;
    time: string;
    notes: string;
}

export interface ScheduleTourPopupProps {
    show: boolean;
    selectedDate: Date | null;
    onClose: () => void;
    onSubmit: (tourData: TourFormData) => void;
    user: Partial<UserType> | null;
}

const getUserPhone = (user: Partial<UserType> | null): string => {
    if (user && typeof user === 'object' && 'phone' in user && typeof (user as Record<string, unknown>).phone === 'string') {
        return (user as Record<string, string>).phone;
    }
    return '';
};

const timeOptions = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '17:00', label: '5:00 PM' }
];

const ScheduleTourPopup = ({ show, selectedDate, onClose, onSubmit, user }: ScheduleTourPopupProps) => {
    const [formData, setFormData] = useState<TourFormData>({
        name: user?.fullName || '',
        phone: getUserPhone(user),
        email: user?.email || '',
        time: '',
        notes: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: keyof TourFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (formData.time === '') {
            toast.error("Please select a time")
            return
        }
        setIsLoading(true);
        await onSubmit(formData);
        setIsLoading(false);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50 rounded-lg">
                        <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#2563eb] mb-2"></span>
                        <span className="text-blue-600 font-semibold">Scheduling your tour...</span>
                    </div>
                )}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Schedule Your Tour</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-[20px]" type="button" disabled={isLoading}>X</button>
                </div>
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <FaCalendar size={20} className="text-blue-600" />
                            <div>
                                <p className="font-medium text-gray-800">Selected Date</p>
                                <p className="text-sm text-gray-600">{selectedDate ? selectedDate.toDateString() : ''}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <FormInput label="Your Name" placeholder="Enter your full name" required value={formData.name} onChange={e => handleInputChange('name', (e.target as HTMLInputElement).value)} />
                        <FormInput label="Phone Number" type="tel" placeholder="Enter your phone number" required value={formData.phone} onChange={e => handleInputChange('phone', (e.target as HTMLInputElement).value)} />
                        <FormInput label="Email Address" type="email" placeholder="Enter your email" required value={formData.email} onChange={e => handleInputChange('email', (e.target as HTMLInputElement).value)} />
                        <FormSelect label="Preferred Time" options={timeOptions} placeholder="Select time" required value={formData.time} onChange={e => handleInputChange('time', (e.target as HTMLSelectElement).value)} />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button onClick={onClose} className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors" type="button" disabled={isLoading}>Cancel</button>
                        <button onClick={handleSubmit} className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-60" type="button" disabled={isLoading}>Schedule Tour</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleTourPopup; 