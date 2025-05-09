"use client"

import { useState } from "react"

// Import step components
import CarDetailsStep from "./steps/car-details-step"
import SpecificationsStep from "./steps/specifications-step"
import LocationStep from "./steps/location-step"
import PricingStep from "./steps/pricing-step"
import MediaStep from "./steps/media-step"
import AdditionalInfoStep from "./steps/additional-info-step"

// Mock API function - replace with actual implementation
const addCar = async (data) => {
  // Simulate API call
  return { status: 200 }
}

export default function AddCar() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("carDetails")
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [features, setFeatures] = useState([{ name: "", description: "" }])

  // Form state
  const [formData, setFormData] = useState({
    carDetails: {
      carMake: "",
      carModel: "",
      year: "",
      color: "",
      plateNumber: "",
      vin: "",
    },
    specifications: {
      seating: "",
      fuelType: "Petrol",
      transmission: "Automatic",
      mileage: "",
      fuelEfficiency: "",
      engineSize: "",
      features: [],
    },
    location: {
      address: "",
      city: "",
      region: "",
      postalCode: "",
      country: "United States",
      coordinates: {
        latitude: "",
        longitude: "",
      },
    },
    category: "Economy",
    pricing: {
      hourlyRate: "",
      dailyRate: "",
      weeklyRate: "",
      monthlyRate: "",
      depositAmount: "",
      discounts: {
        weekly: "",
        monthly: "",
      },
    },
    status: "Available",
    verification: {
      isVerified: false,
      documents: [],
      verificationDate: null,
    },
    media: {
      mainImage: "",
      images: [],
    },
    additionalInfo: {
      description: "",
      notes: "",
    },
  })

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    if (field.includes(".")) {
      const [parentField, childField] = field.split(".")
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [parentField]: {
            ...formData[section][parentField],
            [childField]: value,
          },
        },
      })
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      })
    }
  }

  // Handle direct field changes (for fields not in sections)
  const handleDirectChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Add/remove feature fields
  const addFeature = () => {
    setFeatures([...features, { name: "", description: "" }])
  }

  const removeFeature = (index) => {
    const updatedFeatures = [...features]
    updatedFeatures.splice(index, 1)
    setFeatures(updatedFeatures)
  }

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...features]
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      [field]: value,
    }
    setFeatures(updatedFeatures)
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    if (!e.target.files) return

    const filesArray = Array.from(e.target.files)
    setImages([...images, ...filesArray])

    // Generate preview URLs
    const newPreviewImages = filesArray.map((file) => URL.createObjectURL(file))
    setPreviewImages([...previewImages, ...newPreviewImages])
  }

  const removeImage = (index) => {
    const updatedImages = [...images]
    const updatedPreviews = [...previewImages]

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviews[index])

    updatedImages.splice(index, 1)
    updatedPreviews.splice(index, 1)

    setImages(updatedImages)
    setPreviewImages(updatedPreviews)
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Update features in formData
      const updatedFormData = {
        ...formData,
        specifications: {
          ...formData.specifications,
          features: features.filter((feature) => feature.name.trim() !== ""),
        },
      }

      // Handle image upload (in a real app, this would upload to a server)
      if (images.length > 0) {
        // Simulate image upload by setting the first image as main image
        // In a real application, you would upload to a server and get back URLs
        updatedFormData.media.mainImage = previewImages[0] // This is temporary, should be a URL in production
        updatedFormData.media.images = previewImages // These should be URLs in production
      }

      // Send data to API
      const response = await addCar(updatedFormData)

      if (response.status === 201 || response.status === 200) {
        // Success! Redirect to cars list
        window.location.href = "/iAmAdmin/cars"
      } else {
        setError("Failed to add car. Please try again.")
      }
    } catch (err) {
      console.error("Error adding car:", err)
      setError(err.message || "An error occurred while adding the car.")
    } finally {
      setIsLoading(false)
    }
  }

  // Tabs configuration
  const tabs = [
    { id: "carDetails", label: "Car Details", icon: "🚗" },
    { id: "specifications", label: "Specifications", icon: "⚙️" },
    { id: "location", label: "Location", icon: "📍" },
    { id: "pricing", label: "Pricing", icon: "💰" },
    { id: "media", label: "Media", icon: "🖼️" },
    { id: "additional", label: "Additional Info", icon: "📝" },
  ]

  // Check if current tab is complete (basic validation)
  const isTabComplete = (tabId) => {
    switch (tabId) {
      case "carDetails":
        return (
          formData.carDetails.carMake.trim() !== "" &&
          formData.carDetails.carModel.trim() !== "" &&
          formData.carDetails.year.trim() !== ""
        )
      case "specifications":
        return formData.specifications.seating.trim() !== ""
      case "location":
        return formData.location.city.trim() !== "" && formData.location.region.trim() !== ""
      case "pricing":
        return formData.pricing.dailyRate.trim() !== "" && formData.pricing.hourlyRate.trim() !== ""
      case "media":
        return true // Media is optional
      case "additional":
        return true // Additional info is optional
      default:
        return false
    }
  }

  // Get next tab
  const getNextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex < tabs.length - 1) {
      return tabs[currentIndex + 1].id
    }
    return null
  }

  // Navigate to next tab
  const handleNextTab = () => {
    const nextTab = getNextTab()
    if (nextTab) {
      setActiveTab(nextTab)
      window.scrollTo(0, 0)
    }
  }

  // Render the active step component
  const renderActiveStep = () => {
    switch (activeTab) {
      case "carDetails":
        return (
          <CarDetailsStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleDirectChange={handleDirectChange}
          />
        )
      case "specifications":
        return (
          <SpecificationsStep
            formData={formData}
            handleInputChange={handleInputChange}
            features={features}
            addFeature={addFeature}
            removeFeature={removeFeature}
            handleFeatureChange={handleFeatureChange}
          />
        )
      case "location":
        return <LocationStep formData={formData} handleInputChange={handleInputChange} />
      case "pricing":
        return <PricingStep formData={formData} handleInputChange={handleInputChange} />
      case "media":
        return (
          <MediaStep previewImages={previewImages} handleImageUpload={handleImageUpload} removeImage={removeImage} />
        )
      case "additional":
        return <AdditionalInfoStep formData={formData} handleInputChange={handleInputChange} />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => (window.location.href = "/iAmAdmin/cars")}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="mr-2">←</span> Back to Cars
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Add New Car</h2>
          <p className="mt-1 text-sm text-gray-500">Fill out the information below to add a new car to your fleet.</p>
        </div>

        {error && (
          <div className="mx-4 my-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">✕</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tabs navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-4 text-center border-b-2 font-medium text-sm whitespace-nowrap mx-3
                    ${
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {isTabComplete(tab.id) && <span className="ml-2 text-green-500">✓</span>}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div className="px-4 py-5 sm:p-6">{renderActiveStep()}</div>

          {/* Form actions */}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => (window.location.href = "/iAmAdmin/cars")}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <div className="flex space-x-3">
                {getNextTab() ? (
                  <button
                    type="button"
                    onClick={handleNextTab}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={!isTabComplete(activeTab)}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="mr-2">💾</span> Save Car
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
