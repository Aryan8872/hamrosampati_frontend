import { AnimatePresence, motion, spring } from "framer-motion";
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { FaBath, FaBed, FaBuilding, FaChair, FaChartArea, FaCouch, FaDumbbell, FaFire, FaParking, FaRegQuestionCircle, FaSnowflake, FaSwimmingPool, FaTshirt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropertyMap from '../components/Map/PropertyMap';
import ScheduleTourCard from '../components/Tour/ScheduleTourCard';
import TourRequestForm from '../components/Tour/TourRequestForm';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { useTour } from '../context/TourRequestContext';
import { useAddToFavorite } from '../hooks/useFavorites';
import { Amenity } from '../types/enumTypes';

const amenityIconMap: Record<Amenity, JSX.Element> = {
    [Amenity.Parking]: <FaParking />,
    [Amenity.Pool]: <FaSwimmingPool />,
    [Amenity.Gym]: <FaDumbbell />,
    [Amenity.Laundry]: <FaTshirt />,
    [Amenity.AC]: <FaSnowflake />,
    [Amenity.Heating]: <FaFire />,
    [Amenity.Balcony]: <FaChair />,
    [Amenity.Furnished]: <FaCouch />,
    [Amenity.Elevator]: <FaBuilding />
};

const TheDetailPage = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isFavorite, setIsFavorite] = useState(false);
    const [latitude, setLatitude] = useState<number>()
    const [longitude, setLongitude] = useState<number>()
    const { mutateAsync: addFavorite } = useAddToFavorite()
    const { propertyById, getPropertyById, getCanBookStatus, canBookTourStatus, checkFavoriteStatus } = useProperty()
    const { user, isAuthenticated } = useAuth()
    const userId = user?.id
    const { propertyId } = useParams()
    const [hasBooked, setHasBooked] = useState(false)
    const { isLoading } = useTour();

    useEffect(() => {
        const fetchStatus = async () => {
            const res = await checkFavoriteStatus(propertyId!);
            setIsFavorite(res.isFavorited);
            // Remove getCanBookStatus from here to avoid repeated requests
        };
        fetchStatus();
    }, [propertyId, isAuthenticated, user?.id, checkFavoriteStatus]);

    // Remove the effect that clears propertyById
    // Only fetch the property for the current propertyId
    useEffect(() => {
        if (propertyId) {
            getPropertyById(propertyId);
        }
        // Optionally, clear propertyById on unmount if needed:
        // return () => setPropertyById(null);
    }, [propertyId, getPropertyById]);

    useEffect(() => {
        setLatitude(propertyById?.latitude)
        setLongitude(propertyById?.longitude)
    }, [propertyById])


    const [isRequestTour, setIsRequestTour] = useState(false)


    const base_url = import.meta.env.VITE_BASE_URL

    const handleFavoriteToggle = async () => {
        const result = await addFavorite({ propertyId: propertyId!, userId: userId! })
        setIsFavorite(result.isFavorited);
        toast.success(
            result.isFavorited === true
                ? "Property added to favorites!"
                : "Property removed from favorites!"
        );
        console.log(isFavorite)
    };

    interface DragEvent {
        offset: {
            x: number;
            y: number;
        };
        velocity: {
            x: number;
            y: number;
        };
    }

    const slideVariants = {
        hidden: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: spring,
                stiffness: 300,
                damping: 30,
            },
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            transition: {
                type: spring,
                stiffness: 300,
                damping: 30,
            },
        }),
    };

    const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent,
        { offset, velocity }: DragEvent) => {
        const swipe = swipePower(offset.x, velocity.x);

        if (swipe < -swipeConfidenceThreshold) {
            paginate(1);
        } else if (swipe > swipeConfidenceThreshold) {
            paginate(-1);
        }
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        const imagesLength = propertyById?.images?.length ?? 0;
        const newIndex = (selectedImage + newDirection + imagesLength) % imagesLength;
        setSelectedImage(newIndex);
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const thumbnailVariants = {
        initial: { opacity: 0.6, scale: 0.9 },
        selected: { opacity: 1, scale: 1 },
        hover: { opacity: 0.8, scale: 0.95 },
    };

    const buttonVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
    };

    const mapVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.7,
                duration: 0.5
            }
        }
    };

    const handleImageSelect = (index: number) => {
        setDirection(index > selectedImage ? 1 : -1);
        setSelectedImage(index);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed) return;

        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        setMousePosition({ x, y });
    };

    const handleBookingSuccess = async () => {
        setIsRequestTour(false);
        await getCanBookStatus({ propertyId: propertyId! });
        setHasBooked(true);
    };

    if (latitude === undefined || longitude === undefined) return <div>Loading</div>
    if (!propertyById || !propertyById.propertyId) return <div>Loading...</div>;
    const center: [number, number] = [latitude, longitude];

    return (
        <div className='relative min-h-screen'>
            {/* Loading Overlay for Tour Booking - always shown when isRequestTour && isLoading */}
            {isRequestTour && isLoading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex flex-col items-center">
                        <svg className="animate-spin h-12 w-12 text-white mb-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        <span className="text-white text-lg font-semibold">Booking your tour...</span>
                    </div>
                </div>
            )}
            <div className="py-8 max-w-[1400px] xl:mx-auto p-4 sm:p-6 bg-gray-50 rounded-xl shadow-lg">
                {/* Image Gallery Section */}
                <div className="flex flex-col gap-4 sm:gap-6">
                    {/* Thumbnail column */}

                    <div
                        className="relative flex-1 min-h-[350px] sm:min-h-[450px] md:h-[600px] overflow-hidden rounded-xl bg-gray-100 shadow-lg"
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={selectedImage}
                                custom={direction}
                                variants={slideVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={1}
                                onDragEnd={handleDragEnd}
                                className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
                                style={{
                                    transformOrigin: isZoomed ? `${mousePosition.x * 100}% ${mousePosition.y * 100}%` : 'center center',
                                    transition: isZoomed ? 'none' : 'transform 0.3s ease-out',
                                    transform: isZoomed ? 'scale(1)' : 'scale(1)'
                                }}
                            >
                                <img
                                    src={`${base_url.replace(/\/$/, '')}/${String(propertyById.images![selectedImage])?.replace(/^\//, '')}`}
                                    alt={`Property view ${selectedImage + 1}`}
                                    className="absolute top-0 left-0 w-full h-full object-contain aspect-square"
                                    draggable="false"
                                />
                            </motion.div>
                        </AnimatePresence>


                        {/* Navigation dots */}
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                            {propertyById?.images!.map((_, index) => (
                                <motion.button
                                    key={index}
                                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${selectedImage === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    onClick={() => handleImageSelect(index)}
                                    whileHover={{ scale: 1.5 }}
                                    whileTap={{ scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-row w-full gap-2 sm:gap-3 justify-center ">
                        {propertyById?.images!.map((image, index) => (
                            <motion.div
                                key={index}
                                className={`relative cursor-pointer rounded-lg overflow-hidden shadow-md ${selectedImage === index ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'}`}
                                onClick={() => handleImageSelect(index)}
                                initial="initial"
                                animate={selectedImage === index ? "selected" : "initial"}
                                whileHover="hover"
                                variants={thumbnailVariants}
                                transition={{ duration: 0.2 }}
                            >
                                <img
                                    src={`${base_url.replace(/\/$/, '')}/${String(image)?.replace(/^\//, '')}`}
                                    alt={`Property thumbnail ${index + 1}`}
                                    className="w-full h-20 sm:h-14 md:h-40 object-cover aspect-video"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* Main Content Area - 2 Column Layout */}
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mt-6 sm:mt-12">
                    {/* Left Column - Property Details */}
                    <div className="flex flex-col flex-1">
                        <div className='flex flex-col sm:flex-row gap-4 sm:gap-5'>
                            <div>
                                <motion.h1
                                    className="text-[22px] sm:text-2xl lg:text-3xl font-bold text-gray-800"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {propertyById?.propertyName}
                                </motion.h1>

                                <motion.p
                                    className="text-base sm:text-lg text-gray-600 mt-4 flex items-center"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                >
                                    <p className="text-xl  font-ManropeSemiBold text-gray-900">$ {propertyById?.propertyPrice.toLocaleString()}</p>

                                </motion.p>
                            </div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4"
                        >
                            <div className='flex items-center mb-4'>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                {propertyById?.address}, {propertyById?.district}
                            </div>

                            <div className='flex items-center text-sm gap-5 mb-4'>
                                <span className='flex items-center gap-3 font-ManropeRegular'>
                                    <FaBed />{propertyById.bedrooms} Beds
                                </span>
                                <span className='flex items-center gap-3 font-ManropeRegular'>
                                    <FaBath />{propertyById.bathrooms} Baths
                                </span>

                                <span className='flex items-center gap-3 font-ManropeRegular'>
                                    <FaChartArea />{propertyById.areaTotal} Sq ft
                                </span>
                            </div>
                            <p className="text-sm text-green-600 mt-1">{propertyById?.status}</p>
                            <p className="text-xs text-gray-500 mt-1">Plus includes all applicable taxes</p>
                        </motion.div>
                        <motion.div
                            className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >

                        </motion.div>
                        {
                            isAuthenticated && <motion.div
                                className="flex flex-row gap-4 lg:pb-7 sm:gap-6"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <motion.button
                                    className="flex  sm:h-max items-center justify-center bg-white border border-gray-300 text-gray-800 py-3 px-4 sm:py-4 sm:px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    onClick={handleFavoriteToggle}
                                    variants={buttonVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <motion.svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill={isFavorite ? "red" : "none"}
                                        stroke={isFavorite ? "red" : "currentColor"}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2"
                                        initial={{ scale: 1 }}
                                        animate={{
                                            scale: isFavorite ? [1, 1.2, 1] : 1,
                                            transition: { duration: 0.3 }
                                        }}
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </motion.svg>
                                    <span className="hidden sm:inline">Favorite</span>
                                </motion.button>

                            </motion.div>
                        }
                        <motion.div
                            className="lg:hidden w-full md:w-[95%] flex flex-col justify-center items-center my-6 rounded-xl overflow-hidden shadow-lg bg-white"
                            variants={mapVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Map Header */}
                            <div className="flex flex-col w-full p-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Property Location</h2>
                                <div className="flex items-start mt-2">
                                    <svg className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-sm text-gray-600 leading-tight">{propertyById?.address}</p>
                                </div>
                            </div>

                            <div className="relative z-[20] h-64 md:h-80 w-[95%] lg:w-[80%] lg:mx-auto">

                                {center[0] !== 0 && center[1] !== 0 && (

                                    <PropertyMap
                                        latitude={latitude}
                                        longitude={longitude}
                                        propertyName={propertyById.propertyName}
                                        address={propertyById.address}
                                    />
                                )}
                                <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded-md shadow-sm text-xs">
                                    <span>Move to explore</span>
                                </div>
                            </div>



                        </motion.div>
                        <motion.div
                            className="space-y-4 sm:space-y-6 xl:mr-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="">
                                <div className='flex flex-col gap-6'>
                                    <div className="flex justify-between items-center font-medium text-lg sm:text-xl">
                                        <span className='font-ManropeBold text-xl'>Property Details</span>
                                    </div>

                                    <div className='flex flex-col gap-5 font-ManropeMedium border-b-2'>
                                        <section className='flex flex-col gap-3'>
                                            <p className='break-words'>
                                                {propertyById.description}

                                            </p>

                                            <span className='mt-4'>For More Information please contact Hari ram, Our Area specialist on <strong>+9779815016727</strong> </span>
                                        </section>

                                        <p className=''>
                                            <span className='font-ManropeBold text-xl'>Facilities & Amneties</span>


                                            <div className="text-gray-600  mt-6">
                                                <div className="grid grid-cols-3 gap-y-3 mb-4 text-sm sm:text-base">
                                                    {propertyById.amneties?.map((amenity, idx) => (
                                                        <div
                                                            key={`${amenity}-${idx}`}
                                                            className="flex items-center gap-1 font-ManropeMedium mb-2 text-sm sm:text-base"
                                                        >
                                                            {amenityIconMap[amenity as Amenity] ?? <FaRegQuestionCircle />}
                                                            {amenity}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>


                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {
                        isAuthenticated && propertyById?.propertyId && (
                            <ScheduleTourCard propertyId={propertyById.propertyId} />
                        )
                    }


                </div>

                {/* Map for desktop  */}
                <div className="hidden lg:flex mt-7 flex-col md:w-[450px] lg:w-[800px]">
                    <motion.div
                        className="h-[450px] flex flex-col rounded-xl overflow-hidden shadow-lg bg-white"
                        variants={mapVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Property Location</h2>
                            <p className="text-sm text-gray-600 mt-1">{propertyById.address}</p>
                        </div>
                        <div className="flex-1 relative z-[20]">
                            {center[0] !== 0 && center[1] !== 0 && (
                                <PropertyMap
                                    latitude={latitude}
                                    longitude={longitude}
                                    propertyName={propertyById.propertyName}
                                    address={propertyById.address}
                                />

                            )}
                        </div>
                        <div className="p-3 bg-gray-50 border-t border-gray-200">
                            <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Move and zoom the map to explore the neighborhood</span>
                            </div>
                        </div>
                    </motion.div>

                </div>

            </div>


            {/* Modal for booking form - keep its own condition */}
            {isRequestTour && canBookTourStatus && !hasBooked && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4 sm:px-6">
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-screen overflow-y-auto py-8 sm:p-8">
                        <button
                            onClick={() => {
                                setIsRequestTour(false);
                            }}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>
                        <TourRequestForm onSuccess={handleBookingSuccess} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TheDetailPage;