import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contextApi/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LuCircleArrowLeft } from "react-icons/lu";
import { login, register } from "../../Lib/api";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [localError, setLocalError] = useState(null); // local form errors

    const { loading, error, dispatch, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLocalError(null);
        if (formData.password !== formData.confirmPassword) {
            setLocalError("Passwords do not match!");
            return;
        }

        try {
            const res = await register(formData);
            if (res.status === 200) {
                dispatch({ type: "LOGIN_START" });
                try {
                    const loginRes = await login(formData.username, formData.password);
                    dispatch({ 
                        type: "LOGIN_SUCCESS", 
                        payload: {
                            user: loginRes.user,
                            token: loginRes.token,
                        }, 
                    });
                    navigate("/");
                } catch (err) {
                    dispatch({
                        type: "LOGIN_FAILED",
                        payload: err.response?.data?.message || "Login failed",
                    });
                }
            }
        } catch (err) {
            setLocalError(
                err.response?.data?.message || "Error registering user. Try again."
            );
        }
    };

    return (
        <div
            className="h-screen w-full bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('https://img.freepik.com/photos-premium/effets-lumineux-brillants-bleu-picton-sombre-conception-fond-abstraite_851755-198657.jpg?w=996')",
            }}
        >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full md:w-3/4 md:h-4/5  bg-white shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                    <div className="hidden lg:block p-4">
                        <div
                            className="bg-cover bg-center h-full rounded-md"
                            style={{
                                backgroundImage:
                                    "url('https://img.freepik.com/vecteurs-libre/illustration-du-concept-connexion_114360-739.jpg')",
                            }}
                        />
                    </div>

                    <div className="bg-indigo-800 flex flex-col h-full overflow-y-auto">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-blue hover:bg-blue/80 p-2 rounded-full w-24 gap-2 ms-2 mt-2 flex"
                        >
                            <LuCircleArrowLeft className="w-6 h-6 text-white" />
                            back
                        </button>
                        <div className="flex flex-col items-center mt-6">
                            <div className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-indigo-800"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-white mt-2">
                                Create Account
                            </h1>
                        </div>

                        {(localError || error) && (
                            <div className="mx-12 mt-4 p-2 bg-red-500 text-white rounded-md text-sm">
                                {localError || error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 mx-12 flex flex-col gap-3"
                        >
                            <Input
                                id="username"
                                label="Username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                            />

                            <Input
                                id="email"
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                            />

                            <PasswordInput
                                id="password"
                                label="Password"
                                value={formData.password}
                                onChange={handleChange}
                                show={showPassword}
                                toggleShow={() => setShowPassword((prev) => !prev)}
                            />

                            <PasswordInput
                                id="confirmPassword"
                                label="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                show={showConfirmPassword}
                                toggleShow={() => setShowConfirmPassword((prev) => !prev)}
                            />

                            <div className="mx-8 mt-4">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? "Creating Account..." : "Register"}
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-4 mb-6 text-indigo-200 text-sm">
                            Already have an account? <a href="/login" className="underline">Login here</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Input = ({ id, label, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm text-indigo-200 mb-1">
            {label}
        </label>
        <input
            id={id}
            className="w-full px-4 py-2 bg-indigo-700 text-white rounded-md placeholder-indigo-300 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            {...props}
            required
        />
    </div>
);

const PasswordInput = ({ id, label, value, onChange, show, toggleShow }) => (
    <div>
        <label htmlFor={id} className="block text-sm text-indigo-200 mb-1">
            {label}
        </label>
        <div className="relative">
            <input
                id={id}
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-indigo-700 text-white rounded-md placeholder-indigo-300 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
            />
            <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-300 hover:text-white"
                onClick={toggleShow}
            >
                {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
        </div>
    </div>
);

export default RegisterForm;