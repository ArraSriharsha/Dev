import { Link } from 'react-router-dom'
import { signup } from '../services/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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
            await signup(formData);
            toast.success('Account created successfully! Please sign in.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark"
            });
            navigate('/');
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
        <div className="min-h-screen flex items-center justify-center px-4 py-10 relative bg-gradient-to-b from-black to-red-200">
            <div className="absolute inset-0">
                <img src="/front.svg" className="w-full h-full object-cover opacity-70" alt="background" />
            </div>

            <div className="w-full max-w-6xl relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="border-2 border-red-500/50 rounded-xl p-6 md:p-8 shadow-2xl bg-black/60 backdrop-blur-sm max-w-md w-full mx-auto">
                        <a className="flex items-center justify-center mb-6 text-2xl font-bold text-white">
                            <img className="w-8 h-8 mr-2 text-red-500" src="/logo.svg" alt="logo" />
                            <h2 className="text-2xl font-bold text-white">
                                Code <span className="text-red-500">Arena</span>
                            </h2>
                        </a>
                       
                    
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">First Name</label>
                                    <input
                                        type="text"
                                        name="FirstName"
                                        value={formData.FirstName}
                                        onChange={handleChange}
                                        className="w-full text-sm text-white bg-black/70 border-2 border-red-500/50 pl-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Enter First Name"
                                    />
                                </div>
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">Last Name</label>
                                    <input
                                        type="text"
                                        name="LastName"
                                        value={formData.LastName}
                                        onChange={handleChange}
                                        className="w-full text-sm text-white bg-black/70 border-2 border-red-500/50 pl-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Enter Last Name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">Email</label>
                                <input
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    className="w-full text-sm text-white bg-black/70 border-2 border-red-500/50 pl-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Enter Email"
                                />
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">Username</label>
                                <input
                                    type="text"
                                    name="Username"
                                    value={formData.Username}
                                    onChange={handleChange}
                                    className="w-full text-sm text-white bg-black/70 border-2 border-red-500/50 pl-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Enter Username"
                                />
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">Phone Number</label>
                                <input
                                    type="tel"
                                    name="PhoneNumber"
                                    value={formData.PhoneNumber}
                                    onChange={handleChange}
                                    className="w-full text-sm text-white bg-black/70 border-2 border-red-500/50 pl-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="Enter Phone Number"
                                />
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="Password"
                                        value={formData.Password}
                                        onChange={handleChange}
                                        className="w-full text-sm text-white bg-black/70 border-2 border-red-500/50 pl-4 pr-10 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="Enter Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        <img
                                            src={showPassword ? "/eye-closed.svg" : "/eye-open.svg"}
                                            alt={showPassword ? "Hide password" : "Show password"}
                                            className="w-5 h-5"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center mt-2">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="h-4 w-4 shrink-0 text-red-500 focus:ring-red-500 border-2 border-white rounded bg-black/70"
                                    required
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                                    I agree to the <a className="text-white hover:text-red-400 font-medium">Terms and Conditions</a>
                                </label>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/50 shadow-xl transition-all duration-200"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creating...' : 'Create Account'}
                                </button>
                                <p className="text-sm mt-4 text-center text-gray-400">
                                    Already have an account? <Link to="/" className="text-white hover:text-red-400 font-medium ml-1">Sign in</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
