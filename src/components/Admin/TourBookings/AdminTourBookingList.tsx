import { format, parseISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import {
    FaCalendar,
    FaCalendarAlt,
    FaChevronLeft,
    FaChevronRight,
    FaClock,
    FaEnvelope,
    FaEye,
    FaHistory,
    FaSearch,
    FaUser,
    FaMapMarkerAlt
} from 'react-icons/fa';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useTour } from '../../../context/TourRequestContext';
import { notificationService, NotificationType } from '../../../services/notificationService';
import { TOUR_STATUS_TYPES, TOUR_TYPES } from '../../../types/enumTypes';
import { TourDataType } from '../../../types/payloadType';
import { statusColors, statusIcons } from '../../../types/sampleData';
import ConfirmationModal from '../../ConfirmationModal';
import TourRescheduleModal from '../../TourRescheduleModal';
import AdminTourBookingDetail from './AdminTourBookingDetail';

// Enhanced Tour Detail Component
const TourRequestDetail: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-start mb-4">
        <div className="text-gray-400 mr-3 mt-0.5">{icon}</div>
        <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
            <p className="text-sm font-medium text-gray-700">{value}</p>
        </div>
    </div>
);

// Daily View Component
const DailyView: React.FC<{ bookings: TourDataType[]; selectedDate: Date }> = ({ bookings, selectedDate }) => {
    const dayBookings = bookings?.filter(booking => {
        const bookingDate = new Date(booking.preferredDate);
        return bookingDate.toDateString() === selectedDate.toDateString();
    });

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 ">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Tours for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                <span className="text-sm text-gray-500">
                    {dayBookings?.length || 0} tours scheduled
                </span>
            </div>

            <div className="space-y-4">
                {dayBookings?.length === 0 ? (
                    <div className="text-center py-8">
                        <FaCalendar className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tours scheduled</h3>
                        <p className="mt-1 text-sm text-gray-500">No tours are scheduled for this date.</p>
                    </div>
                ) : (
                    dayBookings?.map((booking) => (
                        <motion.div
                            key={booking.tourRequestId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FaUser className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{booking.fullName}</p>
                                        <p className="text-sm text-gray-500">{format(parseISO(booking.preferredDate), 'h:mm a')}</p>
                                        <p className="font-medium text-gray-900">Property:{booking.Property?.propertyName}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status!]}`}>
                                    {statusIcons[booking.status!]}
                                    <span className="ml-1">{booking.status}</span>
                                </span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

const AdminTourBookingList: React.FC = () => {
    const { updateTourStatus, useSearchTourBookings } = useTour();

    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('DESC');

    // Modal states
    const [activeTourId, setActiveTourId] = useState<string>();
    const [activeTourStatus, setActiveTourStatus] = useState<TOUR_TYPES>();
    const [updateTourStatusConfirmation, setUpdateTourStatusConfirmation] = useState(false);
    const [toggleDetailModal, setToggleDetailModal] = useState(false);
    const [detailModalTourData, setDetailModalTourData] = useState<TourDataType>();
    const [viewMode, setViewMode] = useState<'list' | 'daily'>('list');
    const [selectedDate] = useState<Date>(new Date());
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedTourForReschedule, setSelectedTourForReschedule] = useState<TourDataType | null>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Build search parameters
    const searchParams = {
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        startDate: dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : undefined,
        endDate: dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : undefined,
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder
    };

    // Use the search API
    const { data, isLoading, isError } = useSearchTourBookings(searchParams);
    const tourData = data?.tourRequests || [];
    const pagination = data?.pagination;

    // Click outside handler for notification dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    // Load notifications
    const loadNotifications = async () => {
        try {
            const response = await notificationService.getAdminNotifications();
            setNotifications(response.notifications || []);
            setUnreadCount(response.count || 0);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const sendNotification = async (status: string) => {
        try {
            await notificationService.sendTourStatusNotification({
                tourId: activeTourId!,
                status,
                userEmail: '',
                userName: '',
                propertyName: '',
                tourDate: ''
            });
        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    };

    if (isError) return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-red-700">Failed to load tour requests. Please try again.</p>
                </div>
            </div>
        </div>
    );

    const handleStatusUpdate = async (status: TourDataType['status'], tourId: string) => {
        setActiveTourId(tourId);
        setActiveTourStatus(status!);
        setUpdateTourStatusConfirmation(true);
    };

    const confirmStatusUpdate = async () => {
        if (!activeTourId || !activeTourStatus) return;

        setIsProcessing(true);
        try {
            const result = await updateTourStatus(activeTourId, activeTourStatus);
            if (result?.success) {
                toast.success(`Tour status updated to ${activeTourStatus}`);

                // Send notification to user
                const tour = tourData?.find(t => t.tourRequestId === activeTourId);
                if (tour?.email) {
                    await sendNotification(activeTourStatus);
                }

                // Reload notifications after status update
                await loadNotifications();
            } else {
                toast.error(result?.error || 'Failed to update status');
            }
        } catch (e: unknown) {
            console.log(e)
            toast.error(`Failed to update tour status`);
        }
        setIsProcessing(false);
        setUpdateTourStatusConfirmation(false);
        setActiveTourId(undefined);
        setActiveTourStatus(undefined);
    };

    const openTourDetailModal = (tour: TourDataType) => {
        setDetailModalTourData(tour);
        setToggleDetailModal(true);
    };

    const openRescheduleModal = (tour: TourDataType) => {
        setSelectedTourForReschedule(tour);
        setShowRescheduleModal(true);
    };

    const closeRescheduleModal = () => {
        setShowRescheduleModal(false);
        setSelectedTourForReschedule(null);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleDateRangeChange = (start: Date | null, end: Date | null) => {
        setDateRange([start, end]);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (status: string) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    // Pagination component
    const Pagination = () => {
        if (!pagination) return null;

        const { currentPage: page, totalPages, hasNextPage, hasPrevPage } = pagination;

        return (
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                    Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} results
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={!hasPrevPage}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (page <= 3) {
                            pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = page - 2 + i;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${page === pageNum
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={!hasNextPage}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    const base_url = import.meta.env.VITE_BASE_URL;

    // ImageWithLoader copied from TheSwiper
    function ImageWithLoader({ src, alt, className }: { src: string, alt: string, className?: string }) {
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);
        return (
            <div className="relative w-full h-12 sm:h-16 flex items-center justify-center bg-gray-100">
                {loading && !error && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className="inline-block animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-b-4 border-gray-200"></span>
                    </div>
                )}
                <img
                    src={error ? "/assets/placeholder/house_placeholder.png" : src}
                    alt={alt}
                    className={`${className} transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
                    loading="lazy"
                    onLoad={() => setLoading(false)}
                    onError={() => { setError(true); setLoading(false); }}
                />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 font-ManropeRegular">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-ManropeBold">Tour Management</h1>
                            <p className="text-gray-600 mt-1 font-ManropeRegular">Manage and track all tour requests</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${viewMode === 'list'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                List View
                            </button>
                            <button
                                onClick={() => setViewMode('daily')}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${viewMode === 'daily'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Daily View
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                    <div className="space-y-4">
                        {/* Search and Status Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search tours by name, email, phone, or property..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <Select
                                    options={[
                                        { value: 'all', label: 'All Statuses' },
                                        ...Object.values(TOUR_STATUS_TYPES).map(type => ({
                                            value: type,
                                            label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
                                        }))
                                    ]}
                                    value={{ value: statusFilter, label: statusFilter === 'all' ? 'All Statuses' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1).toLowerCase() }}
                                    onChange={(option) => handleStatusFilterChange(option?.value || 'all')}
                                    className="w-full"
                                    classNamePrefix="react-select"
                                    placeholder="Filter by status"
                                />
                            </div>
                        </div>

                        {/* Date Range and Sort Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Date Range */}
                            <div className="flex space-x-2">
                                <input
                                    type="date"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    value={dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : ''}
                                    onChange={(e) => handleDateRangeChange(e.target.value ? new Date(e.target.value) : null, dateRange[1])}
                                    placeholder="Start Date"
                                />
                                <input
                                    type="date"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    value={dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : ''}
                                    onChange={(e) => handleDateRangeChange(dateRange[0], e.target.value ? new Date(e.target.value) : null)}
                                    placeholder="End Date"
                                />
                            </div>

                            {/* Sort By */}
                            <div>
                                <Select
                                    options={[
                                        { value: 'createdAt', label: 'Created Date' },
                                        { value: 'preferredDate', label: 'Tour Date' },
                                        { value: 'fullName', label: 'Visitor Name' },
                                        { value: 'status', label: 'Status' }
                                    ]}
                                    value={{ value: sortBy, label: sortBy === 'createdAt' ? 'Created Date' : sortBy === 'preferredDate' ? 'Tour Date' : sortBy === 'fullName' ? 'Visitor Name' : 'Status' }}
                                    onChange={(option) => setSortBy(option?.value || 'createdAt')}
                                    className="w-full"
                                    classNamePrefix="react-select"
                                    placeholder="Sort by"
                                />
                            </div>

                            {/* Sort Order */}
                            <div>
                                <Select
                                    options={[
                                        { value: 'DESC', label: 'Descending' },
                                        { value: 'ASC', label: 'Ascending' }
                                    ]}
                                    value={{ value: sortOrder, label: sortOrder === 'DESC' ? 'Descending' : 'Ascending' }}
                                    onChange={(option) => setSortOrder(option?.value || 'DESC')}
                                    className="w-full"
                                    classNamePrefix="react-select"
                                    placeholder="Sort order"
                                />
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSearch}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold text-blue-600">{pagination?.totalItems || tourData.length || 0}</div>
                                <div className="text-xs sm:text-sm text-gray-500">Total Requests</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold text-green-600">
                                    {tourData?.filter(t => (t.status || '').toUpperCase() === TOUR_TYPES.pending).length || 0}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">Pending</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                                    {tourData?.filter(t => (t.status || '').toUpperCase() === TOUR_TYPES.confirmed).length || 0}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">Confirmed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold text-red-600">
                                    {tourData?.filter(t => (t.status || '').toUpperCase() === TOUR_TYPES.cancelled).length || 0}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">Cancelled</div>
                            </div>
                        </div>

                        {/* Active Filters Summary */}
                        <div className="flex flex-wrap gap-2">
                            {searchTerm && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Search: {searchTerm}
                                </span>
                            )}
                            {statusFilter !== 'all' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Status: {statusFilter}
                                </span>
                            )}
                            {dateRange[0] && dateRange[1] && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Date: {format(dateRange[0], 'MMM d')} - {format(dateRange[1], 'MMM d')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4 border-gray-200"></div>
                        <span className="ml-3 text-gray-600">Loading tour requests...</span>
                    </div>
                )}

                {/* Content */}
                {!isLoading && (
                    <>
                        {viewMode === 'daily' ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Calendar */}
                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Calendar</h3>
                                        {/* Add calendar component here */}
                                        <p className="text-gray-500">Calendar view coming soon...</p>
                                    </div>
                                </div>

                                {/* Daily View */}
                                <div className="lg:col-span-2">
                                    <DailyView bookings={tourData} selectedDate={selectedDate} />
                                </div>
                            </div>
                        ) : (
                            /* List View */
                            <div className="space-y-4">
                                {tourData?.map((tour) => (
                                    <motion.div
                                        key={tour.tourRequestId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="p-4 sm:p-6">
                                            {/* Header */}
                                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                                                        <FaCalendarAlt className="text-blue-600 h-4 w-4 sm:h-5 sm:w-5" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                                                            Tour #{tour.tourRequestId!.slice(0, 8)}
                                                        </h2>
                                                        <p className="text-xs sm:text-sm text-gray-500">
                                                            {format(parseISO(tour.preferredDate), 'MMM d, yyyy h:mm a')}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${statusColors[tour.status!]}`}>
                                                        {statusIcons[tour.status!]}
                                                        <span className="ml-1">{tour.status!.charAt(0).toUpperCase() + tour.status!.slice(1)}</span>
                                                    </span>

                                                    <div className="relative">
                                                        <Select
                                                            options={Object.values(TOUR_STATUS_TYPES).map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() }))}
                                                            value={{
                                                                value: tour.status!,
                                                                label: tour.status!.charAt(0).toUpperCase() + tour.status!.slice(1)
                                                            }}
                                                            onChange={(option) => handleStatusUpdate(option?.value as TOUR_TYPES, tour.tourRequestId!)}
                                                            className="w-32"
                                                            classNamePrefix="react-select"
                                                            placeholder="Update status"
                                                            menuPlacement="auto"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                                {/* Property Column */}
                                                <div>
                                                    <div className="flex items-start mb-4">
                                                        <div className="w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden mr-3 sm:mr-4 border border-gray-200 shadow-sm">
                                                            <ImageWithLoader
                                                                src={tour.Property?.images && tour.Property.images.length > 0
                                                                    ? `${base_url.replace(/\/$/, '')}/${String(tour.Property.images[0]).replace(/^\//, '')}`
                                                                    : "/assets/placeholder/house_placeholder.png"}
                                                                alt={tour.Property?.propertyName || 'Property'}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-medium text-gray-900 text-xs sm:text-sm">{tour.Property?.propertyName}</h3>
                                                            <p className="text-xs text-gray-500 mt-1">{tour.Property?.address}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* User Column */}
                                                <div>
                                                    <TourRequestDetail
                                                        icon={<FaUser />}
                                                        label="Visitor"
                                                        value={tour.fullName}
                                                    />
                                                    <TourRequestDetail
                                                        icon={<FaEnvelope />}
                                                        label="Email"
                                                        value={tour.email}
                                                    />
                                                    <TourRequestDetail
                                                        icon={<FaClock />}
                                                        label="Phone"
                                                        value={tour.phone || 'N/A'}
                                                    />
                                                </div>

                                                {/* Details Column */}
                                                <div className="flex flex-col justify-between">
                                                    <div>
                                                        <TourRequestDetail
                                                            icon={<FaMapMarkerAlt />}
                                                            label="Property Type"
                                                            value={tour.Property?.propertyType || 'N/A'}
                                                        />
                                                        <TourRequestDetail
                                                            icon={<FaHistory />}
                                                            label="Requested On"
                                                            value={tour.createdAt ? format(parseISO(tour.createdAt), 'MMM d, yyyy') : 'N/A'}
                                                        />
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                                        <button
                                                            onClick={() => openTourDetailModal(tour)}
                                                            className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-100 transition-colors"
                                                        >
                                                            <FaEye className="inline mr-1" />
                                                            View Details
                                                        </button>
                                                        <button
                                                            onClick={() => openRescheduleModal(tour)}
                                                            className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-green-100 transition-colors"
                                                        >
                                                            <FaCalendar className="inline mr-1" />
                                                            Reschedule
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Pagination */}
                                <Pagination />

                                {/* Empty State */}
                                {tourData?.length === 0 && !isLoading && (
                                    <div className="text-center py-12">
                                        <FaCalendar className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tour requests found</h3>
                                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            <AnimatePresence>
                {updateTourStatusConfirmation && (
                    <ConfirmationModal
                        title="Update Tour Status"
                        message={`Are you sure you want to update this tour status to ${activeTourStatus}?`}
                        confirmText="Update"
                        cancelText="Cancel"
                        onOpen={updateTourStatusConfirmation}
                        onClose={() => setUpdateTourStatusConfirmation(false)}
                        onConfirm={confirmStatusUpdate}
                    />
                )}

                {toggleDetailModal && detailModalTourData && (
                    <AdminTourBookingDetail
                        tour={detailModalTourData}
                        onClose={() => setToggleDetailModal(false)}
                    />
                )}

                {showRescheduleModal && selectedTourForReschedule && (
                    <TourRescheduleModal
                        tour={selectedTourForReschedule}
                        isOpen={showRescheduleModal}
                        onClose={closeRescheduleModal}
                        onSuccess={() => {
                            loadNotifications();
                        }}
                    />
                )}

                {isProcessing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-b-4 border-gray-200 mb-4"></div>
                            <span className="text-white text-lg font-semibold">Processing...</span>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminTourBookingList;