
import { Popover } from "@headlessui/react";
import {  useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBed, FaCity, FaSearch } from "react-icons/fa";
import {
    FiCheck,
    FiChevronDown,
    FiDollarSign,
    FiHome,
    FiMapPin,
    FiX
} from "react-icons/fi";
import { useSearch } from "../../context/SearchContext";
import { City, PROPERTY_TYPES } from "../../types/enumTypes";

type FilterPopoverProps = {
    selectedLabel: string;
    children: React.ReactNode;
};

const FilterPopover = ({ selectedLabel, children }: FilterPopoverProps) => (
    <Popover className="relative">
        <Popover.Button className="w-full font-ManropeRegular py-2 px-4 bg-gray-50 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:bg-gray-100 transition-colors">
            <span className="text-gray-700">{selectedLabel}</span>
            <FiChevronDown className="text-gray-400" />
        </Popover.Button>

        <Popover.Panel className="absolute font-ManropeMedium z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            <div className="p-2 space-y-2">{children}</div>
        </Popover.Panel>
    </Popover>
);

type TheFilterProps = {
    closeMobileFilter?: () => void;
};

const TheFilter: React.FC<TheFilterProps> = ({ closeMobileFilter }) => {
    const { t } = useTranslation();
    const { setPropertyQueryParamsWithSession, setCurrentPropertyPageWithSession } =
        useSearch();

    // Change selectedDistrict and selectedCity to be single string values
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedBeds, setSelectedBeds] = useState<string>("Any");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

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

    // Update toggleDistrict and toggleCity to set a single value
    const selectDistrict = (d: string) => {
        setSelectedDistrict(d);
        // Remove city if not in the new district
        setSelectedCity((c) => (districtCityMap[d]?.includes(c) ? c : ""));
    };
    const selectCity = (c: string) => setSelectedCity(c);
    const toggleType = (t: string) =>
        setSelectedTypes((prev) =>
            prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
        );

    const applyFilters = () => {
        const q: string[] = [];
        if (selectedBeds !== "Any") q.push(`bedrooms=${selectedBeds}`);
        if (minPrice) q.push(`minPrice=${minPrice}`);
        if (maxPrice) q.push(`maxPrice=${maxPrice}`);
        if (selectedDistrict) q.push(`district=${selectedDistrict}`);
        if (selectedCity) q.push(`city=${selectedCity}`);
        if (selectedTypes.length) q.push(`propertyType=${selectedTypes.join(",")}`);

        setPropertyQueryParamsWithSession(q.join("&"));
        setCurrentPropertyPageWithSession(1);
        closeMobileFilter?.()
    };

    const resetFilters = () => {
        setSelectedDistrict("");
        setSelectedCity("");
        setSelectedTypes([]);
        setSelectedBeds("Any");
        setMinPrice("");
        setMaxPrice("");
        setPropertyQueryParamsWithSession("");
    };

    // Compute available city options based on selectedDistrict
    const availableCities = selectedDistrict ? districtCityMap[selectedDistrict] || [] : Object.values(City);




    return (
        <div className="space-y-6 w-80">
            {/* Add a section at the top to display selected filters as chips */}
            <div className="flex flex-wrap gap-2 mb-4">
                {selectedDistrict && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedDistrict}
                        <button onClick={() => setSelectedDistrict("")} className="ml-1 text-blue-600 hover:text-blue-900 focus:outline-none">&times;</button>
                    </span>
                )}
                {selectedCity && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {selectedCity}
                        <button onClick={() => setSelectedCity("")} className="ml-1 text-green-600 hover:text-green-900 focus:outline-none">&times;</button>
                    </span>
                )}
                {selectedBeds !== "Any" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {selectedBeds} Beds
                        <button onClick={() => setSelectedBeds("Any")} className="ml-1 text-purple-600 hover:text-purple-900 focus:outline-none">&times;</button>
                    </span>
                )}
                {selectedTypes.map((type) => (
                    <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {type}
                        <button onClick={() => toggleType(type)} className="ml-1 text-yellow-600 hover:text-yellow-900 focus:outline-none">&times;</button>
                    </span>
                ))}
                {minPrice && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Min: ¥{minPrice}
                        <button onClick={() => setMinPrice("")} className="ml-1 text-gray-600 hover:text-gray-900 focus:outline-none">&times;</button>
                    </span>
                )}
                {maxPrice && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Max: ¥{maxPrice}
                        <button onClick={() => setMaxPrice("")} className="ml-1 text-gray-600 hover:text-gray-900 focus:outline-none">&times;</button>
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-ManropeBold text-gray-800">Filters</h2>
                <button
                    onClick={resetFilters}
                    className="text-sm font-ManropeRegular text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                    <FiX size={14} />
                    {t("Reset all")}
                </button>
            </div>

            {/* price range */}
            <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md">
                <h3 className="font-ManropeBold text-gray-800 mb-4 flex items-center gap-2">
                    <FiDollarSign className="text-blue-500" />
                    {t("Price Range")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        {
                            label: t("Min Price"),
                            value: minPrice,
                            setter: setMinPrice,
                            placeholder: "Min"
                        },
                        {
                            label: t("Max Price"),
                            value: maxPrice,
                            setter: setMaxPrice,
                            placeholder: "Max"
                        }
                    ].map(({ label, value, setter, placeholder }) => (
                        <div key={label}>
                            <label className="block text-xs font-ManropeRegular text-gray-500 mb-1">{label}</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                    ¥
                                </span>
                                <input
                                    value={value}
                                    onChange={(e) =>
                                        /^\d*$/.test(e.target.value) && setter(e.target.value)
                                    }
                                    placeholder={placeholder}
                                    inputMode="numeric"
                                    className="w-full pl-8   font-ManropeRegular py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------- District (Popover) ---------- */}
            <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md">
                <h3 className="font-ManropeSemiBold text-gray-800 mb-4 flex items-center gap-2">
                    <FiMapPin className="text-blue-500" />
                    {t("District")}
                </h3>

                <FilterPopover
                    selectedLabel={selectedDistrict ? selectedDistrict : t("Select District")}
                >
                    {Object.keys(districtCityMap).map((d) => (
                        <label
                            key={d}
                            className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-blue-50"
                        >
                            <input
                                type="radio"
                                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                checked={selectedDistrict === d}
                                onChange={() => selectDistrict(d)}
                            />
                            <span className="text-gray-700">{t(d)}</span>
                        </label>
                    ))}
                </FilterPopover>
            </div>

            {/* ---------- City (Popover) ---------- */}
            <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md">
                <h3 className="font-ManropeSemiBold text-gray-800 mb-4 flex items-center gap-2">
                    <FaCity className="text-blue-500" />
                    {t("City")}
                </h3>

                <FilterPopover
                    selectedLabel={selectedCity ? selectedCity : t("Select City")}
                >
                    {availableCities.map((c) => (
                        <label
                            key={c}
                            className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-blue-50"
                        >
                            <input
                                type="radio"
                                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                checked={selectedCity === c}
                                onChange={() => selectCity(c)}
                            />
                            <span className="text-gray-700">{t(c)}</span>
                        </label>
                    ))}
                </FilterPopover>
            </div>

            {/* ---------- Property Type (unchanged) ---------- */}
            <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md">
                <h3 className="font-ManropeSemiBold text-gray-800 mb-4 flex items-center gap-2">
                    <FiHome className="text-blue-500" />
                    {t("Property Type")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(PROPERTY_TYPES).map((type) => (
                        <button
                            key={type}
                            onClick={() => toggleType(type)}
                            className={`py-2 rounded-lg text-sm font-ManropeMedium flex items-center justify-center gap-2 transition-all
                ${selectedTypes.includes(type)
                                    ? "bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-inner"
                                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50"
                                }`}
                        >
                            {selectedTypes.includes(type) ? (
                                <FiCheck className="w-4 h-4" />
                            ) : (
                                <div className="w-4 h-4 border border-gray-300 rounded-sm" />
                            )}
                            {t(type)}
                        </button>
                    ))}
                </div>
            </div>

            {/* ---------- Bedrooms (Popover) ---------- */}
            <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md">
                <h3 className="font-ManropeSemiBold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBed className="text-blue-500" />
                    {t("Bedrooms")}
                </h3>

                <FilterPopover selectedLabel={selectedBeds}>
                    {["Any", "1", "2", "3", "4", "5+"].map((bed) => (
                        <button
                            key={bed}
                            onClick={() => setSelectedBeds(bed)}
                            className={`w-full px-4 py-2 text-left rounded-md flex items-center hover:bg-blue-50 ${selectedBeds === bed ? "text-blue-600 font-medium" : "text-gray-700"
                                }`}
                        >
                            {bed !== "Any" && <FaBed className="w-3 h-3 mr-2" />}
                            {t(bed)}
                            {selectedBeds === bed && <FiCheck className="ml-auto text-blue-500" />}
                        </button>
                    ))}
                </FilterPopover>
            </div>

            {/* apply button */}
            <button
                onClick={applyFilters}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl text-white font-ManropeMedium hover:from-blue-700 hover:to-blue-600 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
                <FaSearch />
                {t("Apply Filters")}
            </button>
        </div>
    );
};

export default TheFilter;
