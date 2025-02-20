import { useState } from 'react';
import { FaSmokingBan, FaPaw, FaGlassCheers, FaBaby, FaVolumeMute, 
         FaClock, FaUsers, FaExclamationTriangle } from 'react-icons/fa';

const HouseRules = () => {
    const [rules, setRules] = useState([
        {
            id: 'quiet_hours',
            title: 'Quiet Hours',
            icon: FaVolumeMute,
            content: '',
            enabled: false
        },
        {
            id: 'max_guests',
            title: 'Maximum Guests',
            icon: FaUsers,
            content: '',
            enabled: false
        },
        {
            id: 'smoking',
            title: 'Smoking Policy',
            icon: FaSmokingBan,
            content: '',
            enabled: false
        },
        {
            id: 'pets',
            title: 'Pet Policy',
            icon: FaPaw,
            content: '',
            enabled: false
        },
        {
            id: 'parties',
            title: 'Events & Parties',
            icon: FaGlassCheers,
            content: '',
            enabled: false
        }
    ]);

    const [customRules, setCustomRules] = useState([]);
    const [newRule, setNewRule] = useState({ title: '', content: '' });
    const [consequences, setConsequences] = useState('');
    const [emergencyInfo, setEmergencyInfo] = useState('');

    const toggleRule = (id) => {
        setRules(rules.map(rule =>
            rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
        ));
    };

    const updateRuleContent = (id, content) => {
        setRules(rules.map(rule =>
            rule.id === id ? { ...rule, content } : rule
        ));
    };

    const addCustomRule = () => {
        if (newRule.title.trim() && newRule.content.trim()) {
            setCustomRules([...customRules, {
                id: `custom-${Date.now()}`,
                ...newRule
            }]);
            setNewRule({ title: '', content: '' });
        }
    };

    const removeCustomRule = (id) => {
        setCustomRules(customRules.filter(rule => rule.id !== id));
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">House Rules</h2>
            <p className="text-gray-600 mb-6">
                Clearly communicate your house rules to ensure a pleasant stay for everyone.
            </p>

            <div className="space-y-6">
                {/* Standard Rules */}
                <div className="space-y-4">
                    {rules.map(rule => (
                        <div key={rule.id} className="border rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <rule.icon className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium">{rule.title}</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rule.enabled}
                                        onChange={() => toggleRule(rule.id)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
                                </label>
                            </div>
                            {rule.enabled && (
                                <div className="p-4">
                                    <textarea
                                        value={rule.content}
                                        onChange={(e) => updateRuleContent(rule.id, e.target.value)}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                                        placeholder={`Describe your ${rule.title.toLowerCase()} policy...`}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Custom Rules */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Custom Rules</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={newRule.title}
                            onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                            placeholder="Rule title"
                            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                        />
                        <button
                            onClick={addCustomRule}
                            disabled={!newRule.title.trim() || !newRule.content.trim()}
                            className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue/90 disabled:bg-gray-300"
                        >
                            Add Rule
                        </button>
                    </div>
                    <textarea
                        value={newRule.content}
                        onChange={(e) => setNewRule({ ...newRule, content: e.target.value })}
                        placeholder="Rule description"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                    />

                    {customRules.map(rule => (
                        <div key={rule.id} className="border rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-gray-50">
                                <span className="font-medium">{rule.title}</span>
                                <button
                                    onClick={() => removeCustomRule(rule.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="text-gray-600">{rule.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Consequences */}
                <div>
                    <h3 className="text-lg font-medium mb-3">Rule Enforcement</h3>
                    <div className="flex items-start gap-3 mb-4">
                        <FaExclamationTriangle className="w-5 h-5 text-yellow-500 mt-1" />
                        <p className="text-gray-600">
                            Clearly state the consequences of breaking house rules
                        </p>
                    </div>
                    <textarea
                        value={consequences}
                        onChange={(e) => setConsequences(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                        placeholder="Describe potential consequences for rule violations..."
                    />
                </div>

                {/* Emergency Information */}
                <div>
                    <h3 className="text-lg font-medium mb-3">Emergency Information</h3>
                    <textarea
                        value={emergencyInfo}
                        onChange={(e) => setEmergencyInfo(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                        placeholder="Add emergency contact numbers and important safety information..."
                    />
                </div>
            </div>
        </div>
    );
};

export default HouseRules; 