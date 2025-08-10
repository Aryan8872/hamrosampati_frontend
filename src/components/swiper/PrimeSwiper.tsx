import React from "react";
import { useTranslation } from "react-i18next";



import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { primeLocationCity } from "../../types/sampleData";

const NeighborhoodCard: React.FC<{ name: string; image: string }> = ({ name, image }) => {
  const navigate = useNavigate();
  return (
    <div
      className="relative w-[80%] place-items-center place-content-center h-48 bg-cover bg-center rounded-lg shadow-lg overflow-hidden cursor-pointer"
      style={{ backgroundImage: `url(${image})` }}
      onClick={() => navigate(`/locations/${name}`)}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <h3 className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold">
        {name}
      </h3>
    </div>
  );
};


const PrimeSwiper = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  return (
    <section className="flex px-4 md:px-0 flex-col justify-center items-center gap-3 sm:gap-8 py-10  sm:container sm:mx-auto">
      <section className="flex  justify-between w-full  ">
        <span className="flex w-[56%] xs:w-auto items-center  sm:items-start sm:flex-col gap-3">
          <h1 className="text-2xl font-ManropeMedium sm:text-3xl  font-bold ">{t("Explore Top Locations")}</h1>
          <h3 className="font-ManropeRegular hidden sm:block text-[15px] opacity-55 max-w-60 sm:max-w-md md:max-w-md text-left">Explore properties according to top locations</h3>
        </span>
        <div onClick={()=>navigate("/all-properties")} className="flex py-6">
          <button className="hidden md:block  text-white bg-buttonColor py-2 px-2 md:py-3 md:px-3  rounded-md items-center">
            <span className="flex items-center gap-3">
             { t("See All Properties")}
              <FaArrowRight />
            </span>
          </button>

          <button className="flex text-sm sm:text-base  md:hidden text-white bg-buttonColor py-2 px-2  gap-3 rounded-md items-center">
            {t("See All")}
            <FaArrowRight />
          </button>
        </div>
      </section>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] place-items-center sm:place-items-start place-content-center mt-5 gap-y-8 w-full">
        {primeLocationCity.map((place) => (
          <NeighborhoodCard key={place.name} name={place.name} image={place.image} />
        ))}
      </div>
    </section>
  );
};

export default PrimeSwiper;
