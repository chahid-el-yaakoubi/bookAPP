const propertyTypes = [
  { id: 'hotel', label: 'فندق', icon: '🏨' },
  { id: 'apartment', label: 'شقة', icon: '🏢' },
  { id: 'resort', label: 'منتجع', icon: '🌴' },
  { id: 'villa', label: 'فيلا', icon: '🏡' },
  { id: 'guesthouse', label: 'دار ضيافة', icon: '🏠' },
  { id: 'hostel', label: 'نزل', icon: '🛏️' },
  { id: 'boutique', label: 'فندق بوتيك', icon: '✨' },
  { id: 'rental-unit', label: 'شقة للإيجار اليومي', icon: '🏢' },
  { id: 'studio', label: 'استوديو للإيجار اليومي', icon: '🏢' },
  { id: 'penthouse', label: 'بنتهاوس للإيجار اليومي', icon: '🏢' },
  { id: 'riad', label: 'رياض تقليدي للإيجار اليومي', icon: '🏡' },
  { id: 'luxury-villa', label: 'فيلا فاخرة للإيجار اليومي', icon: '🏡' },
  { id: 'boutique-hotel', label: 'فندق بوتيك', icon: '✨' }
];

// const propertyTypes = [
//   { id: 'hotel', label: 'Hotel', icon: '🏨' },
//   { id: 'apartment', label: 'Apartment', icon: '🏢' },
//   { id: 'villa', label: 'Villa', icon: '🏡' },
//   { id: 'cabin', label: 'Cabin', icon: '🌲' },
//   { id: 'guesthouse', label: 'Guesthouse', icon: '🏠' },
//   { id: 'hostel', label: 'Hostel', icon: '🛏️' },
//   { id: 'boutique', label: 'Boutique', icon: '✨' },
//   { id: 'rental-unit', label: 'Daily Rental Apartment', icon: '🏢' },
//   { id: 'studio', label: 'Daily Rental Studio', icon: '🏢' },
//   { id: 'penthouse', label: 'Daily Rental Penthouse', icon: '🏢' },
//   { id: 'riad', label: 'Daily Rental Traditional Riad', icon: '🏡' },
//   { id: 'luxury-villa', label: 'Luxury Villa for Daily Rental', icon: '🏡' },
//   { id: 'boutique-hotel', label: 'Boutique Hotel', icon: '✨' }
// ];



const BasicInformation = ({ propertyData, setPropertyData }) => {
  const handleTypeSelect = (typeId) => {
    setPropertyData(prev => ({
      ...prev,
      type: typeId
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Which of these best describes your place?</h2>
        <div className="grid grid-cols-3 gap-4">
          {propertyTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-black transition-colors ${
                propertyData.type === type.id ? 'border-black' : 'border-gray-200'
              }`}
            >
              <span className="text-2xl">{type.icon}</span>
              <span className="text-sm">{type.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;