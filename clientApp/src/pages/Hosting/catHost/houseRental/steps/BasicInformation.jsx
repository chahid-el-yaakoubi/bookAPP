const propertyTypes = [
  { id: 'house', label: 'House', icon: '🏠' },
  { id: 'apartment', label: 'Apartment', icon: '🏢' },
  { id: 'barn', label: 'Barn', icon: '🏚' },
  { id: 'bed_breakfast', label: 'Bed & breakfast', icon: '☕' },
  { id: 'boat', label: 'Boat', icon: '⛵' },
  { id: 'cabin', label: 'Cabin', icon: '🏡' },
  { id: 'camper', label: 'Camper/RV', icon: '🚐' },
  { id: 'casa_particular', label: 'Casa particular', icon: '🏘' },
  { id: 'castle', label: 'Castle', icon: '🏰' },
  { id: 'cave', label: 'Cave', icon: '⛰' },
  { id: 'container', label: 'Container', icon: '📦' },
  { id: 'cycladic', label: 'Cycladic home', icon: '🏺' },
  { id: 'dammuso', label: 'Dammuso', icon: '🏘' },
  { id: 'dome', label: 'Dome', icon: '🏗' },
  { id: 'earth_home', label: 'Earth home', icon: '🌍' },
  { id: 'farm', label: 'Farm', icon: '🌾' },
  { id: 'guesthouse', label: 'Guesthouse', icon: '🏠' },
  { id: 'hotel', label: 'Hotel', icon: '🏨' }
];

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