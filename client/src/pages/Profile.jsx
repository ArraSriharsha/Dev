import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Typography, Card } from "@material-tailwind/react";
import { UserIcon } from '@heroicons/react/24/solid';
import { updateProfile, getProfile, getSubmissions, deleteAccount } from '../services/api';
import { CheckCircle2, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updated, setUpdated] = useState(false);
    const [stats, setStats] = useState({
        problemsSolved: 0,
        totalSubmissions: 0,
        accuracy: 0,
        score: 0
    });
    const [form, setForm] = useState({
        PhoneNumber: '',
        Email: '',
        FirstName: '',
        LastName: '',
        Username: ''
    });
    const [formErrors, setFormErrors] = useState({}); 
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const response = await getProfile(); //returns null if not signed in
                const res = await getSubmissions(); // throws error if not signed in
                const SUB = await res.data.filter(sub => sub.status === 'AC' || sub.status === 'WA');
                setUserData(response.data);
                
                // Calculate statistics
                const uniqueProblems = new Set(SUB.map(sub => sub.problemTitle));
                const passedSubmissions = SUB.filter(sub => sub.status === 'AC').length;
                const accuracy = SUB.length > 0
                    ? (passedSubmissions / SUB.length) * 100
                    : 0;

                
                const totalScore = SUB.reduce((acc, sub) => acc + sub.score, 0);

                setStats({
                    problemsSolved: uniqueProblems.size,
                    totalSubmissions: SUB.length,
                    accuracy: Math.round(accuracy),
                    score: totalScore
                });

                setError(null);
                setForm({
                    PhoneNumber: response.data.phoneno || '',
                    Email: response.data.email || '',
                    FirstName: response.data.firstname || '',
                    LastName: response.data.lastname || '',
                    Username: response.data.username || ''
                });
            } catch (error) {
                if (error.response?.status === 401) {
                    setError('Please Sign in to view your Profile');
                } else {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch profile data';
                    toast.error(errorMessage);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [updated]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: '' }); // clear error on change
    };

    const validate = () => {
        const errors = {};
        if (!form.PhoneNumber.trim()) errors.PhoneNumber = 'Phone number is required.';
        if (!form.Email.trim()) errors.Email = 'Email is required.';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.Email)) errors.Email = 'Invalid email address.';
        if (!form.FirstName.trim()) errors.FirstName = 'First name is required.';
        if (!form.LastName.trim()) errors.LastName = 'Last name is required.';
        if (!form.Username.trim()) errors.Username = 'Username is required.';
        return errors;
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            try {
                setIsLoading(true);
                const response = await updateProfile(form);
                setUpdated(prev => !prev);
                setError(null);
                toast.success('Profile updated successfully!');
            } catch (error) {
                if (error.response?.status === 401) {
                    setError('Your session has expired. Please log in again.');
                    navigate('/signin');
                } else {
                    const errorMessage = error.response?.data?.message || 'Failed to update profile';
                    toast.error(errorMessage);
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            // Show validation errors in toast
            Object.values(errors).forEach(error => {
                toast.error(error);
            });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
            toast.success('Account deleted successfully!');
            navigate('/signin');
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
                navigate('/signin');
            } else {
                const errorMessage = error.response?.data?.message || 'Failed to delete account';
                toast.error(errorMessage);
            }
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                        <div className="text-2xl text-white">{error}</div>
                        {error.includes('Sign in') ? (
                            <button
                                onClick={() => navigate('/signin')}
                                className="px-6 py-2 bg-red-500 hover:bg-red-500/30 text-white border border-red-500/30 rounded-lg transition-colors"
                            >
                                Go to Signin
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/')}
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex">
                <div className="w-20 flex-shrink-0">
                    <Sidebar userData={userData || {}} />
                </div>
                <div className="flex-1 flex items-center justify-center gap-2 ">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 gap-2"></div>
                    <span className="text-white gap-3 text-xl font-semibold">Loading.. Please wait</span>
                </div>
            </div>
        );
    }


    return (
        <div className="h-screen bg-gradient-to-br from-black via-red-100 to-red-200 flex items-center justify-center">
            {/* Sidebar */}
            <div className="w-20 flex-shrink-0">
                <Sidebar userData={userData || {}} />
            </div>
            {/* Main Content: Two-column layout */}
            <div className="flex-1 flex items-center justify-center overflow-auto">
                <div className="w-full max-w-5xl p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* User Card (left) */}
                    <Card className="bg-white/60 backdrop-blur-lg border border-red-400 shadow-2xl rounded-3xl hover:scale-105 hover:shadow-red-300 transition-all duration-300 p-2 flex flex-col justify-start min-h-[260px]">
                        <div className="flex items-center mt-4 gap-3 ">
                            <UserIcon className="h-14 w-14 text-red-500 bg-white rounded-full p-2 border-2 border-red-400 shadow" />
                            <div>
                                <Typography variant="h5" className="font-bold text-gray-900 leading-tight">
                                    {userData?.username || userData?.name || 'User'}
                                </Typography>
                                <div className="flex items-center gap-2">
                                    <Typography className="text-xs text-gray-500 mt-0.5">
                                        Joined {new Date(userData.createdAt || userData.joinDate).toLocaleDateString()}
                                    </Typography>
                                    <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full">
                                        {userData?.role || 'User'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Section */}
                        <div className="mt-6 space-y-5">
                            {/* Accuracy Circle */}
                            <div className="flex justify-center mb-4">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        {/* Background circle */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="#ffffff"
                                            strokeWidth="8"
                                        />
                                        {/* Progress circle */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth="8"
                                            strokeDasharray={`${stats.accuracy * 2.83} 283`}
                                            transform="rotate(-90 50 50)"
                                            className="transition-all duration-500"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <Typography variant="h4" className="font-bold text-gray-900 text-xl">
                                            {stats.accuracy}%
                                        </Typography>
                                        <Typography variant="small" className="text-gray-600 text-sm">
                                            Accuracy
                                        </Typography>
                                    </div>
                                </div>
                                {/* Score Display */}
                                <div className="ml-6 flex flex-col justify-center">
                                    <div className="bg-white/80 rounded-xl p-4 shadow-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                                                <span className="text-2xl font-bold text-red-500">🏆</span>
                                            </div>
                                            <div>
                                                <Typography variant="h4" className="font-bold text-gray-900">
                                                    {stats.score}
                                                </Typography>
                                                <Typography variant="small" className="text-gray-600">
                                                    Rating
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/80 rounded-xl p-2 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            <Typography variant="h6" className="font-semibold text-gray-900">
                                                {stats.problemsSolved}
                                            </Typography>
                                        </div>
                                        <Typography variant="small" className="text-gray-600">
                                            Problems Solved
                                        </Typography>
                                    </div>
                                    <div className="bg-white/80 rounded-xl p-2 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <FileText className="h-5 w-5 text-blue-500" />
                                            <Typography variant="h6" className="font-semibold text-gray-900">
                                                {stats.totalSubmissions}
                                            </Typography>
                                        </div>
                                        <Typography variant="small" className="text-gray-600">
                                            Total Submissions
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Editable Details Form (right) */}
                    <form className="bg-transparent flex flex-col justify-between min-h-[260px] space-y-4" onSubmit={handleUpdateProfile}>
                        <div>
                            
                            <label className="text-bold text-gray-700 mb-1 block">Firstname</label>
                            <input
                                type="text"
                                name="FirstName"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80"
                                value={form.FirstName}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            
                            <label className="text-bold text-gray-700 mb-1 block">Lastname</label>
                            <input
                                type="text"
                                name="LastName"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80"
                                value={form.LastName}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                           
                            <label className="text-bold text-gray-700 mb-1 block">Email</label>
                            <input
                                type="email"
                                name="Email"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80"
                                value={form.Email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            
                            <label className="text-bold text-gray-700 mb-1 block">Username</label>
                            <input
                                type="text"
                                name="Username"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80"
                                value={form.Username}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                           
                            <label className="text-bold text-gray-700 mb-1 block">Phonenumber</label>
                            <input
                                type="text"
                                name="PhoneNumber"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 text-gray-900 bg-white/80"
                                value={form.PhoneNumber}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                                disabled={isLoading}
                                onClick={handleUpdateProfile}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                                disabled={isLoading}
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                        handleDeleteAccount();
                                    }
                                }}
                            >
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
