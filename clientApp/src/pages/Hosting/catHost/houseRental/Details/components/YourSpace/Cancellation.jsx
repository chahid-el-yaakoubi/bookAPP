import { useState, useEffect } from 'react';
import { Calendar, Percent, InfoIcon, MapPin, Check, AlertTriangle, RefreshCw, ChevronRight, Save } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions'; // Update the path as needed

const MoroccoCancellation = () => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);

    const [refundAmount, setRefundAmount] = useState(0);
    const [daysBeforeCheckIn, setDaysBeforeCheckIn] = useState('');
    const [bookingAmount, setBookingAmount] = useState('');
    const [selectedPolicyType, setSelectedPolicyType] = useState(selectedProperty?.cancellation?.policyType || 'standard');
    const [isSaving, setIsSaving] = useState(false);

    // Cancellation policy types
    const policyTypes = [
        { id: 'standard', name: 'Standard Policy', description: 'Default Morocco cancellation policy' },
        { id: 'flexible', name: 'Flexible Policy', description: 'More generous refund terms' },
        { id: 'strict', name: 'Strict Policy', description: 'Stricter cancellation terms' }
    ];

    // Cancellation policy tiers mapping
    const policyTiersMappings = {
        standard: [
            {
                days: 7,
                refundPercent: 100,
                label: "Flexible",
                description: "Full refund if cancelled at least 7 days before check-in"
            },
            {
                days: 1,
                refundPercent: 50,
                label: "Moderate",
                description: "50% refund if cancelled between 1-6 days before check-in"
            },
            {
                days: 0,
                refundPercent: 0,
                label: "Strict",
                description: "No refund if cancelled on check-in day"
            }
        ],
        flexible: [
            {
                days: 3,
                refundPercent: 100,
                label: "Very Flexible",
                description: "Full refund if cancelled at least 3 days before check-in"
            },
            {
                days: 1,
                refundPercent: 75,
                label: "Fairly Flexible",
                description: "75% refund if cancelled 1-2 days before check-in"
            },
            {
                days: 0,
                refundPercent: 25,
                label: "Day-of",
                description: "25% refund if cancelled on check-in day"
            }
        ],
        strict: [
            {
                days: 14,
                refundPercent: 100,
                label: "Early",
                description: "Full refund only if cancelled at least 14 days before check-in"
            },
            {
                days: 7,
                refundPercent: 50,
                label: "Mid-range",
                description: "50% refund if cancelled 7-13 days before check-in"
            },
            {
                days: 0,
                refundPercent: 0,
                label: "Late",
                description: "No refund if cancelled less than 7 days before check-in"
            }
        ]
    };

    const calculateRefund = () => {
        if (!daysBeforeCheckIn || !bookingAmount) {
            setRefundAmount(0);
            return;
        }

        const days = parseInt(daysBeforeCheckIn);
        const amount = parseFloat(bookingAmount);

        if (isNaN(days) || isNaN(amount)) {
            setRefundAmount(0);
            return;
        }

        // Get the selected policy tiers
        const policyTiers = policyTiersMappings[selectedPolicyType];
        
        // Find the applicable tier based on days before check-in
        let refundPercent = 0;
        for (const tier of policyTiers) {
            if (days >= tier.days) {
                refundPercent = tier.refundPercent;
                break;
            }
        }
        
        setRefundAmount((amount * refundPercent) / 100);
    };

    // Reset form fields
    const resetForm = () => {
        setDaysBeforeCheckIn('');
        setBookingAmount('');
        setRefundAmount(0);
    };

    // Save cancellation policy to Redux
    const handleSavePolicy = (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Get current policy tiers for the selected policy type
        const currentPolicyTiers = policyTiersMappings[selectedPolicyType];

        const updatedProperty = {
            ...selectedProperty,
            cancellation: {
                policyType: selectedPolicyType, // Ensure it's a valid ObjectId
                policyDetails: {
                  name: policyTypes.find(p => p.id === selectedPolicyType)?.name,
                  tiers: currentPolicyTiers,
                },
                lastUpdated: new Date().toISOString(),
            }
        }; 

        dispatch({
            type: UPDATE_PROPERTY,
            payload: { updatedProperty }
        });

        // Simulate API call completion
        setTimeout(() => {
            setIsSaving(false);
        }, 1000);
    };

    // Recalculate when inputs change or policy type changes
    useEffect(() => {
        calculateRefund();
    }, [daysBeforeCheckIn, bookingAmount, selectedPolicyType]);

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue to-amber-700 px-6 py-5">

                <div className="flex items-center">
                    <MapPin className="text-white mr-3 h-6 w-6" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">Morocco Cancellation Policy</h2>
                        <p className="text-amber-100 mt-1">
                            Official policy for properties in Morocco
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Policy Type Selection */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Cancellation Policy Type</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {policyTypes.map((policy) => (
                            <div 
                                key={policy.id}
                                onClick={() => setSelectedPolicyType(policy.id)}
                                className={`cursor-pointer border rounded-lg p-4 transition-all ${
                                    selectedPolicyType === policy.id 
                                        ? 'border-amber-500 bg-amber-50 shadow-sm' 
                                        : 'border-gray-200 hover:border-amber-200 hover:bg-amber-50/30'
                                }`}
                            >
                                <div className="flex items-start">
                                    <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center mr-3 mt-0.5 ${
                                        selectedPolicyType === policy.id 
                                            ? 'border-amber-500 bg-amber-500' 
                                            : 'border-gray-300'
                                    }`}>
                                        {selectedPolicyType === policy.id && (
                                            <Check size={12} className="text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{policy.name}</h4>
                                        <p className="mt-1 text-sm text-gray-600">{policy.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Policy Timeline with the currently selected policy */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Cancellation Timeline</h3>
                    
                    <div className="relative pt-5">
                        {/* Timeline line */}
                        <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-gray-200"></div>
                        
                        {/* Timeline events */}
                        {policyTiersMappings[selectedPolicyType].map((tier, index) => (
                            <div key={index} className="relative flex items-start mb-6">
                                <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center z-10 ${
                                    tier.refundPercent === 100 ? "bg-green-100" : 
                                    tier.refundPercent >= 50 ? "bg-amber-100" : 
                                    tier.refundPercent > 0 ? "bg-orange-100" : "bg-red-100"
                                }`}>
                                    <Calendar className={`h-5 w-5 ${
                                        tier.refundPercent === 100 ? "text-green-600" : 
                                        tier.refundPercent >= 50 ? "text-amber-600" : 
                                        tier.refundPercent > 0 ? "text-orange-600" : "text-red-600"
                                    }`} />
                                </div>
                                <div className="ml-4">
                                    <div className="flex items-center">
                                        <h4 className="text-md font-medium text-gray-900">{tier.label}</h4>
                                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                            tier.refundPercent === 100 ? "bg-green-100 text-green-800" : 
                                            tier.refundPercent >= 50 ? "bg-amber-100 text-amber-800" : 
                                            tier.refundPercent > 0 ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"
                                        }`}>
                                            {tier.refundPercent}% refund
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">{tier.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Refund Calculator */}
                <div className="border border-gray-200 rounded-lg p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Percent className="mr-2 text-amber-600" size={20} />
                        Refund Calculator
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Days before check-in
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="Enter days"
                                value={daysBeforeCheckIn}
                                onChange={(e) => setDaysBeforeCheckIn(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Booking amount (MAD)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="Enter amount"
                                value={bookingAmount}
                                onChange={(e) => setBookingAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Refund amount
                            </label>
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
                                <span className="font-semibold text-gray-800">MAD {refundAmount.toFixed(2)}</span>
                                
                                {refundAmount > 0 && bookingAmount && (
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        refundAmount === parseFloat(bookingAmount) ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                                    }`}>
                                        {refundAmount === parseFloat(bookingAmount) ? "Full refund" : "Partial refund"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Responsive Refund Status */}
                    {(daysBeforeCheckIn !== '' && bookingAmount !== '') && (
                        <div className="mt-4 p-3 rounded-lg flex items-center gap-2 bg-gray-50 border border-gray-200">
                            {refundAmount > 0 ? (
                                <Check size={18} className="text-green-500" />
                            ) : (
                                <AlertTriangle size={18} className="text-red-500" />
                            )}
                            <p className="text-sm text-gray-700">
                                {refundAmount > 0 
                                    ? `${refundAmount === parseFloat(bookingAmount) ? 'Full' : 'Partial'} refund of MAD ${refundAmount.toFixed(2)} is available using the ${
                                        policyTypes.find(p => p.id === selectedPolicyType).name
                                    }`
                                    : 'No refund is available for this cancellation period'}
                            </p>
                        </div>
                    )}
                </div>

               

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button 
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset Calculator
                    </button>
                    <button 
                        onClick={handleSavePolicy}
                        disabled={isSaving}
                        className={`px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Policy
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoroccoCancellation;