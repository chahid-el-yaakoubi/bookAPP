import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEuroSign, faBed, faRulerCombined } from "@fortawesome/free-solid-svg-icons";

export const HotelRooms = ({ 
  nights = 1,
  selectedRooms = {},
  handleRoomSelection,
  calculateTotal,
  scrollToContact 
}) => { 
    const displayRooms = hotelRoomsData?.filter(Boolean) ?? [];

    if (displayRooms.length === 0) {
        return (
            <div className="my-8 p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600">Aucune chambre disponible pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="my-8">
            <h2 className="text-2xl font-semibold mb-4">Nos Chambres</h2>
            <div className="space-y-6">
                {displayRooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            {/* Left side - Image */}
                            <div className="md:w-1/3">
                                <div className="relative h-64">
                                    <img 
                                        src={room.photos?.[0] || 'https://via.placeholder.com/400x300?text=Room+Image'} 
                                        alt={room.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300?text=Room+Image';
                                        }}
                                    />
                                    {room.discount > 0 && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full z-10">
                                            -{room.discount}%
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right side - Room Details */}
                            <div className="flex-1 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold">{room.title}</h3>
                                    <div className="text-right">
                                        {room.discount > 0 && (
                                            <span className="line-through text-gray-400 mr-2">{room.price}€</span>
                                        )}
                                        <span className="text-2xl font-bold text-blue">
                                            {(room.price * (1 - room.discount/100)).toFixed(0)}€
                                        </span>
                                        <span className="text-gray-500">/nuit</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4">{room.description}</p>

                                {/* Room Features */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faUser} className="text-blue" />
                                        <span>{room.maxPeople} personnes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faRulerCombined} className="text-blue" />
                                        <span>{room.size} m²</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faBed} className="text-blue" />
                                        <span>{room.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faEuroSign} className="text-blue" />
                                        <span>{room.roomNumbers?.length || 0} disponible{(room.roomNumbers?.length || 0) > 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {room.amenities?.map((amenity, index) => (
                                            <span 
                                                key={index}
                                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Booking Controls */}
                                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                    <div className="flex gap-4">
                                        <select
                                            value={selectedRooms[room.id] || 0}
                                            onChange={(e) => handleRoomSelection(room.id, parseInt(e.target.value))}
                                            className="border rounded-lg px-4 py-2"
                                        >
                                            {Array.from({ length: (room.roomNumbers?.length || 0) + 1 }, (_, i) => (
                                                <option key={i} value={i}>
                                                    {i} {i <= 1 ? 'chambre' : 'chambres'}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={scrollToContact}
                                            className="bg-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Réserver
                                        </button>
                                    </div>
                                    {selectedRooms[room.id] > 0 && (
                                        <div className="text-right">
                                            <span className="text-lg font-semibold text-blue">
                                                Total: {(selectedRooms[room.id] * room.price * (1 - room.discount/100) * nights).toFixed(0)}€
                                            </span>
                                            <span className="text-gray-500 text-sm block">
                                                pour {nights} nuit{nights > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Section */}
            {Object.values(selectedRooms).some(quantity => quantity > 0) && (
                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-semibold">
                            Total pour {nights} nuit{nights > 1 ? 's' : ''}
                        </span>
                        <span className="text-3xl font-bold text-blue">
                            {calculateTotal()}€
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export const hotelRoomsData = [
    {
        id: 1,
        title: "Chambre Classique",
        description: "Chambre élégante et confortable avec vue sur le jardin. Parfaite pour les voyageurs individuels ou les couples.",
        price: 120,
        discount: 0,
        maxPeople: 2,
        size: 25,
        type: "Lit Double",
        roomNumbers: [101, 102, 103, 104],
        photos: [
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3",
        ],
        amenities: ["Wi-Fi", "Climatisation", "TV LCD", "Mini-bar", "Coffre-fort"]
    },
    {
        id: 2,
        title: "Suite Deluxe",
        description: "Spacieuse suite avec salon séparé et vue panoramique sur la ville. Décoration raffinée et prestations haut de gamme.",
        price: 250,
        discount: 10,
        maxPeople: 3,
        size: 45,
        type: "King Size",
        roomNumbers: [201, 202],
        photos: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3",
        ],
        amenities: ["Wi-Fi", "Climatisation", "TV LCD", "Mini-bar", "Coffre-fort", "Baignoire", "Machine à café", "Room Service 24/7"]
    }
];