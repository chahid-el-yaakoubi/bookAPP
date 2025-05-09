import './index.css';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { Home } from './pages/home/Home';
import { List } from './pages/list/List';
import { Hotel } from './pages/hotel/Hotel';
import { MapComponent } from './pages/maps/maps';

import AuthForm from './components/Login/login';
import RegisterForm from './components/Login/Register';
import PasswordReset from './components/Login/ResetPassword';
import { Profile } from './components/Profile';
import { ChangePassword } from './components/ChangePassword';
import { SavedRentalsPage } from './components/SaveClient';

import { TransContextProvider } from './contextApi/TransContext';
import { AuthContext } from './contextApi/AuthContext';

import WelcomePage from './pages/Hosting/pagesHost/welcomePage';
import HomeHost from './pages/Hosting/pagesHost/HomeHost';
import LoginHost from './pages/Hosting/ComponentHost/loginHost';

import PropertiesHost from './pages/Hosting/catHost/houseRental/PropertiesHost';
import VehiclesHost from './pages/Hosting/catHost/cars/carsHost';
import ServicesHost from './pages/Hosting/catHost/serveces/ServicesHost';
import ShopsHost from './pages/Hosting/catHost/shops/ShopsHost';
import AddProperty from './pages/Hosting/catHost/houseRental/AddProperty';
import PropertyDetail from './pages/Hosting/catHost/houseRental/PropertyDetail';
import Details from './pages/Hosting/catHost/houseRental/Details/Details';
import Welcome from './pages/Hosting/catHost/houseRental/steps/Welcome';
import MobileMenuPage from './pages/Hosting/catHost/houseRental/Details/components/MobileMenu';
import { HomeCars } from './pages/cars/HomeCars';
import { BookingsPage } from './pages/Hosting/catHost/houseRental/Bookings/BookingsPage';
import { Cities } from './pages/Hosting/pagesHost/Cities';
import Callender from './pages/Hosting/pagesHost/Callender';
import { HomePrperty } from './pages/Hosting/catHost/houseRental/HomePrperty';
import BookingConfirmation from './pages/Hosting/catHost/houseRental/Bookings/BookingPdf/page';
import  Partner from './pages/Hosting/catHost/partners/homePage';
import User from './pages/admin/users/homePage';
import SingleUserPage from './pages/admin/users/components/SingleUser';

function App() {
  const { t } = useTranslation();

  const ProtectedRoute = () => {
    const { state } = useContext(AuthContext);
    const user = state?.user;

    if (!user) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  };

  return (
    <TransContextProvider>
      <BrowserRouter>
        <div dir={t('dir')}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgetpass" element={<PasswordReset />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/change-pass" element={<ChangePassword />} />
            <Route path="/saved" element={<SavedRentalsPage />} />
            <Route path="/maps" element={<MapComponent />} />
            <Route path="/hotels/:city" element={<List />} />
            <Route path="/hotel/:id" element={<Hotel />} />




            <Route path="/cars" element={<HomeCars />} />



            {/* Protected Hosting Routes */}
            <Route element={<ProtectedRoute />}>
              {/* Hosting admins only */}
              <Route path="/host" element={<WelcomePage />} />
              <Route path="/hosting" element={<HomeHost />} />
              <Route path="/hosting/login" element={<LoginHost />} />


              {/* partner */}
              <Route path="/iAmAdmin/partners" element={<Partner />} />
              <Route path="/iAmAdmin/partners/:id" element={<HomePrperty />} />

               {/* users */}
               <Route path="/iAmAdmin/users" element={<User type={'table'} />} />
              <Route path="/iAmAdmin/users/:id" element={<User type={'user'} />} />
              <Route path="/iAmAdmin/users/add" element={<User type={'newuser'} />} />
              <Route path="/iAmAdmin/users/edit/:id" element={<User type={'newuser'} />} />
              {/* cities */}

              <Route path="/host/cities" element={<Cities />} />
              <Route path="/host/Callender" element={<Callender />} />


              {/* bookings */}
              <Route path="/host/properties/bookings" element={<BookingsPage />} />
              <Route path="/host/properties/bookings/:id" element={<BookingsPage type={'detail'} />} />
              <Route path="/bookings" element={<BookingConfirmation />} />



              {/* Properties */}
              <Route path="/host/properties" element={<HomePrperty />} />
              <Route path="/host/properties/welcome" element={<Welcome />} />
              <Route path="/host/properties/add" element={<AddProperty />} />
              <Route path="/host/properties/:id" element={<PropertyDetail />} />
              <Route path="/host/properties/:id/details" element={<Details />} />

              {/* Section Details */}
              {[
                'photo-tour', 'title', 'property-type', 'pricing', 'availability', 'guests',
                'description', 'amenities', 'propertyfeatures', 'accessibility', 'location',
                'proximity', 'bathrooms', 'host', 'rules', 'safety', 'cancellation',
                'custom-link', 'check-in', 'wifi', 'manual', 'house-rules', 'checkout',
              ].map(section => (
                <Route
                  key={section}
                  path={`/host/properties/:id/details/${section}`}
                  element={<Details sectionPath={section} />}
                />
              ))}

              {/* Rooms Handling */}
              <Route path="/host/properties/:id/details/rooms" element={<Details sectionPath="rooms" />} />
              <Route path="/host/properties/:id/details/rooms/add" element={<Details sectionPath="rooms" job="add" />} />
              <Route path="/host/properties/:id/details/rooms/:edit/edit" element={<Details sectionPath="rooms" job="edit" />} />
              <Route path="/host/properties/:id/details/rooms/:roomId" element={<Details sectionPath="rooms" job="singleRoom" />} />

              {/* Mobile Menu */}
              <Route path="/host/properties/:id/menu" element={<MobileMenuPage />} />

              {/* Vehicles, Services, Shops */}
              <Route path="/host/cars" element={<VehiclesHost type={'table'} />} />
              <Route path="/host/cars/add" element={<VehiclesHost  type={'addcar'}/>} />




              <Route path="/host/services" element={<ServicesHost />} />
              <Route path="/host/shops" element={<ShopsHost />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </TransContextProvider>
  );
}

export default App;