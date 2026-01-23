import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Icon Marker
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView({ lat, lng }) {
    // Validasi koordinat (jika null, default ke Jakarta)
    const position = [lat || -6.200, lng || 106.816];

    return (
        <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-300 z-0 relative shadow-sm">
            <MapContainer 
                center={position} 
                zoom={13} 
                scrollWheelZoom={false} // Matikan scroll zoom agar tidak mengganggu scroll halaman
                dragging={false}        // Matikan geser peta (opsional, biar statis)
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>Lokasi Kejadian</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}