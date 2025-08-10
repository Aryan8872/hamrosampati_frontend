import { motion } from 'framer-motion';
import { TourDataType } from '../../types/payloadType';

type BookingListProps = {
    bookings: TourDataType[];
};

const BookingList = ({ bookings }: BookingListProps) => {
    if (!bookings)
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 animate-pulse">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="h-14 bg-gray-200"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    return (
        <div className="space-y-4">
            {bookings.map((booking, index) => (
                <motion.div
                    key={booking.tourRequestId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                        x: 5,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200"
                >
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                            src={booking.Property?.images![0].toString()}
                            alt={booking.Property?.propertyName}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src = "/assets/placeholder/house_placeholder.png"
                            }}
                        />
                    </div>

                    <div className="flex-1">
                        <h4 className=" font-ManropeMedium text-gray-900">{booking.Property?.propertyName}</h4>
                        <p className="text-sm font-ManropeRegular text-gray-500 mt-1">
                            Booked by {booking.User?.fullName} • {booking.preferredDate}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <p className="font-ManropeMedium text-gray-900">${booking.Property?.propertyPrice.toLocaleString()}/mo</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );

};

export default BookingList;