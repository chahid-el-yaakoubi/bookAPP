import { useState } from 'react';
import { FaSmokingBan, FaPaw, FaGlassCheers, FaBaby, FaPlus, FaTimes } from 'react-icons/fa';

const HouseRules = () => {
    const [customRules, setCustomRules] = useState([]);
    const [newRule, setNewRule] = useState('');
    const [selectedRules, setSelectedRules] = useState(new Set());

    const standardRules = [
        {
            id: 'no_smoking',
            label: 'No smoking',
            icon: FaSmokingBan,
            description: 'Smoking is not allowed inside the property'
        },
        {
            id: 'no_pets',
            label: 'No pets',
            icon: FaPaw,
            description: 'Pets are not allowed on the property'
        },
        {
            id: 'no_parties',
            label: 'No parties',
            icon: FaGlassCheers,
            description: 'Parties and events are not permitted'
        },
        {
            id: 'no_children',
            label: 'Not suitable for children',
            icon: FaBaby,
            description: 'Property may not be safe or suitable for children'
        }
    ];

    const toggleRule = (id) => {
        const newSelected = new Set(selectedRules);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedRules(newSelected);
    };

    const addCustomRule = () => {
        if (newRule.trim()) {
            setCustomRules([...customRules, newRule.trim()]);
            setNewRule('');
        }
    };

    const removeCustomRule = (index) => {
        setCustomRules(customRules.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">House Rules</h2>
            <p className="text-gray-600 mb-6">
                Set clear expectations for your guests by establishing house rules.
            </p>

            <div className="space-y-6">
                {/* Standard Rules */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Standard Rules</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {standardRules.map((rule) => (
                            <button
                                key={rule.id}
                                onClick={() => toggleRule(rule.id)}
                                className={`flex items-center p-4 border rounded-lg transition-colors
                                    ${selectedRules.has(rule.id)
                                        ? 'border-blue bg-blue/5'
                                        : 'border-gray-200 hover:border-blue'}`}
                            >
                                <rule.icon className="w-5 h-5 text-gray-600 mr-3" />
                                <div className="text-left">
                                    <div className="font-medium">{rule.label}</div>
                                    <div className="text-sm text-gray-500">{rule.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Rules */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Custom Rules</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newRule}
                            onChange={(e) => setNewRule(e.target.value)}
                            placeholder="Add a custom rule"
                            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                        />
                        <button
                            onClick={addCustomRule}
                            className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90"
                        >
                            <FaPlus />
                        </button>
                    </div>

                    {customRules.length > 0 && (
                        <div className="space-y-2">
                            {customRules.map((rule, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <span>{rule}</span>
                                    <button
                                        onClick={() => removeCustomRule(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Tips for setting house rules:</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Be clear and specific</li>
                        <li>Keep rules reasonable and enforceable</li>
                        <li>Consider your property's unique features</li>
                        <li>Think about your neighbors</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HouseRules; 