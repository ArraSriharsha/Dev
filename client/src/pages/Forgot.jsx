import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff, Code, Mail, Lock, ArrowRight } from 'lucide-react'
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
                            Reset Your <br />
                            <span className="text-red-600">Password</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Don't worry! It happens. Please enter your email address and we'll send you a verification code to reset your password.
                        </p>
                        <div className="mt-12 space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
                                    <Mail className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Email Verification</h3>
                                    <p className="text-gray-600">Receive a secure verification code</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
                                    <Lock className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Secure Reset</h3>
                                    <p className="text-gray-600">Set a new password securely</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
                                    <Code className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Quick Process</h3>
                                    <p className="text-gray-600">Back to coding in minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Reset Form */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center justify-center mb-8 md:hidden">
                            <img src="/logored.svg" alt="Code Arena" className="w-10 h-10 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-800">
                                Code <span className="text-red-600">Arena</span>
                            </h1>
                        </div>

                        {!otpsent ? (
                            <form className="space-y-6" onSubmit={handleSendOTP}>
                                <div>
                                    <h1 className="text-2xl font-bold text-center text-gray-800">Forgot your Password?</h1>
                                    <label className="text-gray-700 text mt-4 font-medium mb-2 block">Enter your email to get OTP</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Sending OTP...
                                        </>
                                    ) : (
                                        <>
                                            Send OTP
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-sm text-gray-600">
                                    Remember your password?{' '}
                                    <Link to="/signin" className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200">
                                        Sign in
                                    </Link>
                                </p>
                            </form>
                        ) : !Verified ? (
                            <form className="space-y-6" onSubmit={handleVerifyOTP}>
                                <div>
                                <h1 className="text-2xl font-bold text-center text-gray-800"> OTP Verification</h1>
                                    <label className="text-gray-700 text mt-4 font-medium mb-2 block">Enter the verification code sent to your email</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type="text"
                                            name="otp"
                                            value={formData.otp}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                            placeholder="Enter OTP"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify OTP
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form className="space-y-6" onSubmit={handleResetPassword}>
                                <div>
                                    <h1 className="text-2xl font-bold text-center text-gray-800">Reset Password</h1>
                                    <label className="text-gray-700 text-sm mt-4 font-medium mb-2 block">Enter your new password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-12 pr-12 py-3.5 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                            placeholder="Enter new password"
                                            required
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

                                <div>
                                    <label className="text-gray-700 text-sm font-medium mb-2 block">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 bg-gray-50 border border-red-500 pl-12 pr-12 py-3.5 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                            placeholder="Confirm new password"
                                            required
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

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Resetting...
                                        </>
                                    ) : (
                                        <>
                                            Reset Password
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forgot