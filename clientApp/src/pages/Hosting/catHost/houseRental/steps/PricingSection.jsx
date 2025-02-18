const PricingSection = ({ propertyData, setPropertyData }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Set your pricing</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nightly Rate (MAD)
                    </label>
                    <input
                        type="number"
                        value={propertyData.pricing.nightly_rate}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            pricing: { ...propertyData.pricing, nightly_rate: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cleaning Fee (MAD)
                    </label>
                    <input
                        type="number"
                        value={propertyData.pricing.cleaning_fee}
                        onChange={(e) => setPropertyData({
                            ...propertyData,
                            pricing: { ...propertyData.pricing, cleaning_fee: e.target.value }
                        })}
                        className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                        min="0"
                    />
                </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium mb-3">Discounts</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Weekly Discount (%)
                        </label>
                        <input
                            type="number"
                            value={propertyData.pricing.discounts.weekly_discount}
                            onChange={(e) => setPropertyData({
                                ...propertyData,
                                pricing: {
                                    ...propertyData.pricing,
                                    discounts: {
                                        ...propertyData.pricing.discounts,
                                        weekly_discount: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                            min="0"
                            max="100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monthly Discount (%)
                        </label>
                        <input
                            type="number"
                            value={propertyData.pricing.discounts.monthly_discount}
                            onChange={(e) => setPropertyData({
                                ...propertyData,
                                pricing: {
                                    ...propertyData.pricing,
                                    discounts: {
                                        ...propertyData.pricing.discounts,
                                        monthly_discount: e.target.value
                                    }
                                }
                            })}
                            className="w-full p-2 border rounded-md focus:ring-blue focus:border-blue"
                            min="0"
                            max="100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingSection; 