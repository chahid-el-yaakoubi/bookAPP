import { useState, useEffect } from 'react';
import { FaChevronRight, FaMinus, FaPlus, FaCheck, FaTimes, FaSave, FaChevronLeft } from 'react-icons/fa';
import { FaPaw, FaDog, FaCat, FaFeather, FaFish } from 'react-icons/fa';

const BookingRules = ({ propertyData, setPropertyData }) => {
    const [isSaving, setIsSaving] = useState(false);
    const [ruleStates, setRuleStates] = useState({
        pets: false,
        events: false,
        smoking: false,
        quietHours: false,
        commercial: false
    });

    const [maxPets, setMaxPets] = useState(1);

    const [quietHours, setQuietHours] = useState({
        startTime: '11:00PM',
        endTime: '7:00AM'
    });

    const [guestCount, setGuestCount] = useState(2);
    const [additionalRules, setAdditionalRules] = useState([]);
    const [newRule, setNewRule] = useState('');
    const [activeView, setActiveView] = useState('main'); // 'main', 'checkInOut', or 'petRules'
    const [checkInOutTimes, setCheckInOutTimes] = useState({
        checkInWindow: {
            startTime: '3:00PM',
            endTime: '8:00PM'
        },
        checkoutTime: '11:00AM'
    });

    // Load data from propertyData on component mount
    useEffect(() => {
        if (propertyData?.policies?.rules) {
            const rules = propertyData.policies.rules;
            
            // Initialize rule states safely
            setRuleStates({
                pets: rules?.pets?.allowed ?? false,
                events: rules?.events === 'allowed' ?? false,
                smoking: rules?.smoking === 'allowed' ?? false,
                quietHours: rules?.quietHours?.pending ?? false,
                commercial: rules?.commercial === 'allowed' ?? false
            });
            
            // Initialize max pets if it exists
            if (rules?.pets?.maxCount) {
                setMaxPets(rules.pets.maxCount);
            }
            
            // Initialize quiet hours if they exist
            if (rules?.quietHours?.startTime && rules?.quietHours?.endTime) {
                setQuietHours({
                    startTime: rules.quietHours.startTime,
                    endTime: rules.quietHours.endTime
                });
            }
            
            // Initialize additional rules if they exist
            if (Array.isArray(rules?.additionalRules)) {
                setAdditionalRules(rules.additionalRules);
            }

            // Initialize guest count
            if (rules?.max_guests) {
                setGuestCount(rules.max_guests);
            }
        }
        
        // Initialize check-in/checkout times
        if (propertyData?.policies?.checkInOutTimes) {
            const times = propertyData.policies.checkInOutTimes;
            setCheckInOutTimes({
                checkInWindow: {
                    startTime: times?.checkInWindow?.start ?? '3:00PM',
                    endTime: times?.checkInWindow?.end ?? '8:00PM'
                },
                checkoutTime: times?.checkoutTime ?? '11:00AM'
            });
        }
    }, []);

    // Get all rules data and update parent component state
    const updatePropertyData = () => {
        setIsSaving(true);

        // Create updated property data following the initialState structure
        const updatedPropertyData = {
            ...propertyData,
            policies: {
                ...propertyData?.policies, 
                rules: {
                    ...propertyData?.policies?.rules,
                    max_guests: guestCount,
                    smoking: ruleStates.smoking ? 'allowed' : 'not_allowed',
                    events: ruleStates.events ? 'allowed' : 'not_allowed',
                    commercial: ruleStates.commercial ? 'allowed' : 'not_allowed',
                    pets: {
                        allowed: ruleStates.pets,
                        maxCount: ruleStates.pets ? maxPets : 0
                    },
                    quietHours: {
                        pending: ruleStates.quietHours,
                        startTime: quietHours.startTime,
                        endTime: quietHours.endTime
                    },
                }
            }
        };
        
        // Update parent component state
        setPropertyData(updatedPropertyData);

        // Simulate saving process delay
        setTimeout(() => {
            setIsSaving(false);
        }, 1000);
    };

    // Effect to update property data whenever relevant states change
    useEffect(() => {
        updatePropertyData();
    }, [ruleStates, maxPets, quietHours, guestCount, additionalRules, checkInOutTimes]);

    // Toggle rule status
    const toggleRule = (rule) => {
        setRuleStates(prevStates => ({
            ...prevStates,
            [rule]: !prevStates[rule]
        }));
    };

    // Update guest count
    const updateGuestCount = (increment) => {
        let newCount = increment
            ? Math.min(16, guestCount + 1)
            : Math.max(1, guestCount - 1);

        setGuestCount(newCount);
    };

    // Update max pets count
    const updateMaxPets = (increment) => {
        let newCount = increment
            ? Math.min(5, maxPets + 1)
            : Math.max(1, maxPets - 1);

        setMaxPets(newCount);
    };

    // Update quiet hours
    const updateQuietHours = (type, value) => {
        setQuietHours(prev => ({
            ...prev,
            [type]: value
        }));
    };

    // Add custom rule
    const addCustomRule = () => {
        if (newRule.trim()) {
            const updatedRules = [...additionalRules, newRule.trim()];
            setAdditionalRules(updatedRules);
            setNewRule('');
        }
    };

    // Handle check-in/checkout times save
    const handleCheckInOutSave = (timesData) => {
        setCheckInOutTimes(timesData);
        setActiveView('main');
    };

 

    if (activeView === 'petRules') {
        return (
            <PetRulesInfo
                onBack={() => setActiveView('main')}
            />
        );
    }

    return (
        <div className="shadow-xl md:p-20 mx-auto mb-10">
            <h1 className="text-2xl font-bold mb-4">House rules</h1>
            <p className="text-gray-600 mb-6">
                Guests are expected to follow your rules and may be removed from Airbnb if they don't.
            </p>

            <div className="space-y-6 relative">
                
                {/* Maximum guests section */}
                <div className="py-4 border-t border-gray-200 shadow-md px-2">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Maximum guests</h3>
                        <div className="flex items-center">
                            <button
                                onClick={() => updateGuestCount(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300"
                            >
                                <FaMinus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="mx-4 font-medium">{guestCount}</span>
                            <button
                                onClick={() => updateGuestCount(true)}
                                className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300"
                            >
                                <FaPlus className="w-3 h-3 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">This is the maximum number of guests allowed per booking.</p>
                </div>

                {/* Pets allowed */}
                <div className="py-4 border-t border-gray-200 flex justify-between items-center shadow-md px-2">
                    <div>
                        <h3 className="font-medium">Pets allowed</h3>
                        <p className="text-sm text-gray-500">You can refuse pets, but must reasonably accommodate service animals.</p>
                        <button
                            onClick={() => setActiveView('petRules')}
                            className="text-sm text-blue hover:underline mt-1"
                        >
                            Learn more
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => toggleRule('pets')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${!ruleStates.pets ? 'bg-blue text-white' : 'border-gray-300'}`}
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => toggleRule('pets')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${ruleStates.pets ? 'bg-blue text-white' : 'border-gray-300'}`}
                        >
                            <FaCheck className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Max pets allowed - Only show when pets are allowed */}
                {ruleStates.pets && (
                    <div className="ml-4 p-4 bg-blue rounded-lg">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">Maximum number of pets allowed</h3>
                            <div className="flex items-center">
                                <button
                                    onClick={() => updateMaxPets(false)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-900"
                                >
                                    <FaMinus className="w-3 h-3 text-gray-600" />
                                </button>
                                <span className="mx-4 font-medium">{maxPets}</span>
                                <button
                                    onClick={() => updateMaxPets(true)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-900"
                                >
                                    <FaPlus className="w-3 h-3 text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Limit: 1-5 pets per booking</p>
                    </div>
                )}

                {/* Events allowed */}
                <div className="py-4 border-t border-gray-200 flex justify-between items-center shadow-md px-2">
                    <div>
                        <h3 className="font-medium">Events allowed</h3>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => toggleRule('events')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${!ruleStates.events ? 'bg-blue text-white' : 'border-gray-300'}`}
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => toggleRule('events')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${ruleStates.events ? 'bg-blue text-white' : 'border-gray-300'}`}
                        >
                            <FaCheck className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Smoking, vaping, e-cigarettes allowed */}
                <div className="py-4 border-t border-gray-200 flex justify-between items-center shadow-md px-2">
                    <div>
                        <h3 className="font-medium">Smoking, vaping, e-cigarettes allowed</h3>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => toggleRule('smoking')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${!ruleStates.smoking ? 'bg-blue text-white' : 'border-gray-300'}`}
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => toggleRule('smoking')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${ruleStates.smoking ? 'bg-blue text-white' : 'border-gray-300'}`}
                        >
                            <FaCheck className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Quiet hours */}
                <div className="py-4 border-t border-gray-200 flex justify-between items-start shadow-md px-2">
                    <div>
                        <h3 className="font-medium">Quiet hours</h3>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => toggleRule('quietHours')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${!ruleStates.quietHours ? 'bg-blue text-white' : 'border-gray-300'}`}
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => toggleRule('quietHours')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${ruleStates.quietHours ? 'bg-blue text-white' : 'border-gray-300'}`}
                        >
                            <FaCheck className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {ruleStates.quietHours && (
                    <div className="ml-4 bg-blue flex gap-4 mb-4 p-4 rounded-lg">
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-600 mb-1">Start time</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                value={quietHours.startTime}
                                onChange={(e) => updateQuietHours('startTime', e.target.value)}
                            >
                                <option value="9:00PM">9:00PM</option>
                                <option value="10:00PM">10:00PM</option>
                                <option value="11:00PM">11:00PM</option>
                                <option value="12:00AM">12:00AM</option>
                            </select>
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-600 mb-1">End time</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                value={quietHours.endTime}
                                onChange={(e) => updateQuietHours('endTime', e.target.value)}
                            >
                                <option value="6:00AM">6:00AM</option>
                                <option value="7:00AM">7:00AM</option>
                                <option value="8:00AM">8:00AM</option>
                                <option value="9:00AM">9:00AM</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Commercial photography and filming allowed */}
                <div className="py-4 border-t border-gray-200 flex justify-between items-center shadow-md px-2">
                    <div>
                        <h3 className="font-medium">Commercial photography and filming allowed</h3>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => toggleRule('commercial')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${!ruleStates.commercial ? 'bg-blue text-white' : 'border-gray-300'}`}
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => toggleRule('commercial')}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border ${ruleStates.commercial ? 'bg-blue text-white' : 'border-gray-300'}`}
                        >
                            <FaCheck className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default BookingRules;

 

