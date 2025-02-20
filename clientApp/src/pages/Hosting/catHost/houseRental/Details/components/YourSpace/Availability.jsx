import { useState } from 'react';
import { FaCalendarAlt, FaClock, FaBan } from 'react-icons/fa';

const Availability = () => {
    const [minStay, setMinStay] = useState(1);
    const [maxStay, setMaxStay] = useState(30);
    const [checkInTime, setCheckInTime] = useState('15:00');
    const [checkOutTime, setCheckOutTime] = useState('11:00');
    const [blockedDates, setBlockedDates] = useState([]);
    const [advanceNotice, setAdvanceNotice] = useState('same_day');
    const [preparationTime, setPreparationTime] = useState(0);

    const advanceNoticeOptions = [
        { value: 'same_day', label: 'Same day' },
        { value: '24h', label: '24 hours' },
        { value: '48h', label: '48 hours' },
        { value: '3d', label: '3 days' },
        { value: '7d', label: '7 days' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Availability Settings</h2>
            <p className="text-gray-600 mb-6">
                Set your availability preferences and booking requirements.
            </p>

            <div className="space-y-6">
                {/* Stay duration */}
                <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium mb-4">Stay Duration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Minimum stay (nights)
                            </label>
                            <input
                                type="number"
                                value={minStay}
                                onChange={(e) => setMinStay(parseInt(e.target.value))}
                                min="1"
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Maximum stay (nights)
                            </label>
                            <input
                                type="number"
                                value={maxStay}
                                onChange={(e) => setMaxStay(parseInt(e.target.value))}
                                min={minStay}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Check-in/out times */}
                <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium mb-4">Check-in/out Times</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Check-in time
                            </label>
                            <input
                                type="time"
                                value={checkInTime}
                                onChange={(e) => setCheckInTime(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">
                                Check-out time
                            </label>
                            <input
                                type="time"
                                value={checkOutTime}
                                onChange={(e) => setCheckOutTime(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Advance notice */}
                <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium mb-4">Advance Notice</h3>
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">
                            How much notice do you need before a guest arrives?
                        </label>
                        <select
                            value={advanceNotice}
                            onChange={(e) => setAdvanceNotice(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            {advanceNoticeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Preparation time */}
                <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium mb-4">Preparation Time</h3>
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">
                            How much time do you need between guests?
                        </label>
                        <select
                            value={preparationTime}
                            onChange={(e) => setPreparationTime(parseInt(e.target.value))}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value={0}>No time needed</option>
                            <option value={1}>1 night</option>
                            <option value={2}>2 nights</option>
                            <option value={3}>3 nights</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Availability; 