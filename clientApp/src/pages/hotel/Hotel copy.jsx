import { HotelHeader } from './componentHotel/HotelHeader';
import { HotelGallery } from './componentHotel/HotelGallery';
import { HotelBookingBox } from './componentHotel/HotelBookingBox';
import { HotelAmenities } from './componentHotel/HotelAmenities';
import { HotelDescription } from './componentHotel/HotelDescription';

export const Hotel = () => {
  // ... your existing hooks and state ...

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Header type="list" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <HotelHeader hotel={data} />
            <HotelGallery photos={photos} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="md:col-span-2">
                <HotelDescription hotel={data} />
                <HotelAmenities />
              </div>
              <div>
                <HotelBookingBox 
                  hotel={data} 
                  nights={nights} 
                  options={options} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 