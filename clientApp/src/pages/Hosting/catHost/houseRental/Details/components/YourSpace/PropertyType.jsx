import { useState } from 'react';
import { FaHome, FaBuilding, FaHotel, FaWarehouse } from 'react-icons/fa';

const PropertyType = () => {
    const [selectedType, setSelectedType] = useState('');
    const [subType, setSubType] = useState('');

    const propertyTypes = [
        { id: 'house', label: 'House', icon: FaHome },
        { id: 'apartment', label: 'Apartment', icon: FaBuilding },
        { id: 'hotel', label: 'Hotel Room', icon: FaHotel },
        { id: 'unique', label: 'Unique Space', icon: FaWarehouse },
    ];

    const subTypes = {
        house: ['Entire house', 'Villa', 'Cottage', 'Townhouse'],
        apartment: ['Entire apartment', 'Studio', 'Loft', 'Serviced apartment'],
        hotel: ['Hotel room', 'Boutique hotel', 'Apart-hotel', 'Guest suite'],
        unique: ['Barn', 'Boat', 'Treehouse', 'Tiny house'],
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Property Type</h2>
            <p className="text-gray-600 mb-6">
                Choose the category that best describes your property.
            </p>

            <div className="space-y-6">
                {/* Main property types */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {propertyTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`p-4 border rounded-lg flex flex-col items-center space-y-2
                                ${selectedType === type.id 
                                    ? 'border-blue bg-blue/5' 
                                    : 'border-gray-200 hover:border-blue'}`}
                        >
                            <type.icon className="w-8 h-8 text-gray-600" />
                            <span className="font-medium">{type.label}</span>
                        </button>
                    ))}
                </div>

                {/* Sub-types */}
                {selectedType && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium mb-4">Property sub-type</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {subTypes[selectedType].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSubType(type)}
                                    className={`p-3 border rounded-lg text-center
                                        ${subType === type 
                                            ? 'border-blue bg-blue/5' 
                                            : 'border-gray-200 hover:border-blue'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyType; 