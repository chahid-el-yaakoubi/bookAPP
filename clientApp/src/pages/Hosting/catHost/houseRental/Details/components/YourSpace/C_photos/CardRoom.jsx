import React from 'react';
import { Edit2, Trash2, Users, Bath, Square, Home, Star, Eye } from 'lucide-react';

export const RoomCard = ({
  room,
  onEdit,
  onDelete,
  onClick,
}) => {
  // Helper function to format bed information
  const formatBeds = (beds) => {
    if (!beds || beds?.length === 0) return 'No bed information';
    
    return beds?.map(bed => `${bed?.count} ${bed?.type}`)?.join(', ');
  };
  
  // Helper function to format size with appropriate unit
  const formatSize = (size) => {
    if (!size) return null;
    return `${size?.value} ${size?.unit === 'sq_m' ? 'm²' : 'ft²'}`;
  };
  
  // Get first category of amenities for highlighting
  const getFirstCategory = () => {
    if (!room?.categorizedAmenities || room?.categorizedAmenities?.size === 0) return null;
    const entries = Array.from(room?.categorizedAmenities || []);
    if (entries?.length === 0) return null;
    
    const [category, amenities] = entries[0];
    return { category, amenities };
  };
  
  const firstCategory = getFirstCategory();

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
      role="button"
      tabIndex={0}
      onClick={()=>{
        onClick(room?._id);
      }}
    >
      {/* Hero Image Section with Gradient Overlay */}
      <div className="relative h-80">
        <img
          src={room?.photos && room?.photos?.length > 0 ? room?.photos[0].url : '/api/placeholder/800/500'}
          alt={room?.type}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex justify-between items-end">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                room?.isAvailable ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {room?.isAvailable ? 'Available Now' : 'Currently Unavailable'}
              </span>
              <h2 className="text-2xl font-bold mb-1">{room?.type}</h2>
              {room?.description && (
                <p className="text-sm text-gray-200 line-clamp-2 mb-2">{room?.description}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${room?.price}</div>
              <div className="text-sm opacity-80">/night</div>
            </div>
          </div>
        </div>
        
        {/* Admin Actions */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(room, true);
            }}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-110 transition-all"
            aria-label="Edit Room"
          >
            <Edit2 size={16} className="text-gray-700" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(room?._id);
            }}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transform hover:scale-110 transition-all"
            aria-label="Delete Room"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
        
        {/* Badge for Floor */}
        {room?.floor !== undefined && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-gray-800">
            Floor {room?.floor}
          </div>
        )}
      </div>

      {/* Room Details Section */}
      <div className="p-6">
        {/* Key Features */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Users size={20} className="text-blue-600 mb-1" />
            <span className="text-sm font-medium text-gray-800">{room?.capacity} Guests</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            <Bath size={20} className="text-blue-600 mb-1" />
            <span className="text-sm font-medium text-gray-800">{room?.bathrooms?.length} {room?.bathrooms?.length === 1 ? 'Bathroom' : 'Bathrooms'}</span>
          </div>
          {room?.size && (
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Square size={20} className="text-blue-600 mb-1" />
              <span className="text-sm font-medium text-gray-800">{formatSize(room?.size)}</span>
            </div>
          )}
          {room?.beds && room?.beds?.length > 0 && (
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Home size={20} className="text-blue-600 mb-1" />
              <span className="text-sm font-medium text-gray-800 truncate">{formatBeds(room?.beds)}</span>
            </div>
          )}
        </div>

        {/* Features & View */}
        <div className="space-y-4">
          {/* Room Features */}
          {room?.roomFeatures && room?.roomFeatures?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                <Star size={14} className="mr-1 text-amber-500" /> Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {room?.roomFeatures?.slice(0, 3).map((feature, index) => (
                  <span key={index} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                    {feature}
                  </span>
                ))}
                {room?.roomFeatures?.length > 3 && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                    +{room?.roomFeatures?.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
          
          {/* View */}
          {room?.view && room?.view?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                <Eye size={14} className="mr-1 text-blue-500" /> View
              </h4>
              <div className="flex flex-wrap gap-2">
                {room?.view?.map((viewItem, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {viewItem}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Categorized Amenities */}
          {firstCategory && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 mb-2">
                {firstCategory?.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {firstCategory?.amenities?.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {amenity}
                  </span>
                ))}
                {firstCategory?.amenities?.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    +{firstCategory?.amenities?.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};