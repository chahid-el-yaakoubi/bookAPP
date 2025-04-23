import { BedDouble, Eye, Star, Users } from "lucide-react";
import RoomDetail from "./DetailRoom";
import { useState } from "react";

export default function RoomList({ rooms }) {
    console.log( {'yyyyyyyyyyyyyyyyyyyyyyy' : rooms})

    const [showModule, setShowModule] = useState(false)
    const [room, setRoom] = useState({})

    const onClose = ()=>{
        setShowModule(!showModule)
    }

    
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-blue-800 mb-3">Luxury Accommodations</h1>
                <p className="text-blue max-w-2xl mx-auto">
                    Discover our exceptional selection of rooms designed for your comfort and relaxation
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room) => (
                    <div
                        key={room._id}
                        className="rounded-lg overflow-hidden shadow border border-blue-100 group hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="relative aspect-[4/3] bg-gray-100">
                            <img
                                src={`${room.photos[0]?.url}`}
                                alt={room.type}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <span className="absolute top-3 right-3 px-3 py-1 text-sm bg-blue text-white rounded-full">
                                ${room.price} / night
                            </span>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-blue-800">{room.type}</h3>
                                <div className="flex items-center text-amber-500">
                                    <Star className="h-4 w-4 fill-current mr-1" />
                                    <span className="text-sm font-medium">4.9</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-blue-700 mb-4">
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1.5 text-blue-500" />
                                    <span>{room.capacity} guests</span>
                                </div>
                                <div className="flex items-center">
                                    <BedDouble className="h-4 w-4 mr-1.5 text-blue-500" />
                                    <span>
                                        {room.beds.map((bed) => `${bed.count} ${bed.type}`).join(", ")}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {room.view.map((view, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs border border-blue-200"
                                    >
                                        {view}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {Object.keys(room.categorizedAmenities)
                                    .slice(0, 3)
                                    .map((category, index) => (
                                        <span
                                            key={index}
                                            className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue border border-blue-100"
                                        >
                                            {category}
                                        </span>
                                    ))}
                            </div>

                            <button
                                className="block w-full text-center bg-blue hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors duration-300"
                            >
                                <div
                                    onClick={() => {
                                        setShowModule(!showModule);
                                        setRoom(room)
                                    }}
                                    className="flex items-center justify-center">

                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                </div>
                            </button>
                        </div>
                    </div>
                ))}

            </div>
            {showModule && <RoomDetail room={room} onClose={onClose} />}


        </div>
    );
}
