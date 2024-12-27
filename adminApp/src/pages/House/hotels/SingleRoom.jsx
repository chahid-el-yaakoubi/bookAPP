import React from 'react';

const SingleRoom = ({ room, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-[60vw] h-[60vh] flex flex-col ">
                <button onClick={onClose} className="self-end text-gray-900 hover:text-gray-800 bg-red-500 px-2 rounded">Close</button>
                <h2 className="text-xl font-bold text-gray-800">{room.title}</h2>
                <p className="text-gray-600">Price: ${room.price}</p>
                <p className="text-gray-600">Max People: {room.maxPeople}</p>
                <p className="text-gray-600">Area: {room.area} sqft</p>
                <p className="text-gray-600">Description: {room.desc}</p>
                <div className="mt-2">
                    <h3 className="font-semibold">Amenities:</h3>
                    <ul className="list-disc list-inside text-gray-600">
                        {room.amenities.map((amenity, index) => (
                            <li key={index}>{amenity}</li>
                        ))}
                    </ul>
                </div>
                <div className="mt-2">
                    <h3 className="font-semibold">Room Numbers:</h3>
                    <p className="text-gray-600">
                        {Array.isArray(room.roomNumber) ? room.roomNumber.map(r => r.number).join(', ') : 'No room numbers'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SingleRoom;