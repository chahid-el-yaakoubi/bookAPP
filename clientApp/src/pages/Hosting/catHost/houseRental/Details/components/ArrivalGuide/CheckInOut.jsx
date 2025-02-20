import { useState } from 'react';
import { FaKey, FaClock, FaMapMarkedAlt, FaPhoneAlt, 
         FaUserFriends, FaLock } from 'react-icons/fa';

const CheckInOut = () => {
    const [checkInTime, setCheckInTime] = useState('15:00');
    const [checkOutTime, setCheckOutTime] = useState('11:00');
    const [checkInMethod, setCheckInMethod] = useState('self');
    const [keyLocation, setKeyLocation] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    const checkInMethods = [
        { id: 'self', label: 'Self check-in', icon: FaKey },
        { id: 'host', label: 'Meet the host', icon: FaUserFriends },
        { id: 'staff', label: 'Staff check-in', icon: FaUserFriends }
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Check-in & Checkout</h2>
            <p className="text-gray-600 mb-6">
                Provide clear instructions for your guests' arrival and departure.
            </p>

            <div className="space-y-6">
                {/* Check-in/out Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Check-in Time
                        </label>
                        <div className="relative">
                            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="time"
                                value={checkInTime}
                                onChange={(e) => setCheckInTime(e.target.value)}
                                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Check-out Time
                        </label>
                        <div className="relative">
                            <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="time"
                                value={checkOutTime}
                                onChange={(e) => setCheckOutTime(e.target.value)}
                                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                            />
                        </div>
                    </div>
                </div>

                {/* Check-in Method */}
                <div>
                    <h3 className="text-lg font-medium mb-3">Check-in Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {checkInMethods.map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setCheckInMethod(method.id)}
                                className={`p-4 border rounded-lg flex items-center gap-3
                                    ${checkInMethod === method.id
                                        ? 'border-blue bg-blue/5'
                                        : 'border-gray-200 hover:border-blue'}`}
                            >
                                <method.icon className="w-5 h-5 text-gray-600" />
                                <span>{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Key Location */}
                {checkInMethod === 'self' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Key Location
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={keyLocation}
                                onChange={(e) => setKeyLocation(e.target.value)}
                                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="e.g., Lockbox on front door, code: 1234"
                            />
                        </div>
                    </div>
                )}

                {/* Contact Information */}
                {(checkInMethod === 'host' || checkInMethod === 'staff') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Person
                            </label>
                            <div className="relative">
                                <FaUserFriends className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={contactPerson}
                                    onChange={(e) => setContactPerson(e.target.value)}
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                    placeholder="Name of host or staff member"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Phone
                            </label>
                            <div className="relative">
                                <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                    placeholder="Phone number"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Special Instructions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions
                    </label>
                    <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue min-h-[100px]"
                        placeholder="Add any special instructions for check-in or checkout..."
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckInOut; 