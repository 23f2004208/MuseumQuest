import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Museum data
const museums = [
  {
    id: 1,
    name: "The Louvre",
    lat: 48.8606,
    lng: 2.3376,
    country: "France",
    yearFounded: 1793,
    description: "The world's largest art museum and historic monument in Paris, housing masterpieces including the Mona Lisa and Venus de Milo."
  },
  {
    id: 2,
    name: "British Museum",
    lat: 51.5194,
    lng: -0.1270,
    country: "United Kingdom",
    yearFounded: 1753,
    description: "A public museum dedicated to human history, art and culture in London, featuring the Rosetta Stone and Egyptian mummies."
  },
  {
    id: 3,
    name: "Metropolitan Museum of Art",
    lat: 40.7794,
    lng: -73.9632,
    country: "United States",
    yearFounded: 1870,
    description: "The largest art museum in the United States, located in New York City, with over 2 million works spanning 5,000 years."
  },
  {
    id: 4,
    name: "Vatican Museums",
    lat: 41.9065,
    lng: 12.4536,
    country: "Vatican City",
    yearFounded: 1506,
    description: "Art and Christian museums displaying works from the papal collection, including the Sistine Chapel ceiling by Michelangelo."
  },
  {
    id: 5,
    name: "Rijksmuseum",
    lat: 52.3600,
    lng: 4.8852,
    country: "Netherlands",
    yearFounded: 1800,
    description: "Dutch national museum dedicated to arts and history in Amsterdam, featuring works by Rembrandt and Vermeer."
  },
  {
    id: 6,
    name: "National Museum of China",
    lat: 39.9042,
    lng: 116.3974,
    country: "China",
    yearFounded: 2003,
    description: "Museum of Chinese art and history in Beijing, showcasing over 1 million artifacts from ancient to modern China."
  },
  {
    id: 7,
    name: "State Hermitage Museum",
    lat: 59.9398,
    lng: 30.3146,
    country: "Russia",
    yearFounded: 1764,
    description: "Museum of art and culture in Saint Petersburg, one of the largest and oldest museums in the world."
  },
  {
    id: 8,
    name: "Museo Nacional del Prado",
    lat: 40.4138,
    lng: -3.6921,
    country: "Spain",
    yearFounded: 1819,
    description: "Spain's main national art museum in Madrid, featuring Spanish, Italian and Flemish art including works by Velázquez and Goya."
  },
  {
    id: 9,
    name: "Egyptian Museum",
    lat: 30.0478,
    lng: 31.2336,
    country: "Egypt",
    yearFounded: 1902,
    description: "Home to extensive collection of ancient Egyptian antiquities in Cairo, including treasures from Tutankhamun's tomb."
  },
  {
    id: 10,
    name: "Smithsonian National Museum of Natural History",
    lat: 38.8913,
    lng: -77.0261,
    country: "United States",
    yearFounded: 1910,
    description: "Natural history museum in Washington D.C., featuring the Hope Diamond, dinosaur fossils, and human origins exhibits."
  }
];

function App() {
  const [selectedMuseum, setSelectedMuseum] = useState(null);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {/* Map */}
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
              click: () => setSelectedMuseum(museum)
            }}
          >
            <Popup>
              <div>
                <strong>{museum.name}</strong>
                <p>{museum.country}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Museum Detail Modal */}
      {selectedMuseum && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedMuseum(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedMuseum(null)}
            >
              ×
            </button>

            <h2>{selectedMuseum.name}</h2>
            <p><strong>Country:</strong> {selectedMuseum.country}</p>
            <p><strong>Founded:</strong> {selectedMuseum.yearFounded}</p>
            <p>{selectedMuseum.description}</p>

            <div className="tabs">
              <button>About</button>
              <button>Images</button>
              <button>Quiz</button>
              <button>Ask AI</button>
            </div>

            <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
              (Your team will build the content for each tab here)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;