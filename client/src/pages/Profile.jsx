import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { api, logout } from '../services/api';
import { User, Mail, Phone, CircleUser, LogOutIcon } from 'lucide-react';
import Sidebar from '../components/Sidebar';
const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/profile');
                setUserData(response.data);
                setError(null);
            } catch (error) {
                if (error.response?.status === 401) {
                    setError('Please Sign in to view your Profile');
                } else {
                    setError(error.response?.data?.message || 'Failed to fetch profile data');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        const response = await logout();
        if (response.status === 200) {
            response.data.message === 'Logged out successfully' && navigate('/');
        }
        else {
            setError('Failed to logout');
        }
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <div className="text-2xl text-white">{error}</div>
                        {error.includes('Sign in') && (
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Go to Signin
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
        {/* <Navbar /> */}
        <div className="min-h-screen bg-gradient-to-b from-black to-red-200 text-white">
        <Sidebar />
        
            {/* <div className="w-full h-full absolute">
                <img src="/profile.svg" className="w-full h-full object-cover opacity-70" alt="background" />
            </div> */}
            {/* <div className="container mx-auto px-4 py-12">
                <div className="max-w-xl mx-auto">
                    <div className="bg-black/50 border-2 border-red-500/50 rounded-xl p-8 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-white-900/20 flex items-center justify-center">
                                <CircleUser size={40} className="text-gray-100" />
                            </div>
                            <div className="font-medium">
                                <div className="text-xl">{userData?.username}</div>
                                {userData?.createdAt && (
                                    <div className="text-sm text-gray-400">
                                        Joined on {new Date(userData.createdAt).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg border border-red-500/30">
                                <User className="text-red-500" size={24} />
                                <div>
                                    <p className="text-sm text-gray-400">Full Name</p>
                                    <p className="text-lg font-medium">{userData?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg border border-red-500/30">
                                <Mail className="text-red-500" size={24} />
                                <div>
                                    <p className="text-sm text-gray-400">Email</p>
                                    <p className="text-lg font-medium">{userData?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg border border-red-500/30">
                                <Phone className="text-red-500" size={24} />
                                <div>
                                    <p className="text-sm text-gray-400">Phone Number</p>
                                    <p className="text-lg font-medium">{userData?.phoneno}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <LogOutIcon size={35} className="text-red-500 cursor-pointer hover:text-red-600" onClick={handleLogout} />
                                <h2 className="text-gray-200 text-lg font-medium">Logout</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div> */}
        </div>
        </div>
    );
};

export default Profile;
