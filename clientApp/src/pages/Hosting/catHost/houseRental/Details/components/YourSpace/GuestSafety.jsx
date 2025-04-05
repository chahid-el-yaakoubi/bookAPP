import React, { useState, useEffect } from 'react';
import { 
  MdSmokeFree 
} from 'react-icons/md';
import { 
  FaExclamationTriangle, 
  FaFireExtinguisher, 
  FaMedkit, 
  FaCamera, 
  FaUserShield, 
  FaKey, 
  FaDoorOpen,
  FaCheck
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

const SafetySecurityFeatures = () => {
  const dispatch = useDispatch();
  const selectedProperty = useSelector(state => state.property?.selectedProperty);
  const [selectedFeatures, setSelectedFeatures] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Load existing safety features when component mounts
  useEffect(() => {
    if (selectedProperty?.safety_features?.safety) {
      setSelectedFeatures(new Set(selectedProperty.safety_features.safety));
    }
  }, [selectedProperty]);

  // Safety features data
  const safetyItems = [
    { id: 'smoke_detector', label: 'Smoke Detector', icon: MdSmokeFree, category: 'Safety & Security' },
    { id: 'carbon_monoxide_detector', label: 'Carbon Monoxide Detector', icon: FaExclamationTriangle, category: 'Safety & Security' },
    { id: 'fire_extinguisher', label: 'Fire Extinguisher', icon: FaFireExtinguisher, category: 'Safety & Security' },
    { id: 'first_aid_kit', label: 'First Aid Kit', icon: FaMedkit, category: 'Safety & Security' },
    { id: 'security_camera', label: 'Security Camera', icon: FaCamera, category: 'Safety & Security' },
    { id: 'security_guard', label: 'Security Guard', icon: FaUserShield, category: 'Safety & Security' },
    { id: 'keycard_access', label: 'Keycard Access', icon: FaKey, category: 'Safety & Security' },
    { id: 'emergency_exit', label: 'Emergency Exit', icon: FaDoorOpen, category: 'Safety & Security' },
  ];

  // Toggle feature selection
  const toggleFeature = (id) => {
    const newSelected = new Set(selectedFeatures);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedFeatures(newSelected);
  };

  // Save selected features
  const saveFeatures = () => {
    setIsSaving(true);
    
    const updatedProperty = {
      ...selectedProperty,
      safety_features: {
        ...selectedProperty?.safety_features,
        safety: Array.from(selectedFeatures)
      }
    };

    dispatch({
      type: 'UPDATE_PROPERTY',
      payload: { updatedProperty }
    });

    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold mb-2">Safety & Security Features</h2>
        <p className="text-gray-600">
          Select the safety and security features available at your property.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {safetyItems.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleFeature(item.id)}
            className={`flex items-center p-4 border rounded-lg transition-all focus:outline-none
              ${selectedFeatures.has(item.id) 
                ? 'border-2 border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-blue bg-gray-50 hover:bg-blue'}`}
          >
            <div className={`mr-4 p-2 rounded-full ${selectedFeatures.has(item.id) 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-600'}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <div className="font-medium">{item.label}</div>
            </div>
            {selectedFeatures.has(item.id) && (
              <FaCheck className="text-green-500 ml-2" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-8">
        <h3 className="font-medium mb-2">Safety Compliance Note:</h3>
        <p className="text-gray-600">
          Ensuring your property has appropriate safety features not only protects your guests 
          but may also be required by local regulations.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveFeatures}
          className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue flex items-center gap-2"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="animate-spin">⟳</span>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Save Features</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SafetySecurityFeatures;