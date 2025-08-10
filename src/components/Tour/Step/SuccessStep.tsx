import React from 'react';

import { CiCalendar, CiLock } from 'react-icons/ci';
import { FaCheckCircle } from 'react-icons/fa';
import { TourRequestData } from '../TourRequestForm';

interface SuccessStepProps {
    formData: TourRequestData;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
    formData,
}) => {
    // Format date for display
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

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden text-center max-w-md mx-auto">
            <div className="bg-green-50 p-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                    <FaCheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Tour Scheduled!</h2>
                <p className="mt-2 text-gray-600">
                    Your tour request has been submitted successfully.
                </p>
            </div>

            <div className="p-8">
                <div className="space-y-4 text-left mb-6">
                 

                    <div className="flex items-center">
                        <CiCalendar className="w-5 h-5 text-gray-500 mr-3" />
                        <div>
                            <div className="text-sm text-gray-500">Date</div>
                            <div className="font-medium">{formatDate(formData.preferredDate)}</div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <CiLock className="w-5 h-5 text-gray-500 mr-3" />
                        <div>
                            <div className="text-sm text-gray-500">Time</div>
                            <div className="font-medium">{formData.preferredTime}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-left mb-6">
                    <p className="text-sm text-blue-800">
                        A confirmation email has been sent to <span className="font-medium">{formData.email}</span>.
                        One of our agents will contact you shortly to confirm your tour details.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        className="w-full"
                        onClick={() => window.location.href = '/'}
                    >
                        Return to Homepage
                    </button>

                    <button
                        className="w-full"
                        onClick={() => window.print()}
                    >
                        Print Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessStep;