import { useState } from "react";

export const HotelDiscount = () => {
    const [discount, setDiscount] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [tempDiscount, setTempDiscount] = useState(0);

    const handleEdit = () => {
        setIsEditing(true);
        setTempDiscount(discount);
    };

    const handleSave = () => {
        setDiscount(tempDiscount);
        setIsEditing(false);
        // Here you would typically make an API call to update the discount
    };

    const handleCancel = () => {
        setIsEditing(false);
        setTempDiscount(discount);
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Hotel Discount</h1>
            
            <div className="space-y-4">
                {!isEditing ? (
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600">Current Discount:</p>
                            <p className="text-3xl font-bold text-blue-600">{discount}%</p>
                        </div>
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Edit Discount
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Edit Discount Percentage</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={tempDiscount}
                                onChange={(e) => setTempDiscount(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};