import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contextApi/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    country: "US", // Default country code
  });
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register
  const { loading, error, dispatch, user } = useContext(AuthContext); // Include user context
  const navigate = useNavigate();

  // Redirect if the user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home if logged in
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/api/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILED", payload: err.response?.data?.message || "An error occurred" });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/api/auth/register", credentials); // Replace with your registration API endpoint
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILED", payload: err.response?.data?.message || "An error occurred" });
    }
  };

  return (
    <div className="w-full max-w-xl p-8 space-y-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        {isRegistering ? "Register" : "Login"}
      </h2>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Display either Login or Register Form */}
      <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
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

        {isRegistering && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={credentials.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="flex items-center space-x-2">
                <select
                  id="country"
                  value={credentials.country}
                  onChange={handleChange}
                  className="w-1/4 px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="US">+1 (US)</option>
                  <option value="GB">+44 (UK)</option>
                  <option value="FR">+33 (France)</option>
                  <option value="MA">+212 (Morocco)</option>
                  {/* Add more country options here */}
                </select>
                <input
                  id="phoneNumber"
                  type="text"
                  value={credentials.phoneNumber}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="w-3/4 px-4 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          className={`w-full px-4 py-2 font-semibold text-white bg-blue rounded-md focus:outline-none hover:bg-blue ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Loading..." : isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600">
        {isRegistering ? (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setIsRegistering(false)}
              className="text-blue hover:underline"
            >
              Login here
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <button
              onClick={() => setIsRegistering(true)}
              className="text-blue hover:underline"
            >
              Sign up
            </button>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;
