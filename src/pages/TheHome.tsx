import { useTranslation } from "react-i18next";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Readyto from "../components/HomeReadyto/Readyto";
import PrimeSwiper from "../components/swiper/PrimeSwiper";
import TheSwiper from "../components/swiper/TheSwiper";
import TrustedAdvisorsSection from "../components/trusted advisor/TrustedAdvisors";
import { useProperty } from "../context/PropertyContext";
import HeroSection from "../herobar/HeroSection";

const TheHome = () => {
    const { t } = useTranslation();
    const { useGetAllFeaturedProperty, useGetAllRecentProperties } = useProperty()
    const { data: featuredProperty, isLoading } = useGetAllFeaturedProperty()
    const featuredProperties = featuredProperty?.properties
    const navigate = useNavigate()
    const { data: recentProperty } = useGetAllRecentProperties()
    const recentProperties = recentProperty?.recentProperties

    // Loading skeleton for properties section only
    const renderPropertySkeleton = () => (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden">
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
            <span className="mt-8 inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#2563eb]"></span>
        </div>
    );

    // Empty state for properties section only
    const renderEmptyProperties = () => (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <span className="text-2xl font-semibold text-gray-700 mb-2">{t('No properties available')}</span>
            <span className="text-gray-500">{t('Please check back later or adjust your search criteria.')}</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-12">
            <HeroSection />

            <div className="flex flex-col gap-3 bg-white">
                {/* <p className="text-center text-2xl font-semibold">Discover Prime Locations</p> */}
                <PrimeSwiper />
            </div>

            {/* Featured Properties Section */}
            <div className="md:px-6 lg:px-5 bg-white py-10">
                <div className="flex flex-col gap-8 sm:container sm:mx-auto">
                    <section className="flex px-3 md:px-0 justify-between w-full">
                        <span className="flex items-center sm:items-start sm:flex-col gap-3">
                            <h1 className="text-2xl font-ManropeMedium sm:text-3xl xl:text-3xl font-bold">{t("Featured Properties")}</h1>
                            <h3 className="font-ManropeRegular hidden sm:block text-[15px] opacity-55 max-w-60 sm:max-w-md md:max-w-md text-left">{t('Discover our handpicked featured properties')}</h3>
                        </span>
                        <div onClick={() => navigate("/all-properties")} className="flex py-6">
                            <button className="hidden md:block  text-white bg-buttonColor py-2 px-2 md:py-3 md:px-3  rounded-md items-center">
                                <span className="flex items-center gap-3">
                                    {t('See All Properties')}
                                    <FaArrowRight />
                                </span>
                            </button>

                            <button className="flex text-sm sm:text-base  md:hidden text-white bg-buttonColor py-2 px-2  gap-3 rounded-md items-center">
                                {t('See All')}
                                <FaArrowRight />
                            </button>
                        </div>
                    </section>

                    {isLoading ? (
                        renderPropertySkeleton()
                    ) : featuredProperties?.length ? (
                        <TheSwiper properties={featuredProperties} />
                    ) : (
                        renderEmptyProperties()
                    )}
                </div>
            </div>

            <div className="md:px-6 py-10">
                <Readyto />
            </div>

            {/* Recent Properties Section */}
            <div className="bg-white py-10">
                <div className="flex flex-col gap-8 sm:container sm:mx-auto">
                    <section className="flex px-3 md:px-0 justify-between w-full">
                        <span className="flex items-center sm:items-start sm:flex-col gap-3">
                            <h1 className="text-2xl font-ManropeMedium xl:text-3xl font-bold">{t("Recent Properties")}</h1>
                            <h3 className="font-ManropeRegular hidden sm:block text-[15px] opacity-55 max-w-60 sm:max-w-md md:max-w-md text-left">{t('Check out our latest property listings')}</h3>
                        </span>
                        <div onClick={() => navigate("/all-properties")} className="flex py-6">
                            <button className="hidden md:block  text-white bg-buttonColor py-2 px-2 md:py-3 md:px-3  rounded-md items-center">
                                <span className="flex items-center gap-3">
                                    {t('See All Properties')}
                                    <FaArrowRight />
                                </span>
                            </button>

                            <button className="flex text-sm sm:text-base  md:hidden text-white bg-buttonColor py-2 px-2  gap-3 rounded-md items-center">
                                {t('See All')}
                                <FaArrowRight />
                            </button>
                        </div>
                    </section>

                    <div className="relative ">
                        {isLoading ? (
                            renderPropertySkeleton()
                        ) : recentProperties?.length ? (
                            <TheSwiper properties={recentProperties} />
                        ) : (
                            renderEmptyProperties()
                        )}
                    </div>
                </div>
            </div>

            <TrustedAdvisorsSection />
        </div>
    );
};

export default TheHome;
