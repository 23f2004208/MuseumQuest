import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './Login.css';


function Signup() {
    // Get background image URL without direct import
    const backgroundImageUrl = new URL('../assets/background.jpg', import.meta.url).href;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container" style={{ 
            backgroundImage: `url(${backgroundImageUrl})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat',
            height: '100vh',
            width: '100%' }}>
            <form className="login-form" onSubmit={handleSignup}>
                <h2>Create Account</h2>

                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Sign Up</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>

                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default Signup;

