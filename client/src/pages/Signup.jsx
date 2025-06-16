import { Link } from 'react-router-dom'
import { signup } from '../services/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Eye, EyeOff, Code, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react'

export const Signup = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Username: '',
        PhoneNumber: '',
        Password: '',
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'FirstName':
                if (!value.trim()) error = 'First name is required';
                else if (value.length < 2) error = 'First name must be at least 2 characters';
               
                break;
            case 'LastName':
                if (!value.trim()) error = 'Last name is required';
                else if (value.length < 2) error = 'Last name must be at least 2 characters';
               
                break;
            case 'Email':
                if (!value.trim()) error = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address (e.g., user@example.com)';
                break;
            case 'Username':
                if (!value.trim()) error = 'Username is required';
                else if (value.length < 3) error = 'Username must be at least 3 characters';
                break;
            case 'Password':
                if (!value) error = 'Password is required';
                else if (value.length < 6) error = 'Password must be at least 6 characters';
                break;
            case 'PhoneNumber':
                if (!value.trim()) error = 'Phone number is required';
                else if (!/^\+?[\d\s-]{10,}$/.test(value)) error = 'Please enter a valid phone number (e.g., +1234567890)';
                break;
            default:
                if (!value.trim()) error = `${name} is required`;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        const error = validateField(name, value);
        setErrors({ ...errors, [name]: error });
        // Only show toast for errors when the field loses focus or on submit
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        setIsLoading(true);

        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSubmitError('Please fix the errors in the form');
            // Show all validation errors as toasts
            Object.values(newErrors).forEach(error => {
                toast.error(error, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark"
                });
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await signup(formData);
            toast.success(`Hello ${response.data.user.username}!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark"
            });
            navigate('/signin');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create account';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark"
            });
            setSubmitError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-red-50 to-red-100">
        <div className="absolute inset-0 bg-[url('/front.svg')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-red-50/80"></div>

            <div className="w-full max-w-5xl py-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Left side - Welcome Message */}
                    <div className="hidden md:block text-gray-800 space-y-8">
                        <div className="flex items-center gap-3 mb-8">
                            <img src="/logored.svg" alt="Code Arena" className="w-12 h-12" />
                            <h1 className="text-4xl font-bold">
                                Code <span className="text-red-600">Arena</span>
                            </h1>
                        </div>
                        <h2 className="text-5xl font-bold leading-tight">
                            Join Our Coding<br />
                            <span className="text-red-600">Community</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Create your account and start your coding journey. Practice, compete, and grow with our community of developers.
                        </p>
                        <div className="mt-12 space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
                                    <Code className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">1000+ Problems</h3>
                                    <p className="text-gray-600">Access our extensive problem library</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
                                    <Code className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Regular Contests</h3>
                                    <p className="text-gray-600">Compete with developers worldwide</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
                                    <Code className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Track Progress</h3>
                                    <p className="text-gray-600">Monitor your coding journey</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right side - Signup Form */}
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 md:ml-8">
                        <div className="flex items-center justify-center mb-6 md:hidden">
                            <img src="/logored.svg" alt="Code Arena" className="w-8 h-8 mr-2" />
                            <h1 className="text-xl font-bold text-gray-800">
                                Code <span className="text-red-600">Arena</span>
                            </h1>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <h1 className="text-2xl font-bold text-center text-gray-800">Create Account</h1>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-gray-700 text-sm font-medium mb-1.5 block">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            name="FirstName"
                                            value={formData.FirstName}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-9 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                            placeholder="Enter First Name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-700 text-sm font-medium mb-1.5 block">Last Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="text"
                                            name="LastName"
                                            value={formData.LastName}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-9 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                            placeholder="Enter Last Name"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-700 text-sm font-medium mb-1.5 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="email"
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleChange}
                                        className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-9 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                        placeholder="Enter Email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-700 text-sm font-medium mb-1.5 block">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        name="Username"
                                        value={formData.Username}
                                        onChange={handleChange}
                                        className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-9 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                        placeholder="Enter Username"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-700 text-sm font-medium mb-1.5 block">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="tel"
                                        name="PhoneNumber"
                                        value={formData.PhoneNumber}
                                        onChange={handleChange}
                                        className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-9 pr-3 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                        placeholder="Enter Phone Number"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-700 text-sm font-medium mb-1.5 block">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="Password"
                                        value={formData.Password}
                                        onChange={handleChange}
                                        className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-9 pr-9 py-2.5 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                        placeholder="Enter Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                    required
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                                    I agree to the <a className="text-red-600 hover:text-red-700 font-medium">Terms and Conditions</a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/signin" className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
