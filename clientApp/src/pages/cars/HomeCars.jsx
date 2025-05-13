import React, { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar'
import Footer from '../../components/footer'
import CarCard from './components/CarCard'
import CarHeader from './components/CarHeader'
import axios from 'axios'

export const HomeCars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/cars');
        if (res.data && Array.isArray(res.data)) {
          setCars(res.data);
          setFilteredCars(res.data);
        } else {
          setError('Invalid data format received from the server.');
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to fetch cars. Please try again later.');
      }
      setLoading(false);
    };
    fetchCars();
  }, []);

  const handleSearch = ({ pickupLocation, pickupDate, dropoffDate, model }) => {
    let filtered = [...cars];

    // Filter by location
    if (pickupLocation) {
      filtered = filtered.filter(car => 
        car.location?.city?.toLowerCase().includes(pickupLocation.toLowerCase())
      );
    }

    // Filter by model
    if (model) {
      filtered = filtered.filter(car => 
        car.carDetails?.carModel?.toLowerCase().includes(model.toLowerCase()) ||
        car.carDetails?.carMake?.toLowerCase().includes(model.toLowerCase())
      );
    }

    // Filter by availability dates
    if (pickupDate && dropoffDate) {
      const startDate = new Date(pickupDate);
      const endDate = new Date(dropoffDate);
      
      filtered = filtered.filter(car => {
        // Check if car is available for the selected dates
        const isAvailable = !car.bookingHistory?.some(booking => {
          const bookingStart = new Date(booking.startDate);
          const bookingEnd = new Date(booking.endDate);
          return (
            (startDate >= bookingStart && startDate <= bookingEnd) ||
            (endDate >= bookingStart && endDate <= bookingEnd) ||
            (startDate <= bookingStart && endDate >= bookingEnd)
          );
        });
        return isAvailable;
      });
    }

    setFilteredCars(filtered);
    setError(filtered.length === 0 ? 'No cars match your search criteria.' : null);
  };

  const handleAdvancedSearch = (advanced) => {
    if (!advanced) {
      setFilteredCars(cars);
      return;
    }
    setFilteredCars(
      cars.filter(car =>
        car.name.toLowerCase().includes(advanced.toLowerCase()) ||
        car.location.toLowerCase().includes(advanced.toLowerCase()) ||
        car.owner.name.toLowerCase().includes(advanced.toLowerCase())
      )
    );
  };

    return (
    <div className="min-h-screen bg-gray-50">
            <Navbar />
      <CarHeader onSearch={handleSearch} onAdvancedSearch={handleAdvancedSearch} />
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-6 text-center">Available Cars</h1>
        {loading ? (
          <div className="text-center py-10 text-primary font-semibold">Loading cars...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCars.map(car => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
            <Footer />
    </div>
  );
}
