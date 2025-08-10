import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaCity, FaGlobe, FaLandmark } from 'react-icons/fa';
import { FaLocationPinLock } from 'react-icons/fa6';
import { FiDollarSign, FiDroplet, FiHome, FiImage, FiLayers, FiMapPin, FiPlus, FiX } from 'react-icons/fi';
import { MdFiberDvr } from 'react-icons/md';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useProperty } from '../../../../context/PropertyContext';
import { propertySchema } from '../../../../schemas/propertySchema';
import { Amenity, City, District, FURNISHING_TYPES, LISTING_TYPES, PROPERTY_TYPES, STATUS_TYPES } from '../../../../types/enumTypes';
import { PropertyType } from '../../../../types/payloadType';
import { Dropdown } from '../../../Dropdown/DropDown';
import { NumericDropdown } from '../../../Dropdown/NumericDropDown';
import LocationPickerModal from './LocationPickerModal';

type addpropertytype = {
    isOpen: boolean,
    onClose: () => void

}
const AddPropertyModal = ({ isOpen, onClose }: addpropertytype) => {
    const { addProperty } = useProperty();
    const imageUploadRef = useRef<HTMLInputElement | null>(null)
    const [images, setImages] = useState<File[]>([])
    const [amneties, setAmneties] = useState<string[]>([])
    const [selectedBedrooms, setSelectedBedrooms] = useState<string>('')
    const [selectedBathrooms, setSelectedBathrooms] = useState('')
    const [selectedKicthen, setSelectedKitchen] = useState('')
    const [selectedFloorCount, setSelectedFloorCount] = useState('')
    const [pickLocation, setPickLocation] = useState<boolean>(false)
    const [selectedDistrict, setSelectedDistrict] = useState<District | string>("Select a District")
    const [selectedCity, setSelectedCity] = useState<City | string>("Select a City")
    const [formData, setFormData] = useState<PropertyType>({
        propertyName: '',
        address: '',
        areaTotal: '',
        city: '',
        bathrooms: 0,
        bedrooms: 0,
        floorCount: 0,
        district: '',
        furnishingStatus: FURNISHING_TYPES.FURNISHED,
        kitchens: parseInt(selectedKicthen),
        listingType: LISTING_TYPES.SALE,
        propertyPrice: '',
        propertyType: PROPERTY_TYPES.HOUSE,
        yearBuilt: '',
        status: STATUS_TYPES.AVAILABLE,
        latitude: 0,
        longitude: 0,
        isFeatured: false,
        description: '',
        amneties: []
    });

    const handleFieldChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value as any,
        }) as PropertyType);
    };

    const handleSubmit = async () => {
        try {
            if (images.length > 5) {
                toast.error("You can only upload up to 5 images.");
                return;
            }
            console.log(selectedBedrooms)
            const updatedFormData = {
                ...formData,
                bedrooms: parseInt(selectedBedrooms),
                city: selectedCity,
                district: selectedDistrict,
                bathrooms: parseInt(selectedBathrooms),
                floorCount: parseInt(selectedFloorCount),
                kitchens: parseInt(selectedKicthen),
                amneties
            };
            console.log(updatedFormData)


            const parsedData = propertySchema.validate(updatedFormData, { abortEarly: false });
            if (parsedData.error) {
                const errorMessages = parsedData.error.details.map(err => err.message);
                toast.error(
                    <div>
                        <p><strong>Please fix the following:</strong></p>
                        <ul className="list-disc pl-5">
                            {errorMessages.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                ); return;
            }

            const validatedData = updatedFormData;

            const form = new FormData();
            form.append("data", JSON.stringify(validatedData));
            images.forEach(file => {
                form.append("images", file);
            });

            const res = await addProperty(form);
            if (res.success) {
                toast.success("Successfully created property");
                setImages([]);
                onClose();
            } else {
                toast.error("Failed to create property");
            }
        } catch (err: unknown) {
            if (err instanceof z.ZodError) {
                toast.error("Validation Error: " + err.errors[0]?.message);
            } else {
                toast.error("Error submitting property");
                console.error(err);
            }
        }
    };

    const districtCityMap: Record<string, string[]> = {
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

    const cityOptions = districtCityMap[(selectedDistrict as string)] || [];

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="bg-white rounded-xl z-[60] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
                                <h2 className="text-xl font-ManropeBold text-gray-800">Add New Property</h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 transition"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-sm font-ManropeMedium text-gray-700 mb-2 flex items-center">
                                        <FiImage className="mr-2" /> Property Images
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => imageUploadRef.current?.click()}
                                            className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer"
                                        >
                                            <FiPlus size={24} className="text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">Add Photo</span>
                                            <input
                                                type="file"
                                                multiple
                                                ref={imageUploadRef}
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files || []);
                                                    if (files.length + images.length > 5) {
                                                        toast.error("Maximum 5 images allowed.");
                                                        return;
                                                    }
                                                    setImages((prev) => [...prev, ...files]);
                                                }}
                                            />
                                        </motion.div>
                                        {images.map((file, index) => (
                                            <div
                                                key={index}
                                                className=" bg-gray-200 rounded-lg overflow-hidden relative group"
                                            >
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt={`preview-${index}`}
                                                    className="object-cover w-full h-full"
                                                />
                                                <div className="absolute  inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                                                    <button
                                                        type="button"
                                                        className="text-white bg-red-500 rounded-full p-1"
                                                        onClick={() => {
                                                            setImages(images.filter((_, i) => i !== index));
                                                        }}
                                                    >
                                                        <FiX size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1">Property Name</label>
                                        <div className="relative">
                                            <FiHome className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                name='propertyName'
                                                value={formData.propertyName}
                                                onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                                                type="text"
                                                placeholder="e.g. Luxury Downtown Apartment"
                                                className="pl-10 pr-4 text-sm py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1">District</label>
                                        <div className="relative">
                                            <Dropdown
                                                setValuefn={(district) => {
                                                    const d = district as string;
                                                    setSelectedDistrict(d);
                                                    setSelectedCity('Select a City');
                                                    handleFieldChange('district', d);
                                                }}
                                                value={selectedDistrict!}
                                                onChange={handleFieldChange}
                                                options={Object.keys(districtCityMap)}
                                                placeholder='Select a District'
                                                icon={<FaLandmark />}
                                            />
                                        </div>
                                    </div>


                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1">Address</label>
                                        <div className="relative">
                                            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                name='address'
                                                value={formData.address}
                                                onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                                                type="text"
                                                placeholder="e.g. 123 Main St, Downtown"
                                                className="pl-10 pr-4 text-sm py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1">City/Towns/Place</label>
                                        <div className="relative">

                                            <Dropdown
                                                setValuefn={setSelectedCity}
                                                value={selectedCity!}
                                                onChange={handleFieldChange}
                                                options={cityOptions}
                                                placeholder='Select a City'
                                                icon={<FaCity />}


                                            />
                                        </div>
                                    </div>



                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1">Property Type</label>
                                        <select
                                            name='propertyType'
                                            value={formData.propertyType}
                                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                                            className="w-full rounded-lg text-sm font-ManropeRegular  border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Select type</option>
                                            {Object.values(PROPERTY_TYPES).map((types) => (
                                                <option>{types}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1">Monthly Rent ($)</label>
                                        <div className="relative">
                                            <FiDollarSign className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                name='propertyPrice'
                                                value={formData.propertyPrice}
                                                onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                                                placeholder="e.g. 2500"
                                                className="pl-10 pr-4 text-sm py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Property Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1 flex items-center">
                                            <FiLayers className="mr-2" /> Area Total
                                        </label>
                                        <input
                                            name='areaTotal'
                                            value={formData.areaTotal}
                                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                                            placeholder="e.g. 1200"
                                            className="w-full text-sm rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>


                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1 flex items-center">
                                            <FiLayers className="mr-2" /> Year Build
                                        </label>
                                        <input
                                            name='yearBuilt'
                                            value={formData.yearBuilt}
                                            type='date'
                                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                                            placeholder="e.g. 1200"
                                            className="w-full rounded-lg text-sm border font-ManropeRegular border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1 flex items-center">
                                            <MdFiberDvr className="mr-2" /> Bedrooms
                                        </label>
                                        <NumericDropdown
                                            min={1}
                                            max={5}
                                            setValuefn={setSelectedBedrooms}
                                            value={selectedBedrooms}
                                            onChange={handleFieldChange}
                                        />


                                    </div>

                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1 flex items-center">
                                            <FiDroplet className="mr-2" /> Bathrooms
                                        </label>
                                        <NumericDropdown
                                            min={1}
                                            max={5}
                                            setValuefn={setSelectedBathrooms}
                                            value={selectedBathrooms}
                                            onChange={handleFieldChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1 flex items-center">
                                            <FiDroplet className="mr-2" /> Kitchen
                                        </label>
                                        <NumericDropdown
                                            min={1}
                                            max={5}
                                            setValuefn={setSelectedKitchen}
                                            value={selectedKicthen}
                                            onChange={handleFieldChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1 flex items-center">
                                            <FiDroplet className="mr-2" /> Building floor Count
                                        </label>
                                        <NumericDropdown
                                            min={1}
                                            max={5}
                                            setValuefn={setSelectedFloorCount}
                                            value={selectedFloorCount}
                                            onChange={handleFieldChange}
                                        />
                                    </div>


                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1">Listing Type</label>
                                        <select
                                            name='listingType'
                                            value={formData.listingType}
                                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                                            className="w-full rounded-lg border text-sm font-ManropeRegular border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Select type</option>
                                            {Object.values(LISTING_TYPES).map((types) => (
                                                <option>{types}</option>
                                            ))}
                                        </select>
                                    </div>


                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1">Furnishing Type</label>
                                        <select
                                            name='furnishingStatus'
                                            value={formData.furnishingStatus}
                                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                                            className="w-full text-sm font-ManropeRegular rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Select type</option>
                                            {Object.values(FURNISHING_TYPES).map((types) => (
                                                <option>{types}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className=' flex flex-row self-center mt-4'>

                                        <button
                                            className='flex flex-row items-center gap-3 px-3 font-ManropeRegular text-sm rounded-lg cursor-pointer py-2 border border-gray-300'
                                            onClick={() => setPickLocation(!pickLocation)}
                                        >
                                            <FaLocationPinLock />
                                            <span>Pick Location</span>
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1 flex items-center">
                                            <FaGlobe className="mr-2" /> Location Latitude

                                        </label>

                                        <input
                                            name='latitude'
                                            value={formData.latitude}
                                            disabled
                                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                                            className="w-full rounded-lg text-sm border font-ManropeRegular border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />

                                    </div>

                                    <div>
                                        <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1 flex items-center">
                                            <FaGlobe className="mr-2" /> Location Longitude

                                        </label>

                                        <input
                                            name='longitude'
                                            value={formData.longitude}
                                            disabled
                                            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                                            placeholder="e.g. "
                                            className="w-full rounded-lg text-sm border font-ManropeRegular border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />

                                    </div>

                                    <div className='flex items-center justify-center'>

                                        <motion.label
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center space-x-2 cursor-pointer"
                                        >
                                            <input
                                                onChange={(e) =>
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        isFeatured: e.target.checked
                                                    }))
                                                } type="checkbox" className="rounded h-[15px] w-[15px] border-gray-300 text-blue-600 focus:ring-blue-500" />
                                            <span className="text-sm text-gray-700">Featured Property</span>
                                        </motion.label>

                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Amenities</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {Object.values(Amenity).map(amenity => (
                                            <motion.label
                                                whileTap={{ scale: 0.95 }}
                                                key={amenity}
                                                className="flex items-center space-x-2 cursor-pointer"
                                            >
                                                <input type="checkbox" value={amenity}
                                                    checked={amneties.includes(amenity)}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setAmneties(prev =>
                                                            e.target.checked
                                                                ? [...prev, value]  // Add if checked
                                                                : prev.filter(item => item !== value)  // Remove if unchecked
                                                        );
                                                    }}

                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                <span className="text-sm text-gray-700">{amenity}</span>
                                            </motion.label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name='description'
                                        value={formData.description}
                                        onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                                        rows={4}
                                        placeholder="Describe the property features, neighborhood, and any important details..."
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end space-x-3 z-10">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onTap={handleSubmit}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Add Property
                                </motion.button>


                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            <LocationPickerModal
                isOpen={pickLocation}
                onClose={() => setPickLocation(!pickLocation)}
                lat={formData.latitude!}
                lng={formData.longitude!}
                onChange={(lat, lng) => {
                    handleFieldChange("latitude", lat.toString());
                    handleFieldChange("longitude", lng.toString());
                }}
            />

        </>


    );
};

export default AddPropertyModal;