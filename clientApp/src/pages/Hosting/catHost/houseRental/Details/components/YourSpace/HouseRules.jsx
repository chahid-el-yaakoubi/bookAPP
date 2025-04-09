import { useState, useEffect } from 'react';
import { FaChevronRight, FaMinus, FaPlus, FaCheck, FaTimes, FaSave } from 'react-icons/fa';
import { UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions'; // Update the path as needed
import { useDispatch, useSelector } from 'react-redux';

const HouseRules = () => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);
    
    const [isSaving, setIsSaving] = useState(false);
    const [ruleStates, setRuleStates] = useState({
        pets: false,
        events: false,
        smoking: false,
        quietHours: false,
        commercial: false
    });

    const [maxPets, setMaxPets] = useState(1); // Default max pets to 2

    const [quietHours, setQuietHours] = useState({
        startTime: '11:00PM',
        endTime: '7:00AM'
    });

    const [guestCount, setGuestCount] = useState(0);
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

    // Load data from selectedProperty on component mount
    useEffect(() => {
        if (selectedProperty?.policies?.rules) {
            const rules = selectedProperty.policies.rules;
            
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
        }
        
        // Initialize check-in/checkout times
        if (selectedProperty?.policies?.checkInOutTimes) {
            const times = selectedProperty.policies.checkInOutTimes;
            setCheckInOutTimes({
                checkInWindow: {
                    startTime: times?.checkInWindow?.start ?? '3:00PM',
                    endTime: times?.checkInWindow?.end ?? '8:00PM'
                },
                checkoutTime: times?.checkoutTime ?? '11:00AM'
            });
        }
        
        // Initialize guest count
        if (selectedProperty?.policies?.rules?.max_guests) {
            setGuestCount(selectedProperty?.policies.rules.max_guests);
        }
    }, [selectedProperty]);

    // Toggle rule status
    const toggleRule = (rule) => {
        setRuleStates({
            ...ruleStates,
            [rule]: !ruleStates[rule]
        });
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
        setQuietHours({
            ...quietHours,
            [type]: value
        });
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

    // Get all rules data (for saving)
    const getAllRulesData = () => {
        // Format the data according to the MongoDB schema
        const formattedData = {
            policies: {
                checkInOutTimes: {
                    checkInWindow: {
                        start: checkInOutTimes.checkInWindow.startTime,
                        end: checkInOutTimes.checkInWindow.endTime
                    },
                    checkoutTime: checkInOutTimes.checkoutTime
                },
                rules: {
                    ...selectedProperty?.policies?.rules,
                    commercial: ruleStates.commercial ? 'allowed' : 'not_allowed',
                    events: ruleStates.events ? 'allowed' : 'not_allowed',
                    smoking: ruleStates.smoking ? 'allowed' : 'not_allowed',
                    pets: {
                        allowed: ruleStates.pets,
                        maxCount: ruleStates.pets ? maxPets : 0  // Save the max pets count
                    },
                    quietHours: {
                        pending: ruleStates.quietHours,
                        startTime: quietHours.startTime,
                        endTime: quietHours.endTime
                    },
                    additionalRules: additionalRules
                }
            },
          
        };

        setIsSaving(true);

        // Create updated property data
        const updatedProperty = {
            ...selectedProperty,
            ...formattedData
        };
        
        // Dispatch update action
        dispatch({
            type: UPDATE_PROPERTY,
            payload: { updatedProperty }
        });

        // Simulate saving process delay
        setTimeout(() => {
            setIsSaving(false);
        }, 2000);
    };

    // Render different views based on activeView state
    if (activeView === 'checkInOut') {
        return (
             <CheckInOut onclose={setActiveView} help={true} />
        );
    }

    if (activeView === 'petRules') {
        return (
            <PetRulesInfo
                onBack={() => setActiveView('main')}
            />
        );
    }

    // Main view
    return (
        <div className="shadow-xl md:p-20 mx-auto  mb-10">
            <h1 className="text-2xl font-bold mb-4">House rules</h1>
            <p className="text-gray-600 mb-6">
                Guests are expected to follow your rules and may be removed from Airbnb if they don't.
            </p>

            <div className="space-y-6 relative">
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
                    <div className="ml-4 p-4 bg-blue/30 rounded-lg">
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
                <div className="py-4 border-t border-gray-200 flex justify-between items-start shadow-md">
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
                    <div className="ml-4 bg-blue/30 flex gap-4 mb-4 p-4">
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
                {/* Additional rules */}
                <div className="py-4 border-t border-gray-900 bg-primary/30 p-2 ">
                    <div className="flex justify-between items-center shadow-md px-2 mb-2">
                        <div>
                            <h3 className="font-medium">Additional rules</h3>
                            <p className="text-sm text-gray-500">Share anything else you expect from guests.</p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newRule}
                                onChange={(e) => setNewRule(e.target.value)}
                                placeholder="Add a custom rule"
                                className="flex-1 p-3 border border-gray-300 rounded-lg"
                            />
                            <button
                                onClick={addCustomRule}
                                className="px-4 py-2 bg-blue text-white rounded-lg"
                            >
                                Add
                            </button>
                        </div>

                        {additionalRules.length > 0 && (
                            <div className="space-y-2 mt-4">
                                {additionalRules.map((rule, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <span>{rule}</span>
                                        <button
                                            onClick={() => {
                                                const newRules = [...additionalRules];
                                                newRules.splice(index, 1);
                                                setAdditionalRules(newRules);
                                            }}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Save button */}
                <div className="mt-10 flex justify-end gap-4 bg-primary p-4 fixed bottom-10 right-[10%] rounded">
                    <button
                        onClick={() => getAllRulesData()}
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue text-white rounded-lg hover:bg-blue flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <span className="animate-spin mr-2">⟳</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaSave size={16} />
                                Save Rules
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HouseRules;


// check out an dcheck in module
import { FaChevronLeft } from 'react-icons/fa';

export const CheckInCheckoutTimes = ({ onBack, onSave }) => {
    const [checkInWindow, setCheckInWindow] = useState({
        startTime: '3:00PM',
        endTime: '8:00PM'
    });

    const [checkoutTime, setCheckoutTime] = useState('11:00AM');

    const timeOptions = {
        morning: ['6:00AM', '7:00AM', '8:00AM', '9:00AM', '10:00AM', '11:00AM', '12:00PM'],
        afternoon: ['1:00PM', '2:00PM', '3:00PM', '4:00PM', '5:00PM'],
        evening: ['6:00PM', '7:00PM', '8:00PM', '9:00PM', '10:00PM', '11:00PM']
    };

    const updateCheckInWindow = (type, value) => {
        setCheckInWindow({
            ...checkInWindow,
            [type]: value
        });
        console.log(`Check-in window ${type} updated to: ${value}`);
    };

    const updateCheckoutTime = (value) => {
        setCheckoutTime(value);
        console.log(`Checkout time updated to: ${value}`);
    };

    const handleSave = () => {
        const timesData = {
            checkInWindow,
            checkoutTime
        };
        console.log('Saving check-in and checkout times:', timesData);
        if (onSave) onSave(timesData);
    };

    return (
        <div className="max-w-3xl mx-auto p-6  ">
            <div  className="flex items-center mb-6 ">
                <button
                    onClick={onBack}
                    className="mr-4 text-gray-600"
                >
                    <FaChevronLeft className="w-4 h-4" />
                </button>
                <h1 className="text-2xl font-bold">Check-in and checkout times</h1>
            </div>

            {/* Check-in window */}
            <div className="mb-8">
                <h3 className="font-medium mb-4">Check-in window</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Start time</label>
                        <div className="relative">
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg appearance-none"
                                value={checkInWindow.startTime}
                                onChange={(e) => updateCheckInWindow('startTime', e.target.value)}
                            >
                                {[...timeOptions.morning, ...timeOptions.afternoon, ...timeOptions.evening].map(time => (
                                    <option key={`start-${time}`} value={time}>{time}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600 mb-1">End time</label>
                        <div className="relative">
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg appearance-none"
                                value={checkInWindow.endTime}
                                onChange={(e) => updateCheckInWindow('endTime', e.target.value)}
                            >
                                {[...timeOptions.morning, ...timeOptions.afternoon, ...timeOptions.evening].map(time => (
                                    <option key={`end-${time}`} value={time}>{time}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout time */}
            <div className="mb-8">
                <h3 className="font-medium mb-4">Checkout time</h3>
                <div className="relative">
                    <select
                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none"
                        value={checkoutTime}
                        onChange={(e) => updateCheckoutTime(e.target.value)}
                    >
                        <option value="" disabled>Select time</option>
                        {[...timeOptions.morning, ...timeOptions.afternoon].map(time => (
                            <option key={`checkout-${time}`} value={time}>{time}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Info section */}
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <p className="text-gray-600 text-sm">
                    Setting realistic check-in and checkout times helps set expectations with your guests and
                    gives you enough time to clean and prepare for the next guest.
                </p>
            </div>

            {/* Save button */}
            <div className="py-4 border-t border-gray-200">
                <button
                    onClick={handleSave}
                    className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                    Save to add
                </button>
            </div>
        </div>
    );
};



// rules
import { FaPaw, FaDog, FaCat, FaFeather, FaFish } from 'react-icons/fa';
import CheckInOut from '../ArrivalGuide/CheckInOut';

export const PetRulesInfo = ({ onBack }) => {
    const petPolicies = [
        {
            id: 'service',
            title: 'Service animals',
            description: `Service animals aren't pets, so they aren't subject to pet restrictions. You're required to accommodate service animals even if your listing doesn't allow pets.`,
            icon: FaDog
        },
        {
            id: 'emotional',
            title: 'Emotional support animals',
            description: `In some locations, emotional support animals have the same legal protections as service animals. In other places, they're treated the same as pets.`,
            icon: FaCat
        },
        {
            id: 'types',
            title: 'Pet types',
            description: 'You can choose to only welcome certain types of pets (for example, only dogs). Make sure to specify this in your listing description.',
            icon: FaPaw
        },
        {
            id: 'size',
            title: 'Pet size and breeds',
            description: 'You can set limits on pet size and restrict certain breeds, but check your local laws first as some locations prohibit breed discrimination.',
            icon: FaDog
        },
        {
            id: 'fees',
            title: 'Pet fees',
            description: 'You can charge extra fees for guests with pets to cover additional cleaning or potential damage. Add this as a separate fee when setting up your listing.',
            icon: FaFish
        },
        {
            id: 'rules',
            title: 'Specific pet rules',
            description: 'You can set specific rules for pets such as keeping them off furniture, crating when left alone, or cleaning up waste. Add these to your house rules.',
            icon: FaFeather
        }
    ];

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center mb-6">
                <button
                    onClick={onBack}
                    className="mr-4 text-gray-600"
                >
                    <FaChevronLeft className="w-4 h-4" />
                </button>
                <h1 className="text-2xl font-bold">Pet policies</h1>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                    When you allow pets in your property, you can set specific guidelines for your guests to follow.
                    Here's what you need to know about pet policies on Airbnb.
                </p>
            </div>

            <div className="space-y-6">
                {petPolicies.map(policy => (
                    <div key={policy.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0 bg-gray-100 rounded-full p-3">
                            <policy.icon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                            <h3 className="font-medium mb-1">{policy.title}</h3>
                            <p className="text-gray-600 text-sm">{policy.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-blue/30 border border-blue p-4 rounded-lg">
                <h3 className="font-medium text-black mb-2">Important note about service animals</h3>
                <p className="text-black text-sm">
                    Local laws in many regions require hosts to accept service animals regardless of their general pet policy.
                    Declining a booking due to a service animal may result in penalties or removal from the platform.
                </p>
            </div>

            <div className="py-4 mt-6">
                <button
                    onClick={onBack}
                    className="w-full py-3 bg-blue text-white rounded-lg hover:bg-gray-800"
                >
                    Back to house rules
                </button>
            </div>
        </div>
    );
};
