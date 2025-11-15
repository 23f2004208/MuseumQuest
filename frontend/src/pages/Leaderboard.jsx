import { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';
import Navigation from '../components/Navigation';

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        leaderboardAPI.getLeaderboard()
            .then(setLeaderboard)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
            <Navigation />
            {/* Add left margin to content container */}
            <div className="flex-1 ml-80 h-screen flex items-center justify-center">
                <div className="w-full max-w-4xl flex flex-col ml-20 mr-20" style={{ maxHeight: '90vh' }}>
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-5xl font-bold text-[#552c20] mb-2">🏆 Leaderboard</h1>
                        <p className="text-gray-600 text-lg">Top explorers around the world</p>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-2xl text-gray-500">Loading leaderboard...</div>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <p className="text-xl mb-2">No users on the leaderboard yet</p>
                                <p className="text-base">Be the first to explore museums!</p>
                            </div>
                        </div>
                    ) : (
                        /* Table Container with Conditional Centering and Scrolling */
                        <div className={`flex-1 ${leaderboard.length <= 10 ? 'flex items-center' : 'overflow-hidden'}`}>
                            <div className={`w-full bg-white rounded-2xl shadow-2xl ${leaderboard.length > 10 ? 'h-full flex flex-col' : ''}`}>
                                {/* Table Header - Fixed */}
                                <div className="bg-[#552c20] rounded-t-2xl">
                                    <div className="grid grid-cols-12 gap-4 px-8 py-5 text-white font-bold text-lg">
                                        <div className="col-span-2 text-center">Rank</div>
                                        <div className="col-span-6">Username</div>
                                        <div className="col-span-4 text-right">Experience Points</div>
                                    </div>
                                </div>

                                {/* Table Body - Scrollable if needed */}
                                <div className={`${leaderboard.length > 10 ? 'flex-1 overflow-y-auto' : ''}`}>
                                    {leaderboard.map((user, index) => (
                                        <div
                                            key={user.userId}
                                            className={`grid grid-cols-12 gap-4 px-8 py-5 border-b border-gray-200 hover:bg-slate-50 transition-colors duration-200 ${
                                                index === 0 ? 'bg-yellow-50' : index === 1 ? 'bg-gray-100' : index === 2 ? 'bg-orange-50' : ''
                                            }`}
                                        >
                                            {/* Rank Column */}
                                            <div className="col-span-2 flex items-center justify-center">
                                                {index === 0 ? (
                                                    <span className="text-4xl">🥇</span>
                                                ) : index === 1 ? (
                                                    <span className="text-4xl">🥈</span>
                                                ) : index === 2 ? (
                                                    <span className="text-4xl">🥉</span>
                                                ) : (
                                                    <span className="text-2xl font-bold text-gray-700">{user.rank}</span>
                                                )}
                                            </div>

                                            {/* Username Column */}
                                            <div className="col-span-6 flex items-center">
                                                <span className="text-xl font-medium text-gray-800 truncate">
                                                    {user.username || 'Anonymous'}
                                                </span>
                                            </div>

                                            {/* XP Column */}
                                            <div className="col-span-4 flex items-center justify-end">
                                                <span className="text-xl font-bold text-[#552c20]">
                                                    {user.xp.toLocaleString()} XP
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
