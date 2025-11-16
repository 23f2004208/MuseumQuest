import { useNavigate } from 'react-router-dom';

function Navigation() {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 w-80 h-screen bg-[#552c20] px-8 py-12 flex flex-col z-[1000] shadow-2xl">
            <div className="mb-16">
                <h1 className="text-white text-5xl font-bold leading-tight tracking-tight mx-4">
                    Museum<br />Quest
                </h1>
            </div>
            {/* Add spacing between the logo and the navigation */}
            <div className="h-4"></div>
            <div className="flex flex-col gap-6 mx-4">
                <button
                    onClick={() => navigate('/')}
                    className="text-white text-xl font-medium text-left py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 active:scale-95"
                >
                    🚀 Landing
                </button>
                <button
                    onClick={() => navigate('/home')}
                    className="text-white text-xl font-medium text-left py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 active:scale-95"
                >
                    🏠 Home
                </button>
                <button
                    onClick={() => navigate('/passport')}
                    className="text-white text-xl font-medium text-left py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 active:scale-95"
                >
                    👤 Profile
                </button>
                <button
                    onClick={() => navigate('/leaderboard')}
                    className="text-white text-xl font-medium text-left py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10 active:scale-95"
                >
                    🏆 Leaderboard
                </button>
            </div>
            <div className="mt-auto">
                <p className="text-white/40 text-sm">Explore museums worldwide</p>
            </div>
        </nav>
    );
}

export default Navigation;
