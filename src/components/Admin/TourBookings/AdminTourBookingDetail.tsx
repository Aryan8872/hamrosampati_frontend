import { format, parseISO } from 'date-fns';
import {
    FaCalendarAlt,
    FaClock,
    FaEnvelope,
    FaHome,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaPhone,
    FaTimes,
    FaUser
} from 'react-icons/fa';
import { TourDataType } from '../../../types/payloadType';

const AdminTourBookingDetail = ({ tour, onClose }: { tour: TourDataType, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4  ">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Tour Request Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <FaHome className="text-blue-500" />
                            <h3 className="font-semibold text-gray-800">Property Details</h3>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-1/3">
                                <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                                    <img
                                        src={'https://via.placeholder.com/400'}
                                        alt={tour.Property?.propertyName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-2/3 space-y-3">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-800">
                                        {tour.Property?.propertyName}
                                    </h4>
                                    <p className="flex items-center text-sm text-gray-600 mt-1">
                                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                                        {tour.Property?.address}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium">Price</p>
                                        <p className="text-sm font-medium">
                                            ${tour.Property?.propertyPrice?.toLocaleString() || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium">Type</p>
                                        <p className="text-sm font-medium capitalize">
                                            {tour.Property?.propertyType?.toLowerCase() || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium">Bedrooms</p>
                                        <p className="text-sm font-medium">
                                            {tour.Property?.bedrooms || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium">Bathrooms</p>
                                        <p className="text-sm font-medium">
                                            {tour.Property?.bathrooms || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tour Details Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FaInfoCircle className="text-blue-500" />
                            <h3 className="font-semibold text-gray-800">Tour Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <FaCalendarAlt className="text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Tour Date</p>
                                    <p className="text-sm font-medium">
                                        {format(parseISO(tour.preferredDate), 'MMMM d, yyyy')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FaClock className="text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Tour Time</p>
                                    <p className="text-sm font-medium">
                                        {tour.preferredTime}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="text-gray-400 mt-1 w-4 flex justify-center">
                                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Tour Type</p>
                                    <p className="text-sm font-medium capitalize">
                                        {tour.status?.toLowerCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="text-gray-400 mt-1 w-4 flex justify-center">
                                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Status</p>
                                    <p className="text-sm font-medium capitalize">
                                        {tour.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client Details Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FaUser className="text-blue-500" />
                            <h3 className="font-semibold text-gray-800">Client Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <FaUser className="text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Full Name</p>
                                    <p className="text-sm font-medium">
                                        {tour.fullName}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FaEnvelope className="text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                                    <p className="text-sm font-medium">
                                        {tour.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FaPhone className="text-gray-400 mt-1" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Phone</p>
                                    <p className="text-sm font-medium">
                                        {tour.phone}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default AdminTourBookingDetail