import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';

// Fix Icon Marker Leaflet yang sering hilang di React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41] // Agar ujung pin pas di titik klik
});
L.Marker.prototype.options.icon = DefaultIcon;

// Komponen Pembantu untuk menangani Klik User
function LocationMarker({ onLocationSelect }) {
    const [position, setPosition] = useState(null);
    
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            // Kirim data lat/lng ke induk komponen
            onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function MapPicker({ onLocationSelect }) {
    // Koordinat Default (Indonesia Tengah) atau Jakarta
    const center = [-6.200000, 106.816666]; 

    return (
        <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300 z-0">
            <MapContainer center={center} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                {/* Skin Peta (OpenStreetMap) */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationSelect={onLocationSelect} />
            </MapContainer>
        </div>
    );
}