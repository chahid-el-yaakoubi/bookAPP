"use client"

import { useState } from 'react'
import { AirVent, Navigation, Bluetooth, Usb, Sun, Baby, MapPin, Cigarette, Plus, Minus } from 'lucide-react'

// Options for dropdowns
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid", "Other"]
const transmissionTypes = ["Automatic", "Manual", "Semi-automatic", "CVT"]

// Feature definitions with icons
const featureOptions = [
  { id: 'airConditioning', name: 'Air Conditioning', icon: AirVent, arabicName: 'مكيف الهواء' },
  { id: 'navigation', name: 'Navigation System', icon: Navigation, arabicName: 'نظام الملاحة' },
  { id: 'bluetooth', name: 'Bluetooth', icon: Bluetooth, arabicName: 'البلوتوث' },
  { id: 'usbPort', name: 'USB Port', icon: Usb, arabicName: 'منفذ USB' },
  { id: 'sunroof', name: 'Sunroof', icon: Sun, arabicName: 'فتحة السقف' },
  { id: 'childSeat', name: 'Child Seat', icon: Baby, arabicName: 'مقعد أطفال' },
  { id: 'gpsTracker', name: 'GPS Tracker', icon: MapPin, arabicName: 'جهاز تتبع GPS' },
  { id: 'smokingAllowed', name: 'Smoking Allowed', icon: Cigarette, arabicName: 'يُسمح بالتدخين' },
]

export default function SpecificationsStep({
  formData,
  handleInputChange,
  additionalFeatures = [],
  addAdditionalFeature,
  removeAdditionalFeature,
  handleAdditionalFeatureChange,
}) {
  // Function to handle feature checkbox change
  const handleFeatureChange = (featureId) => {
    const currentValue = formData.features?.[featureId] || false
    handleInputChange("features", featureId, !currentValue)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Car Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="seating" className="block text-sm font-medium text-gray-700">
            Seating Capacity<span className="text-red-500">*</span>
          </label>
          <input
            id="seating"
            type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. 5"
            value={formData.specifications?.seating || ""}
            onChange={(e) => handleInputChange("specifications", "seating", e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
            Fuel Type
          </label>
          <select
            id="fuelType"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.specifications?.fuelType || ""}
            onChange={(e) => handleInputChange("specifications", "fuelType", e.target.value)}
          >
            <option value="">Select fuel type</option>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">
            Transmission
          </label>
          <select
            id="transmission"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={formData.specifications?.transmission || ""}
            onChange={(e) => handleInputChange("specifications", "transmission", e.target.value)}
          >
            <option value="">Select transmission type</option>
            {transmissionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
            Mileage (miles)
          </label>
          <input
            id="mileage"
            type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. 15000"
            value={formData.specifications?.mileage || ""}
            onChange={(e) => handleInputChange("specifications", "mileage", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="fuelEfficiency" className="block text-sm font-medium text-gray-700">
            Fuel Efficiency (MPG)
          </label>
          <input
            id="fuelEfficiency"
            type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. 30"
            value={formData.specifications?.fuelEfficiency || ""}
            onChange={(e) => handleInputChange("specifications", "fuelEfficiency", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="engineSize" className="block text-sm font-medium text-gray-700">
            Engine Size (L)
          </label>
          <input
            id="engineSize"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. 2.5"
            value={formData.specifications?.engineSize || ""}
            onChange={(e) => handleInputChange("specifications", "engineSize", e.target.value)}
          />
        </div>
      </div>

      {/* Features section with checkboxes */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-700 mb-4">Features</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {featureOptions.map((feature) => (
            <div 
              key={feature.id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                formData.features?.[feature.id] ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
              }`}
              onClick={() => handleFeatureChange(feature.id)}
            >
              <div className={`mr-3 p-2 rounded-full ${
                formData.features?.[feature.id] ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
              }`}>
                <feature.icon size={18} />
              </div>
              <div>
                <div className="font-medium text-sm">{feature.name}</div>
                <div className="text-xs text-gray-500">{feature.arabicName}</div>
              </div>
              <input
                type="checkbox"
                className="ml-auto h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formData.features?.[feature.id] || false}
                onChange={() => handleFeatureChange(feature.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Additional features section */}
      <div className="mt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium text-gray-700">Additional Features</h4>
          <button
            type="button"
            onClick={addAdditionalFeature}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={16} className="mr-1" /> Add Feature
          </button>
        </div>

        {additionalFeatures && additionalFeatures.map((feature, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="flex-grow">
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Additional feature (e.g. Rear camera)"
                value={feature}
                onChange={(e) => handleAdditionalFeatureChange(index, e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeAdditionalFeature(index)}
              className="inline-flex items-center p-1 border border-transparent rounded-full text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Remove feature"
            >
              <Minus size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}