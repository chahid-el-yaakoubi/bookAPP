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
import AddHouse from './pages/House/houseRealties/NewHouseRentals'
import Hotels from './pages/House/hotels/hotels'
import NewHotel from './pages/House/hotels/newHotel'

// Style imports
import './index.css'
// import UpdateHotel from './pages/House/hotels/UpdateHotel';
import { PageDiscount } from './pages/PageDiscount/PageDiscount';
import HouseRentals from './pages/House/houseRealties/houseRentals';
import NewHouseRentals from './pages/House/houseRealties/NewHouseRentals';
import Cities from './pages/cities/Cities';

import CityDetails from './pages/cities/CityDetails';
import Shops from './pages/House/shops/shops';
import Cars from './pages/House/cars/Cars';
import { Profile } from './pages/components/profile/Profile';
// import Cars from '../../api/models/cars';
// import Cars from './pages/House/cars/Cars';
// import NewHotelTest from './pages/House/hotels/newTest';
// import PropertyForm from './pages/House/hotels/newTest';

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
          <Route path="/" element={
            <ProtectedRoute>
              <Home use="dashbord" />
            </ProtectedRoute>
          } />

          {/* user */}
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
             <Route path='verify/:userId' element={
              <ProtectedRoute>
                <User use="user" type="verify" />
              </ProtectedRoute>
            } />
            <Route path='find/:userId' element={
              <ProtectedRoute>
                <User use="user" type="single" />
              </ProtectedRoute>
            } />
            <Route path='edit/:userId' element={
              <ProtectedRoute>
                <User use="user" type="new" />
              </ProtectedRoute>
            } />
          </Route>

          {/* hotels */}
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

          {/* house sales */}

          <Route path="houses-sales">
            <Route index element={
              <ProtectedRoute>
                <HouseRentals type="/" />
              </ProtectedRoute>
            } />
            <Route path="new" element={
              <ProtectedRoute>
                <HouseRentals type="new" />
              </ProtectedRoute>
            } />
            <Route path="single/:id" element={
              <ProtectedRoute>
                <HouseRentals type="single" />
              </ProtectedRoute>
            } />
          </Route>

          {/* cities */}

          <Route path="cities">
            <Route index element={
              <ProtectedRoute>
                <Cities type="/" />
              </ProtectedRoute>
            } />
            <Route path="new" element={
              <ProtectedRoute>
                <Cities type="new" />
              </ProtectedRoute>
            } />
            <Route path=":cityId" element={
              <ProtectedRoute>
                <Cities />
              </ProtectedRoute>
            } />
            <Route path="edit/:cityId" element={
              <ProtectedRoute>
                <Cities type="edit" />
              </ProtectedRoute>
            } />
            
          </Route>


          {/* shops */}

          <Route path="shops">
            <Route index element={
              <ProtectedRoute>
                <Shops type="/" />
              </ProtectedRoute>
            } />
            <Route path="new" element={
              <ProtectedRoute>
                <Shops type="new" />
              </ProtectedRoute>
            } />
            <Route path="single/:id" element={
              <ProtectedRoute>
                <Shops type="single" />
              </ProtectedRoute>
            } />
            <Route path="edit/:id" element={
              <ProtectedRoute>
                <Shops type="new" />
              </ProtectedRoute>
            } />
          </Route>


          {/* cars */}

          <Route path="cars">
            <Route index element={
              <ProtectedRoute>
                <Cars type="/" />
              </ProtectedRoute>
            } />
            <Route path="new" element={
              <ProtectedRoute>
                <Cars type="new" />
              </ProtectedRoute>
            } />
            <Route path="single/:id" element={
              <ProtectedRoute>
                <Cars type="single" />
              </ProtectedRoute>
            } />
            <Route path="edit/:id" element={
              <ProtectedRoute>
                <Cars type="new" />
              </ProtectedRoute>
            } />
          </Route>



          <Route path="houses-rentals">
            <Route index element={
              <ProtectedRoute>
                <HouseRentals type="/" />
              </ProtectedRoute>
            } />
            <Route path="new" element={
              <ProtectedRoute>
                <HouseRentals type="new" />
              </ProtectedRoute>
            } />
            <Route path="edit/:id" element={
              <ProtectedRoute>
                <HouseRentals type="edit" />
              </ProtectedRoute>
            } />
          </Route>

          <Route path='profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
