"use client"

// Options for dropdowns
const categories = [
  "Economy",
  "Compact",
  "Mid-size",
  "Full-size",
  "SUV",
  "Luxury",
  "Sports",
  "Convertible",
  "Van",
  "Truck",
  "Electric",
  "Hybrid",
]

import { useState, useEffect, useRef } from 'react';

const carBrands = [
  "Dacia", "Renault", "Peugeot", "Citroën", "Hyundai", "Kia", "Toyota",
  "Volkswagen", "Mercedes-Benz", "BMW", "Audi", "Ford", "Fiat", "Seat",
  "Skoda", "Nissan", "Suzuki", "Chevrolet", "Jeep", "Mitsubishi", "Mazda",
  "Opel", "Honda", "Volvo", "Land Rover", "Mini", "Jaguar", "Chery",
  "Changan", "Great Wall", "BYD", "Tesla", "Lexus", "Porsche", "Subaru",
  "Alfa Romeo", "Lancia", "Lada", "Geely", "MG", "SsangYong", "Daihatsu",
  "Isuzu", "Infiniti", "Acura", "Lincoln", "Cadillac", "Buick", "GMC",
  "Chrysler", "Dodge", "Ram", "Genesis", "Smart", "Maybach", "Bentley",
  "Rolls-Royce", "Lamborghini", "Ferrari", "Maserati", "Aston Martin",
  "McLaren", "Bugatti", "Lotus", "Alpine", "Abarth", "Cupra", "DS Automobiles",
  "Tata", "Haval", "FAW", "Dongfeng", "BAIC", "Brilliance", "Zotye", "JAC",
  "Proton", "Perodua"
].sort();

  function CarMakeSelect({ formData, handleInputChange }) {
  const [searchTerm, setSearchTerm] = useState(formData.carDetails?.carMake || '');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const filteredBrands = carBrands.filter(brand =>
    brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev =>
        Math.min(prev + 1, filteredBrands.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelection(filteredBrands[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelection = (brand) => {
    setSearchTerm(brand);
    setIsOpen(false);
    handleInputChange("carDetails", "carMake", brand);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor="carMake" className="block text-sm font-medium text-gray-700">
        Make<span className="text-red-500 text-xl">*</span>
      </label>
      <div className="relative mt-1">
        <input
          id="carMake"
          type="text"
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search car make..."
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            setIsOpen(true);
            setHighlightedIndex(-1);
            handleInputChange("carDetails", "carMake", value);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          required
        />
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand, index) => (
                <div
                  key={brand}
                  className={`cursor-default select-none relative py-2 pl-3 pr-9 ${highlightedIndex === index ? 'bg-indigo-100' : 'hover:bg-indigo-50'
                    }`}
                  onClick={() => handleSelection(brand)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span className="font-normal block truncate">{brand}</span>
                  {formData.carDetails?.carMake === brand && (
                    <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                      ✓
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500">
                No brands found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



const statusOptions = ["Available", "Unavailable", "Maintenance", "Rented"]

export default function CarDetailsStep({ formData, handleInputChange, handleDirectChange }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Basic Car Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <CarMakeSelect
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="carModel" className="block text-sm font-medium text-gray-700">
            Model<span className="text-red-500">*</span>
          </label>
          <input
            id="carModel"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. Camry"
            value={formData.carDetails.carModel}
            onChange={(e) => handleInputChange("carDetails", "carModel", e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Year<span className="text-red-500">*</span>
          </label>
          <input
            id="year"
            type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. 2023"
            value={formData.carDetails.year}
            onChange={(e) => handleInputChange("carDetails", "year", e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            id="color"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. Silver"
            value={formData.carDetails.color}
            onChange={(e) => handleInputChange("carDetails", "color", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700">
            License Plate Number
          </label>
          <input
            id="plateNumber"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. ABC123"
            value={formData.carDetails.plateNumber}
            onChange={(e) => handleInputChange("carDetails", "plateNumber", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
            VIN
          </label>
          <input
            id="vin"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Vehicle Identification Number"
            value={formData.carDetails.vin}
            onChange={(e) => handleInputChange("carDetails", "vin", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.category}
          onChange={(e) => handleDirectChange("category", e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.status}
          onChange={(e) => handleDirectChange("status", e.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          id="verified"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={formData.verification.isVerified}
          onChange={(e) => handleInputChange("verification", "isVerified", e.target.checked)}
        />
        <label htmlFor="verified" className="ml-2 block text-sm text-gray-700">
          Mark as verified
        </label>
      </div>
    </div>
  )
}
