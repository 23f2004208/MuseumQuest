import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProgress } from '../services/firestore';
import { museums } from '../data/museums';
import Navigation from '../components/Navigation';
import DefaultProfileIcon from '../components/DefaultProfileIcon';

function PassportPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [museumsCollapse, setMuseumsCollapse] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setUserLoading(false);

            if (currentUser) {
                try {
                    const progress = await getUserProgress(currentUser.uid);
                    setUserData(progress);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setDataLoading(false);
                }
            } else {
                setDataLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const editProfile = () => {
        alert('Edit profile functionality coming soon!');
    };

    if (userLoading || dataLoading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundImage: "url('profile map2.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: '40px 0'
            }}>
                <Navigation />
                <div className="container" style={{ maxWidth: '1200px' }}>
                    <div className="text-center text-white">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundImage: "url('profile map2.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: '40px 0'
            }}>
                <Navigation />
                <div className="container" style={{ maxWidth: '1200px' }}>
                    <div className="card shadow-lg" style={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none' }}>
                        <div className="card-body text-center text-white p-5">
                            <p className="mb-3">Please log in to view your passport.</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn btn-primary"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate user stats
    const xp = userData?.totalXP || userData?.xp || 0;
    const level = userData?.currentLevel || userData?.level || 'Tourist';
    const visitedMuseums = userData?.visitedMuseums || [];
    const stamps = userData?.stamps || [];
    const username = userData?.username || user.displayName || user.email?.split('@')[0] || 'User';
    const email = user.email || '';

    // Calculate member since date (use createdAt from Firestore or account creation)
    let memberSince = new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (userData?.createdAt) {
        try {
            // Handle Firestore Timestamp object
            if (userData.createdAt.toDate) {
                memberSince = userData.createdAt.toDate().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            } else if (userData.createdAt.seconds) {
                memberSince = new Date(userData.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            }
        } catch (e) {
            // Fallback to account creation time
        }
    }

    // Level progression
    const levels = ['Tourist', 'Explorer', 'Curator', 'Museum Legend'];
    const xpThresholds = [0, 50, 250, 500];
    const currentLevelIndex = levels.indexOf(level);
    const nextLevelIndex = currentLevelIndex < levels.length - 1 ? currentLevelIndex + 1 : currentLevelIndex;
    const currentThreshold = xpThresholds[currentLevelIndex];
    const nextThreshold = xpThresholds[nextLevelIndex];
    const progressToNext = Math.max(0, Math.min(100, ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100));
    const remainingXP = Math.max(0, nextThreshold - xp);

    // Get visited museums with details
    const visitedMuseumsDetails = visitedMuseums
        .map(id => museums.find(m => m.id === id))
        .filter(Boolean);

    // Get stamps by museum (quiz passed stamps)
    const quizStamps = stamps.filter(s => s.type === 'QUIZ_PASSED' || s.type === 'QUIZ_COMPLETED');
    const stampsByMuseum = {};
    quizStamps.forEach(stamp => {
        stampsByMuseum[stamp.museumId] = true;
    });

    // Total museums count
    const totalMuseums = museums.length;
    const museumsProgress = (visitedMuseums.length / totalMuseums) * 100;

    return (
        <div style={{
            minHeight: '100vh',
            backgroundImage: "url('profile map2.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: '40px 0'
        }}>
            <Navigation />
            <div className="container" style={{ maxWidth: '1200px' }}>

                {/* Profile Info Container */}
                <div className="card shadow-lg mb-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}>
                    <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <h3 className="mb-0 text-white">
                            <i className="bi bi-person-circle"></i> Profile Information
                        </h3>
                        <button className="btn btn-outline-light btn-sm" onClick={editProfile}>
                            <i className="bi bi-pencil"></i> Edit
                        </button>
                    </div>
                    <div className="card-body p-4">
                        <div className="row align-items-center">
                            <div className="col-md-3 text-center mb-3 mb-md-0">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt="Profile Picture"
                                        className="profile-image"
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '3px solid rgba(255, 255, 255, 0.3)',
                                            display: 'block',
                                            margin: '0 auto'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: '0 auto'
                                    }}>
                                        <DefaultProfileIcon size={150} />
                                    </div>
                                )}
                            </div>
                            <div className="col-md-9">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="text-white-50 small">Full Name</label>
                                        <p className="text-white h5" id="userName">{username}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-white-50 small">Level</label>
                                        <p className="text-white h5" id="userLevel">
                                            <span className="badge bg-info text-dark">{level}</span>
                                        </p>
                                        <small className="text-white-50">Tourist → Explorer → Curator → Museum Legend</small>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="text-white-50 small">Email</label>
                                        <p className="text-white h6" id="userEmail">{email}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="text-white-50 small">Member Since</label>
                                        <p className="text-white" id="memberSince">{memberSince}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label className="text-white-50 small">Total XP</label>
                                        <p className="text-white">
                                            <span className="badge bg-warning text-dark fs-6">{xp} XP</span>
                                        </p>
                                        <small className="text-white-50">+10 per museum visit | +25 per quiz passed</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Passport Container */}
                <div className="card shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none' }}>
                    <div className="card-header" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <h3 className="mb-0 text-white">
                            <i className="bi bi-passport"></i> Museum Passport
                        </h3>
                    </div>
                    <div className="card-body p-4">

                        {/* Museums Visited Section */}
                        <div className="mb-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-white mb-0">
                                    <i className="bi bi-building"></i> Museums Visited
                                </h4>
                                <button
                                    className="btn btn-outline-light btn-sm"
                                    type="button"
                                    onClick={() => setMuseumsCollapse(!museumsCollapse)}
                                >
                                    <i className={`bi bi-chevron-${museumsCollapse ? 'up' : 'down'}`}></i> View Details
                                </button>
                            </div>

                            <div className="text-center mb-3">
                                <p className="text-white mb-2"><strong>Overall Progress:</strong></p>
                                <div className="progress" style={{ height: '25px' }}>
                                    <div
                                        className="progress-bar bg-info"
                                        role="progressbar"
                                        style={{ width: `${museumsProgress}%` }}
                                        aria-valuenow={visitedMuseums.length}
                                        aria-valuemin="0"
                                        aria-valuemax={totalMuseums}
                                    >
                                        {visitedMuseums.length}/{totalMuseums} Museums
                                    </div>
                                </div>
                            </div>

                            {museumsCollapse && (
                                <div className="mt-3">
                                    {visitedMuseumsDetails.length > 0 ? (
                                        <div className="list-group">
                                            {visitedMuseumsDetails.map((museum, idx) => (
                                                <div
                                                    key={museum.id}
                                                    className="list-group-item d-flex justify-content-between align-items-center"
                                                    style={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                                        marginTop: idx > 0 ? '0.5rem' : '0'
                                                    }}
                                                >
                                                    <div>
                                                        <h6 className="text-white mb-1">
                                                            <i className="bi bi-check-circle-fill text-success"></i> {museum.name}
                                                        </h6>
                                                        <p className="text-white-50 mb-0 small">
                                                            {museum.city}, {museum.country}
                                                        </p>
                                                    </div>
                                                    <span className="badge bg-success">Completed</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-white-50 text-center">No museums visited yet. Start exploring!</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Stamps Collected Section */}
                        <div className="mb-5">
                            <h4 className="text-white mb-3">
                                <i className="bi bi-stamp"></i> Museum Stamps
                            </h4>
                            <p className="text-white-50 small mb-3">Collect 1 stamp per museum by passing its quiz</p>
                            <div className="d-flex flex-wrap gap-3 justify-content-center">
                                {museums.map((museum) => {
                                    const hasStamp = stampsByMuseum[museum.id];
                                    return (
                                        <div key={museum.id} className="text-center" style={{ width: '90px' }}>
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    background: hasStamp
                                                        ? 'linear-gradient(135deg, #ffd700, #ffed4e)'
                                                        : 'rgba(255, 255, 255, 0.1)',
                                                    border: hasStamp
                                                        ? '3px solid #d4af37'
                                                        : '2px dashed rgba(255, 255, 255, 0.3)',
                                                    margin: '0 auto',
                                                    boxShadow: hasStamp
                                                        ? '0 4px 15px rgba(255, 215, 0, 0.5), inset 0 2px 5px rgba(255, 255, 255, 0.5)'
                                                        : 'none'
                                                }}
                                            >
                                                {hasStamp ? (
                                                    <i className="bi bi-star-fill fs-2" style={{ color: '#d4af37' }}></i>
                                                ) : (
                                                    <i className="bi bi-lock-fill text-white-50 fs-3"></i>
                                                )}
                                            </div>
                                            <small className={`mt-1 d-block ${hasStamp ? 'text-white' : 'text-white-50'}`}>
                                                {museum.name.length > 12 ? museum.name.substring(0, 12) + '...' : museum.name}
                                            </small>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="text-center mt-3">
                                <p className="text-white">
                                    <strong>Museum Stamps Collected:</strong>{' '}
                                    <span className="badge bg-success">{quizStamps.length} / {totalMuseums}</span>
                                </p>
                            </div>
                        </div>

                        {/* Achievements Section */}
                        <div>
                            <h4 className="text-white mb-4">
                                <i className="bi bi-trophy-fill text-warning"></i> Achievements
                            </h4>

                            {/* Level Progression */}
                            <div
                                className="card mb-4"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.15), rgba(13, 202, 240, 0.15))',
                                    border: '2px solid rgba(13, 202, 240, 0.3)',
                                    boxShadow: '0 4px 15px rgba(13, 202, 240, 0.2)'
                                }}
                            >
                                <div className="card-body p-4">
                                    <h5 className="text-white mb-4 text-center">
                                        <i className="bi bi-graph-up-arrow text-info"></i> Level Progression
                                    </h5>
                                    <div className="d-flex justify-content-between align-items-center position-relative" style={{ padding: '30px 0' }}>
                                        {/* Progress Line */}
                                        <div
                                            className="position-absolute"
                                            style={{
                                                top: '50%',
                                                left: '8%',
                                                right: '8%',
                                                height: '6px',
                                                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2))',
                                                zIndex: 1,
                                                borderRadius: '10px'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: `${(currentLevelIndex / (levels.length - 1)) * 100}%`,
                                                    background: 'linear-gradient(90deg, #20c997, #0dcaf0)',
                                                    borderRadius: '10px',
                                                    boxShadow: '0 0 10px rgba(13, 202, 240, 0.5)'
                                                }}
                                            ></div>
                                        </div>

                                        {/* Level Circles */}
                                        <div className="d-flex justify-content-between w-100 position-relative" style={{ zIndex: 2 }}>
                                            {levels.map((levelName, idx) => {
                                                const isCompleted = idx < currentLevelIndex;
                                                const isCurrent = idx === currentLevelIndex;
                                                const isLocked = idx > currentLevelIndex;

                                                return (
                                                    <div key={levelName} className="text-center" style={{ flex: 1 }}>
                                                        <div
                                                            className="mx-auto rounded-circle d-flex align-items-center justify-content-center position-relative"
                                                            style={{
                                                                width: isCurrent ? '85px' : '75px',
                                                                height: isCurrent ? '85px' : '75px',
                                                                background: isCompleted
                                                                    ? 'linear-gradient(135deg, #20c997, #198754)'
                                                                    : isCurrent
                                                                        ? 'linear-gradient(135deg, #0dcaf0, #0d6efd)'
                                                                        : 'linear-gradient(135deg, rgba(108, 117, 125, 0.3), rgba(73, 80, 87, 0.3))',
                                                                border: `${isCurrent ? '5px' : '4px'} solid #fff`,
                                                                boxShadow: isCurrent
                                                                    ? '0 0 25px rgba(13, 202, 240, 0.8), 0 0 50px rgba(13, 202, 240, 0.4)'
                                                                    : isCompleted
                                                                        ? '0 4px 15px rgba(32, 201, 151, 0.4)'
                                                                        : '0 4px 10px rgba(0, 0, 0, 0.3)',
                                                                animation: isCurrent ? 'pulse 2s infinite' : 'none'
                                                            }}
                                                        >
                                                            {isCompleted ? (
                                                                <i className="bi bi-check-lg text-white fs-3"></i>
                                                            ) : isCurrent ? (
                                                                <>
                                                                    <i className="bi bi-star-fill text-white fs-2"></i>
                                                                    <div
                                                                        className="position-absolute"
                                                                        style={{
                                                                            top: '-10px',
                                                                            right: '-10px',
                                                                            width: '30px',
                                                                            height: '30px',
                                                                            background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
                                                                            borderRadius: '50%',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            border: '2px solid #fff'
                                                                        }}
                                                                    >
                                                                        <i className="bi bi-lightning-fill text-white" style={{ fontSize: '0.8rem' }}></i>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <i className="bi bi-lock-fill text-white-50 fs-3"></i>
                                                            )}
                                                        </div>
                                                        <small className={`mt-2 d-block fw-bold ${isCurrent ? 'text-white' : isLocked ? 'text-white-50' : 'text-white'}`} style={{ fontSize: isCurrent ? '1rem' : '0.9rem' }}>
                                                            {levelName}
                                                        </small>
                                                        {isCompleted ? (
                                                            <small className="text-success d-block fw-semibold">✓ Completed</small>
                                                        ) : isCurrent ? (
                                                            <small className="d-block" style={{ color: '#0dcaf0', fontWeight: 'bold', textShadow: '0 0 10px rgba(13, 202, 240, 0.5)' }}>
                                                                ★ Current Level
                                                            </small>
                                                        ) : (
                                                            <small className="text-white-50 d-block">🔒 Locked</small>
                                                        )}
                                                        <small className={`d-block fw-semibold ${isCurrent ? 'text-warning' : 'text-warning'}`}>
                                                            {xpThresholds[idx]} XP
                                                        </small>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Progress Stats */}
                                    {currentLevelIndex < levels.length - 1 && (
                                        <div className="mt-4 pt-3 border-top border-secondary">
                                            <div className="row text-center">
                                                <div className="col-4">
                                                    <h6 className="text-info mb-1">{xp} / {nextThreshold}</h6>
                                                    <small className="text-white-50">Next Level</small>
                                                </div>
                                                <div className="col-4">
                                                    <h6 className="text-success mb-1">{remainingXP} XP</h6>
                                                    <small className="text-white-50">Remaining</small>
                                                </div>
                                                <div className="col-4">
                                                    <h6 className="text-warning mb-1">{Math.round(progressToNext)}%</h6>
                                                    <small className="text-white-50">Progress</small>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <style>{`
                            @keyframes pulse {
                                0%, 100% {
                                    transform: scale(1);
                                }
                                50% {
                                    transform: scale(1.05);
                                }
                            }
                        `}</style>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default PassportPage;
