import { useEffect, useState } from 'react';

function XPNotification({ xpGained, onComplete }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            animation: 'slideIn 0.3s ease-out'
        }}>
            +{xpGained} XP! 🎉
        </div>
    );
}

export default XPNotification;