import { useState } from 'react';
import { FaUser, FaBed, FaBath, FaCouch } from 'react-icons/fa';

const Guests = () => {
    const [maxGuests, setMaxGuests] = useState(1);
    const [bedrooms, setBedrooms] = useState(1);
    const [beds, setBeds] = useState(1);
    const [bathrooms, setBathrooms] = useState(1);
    const [allowInfants, setAllowInfants] = useState(true);
    const [allowPets, setAllowPets] = useState(false);

    const Counter = ({ value, onChange, min = 1, max = 50, label, icon: Icon }) => (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-500" />
                <span>{label}</span>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onChange(Math.max(min, value - 1))}
                    className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                    disabled={value <= min}
                >
                    -
                </button>
                <span className="w-8 text-center">{value}</span>
                <button
                    onClick={() => onChange(Math.min(max, value + 1))}
                    className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
                    disabled={value >= max}
                >
                    +
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Guest Capacity</h2>
            <p className="text-gray-600 mb-6">
                Define how many guests your property can accommodate.
            </p>

            <div className="space-y-4">
                <Counter
                    value={maxGuests}
                    onChange={setMaxGuests}
                    label="Maximum guests"
                    icon={FaUser}
                />
                <Counter
                    value={bedrooms}
                    onChange={setBedrooms}
                    label="Bedrooms"
                    icon={FaBed}
                />
                <Counter
                    value={beds}
                    onChange={setBeds}
                    label="Beds"
                    icon={FaCouch}
                />
                <Counter
                    value={bathrooms}
                    onChange={setBathrooms}
                    label="Bathrooms"
                    icon={FaBath}
                    min={0.5}
                    max={10}
                />

                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">Allow infants</h3>
                            <p className="text-sm text-gray-500">Under 2 years</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={allowInfants}
                                onChange={(e) => setAllowInfants(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">Allow pets</h3>
                            <p className="text-sm text-gray-500">Additional cleaning fees may apply</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={allowPets}
                                onChange={(e) => setAllowPets(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Guests; 