import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { museums } from '../data/museums';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapComponent() {
    const navigate = useNavigate();

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: '100%', width: '100%' }}
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
                            click: () => navigate(`/museum/${museum.id}`)
                        }}
                    >
                        <Popup>
                            <div>
                                <strong>{museum.name}</strong>
                                <p>{museum.country}</p>
                                <button
                                    onClick={() => navigate(`/museum/${museum.id}`)}
                                    style={{ marginTop: '8px', padding: '4px 8px', cursor: 'pointer' }}
                                >
                                    View Details
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

export default MapComponent;
