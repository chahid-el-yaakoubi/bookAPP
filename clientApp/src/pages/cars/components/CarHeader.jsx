import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faMapMarkerAlt, faCalendarAlt, faSearch, faBed, faKey, faTaxi, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const carModels = [
  'Mercedes C-Class', 'BMW 3 Series', 'Audi A4', 'Toyota Corolla', 'Peugeot 208',
  'Renault Clio', 'Volkswagen Golf', 'Ford Fiesta', 'Citroen C3', 'Opel Astra'
];
const locations = [
  'Paris', 'Lyon', 'Marseille', 'Nice', 'Toulouse', 'Bordeaux', 'Strasbourg', 'Lille', 'Nantes', 'Montpellier'
];

const CarHeader = ({ onSearch }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [model, setModel] = useState('');
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const filteredModels = model
    ? carModels.filter(m => m.toLowerCase().startsWith(model.toLowerCase()))
    : [];
  const filteredLocations = pickupLocation
    ? locations.filter(l => l.toLowerCase().startsWith(pickupLocation.toLowerCase()))
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch({ pickupLocation, pickupDate, dropoffDate, model });
  };

  // Navigation button style (active = blue/white, inactive = gray/white)
  const navBtn = (to, icon, label, active) => (
    <Link to={to} className={`min-w-[70px] md:min-w-[100px] flex flex-col md:flex-row md:gap-3 items-center gap-1 py-1 px-1 md:p-3 cursor-pointer transition-all duration-300 rounded-xl ${active ? 'text-white bg-primary-dark group active:scale-95' : 'text-white/80 bg-gray-600 hover:text-orange-500 group'}`}>
      <div className="text-lg md:text-2xl h-6 md:h-7 flex items-center justify-center">
        <FontAwesomeIcon icon={icon} />
      </div>
      <span className="text-[10px] md:text-sm font-medium text-center whitespace-nowrap">{label}</span>
    </Link>
  );

  return (
    <div className="fixed md:relative top-0 flex flex-col items-center z-40 md:z-30 bg-primary md:pb-14 w-full">
      <div className="container-fluid px-4 lg:px-16 xl:px-40 flex flex-col justify-center items-center w-full md:ps-20">
        <div className="w-full p-2 text-center rounded-b-lg overflow-x-auto">
          <div className="flex items-center justify-start gap-2 md:gap-10 mx-auto min-w-max">
            {navBtn('/', faBed, 'House Rental', false)}
            {navBtn('/cars', faCar, 'Car Rental', true)}
            {navBtn('#', faKey, 'Real Estate', false)}
            {navBtn('#', faTaxi, 'Plombers', false)}
          </div>
        </div>
        {/* Search bar desktop */}
        <div className="w-full flex justify-center mt-6">
          <form onSubmit={handleSubmit} className="flex flex-wrap md:flex-nowrap gap-2 w-full max-w-4xl items-center justify-center bg-white rounded-xl shadow p-2">
            {/* Pick-up location with autocomplete */}
            <div className="flex flex-col relative">
              <div className="flex items-center bg-white rounded-lg px-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mx-2 text-blue" />
                <input
                  type="text"
                  placeholder="Pick-up location"
                  value={pickupLocation}
                  onChange={e => { setPickupLocation(e.target.value); setShowLocationSuggestions(true); }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 150)}
                  className="px-2 py-2 bg-transparent outline-none"
                  autoComplete="off"
                />
              </div>
              {showLocationSuggestions && filteredLocations.length > 0 && (
                <ul className="absolute top-12 left-0 w-full bg-white border rounded shadow z-10">
                  {filteredLocations.map((l, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onMouseDown={() => { setPickupLocation(l); setShowLocationSuggestions(false); }}
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Pick-up date */}
            <div className="flex items-center bg-white rounded-lg px-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="mx-2 text-blue" />
              <input
                type="date"
                value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                className="px-2 py-2 bg-transparent outline-none"
              />
            </div>
            {/* Drop-off date */}
            <div className="flex items-center bg-white rounded-lg px-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="mx-2 text-blue" />
              <input
                type="date"
                value={dropoffDate}
                onChange={e => setDropoffDate(e.target.value)}
                className="px-2 py-2 bg-transparent outline-none"
              />
            </div>
            {/* Model with autocomplete */}
            <div className="flex flex-col relative">
              <div className="flex items-center bg-white rounded-lg px-2">
                <FontAwesomeIcon icon={faCar} className="mx-2 text-blue" />
                <input
                  type="text"
                  placeholder="Car model"
                  value={model}
                  onChange={e => { setModel(e.target.value); setShowModelSuggestions(true); }}
                  onFocus={() => setShowModelSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowModelSuggestions(false), 150)}
                  className="px-2 py-2 bg-transparent outline-none"
                  autoComplete="off"
                />
              </div>
              {showModelSuggestions && filteredModels.length > 0 && (
                <ul className="absolute top-12 left-0 w-full bg-white border rounded shadow z-10">
                  {filteredModels.map((m, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onMouseDown={() => { setModel(m); setShowModelSuggestions(false); }}
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Search button */}
            <button
              type="submit"
              className="px-6 py-2 bg-blue text-white rounded-lg font-semibold hover:bg-blue-dark transition flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSearch} /> Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarHeader; 