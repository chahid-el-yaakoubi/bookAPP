import axios from "axios";
import { useEffect } from "react";

const ReviewSubmit = ({ propertyData }) => {




    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Review your listing</h2>
            <div className="space-y-4">
                <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Basic Information</h3>
                    <p><span className="text-gray-600">Title:</span> {propertyData.title}</p>
                    <p><span className="text-gray-600">Type:</span> {propertyData.type}</p>
                </div>
                
                <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Location</h3>
                    <p>{propertyData.location.address}</p>
                    <p>{propertyData.location.city}, {propertyData.location.country}</p>
                </div>

                <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Property Details</h3>
                    <p>{propertyData.property_details.rooms} rooms • {propertyData.property_details.bathrooms} bathrooms</p>
                    <p>{propertyData.property_details.max_guests} guests max • {propertyData.property_details.size_sqm} sqm</p>
                    <div className="mt-2">
                        <h4 className="text-sm font-medium mb-1">Amenities:</h4>
                        <div className="flex flex-wrap gap-2">
                            {propertyData.property_details.amenities.map((amenity, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Pricing</h3>
                    <p><span className="text-gray-600">Nightly Rate:</span> {propertyData.pricing.nightly_rate} MAD</p>
                    <p><span className="text-gray-600">Cleaning Fee:</span> {propertyData.pricing.cleaning_fee} MAD</p>
                    {(propertyData.pricing.discounts.weekly_discount || propertyData.pricing.discounts.monthly_discount) && (
                        <div className="mt-2">
                            <h4 className="text-sm font-medium mb-1">Discounts:</h4>
                            {propertyData.pricing.discounts.weekly_discount && (
                                <p>Weekly: {propertyData.pricing.discounts.weekly_discount}%</p>
                            )}
                            {propertyData.pricing.discounts.monthly_discount && (
                                <p>Monthly: {propertyData.pricing.discounts.monthly_discount}%</p>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="font-medium mb-2">Booking Rules</h3>
                    <p>Check-in: {propertyData.booking_policy.check_in}</p>
                    <p>Check-out: {propertyData.booking_policy.check_out}</p>
                    <p>Cancellation: {propertyData.booking_policy.cancellation_policy}</p>
                    <div className="mt-2">
                        <p>
                            {propertyData.booking_policy.pets_allowed ? '✓' : '✕'} Pets Allowed
                        </p>
                        <p>
                            {propertyData.booking_policy.smoking_allowed ? '✓' : '✕'} Smoking Allowed
                        </p>
                    </div>
                </div>

                {propertyData.property_details.photos.length > 0 && (
                    <div className="border-t pt-4">
                        <h3 className="font-medium mb-2">Property Photos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {propertyData.property_details.photos.map((photo, index) => (
                                <img 
                                    key={index}
                                    src={photo}
                                    alt={`Property ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
           
        </div>
    );
};

export default ReviewSubmit; 