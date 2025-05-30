// React and router imports
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useContext } from "react";


// Component imports
import Home from './pages/home/Home'
import User from './pages/user/Users'
import Partner from './pages/partner/Partner'
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
  const { state } = useContext(AuthContext);
  const user = state?.user;
  const ProtectedRoute = ({ children }) => {
    if (!user || !user.isAdmin) {
      return <Navigate to="/login" />;;
    }

    return children;;
  };


  // const ProtectedRoute = ({ children }) => {
  //   const { user } = useContext(AuthContext);
  //   if (!user) {
  //     return <Navigate to="/login" />;
  //   }
  //   return children;
  // }



  const ProtectedUser = ({ children }) => {
    if (!user || !user.roles.users) {
      return <Navigate to="/login" />;
    }
    return children;
  }
  const ProtectedHotes = ({ children }) => {
    if (!user || !user.roles.hotes) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  const ProtectedCars = ({ children }) => {
    if (!user || !user.roles.cars) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  const ProtectedShops = ({ children }) => {
    if (!user || !user.roles.shops) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  const ProtectedHouses = ({ children }) => {

    if (!user || !user.roles.houses) {
      return <Navigate to="/login" />;
    }
    return children;
  }

  return (
    <div >
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

          {/* partners */}
          <Route path='partner'>
            <Route index element={
              <ProtectedUser>
                <Partner use="user" type="/" />
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
