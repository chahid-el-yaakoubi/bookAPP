import { useState, useEffect, useContext } from 'react';
import HostLayout from '../../ComponentHost/HostLayout';
import BasicInformation from './steps/BasicInformation';
import LocationInfo from './steps/LocationInfo';
import TitleProperty from './steps/Title';
import BookingRules from './steps/BookingRules';
import PricingSection from './steps/PricingSection';
import PropertyFeatures from './steps/PropertyFeatures';
import { AuthContext } from '../../../../contexts/AuthContext';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { createProperty } from '../../../../Lib/api';


const STORAGE_KEY = 'property_draft';

const AddProperty = () => {
  const { state } = useContext(AuthContext);
  const created_by = state.user?.id;

  console.log(created_by);
  // alert(created_by)
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState('info'); // 'success', 'error', 'info', 'warning'
  
  const [propertyData, setPropertyData] = useState(() => {
    // Try to get saved data from localStorage on initial load
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (err) {
      console.error("Error loading saved property data:", err);
    }

    // Default initial state if no saved data
    return {
      title: '',
      created_by : created_by ,
      type: {
        type: '',
        category: '',
        listingType: 'Entire place',
        viewType: ''
      },
      location: {
        city: '',
        country: 'morocco',
        region: '',
        addressAr: '',
        addressEn: '',
        postal_code: '',
        latitude: '',
        longitude: '',
        neighborhood : '',
        floorNumber: 3,
        floors : 1,
      },
      property_details: {
        propertyFeatures: {
          standard: [],
          custom: []
        }
      },
      pricing: {
        nightly_rate: '',
        Weekend_price: '',
        discounts: {
          weekly_discount: '',
          monthly_discount: ''
        },
        smart_pricing : {
          enabled : false,
          min : null,
          max : null
        }
      },
      policies: {
        rules: {
          max_guests: 2,
          smoking: 'no',
          pets: {
            allowed: false,
            maxCount: 0
          },
          additionalRules: []
        }
      }
    };
  });

  // Custom notification handler
  const showNotification = (message, type = 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  // Save to localStorage with debounce
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(propertyData));
      } catch (err) {
        console.error("Error saving property data:", err);
      }
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [propertyData]);

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit this property listing? This action cannot be undone.')) {
      return;
    }

    // Final validation check
    if (!validateAllData()) {
      showNotification("Please complete all required fields before submitting", "error");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res =  await createProperty(propertyData);

      console.log(res.status);

      if (res.status === 200) {
        showNotification("Property created successfully!", "success");
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = '/host/properties/listining';
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      setError(errorMsg);
      showNotification(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 0, title: "Property Type", key: "type" },
    { number: 1, title: "Location", key: "location" },
    { number: 2, title: "Property Features", key: "features" },
    { number: 3, title: "Title", key: "title" },
    { number: 4, title: "Rules", key: "rules" },
    { number: 5, title: "Pricing", key: "pricing" },
  ];

  const handleSaveAndExit = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(propertyData));
      showNotification("Progress saved successfully", "success");
      window.location.href = '/host/properties/listining';
    } catch (err) {
      showNotification("Failed to save progress", "error");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInformation propertyData={propertyData} setPropertyData={setPropertyData} />;
      case 1:
        return <LocationInfo propertyData={propertyData} setPropertyData={setPropertyData} />;
      case 2:
        return <PropertyFeatures propertyData={propertyData} setPropertyData={setPropertyData} />;
      case 3:
        return <TitleProperty propertyData={propertyData} setPropertyData={setPropertyData} />;
      case 4:
        return <BookingRules propertyData={propertyData} setPropertyData={setPropertyData} />;
      case 5:
        return <PricingSection propertyData={propertyData} setPropertyData={setPropertyData} />;
      default:
        return null;
    }
  };

  const validateStepData = (stepNumber) => {
    switch (stepNumber) {
      case 0: // Property Type
        return propertyData?.type?.type !== '' && 
               propertyData?.type?.category !== '';
      
      case 1: // Location
        return propertyData?.location?.city?.trim() !== '' && 
               propertyData?.location?.country?.trim() !== '' &&
              //  propertyData?.location?.longitude !== null &&
              //  propertyData?.location?.latitude !== null &&
               propertyData?.location?.neighborhood !== '' &&
               propertyData?.location?.region?.trim() !== '' ;
      
      case 2: // Property Features
        return propertyData?.property_details?.propertyFeatures?.standard?.length > 0 || 
               propertyData?.property_details?.propertyFeatures?.custom?.length > 0;
      
      case 3: // Title
        return propertyData?.title?.trim() !== '';
      
      case 4: // Rules
        return propertyData?.policies?.rules?.max_guests > 0;
      
      case 5: // Pricing
        return propertyData?.pricing?.nightly_rate !== '' && 
               parseFloat(propertyData?.pricing?.nightly_rate) > 0 || ( propertyData?.pricing?.smart_pricing?.enabled === true && propertyData?.pricing?.smart_pricing?.max > propertyData?.pricing?.smart_pricing?.min);
      
      default: 
        return false;
    }
  };
  
  const validateAllData = () => {
    // Check all steps are valid
    for (let i = 0; i < steps.length; i++) {
      if (!validateStepData(i)) {
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === steps.length - 1) {
      handleSubmit();
      return;
    }

    if (validateStepData(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      showNotification('Please fill in all required fields before proceeding.', 'warning');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Get notification style based on type
  const getNotificationStyle = () => {
    switch (notificationType) {
      case 'success':
        return 'bg-green-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue text-white';
    }
  };

  return (
    <HostLayout>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              {steps[currentStep].title}
            </h1>
            <button
              onClick={handleSaveAndExit}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Save & exit
            </button>
          </div>

          {/* Custom Notification */}
          {notificationMessage && (
            <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg text-sm z-50 ${getNotificationStyle()}`}>
              {notificationMessage}
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
            <div className="flex justify-between mb-2 ">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex-1 text-center ${
                    step.number === currentStep ? 'text-blue' :
                    step.number < currentStep ? 'text-green-500' :
                    'text-gray-300'
                  }`}
                >
                  <div className="relative">
                    <div 
                      className={`w-6 h-6 mx-auto rounded-full border-2 flex items-center justify-center ${
                        step.number === currentStep ? 'border-blue bg-white' :
                        step.number < currentStep ? 'border-green-500 bg-green-500 text-white' :
                        'border-gray-300 bg-white'
                      }`}
                    >
                      {step.number < currentStep ? '✓' : step.number + 1}
                    </div>
                  </div>
                  <div className="mt-2 text-sm hidden md:block">{step.title}</div>
                </div>
              ))}
            </div>
            <div className="relative ">
              <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
              <div
                className="absolute top-0 h-1 bg-blue transition-all duration-500"
                style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {renderStepContent()}

       
          </div>

          {/* Bottom fixed navigation for mobile */}
          <div className="md:ps-72 fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t flex justify-between">
            <button
              onClick={handlePrevStep}
              className={`px-4 py-2 border rounded-md ${currentStep === 0 ? 'invisible' : ''}`}
              disabled={isSubmitting || currentStep === 0}
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className={`px-6 py-2 text-white rounded-md ${
                validateStepData(currentStep) && !isSubmitting
                  ? 'bg-blue'
                  : 'bg-gray-400'
              }`}
              disabled={!validateStepData(currentStep) || isSubmitting}
            >
              {isSubmitting ? 'Processing...' : currentStep === steps.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </main>
    </HostLayout>
  );
};

export default AddProperty;