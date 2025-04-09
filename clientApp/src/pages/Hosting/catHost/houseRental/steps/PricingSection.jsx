import { useEffect, useState } from 'react';
import { FaDollarSign, FaInfoCircle, FaSave, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const Pricing = ({ propertyData, setPropertyData }) => {
    // Initialize state with property data or default values
    const [basePrice, setBasePrice] = useState(propertyData?.pricing?.nightly_rate || null);
    const [weekendPrice, setWeekendPrice] = useState(propertyData?.pricing?.Weekend_price || null);
    const [weeklyDiscount, setWeeklyDiscount] = useState(propertyData?.pricing?.discounts?.weekly_discount || null);
    const [monthlyDiscount, setMonthlyDiscount] = useState(propertyData?.pricing?.discounts?.monthly_discount || null);
    const [smartPricing, setSmartPricing] = useState(propertyData?.pricing?.smart_pricing?.enabled || false);
    const [minPrice, setMinPrice] = useState(propertyData?.pricing?.smart_pricing?.min || null);
    const [maxPrice, setMaxPrice] = useState(propertyData?.pricing?.smart_pricing?.max || null);
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

    // Update parent component's propertyData whenever pricing fields change
    useEffect(() => {
        // Only update if there are no critical errors
        if (!errors.weekly?.includes('Error:') && !errors.monthly?.includes('Error:') && Number(monthlyDiscount) <= 49) {
            updatePropertyData();
        }
    }, [basePrice, weekendPrice, weeklyDiscount, monthlyDiscount, smartPricing, minPrice, maxPrice]);

    // Function to update the parent's propertyData
    const updatePropertyData = () => {
        setPropertyData(prevData => ({
            ...prevData,
            pricing: {
                nightly_rate: basePrice ? Number(basePrice) : '',
                Weekend_price: weekendPrice ? Number(weekendPrice) : '',
                discounts: {
                    weekly_discount: weeklyDiscount ? Number(weeklyDiscount) : '',
                    monthly_discount: monthlyDiscount ? Number(monthlyDiscount) : ''
                },
                smart_pricing: {
                    enabled: smartPricing,
                    min: minPrice ? Number(minPrice) : 0,
                    max: maxPrice ? Number(maxPrice) : 0
                }
            }
        }));
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
        const weeklyDiscountPercent = Number(weeklyDiscount) / 100 || 0;

        // 5 weekdays + 2 weekend days
        const total = (nightlyRate * 5) + (weekendRate * 2);
        const discountedTotal = total * (1 - weeklyDiscountPercent);
        return Math.round(discountedTotal);
    };

    const calculateMonthlyAverage = () => {
        const nightlyRate = Number(basePrice);
        const weekendRate = Number(weekendPrice) || nightlyRate;
        const monthlyDiscountPercent = Number(monthlyDiscount) / 100 || 0;

        // Simplified calculation: ~30 days, with ~8 weekend days
        const total = (nightlyRate * 22) + (weekendRate * 8);
        const discountedTotal = total * (1 - monthlyDiscountPercent);
        return Math.round(discountedTotal);
    };

    const incrementDiscount = (type) => {
        if (type === 'weekly') {
            setWeeklyDiscount(prev => Math.min(Number(prev) + 1, 99));
        } else {
            setMonthlyDiscount(prev => Math.min(Number(prev) + 1, 49)); // Limit to 49%
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

    // Calculate weekly and monthly averages
    const weeklyAverage = calculateWeeklyAverage();
    const monthlyAverage = calculateMonthlyAverage();

    // Save button handler
    const handleSave = () => {
        if (hasErrors()) return;
        
        setIsSaving(true);
        updatePropertyData();
        
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto min-h-[70vh] ">
            <h1 className="text-3xl font-bold mb-4">Pricing</h1>
            

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

                  
                </div>
 

                 
            </div>
        </div>
    );
};

export default Pricing;