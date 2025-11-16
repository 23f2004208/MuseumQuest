import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { museums } from '../data/museums';
import { quizzes } from '../data/quizzes';
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
    const quiz = quizzes.find(q => q.museumId === parseInt(id));

    const [stampAwarded, setStampAwarded] = useState(false);
    const [xpNotification, setXpNotification] = useState(null);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    // Quiz state
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [quizCompleted, setQuizCompleted] = useState(false);

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

    // Timer countdown
    useEffect(() => {
        if (quizCompleted || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    alert('Time is up!');
                    handleQuizSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizCompleted, timeLeft]);

    const handleAwardStamp = async (stampType, museumId) => {
        // Check if user is logged in
        if (!user) {
            console.error('❌ Error: User is not signed in. Cannot award XP or save data to Firestore.');
            return;
        }

        try {
            const xpGained = stampType === 'VISITED' ? 10 : 50; // VISITED: 10 XP, QUIZ_COMPLETED: 50 XP
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

    const selectOption = (optionIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion]: optionIndex
        });
    };

    const previousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            handleQuizSubmit();
        }
    };

    const handleQuizSubmit = () => {
        if (quizCompleted) return;

        setQuizCompleted(true);

        // Calculate score
        let correctCount = 0;
        quiz.questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correctAnswer) {
                correctCount++;
            }
        });

        const score = (correctCount / quiz.questions.length) * 100;

        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });

        alert(`Quiz completed!\nYou scored ${correctCount}/${quiz.questions.length} (${score.toFixed(0)}%)`);

        // Award quiz completion stamp only if score is 80% or higher
        if (user && score >= 80) {
            handleAwardStamp('QUIZ_COMPLETED', museum.id);
        } else if (user && score < 80) {
            alert('You need to score at least 80% to earn the quiz completion bonus (50 XP).');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    if (!museum || !quiz) {
        return (
            <div className="museum-detail-container">
                <div className="card museum-card">
                    <div className="card-body">
                        <h5 className="card-title">Museum or quiz not found</h5>
                        <button onClick={() => navigate('/')} className="btn btn-primary">
                            Back to Map
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestionData = quiz.questions[currentQuestion];

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
                <div style={{ maxWidth: '800px', width: '100%', padding: '20px' }}>
                    {/* Timer */}
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <h3
                            className="badge p-3"
                            style={{
                                fontSize: '1.5rem',
                                backgroundColor: timeLeft < 60 ? 'rgba(220, 53, 69, 0.8)' : 'rgba(13, 110, 253, 0.8)',
                                color: 'white'
                            }}
                        >
                            ⏰ Time Remaining: <span>{formatTime(timeLeft)}</span>
                        </h3>
                    </div>

                    {/* Quiz Container */}
                    <div className="card shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none' }}>
                        <div
                            className="card-header text-white p-3"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
                            }}
                        >
                            <h4 className="mb-0">
                                Question <span>{currentQuestion + 1}</span> of {quiz.questions.length}
                            </h4>
                        </div>
                        <div className="card-body p-4">
                            {/* Question */}
                            <h5 className="card-title mb-4 text-white">
                                {currentQuestionData.question}
                            </h5>

                            {/* Options */}
                            <div className="d-grid gap-3">
                                {currentQuestionData.options.map((option, index) => {
                                    const isSelected = selectedAnswers[currentQuestion] === index;
                                    const optionLetter = String.fromCharCode(65 + index); // A, B, C, D

                                    return (
                                        <button
                                            key={index}
                                            className="btn text-start p-3 text-white"
                                            style={{
                                                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.5)',
                                                border: isSelected ? '2px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.3)',
                                                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => selectOption(index)}
                                        >
                                            <strong>{optionLetter})</strong> {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="d-flex justify-content-between mt-4">
                        <button
                            className="btn btn-secondary btn-lg"
                            onClick={previousQuestion}
                            disabled={currentQuestion === 0}
                            style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
                        >
                            ← Previous
                        </button>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={nextQuestion}
                        >
                            {currentQuestion === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next →'}
                        </button>
                    </div>

                    {/* Additional Navigation */}
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <button
                            className="btn btn-outline-light"
                            onClick={() => navigate(`/museum/${museum.id}`)}
                        >
                            Back to Museum
                        </button>
                        <button
                            className="btn btn-outline-light"
                            onClick={() => navigate(`/chatbot/${museum.id}`)}
                        >
                            Ask Chatbot
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizPage;
