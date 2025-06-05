import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LuCircleArrowLeft, LuEye, LuEyeOff } from "react-icons/lu";
import { login } from "../../Lib/api";
import { useTranslation } from "react-i18next";
const AuthForm = () => {
  const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if the user is already logged in
  useEffect(() => {
    if (state.user) {
      navigate("/"); // Redirect to home if logged in
    }
  }, [state.user, navigate]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const data = await login(credentials.username, credentials.password);

      if (data.token && data.user) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: data.user,
            token: data.token,
          },
        });
        navigate("/"); // Redirect to home after successful login
      } else {
        dispatch({ type: "LOGIN_FAILED", payload: "Invalid response from server" });
      }
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILED",
        payload: err.response?.data?.message || "An error occurred during login",
      });
    }
  };

  return (
    <div className="h-screen w-full bg-cover bg-center bg-black bg-opacity-60 fixed inset-0 z-50 "  style={{
      backgroundImage:
          "url('https://img.freepik.com/photos-premium/effets-lumineux-brillants-bleu-picton-sombre-conception-fond-abstraite_851755-198657.jpg?w=996')",
  }}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full md:w-2/5  md:h-4/5  shadow-2xl">
       
          <div className="bg-indigo-800 flex flex-col h-full">
            <button
              onClick={() => navigate('/')}
              className={`bg-blue hover:bg-blue/80 p-2 rounded-full w-24 gap-2 ms-2 mt-2 flex `}
            >
              <LuCircleArrowLeft className={`w-6 h-6 text-white ${isRTL ? 'rotate-180' : ''}`} />
              {t('general.back')}
            </button>

            <div className="flex flex-col items-center mt-10">
              <div className="bg-white rounded-full p-2 flex items-center justify-center w-10 h-10">
                {/* Lock Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mt-2">{t('auth.login')}</h1>
            </div>

            {state.error && (
              <div className="mx-12 mt-4 p-2 bg-red-500 text-white rounded-md text-sm">
                {state.error}
              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="mt-6 mx-12 flex flex-col gap-4"
            >
              <div>
                <input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder={t('auth.username')}
                  className="w-full px-4 py-2 bg-indigo-700 text-white rounded-md placeholder-indigo-300 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                  dir="ltr"

                />
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder={t('auth.password')}
                  className="w-full px-4 py-2 bg-indigo-700 text-white rounded-md placeholder-indigo-300 border border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-indigo-300 hover:text-white"
                >
                  {showPassword ? <LuEyeOff /> : <LuEye />}
                </button>
              </div>

              <div className="flex justify-between items-center">
                 
                <span
                  onClick={() => navigate('/Forgetpass')}
                  className="text-sm text-indigo-200 hover:text-white cursor-pointer"
                >
                  {t('auth.forgotPassword')}
                </span>
              </div>

              <div className="mx-8 mt-4">
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                  disabled={state.loading}
                >
                  {state.loading ? t('auth.loading') : t('auth.signIn')}
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="text-indigo-200">
                {t('auth.notRegisteredYet')}{" "} 
                  <span
                    onClick={() => navigate('/Register')}
                    className="text-indigo-300 hover:text-white cursor-pointer"
                  >
                    {t('auth.createAccount')}
                  </span>
                </p>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
};

export default AuthForm;
