import { useState } from 'react';
import { FaFireExtinguisher, FaFirstAid, 
         FaLock, FaShieldAlt, FaExclamationTriangle, FaPlus } from 'react-icons/fa';
            //  FaCamera

const GuestSafety = () => {
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [customSafetyItems, setCustomSafetyItems] = useState([]);
    const [newItem, setNewItem] = useState('');

    const safetyItems = [
        {
            id: 'smoke_detector',
            label: 'Smoke detector',
            icon: FaFireExtinguisher, // FaSmoke
            description: 'Working smoke detector in the property'
        },
        {
            id: 'fire_extinguisher',
            label: 'Fire extinguisher',
            icon: FaFireExtinguisher,
            description: 'Easy access to fire extinguisher'
        },
        {
            id: 'first_aid',
            label: 'First aid kit',
            icon: FaFirstAid,
            description: 'First aid kit available for emergencies'
        },
        {
            id: 'security_camera',
            label: 'Security camera',
            icon: FaFireExtinguisher, // FaCamera
            description: 'Security cameras on property'
        },
        {
            id: 'secure_locks',
            label: 'Security locks',
            icon: FaLock,
            description: 'Enhanced security locks on all doors'
        }
    ];

    const toggleItem = (id) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const addCustomItem = () => {
        if (newItem.trim()) {
            setCustomSafetyItems([...customSafetyItems, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeCustomItem = (index) => {
        setCustomSafetyItems(customSafetyItems.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Guest Safety</h2>
            <p className="text-gray-600 mb-6">
                Ensure your guests' safety by indicating available safety features.
            </p>

            <div className="space-y-6">
                {/* Standard Safety Items */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Safety Equipment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {safetyItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                className={`flex items-center p-4 border rounded-lg transition-colors
                                    ${selectedItems.has(item.id)
                                        ? 'border-blue bg-blue/5'
                                        : 'border-gray-200 hover:border-blue'}`}
                            >
                                <item.icon className="w-5 h-5 text-gray-600 mr-3" />
                                <div className="text-left">
                                    <div className="font-medium">{item.label}</div>
                                    <div className="text-sm text-gray-500">{item.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Safety Items */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Safety Features</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Add additional safety feature"
                            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                        />
                        <button
                            onClick={addCustomItem}
                            className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90"
                        >
                            <FaPlus />
                        </button>
                    </div>

                    {customSafetyItems.length > 0 && (
                        <div className="space-y-2">
                            {customSafetyItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <span>{item}</span>
                                    <button
                                        onClick={() => removeCustomItem(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Safety Guidelines */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="w-5 h-5 text-yellow-500 mt-1" />
                        <div>
                            <h3 className="font-medium mb-2">Important Safety Guidelines:</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>Regularly check and maintain all safety equipment</li>
                                <li>Provide emergency contact numbers</li>
                                <li>Mark emergency exits clearly</li>
                                <li>Keep safety equipment easily accessible</li>
                                <li>Document safety procedures for guests</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestSafety; 