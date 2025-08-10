import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { useState } from "react";
import { FaChevronDown, FaCity, FaListAlt, FaSearch } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { City, District, LISTING_TYPES, PROPERTY_TYPES } from "../types/enumTypes";


const HeroSectionSearch = () => {
    const { setPropertyQueryParamsWithSession, setCurrentPropertyPageWithSession } = useSearch()
    const navigate = useNavigate()
    const [selectedCity, setSelectedCity] = useState<string>("")
    const [cityQuery, setCityQuery] = useState("")
    const [listingTypeQuery, setListingTypeQuery] = useState("")
    const [propertyTypeQuery, setPropertyTypeQuery] = useState("")
    const [selectedListingType, setSelectedListingType] = useState<string>("")
    const [selectedPropertyType, setSelectedPropertyType] = useState<string>("")
    const [selectedDistrict, setSelectedDistrict] = useState<string>("")
    const [districtQuery, setDistrictQuery] = useState<string>("")
    const applyFilters = () => {
        const query: string[] = []
        const queryParams = new URLSearchParams();

        if (selectedCity) {
            query.push(`city=${selectedCity}`)
            queryParams.set("city", selectedCity);

        }
        if (selectedListingType) {
            query.push(`listingType=${selectedListingType}`)
            queryParams.set("listingType", selectedListingType);

        }

        if (selectedPropertyType) {
            query.push(`propertyType=${selectedPropertyType}`)
            queryParams.set("propertyType", selectedPropertyType);

        }
        if (selectedDistrict) {
            query.push(`district=${selectedDistrict}`)
            queryParams.set("district", selectedDistrict);
        }



        setPropertyQueryParamsWithSession(query.join("&"))
        setCurrentPropertyPageWithSession(1)
        const queryString = queryParams.toString();
        navigate(`/all-properties?${queryString}`);

    }



    const filteredCity =
        cityQuery === '' ?
            Object.values(City) :
            Object.values(City).filter((city) => {
                return city.toLowerCase().includes(cityQuery.toLowerCase())
            })
    const filteredDistrict =
        districtQuery === '' ?
            Object.values(District) :
            Object.values(District).filter((dist) => {
                return dist.toLowerCase().includes(districtQuery.toLowerCase())
            })
    const filteredPropertyType =
        propertyTypeQuery === "" ?
            Object.values(PROPERTY_TYPES) :
            Object.values(PROPERTY_TYPES).filter((type) => {
                return type.toLowerCase().includes(propertyTypeQuery.toLowerCase())
            })

    const filteredListingType =
        listingTypeQuery === "" ?
            Object.values(LISTING_TYPES) :
            Object.values(LISTING_TYPES).filter((type) => {
                return type.toLocaleLowerCase().includes(listingTypeQuery.toLowerCase())
            })


    const handleSearch = () => {
        applyFilters()
    }

    const districtCityMap = {
        "Kathmandu": [
            "Baneshwor", "Thamel", "Kalanki", "Boudha", "Kirtipur", "Maharajgunj", "Baluwatar", "Chabahil", "Gaushala", "Dillibazar", "Teku", "Putalisadak", "Samakhusi", "New Road", "Sundhara", "Swayambhu", "Naxal", "Gongabu", "Koteshwor", "Sankhamul", "Dhumbarahi", "Satdobato"
        ],
        "Lalitpur": [
            "Jawalakhel", "Patan", "Satdobato", "Pulchowk", "Ekantakuna", "Lagankhel", "Bhaisepati", "Bungamati", "Chapagaun", "Lubhu", "Sunakothi", "Khokana", "Godawari", "Tikabhairab", "Thaiba", "Nakhipot", "Dhapakhel", "Harisiddhi"
        ],
        "Bhaktapur": [
            "Suryabinayak", "Kamalbinayak", "Dattatreya", "Taumadhi", "Thimi", "Changunarayan", "Balkot", "Jagati", "Sipadol", "Madhyapur Thimi", "Nagadesh", "Katunje", "Bode", "Sallaghari", "Lokanthali", "Suryabinayak Temple Area", "Byasi", "Tathali"
        ],
        "Jhapa": ["Birtamode", "Damak", "Mechinagar", "Kakarvitta"],
        "Morang": ["Biratnagar", "Urlabari", "Rangeli", "Letang"],
        "Chitwan": ["Bharatpur", "Ratnanagar", "Narayangarh"],
        "Pokhara": ["Lakeside", "Bagar", "New Road", "Mahendrapul"],
        "Kaski": ["Pokhara", "Lekhnath", "Batulechaur"],
        "Dhanusha": ["Janakpur", "Bateshwar", "Mukhiyapatti"],
        "Sunsari": ["Itahari", "Inaruwa", "Duhabi", "Dharan"]
    };

    const cityOptions = districtCityMap[selectedDistrict] || [];

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-6 py-6 mb-3 mx-2 sm:mx-0 w-full max-w-screen-2xl">
            <div className="flex flex-col gap-5">
                <span className="font-ManropeBold text-2xl text-gray-800">Find your desired property</span>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm  text-gray-600 flex items-center gap-2">
                            <FaListAlt className="font-ManropeRegular text-gray-500" /> Looking For
                        </label>
                        <Combobox value={selectedListingType} onChange={(e) => setSelectedListingType(e!)}>
                            <div className="relative">
                                <div className="relative flex items-center">
                                    <ComboboxInput
                                        displayValue={() => selectedListingType || "Select type"}
                                        onChange={(event) => setListingTypeQuery(event.target.value)}
                                        className="w-full font-ManropeMedium rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <FaChevronDown className="h-4 w-4 text-gray-500" />
                                    </ComboboxButton>
                                </div>
                                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {filteredListingType.map((type) => (
                                        <ComboboxOption
                                            key={type}
                                            value={type}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                        {type}
                                                    </span>
                                                </>
                                            )}
                                        </ComboboxOption>
                                    ))}
                                </ComboboxOptions>
                            </div>
                        </Combobox>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600 flex items-center gap-2">
                            <FaCity className="font-ManropeMedium text-gray-500" /> District
                        </label>
                        <Combobox value={selectedDistrict} onChange={(district) => {
                            setSelectedDistrict(district);
                            setSelectedCity("");
                        }}>
                            <div className="relative">
                                <div className="relative flex items-center">
                                    <ComboboxInput
                                        displayValue={() => selectedDistrict || "Select District"}
                                        onChange={(event) => setDistrictQuery(event.target.value)}
                                        className="w-full font-ManropeRegular rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <FaChevronDown className="h-4 w-4 text-gray-500" />
                                    </ComboboxButton>
                                </div>
                                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {filteredDistrict.map((dist) => (
                                        <ComboboxOption
                                            key={dist}
                                            value={dist}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                        {dist}
                                                    </span>
                                                </>
                                            )}
                                        </ComboboxOption>
                                    ))}
                                </ComboboxOptions>
                            </div>
                        </Combobox>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <FaCity className="font-ManropeRegular text-gray-500" /> City
                        </label>
                        <Combobox value={selectedCity} onChange={setSelectedCity}>
                            <div className="relative">
                                <div className="relative flex items-center">
                                    <ComboboxInput
                                        displayValue={() => selectedCity || "Select city"}
                                        onChange={(event) => setCityQuery(event.target.value)}
                                        className="w-full font-ManropeRegular rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <FaChevronDown className="h-4 w-4 text-gray-500" />
                                    </ComboboxButton>
                                </div>
                                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {cityOptions.map((city) => (
                                        <ComboboxOption
                                            key={city}
                                            value={city}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                        {city}
                                                    </span>
                                                </>
                                            )}
                                        </ComboboxOption>
                                    ))}
                                </ComboboxOptions>
                            </div>
                        </Combobox>
                    </div>



                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                            <MdCategory className="font-ManropeRegular text-gray-500" /> Property Type
                        </label>
                        <Combobox value={selectedPropertyType} onChange={(e) => setSelectedPropertyType(e!)}>
                            <div className="relative">
                                <div className="relative flex items-center">
                                    <ComboboxInput
                                        displayValue={() => selectedPropertyType || "Select type"}
                                        onChange={(event) => setPropertyTypeQuery(event.target.value)}
                                        className="w-full font-ManropeMedium rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        <FaChevronDown className="h-4 w-4 text-gray-500" />
                                    </ComboboxButton>
                                </div>
                                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {filteredPropertyType.map((type) => (
                                        <ComboboxOption
                                            key={type}
                                            value={type}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                                }`
                                            }
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                        {type}
                                                    </span>
                                                </>
                                            )}
                                        </ComboboxOption>
                                    ))}
                                </ComboboxOptions>
                            </div>
                        </Combobox>
                    </div>

                    <div className="flex  items-end h-full">
                        <button
                            onClick={handleSearch}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2.5 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <FaSearch className="h-4 w-4" />
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSectionSearch
