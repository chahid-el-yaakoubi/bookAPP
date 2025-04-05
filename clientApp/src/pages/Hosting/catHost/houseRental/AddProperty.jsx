import { useState, useEffect, useCallback, useContext } from 'react';
import HostLayout from '../../ComponentHost/HostLayout';
import BasicInformation from './steps/BasicInformation';
import LocationInfo from './steps/LocationInfo';
import PropertyDetails from './steps/PropertyDetails';
import AmenitiesSection from './steps/AmenitiesSection';
import PhotosUpload from './steps/PhotosUpload';
import PricingSection from './steps/PricingSection';
import BookingRules from './steps/BookingRules';
import ReviewSubmit from './steps/ReviewSubmit';
import Welcome from './steps/Welcome';
import TitleProperty from './steps/Title';
import { AuthContext } from '../../../../contextApi/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { createProperty } from '../../../../redux/actions/propertyActions';
import ListingType from './steps/Listingtype';



const STORAGE_KEY = 'property_draft';

const AddProperty = () => {
    const { user } = useContext(AuthContext);
    const owner_id = user._id;
    const dispatch = useDispatch();
    const properties = useSelector(state => state.property.properties);




    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [propertyData, setPropertyData] = useState(() => {
        // Try to get saved data from localStorage on initial load
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            return JSON.parse(savedData);
        }


        // Default initial state if no saved data
        const initialState = {
            owner_name: owner_id || '45225',
            title: '',
            type: '',
            listing_type: '',
            description: '',
            location: {
                country: 'morocco',
                city: '',
                region: '',
                neighborhood: '',
                latitude: '',
                longitude: '',
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
                smoking_allowed: false,
            },
        };

        return initialState;

    });



    // Debounced save to localStorage
    useEffect(() => {
        setIsSaving(true);
        const saveTimeout = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(propertyData));
            setIsSaving(false);
        }, 1000);

        return () => clearTimeout(saveTimeout);
    }, [propertyData]);

    const handleSubmit = async () => {
        if (!window.confirm('Are you sure you want to submit this property listing? This action cannot be undone.')) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            console.log(propertyData);
            await dispatch(createProperty(propertyData));

            // localStorage.removeItem(STORAGE_KEY);
            window.location.href = '/host/properties';
        } catch (error) {
            console.error('Error submitting property:', error);
            setError(error.message || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };


    const steps = [
        { number: 0, title: "Property Type" },
        { number: 1, title: "listing_type" },
        { number: 2, title: "Location" },
        // { number: 3, title: "Amenities" },
        // { number: 4, title: "Property Details" },
        { number: 3, title: `Now, let's choose a title for "${propertyData?.type}" ` },
        // { number: 5, title: "Pricing" },
        { number: 6, title: "Booking Rules" },
        { number: 7, title: "Review & Submit" }
    ];



    const handleSaveAndExit = () => {
        // Save current progress to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(propertyData));
        // Redirect to the host dashboard or properties page
        window.location.href = '/host/properties';
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <BasicInformation propertyData={propertyData} setPropertyData={setPropertyData} />;
            case 1:
                return <ListingType propertyData={propertyData} setPropertyData={setPropertyData} />;

            case 2:
                return <LocationInfo propertyData={propertyData} setPropertyData={setPropertyData} />;

            // case 3:
            //     return <AmenitiesSection propertyData={propertyData} setPropertyData={setPropertyData} />;
            // // case 4:
            //     return <PropertyDetails propertyData={propertyData} setPropertyData={setPropertyData} />;

            case 3:
                return <TitleProperty propertyData={propertyData} setPropertyData={setPropertyData} />;
            // case 5:
            //     return <PricingSection propertyData={propertyData} setPropertyData={setPropertyData} />;
            case 6:
                return <BookingRules propertyData={propertyData} setPropertyData={setPropertyData} />;
            case 7:
                return <ReviewSubmit propertyData={propertyData} handleSubmit={handleSubmit} />;
            default:
                return null;
        }
    };

    // console.log('propertyData:', propertyData);

    const validateStep = (stepNumber) => {
        switch (stepNumber) {

            case 0: // Basic Information
                return (
                    // propertyData?.title?.trim() !== '' 
                    propertyData?.type !== ''
                    // propertyData?.description?.trim() !== ''
                );

            case 1: // Location
            return true;
            case 2: // Property Details
            return true;

            case 3: // Amenities
            return true;
            case 4: // title
            return true;

            case 5: // Pricing
            return true;

            case 6: // Booking Rules
            return true;

            case 7: // Review
                return true; // No validation needed for review step

            default:
                return false;
        }
    };

    const handleNextStep = () => {
        if (currentStep === steps.length - 1) {
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
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">
                            {steps[currentStep].title}
                        </h1>
                        <button
                            onClick={handleSaveAndExit}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Save & exit
                        </button>
                    </div>

                    {/* Saving Indicator */}
                    {isSaving && (
                        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg text-sm">
                            Saving changes...
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            {steps.map((step) => (
                                <div
                                    key={step.number}
                                    className={`flex-1 text-center ${step.number === currentStep ? 'text-blue' :
                                        step.number < currentStep ? 'text-gray-500' :
                                            'text-gray-300'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className={`w-6 h-6 mx-auto rounded-full border-2 ${step.number === currentStep ? 'border-blue bg-white' :
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
                    <div className="bg-white rounded-lg shadow-lg p-6 ">
                        <h1 className="text-2xl font-semibold mb-6">
                            {steps[currentStep].title}
                        </h1>

                        {renderStepContent()}

                        {/* Navigation Buttons */}
                        <div className="fixed bottom-2 right-0 left-0 container mx-auto mt-6 flex justify-between items-center ">
                            <button
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className={`px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors ${currentStep === 0 ? 'invisible' : ''
                                    }`}
                                disabled={isSubmitting}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNextStep}
                                className={`px-6 py-2 text-white rounded-md transition-colors flex items-center ${validateStep(currentStep) && !isSubmitting
                                    ? 'bg-blue hover:bg-blue'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                                disabled={!validateStep(currentStep) || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    currentStep === steps.length - 1 ? 'Save or Create' : 'Continue'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </HostLayout>
    );
};

export default AddProperty; 