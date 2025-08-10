import React from 'react';
import { CiCalendar, CiLock, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { useProperty } from '../../../context/PropertyContext';
import { useTour } from '../../../context/TourRequestContext';
import { tourRequestSchema } from '../../../schemas/tourSchema';
import { TourRequestData } from '../TourRequestForm';

interface ConfirmationStepProps {
    formData: TourRequestData;
    onSubmit: () => void;
    onBack: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
    formData,
    onSubmit,
    onBack,
}) => {
    const { createTourRequest, isLoading } = useTour();
    const { user } = useAuth();
    const { getCanBookStatus } = useProperty();

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const convertTo24Hour = (time12h: string): string => {
        const [time, modifier] = time12h.split(' ');
        const [rawHours, minutes] = time.split(':');
        let hours = rawHours;
        if (modifier === 'PM' && hours !== '12') {
            hours = (parseInt(hours, 10) + 12).toString();
        }
        if (modifier === 'AM' && hours === '12') {
            hours = '00';
        }

        return `${hours.padStart(2, '0')}:${minutes}`;
    };
    console.log(user)
    const handleSubmit = async () => {
        const payload = {
            ...formData,
            preferredDate: formData.preferredDate,
            preferredTime: convertTo24Hour(formData.preferredTime),
            userId: user?.id
        };
        const { error } = tourRequestSchema.validate(payload);
        if (error) {
            alert(`Validation Error: ${error.details[0].message}`);
            return;
        }
        const result = await createTourRequest(payload);
        if (result.success) {
            await getCanBookStatus({ propertyId: formData.propertyId });
            toast.success('Tour booking created successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 1200); // Wait for toast to display
            onSubmit();
        } else {
            alert(`Failed to schedule tour: ${result.error}`);
        }
    };

    return (
        <div className="space-y-6 relative">
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Confirm Your Tour</h2>
                <p className="text-gray-600 mt-1">
                    Please review your tour details before submitting
                </p>
            </div>

            <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-blue-50 p-4 border-b">
                        <h3 className="font-medium text-blue-900">Tour Details</h3>
                    </div>

                    <div className="p-4 space-y-3">
                        {/* <div className="flex items-start">
                            <CiHome className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                            <div>
                                <div className="font-medium text-gray-700">Property</div>
                                <div className="text-gray-600">{formData.propertyAddress}</div>
                            </div>
                        </div> */}

                        <div className="flex items-start">
                            <CiCalendar className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                            <div>
                                <div className="font-medium text-gray-700">Date</div>
                                <div className="text-gray-600">{formatDate(formData.preferredDate)}</div>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <CiLock className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                            <div>
                                <div className="font-medium text-gray-700">Time</div>
                                <div className="text-gray-600">{formData.preferredTime}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-blue-50 p-4 border-b">
                        <h3 className="font-medium text-blue-900">Your Information</h3>
                    </div>

                    <div className="p-4 space-y-3">
                        <div className="flex items-start">
                            <CiUser className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                            <div>
                                <div className="font-medium text-gray-700">Name</div>
                                <div className="text-gray-600">{formData.fullName}</div>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <CiMail className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                            <div>
                                <div className="font-medium text-gray-700">Email</div>
                                <div className="text-gray-600">{formData.email}</div>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <CiPhone className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                            <div>
                                <div className="font-medium text-gray-700">Phone</div>
                                <div className="text-gray-600">{formData.phone}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={onBack}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                    Back
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {isLoading ? (
                        <span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Submitting...</span>
                    ) : 'Schedule Tour'}
                </button>
            </div>
        </div>
    );
};

export default ConfirmationStep;
