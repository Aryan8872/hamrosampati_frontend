import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { FiEdit2, FiEye, FiFilter, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { useTour } from '../../context/TourRequestContext';

const statusColors = {
    PENDING: 'bg-orange-100 text-orange-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    CANCELED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
};

export default function TourBookings() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const {  useGetAllTourBookings } = useTour()
    const { data, isLoading, isError } = useGetAllTourBookings()
    const tourData = data?.tourRequests

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error fetching tour bookings</p>;

    const filteredBookings = tourData?.filter((booking) => {
        const matchesSearch =
            booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.phone.includes(searchTerm);

        const matchesStatus =
            statusFilter === 'all' || booking.status === statusFilter;

        const matchesDate = !dateRange[0] || !dateRange[1] || (
            new Date(booking.preferredDate) >= dateRange[0] &&
            new Date(booking.preferredDate) <= dateRange[1]
        );

        return matchesSearch && matchesStatus && matchesDate;
    });

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Tour Booking History</h1>

                <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <FiRefreshCw /> Refresh
                    </button>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <select
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                </select>

                <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                    <FiFilter />
                    <input
                        type="date"
                        className="bg-transparent"
                        onChange={(e) => setDateRange([e.target.valueAsDate, dateRange[1]])}
                    />
                    <span>to</span>
                    <input
                        type="date"
                        className="bg-transparent"
                        onChange={(e) => setDateRange([dateRange[0], e.target.valueAsDate])}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBookings?.map((booking) => (
                            <tr key={booking.tourRequestId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-blue-600 font-mono">{booking.tourRequestId!.slice(0, 8)}...</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="font-medium">{booking.fullName}</div>
                                        <div className="text-sm text-gray-500">{booking.email}</div>
                                        <div className="text-sm text-gray-500">{booking.phone}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div><span className="font-medium">Date: </span>{format(parseISO(booking.preferredDate), 'MMM d, yyyy')}</div>
                                        <div><span className="font-medium">Time: </span>{booking.preferredTime}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status!]}`}>
                                        {booking.status!.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {format(parseISO(booking.preferredDate), 'MMM d, yyyy h:mm a')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                    <button className="p-1 text-blue-600 hover:text-blue-800">
                                        <FiEye />
                                    </button>
                                    <button className="p-1 text-green-600 hover:text-green-800">
                                        <FiEdit2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                    Showing {filteredBookings?.length} of {tourData?.length} bookings
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded">Previous</button>
                    <button className="px-3 py-1 border rounded bg-blue-500 text-white">1</button>
                    <button className="px-3 py-1 border rounded">2</button>
                    <button className="px-3 py-1 border rounded">Next</button>
                </div>
            </div>
        </div>
    );
}