import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { museums } from '../data/museums';

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Map({ onMuseumClick }) {
    return (
        <MapContainer
            center={[20, 0]} // Centered on world view
            zoom={2}
            style={{ height: '100vh', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {museums.map(museum => (
                <Marker
                    key={museum.id}
                    position={[museum.lat, museum.lng]}
                    eventHandlers={{
                        click: () => {
                            if (onMuseumClick) {
                                onMuseumClick(museum);
                            }
                        }
                    }}
                >
                    <Popup>
                        <div>
                            <h3>{museum.name}</h3>
                            <p>{museum.country}</p>
                            <button onClick={() => onMuseumClick && onMuseumClick(museum)}>
                                View Details
                            </button>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default Map;