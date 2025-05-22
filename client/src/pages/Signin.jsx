import { Link } from 'react-router-dom'
import { useState } from 'react'
import { signin } from '../services/api'
import { useNavigate } from 'react-router-dom' 

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
            case 'username':
                if (!value) error = 'Username is required';
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
            setIsLoading(false);
            return;
        }

        try {
            const res = await signin(formData);
            if (res.status === 200) {
                navigate('/home');
            } else {
                setSubmitError(res.data.message || 'Signin failed. Please try again.');
            }
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Could not Signin. Please try again.');
        } finally {
            setIsLoading(false);
        }
        
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-b from-black to-red-200">
            <div className="w-full h-full absolute">
                <img src="/front.svg" className="w-full h-full object-cover opacity-70" alt="background" />
            </div>
            <div className="py-6 px-4 w-full max-w-6xl">

                <div className="grid md:grid-cols-2 items-center gap-6">
                    <div className="border-2 border-red-500/50 rounded-lg p-6 max-w-md shadow-lg bg-black/50 backdrop-blur-sm">
                        <a className="flex items-center justify-center mb-6 text-2xl font-bold text-white">
                            <img className="w-8 h-8 mr-2 text-red-500" src="/logo.svg" alt="logo" />
                            <h2 className="text-2xl font-bold text-white">
                                Code <span className="text-red-500">Arena</span>
                            </h2>
                        </a>
                        {submitError && (
                            <div className="p-2 text-sm text-white bg-red-100/10 rounded-lg border border-red-500/50 mb-4">
                                {submitError}
                            </div>
                        )}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="mb-8">
                                <p className="text-gray-300 text-2xl text-center leading-relaxed">Sign in to your Account</p>
                            </div>

                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">Username or Email</label>
                                <div className="relative flex items-center">
                                    <input name="login" type="text" required className="w-full text-sm text-white bg-black/70 border-2 border-red-500/50 pl-4 pr-10 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Enter username or email" onChange={handleChange} value={formData.login}/>
                                </div>
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input name="password" type={showPassword ? "text" : "password"} required className="w-full text-sm text-white bg-black/70 border-2 border-red-500/50 pl-4 pr-10 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Enter password" onChange={handleChange} value={formData.password}/>
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors duration-200">
                                        <img src={showPassword ? "/eye-closed.svg" : "/eye-open.svg"} alt={showPassword ? "Hide password" : "Show password"} className="w-5 h-5 text-red-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-red-500 focus:ring-red-500 border-2 border-white rounded bg-black/70" />
                                    <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-300">
                                        Remember me
                                    </label>
                                </div>
                                {/* TODO: Add forgot password functionality */}
                                <div className="text-sm">
                                    <a href="#" className="text-white hover:text-red-400 transition-colors duration-200 font-medium">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>

                            <div className="!mt-12">
                                <button type="submit" className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/50 cursor-pointer transition-all duration-200" disabled={isLoading}>
                                    {isLoading ? 'Signing in...' : 'Sign in'}
                                </button>
                                <p className="text-sm !mt-6 text-center text-gray-400">Don't have an account ? <Link to="/signup" className="text-white hover:text-red-400 transition-colors duration-200 font-medium ml-1 whitespace-nowrap">Register Here!</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}