import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { museums } from '../data/museums';
import confetti from 'canvas-confetti';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { awardStamp } from '../services/firestore';
import XPNotification from '../components/XPNotification';
import Navigation from '../components/Navigation';
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

function QuizPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const museum = museums.find(m => m.id === parseInt(id));
    const [stampAwarded, setStampAwarded] = useState(false);
    const [xpNotification, setXpNotification] = useState(null);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        // Check authentication state
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setUserLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (museum && !stampAwarded && user && !userLoading) {
            handleAwardStamp('VISITED', museum.id);
            setStampAwarded(true);
        }
    }, [museum, user, userLoading]);

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
                        textAlign: 'justify',
                    }}>
                        <h5 className="card-title">{museum.name}, {museum.city}, {museum.country}</h5>
                        <p className="card-text">ADD QUIZ CONTENT HERE</p>
                        <div className="flex flex-row justify-evenly w-full gap-4 mt-4">
                            <a href="#" className="btn btn-primary" onClick={(e) => {
                                e.preventDefault();
                                navigate(`/museum/${museum.id}`);
                            }}>
                                Back to Museum
                            </a>
                            <a href="#" className="btn btn-primary" onClick={(e) => {
                                e.preventDefault();
                                navigate(`/chatbot/${museum.id}`);
                            }}>
                                Ask Chatbot
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizPage;
