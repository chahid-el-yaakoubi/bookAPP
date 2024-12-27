// React and router imports
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from "react";

// Context imports
import { DarkModeContext } from "./context/darkModeContext";

// Component imports
import Home from './pages/home/Home'
import User from './pages/user/Users'
import Single from './pages/user/componentUser/Single'
import AuthForm from './pages/login/Login'
import { AuthContext } from './pages/context/AuthContect'
import AddHouse from './pages/House/houseRealties/addHouse'
import Hotels from './pages/House/hotels/hotels'
import NewHotel from './pages/House/hotels/newHotel'

// Style imports
import './index.css'
import UpdateHotel from './pages/House/hotels/UpdateHotel';
import { PageDiscount } from './pages/PageDiscount/PageDiscount';
import NewHotelTest from './pages/House/hotels/newTest';
import PropertyForm from './pages/House/hotels/newTest';

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path='login' element={<AuthForm />} />
          <Route path='/addHouse' element={
            <ProtectedRoute>
              <AddHouse />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Home use="dashbord" />
            </ProtectedRoute>
          } />
          <Route path='users'>
            <Route index element={
              <ProtectedRoute>
                <User use="user" type="/" />
              </ProtectedRoute>
            } />
            <Route path='new' element={
              <ProtectedRoute>
                <User use="user" type="new" />
              </ProtectedRoute>
            } />
            <Route path='find/:userId' element={
              <ProtectedRoute>
                <User use="user" type="single" />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="hotels">
            <Route index element={
              <ProtectedRoute>
                <Hotels type="/" />
              </ProtectedRoute>
            } />
            <Route path="new" element={
              <ProtectedRoute>
                <Hotels type="new" />
              </ProtectedRoute>
            } />
            <Route path="find/:id" element={
              <ProtectedRoute>
                <Hotels type="single" />
              </ProtectedRoute>
            } />
            <Route path="update/:id" element={
              <ProtectedRoute>
                <Hotels type="new" />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="testt" element={
            <PropertyForm />

          } />
          <Route path="discount" element={
            <ProtectedRoute>
              <PageDiscount type="/" />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
