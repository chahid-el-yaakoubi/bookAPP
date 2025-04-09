import React, { useState } from 'react';

const HotelRoomsDisplay = () => {
  const [rooms, setRooms] = useState([
    {
      id: "67f24b4d952990a085260d8a",
      type: "Deluxe Room",
      price: 543,
      priceWithTax: 543 + 125,
      size: {
        value: 65,
        unit: "sq_m"
      },
      capacity: 2,
      beds: [
        {
          type: "Single Bed",
          count: 1
        },
        {
          type: "Double Bed",
          count: 1
        }
      ],
      floor: 353,
      view: ["City View", "Garden View"],
      roomFeatures: [
        "safe", "balcony", "air_conditioning", "heating_system", 
        "blackout_curtains", "full_length_mirror", "reading_lights", 
        "telephone", "alarm_clock"
      ],
      categorizedAmenities: {
        "Entertainment": ["speakers", "books", "dvd_player", "premium_channels"],
        "Workspace": ["desk", "office_chair", "high_speed_wifi"],
        "Kitchen & Dining": ["microwave", "coffee_maker_kettle", "stove_hot_plate", "mini_fridge"],
        "Technology": ["voice_assistant", "international_outlets"]
      },
      photos: [
        "https://res.cloudinary.com/dioj0etzg/image/upload/v1743869752/rooms/hucafzj7cwgvmaim1cvz.webp",
        "https://res.cloudinary.com/dioj0etzg/image/upload/v1743931980/rooms/nsjft8xuruec1yewezly.png",
        "https://res.cloudinary.com/dioj0etzg/image/upload/v1743931980/rooms/ykuhg9rawujvliwvtoh9.png"
      ],
      bathrooms: [
        {
          type: "Toilet Only",
          amenities: ["toilet_bidet", "shower_bathtub", "makeup_mirror"]
        },
        {
          type: "Shower Only",
          amenities: ["jacuzzi", "heated_towel_rack", "hairdryer"]
        }
      ],
      freeCancellation: true,
      cancellationDate: "April 25, 2025",
      payAtProperty: true,
      noCreditCardNeeded: true,
      description: "Spacious deluxe room with modern amenities and beautiful views."
    },
    {
      id: "67f24b4d952990a085260d8b",
      type: "Chambre Lits Jumeaux",
      price: 3074,
      priceWithTax: 3074 + 125,
      currency: "MAD",
      size: {
        value: 20,
        unit: "sq_m"
      },
      capacity: 2,
      beds: [
        {
          type: "Single Bed",
          count: 2
        }
      ],
      floor: 0,
      amenities: [
        "Articles de toilette gratuits", "Douche", "Toilettes", "Serviettes",
        "Télévision", "Chaînes satellite", "Service de révail", "Moquette",
        "Armoire ou penderie", "Papier toilette"
      ],
      location: "au rez-de-chaussée",
      photos: [
        "https://res.cloudinary.com/dioj0etzg/image/upload/v1743869752/rooms/hucafzj7cwgvmaim1cvz.webp"
      ],
      freeCancellation: true,
      cancellationDate: "April 25, 2025",
      payAtProperty: true,
      noCreditCardNeeded: true,
      additionalFeatures: ["Salle de bains privative", "Télévision à écran plat", "Terrasse", "Minibar"],
      description: "Chambre confortable avec lits jumeaux, idéale pour les amis ou collègues en voyage."
    },
    {
      id: "67f24b4d952990a085260d8c",
      type: "Chambre Double - Vue sur Mer",
      price: 3126,
      priceWithTax: 3126 + 125,
      currency: "MAD",
      size: {
        value: 20,
        unit: "sq_m"
      },
      capacity: 2,
      floor: "élevé",
      view: ["Vue sur la mer", "Vue sur la ville"],
      beds: [
        {
          type: "grand lit double",
          count: 1
        }
      ],
      additionalFeatures: ["Balcon"],
      photos: [
        "https://res.cloudinary.com/dioj0etzg/image/upload/v1743931980/rooms/ykuhg9rawujvliwvtoh9.png"
      ],
      freeCancellation: true,
      cancellationDate: "April 25, 2025",
      payAtProperty: true,
      noCreditCardNeeded: true,
      description: "Magnifique chambre avec vue imprenable sur la mer et accès à un balcon privé."
    }
  ]);

  const [selectedRooms, setSelectedRooms] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});
  const [selectedRoomDetail, setSelectedRoomDetail] = useState(null);

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
    const room = rooms.find(r => r.id === roomId);
    setSelectedRoomDetail(room);
  };

  const closeRoomDetail = () => {
    setSelectedRoomDetail(null);
  };

  const formatPrice = (price, currency = "$") => {
    return `${currency} ${price}`;
  };

  const formatBeds = (beds) => {
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

  const getTotalPrice = () => {
    let total = 0;
    Object.keys(selectedRooms).forEach(roomId => {
      const room = rooms.find(r => r.id === roomId);
      if (room && selectedRooms[roomId] > 0) {
        total += room.priceWithTax * selectedRooms[roomId];
      }
    });
    return total;
  };

  // Component for single room detail view
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
                        src={photo || "/api/placeholder/400/300"} 
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
                  <li className="flex items-center">
                    <span className="mr-2">📏</span>
                    <span>Size: {room.size.value} m²</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">👥</span>
                    <span>Capacity: {room.capacity} people</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">🛏️</span>
                    <span>Beds: {formatBeds(room.beds)}</span>
                  </li>
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
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="text-xl font-bold">{formatPrice(room.price, room.currency || "$")}</div>
                  <div className="text-sm text-gray-600">+ taxes et frais: {formatPrice(125, room.currency || "$")}</div>
                  <div className="text-sm text-gray-600 mt-1">Total: {formatPrice(room.priceWithTax, room.currency || "$")}</div>
                </div>
                
                <div className="space-y-2">
                  {room.freeCancellation && (
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <div>
                        <div className="text-green-600">Free cancellation</div>
                        <div className="text-sm">until {room.cancellationDate}</div>
                      </div>
                    </div>
                  )}
                  
                  {room.payAtProperty && (
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      <div>No prepayment needed - Pay at property</div>
                    </div>
                  )}
                  
                  {room.noCreditCardNeeded && (
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">💳</span>
                      <div>No credit card needed</div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded w-full"
                    onClick={() => {
                      handleRoomSelection(room.id, 1);
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
              
              {room.additionalFeatures && room.additionalFeatures.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Additional Features</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {room.additionalFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
                      {bathroom.amenities && (Array.isArray(bathroom.amenities) ? bathroom.amenities : Object.keys(bathroom.amenities).filter(k => bathroom.amenities[k])).length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {(Array.isArray(bathroom.amenities) ? bathroom.amenities : Object.keys(bathroom.amenities).filter(k => bathroom.amenities[k])).map((amenity, i) => (
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
              onClick={() => {
                handleRoomSelection(room.id, 1);
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

  return (
    <div className="w-full max-w-6xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-6">Select Your Room</h1>
      
      {selectedRoomDetail && (
        <SingleRoomView room={selectedRoomDetail} />
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-4 text-left">Room Type</th>
              <th className="p-4 text-center">Capacity</th>
              <th className="p-4 text-center">Price for 6 nights</th>
              <th className="p-4 text-left">Your Options</th>
              <th className="p-4 text-center">Select Rooms</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <React.Fragment key={room.id}>
                {index > 0 && (
                  <tr className="h-2">
                    <td colSpan="6" className="border-t border-b border-gray-200"></td>
                  </tr>
                )}
                <tr className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-4 align-top border-l border-r border-gray-200">
                    <div 
                      className="font-bold text-blue-600 cursor-pointer hover:underline"
                      onClick={() => openRoomDetail(room.id)}
                    >
                      {room.type}
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                      {room.beds && (
                        <div className="flex items-center">
                          {room.beds.map((bed, i) => (
                            <span key={i} className="mr-1">
                              {bed.count === 1 ? (
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
                    
                    <div className="mt-2 text-sm flex items-center">
                      <span className="mr-1">📏</span>
                      <span>{room.size.value} m²</span>
                    </div>
                    
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
                    
                    {!expandedRooms[room.id] ? (
                      <button 
                        className="mt-2 text-blue-600 text-sm hover:underline flex items-center"
                        onClick={() => toggleRoomDetails(room.id)}
                      >
                        Show more details <span className="ml-1">▼</span>
                      </button>
                    ) : (
                      <>
                        {room.additionalFeatures && room.additionalFeatures.length > 0 && (
                          <div className="mt-2 text-sm">
                            <div className="font-medium">Additional Features:</div>
                            {room.additionalFeatures.map((feature, i) => (
                              <div key={i} className="flex items-center ml-2 mb-1">
                                <span className="mr-1">✓</span>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
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
                          className="mt-2 text-blue-600 text-sm hover:underline flex items-center"
                          onClick={() => toggleRoomDetails(room.id)}
                        >
                          Show less <span className="ml-1">▲</span>
                        </button>
                      </>
                    )}
                  </td>
                  
                  <td className="p-4 text-center align-top border-r border-gray-200">
                    <div className="flex justify-center">
                      {Array(room.capacity).fill().map((_, i) => (
                        <span key={i} className="text-lg">👤</span>
                      ))}
                    </div>
                  </td>
                  
                  <td className="p-4 text-center align-top border-r border-gray-200">
                    <div className="font-bold">
                      {formatPrice(room.price, room.currency || "$")}
                    </div>
                    <div className="text-sm text-gray-600">
                      + taxes et frais: {formatPrice(125, room.currency || "$")}
                    </div>
                  </td>
                  
                  <td className="p-4 align-top border-r border-gray-200">
                    {room.freeCancellation && (
                      <div className="flex items-start mb-2">
                        <span className="text-green-600 mr-2">✓</span>
                        <div>
                          <div className="text-green-600">Annulation gratuite</div>
                          <div className="text-sm">avant le {room.cancellationDate}</div>
                        </div>
                      </div>
                    )}
                    
                    {room.payAtProperty && (
                      <div className="flex items-center mb-2">
                        <span className="text-green-600 mr-2">✓</span>
                        <div>Aucun prépaiement requis - Payez sur place</div>
                      </div>
                    )}
                    
                    {room.noCreditCardNeeded && (
                      <div className="flex items-center mb-2">
                        <span className="text-green-600 mr-2">💳</span>
                        <div>Aucune carte de crédit nécessaire</div>
                      </div>
                    )}
                  </td>
                  
                  <td className="p-4 text-center align-top border-r border-gray-200">
                    <select 
                      className="w-16 p-2 border border-gray-300 rounded"
                      value={selectedRooms[room.id] || 0}
                      onChange={(e) => handleRoomSelection(room.id, e.target.value)}
                    >
                      {[0, 1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </td>
                  
                  <td className="p-4 text-center align-top">
                    {selectedRooms[room.id] > 0 && (
                      <div className="text-center font-bold text-blue-600">
                        Selected
                      </div>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {getTotalPrice() > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <div className="font-bold text-lg">Total Price:</div>
            <div className="font-bold text-xl text-blue-700">{formatPrice(getTotalPrice())}</div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded">
              Je réserve
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelRoomsDisplay;