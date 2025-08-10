import { useEffect, useState } from 'react';
import { BsCalendar, BsClock } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { useTour } from '../../context/TourRequestContext';
import ConfirmationModal from '../ConfirmationModal';
import { CalendarPopup } from './CalendarPopup';
import ContactAgentModal from './ContactAgentModal';
// Removed unused DateDisplay import
import { useTranslation } from 'react-i18next';
import ScheduleTourPopup, { TourFormData } from './ScheduleTourPopup';

interface ScheduleTourCardProps {
    propertyId: string;
}

export default function ScheduleTourCard({ propertyId }: ScheduleTourCardProps) {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showSchedulePopup, setShowSchedulePopup] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isCheckingBookingStatus, setIsCheckingBookingStatus] = useState(false);
    const { createTourRequest } = useTour();
    const { getCanBookStatus, canBookTourStatus, setCanBookTourStatus, propertyById } = useProperty()
    const { user } = useAuth();
    const [showContactModal, setShowContactModal] = useState(false);

    // Only reset booking status when propertyId or user.id changes
    useEffect(() => {
        setCanBookTourStatus(null);
    }, [propertyId, user?.id, setCanBookTourStatus]);

    // Only fetch booking status when propertyId and user.id are defined and booking status is null
    useEffect(() => {
        if (user?.id && propertyId && canBookTourStatus === null) {
            setIsCheckingBookingStatus(true);
            getCanBookStatus({ propertyId: propertyId }).finally(() => {
                setIsCheckingBookingStatus(false);
            });
        }
    }, [propertyId, user?.id, canBookTourStatus, getCanBookStatus]);

    console.log(canBookTourStatus)
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setShowCalendar(false);
    };
    const handleMonthNavigate = (direction: number) => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };
    const handleScheduleSubmit = async (tourData: TourFormData) => {
        const result = await createTourRequest({
            fullName: tourData.name,
            phone: tourData.phone,
            email: tourData.email,
            preferredTime: tourData.time,
            preferredDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
            propertyId,
            userId: user?.id,
        });

        if (result.success) {
            // Immediately update the booking status to hide the schedule tour component
            setCanBookTourStatus(false);

            // Also refresh the booking status from the server
            getCanBookStatus({ propertyId });
        }

        setShowSchedulePopup(false);
        setSelectedDate(null);
        setShowSuccessModal(true);
    };
    const handleButtonClick = () => {
        if (selectedDate) {
            setShowSchedulePopup(true);
        } else {
            setShowCalendar(true);
        }
    };

    // Find property address from context or props (fallback to empty string)
    const propertyAddress = propertyById?.address || '';

    return (
        <div className="max-w-md mx-auto p-0 ">
            <div className="py-6 px-6 w-full rounded-lg border-2 border-gray-200">
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-9">
                        <div className="flex flex-col gap-2">
                            <span className="font-semibold text-xl text-gray-800">{t('Schedule a tour')}</span>
                            <div className="flex justify-between items-center">
                                {isCheckingBookingStatus ? (
                                    <span className="text-gray-500">{t('Checking booking status...')}</span>
                                ) : canBookTourStatus === true ? (
                                    <>
                                        <span className="font-medium text-sm text-gray-500">{t('Choose your date')}</span>
                                        <button className="text-blue-600 text-sm font-medium hover:underline" onClick={() => setShowCalendar(true)} type="button">
                                            {t('View calendar')}
                                        </button>
                                    </>
                                ) : (
                                    <span className='font-ManropeBold text-gray-500'>{t('Already Booked a Tour for a Property, You can only Book a tour once the existing tour is completed')}</span>
                                )}
                            </div>
                        </div>
                        {
                            !isCheckingBookingStatus && canBookTourStatus === true && (
                                <button
                                    onClick={handleButtonClick}
                                    className="bg-blue-600 hover:bg-blue-700 font-medium py-3 text-white w-full rounded-lg flex justify-center items-center gap-2 transition-colors"
                                    type="button"
                                >
                                    {selectedDate ? (
                                        <>
                                            <BsClock size={20} />
                                            {t('Schedule Tour')}
                                        </>
                                    ) : (
                                        <>
                                            <BsCalendar size={20} />
                                            {t('Select date')}
                                        </>
                                    )}
                                </button>
                            )
                        }
                    </div>
                    <div className="h-0.5 w-[90%] self-center bg-gray-200"></div>
                    <div className="flex flex-col gap-3 w-full">
                        <span className="font-semibold text-xl">{t('More About this Property')}</span>
                        <button
                            className="font-medium border-2 border-blue-200 mt-5 py-3 text-blue-600 w-full rounded-3xl flex justify-center items-center hover:bg-blue-50 transition-colors"
                            type="button"
                            onClick={() => setShowContactModal(true)}
                        >
                            {t('Contact Agent')}
                        </button>
                    </div>
                </div>
            </div>
            <ScheduleTourPopup
                show={showSchedulePopup}
                selectedDate={selectedDate}
                onClose={() => setShowSchedulePopup(false)}
                onSubmit={handleScheduleSubmit}
                user={user}
            />
            <CalendarPopup
                showCalendar={showCalendar}
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onClose={() => setShowCalendar(false)}
                onDateSelect={handleDateSelect}
                onMonthNavigate={handleMonthNavigate}
            />
            <ConfirmationModal
                onOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onConfirm={async () => { }}
                title="Tour Booked!"
                message="Your tour has been successfully scheduled. We will contact you soon."
                confirmText="OK"
                cancelText=""
                type="success"
            />
            <ContactAgentModal
                open={showContactModal}
                onClose={() => setShowContactModal(false)}
                propertyAddress={propertyAddress}
            />
        </div>
    );
} 