import { Link } from 'react-router-dom'
import { useState } from 'react'
import { signin } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Code, Eye, EyeOff } from 'lucide-react'

export const Signin = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        login: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'login':
                if (!value) error = 'Username/Email is required';
                break;
            case 'password':
                if (!value) error = 'Password is required';
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: validateField(name, value) });
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
            setSubmitError('Please fill all required fields correctly');
            toast.error('Please fill all required fields correctly');
            setIsLoading(false);
            return;
        }

        try {
            const response = await signin(formData);
            toast.success(`Welcome back, ${response.data.user.username}!`);
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to sign in';
            toast.error(errorMessage);
            setSubmitError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-white to-red-300">
            <div className="absolute inset-0 bg-[url('/front.svg')] bg-cover bg-center opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-red-100/50"></div>
            
            <div className="w-full max-w-6xl px-4 py-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left side - Welcome Message */}
                    <div className="hidden md:block text-gray-800 space-y-6">
                        <div className="flex items-center gap-3 mb-8">
                            <img src="/logored.svg" alt="Code Arena" className="w-10 h-10" />
                            <h1 className="text-3xl font-bold">
                                Code <span className="text-red-500">Arena</span>
                            </h1>
                        </div>
                        <h2 className="text-4xl font-bold leading-tight">
                            Welcome Back to <br />
                            <span className="text-red-500">Code Arena</span>
                        </h2>
                        <p className="text-gray-900 text-lg font-medium leading-relaxed">
                            Sign in to continue your coding journey. Practice, compete, and conquer challenges with our community of developers.
                        </p>
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <Code className="w-4 h-4 text-red-500" />
                                </div>
                                <span className="text-gray-900 font-roboto">Access 1000+ coding problems</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <Code className="w-4 h-4 text-red-500" />
                                </div>
                                <span className="text-gray-900 font-roboto">Participate in regular contests</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                    <Code className="w-4 h-4 text-red-500" />
                                </div>
                                <span className="text-gray-900 font-roboto">Track your progress</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Sign In Form */}
                    <div className="bg-white/80 backdrop-blur-lg hover:scale-105 transition-all duration-300 rounded-2xl p-8 shadow-xl border border-red-100">
                        <div className="flex items-center justify-center mb-8 md:hidden">
                            <img src="/logored.svg" alt="Code Arena" className="w-10 h-10 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-800">
                                Code <span className="text-red-500">Arena</span>
                            </h1>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="text-gray-700 text-sm font-medium mb-2 block">Username or Email</label>
                                <div className="relative">
                                    <input 
                                        name="login" 
                                        type="text" 
                                        required 
                                        className="w-full text-gray-800 bg-white border border-red-200 pl-4 pr-10 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200" 
                                        placeholder="Enter username or email" 
                                        onChange={handleChange} 
                                        value={formData.login}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-700 text-sm font-medium mb-2 block">Password</label>
                                <div className="relative">
                                    <input 
                                        name="password" 
                                        type={showPassword ? "text" : "password"} 
                                        required 
                                        className="w-full text-gray-800 bg-white border border-red-200 pl-4 pr-10 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200" 
                                        placeholder="Enter password" 
                                        onChange={handleChange} 
                                        value={formData.password}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input 
                                        id="remember-me" 
                                        name="remember-me" 
                                        type="checkbox" 
                                        className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" 
                                    />
                                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-600">
                                        Remember me
                                    </label>
                                </div>
                                <Link to="/forgot-password" className="text-sm text-red-500 hover:underline hover:text-red-600 transition-colors duration-200">
                                    Forgot password?
                                </Link>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign in'
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-red-500 hover:underline hover:text-red-600 transition-colors duration-200 font-medium">
                                    Register Here!
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};