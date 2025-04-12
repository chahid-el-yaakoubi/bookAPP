import React, { useState } from 'react';

const HotelRoomsDisplay = ({ roomsData, propertyType }) => {
  const [selectedRooms, setSelectedRooms] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});
  const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);
  
  // Check if property type is hotel-like
  const isHotelType = ['hotel', 'guesthouse', 'hostel', 'boutique-hotel'].includes(propertyType);

  const handleRoomSelection = (roomId, value) => {
    setSelectedRooms({
      ...selectedRooms,
      [roomId]: parseInt(value) || 0
    });
  };

  const toggleRoomDetails = (roomId) => {
    setExpandedRooms({
      ...expandedRooms,
      [roomId]: !expandedRooms[roomId]
    });
  };

  const openRoomDetail = (roomId) => {
    const room = roomsData.find(r => r._id === roomId);
    setSelectedRoomDetail(room);
  };

  const closeRoomDetail = () => {
    setSelectedRoomDetail(null);
  };

  const formatPrice = (price, currency = "$") => {
    if (!price && price !== 0) return "Price on request";
    return `${currency} ${price}`;
  };

  const formatBeds = (beds) => {
    if (!beds || beds.length === 0) return "No bed information";
    return beds.map(bed => `${bed.count}x ${bed.type}`).join(", ");
  };

  const formatFeatures = (features, limit = 5) => {
    if (!features || features.length === 0) return "";
    
    const displayFeatures = features.slice(0, limit);
    const formatted = displayFeatures.map(feature => 
      feature.replace(/_/g, ' ')
             .split(' ')
             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
             .join(' ')
    ).join(", ");
    
    return features.length > limit ? `${formatted}, ...` : formatted;
  };
 
  // Component for detailed view of a single room
  const SingleRoomView = ({ room }) => {
    if (!room) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{room.type}</h2>
              <button 
                onClick={closeRoomDetail}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Photo Gallery */}
            {room.photos && room.photos.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-2">
                  {room.photos.map((photo, idx) => (
                    <div key={idx} className="aspect-video bg-gray-100 rounded overflow-hidden">
                      <img 
                        src={photo.url || "/api/placeholder/400/300"} 
                        alt={`Room ${idx+1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Room Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Room Details</h3>
                <ul className="space-y-2">
                  {room.size && (
                    <li className="flex items-center">
                      <span className="mr-2">📏</span>
                      <span>Size: {room.size.value} {room.size.unit}</span>
                    </li>
                  )}
                  {room.capacity && (
                    <li className="flex items-center">
                      <span className="mr-2">👥</span>
                      <span>Capacity: {room.capacity} people</span>
                    </li>
                  )}
                  {room.beds && room.beds.length > 0 && (
                    <li className="flex items-center">
                      <span className="mr-2">🛏️</span>
                      <span>Beds: {formatBeds(room.beds)}</span>
                    </li>
                  )}
                  {room.floor && (
                    <li className="flex items-center">
                      <span className="mr-2">🏢</span>
                      <span>Floor: {room.floor}</span>
                    </li>
                  )}
                  {room.view && room.view.length > 0 && (
                    <li className="flex items-start">
                      <span className="mr-2 mt-1">👁️</span>
                      <span>View: {room.view.join(", ")}</span>
                    </li>
                  )}
                </ul>
                
                {room.description && (
                  <div className="mt-4">
                    <h3 className="font-bold text-lg mb-2">Description</h3>
                    <p className="text-gray-700">{room.description}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2">Price Details</h3>
                <div className="bg-blue p-4 rounded-lg mb-4">
                  <div className="text-xl font-bold">
                    {room.price ? formatPrice(room.price) : "Price on request"}
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    className="bg-blue hover:bg-blue text-white font-bold py-2 px-6 rounded w-full"
                    onClick={() => {
                      handleRoomSelection(room._id, 1);
                      closeRoomDetail();
                    }}
                  >
                    Book This Room
                  </button>
                </div>
              </div>
            </div>
            
            {/* Amenities Section */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Room Features & Amenities</h3>
              {room.roomFeatures && room.roomFeatures.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Room Features</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {room.roomFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>{feature.replace(/_/g, ' ')
                                    .split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {room.categorizedAmenities && Object.keys(room.categorizedAmenities).length > 0 && (
                <>
                  {Object.entries(room.categorizedAmenities).map(([category, amenities]) => (
                    <div key={category} className="mb-4">
                      <h4 className="font-medium mb-2">{category}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>{amenity.replace(/_/g, ' ')
                                      .split(' ')
                                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                      .join(' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            
            {/* Bathroom Information */}
            {room.bathrooms && room.bathrooms.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-2">Bathroom Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.bathrooms.map((bathroom, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Bathroom {idx+1} - {bathroom.type}</h4>
                      {bathroom.amenities && Object.keys(bathroom.amenities).filter(k => bathroom.amenities[k]).length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {Object.keys(bathroom.amenities).filter(k => bathroom.amenities[k]).map((amenity, i) => (
                            <div key={i} className="flex items-center">
                              <span className="text-green-600 mr-2">✓</span>
                              <span>{amenity.replace(/_/g, ' ')
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-100 p-4 flex justify-end">
            <button 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              onClick={closeRoomDetail}
            >
              Close
            </button>
            <button 
              className="bg-blue hover:bg-blue text-white font-bold py-2 px-6 rounded"
              onClick={() => {
                handleRoomSelection(room._id, 1);
                closeRoomDetail();
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Display for hotel-like properties (detailed room-by-room view)
  const HotelView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-blue text-black">
            <th className="p-4 text-left">Room Type</th>
            <th className="p-4 text-center">Capacity</th>
            <th className="p-4 text-center">Price</th>
          </tr>
        </thead>
        <tbody>
          {roomsData.map((room, index) => (
            <React.Fragment key={room._id}>
              {index > 0 && (
                <tr className="h-2">
                  <td colSpan="4" className="border-t border-b border-gray-200"></td>
                </tr>
              )}
              <tr className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="p-4 align-top border-l border-r border-gray-200">
                  <div 
                    className="font-bold text-blue cursor-pointer hover:underline"
                    onClick={() => openRoomDetail(room._id)}
                  >
                    {room.type}
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    {room.beds && room.beds.length > 0 && (
                      <div className="flex items-center">
                        {room.beds.map((bed, i) => (
                          <span key={i} className="mr-1">
                            {bed.count === "1" ? (
                              <span className="inline-block">🛏️</span>
                            ) : (
                              <span className="inline-block">🛏️🛏️</span>
                            )}
                          </span>
                        ))}
                        <span className="ml-1">{formatBeds(room.beds)}</span>
                      </div>
                    )}
                  </div>
                  
                  {room.size && (
                    <div className="mt-2 text-sm flex items-center">
                      <span className="mr-1">📏</span>
                      <span>{room.size.value} {room.size.unit}</span>
                    </div>
                  )}
                  
                  {room.view && room.view.length > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="mr-1">👁️</span>
                      <span>{room.view.join(", ")}</span>
                    </div>
                  )}
                  
                  {room.roomFeatures && room.roomFeatures.length > 0 && (
                    <div className="mt-2 text-sm">
                      <div><span className="font-medium">Features:</span> {formatFeatures(room.roomFeatures)}</div>
                    </div>
                  )}
                  
                  {!expandedRooms[room._id] ? (
                    <button 
                      className="mt-2 text-blue text-sm hover:underline flex items-center"
                      onClick={() => toggleRoomDetails(room._id)}
                    >
                      Show more details <span className="ml-1">▼</span>
                    </button>
                  ) : (
                    <>
                      {room.categorizedAmenities && Object.keys(room.categorizedAmenities).length > 0 && (
                        <div className="mt-2 text-sm">
                          <div className="font-medium">Amenities:</div>
                          {Object.entries(room.categorizedAmenities).map(([category, amenities]) => (
                            <div key={category} className="ml-2 mb-1">
                              <div className="font-medium">{category}:</div>
                              <div className="ml-2">{formatFeatures(amenities, amenities.length)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {room.bathrooms && room.bathrooms.length > 0 && (
                        <div className="mt-2 text-sm">
                          <div className="font-medium">Bathrooms ({room.bathrooms.length}):</div>
                          {room.bathrooms.map((bathroom, idx) => (
                            <div key={idx} className="ml-2 mb-1">
                              <div>{bathroom.type}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <button 
                        className="mt-2 text-blue text-sm hover:underline flex items-center"
                        onClick={() => toggleRoomDetails(room._id)}
                      >
                        Show less <span className="ml-1">▲</span>
                      </button>
                    </>
                  )}
                </td>
                
                <td className="p-4 text-center align-top border-r border-gray-200">
                  <div className="flex justify-center">
                    {room.capacity && Array(parseInt(room.capacity)).fill().map((_, i) => (
                      <span key={i} className="text-lg">👤</span>
                    ))}
                  </div>
                </td>
                
                <td className="p-4 text-center align-top border-r border-gray-200">
                  <div className="font-bold">
                    {room.price ? formatPrice(room.price) : "Price on request"}
                  </div>
                </td>
                
                 
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Display for non-hotel properties (compact view)
  const NonHotelView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-blue text-black">
            <th className="p-4 text-left">Room Information</th>
            <th className="p-4 text-center">Price</th>
            <th className="p-4 text-center">Select</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            <td className="p-4 align-top border-l border-r border-gray-200">
              <div className="font-bold">Room Configuration</div>
              <div className="mt-2">
                {roomsData.map((room, index) => (
                  <div key={room._id} className="mb-2">
                    <div className="font-medium">{room.type || `Room ${index + 1}`}:</div>
                    <div className="ml-2 flex flex-wrap">
                      {room.beds && room.beds.length > 0 && (
                        <div className="mr-4">
                          <span className="text-sm">
                            {formatBeds(room.beds)}
                          </span>
                        </div>
                      )}
                      {room.capacity && (
                        <div className="mr-4">
                          <span className="text-sm">
                            {room.capacity} {parseInt(room.capacity) > 1 ? 'persons' : 'person'}
                          </span>
                        </div>
                      )}
                      {room.size && (
                        <div>
                          <span className="text-sm">
                            {room.size.value} {room.size.unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <button 
                  className="text-blue text-sm hover:underline"
                  onClick={() => {
                    if (roomsData.length > 0) {
                      openRoomDetail(roomsData[0]._id);
                    }
                  }}
                >
                  View detailed information
                </button>
              </div>
            </td>
            
            <td className="p-4 text-center align-top border-r border-gray-200">
              <div className="font-bold">
                {roomsData.length > 0 && roomsData[0].price ? 
                  formatPrice(roomsData[0].price) : 
                  "Price on request"}
              </div>
            </td>
            
            <td className="p-4 text-center align-top border-r border-gray-200">
              <div className="flex justify-center">
                <button 
                  className="bg-blue hover:bg-blue text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    if (roomsData.length > 0) {
                      handleRoomSelection(roomsData[0]._id, 1);
                    }
                  }}
                >
                  Book Now
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="w-full  mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-6">Select Your Room</h1>
      
      {selectedRoomDetail && (
        <SingleRoomView room={selectedRoomDetail} />
      )}
      
      {isHotelType ? <HotelView /> : <NonHotelView />}
    </div>
  );
};

export default HotelRoomsDisplay;