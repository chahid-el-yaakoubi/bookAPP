"use client"

export default function AdditionalInfoStep({ formData, handleInputChange }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Describe the car, its condition, special features, etc."
            value={formData.additionalInfo.description}
            onChange={(e) => handleInputChange("additionalInfo", "description", e.target.value)}
          />
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (Internal)
        </label>
        <div className="mt-1">
          <textarea
            id="notes"
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Add any internal notes about this vehicle (not visible to customers)"
            value={formData.additionalInfo.notes}
            onChange={(e) => handleInputChange("additionalInfo", "notes", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
