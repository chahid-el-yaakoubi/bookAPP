import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import ImgHotel from '../../components/imgHotel';
import { AuthContext } from '../../context/AuthContect';

// PropertyDetails Component
export const PropertyDetails = ({ data }) => {

   
   
    if (!data) {
        return <div>Loading property details...</div>; // Handle loading state for property details
    }


    

    const {
        carMake,
        carModel,
        description,
        status,
        location,
        contactNumber,
        email,
        rentalTerms,
        price,
        mileage,
        year,
        fuel,
        amenities,
        photos,
        registration,
        reviews,
    } = data;

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold">{`${carMake} ${carModel}`}</h1>
                <p className="text-lg">{description}</p>
                <p className="mt-2">
                    <span className={`px-3 py-1 rounded-lg ${status === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {status}
                    </span>
                </p>
            </div>
            {/* General Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">General Info</h2>
                <p>Year: <span className="font-medium">{year}</span></p>
                <p>Mileage: <span className="font-medium">{mileage} km</span></p>
                <p>Location: <span className="font-medium">{location?.city}, {location?.region}</span></p>
                <p>Neighborhood: <span className="font-medium">{location?.neighborhood || 'N/A'}</span></p>
                <p>Registration Plate: <span className="font-medium">{registration?.plateNumber}</span></p>
                <p>Registration State: <span className="font-medium">{registration?.registrationState || 'N/A'}</span></p>
            </div>
            {/* Rental Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Rental Info</h2>
                <p>Price: <span className="font-medium">{price} MAD</span></p>
                <p>Fuel Type: <span className="font-medium">{fuel?.type}</span></p>
                <p>Negotiable: <span className="font-medium">{rentalTerms?.negotiable ? 'Yes' : 'No'}</span></p>
                <p>Minimum Rental Period: <span className="font-medium">{rentalTerms?.minimumPeriod} days</span></p>
                <p>Maximum Mileage: <span className="font-medium">{rentalTerms?.maximumMileage} km</span></p>
                <p>Late Return Fee: <span className="font-medium">{rentalTerms?.lateReturnFee || 0} MAD</span></p>
            </div>
            {/* Amenities */}
            <div className="mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Amenities</h2>
                <ul className="grid grid-cols-2 gap-4">
                    {amenities && Object.entries(amenities).map(([key, value]) => (
                        value && (
                            <li key={key} className="flex items-center space-x-2">
                                <span className="text-green-600 font-semibold">✓</span>
                                <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                            </li>
                        )
                    ))}
                </ul>
            </div>
            {/* Contact Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Contact</h2>
                <p>Phone: <a href={`tel:${contactNumber}`} className="text-blue-500">{contactNumber}</a></p>
                <p>Email: <a href={`mailto:${email}`} className="text-blue-500">{email}</a></p>
            </div>
            {/* Images */}
            {photos && photos.length > 0 && (
                <div className="bg-white mx-auto m-6 p-6 rounded-lg shadow-md max-w-7xl">
                    <h2 className="text-2xl font-bold mb-4">Images</h2>
                    <ImgHotel hotelId={photos} type={"car"} /> {/* Assuming ImgHotel can handle an array of images */}
                </div>
            )}
            {/* Reviews */}
            {reviews && reviews.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                    <ul className="space-y-4">
                        {reviews.map((review, index) => (
                            <li key={index} className="border-b pb-2">
                                <p><strong>User:</strong> {review.user}</p>
                                <p><strong>Rating:</strong> {review.rating} / 5</p>
                                <p><strong>Comment:</strong> {review.comment}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// SingleCars Component
function SingleCars() {
    const { id } = useParams();
    const { data, loading, error } = useFetch(`/api/cars/find/${id}`);
    


    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    useEffect(() => {
        const checkAdmin = async () => {
            // Ensure data is not empty or undefined
            if (!data || Object.keys(data).length === 0) return;

            if (user?.adminCars && !user?.adminUsers) {
                const isAdminMismatch = user._id !== data?.isA;
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

    return (
        <>
            <PropertyDetails data={data} />
            <div className="flex justify-center max-w-7xl mx-auto bg-white m-5 text-white p-6 rounded-lg shadow-md">
                <ImgHotel hotelId={id} type={"cars"} />

            </div>
        </>
    );
}

export default SingleCars;



