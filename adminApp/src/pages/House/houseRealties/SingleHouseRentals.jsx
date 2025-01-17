import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import ImgHotel from '../../components/imgHotel';
import { AuthContext } from '../../context/AuthContect';

export const PropertyDetails = ({ data }) => {
    if (!data) {
        return <div>Loading property details...</div>; // Handle loading state for property details
    }

    const {
        name,
        type,
        description,
        status,
        location,
        contact,
        rental,
        specifications,
        amenities,
        security,
        
    } = data;

    console.log(amenities);

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold">{name}</h1>
                <p className="text-lg">{description}</p>
                <p className="mt-2">
                    <span className={`px-3 py-1 rounded-lg ${status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {status}
                    </span>
                </p>
            </div>

            {/* General Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">General Info</h2>
                <p>Type: <span className="font-medium">{type}</span></p>
                <p>Region: <span className="font-medium">{location?.region}</span></p>
                <p>City: <span className="font-medium">{location?.city}</span></p>
                <p>Neighborhood: <span className="font-medium">{location?.neighborhood}</span></p>
                <p>Location: <span className="font-medium"><a href={`https://www.google.com/maps/place/${location?.coordinates}`} target="_blank" rel="noopener noreferrer">{location?.coordinates} Click me</a></span></p>
            </div>

            {/* Location Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Nearby Places</h2>
                <ul className="space-y-2">
                    {Object.entries(location?.nearbyPlaces || {}).map(([key, value]) => (
                        <li key={key} className="flex justify-between">
                            <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                            <span className="font-medium">{value || 0} km</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Rental Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Rental Info</h2>
                <p>Price: <span className="font-medium">${rental?.price}</span></p>
                <p>Type: <span className="font-medium">{rental?.propertyType}</span></p>
                <p>Negotiable: <span className="font-medium">{rental?.negotiable ? 'Yes' : 'No'}</span></p>
            </div>

            {/* Specifications */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Specifications</h2>
                <ul className="space-y-2">
                    <li>Size: {specifications?.size} sqm</li>
                    <li>Bedrooms: {specifications?.bedrooms}</li>
                    <li>Bathrooms: {specifications?.bathrooms}</li>
                    <li>Floor: {specifications?.floor} of {specifications?.totalFloors}</li>
                </ul>
            </div>

            {/* Amenities */}
            <div className=" mx-auto p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Amenities</h2>
                <ul className="grid grid-cols-2 gap-4">
                    {/* Air Conditioning */}
                    {amenities?.airConditioning?.installed && (
                        <li className="flex items-center space-x-2">
                            <span className="text-green-600 font-semibold">✓</span>
                            <span>Air Conditioning (Units: {amenities.airConditioning.units || 'N/A'})</span>
                        </li>
                    )}
                    {/* Balcony */}
                    {amenities?.balcony && (
                        <li className="flex items-center space-x-2">
                            <span className="text-green-600 font-semibold">✓</span>
                            <span>Balcony</span>
                        </li>
                    )}
                    {/* Terrace */}
                    {amenities?.terrace && (
                        <li className="flex items-center space-x-2">
                            <span className="text-green-600 font-semibold">✓</span>
                            <span>Terrace</span>
                        </li>
                    )}
                    {/* Elevator */}
                    {amenities?.elevator && (
                        <li className="flex items-center space-x-2">
                            <span className="text-green-600 font-semibold">✓</span>
                            <span>Elevator</span>
                        </li>
                    )}
                    {/* View */}
                    {amenities?.view && (
                        <li className="flex items-center space-x-2">
                            <span className="text-green-600 font-semibold">✓</span>
                            <span>View: {amenities.view}</span>
                        </li>
                    )}
                    {/* Kitchen */}
                    {amenities?.kitchen?.length > 0 && (
                        <li className="flex items-center space-x-2">
                            <span className="text-green-600 font-semibold">✓</span>
                            <span>Kitchen: {amenities.kitchen.join(", ")}</span>
                        </li>
                    )}
                    {/* Heating */}
                    {amenities?.heating && (
                        <li className="flex items-center space-x-2">
                            <span className="text-green-600 font-semibold">✓</span>
                            <span>Heating</span>
                        </li>
                    )}
                    {/* Internet */}
                    {amenities?.internet && (
                        <li className="flex items-center space-x-2">
                            <span className="text-green-600 font-semibold">✓</span>
                            <span>Internet</span>
                        </li>
                    )}
                    {/* Soundproofing */}
                    {amenities?.soundproofing && (
                        <li className="flex items-center space-x-2">
                            <span className="text-green-600 font-semibold">✓</span>
                            <span>Soundproofing</span>
                        </li>
                    )}
                    {/* Thermal Insulation */}
                    {amenities?.thermalInsulation && (
                        <li className="flex items-center space-x-2">
                            <span className="text-green-600 font-semibold">✓</span>
                            <span>Thermal Insulation</span>
                        </li>
                    )}
                </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Contact</h2>
                <p>Phone: <a href={`tel:${contact?.phone}`} className="text-blue-500">{contact?.phone}</a></p>
                <p>Email: <a href={`mailto:${contact?.email}`} className="text-blue-500">{contact?.email}</a></p>
                <p>WhatsApp: <a href={`https://wa.me/${contact?.whatsapp}`} className="text-blue-500">{contact?.whatsapp}</a></p>
            </div>

            {/* images */}

            
        </div>
    );
};

function SingleHouseRentals() {
    const navigate = useNavigate();
    const [newData, setNewData] = useState([])
    const { id } = useParams();
    const { data: datahouse , loading, error } = useFetch(`/api/house-rentals/find/${id}`);

    // const datahouse = datahouse;

    // const {user} = useContext(AuthContext);
    
    // useEffect(() => {
    //     const checkAdmin = async () => {
    //         // Ensure data is not empty or undefined
    //         if (!data || Object.keys(data).length === 0) return;

    //         if (user?.adminHouses && !user?.adminUsers) {
    //             const isAdminMismatch = user._id !== data?.isA;
    //             if (isAdminMismatch) {
    //                 navigate("/houses-sales");
    //             }
    //         }
    //     };

    //     checkAdmin();
    // }, [user, data, navigate]);



    useEffect(()=>{
        setNewData(datahouse)
    },[datahouse])

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading property details. Please try again later.</div>;
    }

    return (
        <>
            <PropertyDetails data={newData} />

            <div className="bg-white  mx-auto m-6 p-6 rounded-lg shadow-md max-w-7xl">
                <h2 className="text-2xl font-bold mb-4">Images</h2>
                <ImgHotel hotelId={id} type={"house"} />
            
            </div>

           

        </>
    );
}

export default SingleHouseRentals;
