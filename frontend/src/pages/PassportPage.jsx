import { useNavigate } from 'react-router-dom';
import Passport from '../components/Passport';

function PassportPage() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f5',
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '0.5rem 1rem',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '2rem'
                    }}
                >
                    ← Back to Map
                </button>

                <Passport userId="demo-user" />
            </div>
        </div>
    );
}

export default PassportPage;