import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import HouseCard from './HouseCard';

// Define the mock houses data directly in the component
const mockHouses = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    price: 750000,
    address: '123 Main St, City Center',
    description: 'Stunning modern loft with city views',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    position: { lat: 40.7128, lng: -74.0060 },
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format',
  },
  {
    id: '2',
    title: 'Suburban Family Home',
    price: 950000,
    address: '456 Oak Ave, Suburbs',
    description: 'Spacious family home with large backyard',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    position: { lat: 40.7282, lng: -73.9942 },
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format',
  },
];

const mapContainerStyle = {
  width: '100%',
  height: '94vh', // Full viewport height
};

export function MapComponent({showHotelsMap, setShowHotelsMap}) {
  const [selectedHouse, setSelectedHouse] = useState(null); // Local state for selected house
  const center = { lat: 40.7128, lng: -74.0060 }; // Default center (New York)

  return (
    <div className=" fixed inset-10 z-50">
       <div className="fixed bottom-20 right-10 z-50">
                <button className='bg-blue text-white p-2  ' onClick={() => setShowHotelsMap(!showHotelsMap)}>
                    show list
                </button>
            </div>

      <LoadScript googleMapsApiKey="" loadingElement={<div>Loading map...</div>}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={center}
          onClick={() => setSelectedHouse(null)} // Clear selection on map click
          options={{
            styles: [
              {
                featureType: 'all',
                elementType: 'all',
                stylers: [{ saturation: -100 }],
              },
            ],
          }}
        >
          {/* Render markers for each house */}
          {mockHouses.map((house) => (
            console.log({"house":house}),
            <Marker
              key={house.id}
              position={house.position}
              onMouseOver={() => setSelectedHouse(house)}
              onMouseOut={() => setSelectedHouse(null)}
            />
          ))}

          {/* Render InfoWindow for the selected house */}
          {selectedHouse && (
            <InfoWindow
              position={selectedHouse.position}
              onCloseClick={() => setSelectedHouse(null)}
            >
              <div className="max-w-sm">
                <HouseCard house={selectedHouse} />
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}