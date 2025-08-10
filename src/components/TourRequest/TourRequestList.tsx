import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { FiCalendar, FiClock, FiHome, FiInfo, FiMapPin, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTour } from '../../context/TourRequestContext';

export default function TourRequestList() {
    const { useGetAllTourBookingsByUserId } = useTour();
    const { user } = useAuth();
    const userId = user?.id || "";
    const base_url = import.meta.env.VITE_BASE_URL;
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isLoading, isError } = useGetAllTourBookingsByUserId(userId);

    if (!userId) {
        return (
            <div className="p-4 text-center">User not logged in. Please sign in to view your tour requests.</div>
        );
    }

    console.log(data);

    if (isLoading) return <div className="p-4 text-center"><span className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#2563eb]"></span></div>;
    if (isError) return <div className="p-4 text-center text-red-500">Error loading tour requests</div>;

    const tourRequests = data?.tourRequests;
    const filteredRequests = tourRequests?.filter((tour) =>
        tour.Property?.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.Property?.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-4 font-ManropeRegular">
            <h1 className="text-2xl font-bold mb-6">My Tour Requests</h1>

            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by property name or address..."
                    className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredRequests?.length === 0 ? (
                <div className="text-center py-10">
                    <FiInfo className="mx-auto text-4xl text-gray-400 mb-3" />
                    <p className="text-gray-600">No tour requests found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredRequests?.map((tour) => (
                        <Link
                            key={tour.tourRequestId}
                            to={`/tours/${tour.tourRequestId}`}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-full md:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                                    {tour.Property?.images?.length ? (
                                        <img
                                            src={`${base_url.replace(/\/$/, '')}/${String(tour.Property?.images[0])?.replace(/^\//, '')}`}
                                            alt={tour?.Property?.propertyName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FiHome size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h2 className="text-xl font-semibold">{tour?.Property?.propertyName}</h2>
                                        <span className={`px-3 py-1 rounded-full text-sm ${tour.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                                            tour.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                                tour.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                                                    'bg-blue-100 text-blue-800'
                                            }`}>
                                            {tour.status?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mt-1">
                                        <FiMapPin className="mr-1" />
                                        <span>{tour?.Property?.address}, {tour?.Property?.city}</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center">
                                            <FiCalendar className="mr-2 text-gray-500" />
                                            <span>{format(parseISO(tour.preferredDate), 'MMM d, yyyy')}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiClock className="mr-2 text-gray-500" />
                                            <span>{tour.preferredTime}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-500">
                                        Requested on {format(parseISO(tour.preferredDate), 'MMM d, yyyy h:mm a')}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
