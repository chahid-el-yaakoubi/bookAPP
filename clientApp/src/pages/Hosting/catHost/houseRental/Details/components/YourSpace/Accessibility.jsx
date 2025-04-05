import { useState, useEffect } from 'react';
import {
    FaWheelchair, FaParking, FaDoorOpen,
    FaShower, FaToilet, FaHandsHelping,
    FaLightbulb, FaTimes, FaCheck, FaSpinner
} from 'react-icons/fa';

import { UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions';
import { useDispatch, useSelector } from 'react-redux';

const Accessibility = () => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);
    const [savingFeatureId, setSavingFeatureId] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(null);

    const [features, setFeatures] = useState([
        {
            id: 'step_free',
            title: 'Step-free access',
            icon: FaWheelchair,
            description: 'No steps or stairs to enter',
            enabled: selectedProperty?.accessibility_features?.step_free || false,
            examples: [
                'https://assets.publishing.service.gov.uk/media/5a6194d7ed915d0afc4635dc/s300_960-accessibility-image--ticket-gates.jpg',
                'https://disabilitytalk.co.uk/app/uploads/2021/03/p26passengerALAMY.jpg'
            ],
            detailText: 'The property entrance has no steps or stairs, allowing easy access for wheelchairs and people with mobility issues.'
        },
        {
            id: 'elevator',
            title: 'Elevator',
            icon: FaWheelchair,
            description: 'The property has an elevator',
            enabled: selectedProperty?.accessibility_features?.elevator || false,
            examples: [
                'https://www.schindler.in/content/dam/website/global/images/elevators/schindler-pjz-zurich-zh-09.jpg/_jcr_content/renditions/original./schindler-pjz-zurich-zh-09.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVk8Lyrnv1uf3ju8x_mERtGoM6rkBF1T14Xg&s'
            ],
            detailText: 'An elevator is available to access different floors of the property.'
        },
        {
            id: 'parking',
            title: 'Accessible parking',
            icon: FaParking,
            description: 'Designated accessible parking spot',
            enabled: selectedProperty?.accessibility_features?.parking || false,
            examples: [
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK_CGe1DzTlqnTHgFFLFX2WOpJzc4d1K-U1g&s',
                'https://www.ada.gov/assets/images/project-images/aisle-parking.png'
            ],
            detailText: 'The property has a designated parking spot for guests with accessibility needs.'
        },
        {
            id: 'wide_entrance',
            title: 'Wide entrances',
            icon: FaDoorOpen,
            description: 'Doorways at least 32 inches wide',
            enabled: selectedProperty?.accessibility_features?.wide_entrance || false,
            examples: [
                'data:image/jpeg;base64,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',
                'https://urbanfront.imgix.net/assets/Case-studies-LP/oversized-doors/oversized-front-door.jpg?auto=format&fit=crop&h=1050&ixlib=php-3.3.1&w=1400'
            ],
            detailText: 'The guest entryway is at least 32 inches (81 centimeters) wide.'
        },
        {
            id: 'roll_shower',
            title: 'Roll-in shower',
            icon: FaShower,
            description: 'Shower with no lip or step',
            enabled: selectedProperty?.accessibility_features?.roll_shower || false,
            examples: [
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRwLeRiLfahHr0yiy_qBXTFzbw4b9gvd8vPA&s',
                'https://www.aipremodeling.com/wp-content/uploads/2017/08/Tile-Roll-In-Shower-Pic-Litz-3938-768x768.jpg'
            ],
            detailText: 'The shower has no lip or step, allowing wheelchair users to roll directly into the shower area.'
        },
        {
            id: 'accessible_toilet',
            title: 'Accessible toilet',
            icon: FaToilet,
            description: 'Raised toilet with grab bars',
            enabled: selectedProperty?.accessibility_features?.accessible_toilet || false,
            examples: [
                'https://www.braunability.com/adobe/dynamicmedia/deliver/dm-aid--e4a5aa71-1c33-429e-848c-188ac44b412e/handicap-accessible-toilet.jpg?preferwebp=true&quality=82',
                'https://www.commercialwashroomsltd.co.uk/media/amasty/webp/wysiwyg/diss_png.webp'
            ],
            detailText: 'The toilet is raised for easier transfers and has grab bars installed for safety and support.'
        }
    ]);

    const [selectedFeature, setSelectedFeature] = useState(null);

    // Update features when selectedProperty changes
    useEffect(() => {
        if (selectedProperty?.accessibility_features) {
            setFeatures(prevFeatures => 
                prevFeatures.map(feature => ({
                    ...feature,
                    enabled: selectedProperty.accessibility_features[feature.id] || false
                }))
            );
        }
    }, [selectedProperty]);

    // Handle success notification disappearing after a delay
    useEffect(() => {
        let timer;
        if (saveSuccess) {
            timer = setTimeout(() => {
                setSaveSuccess(null);
            }, 2000); // Show success for 2 seconds
        }
        return () => clearTimeout(timer);
    }, [saveSuccess]);

    const toggleFeature = (id) => {
        // Update features state immediately for responsive UI
        setFeatures(features.map(feature =>
            feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
        ));
        
        // Show saving indicator
        setSavingFeatureId(id);
        
        // Prepare the form data
        const updatedFeatures = features.map(feature => 
            feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
        );
        
        // Save to Redux immediately
        saveFormData(updatedFeatures);
        
        // Simulate network delay of 3 seconds
        setTimeout(() => {
            setSavingFeatureId(null);
            setSaveSuccess(id);
        }, 3000);
    };

    const showFeatureDetails = (feature) => {
        setSelectedFeature(feature);
    };

    // Function to save the form data to Redux
    const saveFormData = (updatedFeatures) => {
        const accessibilityFeatures = updatedFeatures.reduce((acc, item) => {
            acc[item.id] = item.enabled;
            return acc;
        }, {});
        
        const updatedProperty = {
            ...selectedProperty,
            accessibility_features: accessibilityFeatures
        };
        
        dispatch({
            type: UPDATE_PROPERTY,
            payload: { updatedProperty }
        });
    };

    return (
        <div className="relative">
            {/* Main content */}
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
                <p className="text-gray-600 mb-6">
                    Help guests with accessibility needs understand your property's features.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map(feature => (
                        <div
                            key={feature.id}
                            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <feature.icon className="w-6 h-6 text-gray-600" />
                                    <span className="font-medium text-lg">{feature.title}</span>
                                </div>
                                <p className="text-gray-600 mb-4">{feature.description}</p>
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => showFeatureDetails(feature)}
                                        className="text-blue hover:text-blue font-medium"
                                    >
                                        View details
                                    </button>
                                    <div className="flex items-center">
                                        {savingFeatureId === feature.id ? (
                                            <div className="flex items-center text-blue">
                                                <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                                                <span>Saving...</span>
                                            </div>
                                        ) : saveSuccess === feature.id ? (
                                            <div className="flex items-center text-green-600">
                                                <FaCheck className="w-4 h-4 mr-2" />
                                                <span>Saved!</span>
                                            </div>
                                        ) : (
                                            <span className="mr-2 text-gray-600">
                                                {feature.enabled ? "Enabled" : "Disabled"}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => toggleFeature(feature.id)}
                                            className="flex items-center ml-2"
                                            disabled={savingFeatureId === feature.id}
                                        >
                                            {feature.enabled ? (
                                                <div className="w-10 h-6 bg-blue rounded-full flex items-center p-1">
                                                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                                                </div>
                                            ) : (
                                                <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center p-1">
                                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature details modal */}
            {selectedFeature && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-screen overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <selectedFeature.icon className="w-6 h-6 text-gray-600 mr-3" />
                                    <h2 className="text-2xl font-semibold">{selectedFeature.title}</h2>
                                </div>
                                <button
                                    onClick={() => setSelectedFeature(null)}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-700 mb-4">
                                    {selectedFeature.detailText || selectedFeature.description}
                                </p>

                                <div className="bg-blue p-4 rounded-lg mb-6 border border-blue">
                                    <div className="flex items-start gap-2">
                                        <FaLightbulb className="w-5 h-5 text-blue mt-1 flex-shrink-0" />
                                        <p className="text-gray-600">
                                            Adding accurate accessibility information helps guests with specific needs
                                            make informed decisions about your property.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-lg font-medium mb-4">Examples:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {selectedFeature.examples?.map((img, index) => (
                                    <div key={index} className="border rounded-lg overflow-hidden">
                                        <img
                                            src={img}
                                            alt={`Example of ${selectedFeature.title}`}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between mt-8 pt-4 border-t">
                                <button
                                    onClick={() => setSelectedFeature(null)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        toggleFeature(selectedFeature.id);
                                        setSelectedFeature(null);
                                    }}
                                    className={`px-6 py-2 rounded-lg ${selectedFeature.enabled
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        : 'bg-blue text-white hover:bg-blue'
                                        }`}
                                    disabled={savingFeatureId === selectedFeature.id}
                                >
                                    {selectedFeature.enabled ? "I don't have this feature" : "I have this feature"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accessibility;