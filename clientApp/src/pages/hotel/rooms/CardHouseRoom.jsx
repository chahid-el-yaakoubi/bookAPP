import React from 'react';
import { Edit2, Trash2, Users, Bath, Square, Home, Star, Eye, Bed, BedDouble } from 'lucide-react';
import { useTranslation } from "react-i18next";

export const RoomCardHouse = ({
  room
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";


  const formatBeds = (beds) =>
    beds.map(
      (bed) => `${bed.count} ${t(`roomCard.${bed.type.toLowerCase().replace(' ', '_')}`)}`
    ).join(', ');



  return (
    <div
      className="group bg-white h-80 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-auto"
      role="button"
      tabIndex={0}

    >


      {/* Room Details Section */}
      <div className="p-6">
        {/* Key Features */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">

          {room?.beds && room?.beds?.length > 0 && (
            <div className="flex items-center">
              <BedDouble
                className={`h-4 w-4 ${isRTL ? "ml-1.5" : "mr-1.5"
                  } text-blue-500`}
              />
              <span>{formatBeds(room.beds)}</span>
            </div>
          )}
        </div>

        {/* Features & View */}
        <div className="space-y-4">
          {/* Room Features */}
          {room?.roomFeatures && room?.roomFeatures?.length > 0 && (
            <div>
              <h3 className={`text-xl font-semibold text-gray-900 mb-4 `}>{t('room_features')}</h3>
              <div className="grid grid-cols-3 gap-3">
                {(room.roomFeatures || []).map((feature, index) => (
                  <div key={index} className={`flex items-center`}>
                    <div className={`h-2 w-2 rounded-full bg-blue ${isRTL ? 'ml-3' : 'mr-3'}`}></div>
                    <span className={`text-sm text-gray-700 capitalize ${isRTL ? 'text-right' : 'text-left'}`}>{t(feature)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

         
          
        </div>
      </div>

    </div>
  );
};