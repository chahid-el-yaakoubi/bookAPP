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


const property = {
  id: 1,
  title: 'Luxury Apartment',
  description: 'Beautiful apartment in downtown',
  price: 200,
  currency: 'USD',
  location: {
    lat: 40.7128,
    lng: -74.0060,
    address: '123 Main St',
    city: 'New York',
    country: 'USA'
  },
  amenities: ['wifi', 'parking', 'pool'],
  images: ['url1', 'url2'],
  capacity: {
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2
  },
  rating: 4.5,
  reviews: []
};

function App() {
  const { t } = useTranslation();
  return (
    // <Provider store={store}>
    <TransContextProvider>
      <BrowserRouter>
      <div dir={t('dir')}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/maps" element={<MapComponent />} />
          <Route path="/hotels/:city" element={<List />} />
          <Route path="/hotel/:id" element={<Hotel />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/host" element={<WelcomePage />} />
          <Route path="/hosting" element={<HomeHost />} />
          <Route path="/hosting/login" element={<LoginHost />} />
          {/* properties */}
          <Route path="/host/properties" element={<PropertiesHost />} />
          <Route path="/host/properties/add" element={<AddProperty />} />
          <Route path="/host/properties/:id" element={<PropertyDetail />} />
          
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
