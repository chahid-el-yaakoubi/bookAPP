import { useState } from 'react';
import { FaWheelchair, FaParking, FaDoorOpen, 
         FaShower, FaToilet, FaHandsHelping, FaPlus } from 'react-icons/fa';

        //  FaElevator

const Accessibility = () => {
    const [features, setFeatures] = useState([
        {
            id: 'step_free',
            title: 'Step-free access',
            icon: FaWheelchair,
            description: 'No steps or stairs to enter',
            enabled: false
        },
        {
            id: 'elevator',
            title: 'Elevator',
            icon: FaWheelchair, // FaElevator
            description: 'The property has an elevator',
            enabled: false
        },
        {
            id: 'parking',
            title: 'Accessible parking',
            icon: FaParking,
            description: 'Designated accessible parking spot',
            enabled: false
        },
        {
            id: 'wide_entrance',
            title: 'Wide entrances',
            icon: FaDoorOpen,
            description: 'Doorways at least 32 inches wide',
            enabled: false
        },
        {
            id: 'roll_shower',
            title: 'Roll-in shower',
            icon: FaShower,
            description: 'Shower with no lip or step',
            enabled: false
        },
        {
            id: 'accessible_toilet',
            title: 'Accessible toilet',
            icon: FaToilet,
            description: 'Raised toilet with grab bars',
            enabled: false
        }
    ]);

    const [customFeatures, setCustomFeatures] = useState([]);
    const [newFeature, setNewFeature] = useState({ title: '', description: '' });
    const [additionalInfo, setAdditionalInfo] = useState('');

    const toggleFeature = (id) => {
        setFeatures(features.map(feature =>
            feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
        ));
    };

    const addCustomFeature = () => {
        if (newFeature.title.trim() && newFeature.description.trim()) {
            setCustomFeatures([...customFeatures, {
                id: `custom-${Date.now()}`,
                ...newFeature
            }]);
            setNewFeature({ title: '', description: '' });
        }
    };

    const removeCustomFeature = (id) => {
        setCustomFeatures(customFeatures.filter(feature => feature.id !== id));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
            <p className="text-gray-600 mb-6">
                Help guests with accessibility needs understand your property's features.
            </p>

            <div className="space-y-6">
                {/* Standard Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map(feature => (
                        <div
                            key={feature.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors
                                ${feature.enabled
                                    ? 'border-blue bg-blue/5'
                                    : 'border-gray-200 hover:border-blue'
                                }`}
                            onClick={() => toggleFeature(feature.id)}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <feature.icon className="w-5 h-5 text-gray-600" />
                                <span className="font-medium">{feature.title}</span>
                            </div>
                            <p className="text-sm text-gray-600 ml-8">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Custom Features */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Accessibility Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={newFeature.title}
                            onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                            placeholder="Feature name"
                            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                        />
                        <button
                            onClick={addCustomFeature}
                            disabled={!newFeature.title.trim() || !newFeature.description.trim()}
                            className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 disabled:bg-gray-300 flex items-center justify-center gap-2"
                        >
                            <FaPlus />
                            Add Feature
                        </button>
                    </div>
                    <textarea
                        value={newFeature.description}
                        onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                        placeholder="Feature description"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                    />

                    {customFeatures.map(feature => (
                        <div key={feature.id} className="border rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-gray-50">
                                <span className="font-medium">{feature.title}</span>
                                <button
                                    onClick={() => removeCustomFeature(feature.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Information */}
                <div>
                    <h3 className="text-lg font-medium mb-3">Additional Information</h3>
                    <div className="flex items-start gap-3 mb-4">
                        <FaHandsHelping className="w-5 h-5 text-blue mt-1" />
                        <p className="text-gray-600">
                            Provide any additional details about accessibility that guests should know
                        </p>
                    </div>
                    <textarea
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                        placeholder="Add any additional accessibility information..."
                    />
                </div>

                {/* Accessibility Statement */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Important Note:</h3>
                    <p className="text-gray-600 text-sm">
                        Be accurate and honest about your property's accessibility features. 
                        This information is crucial for guests with accessibility needs to make 
                        informed decisions about their stay.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Accessibility; 