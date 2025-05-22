import { Link } from 'react-router-dom'
import { signup } from '../services/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
            case 'Email':
                if (!value) error = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email format';
                break;
            case 'Password':
                if (!value) error = 'Password is required';
                else if (value.length < 6) error = 'Password must be at least 6 characters';
                break;
            case 'PhoneNumber':
                if (!value) error = 'Phone number is required';
                else if (!/^\+?[\d\s-]{10,}$/.test(value)) error = 'Invalid phone number format';
                break;
            default:
                if (!value) error = `${name} is required`;
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
            const res = await signup(formData);
            if (res.status === 200) {
                navigate('/home');
            } else {
                setSubmitError(res.data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Could not Signup. Please try again.');
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
                        {submitError && (
                            <div className="p-2 text-sm text-white bg-red-100/10 rounded-lg border border-red-500/50 mb-4">
                                {submitError}
                            </div>
                        )}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">First Name</label>
                                    <input
                                        type="text"
                                        name="FirstName"
                                        value={formData.FirstName}
                                        onChange={handleChange}
                                        className={`w-full text-sm text-white bg-black/70 border-2 ${errors.FirstName ? 'border-red-500' : 'border-red-500/50'} pl-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                                        placeholder="Enter First Name"
                                    />
                                    {errors.FirstName && <p className="mt-1 text-sm text-red-500">{errors.FirstName}</p>}
                                </div>
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">Last Name</label>
                                    <input
                                        type="text"
                                        name="LastName"
                                        value={formData.LastName}
                                        onChange={handleChange}
                                        className={`w-full text-sm text-white bg-black/70 border-2 ${errors.LastName ? 'border-red-500' : 'border-red-500/50'} pl-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                                        placeholder="Enter Last Name"
                                    />
                                    {errors.LastName && <p className="mt-1 text-sm text-red-500">{errors.LastName}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">Email</label>
                                <input
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    className={`w-full text-sm text-white bg-black/70 border-2 ${errors.Email ? 'border-red-500' : 'border-red-500/50'} pl-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                                    placeholder="Enter Email"
                                />
                                {errors.Email && <p className="mt-1 text-sm text-red-500">{errors.Email}</p>}
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">Username</label>
                                <input
                                    type="text"
                                    name="Username"
                                    value={formData.Username}
                                    onChange={handleChange}
                                    className={`w-full text-sm text-white bg-black/70 border-2 ${errors.Username ? 'border-red-500' : 'border-red-500/50'} pl-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                                    placeholder="Enter Username"
                                />
                                {errors.Username && <p className="mt-1 text-sm text-red-500">{errors.Username}</p>}
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">Phone Number</label>
                                <input
                                    type="tel"
                                    name="PhoneNumber"
                                    value={formData.PhoneNumber}
                                    onChange={handleChange}
                                    className={`w-full text-sm text-white bg-black/70 border-2 ${errors.PhoneNumber ? 'border-red-500' : 'border-red-500/50'} pl-4 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
                                    placeholder="Enter Phone Number"
                                />
                                {errors.PhoneNumber && <p className="mt-1 text-sm text-red-500">{errors.PhoneNumber}</p>}
                            </div>
                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="Password"
                                        value={formData.Password}
                                        onChange={handleChange}
                                        className={`w-full text-sm text-white bg-black/70 border-2 ${errors.Password ? 'border-red-500' : 'border-red-500/50'} pl-4 pr-10 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500`}
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
                                {errors.Password && <p className="mt-1 text-sm text-red-500">{errors.Password}</p>}
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
                                    Already have an account? <Link to="/signin" className="text-white hover:text-red-400 font-medium ml-1">Sign in</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
