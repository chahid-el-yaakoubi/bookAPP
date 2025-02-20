import { useState } from 'react';
import { FaDollarSign, FaInfoCircle } from 'react-icons/fa';

const Pricing = () => {
    const [basePrice, setBasePrice] = useState('');
    const [weekendPrice, setWeekendPrice] = useState('');
    const [weeklyDiscount, setWeeklyDiscount] = useState('');
    const [monthlyDiscount, setMonthlyDiscount] = useState('');
    const [cleaningFee, setCleaningFee] = useState('');

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
            <p className="text-gray-600 mb-6">
                Set your pricing strategy to attract bookings.
            </p>

            <div className="space-y-6">
                {/* Base price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base price (per night)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaDollarSign className="text-gray-400" />
                        </div>
                        <input
                            type="number"
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            className="pl-8 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Weekend pricing */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weekend price (per night)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaDollarSign className="text-gray-400" />
                        </div>
                        <input
                            type="number"
                            value={weekendPrice}
                            onChange={(e) => setWeekendPrice(e.target.value)}
                            className="pl-8 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Discounts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weekly discount (%)
                        </label>
                        <input
                            type="number"
                            value={weeklyDiscount}
                            onChange={(e) => setWeeklyDiscount(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            placeholder="0"
                            max="100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monthly discount (%)
                        </label>
                        <input
                            type="number"
                            value={monthlyDiscount}
                            onChange={(e) => setMonthlyDiscount(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            placeholder="0"
                            max="100"
                        />
                    </div>
                </div>

                {/* Cleaning fee */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cleaning fee
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaDollarSign className="text-gray-400" />
                        </div>
                        <input
                            type="number"
                            value={cleaningFee}
                            onChange={(e) => setCleaningFee(e.target.value)}
                            className="pl-8 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Price tips */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                        <FaInfoCircle className="text-blue mt-1" />
                        <div>
                            <h3 className="font-medium mb-2">Pricing tips:</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                <li>Research similar properties in your area</li>
                                <li>Consider seasonal demand</li>
                                <li>Account for all your costs</li>
                                <li>Offer competitive discounts for longer stays</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing; 