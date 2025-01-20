import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContect";
import "./Login.css"

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
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    (async () => {
      try {
        const response = await axios.get('https://axistay-backend.onrender.com/api/hotels');
        console.log({ test: response.data }); // Logs the actual data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
    

    try {
      const res = await axios.post("/api/auth/login", credentials, { withCredentials: true });

      if (res.data.requiresVerification) {
        setShowVerification(true);
        setUserId(res.data.userId);
        dispatch({ type: "LOGIN_RESET" });
        return;
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");

    } catch (err) {
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500 bg-animated">
      <div className="w-full max-w-xl p-10 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {showVerification ? "Verify Admin Access" : "Login"}
        </h2>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        {!showVerification ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full px-4 py-2 mt-4 font-semibold text-white bg-blue-500 rounded-md focus:outline-none hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 font-semibold text-white bg-blue-500 rounded-md focus:outline-none hover:bg-blue-600"
            >
              Verify
            </button>
          </form>
        )}

        <div className="flex justify-center mt-6">
          <p className="text-sm text-gray-600">Don't have an account? <a href="/register" className="text-blue-500">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
