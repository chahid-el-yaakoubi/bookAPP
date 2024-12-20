import './index.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import { Home } from './pages/home/Home';
import { List } from './pages/list/List';
import { Hotel } from './pages/hotel/Hotel';
import Login from './components/Login/login';
import LoginRegister from './components/Login/login';
// import Maps from './pages/maps/maps';
import { TransContextProvider } from './contextApi/TransContext';
import { useTranslation } from 'react-i18next';

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
  //   <div className="bg-black text-white p-5">
  //   <h1 className="text-3xl font-bold">Hello, Tailwind with React & Vite!</h1>
  // </div>
    <div dir={t('dir')}>
      <TransContextProvider>
        {/* <Background3D /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/test" element={<Maps />} /> */}
          <Route path="/hotels/:city" element={<List  />} />
          <Route path="/hotel/:id" element={<Hotel />} />
          <Route path="/login" element={<LoginRegister />} />
        </Routes>
          </BrowserRouter>
        </TransContextProvider>
    </div>
  )
}

export default App;
