import { Link } from 'react-router-dom'
import { useState } from 'react'
import { signin } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Code, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'

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
        <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-red-50 to-red-100">
            <div className="absolute inset-0 bg-[url('/front.svg')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-red-50/80"></div>
            
            <div className="w-full max-w-6xl px-4 py-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left side - Welcome Message */}
                    <div className="hidden md:block text-gray-800 space-y-8">
                        <div className="flex items-center gap-3 mb-8">
                            <img src="/logored.svg" alt="Code Arena" className="w-12 h-12" />
                            <h1 className="text-4xl font-bold">
                                Code <span className="text-red-600">Arena</span>
                            </h1>
                        </div>
                        <h2 className="text-5xl font-bold leading-tight">
                            Welcome Back to <br />
                            <span className="text-red-600">Code Arena</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Sign in to continue your coding journey. Practice, compete, and conquer challenges with our community of developers.
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

                    {/* Right side - Sign In Form */}
                    <div className="bg-white/80 rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl border border-red-500/30 transition-all duration-300">
                        <div className="flex items-center justify-center mb-8 md:hidden">
                            <img src="/logored.svg" alt="Code Arena" className="w-10 h-10 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-800">
                                Code <span className="text-red-600">Arena</span>
                            </h1>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="text-gray-700 text-sm font-medium mb-2 block">Username or Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input 
                                        name="login" 
                                        type="text" 
                                        required 
                                        className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200" 
                                        placeholder="Enter username or email" 
                                        onChange={handleChange} 
                                        value={formData.login}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-700 text-sm font-medium mb-2 block">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input 
                                        name="password" 
                                        type={showPassword ? "text" : "password"} 
                                        required 
                                        className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-12 pr-12 py-3.5 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200" 
                                        placeholder="Enter password" 
                                        onChange={handleChange} 
                                        value={formData.password}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
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
                                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-red-500 rounded" 
                                    />
                                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-600">
                                        Remember me
                                    </label>
                                </div>
                                <Link to="/forgot-password" className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200">
                                    Forgot password?
                                </Link>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/signup" className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200">
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