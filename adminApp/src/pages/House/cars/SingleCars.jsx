import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryFull,
  faGaugeHigh,
  faClock,
  faWind,
  faLocationDot,
  faGasPump,
  faUsers,
  faGears
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import useFetch from '../../../hooks/useFetch';
import ImgHotel from '../../components/imgHotel';
import { AuthContext } from '../../context/AuthContect';

const SingleCars = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/api/cars/find/${id}`);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const checkAdmin = async () => {
      // Ensure data is not empty or undefined
      if (!data || Object.keys(data).length === 0) return;

      if (user?.adminCars && !user?.adminUsers) {
        const isAdminMismatch = user.username !== data?.isA;
        if (isAdminMismatch) {
          navigate("/cars");
        }
      }
    };

    checkAdmin();
  }, [user, data, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading car details. Please try again later.</div>;
  }

  // Fallback for `data` structure
  const carData = data || {};

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 animate-fadeIn">
      <div className='max-w-7xl mx-auto'>
        <div className="bg-white mx-auto m-6 p-6 rounded-lg shadow-md ">
          <h2 className="text-2xl font-bold mb-4">Images</h2>
          <ImgHotel hotelId={id} type={"cars"} />
        </div>
        {/* Hero Section */}
        <div className="mt-18">
          <div className="bg-gradient-to-r from-blue-900/70 to-transparent p-6 flex items-center justify-between mb-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {carData.carDetails?.carMake} {carData.carDetails?.carModel}
            </h1>
            <h2 className="text-gray-600 mb-4 text-3xl">{carData.plateNumber || 'N/A'}</h2>

            <p className="text-white/80 text-2xl">{carData.type || 'N/A'}</p>
            <h2 className="text-3xl font-bold mb-2">{carData.price || 'N/A'} MAD</h2>

            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${carData.status === 'Available'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                }`}
            >
              {carData.status || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SpecCard icon={faUsers} label="Seats" value={carData.numberplaces || 'N/A'} />
          <SpecCard icon={faGears} label="Transmission" value={carData.autoManual || 'N/A'} />
          <SpecCard icon={faGasPump} label="Fuel Type" value={carData.fuel?.type || 'N/A'} />
          <SpecCard icon={faLocationDot} label="Location" value={carData.location?.city || 'N/A'} />
        </div>

        {/* Amenities Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Amenities</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {carData.amenities &&
              Object.entries(carData.amenities).map(([key, value]) => (
                <AmenityCard key={key} label={formatAmenityLabel(key)} available={value} />
              ))}
          </div>
        </div>

        {/* Location Details */}
        <div className="p-6 mb-8 border rounded-lg bg-white shadow">
          <h2 className="text-xl font-bold mb-4">Location Details</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Region:</span> {carData.location?.region || 'N/A'}
            </p>
            <p>
              <span className="font-medium">City:</span> {carData.location?.city || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Neighborhood:</span> {carData.location?.neighborhood || 'N/A'}
            </p>
          </div>
        </div>

        {/* Rental Terms */}
        <div className="p-6 mb-8 border rounded-lg bg-white shadow">
          <h2 className="text-xl font-bold mb-4">Rental Terms</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Minimum Rental Period:</span> {carData.rentalTerms?.minimumPeriod || 'N/A'} days
            </p>
            <p>
              <span className="font-medium">Maximum Mileage:</span> {carData.rentalTerms?.maximumMileage || 'N/A'} km
            </p>
            <p>
              <span className="font-medium">Late Return Fee:</span> {carData.rentalTerms?.lateReturnFee || 'N/A'} MAD
            </p>
          </div>
        </div>

        {/* Price Section */}
        <div className="p-6 text-center mb-8 border rounded-lg bg-white shadow">

          <Link to={`/cars/edit/${carData._id}`} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Edit
          </Link>
        </div>

        {/* Reviews Section */}
        {carData.reviews && carData.reviews.length > 0 && (
          <div className="p-6 mb-8 border rounded-lg bg-white shadow">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <ul className="space-y-4">
              {carData.reviews.map((review, index) => (
                <li key={index} className="border-b pb-2">
                  <p><strong>User:</strong> {review.user}</p>
                  <p><strong>Rating:</strong> {review.rating} / 5</p>
                  <p><strong>Comment:</strong> {review.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Booking History Section */}
        {carData.bookingHistory && carData.bookingHistory.length > 0 && (
          <div className="p-6 mb-8 border rounded-lg bg-white shadow">
            <h2 className="text-xl font-bold mb-4">Booking History</h2>
            <ul className="space-y-4">
              {carData.bookingHistory.map((booking, index) => (
                <li key={index} className="border-b pb-2">
                  <p><strong>User:</strong> {booking.user}</p>
                  <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const SpecCard = ({ icon, label, value }) => (
  <div className="p-4 text-center border rounded-lg bg-white shadow">
    <FontAwesomeIcon icon={icon} className="w-8 h-8 mx-auto mb-2 text-blue-600" />
    <h3 className="font-semibold">{label}</h3>
    <p className="text-gray-600">{value}</p>
  </div>
);

const AmenityCard = ({ label, available }) => (
  <div className={`p-4 border rounded-lg ${available ? 'bg-green-50' : 'bg-red-50'}`}>
    <h3 className="font-semibold mb-2">{label}</h3>
    <span className={`text-sm ${available ? 'text-green-600' : 'text-red-600'}`}>
      {available ? 'Available' : 'Not Available'}
    </span>
  </div>
);

const formatAmenityLabel = (label) =>
  label.replace('has', '').replace(/([A-Z])/g, ' $1').trim();

export default SingleCars;
