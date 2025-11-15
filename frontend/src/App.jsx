import { Routes, Route } from 'react-router-dom';
import MapPage from './pages/MapPage';
import MuseumDetail from './pages/MuseumDetail';
import './App.css';
import PassportPage from './pages/PassportPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/museum/:id" element={<MuseumDetail />} />
      <Route path="/passport" element={<PassportPage />} />  {/* ADD THIS */}
    </Routes>
  );
}

export default App;