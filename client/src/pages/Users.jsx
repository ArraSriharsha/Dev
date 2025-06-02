import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Typography, Card } from "@material-tailwind/react";
import { getUsers, createUser, updateUser, deleteUser, getProfile } from '../services/api';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Username: '',
        Password: '',
        PhoneNumber: '',
        Role: 'User'
    });
    const [formErrors, setFormErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 5;
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');

            // First get user profile to check if admin
            const profileResponse = await getProfile();
            if(profileResponse){
                setUserData(profileResponse.data);
            }
            else{
                setError('Please Sign in to access this page');
                return;
            }
            if (profileResponse.data.role !== 'Admin') {
                setError('You do not have permission to access this page');
                return;
            }

            const response = await getUsers();
            setUsers(response.data.users);
            setTotalPages(Math.ceil(response.data.users.length / usersPerPage));
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Please Sign in to access this page');
            } else {
                const errorMessage = error.response?.data?.message || 'Failed to fetch users';
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        
        // First Name validation
        if (!formData.FirstName.trim()) {
            errors.FirstName = 'First name is required';
        } else if (formData.FirstName.length < 2) {
            errors.FirstName = 'First name must be at least 2 characters';
        }

        // Last Name validation
        if (!formData.LastName.trim()) {
            errors.LastName = 'Last name is required';
        } else if (formData.LastName.length < 2) {
            errors.LastName = 'Last name must be at least 2 characters';
        }

        // Email validation
        if (!formData.Email.trim()) {
            errors.Email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
            errors.Email = 'Please enter a valid email address';
        }

        // Username validation
        if (!formData.Username.trim()) {
            errors.Username = 'Username is required';
        } else if (formData.Username.length < 3) {
            errors.Username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.Username)) {
            errors.Username = 'Username can only contain letters, numbers, and underscores';
        }

        // Password validation (only for new users or when password is provided)
        if (!selectedUser || formData.Password) {
            if (!formData.Password) {
                errors.Password = 'Password is required';
            } else if (formData.Password.length < 6) {
                errors.Password = 'Password must be at least 6 characters';
            }
        }

        // Phone Number validation
        if (formData.PhoneNumber && !/^\+?[\d\s-]{10,}$/.test(formData.PhoneNumber)) {
            errors.PhoneNumber = 'Please enter a valid phone number';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            setError('');
            if (selectedUser) {
                await updateUser(selectedUser._id, formData);
                toast.success('User updated successfully!');
            } else {
                await createUser(formData);
                toast.success('User created successfully!');
            }
            await fetchUsers();
            resetForm();
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
                navigate('/signin');
            } else {
                const errorMessage = error.response?.data?.message || 'Failed to save user';
                toast.error(errorMessage);
            }
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                setError('');
                await deleteUser(userId);
                toast.success('User deleted successfully!');
                fetchUsers();
            } catch (error) {
                if (error.response?.status === 401) {
                    setError('Your session has expired. Please log in again.');
                    navigate('/signin');
                } else {
                    const errorMessage = error.response?.data?.message || 'Failed to delete user';
                    toast.error(errorMessage);
                }
            }
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            Username: user.Username,
            Password: '',
            PhoneNumber: user.PhoneNumber,
            Role: user.Role
        });
    };

    const resetForm = () => {
        setSelectedUser(null);
        setFormData({
            FirstName: '',
            LastName: '',
            Email: '',
            Username: '',
            Password: '',
            PhoneNumber: '',
            Role: 'User'
        });
    };

    const currentUsers = users.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex">
                <div className="w-20 flex-shrink-0">
                  <Sidebar userData={userData || {}} />
                </div>
                <div className="flex-1 flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    <span className="text-white text-xl font-semibold">Loading.. Please wait</span>
                </div>
            </div>
        );
    }

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
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-black via-red-100 to-red-200 flex">
            <div className="w-20 flex-shrink-0">
                <Sidebar userData={userData || {}} />
            </div>
            <div className="flex-1 flex overflow-hidden">
                {/* Left Column: Users List */}
                <div className="w-1/2 pxl-2 p-6 mt-14 overflow-y-auto">
                    <Card className="bg-white/60 backdrop-blur-lg border border-red-400  hover:scale-105  transition-all duration-300 shadow-2xl rounded-3xl p-6 h-[calc(100vh-12rem)]">
                        <Typography variant="h4" className="text-gray-900 mb-6">
                            Users List
                        </Typography>
                        
                        <div className="space-y-3">
                            {currentUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="bg-white/80 rounded-xl p-3 border border-gray-200 hover:border-red-400 transition-all"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    user.Role === 'Admin' ? 'bg-red-100 text-red-800' : user.Role === 'Moderator' ?
                                                    'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {user.Role}
                                                </span>
                                                <h3 className="text-base font-semibold text-gray-900">{user.Username}</h3>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {user.FirstName} {user.LastName} • {user.Email}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2 mt-6">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-200"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-200"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </Card>
                </div>

                {/* User Form */}
                <div className="w-1/2 pxl-2 p-6 mt-11 overflow-y-auto">
                    <Card className="bg-white/60 backdrop-blur-lg border border-red-400 overflow-y-auto shadow-2xl rounded-3xl p-6 h-[calc(100vh-10rem)]">
                        <Typography variant="h4" className="text-gray-900 mb-6">
                            {selectedUser ? 'Edit User' : 'Add New User'}
                        </Typography>
                    
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="FirstName"
                                        value={formData.FirstName}
                                        onChange={handleInputChange}
                                        required
                                        className={`w-full px-3 py-2 text-sm bg-white/80 border ${formErrors.FirstName ? 'border-red-500' : 'border-white/20'} rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="LastName"
                                        value={formData.LastName}
                                        onChange={handleInputChange}
                                        required
                                        className={`w-full px-3 py-2 text-sm bg-white/80 border ${formErrors.LastName ? 'border-red-500' : 'border-white/20'} rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleInputChange}
                                    required
                                    className={`w-full px-3 py-2 text-sm bg-white/80 border ${formErrors.Email ? 'border-red-500' : 'border-white/20'} rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                               
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="Username"
                                    value={formData.Username}
                                    onChange={handleInputChange}
                                    required
                                    className={`w-full px-3 py-2 text-sm bg-white/80 border ${formErrors.Username ? 'border-red-500' : 'border-white/20'} rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500` }
                                />
                                
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {selectedUser && '(leave blank to keep current)'}
                                </label>
                                <div className="relative flex items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="Password"
                                    value={formData.Password}
                                    onChange={handleInputChange}
                                    required={!selectedUser}
                                    className={`w-full px-3 py-2 bg-white/80 text-sm border ${formErrors.Password ? 'border-red-500' : 'border-white/20'} rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}/>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-red-500 transition-colors duration-200"
                                    >
                                        <img 
                                            src={showPassword ? "/eye-closed.svg" : "/eye-open.svg"} 
                                            alt={showPassword ? "Hide password" : "Show password"} 
                                            className="w-5 h-5 invert opacity-80 hover:opacity-100" 
                                        />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="PhoneNumber"
                                    value={formData.PhoneNumber}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 text-sm bg-white/80 border ${formErrors.PhoneNumber ? 'border-red-500' : 'border-white/20'} rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    name="Role"
                                    value={formData.Role}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 text-sm bg-white/80 border border-white/20 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="User">User</option>
                                    <option value="Moderator">Moderator</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-4">
                                {selectedUser && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        
                                    </>
                                )}
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                                >
                                    {selectedUser ? 'Update User' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Users;