import { AnimatePresence, motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

// Fix for default marker icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type LocationPickerModalProps = {
    isOpen: boolean;
    onClose: () => void;
    lat: number | "";
    lng: number | "";
    onChange: (lat: number, lng: number) => void;
};

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
    isOpen,
    onClose,
    lat,
    lng,
    onChange
}) => {
    const [position, setPosition] = useState<[number, number] | null>(
        lat && lng ? [Number(lat), Number(lng)] : null,
    );

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                const p: [number, number] = [e.latlng.lat, e.latlng.lng];
                setPosition(p);
                onChange(p[0], p[1]);
            },
        });
        return null;
    };

    const SearchControl: React.FC = () => {
        const map = useMap();
        const [query, setQuery] = useState("");
        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (containerRef.current) {
                L.DomEvent.disableClickPropagation(containerRef.current);
                L.DomEvent.disableScrollPropagation(containerRef.current);
            }
        }, []);

        const handleSearch = async () => {
            if (!query) return;
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
            const [first] = await res.json();
            if (first) {
                const p: [number, number] = [parseFloat(first.lat), parseFloat(first.lon)];
                map.setView(p, 13);
                setPosition(p);
                onChange(p[0], p[1]);
            } else alert("Location not found");
        };

        return (
            <div
                ref={containerRef}
                style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 1000,
                    background: "white",
                    padding: "4px",
                    borderRadius: "4px",
                    boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                    pointerEvents: "auto",
                }}
            >
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search location..."
                    className="p-1 rounded-l border border-gray-300"
                />
                <button
                    onClick={handleSearch}
                    className="p-1 bg-blue-500 text-white rounded-r"
                >
                    Go
                </button>
            </div>
        );
    };

    return (
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
                            <h2 className="text-xl font-ManropeBold text-gray-800">Select Location</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 transition"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="w-full h-96 rounded-lg overflow-hidden border">
                                <MapContainer
                                    center={position || [27.7, 85.3]}
                                    zoom={position ? 13 : 7}
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <MapEvents />
                                    <SearchControl />
                                    {position && <Marker position={position} />}
                                </MapContainer>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1">
                                        Latitude
                                    </label>
                                    <input
                                        value={position?.[0] || ""}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (!isNaN(val) && position) {
                                                const newPos: [number, number] = [val, position[1]];
                                                setPosition(newPos);
                                                onChange(newPos[0], newPos[1]);
                                            }
                                        }}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-ManropeSemiBold text-gray-700 mb-1">
                                        Longitude
                                    </label>
                                    <input
                                        value={position?.[1] || ""}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (!isNaN(val) && position) {
                                                const newPos: [number, number] = [position[0], val];
                                                setPosition(newPos);
                                                onChange(newPos[0], newPos[1]);
                                            }
                                        }}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
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
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (position) {
                                        onChange(position[0], position[1]);
                                        onClose();
                                    }
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Confirm Location
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LocationPickerModal;