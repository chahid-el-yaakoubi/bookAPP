import { useState, useEffect } from 'react';
import HostLayout from '../../ComponentHost/HostLayout';
import BasicInformation from './steps/BasicInformation';
import LocationInfo from './steps/LocationInfo';
import PropertyDetails from './steps/PropertyDetails';
import AmenitiesSection from './steps/AmenitiesSection';
import PhotosUpload from './steps/PhotosUpload';
import PricingSection from './steps/PricingSection';
import BookingRules from './steps/BookingRules';
import ReviewSubmit from './steps/ReviewSubmit';

const STORAGE_KEY = 'property_draft';

const AddProperty = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [propertyData, setPropertyData] = useState(() => {
        // Try to get saved data from localStorage on initial load
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            return JSON.parse(savedData);
        }
        
        // Default initial state if no saved data
        return {
            title: '',
            type: '',
            description: '',
            location: {
                country: '',
                city: '',
                address: '',
                latitude: '',
                longitude: '',
                nearby_landmarks: []
            },
            property_details: {
                rooms: '',
                bathrooms: '',
                beds: '',
                max_guests: '',
                size_sqm: '',
                amenities: [],
                photos: []
            },
            pricing: {
                nightly_rate: '',
                currency: 'MAD',
                cleaning_fee: '',
                service_fee: '',
                discounts: {
                    weekly_discount: '',
                    monthly_discount: ''
                }
            },
            booking_policy: {
                cancellation_policy: 'Flexible',
                check_in: '14:00',
                check_out: '11:00',
                pets_allowed: false,
                smoking_allowed: false
            }
        };
    });

    // Save to localStorage whenever propertyData changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(propertyData));
    }, [propertyData]);

    const steps = [
        { number: 1, title: "Basic Information" },
        { number: 2, title: "Location" },
        { number: 3, title: "Property Details" },
        { number: 4, title: "Amenities" },
        { number: 5, title: "Photos" },
        { number: 6, title: "Pricing" },
        { number: 7, title: "Booking Rules" },
        { number: 8, title: "Review & Submit" }
    ];

    const handleSubmit = async () => {
        try {
            // Add your API call here to submit the property data
            const response = await fetch('/api/properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(propertyData)
            });

            if (response.ok) {
                // Clear localStorage after successful submission
                localStorage.removeItem(STORAGE_KEY);
                
                // Show success message
                alert('Property listed successfully!');
                
                // Redirect to properties list or dashboard
                window.location.href = '/host/properties';
            } else {
                throw new Error('Failed to submit property');
            }
        } catch (error) {
            console.error('Error submitting property:', error);
            alert('Failed to submit property. Please try again.');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <BasicInformation propertyData={propertyData} setPropertyData={setPropertyData} />;
            case 2:
                return <LocationInfo propertyData={propertyData} setPropertyData={setPropertyData} />;
            case 3:
                return <PropertyDetails propertyData={propertyData} setPropertyData={setPropertyData} />;
            case 4:
                return <AmenitiesSection propertyData={propertyData} setPropertyData={setPropertyData} />;
            case 5:
                return <PhotosUpload propertyData={propertyData} setPropertyData={setPropertyData} />;
            case 6:
                return <PricingSection propertyData={propertyData} setPropertyData={setPropertyData} />;
            case 7:
                return <BookingRules propertyData={propertyData} setPropertyData={setPropertyData} />;
            case 8:
                return <ReviewSubmit propertyData={propertyData} />;
            default:
                return null;
        }
    };

    const validateStep = (stepNumber) => {
        switch (stepNumber) {
            case 1: // Basic Information
                return (
                    propertyData.title.trim() !== '' &&
                    propertyData.type !== '' &&
                    propertyData.description.trim() !== ''
                );
            
            case 2: // Location
                return (
                    propertyData.location.country.trim() !== '' &&
                    propertyData.location.city.trim() !== '' &&
                    propertyData.location.address.trim() !== '' &&
                    propertyData.location.latitude.trim() !== '' &&
                    propertyData.location.longitude.trim() !== ''
                );
            
            case 3: // Property Details
                return (
                    propertyData.property_details.rooms !== '' &&
                    propertyData.property_details.bathrooms !== '' &&
                    propertyData.property_details.beds !== '' &&
                    propertyData.property_details.max_guests !== '' &&
                    propertyData.property_details.size_sqm !== ''
                );
            
            case 4: // Amenities
                return propertyData.property_details.amenities.length > 0;
            
            case 5: // Photos
                return propertyData.property_details.photos.length > 0;
            
            case 6: // Pricing
                return (
                    propertyData.pricing.nightly_rate !== '' &&
                    propertyData.pricing.cleaning_fee !== ''
                );
            
            case 7: // Booking Rules
                return (
                    propertyData.booking_policy.check_in !== '' &&
                    propertyData.booking_policy.check_out !== '' &&
                    propertyData.booking_policy.cancellation_policy !== ''
                );
            
            case 8: // Review
                return true; // No validation needed for review step
            
            default:
                return false;
        }
    };

    const handleNextStep = () => {
        if (currentStep === steps.length) {
            handleSubmit();
            return;
        }

        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        } else {
            alert('Please fill in all required fields before proceeding.');
        }
    };

    return (
        <HostLayout>
            <main className="flex-1 p-4 md:p-6">
                <div className="max-w-3xl mx-auto">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {steps.map((step) => (
                                <div 
                                    key={step.number}
                                    className={`flex-1 text-center ${
                                        step.number === currentStep ? 'text-blue' : 
                                        step.number < currentStep ? 'text-gray-500' : 
                                        'text-gray-300'
                                    }`}
                                >
                                    <div className="relative">
                                        <div className={`w-6 h-6 mx-auto rounded-full border-2 ${
                                            step.number === currentStep ? 'border-blue bg-white' :
                                            step.number < currentStep ? 'border-gray-500 bg-gray-500' :
                                            'border-gray-300 bg-white'
                                        }`}>
                                            {step.number}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm hidden md:block">{step.title}</div>
                                </div>
                            ))}
                        </div>
                        <div className="relative">
                            <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
                            <div 
                                className="absolute top-0 h-1 bg-blue transition-all duration-500"
                                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {renderStepContent()}
                        
                        {/* Navigation Buttons */}
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className={`px-4 py-2 border rounded-md hover:bg-gray-50 ${
                                    currentStep === 1 ? 'invisible' : ''
                                }`}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNextStep}
                                className={`px-4 py-2 text-white rounded-md transition-colors ${
                                    validateStep(currentStep) 
                                        ? 'bg-blue hover:bg-blue/90' 
                                        : 'bg-gray-400 cursor-not-allowed'
                                }`}
                                disabled={!validateStep(currentStep)}
                            >
                                {currentStep === steps.length ? 'Submit' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </HostLayout>
    );
};

export default AddProperty; 