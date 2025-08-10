import { format } from 'date-fns';
import React, { useState } from 'react';
import { FaCalendar, FaClock, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTour } from '../context/TourRequestContext';
import { TourDataType } from '../types/payloadType';
import { canRescheduleTour } from '../utils/authUtils';

interface TourRescheduleModalProps {
    tour: TourDataType;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const TourRescheduleModal: React.FC<TourRescheduleModalProps> = ({ tour, isOpen, onClose, onSuccess }) => {
    const { useRescheduleTourBooking } = useTour();
    const { user } = useAuth();
    const rescheduleMutation = useRescheduleTourBooking();

    const [preferredDate, setPreferredDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');

    // Check if user can reschedule this tour
    const canReschedule = canRescheduleTour(user, tour.userId);

    // Set default values when tour changes
    React.useEffect(() => {
        if (tour) {
            setPreferredDate(tour.preferredDate);
            setPreferredTime(tour.preferredTime || '10:00');
        }
    }, [tour]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canReschedule) {
            toast.error('You do not have permission to reschedule this tour');
            return;
        }

        if (!preferredDate || !preferredTime) {
            toast.error('Please select both date and time');
            return;
        }

        try {
            await rescheduleMutation.mutateAsync({
                tourId: tour.tourRequestId!,
                preferredDate,
                preferredTime
            });

            toast.success('Tour rescheduled successfully!');
            onSuccess?.();
            onClose();
        } catch {
            toast.error('Failed to reschedule tour');
        }
    };

    if (!isOpen) return null;

    // Show error if user doesn't have permission
    if (!canReschedule) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="p-6 text-center">
                        <p className="text-gray-600 mb-4">
                            You do not have permission to reschedule this tour.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Reschedule Tour</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            <FaCalendar className="text-gray-400 mr-2" />
                            <label className="text-sm font-medium text-gray-700">Property</label>
                        </div>
                        <p className="text-gray-900 font-medium">{tour.Property?.propertyName}</p>
                        <p className="text-sm text-gray-500">{tour.Property?.address}</p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            <FaCalendar className="text-gray-400 mr-2" />
                            <label htmlFor="preferredDate" className="text-sm font-medium text-gray-700">
                                New Date
                            </label>
                        </div>
                        <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            <FaClock className="text-gray-400 mr-2" />
                            <label htmlFor="preferredTime" className="text-sm font-medium text-gray-700">
                                New Time
                            </label>
                        </div>
                        <input
                            type="time"
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">Current Schedule</h3>
                        <p className="text-sm text-blue-700">
                            Date: {format(new Date(tour.preferredDate), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-sm text-blue-700">
                            Time: {tour.preferredTime || 'Not specified'}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={rescheduleMutation.isPending}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {rescheduleMutation.isPending ? 'Rescheduling...' : 'Reschedule Tour'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TourRescheduleModal; 