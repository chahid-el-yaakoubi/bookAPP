"use client"

export default function MediaStep({ previewImages, handleImageUpload, removeImage }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Car Images</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <div className="flex items-center">
            <label
              htmlFor="images"
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span>Choose files</span>
              <input
                id="images"
                type="file"
                className="sr-only"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </label>
            <p className="ml-3 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>

        {previewImages.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewImages.map((previewImage, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover transition-all group-hover:scale-105"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="text-xs">✕</span>
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400">❓</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Image Guidelines</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Upload clear, well-lit photos of the vehicle</li>
                  <li>Include exterior (front, back, sides) and interior shots</li>
                  <li>The first image will be used as the main display image</li>
                  <li>Recommended: 5-10 high-quality images</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
