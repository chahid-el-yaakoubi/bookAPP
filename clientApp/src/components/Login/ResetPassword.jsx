import React, { useState, useContext } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../contextApi/AuthContext';
import { LuCircleArrowLeft } from 'react-icons/lu';
const apiUrl = import.meta.env.VITE_API_URL;

const PasswordReset = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
        verificationCode: '',
        email: user?.email || '',
    });

    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const togglePasswordVisibility = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate verification code
        if (codeSent && !formData.verificationCode.trim()) {
            newErrors.verificationCode = 'Verification code is required';
        }

        // Validate new password
        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
        } else {
            const hasSpecialChar = /[!@#$%^&*()_\-+=]/.test(formData.newPassword);
            const hasMinLength = formData.newPassword.length >= 6;
            const hasNumber = /\d/.test(formData.newPassword);

            if (!hasSpecialChar || !hasMinLength || !hasNumber) {
                newErrors.newPassword = 'Password does not meet requirements';
            }
        }

        // Validate confirm password
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const requestVerificationCode = async () => {
        try {
            setIsSubmitting(true);

            // Email validation
            if (!formData.email.trim()) {
                setErrors({ email: 'Email is required' });
                setIsSubmitting(false);
                return;
            }

            // API call to send verification code
            await axios.post(
                `${apiUrl}/api/users/email-verification`,
                { email: formData.email }
            );

            setCodeSent(true);
            alert('Verification code sent to your email address');
        } catch (err) {
            console.error('Error requesting verification code:', err);
            setErrors({
                email: err.response?.data?.message || 'Failed to send verification code. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                code: formData.verificationCode,
                newPassword: formData.newPassword,
                email: formData.email
            };

            const res = await axios.post(`${apiUrl}/api/auth/reset-password`, payload);

            // console.log('Password reset successful:', res.data);
            setSuccess(true);
            setFormData({
                newPassword: '',
                confirmPassword: '',
                verificationCode: '',
                email: formData.email,
            });

            setTimeout(() => {
                setSuccess(false);
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Password reset error:', err);
            if (err.response && err.response.data?.message) {
                setErrors((prev) => ({
                    ...prev,
                    verificationCode: err.response.data.message,
                }));
            } else {
                alert('An unexpected error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen w-full bg-cover bg-center" style={{ backgroundImage: "url('https://img.freepik.com/photos-premium/effets-lumineux-brillants-bleu-picton-sombre-conception-fond-abstraite_851755-198657.jpg?w=996')" }}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full md:w-3/4 md:h-4/5 bg-white shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    {/* Left side - Background Image */}
                    <div className="hidden lg:block p-4">
                        <div
                            className="bg-cover bg-center h-full rounded-md"
                            style={{ backgroundImage: "url('https://img.freepik.com/vecteurs-libre/illustration-du-concept-connexion_114360-739.jpg?t=st=1744465201~exp=1744468801~hmac=65340cf6e8c94ea03d2af0e6a3c97d7f73ca1fc27a211fd17d84b348168bcfae&w=740')" }}
                        />
                    </div>

                    {/* Right side - Form */}
                    <div className="bg-primary flex flex-col h-full">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-blue hover:bg-blue/80 p-2 rounded-full w-24 gap-2 ms-2 mt-2 flex"
                        >
                            <LuCircleArrowLeft className="w-6 h-6 text-white" />
                            back


                        </button>
                        <div className="flex flex-col items-center mt-10">
                            <div className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10">
                                <Lock className="h-6 w-6 text-indigo-800" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mt-2">
                                Reset Your Password
                            </h1>
                            <p className="mt-2 text-center text-sm text-indigo-200">
                                We'll send a verification code to your email
                            </p>
                        </div>

                        {success && (
                            <div className="mx-12 mt-4 p-3 bg-green-500 text-white rounded-md">
                                Password reset successful! Redirecting to login page...
                            </div>
                        )}

                        <form className="mt-6 mx-12 flex flex-col gap-4" onSubmit={handleSubmit}>
                            {/* Email field */}
                            <div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 bg-indigo-100 text-black rounded-md placeholder-gray-600 border ${errors.email ? 'border-red-500' : 'border-indigo-600'
                                        } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                    placeholder="Your registered email"
                                    disabled={codeSent}
                                />
                                {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
                            </div>

                            {!codeSent ? (
                                <div className="mx-8 mt-4">
                                    <button
                                        type="button"
                                        onClick={requestVerificationCode}
                                        className="w-full px-4 py-2 font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Sending..." : "Send Verification Code"}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Verification Code */}
                                    <div>
                                        <input
                                            id="verificationCode"
                                            name="verificationCode"
                                            type="text"
                                            value={formData.verificationCode}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 bg-indigo-700 text-white rounded-md placeholder-indigo-300 border ${errors.verificationCode ? 'border-red-500' : 'border-indigo-600'
                                                } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                            placeholder="Enter verification code"
                                        />
                                        {errors.verificationCode && (
                                            <p className="mt-1 text-red-400 text-sm">{errors.verificationCode}</p>
                                        )}
                                    </div>

                                    {/* New Password */}
                                    <div className="relative">
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type={showPassword.new ? 'text' : 'password'}
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 bg-indigo-700 text-white rounded-md placeholder-indigo-300 border ${errors.newPassword ? 'border-red-500' : 'border-indigo-600'
                                                } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                            placeholder="New Password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-300"
                                            onClick={() => togglePasswordVisibility('new')}
                                        >
                                            {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        {errors.newPassword && <p className="mt-1 text-red-400 text-sm">{errors.newPassword}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPassword.confirm ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 bg-indigo-700 text-white rounded-md placeholder-indigo-300 border ${errors.confirmPassword ? 'border-red-500' : 'border-indigo-600'
                                                } focus:outline-none focus:ring-2 focus:ring-indigo-400`}
                                            placeholder="Confirm New Password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-300"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                        >
                                            {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-red-400 text-sm">{errors.confirmPassword}</p>
                                        )}
                                    </div>

                                    <div className="mt-2 bg-indigo-700 p-4 rounded-md">
                                        <h3 className="font-medium text-indigo-200 mb-2">Password Requirements</h3>
                                        <ul className="list-disc pl-5 text-indigo-300 space-y-1 text-sm">
                                            <li>At least one special character (!@#$%^&*)</li>
                                            <li>Minimum of 6 characters</li>
                                            <li>At least one number</li>
                                        </ul>
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={requestVerificationCode}
                                            className="text-indigo-300 hover:text-white text-sm font-medium"
                                        >
                                            Code not received? Send again
                                        </button>
                                    </div>

                                    <div className="mx-8 mt-4">
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? "Resetting..." : "Reset Password"}
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className="text-center mt-2 mb-8">
                                <p className="text-indigo-200">
                                    <span
                                        onClick={() => navigate('/login')}
                                        className="text-indigo-300 hover:text-white cursor-pointer"
                                    >
                                        Back to Login
                                    </span>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;