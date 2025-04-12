import React, { useState, useContext } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { LuCircleArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contextApi/AuthContext';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const ChangePassword = () => {
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        verificationCode: '',
        email: user?.email || '',
    });

    const [mode, setMode] = useState('password'); // Options: 'password', 'verification'
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const navigate = useNavigate();

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

        if (mode === 'password') {
            // Validate current password
            if (!formData.currentPassword.trim()) {
                newErrors.currentPassword = 'Current password is required';
            }
        } else if (mode === 'verification') {
            // Validate verification code
            if (codeSent && !formData.verificationCode.trim()) {
                newErrors.verificationCode = 'Verification code is required';
            }
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
            setMode('verification');
            
            // Only make the API call if we're actually sending the code
            if (!codeSent) {
                await axios.post(
                    `${apiUrl}/users/email-verification`,
                    { email: formData.email },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
                setCodeSent(true);
                alert('Verification code sent to your registered email');
            }
        } catch (err) {
            console.error('Error requesting verification code:', err);
            alert('Failed to send verification code. Please try again.');
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
            let payload = {};
            let endpoint = '';

            if (mode === 'password') {
                payload = {
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                };
                endpoint = `${apiUrl}/users/${user._id}/password`;
            } else if (mode === 'verification') {
                payload = {
                    code: formData.verificationCode,
                    newPassword: formData.newPassword
                };
                endpoint = `${apiUrl}/users/${user._id}/verify-code`;
            }

            const headers = { Authorization: `Bearer ${user.token}` };

            const res = await axios.put(endpoint, payload, { headers });

            console.log('Password updated:', res.data);
            setSuccess(true);
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                verificationCode: '',
                email: formData.email,
            });
            setCodeSent(false);

            setTimeout(() => {
                setSuccess(false);
                navigate('/profile');
            }, 3000);
        } catch (err) {
            console.error('Password update error:', err);
            if (err.response && err.response.data?.message) {
                if (mode === 'verification') {
                    setErrors((prev) => ({
                        ...prev,
                        verificationCode: err.response.data.message,
                    }));
                } else {
                    setErrors((prev) => ({
                        ...prev,
                        currentPassword: err.response.data.message,
                    }));
                }
            } else {
                alert('An unexpected error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderFormContent = () => {
        switch (mode) {
            case 'password':
                return (
                    <>
                        {/* Current Password */}
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showPassword.current ? 'text' : 'password'}
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className={`w-full p-2 pr-10 border rounded-md ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Current Password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => togglePasswordVisibility('current')}
                                >
                                    {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.currentPassword && <p className="mt-1 text-red-500 text-sm">{errors.currentPassword}</p>}
                        </div>

                        {/* New Password & Confirm Password */}
                        {renderPasswordFields()}
                    </>
                );
            case 'verification':
                return (
                    <>
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full p-2 pr-10 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Your registered email"
                                    disabled={codeSent}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <Mail size={20} className="text-gray-400" />
                                </div>
                            </div>
                            {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        {!codeSent ? (
                            // Show send verification code button if code hasn't been sent yet
                            <button
                                type="button"
                                onClick={requestVerificationCode}
                                className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-md"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Verification Code'}
                            </button>
                        ) : (
                            // Show verification code input and password fields after code is sent
                            <>
                                {/* Verification Code */}
                                <div>
                                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                                        Verification Code
                                    </label>
                                    <input
                                        id="verificationCode"
                                        name="verificationCode"
                                        type="text"
                                        value={formData.verificationCode}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded-md ${errors.verificationCode ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter verification code"
                                    />
                                    {errors.verificationCode && <p className="mt-1 text-red-500 text-sm">{errors.verificationCode}</p>}
                                </div>

                                {/* New Password & Confirm Password */}
                                {renderPasswordFields()}

                                <div className="text-center mt-2">
                                    <button
                                        type="button"
                                        onClick={requestVerificationCode}
                                        className="text-gray-600 hover:text-gray-800 text-sm underline"
                                    >
                                        Code not received? Send again
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                );

            default:
                return null;
        }
    };

    const renderPasswordFields = () => {
        return (
            <>
                {/* New Password */}
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword.new ? 'text' : 'password'}
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`w-full p-2 pr-10 border rounded-md ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="New Password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('new')}
                        >
                            {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.newPassword && <p className="mt-1 text-red-500 text-sm">{errors.newPassword}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword.confirm ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full p-2 pr-10 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Confirm New Password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('confirm')}
                        >
                            {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
            </>
        );
    };

    return (
        <div className=" min-h-[80vh] max-w-7xl mx-auto shadow-xl" >
            <div className=" mx-auto p-6 bg-white rounded-lg ">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue hover:bg-blue/80 p-2 rounded-full"
                    >
                        <LuCircleArrowLeft className="w-6 h-6 text-white" />
                    </button>

                    <div className="flex items-center my-6">
                        <Lock className="mr-2 text-gray-700" size={24} />
                        <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>
                    </div>
                </div>

                <p className="text-gray-600 mb-6">Update your password below.</p>

                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                        Password updated successfully!
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        {/* Mode Selection Tabs */}
                        <div className="flex mb-6 border-b">
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('password');
                                    setCodeSent(false);
                                }}
                                className={`py-2 px-4 ${mode === 'password'
                                    ? 'border-b-2 border-gray-800 text-gray-800 font-medium'
                                    : 'text-gray-500'
                                    }`}
                            >
                                Use Password
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMode('verification');
                                    setCodeSent(false);
                                }}
                                className={`py-2 px-4 ${mode === 'verification'
                                    ? 'border-b-2 border-gray-800 text-gray-800 font-medium'
                                    : 'text-gray-500'
                                    }`}
                            >
                                Forget Password
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {renderFormContent()}
                            
                            {/* Only show the submit button if we're in password mode or verification mode with code sent */}
                            {(mode === 'password' || (mode === 'verification' && codeSent)) && (
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-md uppercase tracking-wider"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Password'}
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium text-gray-800 mb-3">Password Requirements</h3>
                        <ul className="list-disc pl-5 text-gray-600 space-y-1">
                            <li>At least one special character (!@#$%^&*)</li>
                            <li>Minimum of 6 characters</li>
                            <li>At least one number (2 recommended)</li>
                            <li>Change your password regularly</li>
                        </ul>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h3 className="font-medium text-gray-800 mb-3">Security Tips</h3>
                            <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                <li>Don't reuse passwords across multiple sites</li>
                                <li>Consider using a password manager</li>
                                <li>Enable two-factor authentication when available</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};