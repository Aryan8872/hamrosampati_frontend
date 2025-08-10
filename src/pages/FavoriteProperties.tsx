import { easeOut, motion } from "framer-motion";
import { useState } from 'react';
import { FaBath, FaHeart, FaMapMarkerAlt, FaRulerCombined } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useAddToFavorite, useUserFavorites } from '../hooks/useFavorites';
import { PropertyType } from '../types/payloadType';

const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: easeOut },
    viewport: { once: true, amount: 0.1 },
});

const FavoritesPage = () => {
    const { user } = useAuth();
    const userId = user?.id ?? "";
    const base_url = import.meta.env.VITE_BASE_URL;
    const { data: favoriteProperties } = useUserFavorites(userId);
    const { mutateAsync: addFavorite } = useAddToFavorite();

    const [favoritesStatus, setFavoritesStatus] = useState<Record<string, boolean>>({});

    if (!user?.id) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500">Loading your favorites...</p>
            </div>
        );
    }

    const handleFavoriteToggle = async (propertyId: string) => {
        try {
            const result = await addFavorite({ propertyId, userId });

            setFavoritesStatus(prev => ({
                ...prev,
                [propertyId]: result.isFavorited,
            }));

            toast.success(
                result.isFavorited
                    ? "Property added to favorites!"
                    : "Property removed from favorites!"
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to update favorites");
        }
    };

    if (!favoriteProperties || favoriteProperties.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50">
                <div className="text-center max-w-md px-4">
                    <FaHeart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No favorites yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        You haven't added any properties to your favorites. Start exploring and save your favorite properties.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    Your Favorite Properties
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {favoriteProperties.map((favorite, index) => {
                        const property: PropertyType = favorite.property;
                        if (!property) return null;

                        return (
                            <motion.div
                                key={property.propertyId}
                                {...fadeInUp(index * 0.1)}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="relative">
                                    <motion.img
                                        src={`${base_url.replace(/\/$/, '')}/${String(property.images?.[0])?.replace(/^\//, '')}`}
                                        alt={property.propertyName}
                                        loading="lazy"
                                        className="w-full h-48 object-cover"
                                        transition={{ duration: 0.3 }}
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = "/assets/placeholder/house_placeholder.png";
                                        }}
                                    />
                                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                        {property.propertyType}
                                    </div>
                                    <button
                                        onClick={() => handleFavoriteToggle(property.propertyId!)}
                                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                                    >
                                        <motion.div
                                            animate={{
                                                scale: favoritesStatus[property.propertyId!] ? [1, 1.2, 1] : 1,
                                                transition: { duration: 0.3 }
                                            }}
                                        >
                                            <FaHeart
                                                className="h-5 w-5"
                                                fill={"red"}
                                                stroke="currentColor"
                                            />
                                        </motion.div>
                                    </button>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                                            {property.propertyName}
                                        </h3>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                            {property.bedrooms} Beds
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm mb-3">
                                        <FaMapMarkerAlt className="mr-1 text-blue-500 flex-shrink-0" />
                                        <span className="line-clamp-1">{property.address}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm mb-4">
                                        <div className="flex items-center">
                                            <FaRulerCombined className="mr-1 flex-shrink-0" />
                                            <span>{property.areaTotal} sqft</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaBath className="mr-1 flex-shrink-0" />
                                            <span>{property.bathrooms} Baths</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">Price</p>
                                                <p className="font-bold text-blue-600 text-lg">
                                                    ${Number(property.propertyPrice).toLocaleString()}
                                                </p>
                                            </div>
                                            <PrimaryButton
                                                to={`/property-detail/${property.propertyId}`}
                                                text="Details"
                                                className="text-xs px-3 py-2 ml-2 flex-shrink-0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default FavoritesPage;
