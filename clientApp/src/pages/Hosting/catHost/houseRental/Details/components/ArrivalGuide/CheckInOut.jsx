import { useState } from 'react';
import { FaChevronDown, FaSave } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { selectProperty, UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions'; // Update the path as needed
import { LuCircleArrowLeft } from 'react-icons/lu';
import { updateProperty } from '../../../../../../../Lib/api';


const CheckInOut = ({ onclose, help }) => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property?.selectedProperty);

    console.log(selectedProperty)
    // Initialize times from Redux state if available
    const initialTimes = selectedProperty?.policies?.checkInOutTimes || {
        checkInWindow: {
            start: '3:00PM',
            endTime: '8:00PM'
        },
        end: '11:00AM'
    };

    console.log(initialTimes)

    const [checkInStartTime, setCheckInStartTime] = useState(initialTimes?.checkInWindow?.start);
    const [checkInEndTime, setCheckInEndTime] = useState(initialTimes?.checkInWindow?.end);
    const [checkoutTime, setCheckoutTime] = useState(initialTimes?.checkoutTime);
    const [showStartTimeOptions, setShowStartTimeOptions] = useState(false);
    const [showEndTimeOptions, setShowEndTimeOptions] = useState(false);
    const [showCheckoutTimeOptions, setShowCheckoutTimeOptions] = useState(false);
    const [isStartTimeFlexible, setIsStartTimeFlexible] = useState(checkInStartTime === 'Flexible');
    const [isEndTimeFlexible, setIsEndTimeFlexible] = useState(checkInEndTime === 'Flexible');
    const [isSaving, setIsSaving] = useState(false);

    // Generate time options (12-hour format with AM/PM)
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            const period = hour < 12 ? 'AM' : 'PM';
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

            // Full hours
            times.push(`${displayHour}:00${period}`);
            // Half hours
            //   times.push(`${displayHour}:30${period}`);
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    // Generate time options with Flexible
    const generateFlexibleTimeOptions = () => {
        const times = [...timeOptions];
        // Add "Flexible" option to the beginning of the array
        times.unshift("Flexible");
        return times;
    };

    const flexibleTimeOptions = generateFlexibleTimeOptions();

    // Handle start time selection
    const handleStartTimeSelection = (time) => {
        setCheckInStartTime(time);
        setShowStartTimeOptions(false);

       
    };

    // Handle end time selection
    const handleEndTimeSelection = (time) => {
        setCheckInEndTime(time);
        setShowEndTimeOptions(false);

        // If "Flexible" is selected, set the flag
        if (time === "Flexible") {
            setIsEndTimeFlexible(true);
            console.log("End time set to Flexible.");
        } else {
            setIsEndTimeFlexible(false);
            console.log(`End time set to: ${time}`);
        }
    };

    // Handle checkout time selection
    const handleCheckoutTimeSelection = (time) => {
        setCheckoutTime(time);
        setShowCheckoutTimeOptions(false);
    };

    // Handle save with dispatch
    const handleSave = async () => {
      


        setIsSaving(true);

        // Create updated property data
        const updatedProperty = {
            policies: {
                ...selectedProperty?.policies,
                checkInOutTimes: {
                    checkInWindow: {
                        start: checkInStartTime,
                        end: checkInEndTime,
                        isFlexibleStart: isStartTimeFlexible,
                        isFlexibleEnd: isEndTimeFlexible
                    },
                    checkoutTime: checkoutTime
                }
            }
        };

      

        const res = await updateProperty(selectedProperty?._id, updatedProperty);

        if (res.status === 200) {
            dispatch(selectProperty(res.data));
            setIsSaving(false);

        }

        

        // Simulate saving process delay
        setTimeout(() => {
            if (help) {
                onclose(false);
            }
        }, 2000);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            
            {help ? <LuCircleArrowLeft onClick={() => { onclose(true) }} className="w-6 h-6 text-blue cursor-pointer hover:bg-black rounded-full" /> : null}
            <h2 className="text-2xl font-bold mb-6 ">Check-in and checkout times</h2>

            {/* Check-in window section */}
            <div className="mb-6">
                <h3 className="text-base font-medium mb-2">Check-in window</h3>

                {/* Start time dropdown with Flexible option */}
                <div className="mb-2 relative">
                    <label className="text-sm text-gray-500 mb-1 block">Start time</label>
                    <div
                        className="border border-gray-300 rounded p-3 flex justify-between items-center cursor-pointer"
                        onClick={() => setShowStartTimeOptions(!showStartTimeOptions)}
                    >
                        <span>{checkInStartTime}</span>
                        <FaChevronDown className="text-gray-400" />
                    </div>

                    {showStartTimeOptions && (
                        <div className="absolute z-30 mt-1 w-full bg-white border border-gray-300 rounded max-h-[60vh] overflow-y-auto shadow-lg">
                            {flexibleTimeOptions.map((time) => (
                                <div
                                    key={time}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleStartTimeSelection(time)}
                                >
                                    {time}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* End time dropdown with Flexible option */}
                <div className="relative">
                    <label className="text-sm text-gray-500 mb-1 block">End time</label>
                    <div
                        className="border border-gray-300 rounded p-3 flex justify-between items-center cursor-pointer"
                        onClick={() => setShowEndTimeOptions(!showEndTimeOptions)}
                    >
                        <span>{checkInEndTime}</span>
                        <FaChevronDown className="text-gray-400" />
                    </div>

                    {showEndTimeOptions && (
                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded max-h-[50vh] overflow-y-auto shadow-lg">
                            {flexibleTimeOptions.map((time) => (
                                <div
                                    key={time}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleEndTimeSelection(time)}
                                >
                                    {time}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Checkout time section */}
            <div className="mb-6">
                <h3 className="text-base font-medium mb-2">Checkout time</h3>
                <div className="relative">
                    <label className="text-sm text-gray-500 mb-1 block">Select time</label>
                    <div
                        className="border border-gray-300 rounded p-3 flex justify-between items-center cursor-pointer"
                        onClick={() => setShowCheckoutTimeOptions(!showCheckoutTimeOptions)}
                    >
                        <span>{checkoutTime}</span>
                        <FaChevronDown className="text-gray-400" />
                    </div>

                    {showCheckoutTimeOptions && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded max-h-[40vh] overflow-y-auto shadow-lg">
                            {timeOptions.map((time) => (
                                <div
                                    key={time}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleCheckoutTimeSelection(time)}
                                >
                                    {time}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Save button */}
            <div className="mt-6">
                <button
                    className="flex items-center justify-center bg-blue text-white px-4 py-2 rounded hover:bg-blue"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    <FaSave className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save times'}
                </button>
            </div>
        </div>
    );
};

export default CheckInOut;