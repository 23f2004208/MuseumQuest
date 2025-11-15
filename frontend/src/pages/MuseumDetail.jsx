import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';  // ADD THIS
import { museums } from '../data/museums';
import confetti from 'canvas-confetti';
import axios from 'axios';

function MuseumDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const museum = museums.find(m => m.id === parseInt(id));
    const [stampAwarded, setStampAwarded] = useState(false);  // ADD THIS

    const userId = "demo-user";  // ADD THIS

    // ADD THIS ENTIRE useEffect
    useEffect(() => {
        if (museum && !stampAwarded) {
            awardStamp('VISITED', museum.id);
            setStampAwarded(true);
        }
    }, [museum]);

    // ADD THIS FUNCTION
    const awardStamp = async (stampType, museumId) => {
        try {
            const response = await axios.post('http://localhost:5000/api/passport/stamp', {
                userId,
                stampType,
                museumId
            });

            if (response.data.success) {
                // Celebration!
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });

                console.log(`🎉 Stamp earned: ${stampType} (+${response.data.xpGained} XP)`);
                console.log(`Level: ${response.data.level} | Total XP: ${response.data.newXP}`);
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
        <div
            className="museum-detail-container"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${museum.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
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
                    <p className="card-text">{museum.description}</p>
                    <a href="#" className="btn btn-primary" onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                    }}>
                        Back to Map
                    </a>
                </div>
            </div>
        </div>
    );
}

export default MuseumDetail;