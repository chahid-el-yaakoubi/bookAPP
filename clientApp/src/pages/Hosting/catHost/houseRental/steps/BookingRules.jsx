const BookingRules = ({ propertyData, setPropertyData }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Set your booking rules</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Time
                    </label>
                    <input
                        type="time"
                        value={propertyData.booking_policy.check_in}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            booking_policy: { ...propertyData.booking_policy, check_in: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Time
                    </label>
                    <input
                        type="time"
                        value={propertyData.booking_policy.check_out}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            booking_policy: { ...propertyData.booking_policy, check_out: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cancellation Policy
                </label>
                <select
                    value={propertyData.booking_policy.cancellation_policy}
                    onChange={(e) => setPropertyData({
                        ...propertyData,
                        booking_policy: { ...propertyData.booking_policy, cancellation_policy: e.target.value }
                    })}
                    className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                >
                    <option value="Flexible">Flexible</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Strict">Strict</option>
                </select>
            </div>

            <div className="space-y-2">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="pets-allowed"
                        checked={propertyData.booking_policy.pets_allowed}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            booking_policy: { ...propertyData.booking_policy, pets_allowed: e.target.checked }
                        })}
                        className="h-4 w-4 text-blue border-gray-300 rounded focus:ring-blue"
                    />
                    <label htmlFor="pets-allowed" className="ml-2 text-sm text-gray-700">
                        Pets Allowed
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="smoking-allowed"
                        checked={propertyData.booking_policy.smoking_allowed}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            booking_policy: { ...propertyData.booking_policy, smoking_allowed: e.target.checked }
                        })}
                        className="h-4 w-4 text-blue border-gray-300 rounded focus:ring-blue"
                    />
                    <label htmlFor="smoking-allowed" className="ml-2 text-sm text-gray-700">
                        Smoking Allowed
                    </label>
                </div>
            </div>
        </div>
    );
};

export default BookingRules; 