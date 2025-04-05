import { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_PROPERTY, updateProperty } from '../../../../../../../redux/actions/propertyActions'; // Update the path as needed

const Availability = ({ hotelId }) => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initialize state from Redux store or with defaults
    const [minimumNights, setMinimumNights] = useState(
        selectedProperty?.available?.tripLength?.minimumNights || 1
    );
    const [maximumNights, setMaximumNights] = useState(
        selectedProperty?.available?.tripLength?.maximumNights || 365
    );
    const [advanceNotice, setAdvanceNotice] = useState(
        selectedProperty?.available?.advanceNotice?.noticeRequired || '7d'
    );
    const [allowExceptions, setAllowExceptions] = useState(
        selectedProperty?.available?.advanceNotice?.allowExceptions !== false
    );

    // Reset form if hotel data changes
    useEffect(() => {
        if (selectedProperty?.available) {
            setMinimumNights(selectedProperty.available.tripLength?.minimumNights || 1);
            setMaximumNights(selectedProperty.available.tripLength?.maximumNights || 365);
            setAdvanceNotice(selectedProperty.available.advanceNotice?.noticeRequired || '7d');
            setAllowExceptions(selectedProperty.available.advanceNotice?.allowExceptions !== false);
        }
    }, [selectedProperty]);

    const advanceNoticeOptions = [
        { value: 'same_day', label: 'Same day' },
        { value: '24h', label: '24 hours' },
        { value: '48h', label: '48 hours' },
        { value: '3d', label: '3 days' },
        { value: '7d', label: '7 days' },
    ];

    const handleAdvanceNoticeChange = (e) => {
        setAdvanceNotice(e.target.value);
    };

    const handleToggleExceptions = () => {
        setAllowExceptions(!allowExceptions);
    };

    const handleSave = () => {
        // Validate minimum is less than maximum
        if (minimumNights > maximumNights) {
            alert('Minimum nights cannot be greater than maximum nights');
            return;
        }



        const updatedProperty = {
            ...selectedProperty,
            available: {
                tripLength: {
                    minimumNights,
                    maximumNights
                },
                advanceNotice: {
                    noticeRequired: advanceNotice,
                    allowExceptions
                }
            }
        };

        dispatch({
            type: UPDATE_PROPERTY,
            payload: { updatedProperty }
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-2">Availability</h1>
            <p className="text-gray-600 mb-8">
                These settings apply to all nights, unless you customize them by date.
            </p>

            {/* Display error if any */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Trip length section */}
            <div className="mb-8">
                <h2 className="text-lg font-medium mb-4">Trip length</h2>
                <div className="border rounded-lg overflow-hidden">
                    <div className="border-b p-4">
                        <label className="block text-sm text-gray-600 mb-1">
                            Minimum nights
                        </label>
                        <input
                            type="number"
                            value={minimumNights}
                            onChange={(e) => setMinimumNights(parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-full text-xl font-medium focus:outline-none"
                        />
                    </div>
                    <div className="p-4">
                        <label className="block text-sm text-gray-600 mb-1">
                            Maximum nights
                        </label>
                        <input
                            type="number"
                            value={maximumNights}
                            onChange={(e) => setMaximumNights(parseInt(e.target.value) || minimumNights)}
                            min={minimumNights}
                            className="w-full text-xl font-medium focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Advance notice section */}
            <div className="mb-8">
                <h2 className="text-lg font-medium mb-2">Advance notice</h2>
                <p className="text-gray-600 mb-4">
                    How much notice do you need between a guest's booking and their arrival?
                </p>

                {/* Select with custom styling */}
                <div className="relative mb-4">
                    <select
                        value={advanceNotice}
                        onChange={handleAdvanceNoticeChange}
                        className="block w-full py-3 px-4 pr-8 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    >
                        {advanceNoticeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>

                {/* Toggle for exceptions */}
                <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">Allow requests with less than {advanceNoticeOptions.find(opt => opt.value === advanceNotice)?.label.toLowerCase()} notice</p>
                            <p className="text-gray-600 text-sm">You'll review and approve each reservation request.</p>
                        </div>
                        <button
                            onClick={handleToggleExceptions}
                            className="flex items-center"
                            aria-label={allowExceptions ? "Disable exceptions" : "Enable exceptions"}
                        >
                            {allowExceptions ? (
                                <div className="w-12 h-6 bg-black rounded-full flex items-center justify-end p-1">
                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            ) : (
                                <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center p-1">
                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar link button */}
            <div className="bg-gray-100 rounded-lg p-4 mb-16">
                <button className="flex items-center text-black font-medium">
                    <FaCalendarAlt className="mr-2" />
                    Find more availability settings like these in the calendar
                </button>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
                <button
                    className="bg-black text-white px-6 py-2 rounded-lg font-medium"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
};

export default Availability;