import { useParams, useNavigate } from 'react-router-dom';
import { museums } from '../data/museums';

function MuseumDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const museum = museums.find(m => m.id === parseInt(id));

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
                    <a href="#" className="btn btn-primary" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                        Go somewhere
                    </a>
                </div>
            </div>
        </div>
    );
}

export default MuseumDetail;

