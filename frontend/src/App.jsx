import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MuseumCard from './pages/MuseumDetail';
import './App.css';
import PassportPage from './pages/PassportPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import QuizPage from './pages/QuizPage';
import ChatbotPage from './pages/ChatbotPage';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/museum/:id" element={<MuseumCard />} />
      <Route path="/passport" element={<PassportPage />} />
      <Route path="/passport/:userId" element={<PassportPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/quiz/:id" element={<QuizPage />} />
      <Route path="/chatbot/:id" element={<ChatbotPage />} />
    </Routes>
  );
}

export default App;
