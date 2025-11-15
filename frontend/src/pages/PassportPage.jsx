import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Passport from '../components/Passport';
import Navigation from '../components/Navigation';

function PassportPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setUserLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5',
            padding: '2rem'
        }}>
            <Navigation />
            <div className="flex-1 ml-80" style={{ maxWidth: '800px', margin: '0 auto' }}>

                {userLoading ? (
                    <div>Loading...</div>
                ) : user ? (
                    <p>ADD PROFILE/PASSPORT CONTENT HERE</p>
                ) : (
                    <div>
                        <p>Please log in to view your passport.</p>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        Go to Login
                    </button>
                </div>
                )}
            </div>
        </div>
    );
}

export default PassportPage;