import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContect";

// const backendUrl =  'https://axistay-backend.onrender.com';



const AuthForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [userId, setUserId] = useState(null);
  const { loading, error, dispatch, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/index.html");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    console.log(credentials)

    try {
      // const res = await axios.post(`${backendUrl}/api/auth/login`, credentials, { withCredentials: true });

      const res = await axios.post("/api/auth/login", credentials, { withCredentials: true });

      // Handle verification requirement
      if (res.data.requiresVerification) {
        setShowVerification(true);  // Show the verification form
        setUserId(res.data.userId); // Store the userId for later verification
        dispatch({ type: "LOGIN_RESET" });  // Reset login state
        return;
      }

      // Handle successful login
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });

      console.log(credentials)


      // Navigate to the homepage (or wherever appropriate)
      navigate("/index.html");

    } catch (err) {
      // Handle login failure and show error message
      const errorMessage = err.response?.data?.message || "An error occurred";
      dispatch({ type: "LOGIN_FAILED", payload: errorMessage });
    }
  };


  const handleVerification = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/api/auth/verifyAdmin", {
        userId,
        code: verificationCode,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILED", payload: err.response?.data?.message || "An error occurred" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-xl p-8 space-y-6 bg-green-500 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {showVerification ? "Verify Admin Access" : "Login"}
        </h2>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!showVerification ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md focus:outline-none hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md focus:outline-none hover:bg-blue-600 `}
            // disabled={loading}
            >
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
