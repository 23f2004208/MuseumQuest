import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './Login.css';


function Login() {
    // Get background image URL without direct import
    const backgroundImageUrl = new URL('../assets/background.jpg', import.meta.url).href;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
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
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>

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

                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>

                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default Login;

