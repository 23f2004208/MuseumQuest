import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background.jpg';
import './Landing.css';

function Landing() {
    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}>
                <div className="container">
                    <Link className="navbar-brand fw-bold" to="/landing">
                        <i className="bi bi-compass-fill text-info"></i> MuseumQuest
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="#features">Features</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#about">About</a>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link btn btn-outline-light rounded-pill px-4 ms-2" to="/login" style={{ border: '2px solid #552c20', color: 'white', background: 'linear-gradient(135deg, rgba(85, 44, 32, 0.3), rgba(109, 56, 38, 0.3))' }}>
                                    <i className="bi bi-box-arrow-in-right"></i> Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section animate-fade-in">
                <div className="container">
                    <div className="hero-card p-5 text-center">
                        <h1 className="display-2 fw-bold text-white mb-4 glow-text">
                            <i className="bi bi-building text-warning"></i> MuseumQuest
                        </h1>
                        <p className="lead text-white-50 mb-4" style={{ fontSize: '1.5rem' }}>
                            Embark on an Interactive Journey Through History
                        </p>
                        <p className="text-white mb-5" style={{ fontSize: '1.1rem' }}>
                            Explore museums, earn XP, collect stamps, and unlock achievements as you discover the world's greatest cultural treasures.
                        </p>
                        
                        {/* Stats */}
                        <div className="row g-3 mb-5">
                            <div className="col-md-4">
                                <div className="stat-card">
                                    <h2 className="text-info fw-bold mb-0">10+</h2>
                                    <p className="text-white-50 mb-0">Museums</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="stat-card">
                                    <h2 className="text-success fw-bold mb-0">100+</h2>
                                    <p className="text-white-50 mb-0">Artifacts</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="stat-card">
                                    <h2 className="text-warning fw-bold mb-0">50+</h2>
                                    <p className="text-white-50 mb-0">Quizzes</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* CTA Buttons */}
                        <div className="d-flex gap-3 justify-content-center flex-wrap">
                            <Link to="/home" className="btn btn-primary-custom">
                                <i className="bi bi-play-circle-fill"></i> Start Exploring
                            </Link>
                            <a href="#features" className="btn btn-secondary-custom">
                                <i className="bi bi-info-circle"></i> Learn More
                            </a>
                            <Link to="/login" className="btn btn-secondary-custom">
                                <i className="bi bi-box-arrow-in-right"></i> Login
                            </Link>
                            <Link to="/signup" className="btn btn-secondary-custom">
                                <i className="bi bi-person-plus-fill"></i> Signup
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-5" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                <div className="container">
                    <h2 className="text-center text-white fw-bold mb-5 display-5">
                        <i className="bi bi-stars text-warning"></i> Features
                    </h2>
                    <div className="row g-4">
                        {/* Feature 1 */}
                        <div className="col-md-4">
                            <div className="feature-card p-4 text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-geo-alt-fill text-white fs-1"></i>
                                </div>
                                <h4 className="text-white mb-3">Virtual Museum Tours</h4>
                                <p className="text-white-50">
                                    Explore museums from around the world with detailed information about exhibits and artifacts.
                                </p>
                            </div>
                        </div>
                        
                        {/* Feature 2 */}
                        <div className="col-md-4">
                            <div className="feature-card p-4 text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-trophy-fill text-white fs-1"></i>
                                </div>
                                <h4 className="text-white mb-3">Earn XP & Level Up</h4>
                                <p className="text-white-50">
                                    Gain experience points by visiting museums and passing quizzes. Progress from Tourist to Museum Legend!
                                </p>
                            </div>
                        </div>
                        
                        {/* Feature 3 */}
                        <div className="col-md-4">
                            <div className="feature-card p-4 text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-patch-check-fill text-white fs-1"></i>
                                </div>
                                <h4 className="text-white mb-3">Collect Museum Stamps</h4>
                                <p className="text-white-50">
                                    Complete quizzes to earn unique stamps for each museum in your virtual passport collection.
                                </p>
                            </div>
                        </div>
                        
                        {/* Feature 4 */}
                        <div className="col-md-4">
                            <div className="feature-card p-4 text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-chat-dots-fill text-white fs-1"></i>
                                </div>
                                <h4 className="text-white mb-3">AI Museum Assistant</h4>
                                <p className="text-white-50">
                                    Get instant answers to your questions with our intelligent chatbot guide for each museum.
                                </p>
                            </div>
                        </div>
                        
                        {/* Feature 5 */}
                        <div className="col-md-4">
                            <div className="feature-card p-4 text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-question-circle-fill text-white fs-1"></i>
                                </div>
                                <h4 className="text-white mb-3">Interactive Quizzes</h4>
                                <p className="text-white-50">
                                    Test your knowledge with engaging quizzes and track your progress with timed challenges.
                                </p>
                            </div>
                        </div>
                        
                        {/* Feature 6 */}
                        <div className="col-md-4">
                            <div className="feature-card p-4 text-center">
                                <div className="feature-icon">
                                    <i className="bi bi-graph-up-arrow text-white fs-1"></i>
                                </div>
                                <h4 className="text-white mb-3">Track Your Progress</h4>
                                <p className="text-white-50">
                                    Monitor your achievements, completed museums, and level progression in your personalized profile.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-5" style={{ background: 'linear-gradient(135deg, rgba(85, 44, 32, 0.8), rgba(0, 0, 0, 0.9))' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 mb-4 mb-lg-0">
                            <h2 className="text-white fw-bold mb-4 display-5">
                                <i className="bi bi-book-fill text-info"></i> About MuseumQuest
                            </h2>
                            <p className="text-white-50 fs-5 mb-4">
                                MuseumQuest is an innovative platform that transforms museum exploration into an engaging, gamified experience. Whether you're a history enthusiast, art lover, or curious learner, our platform makes discovering cultural heritage fun and rewarding.
                            </p>
                            <p className="text-white-50 fs-5 mb-4">
                                Join thousands of explorers on a journey through time and culture. Collect stamps, complete challenges, and become a Museum Legend!
                            </p>
                            <Link to="/home" className="btn btn-primary-custom">
                                <i className="bi bi-rocket-takeoff-fill"></i> Begin Your Journey
                            </Link>
                        </div>
                        <div className="col-lg-6">
                            <div className="card" style={{ background: 'rgba(0, 0, 0, 0.6)', border: '2px solid rgba(255, 255, 255, 0.2)' }}>
                                <div className="card-body p-4">
                                    <h5 className="text-white mb-4">
                                        <i className="bi bi-award-fill text-warning"></i> Level System
                                    </h5>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-white"><i className="bi bi-star-fill text-success"></i> Tourist (0 XP)</span>
                                            <span className="text-success">Start Here</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-white"><i className="bi bi-star-fill text-info"></i> Explorer (100 XP)</span>
                                            <span className="text-info">+25 per quiz</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-white"><i className="bi bi-star-fill text-warning"></i> Curator (250 XP)</span>
                                            <span className="text-warning">Advanced</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-white"><i className="bi bi-trophy-fill text-danger"></i> Museum Legend (500 XP)</span>
                                            <span className="text-danger">Master</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            <p className="text-white-50 mb-0">
                                <i className="bi bi-compass-fill text-info"></i> © 2025 MuseumQuest. All rights reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <a href="#" className="text-white-50 me-3"><i className="bi bi-facebook fs-5"></i></a>
                            <a href="#" className="text-white-50 me-3"><i className="bi bi-twitter fs-5"></i></a>
                            <a href="#" className="text-white-50 me-3"><i className="bi bi-instagram fs-5"></i></a>
                            <a href="#" className="text-white-50"><i className="bi bi-youtube fs-5"></i></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
