// components/MapBounds.tsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MapBounds = ({ markers }: { markers: [number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
};

export default MapBounds;
