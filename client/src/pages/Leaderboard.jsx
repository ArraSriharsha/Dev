import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Trophy, TrendingUp, Star, Crown, ChevronUp, ChevronDown, Flame, Target } from 'lucide-react';
import { getUsers, getProfile, getAllSubmissions } from '../services/api';
import { toast } from 'react-toastify';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [sortBy, setSortBy] = useState('rating');
    const [sortOrder, setSortOrder] = useState('desc');
    const [stats, setStats] = useState({
        totalParticipants: 0,
        topRating: 0,
        mostSolved: 0,
        averageRating: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [usersResponse, profileResponse, submissionsResponse] = await Promise.all([
                    getUsers(),
                    getProfile(),
                    getAllSubmissions()
                ]);

                // Process user data with submissions
                const processedUsers = usersResponse.data.users.map(user => {
                    const userSubmissions = submissionsResponse.data.filter(sub => sub.userId === user._id);
                    
                    // Count only unique problems that were accepted using problemTitle
                    const acceptedSubmissions = userSubmissions.filter(sub => sub.status === 'AC');
                    const solvedProblems = new Set(acceptedSubmissions.map(sub => sub.problemTitle));
                    
                    // Sum all scores from submissions for the user
                    const totalScore = userSubmissions.reduce((acc, sub) => acc + (sub.score || 0), 0); // 0 is the initial value of the accumulator.(acc,curval)
                    
                    return {
                        id: user._id,                 // ...user copies all the properties of the user object.
                        username: user.Username,
                        rating: totalScore,
                        problemsSolved: solvedProblems.size,
                        rank: 0,
                        // lastActive: user.lastActive || new Date(),
                        role: user.Role
                    };
                });

                // Sort users by rating and assign ranks
                const sortedUsers = processedUsers.sort((a, b) => b.rating - a.rating)
                    .map((user, index) => ({ ...user, rank: index + 1 }));

                setUsers(sortedUsers);
                setUserData(profileResponse.data);

                // Calculate stats
                setStats({
                    totalParticipants: sortedUsers.length,
                    topRating: sortedUsers[0]?.rating || 0,
                    mostSolved: Math.max(...sortedUsers.map(u => u.problemsSolved)) || 0,
                    averageRating: Math.round(sortedUsers.reduce((acc, u) => acc + u.rating, 0) / sortedUsers.length) || 0
                });

            } catch (error) {
                if (error.response?.status === 401) {
                    setError('Please sign in to view the leaderboard');
                } else {
                    setError('Failed to fetch leaderboard data');
                    toast.error('Failed to load leaderboard data');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getMedalColor = (rank) => {
        switch (rank) {
            case 1: return 'text-yellow-400';
            case 2: return 'text-gray-300';
            case 3: return 'text-amber-700';
            default: return 'text-gray-600';
        }
    };

    const getRankBadge = (rank) => {
        if (rank <= 3) {
            const colors = {
                1: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
                2: 'bg-gradient-to-br from-gray-300 to-gray-500',
                3: 'bg-gradient-to-br from-amber-700 to-amber-900'
            };
            return (
                <div className={`absolute -left-4 -top-4 w-8 h-8 rounded-full flex items-center justify-center ${colors[rank]} shadow-lg transition-transform hover:scale-110`}>
                    <Crown className="w-5 h-5 text-white" />
                </div>
            );
        }
        return null;
    };

        const handleSort = (field) => {
            if (sortBy === field) {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
            } else {
                setSortBy(field);
                setSortOrder('desc');
            }
        };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                        <span className="text-white text-xl font-semibold">Loading Leaderboard...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-black to-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-8 mt-14">
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <div className="text-2xl text-white">{error}</div>
                        {error.includes('Sign in') ? (
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-red-500 hover:bg-red-500/30 text-white border border-red-500/30 rounded-lg transition-colors"
                        >
                            Go to Signin
                        </button>
                        ) : (
                            <button
                                onClick={() => navigate('/home')}
                                className="px-6 py-2 bg-red-500 hover:bg-red-500/30 text-white border border-red-500/30 rounded-lg transition-colors"
                            >
                                Go to Home
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-t from-black via-red-100 to-red-200">
            <Navbar />
            <div className="container mx-auto px-6 mt-14">
                {/* Header Section */}
                <div className="mb-8 transition-opacity duration-300">
                    <h1 className="text-4xl font-bold text-black mb-2 flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-red-500" />
                        Global <span className="text-red-500">Leaderboard</span>
                    </h1>
                    <p className="text-gray-800">Compete with the best programmers and climb the ranks!</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { 
                            icon: Trophy, 
                            label: 'Total Participants', 
                            value: stats.totalParticipants,
                            color: 'bg-white/80',
                            iconColor: 'text-red-500'
                        },
                        { 
                            icon: Target, 
                            label: 'Top Rating', 
                            value: stats.topRating,
                            color: 'bg-white/80',
                            iconColor: 'text-red-500'
                        },
                        { 
                            icon: Star, 
                            label: 'Most Problems Solved', 
                            value: stats.mostSolved,
                            color: 'bg-white/80',
                            iconColor: 'text-red-500'
                        },
                        { 
                            icon: Flame, 
                            label: 'Average Rating', 
                            value: stats.averageRating,
                            color: 'bg-white/80',
                            iconColor: 'text-red-500'
                        }
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            className="bg-white/60 backdrop-blur-lg border border-red-400 hover:scale-105 transition-all duration-300 shadow-2xl rounded-3xl p-6 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">{stat.label}</p>
                                    <p className="text-gray-900 text-xl font-bold">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scrollable Container - Only for the Table */}
                <div className="bg-white/100 backdrop-blur-lg border border-red-500/50 shadow-2xl ml-5 mr-5 hover:scale-105 transition-all duration-300 rounded-3xl overflow-hidden h-[calc(100vh-24rem)]">
                    {/* Table Header - Sticky */}
                    <div className="grid grid-cols-12 gap-4 p-6 bg-white/100 border-b border-red-400/50 sticky top-0 z-10">
                        <div className="col-span-1 text-center text-black font-semibold">Rank</div>
                        <div className="col-span-4 text-black font-semibold">User</div>
                        <div 
                            className="col-span-3 text-black font-semibold cursor-pointer flex items-center gap-1 hover:text-red-500 transition-colors"
                        
                        >
                            Rating
                        </div>
                        <div 
                            className="col-span-4 text-black font-semibold cursor-pointer flex items-center gap-1 hover:text-red-500 transition-colors"
                        >
                            Problems Solved
                        </div>
                    </div>

                    {/* Scrollable Table Body */}
                    <div className="overflow-y-auto h-[calc(100%-4rem)]">
                        {[...users]
                            .sort((a, b) => {
                                const multiplier = sortOrder === 'asc' ? 1 : -1;
                                return (a[sortBy] - b[sortBy]) * multiplier;
                            })
                            .map((user) => (
                                <div
                                    key={user.id}
                                    className={`grid grid-cols-12 gap-4 p-6 border-b border-red-400/30 hover:bg-red-400/30 transition-all duration-300 relative ${
                                        userData?.username === user.username ? 'bg-red-400/30 border-red-500/50' : ''
                                    }`}
                                >
                                    {getRankBadge(user.rank)}
                                    <div className="col-span-1 text-center">
                                        <span className={`text-lg font-bold ${getMedalColor(user.rank)}`}>
                                            #{user.rank}
                                        </span>
                                    </div>
                                    <div className="col-span-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-red-500 font-bold border border-red-400">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 font-medium">{user.username}</span>
                                                <span className="text-gray-600 text-xs">{user.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-red-500" />
                                            <span className="text-gray-900 font-medium">{user.rating || 0}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-red-500" />
                                            <span className="text-gray-900 font-medium">{user.problemsSolved || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
