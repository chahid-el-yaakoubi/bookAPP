import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';
import ImgHotel from '../../components/imgHotel';

export const PropertyDetails = ({ data }) => {
    if (!data) {
        return <div>Loading property details...</div>; // Handle loading state for property details
    }

    const {
        shopName,
        ownerName,
        contactNumber,
        email,
        location,
        type,
        price,
        area,
        amenities,
        proximity,
        status,
        rentalDuration,
        rentalDeposit
    } = data;

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Header */}
            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold">{shopName}</h1>
                <p className="text-lg">Owner: {ownerName}</p>
                <p className="mt-2">
                    <span className={`px-3 py-1 rounded-lg ${status === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}>
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
            </div>

            {/* Price & Area */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Price & Area</h2>
                <p>Price: <span className="font-medium">{price}  MAD</span></p>
                <p>Area: <span className="font-medium">{area} m²</span></p>
                <p>Rental Duration: <span className="font-medium">{rentalDuration}</span></p>
                <p>Rental Deposit: <span className="font-medium">{rentalDeposit} MAD</span></p>
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                <ul className="space-y-2">
                    {amenities?.hasElectricity && (
                        <li>Electricity</li>
                    )}
                    {amenities?.hasWater && (
                        <li>Water</li>
                    )}
                    {amenities?.hasParking && (
                        <li>Parking</li>
                    )}
                    {amenities?.hasSecurity && (
                        <li>Security</li>
                    )}
                    {amenities?.hasAirConditioning && (
                        <li>Air Conditioning</li>
                    )}
                    {amenities?.hasInternet && (
                        <li>Internet</li>
                    )}
                    {amenities?.hasStorageSpace && (
                        <li>Storage Space</li>
                    )}
                    {amenities?.hasBathroom && (
                        <li>Bathroom</li>
                    )}
                </ul>
            </div>

            {/* Proximity */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Nearby Places</h2>
                <ul className="space-y-2">
                    {proximity?.items?.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Contact</h2>
                <p>Phone: <a href={`tel:${contactNumber}`} className="text-blue-500">{contactNumber}</a></p>
                <p>Email: <a href={`mailto:${email}`} className="text-blue-500">{email}</a></p>
            </div>
        </div>
    );
};



function SingleShop() {
    const [newData, setNewData] = useState([]);
    const { id } = useParams();
    const { data: datahouse, loading, error } = useFetch(`/api/shops/find/${id}`);

    useEffect(() => {
        setNewData(datahouse);
    }, [datahouse]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading property details. Please try again later.</div>;
    }

    return (
        <>
            <PropertyDetails data={newData} />

            <div className="bg-white mx-auto m-6 p-6 rounded-lg shadow-md max-w-7xl">
                <h2 className="text-2xl font-bold mb-4">Images</h2>
                <ImgHotel hotelId={id} type={"shops"} />
            </div>
        </>
    );
}

export default SingleShop;
