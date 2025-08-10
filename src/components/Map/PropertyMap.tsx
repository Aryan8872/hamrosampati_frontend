import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

interface PropertyMapProps {
    latitude: number;
    longitude: number;
    propertyName: string;
    address: string;
}

const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const PropertyMap: React.FC<PropertyMapProps> = ({
    latitude,
    longitude,
    propertyName,
    address,
}) => {
    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const center: [number, number] = [latitude, longitude];

    return (
        <MapContainer
            center={center}
            key={`${latitude}-${longitude}`} 
            zoom={15}
            style={{ height: '100%', zIndex:'20', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
                position={center}
                icon={defaultIcon}
                eventHandlers={{
                    click: () => setShowInfoWindow(true),
                    popupclose: () => setShowInfoWindow(false),
                }}
            >
                {showInfoWindow && (
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-bold text-sm">{propertyName}</h3>
                            <p className="text-xs">{address}</p>
                            <p className="text-xs text-blue-600 mt-1 cursor-pointer">
                                <a
                                    href={`https://www.openstreetmap.org/directions?from=&to=${latitude},${longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Get Directions
                                </a>
                            </p>
                        </div>
                    </Popup>
                )}
            </Marker>
        </MapContainer>
    );
};

export default PropertyMap;
