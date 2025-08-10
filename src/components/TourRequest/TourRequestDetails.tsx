import { useState } from 'react';
import { FiCalendar, FiClock, FiHome, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useTour } from '../../context/TourRequestContext';
import { TOUR_TYPES } from '../../types/enumTypes';
import TourRescheduleModal from '../TourRescheduleModal';
import CancelTourConfirmation from './CancelTourConfirmation';

export default function TourRequestDetail() {
    const { tourId } = useParams()
    const { useUserTourBookingsById, isLoading } = useTour();
    const { data } = useUserTourBookingsById(tourId!)
    const base_url = import.meta.env.VITE_BASE_URL
    const tourById = data?.tourRequests
    const [isCancelTourConfirmation, setIsCancelTourConfirmation] = useState(false)
    const [showRescheduleModal, setShowRescheduleModal] = useState(false)

    if (isLoading) return <div className="p-4 text-center">Loading tour details...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 font-ManropeRegular">
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold">Tour Request Details</h1>
                <span className={`px-3 py-1 rounded-full text-sm ${tourById?.status === TOUR_TYPES.pending ? 'bg-orange-100 text-orange-800' :
                    tourById?.status === TOUR_TYPES.confirmed ? 'bg-green-100 text-green-800' :
                        tourById?.status === TOUR_TYPES.cancelled ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                    }`}>
                    {tourById?.status!.toUpperCase()}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Property Info */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <h2 className="text-xl font-semibold mb-4">Property Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <FiHome className="mr-2 text-gray-500" />
                                    <span className="font-medium">Name:</span>
                                    <span className="ml-2">{tourById?.Property?.propertyName}</span>
                                </div>
                                <div className="flex items-center">
                                    <FiMapPin className="mr-2 text-gray-500" />
                                    <span className="font-medium">Address:</span>
                                    <span className="ml-2">{tourById?.Property?.address}</span>
                                </div>
                                <div className="flex">
                                    <div className="w-6"></div>
                                    <span className="ml-2">{tourById?.Property?.city}, {tourById?.Property?.district}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <span className="font-medium">Type:</span>
                                    <span className="ml-2 capitalize">{tourById?.Property?.propertyType}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Price:</span>
                                    <span className="ml-2">${tourById?.Property?.propertyPrice}</span>
                                </div>
                                <div>
                                    <span className="font-medium">Area:</span>
                                    <span className="ml-2">{tourById?.Property?.areaTotal} sq.ft</span>
                                </div>
                            </div>
                        </div>

                        {/* Property Images */}
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Property Images</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {tourById?.Property?.images?.map((image, index) => (
                                    <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                                        <img
                                            src={`${base_url.replace(/\/$/, '')}/${String(image)?.replace(/^\//, '')}`}
                                            alt={`Property ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Tour & User Info */}
                <div className="space-y-6">
                    {/* Tour Details */}
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <h2 className="text-xl font-semibold mb-4">Tour Details</h2>

                        <div className="space-y-3">
                            <div className="flex items-center">
                                <FiCalendar className="mr-2 text-gray-500" />
                                <span className="font-medium">Date:</span>
                                <span className="ml-2">{tourById?.preferredDate}</span>
                            </div>

                            <div className="flex items-center">
                                <FiClock className="mr-2 text-gray-500" />
                                <span className="font-medium">Time:</span>
                                <span className="ml-2">{tourById?.preferredTime}</span>
                            </div>

                            <div>
                                <span className="font-medium">Requested on:</span>
                                <span className="ml-2">{tourById?.preferredDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* User Details */}
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <h2 className="text-xl font-semibold mb-4">Your Information</h2>

                        <div className="space-y-3">
                            <div className="flex items-center">
                                <FiUser className="mr-2 text-gray-500" />
                                <span className="font-medium">Name:</span>
                                <span className="ml-2">{tourById?.fullName}</span>
                            </div>

                            <div className="flex items-center">
                                <FiMail className="mr-2 text-gray-500" />
                                <span className="font-medium">Email:</span>
                                <span className="ml-2">{tourById?.email}</span>
                            </div>

                            <div className="flex items-center">
                                <FiPhone className="mr-2 text-gray-500" />
                                <span className="font-medium">Phone:</span>
                                <span className="ml-2">{tourById?.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <h2 className="text-xl font-semibold mb-4">Actions</h2>

                        <div className="flex flex-wrap gap-3">
                            {tourById?.status === TOUR_TYPES.pending && (
                                <>
                                    <button
                                        onClick={() => setIsCancelTourConfirmation(true)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                        Cancel Request
                                    </button>
                                    <button
                                        onClick={() => setShowRescheduleModal(true)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        Reschedule Tour
                                    </button>
                                </>
                            )}

                            {tourById?.status === TOUR_TYPES.confirmed && (
                                <button
                                    onClick={() => setShowRescheduleModal(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Reschedule Tour
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isCancelTourConfirmation &&
                <CancelTourConfirmation onClose={() => setIsCancelTourConfirmation(!isCancelTourConfirmation)}
                    onOpen={isCancelTourConfirmation}
                    dataId={tourById?.tourRequestId}
                />
            }

            {showRescheduleModal && tourById && (
                <TourRescheduleModal
                    tour={tourById}
                    isOpen={showRescheduleModal}
                    onClose={() => setShowRescheduleModal(false)}
                />
            )}

        </div>
    );
}