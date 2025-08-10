import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { easeOut, motion } from "framer-motion";
import { useState } from 'react';
import {
    FaBath,
    FaFilter,
    FaMapMarkerAlt,
    FaRulerCombined,
    FaSearch
} from "react-icons/fa";
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PrimaryButton from '../components/buttons/PrimaryButton';
import TheFilter from "../components/filter/TheFilter";
import { useProperty } from "../context/PropertyContext";
import { useSearch } from "../context/SearchContext";
import Footer from '../footer/Footer';
import { SESSION_STORAGE_KEYS } from "../types/enumTypes";

const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: easeOut },
    viewport: { once: true, amount: 0.1 },
});

const AllProperties = () => {
    const [keyword, setKeyword] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const { setSearchKeyword, setPropertyQueryParamsWithSession, useSearchProperties, setCurrentPropertyPageWithSession } = useSearch();
    const { data, isLoading } = useSearchProperties();
    const { getPropertyById } = useProperty()
    // const { t } = useTranslation();
    const totalPages = data?.totalPages ?? 1
    const currentPage = data?.currentPage ?? 1
    const base_url = import.meta.env.VITE_BASE_URL
    const navigate = useNavigate()
    const handleKeywordChange = () => {
        setSearchKeyword(keyword);
        setCurrentPropertyPageWithSession(1);
    };

    const handleSortOption = (query: string) => {
        const sessionQueryParams = sessionStorage.getItem(SESSION_STORAGE_KEYS.PropertyQueryParams)
        setSortOption(query)
        if (sessionQueryParams) {
            const cleanedQueryParams = sessionQueryParams
                .split("&")
                .filter(param => !param.startsWith("sortBy="))
                .join("&");

            const newQuery = cleanedQueryParams
                ? `${cleanedQueryParams}&sortBy=${query}`
                : `sortBy=${query}`;

            setPropertyQueryParamsWithSession(newQuery);
        } else {
            setPropertyQueryParamsWithSession(`sortBy=${query}`);
        }
    }

    return (
        <>
            <div className="relative bg-gray-50 min-h-screen">
                {/* Mobile Filter Button */}
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="md:hidden fixed bottom-6 right-6 z-30 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
                    aria-label="Open filters"
                >
                    <FaFilter size={20} />
                </button>

                {/* Mobile Filter Overlay */}
                {showMobileFilters && (
                    <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
                        <div className="absolute inset-0" onClick={() => setShowMobileFilters(false)}></div>
                        <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform">
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="text-gray-500 hover:text-gray-700 p-1"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4">
                                    <TheFilter />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <section className='container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8'>
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar - Desktop - Simplified Structure */}
                        <aside className="hidden lg:block w-80 flex-shrink-0">
                            <div className="sticky top-6">
                                <TheFilter />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 ">
                            {/* Search and Filter Bar */}
                            <div className="w-[465px] bg-white rounded-xl shadow-sm p-4 mb-6">
                                <div className="flex flex-col md:flex-row gap-4 items-center">
                                    <div className="relative ">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaSearch className="text-gray-400" />
                                        </div>
                                        <input
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="Search for properties..."
                                            type="text"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleKeywordChange()} />
                                    </div>
                                    <div className="flex gap-3 w-full md:w-auto">
                                        <PrimaryButton
                                            to=""
                                            className="w-full md:w-auto py-3 px-6 rounded-lg"
                                            onClick={handleKeywordChange}
                                            text="Search" />
                                        <button
                                            onClick={() => setShowMobileFilters(true)}
                                            className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <FaFilter className="text-blue-600" />
                                            <span>Filters</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Results Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <div className="space-y-1">
                                    {keyword && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Search:</span> "{keyword}"
                                        </p>
                                    )}
                                    {sortOption && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Sorted by:</span>{" "}
                                            {sortOption === "recent"
                                                ? "Most Recent"
                                                : sortOption === "price_asc"
                                                    ? "Price: Low to High"
                                                    : "Price: High to Low"}
                                        </p>
                                    )}
                                    <p className="text-sm font-medium text-gray-700">
                                        {data?.properties.length ?? 0} properties found
                                    </p>
                                </div>

                                <Menu as="div" className="relative">
                                    <MenuButton className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                                        <span className="text-sm font-medium">Sort by</span>
                                        <FiChevronDown className="text-gray-400" />
                                    </MenuButton>
                                    <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => handleSortOption("recent")}
                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm w-full text-left`}
                                                    >
                                                        Most Recent
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => handleSortOption("price_asc")}
                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm w-full text-left`}
                                                    >
                                                        Price: Low to High
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => handleSortOption("price_desc")}
                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm w-full text-left`}
                                                    >
                                                        Price: High to Low
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </MenuItems>
                                </Menu>
                            </div>

                            {/* Property Grid */}
                            {isLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 animate-pulse">
                                    {[...Array(8)].map((_, index) => (
                                        <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                            <div className="h-48 bg-gray-200"></div>
                                            <div className="p-4 space-y-3">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                                <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {data?.properties.length ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
                                        >
                                            {data.properties.map((property, index) => (
                                                <motion.div
                                                    onClick={() => navigate(`/property-detail/${property.propertyId}`)}
                                                    key={property.propertyId}
                                                    {...fadeInUp(index * 0.1)}
                                                    whileHover={{ y: -5 }}
                                                    className="bg-white cursor-pointer rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                                                >
                                                    <div className="relative">
                                                        <motion.img
                                                            src={`${base_url.replace(/\/$/, '')}/${String(property.images![0])?.replace(/^\//, '')}`}
                                                            alt={property.propertyName}
                                                            loading="lazy"
                                                            className="w-full h-48 object-cover"
                                                            transition={{ duration: 0.3 }}
                                                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                                e.currentTarget.onerror = null;
                                                                e.currentTarget.src = "/assets/placeholder/house_placeholder.png";
                                                            }} />
                                                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                            {property.propertyType}
                                                        </div>
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
                                                                        ¥{property.propertyPrice.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                                <PrimaryButton
                                                                    to={`/property-detail/${property.propertyId}`}
                                                                    onClick={() => getPropertyById(property.propertyId!)}
                                                                    text="Details"
                                                                    className="text-xs px-3 py-2 ml-2 flex-shrink-0" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                            <div className="max-w-md mx-auto">
                                                <div className="mb-4">
                                                    <FaSearch className="mx-auto text-gray-300 text-4xl mb-4" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-700 mb-2">No properties found</h3>
                                                <p className="text-gray-500">Try adjusting your search or filter criteria to find more properties</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-start mt-10">
                                    <nav className="flex items-center space-x-2">
                                        <motion.button
                                            whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setCurrentPropertyPageWithSession((p) => Math.max(p - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiChevronLeft className="w-5 h-5" />
                                        </motion.button>
                                        {/* Improved pagination logic */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(page =>
                                                page === 1 ||
                                                page === totalPages ||
                                                Math.abs(page - currentPage) <= 1
                                            )
                                            .reduce((acc, page, idx, arr) => {
                                                if (idx > 0 && page - arr[idx - 1] > 1) {
                                                    acc.push('ellipsis');
                                                }
                                                acc.push(page);
                                                return acc;
                                            }, [] as (number | 'ellipsis')[])
                                            .map((page, idx) =>
                                                page === 'ellipsis' ? (
                                                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                                                ) : (
                                                    <motion.button
                                                        key={page}
                                                        whileHover={{ scale: 1.05 }}
                                                        onClick={() => setCurrentPropertyPageWithSession(page as number)}
                                                        className={`px-4 py-2 rounded-md font-medium ${currentPage === page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {page}
                                                    </motion.button>
                                                )
                                            )}
                                        <motion.button
                                            whileHover={{ backgroundColor: 'rgba(243, 244, 246, 1)' }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setCurrentPropertyPageWithSession((p) => Math.min(p + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiChevronRight className="w-5 h-5" />
                                        </motion.button>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div><Footer />
        </>

    );
};

export default AllProperties;