import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Load Leaflet CSS
import { FaBath, FaMapMarkerAlt, FaRulerCombined } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";

import PrimaryButton from "../components/buttons/PrimaryButton";
import MapBounds from "../components/MapBounds/MapBounds";
import { useSearch } from "../context/SearchContext";
import ImageWithLoader from "../components/ImageLoader";


// Animation variants
const fadeInUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

// Define custom red marker icon
const redIcon = new L.Icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [1, -40],
});


const PrimeLocationDetail = () => {
  const { city } = useParams<{ city: string }>();
  const { useSearchProperties, setCurrentPropertyPageWithSession, setPropertyQueryParamsWithSession, setPrimeLocationQuery } = useSearch()
  setPropertyQueryParamsWithSession("")
  setCurrentPropertyPageWithSession(1)
  setPrimeLocationQuery(`district=${city}`)
  const navigate = useNavigate()
  const { data } = useSearchProperties()
  console.log(data)
  const properties = data?.properties
  const base_url = import.meta.env.VITE_BASE_URL
  // const location = city ? cityData[city.toLowerCase()] : null;

  // if (!location) {
  //   return <div className="text-center text-xl font-bold mt-10">Location not found</div>;
  // }

  return (
    <div className="max-w-[1400px] mx-auto p-6 ">
      <div className="flex flex-col lg:flex-row gap-6">

        <div className="lg:w-2/3 w-full">
          <h2 className="text-2xl font-bold mb-6">Properties in {city}</h2>
          {properties?.length === 0 ? (
            <p className="text-gray-500">No properties found in this location.</p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6"
            >
              {properties?.map((property, index) => (
                <motion.div
                  key={property.propertyId}
                  {...fadeInUp(index * 0.1)}
                  whileHover={{ y: -5 }}
                  onClick={()=>navigate(`/property-detail/${property.propertyId}`)}
                  className="bg-white cursor-pointer rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative">
                    <ImageWithLoader
                      src={`${base_url.replace(/\/$/, '')}/${String(property.images![0])?.replace(/^\//, '')}`}
                      alt={property.propertyName}
                      className="w-full h-48 object-cover"
                    />
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
                      <span className="line-clamp-1">{property.city}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm mb-4">
                      <div className="flex items-center">
                        <FaRulerCombined className="mr-1 flex-shrink-0" />
                        <span>{property.areaTotal}</span>
                      </div>
                      <div className="flex flex-row gap-6">

                        <div className="flex items-center">
                          <FaBath className="mr-1 flex-shrink-0" />
                          <span>{property.bathrooms} Bathrooms</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-bold text-blue-600 text-lg">
                            Rs {property.propertyPrice}
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
              ))}
            </motion.div>
          )}
        </div>

        <div className="min-w-[250px] sm:min-w-[300px] md:min-w-[720px] w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-md sticky top-20">
          <MapContainer
            center={[27.7172, 85.3240]} // Default center (Kathmandu)
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {properties
              ?.filter(
                (place) =>
                  place.latitude! >= 26 &&
                  place.latitude! <= 31 &&
                  place.longitude! >= 80 &&
                  place.longitude! <= 89
              )
              .map((place, index) => (
                <Marker
                  key={index}
                  position={[place.latitude!, place.longitude!]}
                  icon={redIcon}
                >
                  <Tooltip direction="top" offset={[0, -30]} permanent>
                    {place.propertyName}
                  </Tooltip>
                  <Popup>{place.propertyName}</Popup>
                </Marker>
              ))}

            {/* Auto-fit bounds using valid marker positions */}
            <MapBounds
              markers={
                properties
                  ?.filter(
                    (place) =>
                      place.latitude! >= 26 &&
                      place.latitude! <= 31 &&
                      place.longitude! >= 80 &&
                      place.longitude! <= 89
                  )
                  .map((place) => [place.latitude!, place.longitude!]) || []
              }
            />
          </MapContainer>

        </div>
      </div>
    </div>
  );
};

export default PrimeLocationDetail;