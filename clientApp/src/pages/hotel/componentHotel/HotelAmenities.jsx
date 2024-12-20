export const HotelAmenities = () => {
  const amenities = [
    { icon: "🏊‍♂️", name: "Swimming pool" },
    { icon: "🅿️", name: "Free parking" },
    { icon: "🍳", name: "Restaurant" },
    { icon: "📶", name: "Free WiFi" },
    { icon: "❄️", name: "Air conditioning" },
    { icon: "🏋️‍♂️", name: "Fitness center" },
    { icon: "🛁", name: "Private bathroom" },
    { icon: "🌅", name: "Sea view" },
  ];

  return (
    <div className="border-t pt-6">
      <h2 className="text-2xl font-semibold mb-4">Property amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-3 text-gray-600">
            <span className="p-2 bg-blue-50 rounded-full">{amenity.icon}</span>
            <span>{amenity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}; 