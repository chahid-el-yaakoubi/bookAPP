import { BedDouble, Eye, Users } from "lucide-react";
import RoomDetail from "./DetailRoom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function RoomList({ rooms }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";
    const [showModule, setShowModule] = useState(false);
    const [room, setRoom] = useState({});

    const onClose = () => setShowModule(false);

    const handleViewDetails = (selectedRoom) => {
        setRoom(selectedRoom);
        setShowModule(true);
    };

    const formatBeds = (beds) =>
        beds.map(
            (bed) => `${bed.count} ${t(`roomCard.${bed.type.toLowerCase().replace(' ', '_')}`)}`
        ).join(', ');

    return (
        <div
            className={`container mx-auto py-6 px-4 `}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room) => (
                    <div
                        key={room._id}
                        className="rounded-lg overflow-hidden shadow border border-blue-100 group hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="relative aspect-[4/3] bg-gray-100">
                            <img
                                src={room.photos?.[0]?.url || "/fallback.jpg"}
                                alt={room.type}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <span
                                className={`absolute top-3 ${
                                    isRTL ? "left-3" : "right-3"
                                } px-3 py-1 text-sm bg-blue text-white rounded-full`}
                            >
                                MAD {room.price} / {t("roomCard.night")}
                            </span>
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-blue-800">{room.type}</h3>
                            </div>

                            <div
                                className={`flex flex-wrap gap-4 text-sm text-blue-700 mb-4`}
                            >
                                <div className="flex items-center">
                                    <Users
                                        className={`h-4 w-4 ${
                                            isRTL ? "ml-1.5" : "mr-1.5"
                                        } text-blue-500`}
                                    />
                                    <span>{room.capacity} {t("roomCard.guests")}</span>
                                </div>
                                <div className="flex items-center">
                                    <BedDouble
                                        className={`h-4 w-4 ${
                                            isRTL ? "ml-1.5" : "mr-1.5"
                                        } text-blue-500`}
                                    />
                                    <span>{formatBeds(room.beds)}</span>
                                </div>
                            </div>

                            <div
                                className={`flex flex-wrap gap-1.5 mb-4 `}
                            >
                                {(room.view || []).map((view, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs border border-blue-200"
                                    >
                                        {t(`roomCard.${view.toLowerCase().replace(/ /g, "_")}`)}
                                    </span>
                                ))}
                            </div>

                            <div
                                className={`flex flex-wrap gap-2 mb-6  `}
                            >
                                {Object.keys(room.categorizedAmenities || {})
                                    .slice(0, 2)
                                    .map((category, index) => (
                                        <span
                                            key={index}
                                            className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue border border-blue-100"
                                        >
                                            {t(`roomCard.${category.toLowerCase()}`)}
                                        </span>
                                    ))}
                                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue border border-blue-100">
                                    ...+
                                </span>
                            </div>

                            <button
                                onClick={() => handleViewDetails(room)}
                                className="block w-full text-center bg-blue hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors duration-300"
                            >
                                <div className="flex items-center justify-center">
                                    <Eye
                                        className={`h-4 w-4 ${
                                            isRTL ? "ml-2" : "mr-2"
                                        }`}
                                    />
                                    {t("roomCard.view_details")}
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
