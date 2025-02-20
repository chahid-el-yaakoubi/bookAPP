import { useState } from 'react';
import { FaCalendarTimes, FaPercentage, FaInfoCircle } from 'react-icons/fa';

const Cancellation = () => {
    const [selectedPolicy, setSelectedPolicy] = useState('');
    const [customRules, setCustomRules] = useState('');

    const policies = [
        {
            id: 'flexible',
            title: 'Flexible',
            refund: 'Full refund up to 24 hours before check-in',
            description: 'Guests can cancel up to 24 hours before check-in for a full refund.'
        },
        {
            id: 'moderate',
            title: 'Moderate',
            refund: 'Full refund up to 5 days before check-in',
            description: 'Guests can cancel up to 5 days before check-in for a full refund.'
        },
        {
            id: 'strict',
            title: 'Strict',
            refund: 'Full refund up to 14 days before check-in',
            description: 'Guests can cancel up to 14 days before check-in for a full refund.'
        },
        {
            id: 'non_refundable',
            title: 'Non-refundable',
            refund: 'No refunds',
            description: 'Bookings are non-refundable once confirmed.'
        }
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Cancellation Policy</h2>
            <p className="text-gray-600 mb-6">
                Choose a cancellation policy that works for you and your guests.
            </p>

            <div className="space-y-6">
                {/* Policy Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {policies.map((policy) => (
                        <button
                            key={policy.id}
                            onClick={() => setSelectedPolicy(policy.id)}
                            className={`p-4 border rounded-lg text-left transition-colors
                                ${selectedPolicy === policy.id
                                    ? 'border-blue bg-blue/5'
                                    : 'border-gray-200 hover:border-blue'}`}
                        >
                            <div className="font-medium mb-2">{policy.title}</div>
                            <div className="text-sm text-blue-600 mb-2">{policy.refund}</div>
                            <div className="text-sm text-gray-500">{policy.description}</div>
                        </button>
                    ))}
                </div>

                {/* Custom Rules */}
                <div>
                    <h3 className="text-lg font-medium mb-3">Additional Cancellation Rules</h3>
                    <textarea
                        value={customRules}
                        onChange={(e) => setCustomRules(e.target.value)}
                        placeholder="Add any additional cancellation rules or special conditions..."
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                    />
                </div>

                {/* Policy Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <FaInfoCircle className="w-5 h-5 text-blue mt-1" />
                        <div>
                            <h3 className="font-medium mb-2">Important Information:</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Cancellation policies are enforced automatically</li>
                                <li>Guests see the policy before booking</li>
                                <li>Special circumstances may require flexibility</li>
                                <li>Consider your market and competition when choosing a policy</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Refund Calculator */}
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-3">Refund Calculator</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">
                                Days before check-in
                            </label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg"
                                placeholder="Enter days"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">
                                Booking amount
                            </label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg"
                                placeholder="Enter amount"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm text-gray-600 mb-1">
                                Refund amount
                            </label>
                            <div className="p-2 bg-gray-100 rounded-lg text-center">
                                $0.00
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cancellation; 