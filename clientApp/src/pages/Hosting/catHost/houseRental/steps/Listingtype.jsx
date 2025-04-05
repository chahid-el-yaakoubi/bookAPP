import { useEffect, useState } from "react";
import { FaHotel, FaHome, FaBed, FaUsers } from "react-icons/fa"; // Import icons

const BasicInformation = ({ propertyData, setPropertyData }) => {
  const [filteredListingTypes, setFilteredListingTypes] = useState([]);

  const handleTypeSelect = (listing_typeId) => {
    setPropertyData((prev) => ({
      ...prev,
      listing_type: listing_typeId,
    }));
  };

  const getFilteredListingTypes = (category) => {
    if (["guesthouse", "hostel", "hotel", "boutique-hotel"].includes(category)) {
      return [
        { id: "Hotel_room", label: "Hotel Room", icon: <FaHotel /> },
        { id: "Entire_place", label: "Entire Place", icon: <FaHome /> },
        { id: "Private_room", label: "Private Room", icon: <FaBed /> },
      ];
    }
    return [
      { id: "Entire_place", label: "Entire Place", icon: <FaHome className="w-5 h-5" /> },
      { id: "Private_room", label: "Private Room", icon: <FaBed /> },
      { id: "Shared_room", label: "Shared Room", icon: <FaUsers /> },
    ];
  };

  useEffect(() => {
    if (propertyData?.type) {
      setFilteredListingTypes(getFilteredListingTypes(propertyData.type));
    }
  }, [propertyData]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Select Listing Type</h3>
      <div className="flex space-x-4">
        {filteredListingTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleTypeSelect(type.id)}
            className={`flex items-center px-4 py-2 border rounded space-x-2 h-20 ${
              propertyData.listing_type === type.id
                ? "bg-blue text-white border-blue"
                : "bg-gray-200 hover:bg-gray-300 border-gray-400"
            }`}
          >
            {type.icon}
            <span>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BasicInformation;
