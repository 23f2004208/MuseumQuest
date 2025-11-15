import { useState, useEffect } from 'react';
import { getUserProgress } from '../services/firestore';

function Passport({ userId }) {
    const [passport, setPassport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchPassport();
        } else {
            setLoading(false);
        }
    }, [userId]);

    const fetchPassport = async () => {
        try {
            const userData = await getUserProgress(userId);
            if (userData) {
                // Transform Firestore data to match expected format
                setPassport({
                    xp: userData.totalXP || 0,
                    level: userData.currentLevel || 'Tourist',
                    stamps: userData.stamps || [],
                    visitedMuseums: userData.visitedMuseums || []
                });
            } else {
                // User doesn't exist yet, create default passport
                setPassport({
                    xp: 0,
                    level: 'Tourist',
                    stamps: [],
                    visitedMuseums: []
                });
            }
        } catch (error) {
            console.error('Error fetching passport:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading passport...</div>;
    if (!passport) return <div>No passport data</div>;

    const levels = ['Tourist', 'Explorer', 'Curator', 'Museum Legend'];
    const xpThresholds = [0, 50, 100, 200];
    const currentLevelIndex = levels.indexOf(passport.level);
    const nextLevel = levels[currentLevelIndex + 1];
    const currentThreshold = xpThresholds[currentLevelIndex];
    const nextThreshold = xpThresholds[currentLevelIndex + 1] || 200;
    const progressPercent = ((passport.xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

    const stampIcons = {
        VISITED: '📍',
        QUIZ_PASSED: '🧠',
        AI_QUESTIONS: '💬',
        ALL_IMAGES_VIEWED: '🎨'
    };

    const stampNames = {
        VISITED: 'Visited',
        QUIZ_PASSED: 'Quiz Master',
        AI_QUESTIONS: 'Curious Explorer',
        ALL_IMAGES_VIEWED: 'Art Lover'
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>🎫 Museum Passport</h2>
                <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>
                    Your journey through world's greatest museums
                </p>
            </div>

            {/* Level & XP */}
            <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '1.5rem',
                borderRadius: '10px',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>
                            {passport.level}
                        </h3>
                        <p style={{ margin: '0.25rem 0 0 0', opacity: 0.8 }}>
                            {passport.xp} XP
                        </p>
                    </div>
                    <div style={{ fontSize: '3rem' }}>
                        {currentLevelIndex === 0 && '🎒'}
                        {currentLevelIndex === 1 && '🧭'}
                        {currentLevelIndex === 2 && '🏛️'}
                        {currentLevelIndex === 3 && '👑'}
                    </div>
                </div>

                {/* Progress bar */}
                {nextLevel && (
                    <div>
                        <div style={{
                            background: 'rgba(0,0,0,0.2)',
                            height: '20px',
                            borderRadius: '10px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                                height: '100%',
                                width: `${progressPercent}%`,
                                transition: 'width 0.5s ease'
                            }}></div>
                        </div>
                        <p style={{
                            fontSize: '0.9rem',
                            marginTop: '0.5rem',
                            opacity: 0.9
                        }}>
                            {nextThreshold - passport.xp} XP to {nextLevel}
                        </p>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.15)',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2rem' }}>🏛️</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {passport.visitedMuseums.length}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                        Museums Visited
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.15)',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2rem' }}>🎖️</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {passport.stamps.length}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                        Stamps Collected
                    </div>
                </div>
            </div>

            {/* Stamps Collection */}
            <div>
                <h3 style={{ marginBottom: '1rem' }}>Stamp Collection</h3>
                {passport.stamps.length === 0 ? (
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        padding: '2rem',
                        borderRadius: '10px',
                        textAlign: 'center',
                        opacity: 0.7
                    }}>
                        <p>Visit museums and complete activities to collect stamps!</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '1rem'
                    }}>
                        {passport.stamps.map((stamp, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(255,255,255,0.2)',
                                padding: '1rem',
                                borderRadius: '10px',
                                textAlign: 'center',
                                border: '2px solid rgba(255,255,255,0.3)'
                            }}>
                                <div style={{ fontSize: '2.5rem' }}>
                                    {stampIcons[stamp.type]}
                                </div>
                                <div style={{
                                    fontSize: '0.8rem',
                                    marginTop: '0.5rem',
                                    fontWeight: 'bold'
                                }}>
                                    {stampNames[stamp.type]}
                                </div>
                                <div style={{
                                    fontSize: '0.7rem',
                                    opacity: 0.7,
                                    marginTop: '0.25rem'
                                }}>
                                    Museum #{stamp.museumId}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Passport;