import { Routes, Route } from 'react-router-dom';
import MapPage from './pages/MapPage';
import MuseumDetail from './pages/MuseumDetail';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/museum/:id" element={<MuseumDetail />} />
    </Routes>
  );
}

export default App;