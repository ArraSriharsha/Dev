import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff, Code } from 'lucide-react'
import { sendOTP, resetPassword, verifyOTP } from '../services/api'
import { toast } from 'react-toastify'

const Forgot = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        otp: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [Verified, setVerified] = useState(false)
    const [otp, setOtp] = useState('')
    const [otpsent, setOtpSent] = useState(false)
    const navigate = useNavigate()
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSendOTP = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await sendOTP(formData)
            if (response.status === 200) {
                toast.success('OTP sent successfully!')
                setOtpSent(true)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP')
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerifyOTP = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await verifyOTP({
                email: formData.email,
                otp: formData.otp
            });
            if (response.status === 200) {
                toast.success('OTP verified successfully!')
                setVerified(true)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to verify OTP')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault() // ** important prevent default to avoid form submission
        setIsLoading(true)
        try {
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match')
                return
            }
            if(formData.password.length < 6){
                toast.error('Password must be at least 6 characters long')
                return
            }
            const response = await resetPassword(formData)
            if (response.status === 200) {
                toast.success('Password reset successfully!')
                navigate('/signin')
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password')
        } finally {
            setIsLoading(false)
        }
    }

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

                    {/* Right side - Forms */}
                    {!otpsent ? (
                        <div className='w-full '>
                            <div className="bg-white/80 backdrop-blur-lg hover:scale-105 transition-all duration-300 rounded-2xl p-8 shadow-xl border border-red-100">
                                <div className="flex items-center justify-center mb-8 md:hidden">
                                    <img src="/logored.svg" alt="Code Arena" className="w-10 h-10 mr-2" />
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        Code <span className="text-red-500">Arena</span>
                                    </h1>
                                </div>

                                <form className="space-y-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-center text-gray-800">Forgot your Password?</h1>
                                        <label className="text-gray-700 text-sm mt-4 font-medium mb-2 block">Enter your email to get OTP</label>
                                        <div className="relative">
                                            <input
                                                name="email"
                                                type="text"
                                                required
                                                className="w-full text-gray-800 bg-white border border-red-200 pl-4 pr-10 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                                placeholder="Enter email"
                                                onChange={handleChange}
                                                value={formData.email}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isLoading}
                                            onClick={handleSendOTP}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                    Sending OTP...
                                                </div>
                                            ) : (
                                                'Send OTP'
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-center text-sm text-gray-600">
                                        Do not have an account?{' '}
                                        <Link to="/signup" className="text-red-500 hover:underline hover:text-red-600 transition-colors duration-200 font-medium">
                                            Sign up Here!
                                        </Link>
                                    </p>
                                </form>
                            </div>
                        </div>
                    ) : Verified ? (
                        <div className='w-full '>
                            <div className="bg-white/80 backdrop-blur-lg hover:scale-105 transition-all duration-300 rounded-2xl p-8 shadow-xl border border-red-100">
                                <div className="flex items-center justify-center mb-8 md:hidden">
                                    <img src="/logored.svg" alt="Code Arena" className="w-10 h-10 mr-2" />
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        Code <span className="text-red-500">Arena</span>
                                    </h1>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-center text-gray-800">Reset your Password</h1>
                                    <label className="text-gray-700 text-sm mt-3 font-medium mb-2 block">New Password</label>
                                    <div className="relative">
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full text-gray-800 bg-white border border-red-200 pl-4 pr-10 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                            placeholder="Enter new password"
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
                                    <label className="text-gray-700 text-sm font-medium mb-2 block mt-4">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            name="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            className="w-full text-gray-800 bg-white border border-red-200 pl-4 pr-10 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                            placeholder="Enter confirm password"
                                            onChange={handleChange}
                                            value={formData.confirmPassword}
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

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                    disabled={isLoading}
                                    onClick={handleResetPassword}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Resetting Password...
                                        </div>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='w-full '>
                            <div className="bg-white/80 backdrop-blur-lg hover:scale-105 transition-all duration-300 rounded-2xl p-8 shadow-xl border border-red-100">
                                <div className="flex items-center justify-center mb-8 md:hidden">
                                    <img src="/logored.svg" alt="Code Arena" className="w-10 h-10 mr-2" />
                                    <h1 className="text-2xl font-bold text-gray-800">
                                        Code <span className="text-red-500">Arena</span>
                                    </h1>
                                </div>
                                <div>
                                    <form className="space-y-6">
                                        <div>
                                            <h1 className="text-2xl font-bold text-center text-gray-800">OTP sent to your Email</h1>
                                            <label className="text-gray-700 text-sm mt-4 font-medium mb-2 block">*Do not share your OTP with anyone*</label>
                                            <div className="relative">
                                                <input
                                                    name="otp"
                                                    type="text"
                                                    required
                                                    className="w-full text-gray-800 bg-white border border-red-200 pl-4 pr-10 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                                    placeholder="Enter OTP"
                                                    onChange={handleChange}
                                                    value={formData.otp}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                            disabled={isLoading}
                                            onClick={handleVerifyOTP}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                    Verifying OTP...
                                                </div>
                                            ) : (
                                                'Verify OTP'
                                            )}
                                        </button>
                                    </form>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forgot