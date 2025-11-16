import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { museums } from '../data/museums';
import confetti from 'canvas-confetti';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { awardStamp } from '../services/firestore';
import { aiAPI } from '../services/api';
import XPNotification from '../components/XPNotification';
import Navigation from '../components/Navigation';
import './ChatbotPage.css';
// Import images for Vite
import louvreImg from '../data/images/louvre.webp';
import smithsonianImg from '../data/images/smithsonian.jpg';
import vaticanImg from '../data/images/vaticanmuseums.webp';
import metropolitanImg from '../data/images/metropolitan.jpg';
import britishMuseumImg from '../data/images/britishmuseum.avif';
import tokyoNationalMuseumImg from '../data/images/tokyo.jpg';
import egyptianMuseumImg from '../data/images/egypt.webp';
import stateHermitageMuseumImg from '../data/images/statehermitage.webp';
import apartheidMuseumImg from '../data/images/apartheidmuseum.jpg';
import nationalMuseumOfChinaImg from '../data/images/nationalmuseumofchina.jpg';

// Image mapping for path resolution
const imageMap = {
    './images/louvre.webp': louvreImg,
    './images/smithsonian.jpg': smithsonianImg,
    './images/vaticanmuseums.webp': vaticanImg,
    './images/metropolitan.jpg': metropolitanImg,
    './images/britishmuseum.avif': britishMuseumImg,
    './images/tokyo.jpg': tokyoNationalMuseumImg,
    './images/egypt.webp': egyptianMuseumImg,
    './images/statehermitage.webp': stateHermitageMuseumImg,
    './images/apartheidmuseum.jpg': apartheidMuseumImg,
    './images/nationalmuseumofchina.jpg': nationalMuseumOfChinaImg,
};

// Helper function to resolve image paths for Vite
function getImageUrl(imagePath) {
    if (imagePath.startsWith('http')) {
        return imagePath; // Already a full URL
    }
    // Return the imported image URL from the mapping
    return imageMap[imagePath] || imagePath;
}

function ChatbotPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const museum = museums.find(m => m.id === parseInt(id));
    const [stampAwarded, setStampAwarded] = useState(false);
    const [xpNotification, setXpNotification] = useState(null);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const initialMessageSet = useRef(false);

    useEffect(() => {
        // Check authentication state
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setUserLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Set initial welcome message when museum is loaded
        if (museum && !initialMessageSet.current) {
            setMessages([{
                type: 'bot',
                content: `Welcome! I can help you learn about ${museum.name}. What would you like to know?`
            }]);
            initialMessageSet.current = true;
        }
    }, [museum]);

    useEffect(() => {
        if (museum && !stampAwarded && user && !userLoading) {
            handleAwardStamp('VISITED', museum.id);
            setStampAwarded(true);
        }
    }, [museum, user, userLoading]);

    useEffect(() => {
        // Auto-scroll to bottom when messages change
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleAwardStamp = async (stampType, museumId) => {
        // Check if user is logged in
        if (!user) {
            console.error('❌ Error: User is not signed in. Cannot award XP or save data to Firestore.');
            return;
        }

        try {
            const xpGained = 10; // VISITED stamp gives 10 XP
            const result = await awardStamp(user.uid, stampType, museumId, xpGained);

            if (result.success) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                setXpNotification(result.xpGained);

                console.log(`🎉 Stamp earned: ${stampType} (+${result.xpGained} XP)`);
                console.log(`Level: ${result.level} | Total XP: ${result.newXP}`);
            } else {
                console.log(`ℹ️ ${result.message}`);
            }
        } catch (error) {
            console.error('Error awarding stamp:', error);
        }
    };

    const sendMessage = async () => {
        const message = inputValue.trim();

        if (message === '' || isLoading) return;

        // Add user message
        setMessages(prev => [...prev, { type: 'user', content: message }]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Call the AI API with museum context
            const response = await aiAPI.askQuestion(
                museum.name,
                museum.description,
                message
            );

            // Add bot response
            setMessages(prev => [...prev, {
                type: 'bot',
                content: response.answer || 'Sorry, I could not process your question.'
            }]);
        } catch (error) {
            console.error('Error getting AI response:', error);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: 'Sorry, I am having trouble connecting right now. Please try again later.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    if (!museum) {
        return (
            <div className="museum-detail-container">
                <div className="card museum-card">
                    <div className="card-body">
                        <h5 className="card-title">Museum not found</h5>
                        <button onClick={() => navigate('/')} className="btn btn-primary">
                            Back to Map
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <Navigation />
            <div
                className="museum-detail-container flex-1 ml-80"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 320,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${getImageUrl(museum.image)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                {xpNotification && (
                    <XPNotification
                        xpGained={xpNotification}
                        onComplete={() => setXpNotification(null)}
                    />
                )}
                <div className="card" style={{
                    width: '50rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.736)',
                    color: 'rgb(205, 205, 205)',
                }}>
                    <div className="card-body" style={{
                        alignItems: 'center',
                    }}>
                        <h5 className="card-title text-center mb-3">
                            <i className="bi bi-chat-dots-fill"></i> {museum.name} Assistant
                        </h5>

                        {/* Chat Messages Container */}
                        <div className="chat-container" ref={chatContainerRef}>
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.type}`}>
                                    <div className="message-content">
                                        <strong>{msg.type === 'bot' ? 'Museum Bot' : 'You'}:</strong><br />
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message bot">
                                    <div className="message-content">
                                        <strong>Museum Bot:</strong><br />
                                        <em>Thinking...</em>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                id="userInput"
                                placeholder="Ask me anything about the museum..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    border: '1px solid rgba(255, 255, 255, 0.3)'
                                }}
                            />
                            <button
                                className="btn btn-dark btn-send"
                                onClick={sendMessage}
                                disabled={isLoading}
                            >
                                <i className="bi bi-send-fill"></i> {isLoading ? 'Sending...' : 'Send'}
                            </button>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-row justify-evenly w-full gap-4 mt-4">
                            <a href="#" className="btn btn-primary" onClick={(e) => {
                                e.preventDefault();
                                navigate(`/quiz/${museum.id}`);
                            }}>
                                Start Quiz
                            </a>
                            <a href="#" className="btn btn-primary" onClick={(e) => {
                                e.preventDefault();
                                navigate(`/museum/${museum.id}`);
                            }}>
                                Back to Museum
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatbotPage;
