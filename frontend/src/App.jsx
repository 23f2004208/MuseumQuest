import { Routes, Route } from 'react-router-dom';
import MapPage from './pages/MapPage';
import MuseumDetail from './pages/MuseumDetail';
import './App.css';
import PassportPage from './pages/PassportPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/museum/:id" element={<MuseumDetail />} />
      <Route path="/passport" element={<PassportPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;