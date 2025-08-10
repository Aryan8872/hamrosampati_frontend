import { easeOut, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBath, FaBed, FaMapMarkerAlt, FaRulerCombined } from "react-icons/fa";
import { GrNext, GrPrevious } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { Swiper as SwiperClass } from 'swiper';
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "../../index.css";
import { PropertyType } from "../../types/payloadType";
import PrimaryButton from "../buttons/PrimaryButton";
import ImageWithLoader from "../ImageLoader";

const TheSwiper = ({ properties }: { properties: PropertyType[] }) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const { t } = useTranslation();

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const prevRef1 = useRef<HTMLButtonElement | null>(null);
  const nextRef1 = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<{ swiper: SwiperClass } | null>(null);
  const base_url = import.meta.env.VITE_BASE_URL

  const navigate = useNavigate();

  // Fade in animation variants
  const fadeInUp = (delay: number = 0) => ({
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: easeOut },
    viewport: { once: true, amount: 0.1 }
  });

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;
    if (swiperInstance && swiperInstance.params.navigation) {
      if (typeof swiperInstance.params.navigation === 'object') {
        swiperInstance.params.navigation.prevEl = prevRef1.current;
        swiperInstance.params.navigation.nextEl = nextRef1.current;

        if (window.innerWidth >= 768) {
          swiperInstance.params.navigation.prevEl = prevRef.current;
          swiperInstance.params.navigation.nextEl = nextRef.current;
        }
      }

      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, []);

  const loadMoreProperties = () => {
    navigate('/all-properties');
  };

  return (
    <div className="">
      <div className="relative">
        <div className="md:hidden">
          <button
            ref={prevRef1}
            className={`absolute z-30 h-[2.2rem] rounded-sm left-0 top-[11rem] transform -translate-y-1/2 bg-green-50 text-buttonColor hover:bg-green-50 hover:text-green-700 hover:shadow-sm px-2 transition-opacity duration-300 
            ${isBeginning ? "hidden" : "opacity-50 focus:opacity-90"}`}
          >
            <GrPrevious className="text-2xl" />
          </button>

          <button
            ref={nextRef1}
            className={`absolute z-[999] h-[2.2rem] rounded-sm right-0 top-[11rem] transform -translate-y-1/2 bg-green-50 text-buttonColor hover:bg-green-50 hover:text-green-700 hover:shadow-sm px-2 transition-opacity duration-300 
            ${isEnd ? "hidden" : "opacity-50 focus:opacity-90"}`}
          >
            <GrNext className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="hidden md:block">
          <button
            ref={prevRef}
            className={`absolute h-[3rem] left-[46%] -bottom-10  transform  hover:bg-green-50 text-buttonColor hover:text-green-700 hover:shadow-sm px-2 ${isBeginning ? "hidden" : "block"}`}
          >
            <GrPrevious className="text-2xl" />
          </button>

          <button
            ref={nextRef}
            className={`absolute h-[3rem] right-[42%]  -bottom-10 transform  hover:bg-green-50 text-buttonColor hover:text-green-700 hover:shadow-sm px-2 ${isEnd ? "hidden" : "block"}`}
          >
            <GrNext className="text-2xl" />
          </button>
        </div>

        <div className="px-0">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: easeOut }}
            viewport={{ once: true, amount: 0.1 }}
            className="swiper-container"
          >
            <Swiper
              ref={swiperRef}
              spaceBetween={20}
              onSwiper={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              navigation={{
                prevEl: window.innerWidth < 768 ? prevRef1.current : prevRef.current,
                nextEl: window.innerWidth < 768 ? nextRef1.current : nextRef.current,
              }}
              modules={[Navigation]}
              breakpoints={{
                1368: { slidesPerView: 4, spaceBetween: 25 },
                1024: { slidesPerView: 3, spaceBetween: 25 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                480: { slidesPerView: 2, spaceBetween: 20 },
                0: { slidesPerView: 2, spaceBetween: 6 },
              }}
            >
              {properties.map((property, index) => (
                <SwiperSlide key={property.propertyId}>
                  <Link
                    to={`/property-detail/${property.propertyId}`}>
                    <motion.div
                      {...fadeInUp(index * 0.1)}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 h-full"
                    >
                      <div className="relative">
                        {/* Image with loading spinner fallback */}
                        <ImageWithLoader
                          src={`${base_url.replace(/\/$/, '')}/${String(property.images![0])?.replace(/^\//, '')}`}
                          alt={property.propertyName}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute font-ManropeRegular bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          {property.propertyType}
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex font-ManropeBold justify-between items-start mb-2">
                          <h3 className=" text-lg text-gray-800 line-clamp-1">
                            {property.propertyName}
                          </h3>
                          <span className="font-ManropeMedium text-xs hidden sm:block text-gray-500 whitespace-nowrap ml-2">
                            {property.bedrooms} Beds
                          </span>
                        </div>

                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <FaMapMarkerAlt className="mr-1 text-blue-500 flex-shrink-0" />
                          <span className="line-clamp-1 font-ManropeRegular">{property.address || 'Location'}</span>
                        </div>

                        <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row justify-between text-gray-600 text-sm mb-4">
                          <div className="flex items-center">
                            <FaRulerCombined className="mr-1 flex-shrink-0" />
                            <span className="font-ManropeRegular">{property.areaTotal} sqft</span>
                          </div>
                          <div className="flex text-sm text-gray-500 items-center">
                            <FaBath className="mr-1 flex-shrink-0" />
                            <span className="font-ManropeMedium">{property.bathrooms} Baths</span>
                          </div>

                          <span className="flex font-ManropeMedium items-center text-sm  sm:hidden text-gray-500 whitespace-nowrap ">
                            <FaBed className="mr-1 flex-shrink-0" />
                            <span>{property.bedrooms} Beds</span>
                          </span>
                        </div>

                        <div className="border-t border-gray-100 pt-3">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="text-xs text-gray-500">{t("Price")}</p>
                              <p className="font-ManropeBold  text-blue-600 text-lg">
                                Rs.{property.propertyPrice.toLocaleString()}
                              </p>
                            </div>
                            <PrimaryButton
                              to={`/property-detail/${property.propertyId}`}
                              text={t("Details")}
                              className="text-xs hidden md:block font-ManropeRegular px-0 md:px-3 py-2 ml-2 flex-shrink-0"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </SwiperSlide>
              ))}

              <SwiperSlide>
                <motion.div
                  {...fadeInUp(0.1)}
                  className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 flex flex-col gap-3 items-center justify-center h-full min-h-[400px] hover:shadow-md transition-shadow duration-300"
                >
                  <div className="text-center p-8">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🏠</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      {t("Want to see more?")}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                      Discover more amazing properties
                    </p>
                    <button
                      className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-green-700 text-sm font-medium transition-all duration-300 transform hover:scale-105"
                      onClick={loadMoreProperties}
                    >
                      {t("View More Properties")}
                    </button>
                  </div>
                </motion.div>
              </SwiperSlide>
            </Swiper>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TheSwiper;

