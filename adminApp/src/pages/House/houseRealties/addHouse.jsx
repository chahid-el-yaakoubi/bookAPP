import React, { useState } from 'react';

// Constants moved to separate files for better organization
import { categories, environment, locations } from './houseData';

const AddHouse = () => {
  const [formData, setFormData] = useState({
    partnerName: '',
    partnerLastName: '',
    phoneNumber: '',
    region: '',
    city: '',
    neighborhood: '',
    type: '',
    nightmonth: '',
    furniture: '',
    apartmentName: '',
    floor: '',
    area: '',
    price: '',
    position: '',
    rooms: [{ typee: 'Single', description: '' }],
    features: {},
    environmentData: {},
    descriptions: [''],
    conditions: {
      arrival: '',
      departure: '',
      smoker: '',
      animal: '',
      holidays: '',
      ageRestriction: '',
      ageRestrictionDsc: '',
      bebebeds: '',
      bedsRestrictionDsc: '',
    }
  });

  const [showEnvironment, setShowEnvironment] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);

  // Handle region change and update cities
  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setFormData(prev => ({ ...prev, region: selectedRegion, city: '' }));
    const cities = locations[selectedRegion] || [];
    setAvailableCities(cities.sort());
  };

  // Handle adding new room
  const handleAddRoom = () => {
    setFormData(prev => ({
      ...prev,
      rooms: [...prev.rooms, { typee: 'Single', description: '' }]
    }));
  };

  // Handle adding new description
  const handleAddDescription = () => {
    setFormData(prev => ({
      ...prev,
      descriptions: [...prev.descriptions, '']
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/user/addhouse.html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        window.location.href = '/dataHouse';
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Ajouter des informations sur la maison
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Partner Information Section */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Informations sur les partenaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom:</label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter partner's name"
                value={formData.partnerName}
                onChange={e => setFormData(prev => ({ ...prev, partnerName: e.target.value }))}
              />
            </div>
            {/* Add other partner fields similarly */}
          </div>
        </section>

        {/* Apartment Information Section */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Apartment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.region}
              onChange={handleRegionChange}
            >
              <option value="" disabled>Région</option>
              {Object.keys(locations).map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            {/* Add other apartment fields similarly */}
          </div>
        </section>

        {/* Rooms Section */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Chambres</h3>
          {formData.rooms.map((room, index) => (
            <div key={index} className="p-4 border rounded-md space-y-4">
              <h4 className="font-medium">Chambre #{index + 1}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  className="rounded-md border-gray-300 shadow-sm"
                  value={room.typee}
                  onChange={e => {
                    const newRooms = [...formData.rooms];
                    newRooms[index].typee = e.target.value;
                    setFormData(prev => ({ ...prev, rooms: newRooms }));
                  }}
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                </select>
                <textarea
                  className="rounded-md border-gray-300 shadow-sm"
                  rows="2"
                  placeholder="Description"
                  value={room.description}
                  onChange={e => {
                    const newRooms = [...formData.rooms];
                    newRooms[index].description = e.target.value;
                    setFormData(prev => ({ ...prev, rooms: newRooms }));
                  }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
            onClick={handleAddRoom}
          >
            Ajouter chambre
          </button>
        </section>

        {/* Features Section */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Caractéristiques de la maison</h3>
          {categories.map(category => (
            <div key={category.section} className="space-y-2">
              <h5 className="font-medium">{category.section}</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {category.items.map(item => (
                  <div key={item} className="flex items-center">
                    <input
                      type="checkbox"
                      id={item}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      onChange={e => {
                        const newFeatures = { ...formData.features };
                        if (!newFeatures[category.section]) {
                          newFeatures[category.section] = [];
                        }
                        if (e.target.checked) {
                          newFeatures[category.section].push(item);
                        } else {
                          newFeatures[category.section] = newFeatures[category.section]
                            .filter(i => i !== item);
                        }
                        setFormData(prev => ({ ...prev, features: newFeatures }));
                      }}
                    />
                    <label htmlFor={item} className="ml-2 text-sm">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Submit Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Add House
          </button>
          <button
            type="reset"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHouse; 