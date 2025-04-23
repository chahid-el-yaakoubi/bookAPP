import { Bath, Bed, Check , Maximize, 
    Users, 
   
    MapPin, 
   
    Info, 
    
    Music, 
    Wifi, 
    Diamond, 
    Utensils, 
    Smartphone,
    X, 
    ShowerHead} from "lucide-react";
import React, { useState, useEffect } from "react";
 

// Main RoomDetail component
function RoomDetail({ room, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Helper function to get icon for amenity category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Entertainment":
        return <Music className="h-5 w-5" />;
      case "Workspace":
        return <Wifi className="h-5 w-5" />;
      case "Moroccan Features":
        return <Diamond className="h-5 w-5" />;
      case "Kitchen & Dining":
        return <Utensils className="h-5 w-5" />;
      case "Technology":
        return <Smartphone className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] h-full overflow-hidden flex flex-col">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">{room.type}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Scrollable content */}
        <div className="overflow-y-auto p-4 md:p-6">
          {/* Room Images */}
          <div className="relative rounded-xl overflow-hidden mb-6">
            <img 
              src="/api/placeholder/800/400" 
              alt={room.type} 
              className="w-full h-48 md:h-64 object-cover" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="text-sm text-white/80">
                {room.type}
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white">{room.type}</h1>
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 text-white mr-1" />
                <span className="text-white/90 text-sm">Premium Location</span>
              </div>
            </div>
          </div>

          {/* Room Details Tabs */}
          <div className="w-full mb-6">
            <div className="grid grid-cols-3 bg-gray-100 rounded-lg overflow-hidden">
              <button 
                className={`py-2 px-4 text-sm font-medium ${activeTab === "overview" ? "bg-blue text-white" : "text-gray-900"}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button 
                className={`py-2 px-4 text-sm font-medium ${activeTab === "amenities" ? "bg-blue text-white" : "text-gray-900"}`}
                onClick={() => setActiveTab("amenities")}
              >
                Amenities
              </button>
              <button 
                className={`py-2 px-4 text-sm font-medium ${activeTab === "features" ? "bg-blue text-white" : "text-gray-900"}`}
                onClick={() => setActiveTab("features")}
              >
                Features
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex flex-col items-center justify-center p-4">
                      <Bed className="h-8 w-8 mb-2 text-gray-900" />
                      <span className="text-sm font-medium text-gray-900 text-center">
                        {room.beds?.map((bed) => `${bed.count} ${bed.type}`).join(", ") || "1 King Bed"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex flex-col items-center justify-center p-4">
                      <Maximize className="h-8 w-8 mb-2 text-gray-900" />
                      <span className="text-sm font-medium text-gray-900">
                        {room.size?.value || "40"} {room.size?.unit || "m²"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex flex-col items-center justify-center p-4">
                      <Users className="h-8 w-8 mb-2 text-gray-900" />
                      <span className="text-sm font-medium text-gray-900">{room.capacity || "2"} Guests</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex flex-col items-center justify-center p-4">
                      <Bath className="h-8 w-8 mb-2 text-gray-900" />
                      <span className="text-sm font-medium text-gray-900">{room.bathrooms?.length || "1"} Bathrooms</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {room.description ||
                        "Experience the height of luxury in our Deluxe Room, offering a perfect blend of modern amenities and traditional Moroccan design elements. The room is spacious, comfortable, and designed with your relaxation in mind."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Views</h3>
                    <div className="flex flex-wrap gap-2">
                      {(room.view || ["Garden", "Pool"]).map((view, index) => (
                        <div key={index} className="bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 text-xs font-medium rounded-full">
                          {view}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Amenities Tab */}
            {activeTab === "amenities" && (
              <div className="pt-6">
                <div className="space-y-8">
                  {Object.entries(room.categorizedAmenities || {
                    "Entertainment": ["smart_tv", "streaming_services"],
                    "Workspace": ["desk", "wifi", "charging_ports"],
                    "Moroccan Features": ["traditional_decor", "local_artworks"],
                    "Technology": ["smart_controls", "high_speed_internet"]
                  }).map(([category, amenities], categoryIndex) => (
                    <div key={category}>
                      <div className="flex items-center mb-4">
                        <div className="bg-gray-100 p-2 rounded-full text-gray-900 mr-3">
                          {getCategoryIcon(category)}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <Check className="h-4 w-4 text-gray-900 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700 capitalize">{amenity.replace(/_/g, " ")}</span>
                          </div>
                        ))}
                      </div>

                      {categoryIndex < Object.entries(room.categorizedAmenities || {}).length - 1 && (
                        <div className="my-6 h-px bg-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Tab */}
            {activeTab === "features" && (
              <div className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Room Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {(room.roomFeatures || [
                        "air_conditioning", 
                        "blackout_curtains", 
                        "soundproofing", 
                        "safe", 
                        "minibar", 
                        "wardrobe"
                      ]).map((feature, index) => (
                        <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="h-2 w-2 rounded-full bg-blue mr-3"></div>
                          <span className="text-sm text-gray-700 capitalize">{feature.replace(/_/g, " ")}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="my-6 h-px bg-gray-200" />

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Bathroom Amenities</h3>

                    {(room.bathrooms || [{
                      type: "En-suite",
                      amenities: {
                        rain_shower: true,
                        bathtub: true,
                        toiletries: true,
                        hairdryer: true,
                        towels: true,
                        mirror: true
                      }
                    }]).map((bathroom, index) => (
                      <div key={index} className="mb-6">
                        <div className="flex items-center mb-3">
                          <ShowerHead className="h-5 w-5 text-gray-900 mr-2" />
                          <h4 className="font-medium text-gray-900">
                            Bathroom {index + 1} - {bathroom.type}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-7">
                          {Object.entries(bathroom.amenities)
                            .filter(([_, value]) => value === true)
                            .slice(0, 9)
                            .map(([key], idx) => (
                              <div key={idx} className="flex items-center">
                                <Check className="h-3.5 w-3.5 text-gray-900 mr-1.5" />
                                <span className="text-sm text-gray-700 capitalize">{key.replace(/_/g, " ")}</span>
                              </div>
                            ))}

                          {Object.entries(bathroom.amenities).filter(([_, value]) => value === true).length > 9 && (
                            <div className="text-sm text-blue font-medium">
                              +{Object.entries(bathroom.amenities).filter(([_, value]) => value === true).length - 9} more
                            </div>
                          )}
                        </div>

                        {index < (room.bathrooms || []).length - 1 && (
                          <div className="my-4 h-px bg-gray-200" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetail;