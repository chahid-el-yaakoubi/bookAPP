import { useEffect, useState } from 'react';
import { FaDollarSign, FaInfoCircle, FaSave, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { selectProperty, UPDATE_PROPERTY } from '../../../../../../../redux/actions/propertyActions';
import { useDispatch, useSelector } from 'react-redux';
import { updateProperty } from '../../../../../../../Lib/api';

const Pricing = () => {
    const dispatch = useDispatch();
    const selectedProperty = useSelector(state => state.property.selectedProperty);

    const [basePrice, setBasePrice] = useState(selectedProperty?.pricing?.nightly_rate || 0);
    const [weekendPrice, setWeekendPrice] = useState(selectedProperty?.pricing?.Weekend_price || 0);
    const [weeklyDiscount, setWeeklyDiscount] = useState(selectedProperty?.pricing?.discounts?.weekly_discount || 0);
    const [monthlyDiscount, setMonthlyDiscount] = useState(selectedProperty?.pricing?.discounts?.monthly_discount || 0);
    const [smartPricing, setSmartPricing] = useState(selectedProperty?.pricing?.smart_pricing?.enabled || false);
    const [minPrice, setMinPrice] = useState(selectedProperty?.pricing?.smart_pricing?.min || 0);
    const [maxPrice, setMaxPrice] = useState(selectedProperty?.pricing?.smart_pricing?.max || 0);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({
        weekly: '',
        monthly: ''
    });

    // Check for validation errors after discount changes
    useEffect(() => {
        const newErrors = { weekly: '', monthly: '' };

        // Validate weekly discount
        if (Number(weeklyDiscount) > 20) {
            newErrors.weekly = 'Warning: Weekly discount above 20% may reduce bookings';
        }

        // Validate monthly discount
        if (Number(monthlyDiscount) > 49) {
            newErrors.monthly = 'Error: Monthly discount cannot exceed 49%';
        }

        // Validate weekly vs monthly
        if (Number(weeklyDiscount) > Number(monthlyDiscount) && Number(monthlyDiscount) > 0) {
            newErrors.weekly = 'Error: This discount must be less than or equal to your monthly (4 weeks) trip length discount of ' + monthlyDiscount + '%';
        }

        setErrors(newErrors);
    }, [weeklyDiscount, monthlyDiscount]);

    const handleSave = async (e) => {
        setIsSaving(true);
        e.preventDefault();


        const updatedProperty = {
            pricing: {
                nightly_rate: basePrice,
                Weekend_price: weekendPrice,
                discounts: {
                    weekly_discount: weeklyDiscount,
                    monthly_discount: monthlyDiscount
                },
                smart_pricing: {
                    enabled: smartPricing,
                    min: minPrice,
                    max: maxPrice
                }
            }
        };

        const res = await updateProperty(selectedProperty?._id, updatedProperty);

        // Show success message and reset saving state
        if (res.status === 200) {
            dispatch(selectProperty(res.data));
            setIsSaving(false)


           
        } else {
            (err) => {
                console.error(err)
            }
        }

        // Simulate API call delay
        
    };

    const toggleSmartPricing = () => {
        setSmartPricing(!smartPricing);
    };

    const removeWeekendPrice = () => {
        setWeekendPrice('');
    };

    const calculateWeeklyAverage = () => {
        const nightlyRate = Number(basePrice);
        const weekendRate = Number(weekendPrice) || nightlyRate;
        const weeklyDiscounta = Number(weeklyDiscount) / 100 || 0;

        // 5 weekdays + 2 weekend days
        const total = (nightlyRate * 5) + (weekendRate * 2);
        const discountedTotal = total * (1 - weeklyDiscounta);
        return Math.round(discountedTotal);
    };

    const calculateMonthlyAverage = () => {
        const nightlyRate = Number(basePrice);
        const weekendRate = Number(weekendPrice) || nightlyRate;
        const monthlyDiscounta = Number(monthlyDiscount) / 100 || 0;

        // Simplified calculation: ~30 days, with ~8 weekend days
        const total = (nightlyRate * 22) + (weekendRate * 8);
        const discountedTotal = total * (1 - monthlyDiscounta);
        return Math.round(discountedTotal);
    };

    const incrementDiscount = (type) => {
        if (type === 'weekly') {
            setWeeklyDiscount(prev => Math.min(Number(prev) + 1, 99));
        } else {
            setMonthlyDiscount(prev => Math.min(Number(prev) + 1, 99));
        }
    };

    const decrementDiscount = (type) => {
        if (type === 'weekly') {
            setWeeklyDiscount(prev => Math.max(Number(prev) - 1, 0));
        } else {
            setMonthlyDiscount(prev => Math.max(Number(prev) - 1, 0));
        }
    };

    const hasErrors = () => {
        return errors.weekly.includes('Error:') || errors.monthly.includes('Error:') ||
            Number(monthlyDiscount) > 49;
    };

    const weeklyAverage = calculateWeeklyAverage();
    const monthlyAverage = calculateMonthlyAverage();

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Pricing</h1>
            <p className="text-gray-600 mb-6">
                These settings apply to all nights, unless you customise them by date.
                <a href="#" className="text-blue ml-1 hover:underline">Learn more</a>
            </p>

            <div className="space-y-8">
                {/* Nightly price section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Nightly price</h2>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Smart Pricing</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={smartPricing}
                                    onChange={toggleSmartPricing}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                        </div>
                    </div>

                    {smartPricing ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum price
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">MAD</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="pl-14 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                        placeholder="Min"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum price
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">MAD</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="pl-14 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">MAD</span>
                            </div>
                            <input
                                type="number"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                                className="pl-14 w-full p-4 border rounded-lg text-2xl focus:ring-2 focus:ring-blue focus:border-blue"
                                placeholder="0"
                            />
                        </div>
                    )}

                    {/* Weekend pricing */}
                    <div className="mt-6">
                        <div className="border rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Custom weekend price</span>
                                <button
                                    onClick={removeWeekendPrice}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                            <div className="relative mt-3">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500">MAD</span>
                                </div>
                                <input
                                    type="number"
                                    value={weekendPrice}
                                    onChange={(e) => setWeekendPrice(e.target.value)}
                                    className="pl-14 w-full p-4 border rounded-lg text-2xl focus:ring-2 focus:ring-blue focus:border-blue"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discounts section */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Discounts</h2>

                    {/* Weekly discount */}
                    <div className={`border rounded-lg p-4 mb-4 ${errors.weekly.includes('Error:') ? 'border-red-500' : ''}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Weekly · For 7 nights or more</p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => decrementDiscount('weekly')}
                                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-l-md"
                                    >
                                        <FaMinus />
                                    </button>
                                    <div className="relative px-2 flex items-center">
                                        <input
                                            type="number"
                                            value={weeklyDiscount}
                                            onChange={(e) => setWeeklyDiscount(e.target.value)}
                                            className="w-16 p-2 text-2xl font-bold border-0 focus:ring-0 text-center"
                                            placeholder="0"
                                            max="100"
                                        />
                                        <span className="text-2xl font-bold">%</span>
                                    </div>
                                    <button
                                        onClick={() => incrementDiscount('weekly')}
                                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-r-md"
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                {errors.weekly && (
                                    <p className={`mt-2 text-sm ${errors.weekly.includes('Error:') ? 'text-red-600' : 'text-orange-500'}`}>
                                        <FaInfoCircle className="inline mr-1" />
                                        {errors.weekly}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="text-gray-600">Weekly average is MAD {weeklyAverage}</span>
                            </div>
                        </div>
                    </div>

                    {/* Monthly discount */}
                    <div className={`border rounded-lg p-4 ${errors.monthly.includes('Error:') ? 'border-red-500' : ''}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">Monthly · For 28 nights or more</p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => decrementDiscount('monthly')}
                                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-l-md"
                                    >
                                        <FaMinus />
                                    </button>
                                    <div className="relative px-2 flex items-center">
                                        <input
                                            type="number"
                                            value={monthlyDiscount}
                                            onChange={(e) => setMonthlyDiscount(e.target.value)}
                                            className="w-16 p-2 text-2xl font-bold border-0 focus:ring-0 text-center"
                                            placeholder="0"
                                            max="100"
                                        />
                                        <span className="text-2xl font-bold">%</span>
                                    </div>
                                    <button
                                        onClick={() => incrementDiscount('monthly')}
                                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-r-md"
                                        disabled={Number(monthlyDiscount) >= 99}
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                {errors.monthly && (
                                    <p className="mt-2 text-sm text-red-600">
                                        <FaInfoCircle className="inline mr-1" />
                                        {errors.monthly}
                                    </p>
                                )}
                                {Number(monthlyDiscount) >= 50 && !errors.monthly && (
                                    <p className="mt-2 text-sm text-red-600">
                                        <FaInfoCircle className="inline mr-1" />
                                        Error: Monthly discount cannot exceed 49%
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="text-gray-600">Monthly average is MAD {monthlyAverage}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save button */}
                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || hasErrors()}
                        className={`flex items-center justify-center gap-2 ${hasErrors() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue hover:bg-blue'} text-white font-medium py-3 px-6 rounded-lg transition-colors`}
                    >
                        <FaSave />
                        {isSaving ? 'Saving...' : 'Save Pricing'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pricing;