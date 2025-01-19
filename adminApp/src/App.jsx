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

  const ProtectedUser = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user || !user.adminUsers) {
      return <Navigate to="/login" />;
    }
    return children;
  }
  const ProtectedHotes = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user || !user.adminHotes) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  const ProtectedCars = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user || !user.adminCars) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  const ProtectedShops = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user || !user.adminShops) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  const ProtectedHouses = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user || !user.adminHouses) {
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
              <ProtectedUser>
                <User use="user" type="/" />
              </ProtectedUser>
            } />
            <Route path='new' element={
              <ProtectedUser>
                <User use="user" type="new" />
              </ProtectedUser>
            } />
             <Route path='verify/:userId' element={
                <ProtectedUser>
                <User use="user" type="verify" />
              </ProtectedUser>
            } />
            <Route path='find/:userId' element={
              <ProtectedUser>
                <User use="user" type="single" />
              </ProtectedUser>
            } />
            <Route path='edit/:userId' element={
              <ProtectedUser>
                <User use="user" type="edit" />
              </ProtectedUser>
            } />
          </Route>

          {/* hotels */}
          <Route path="hotels">
            <Route index element={
              <ProtectedHotes>
                <Hotels type="/" />
              </ProtectedHotes>
            } />
            <Route path="new" element={
              <ProtectedHotes>
                <Hotels type="new" />
              </ProtectedHotes>
            } />
            <Route path="find/:id" element={
              <ProtectedHotes>
                <Hotels type="single" />
              </ProtectedHotes>
            } />
            <Route path="update/:id" element={
              <ProtectedHotes>
                <Hotels type="new" />
              </ProtectedHotes>
            } />
          </Route>

          {/* house sales */}

          <Route path="houses-sales">
            <Route index element={
              <ProtectedHouses>
                <HouseRentals type="/" />
              </ProtectedHouses>
            } />
            <Route path="new" element={
              <ProtectedHouses>
                <HouseRentals type="new" />
              </ProtectedHouses>
            } />
             <Route path="edit/:id" element={
              <ProtectedHouses>
                <HouseRentals type="edit" />
              </ProtectedHouses>
            } />
            <Route path="single/:id" element={
              <ProtectedHouses>
                <HouseRentals type="single" />
              </ProtectedHouses>
            } />
          </Route>

          
          

          <Route path='profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* cities */}

          <Route path="cities">
            <Route index element={
              <ProtectedUser>
                <Cities type="/" />
              </ProtectedUser>
            } />
            <Route path="new" element={
              <ProtectedUser>
                <Cities type="new" />
              </ProtectedUser>
            } />
            <Route path=":cityId" element={
              <ProtectedUser>
                <Cities />
              </ProtectedUser>
            } />
            <Route path="edit/:cityId" element={
              <ProtectedUser>
                <Cities type="edit" />
              </ProtectedUser>
            } />
            
          </Route>


          {/* shops */}

            
          <Route path="shops">
            <Route index element={
              <ProtectedShops>
                <Shops type="/" />
              </ProtectedShops>
            } />
            <Route path="new" element={
              <ProtectedShops>
                <Shops type="new" />
              </ProtectedShops>
            } />
            <Route path="single/:id" element={
              <ProtectedShops>
                <Shops type="single" />
              </ProtectedShops>
            } />
            <Route path="edit/:id" element={
              <ProtectedShops>
                <Shops type="new" />
              </ProtectedShops>
            } />
          </Route>


          {/* cars */}

          <Route path="cars">
            <Route index element={
              <ProtectedCars>
                <Cars type="/" />
              </ProtectedCars>
            } />
            <Route path="new" element={
              <ProtectedCars>
                <Cars type="new" />
              </ProtectedCars>
            } />
            <Route path="single/:id" element={
              <ProtectedCars>
                <Cars type="single" />
              </ProtectedCars>
            } />
            <Route path="edit/:id" element={
              <ProtectedCars>
                <Cars type="new" />
              </ProtectedCars>
            } />
          </Route>




        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
