import './index.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import { Home } from './pages/home/Home';
import { List } from './pages/list/List';
import { Hotel } from './pages/hotel/Hotel';
import LoginRegister from './components/Login/login';
import { TransContextProvider } from './contextApi/TransContext';
import { useTranslation } from 'react-i18next';
import { MapComponent } from './pages/maps/maps';
import HomeHost from './pages/Hosting/pagesHost/HomeHost';
import LoginHost from './pages/Hosting/ComponentHost/loginHost';
import WelcomePage from './pages/Hosting/pagesHost/welcomePage';
import { Provider } from 'react-redux';
import PropertiesHost from './pages/Hosting/catHost/houseRental/PropertiesHost';
import VehiclesHost from './pages/Hosting/catHost/cars/carsHost';
import ServicesHost from './pages/Hosting/catHost/serveces/ServicesHost';
import ShopsHost from './pages/Hosting/catHost/shops/ShopsHost';
import AddProperty from './pages/Hosting/catHost/houseRental/AddProperty';
import PropertyDetail from './pages/Hosting/catHost/houseRental/PropertyDetail';
import Details from './pages/Hosting/catHost/houseRental/Details/Details';
import Welcome from './pages/Hosting/catHost/houseRental/steps/Welcome';
import MobileMenuPage from './pages/Hosting/catHost/houseRental/Details/components/MobileMenu';
import { Profile } from './components/Profile';
import { ChangePassword } from './components/ChangePassword';
import {SavedRentalsPage} from './components/SaveClient';
import AuthForm from './components/Login/login';
import RegisterForm from './components/Login/Register';
import PasswordReset from './components/Login/ResetPassword';


function App() {
  const { t } = useTranslation();
  return (
    // <Provider store={store}>
    <TransContextProvider>
      <BrowserRouter>
        <div dir={t('dir')}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<AuthForm />} />
            <Route path="/Register" element={<RegisterForm />} />
            <Route path="/Forgetpass" element={<PasswordReset/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/change-pass" element={<Profile />} />
            <Route path="/saved" element={<SavedRentalsPage />} />
            
            <Route path="/maps" element={<MapComponent />} />
            <Route path="/hotels/:city" element={<List />} />
            <Route path="/hotel/:id" element={<Hotel />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/host" element={<WelcomePage />} />
            <Route path="/hosting" element={<HomeHost />} />
            <Route path="/hosting/login" element={<LoginHost />} />
            {/* properties */}
            <Route path="/host/properties" element={<PropertiesHost />} />
            <Route path="/host/properties/welcome" element={<Welcome />} />
            <Route path="/host/properties/add" element={<AddProperty />} />
            <Route path="/host/properties/:id" element={<PropertyDetail />} />
            <Route path="/host/properties/:id/details" element={<Details />} />


          {/* Your Space section routes */}
            <Route path="/host/properties/:id/details/photo-tour" element={<Details sectionPath="photo-tour" />} />
            <Route path="/host/properties/:id/details/title" element={<Details sectionPath="title" />} />
            <Route path="/host/properties/:id/details/property-type" element={<Details sectionPath="property-type" />} />
            <Route path="/host/properties/:id/details/pricing" element={<Details sectionPath="pricing" />} />
            <Route path="/host/properties/:id/details/availability" element={<Details sectionPath="availability" />} />
            <Route path="/host/properties/:id/details/guests" element={<Details sectionPath="guests" />} />
            <Route path="/host/properties/:id/details/description" element={<Details sectionPath="description" />} />
            <Route path="/host/properties/:id/details/amenities" element={<Details sectionPath="amenities" />} />
            <Route path="/host/properties/:id/details/propertyfeatures" element={<Details sectionPath="propertyfeatures" />} />
            <Route path="/host/properties/:id/details/accessibility" element={<Details sectionPath="accessibility" />} />
            <Route path="/host/properties/:id/details/location" element={<Details sectionPath="location" />} />
            <Route path="/host/properties/:id/details/proximity" element={<Details sectionPath="proximity" />} />
            <Route path="/host/properties/:id/details/bathrooms" element={<Details sectionPath="bathrooms"/>} />
            <Route path="/host/properties/:id/details/host" element={<Details sectionPath="host" />} />
            <Route path="/host/properties/:id/details/rooms" element={<Details sectionPath="rooms" job={""}/>} />
            <Route path="/host/properties/:id/details/rooms/:edit/edit" element={<Details sectionPath="rooms" job={"edit"}/>} />
            <Route path="/host/properties/:id/details/rooms/add" element={<Details sectionPath="rooms" job={"add"} />} />
            <Route path="/host/properties/:id/details/rooms/:roomId" element={<Details sectionPath="rooms" job={"singleRoom"} />} />
            <Route path="/host/properties/:id/details/rules" element={<Details sectionPath="rules" />} />
            <Route path="/host/properties/:id/details/safety" element={<Details sectionPath="safety" />} />
            <Route path="/host/properties/:id/details/cancellation" element={<Details sectionPath="cancellation" />} />
            <Route path="/host/properties/:id/details/custom-link" element={<Details sectionPath="custom-link" />} />

            {/* Arrival Guide section routes */}
            <Route path="/host/properties/:id/details/check-in" element={<Details sectionPath="check-in" />} />
            <Route path="/host/properties/:id/details/wifi" element={<Details sectionPath="wifi" />} />
            <Route path="/host/properties/:id/details/manual" element={<Details sectionPath="manual" />} />
            <Route path="/host/properties/:id/details/house-rules" element={<Details sectionPath="house-rules" />} />
            <Route path="/host/properties/:id/details/checkout" element={<Details sectionPath="checkout" />} />

            <Route path="/host/properties/:id/menu" element={<MobileMenuPage />} />

            {/* vehicles */}
            <Route path="/host/vehicles" element={<VehiclesHost />} />
            {/* services */}
            <Route path="/host/services" element={<ServicesHost />} />
            {/* shops */}
            <Route path="/host/shops" element={<ShopsHost />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TransContextProvider>
    // </Provider>
  )
}

export default App;
