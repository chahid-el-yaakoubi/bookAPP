"use client"

import { useState, useEffect } from "react"
import { createRegion, getRegions, updateRegion, deleteRegion } from "../../../Lib/api"

export default function RegionCityManager() {
  // Main state for our nested data
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Form states
  const [newRegionNameEnglish, setNewRegionNameEnglish] = useState("")
  const [newRegionNameArabic, setNewRegionNameArabic] = useState("")
  const [newCityNameEnglish, setNewCityNameEnglish] = useState("")
  const [newCityNameArabic, setNewCityNameArabic] = useState("")
  const [newNeighborhoodEnglish, setNewNeighborhoodEnglish] = useState("")
  const [newNeighborhoodArabic, setNewNeighborhoodArabic] = useState("")

  // Edit form states
  const [editNameEnglish, setEditNameEnglish] = useState("")
  const [editNameArabic, setEditNameArabic] = useState("")
  const [editValueEnglish, setEditValueEnglish] = useState("")
  const [editValueArabic, setEditValueArabic] = useState("")

  // Selected items for adding children
  const [selectedRegionId, setSelectedRegionId] = useState(null)
  const [selectedCityId, setSelectedCityId] = useState(null)

  // UI states
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    type: "region",
    regionId: "",
    name: "",
  })
  const [editItem, setEditItem] = useState({
    isOpen: false,
    type: "region",
    regionId: "",
    currentValue: {},
  })
  const [activeTab, setActiveTab] = useState("manage")
  const [openAccordions, setOpenAccordions] = useState({})

  // Fetch regions on component mount
  useEffect(() => {
    fetchRegions()
  }, [])

  // Function to fetch regions from API
  const fetchRegions = async () => {
    try {
      setLoading(true)
      const response = await getRegions()
      if (response.status === 200) {
        setRegions(response.data)
        showToast("Data Loaded", "Regions loaded successfully.")
      } else {
        setError("Failed to load regions")
        showToast("Error", "Failed to load regions", "destructive")
      }
    } catch (err) {
      setError("Error fetching regions: " + err.message)
      showToast("Error", "Failed to load regions: " + err.message, "destructive")
    } finally {
      setLoading(false)
    }
  }

  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9)

  // Toast notification function
  const showToast = (title, description, variant = "default") => {
    const toastElement = document.createElement("div")
    toastElement.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${variant === "destructive" ? "bg-red-600 text-white" : "bg-white border border-gray-200"
      }`

    toastElement.innerHTML = `
      <div class="font-medium ${variant === "destructive" ? "text-white" : "text-gray-900"}">${title}</div>
      <div class="${variant === "destructive" ? "text-white opacity-90" : "text-gray-600"} text-sm">${description}</div>
    `

    document.body.appendChild(toastElement)

    setTimeout(() => {
      toastElement.classList.add("opacity-0", "transition-opacity", "duration-300")
      setTimeout(() => document.body.removeChild(toastElement), 300)
    }, 3000)
  }

  // Accordion toggle function
  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Add a new region
  const addRegion = async () => {
    if (!newRegionNameEnglish.trim() || !newRegionNameArabic.trim()) return

    const newRegion = {
      id: generateId(),
      regionNameEnglish: newRegionNameEnglish,
      regionNameArabic: newRegionNameArabic,
      cities: [],
    }

    try {
      const response = await createRegion(newRegion)
      if (response.status === 200) {
        setRegions([...regions, response.data])
        setNewRegionNameEnglish("")
        setNewRegionNameArabic("")
        showToast("Region Added", `${newRegionNameEnglish} has been added successfully.`)
      } else {
        showToast("Error", "Failed to add region", "destructive")
      }
    } catch (err) {
      showToast("Error", "Failed to add region: " + err.message, "destructive")
    }
  }

  // Add a new city to a region
  const addCity = async () => {
    if (!newCityNameEnglish.trim() || !newCityNameArabic.trim() || !selectedRegionId) return

    const newCity = {
      id: generateId(),
      cityNameEnglish: newCityNameEnglish,
      cityNameArabic: newCityNameArabic,
      neighborhoods: [],
    }

    try {
      // Find the selected region to update
      const selectedRegion = regions.find(region => region.id === selectedRegionId)
      if (!selectedRegion) return

      // Create updated region with new city
      const updatedRegion = {
        ...selectedRegion,
        cities: [...selectedRegion.cities, newCity]
      }

      const response = await updateRegion(selectedRegionId, updatedRegion)
      if (response.status === 200) {
        setRegions(
          regions.map((region) => {
            if (region.id === selectedRegionId) {
              return response.data
            }
            return region
          })
        )
        setNewCityNameEnglish("")
        setNewCityNameArabic("")
        showToast("City Added", `${newCityNameEnglish} has been added successfully.`)
      } else {
        showToast("Error", "Failed to add city", "destructive")
      }
    } catch (err) {
      showToast("Error", "Failed to add city: " + err.message, "destructive")
    }
  }

  // Add a new neighborhood to a city
  const addNeighborhood = async () => {
    if (!newNeighborhoodEnglish.trim() || !newNeighborhoodArabic.trim() || !selectedRegionId || !selectedCityId) return

    const newNeighborhood = {
      id: generateId(),
      valueEnglish: newNeighborhoodEnglish,
      valueArabic: newNeighborhoodArabic,
    }

    try {
      // Find the selected region and city to update
      const selectedRegion = regions.find(region => region.id === selectedRegionId)
      if (!selectedRegion) return

      // Create updated region with new neighborhood
      const updatedRegion = {
        ...selectedRegion,
        cities: selectedRegion.cities.map((city) => {
          if (city.id === selectedCityId) {
            return {
              ...city,
              neighborhoods: [...city.neighborhoods, newNeighborhood],
            }
          }
          return city
        })
      }

      const response = await updateRegion(selectedRegionId, updatedRegion)
      if (response.status === 200) {
        setRegions(
          regions.map((region) => {
            if (region.id === selectedRegionId) {
              return response.data
            }
            return region
          })
        )
        setNewNeighborhoodEnglish("")
        setNewNeighborhoodArabic("")
        showToast("Neighborhood Added", `${newNeighborhoodEnglish} has been added successfully.`)
      } else {
        showToast("Error", "Failed to add neighborhood", "destructive")
      }
    } catch (err) {
      showToast("Error", "Failed to add neighborhood: " + err.message, "destructive")
    }
  }

  // Edit functions
  const openEditDialog = (type, regionId, cityId, neighborhoodId) => {
    let currentValue = {}

    if (type === "region") {
      const region = regions.find((r) => r.id === regionId)
      if (region) {
        currentValue = {
          nameEnglish: region.regionNameEnglish,
          nameArabic: region.regionNameArabic,
        }
        setEditNameEnglish(region.regionNameEnglish)
        setEditNameArabic(region.regionNameArabic)
      }
    } else if (type === "city" && cityId) {
      const region = regions.find((r) => r.id === regionId)
      const city = region?.cities.find((c) => c.id === cityId)
      if (city) {
        currentValue = {
          nameEnglish: city.cityNameEnglish,
          nameArabic: city.cityNameArabic,
        }
        setEditNameEnglish(city.cityNameEnglish)
        setEditNameArabic(city.cityNameArabic)
      }
    } else if (type === "neighborhood" && cityId && neighborhoodId) {
      const region = regions.find((r) => r.id === regionId)
      const city = region?.cities.find((c) => c.id === cityId)
      const neighborhood = city?.neighborhoods.find((n) => n.id === neighborhoodId)
      if (neighborhood) {
        currentValue = {
          valueEnglish: neighborhood.valueEnglish,
          valueArabic: neighborhood.valueArabic,
        }
        setEditValueEnglish(neighborhood.valueEnglish)
        setEditValueArabic(neighborhood.valueArabic)
      }
    }

    setEditItem({
      isOpen: true,
      type,
      regionId,
      cityId,
      neighborhoodId,
      currentValue,
    })
  }

  const handleEdit = async () => {
    const { type, regionId, cityId, neighborhoodId } = editItem

    try {
      if (type === "region") {
        if (!editNameEnglish.trim() || !editNameArabic.trim()) return

        const regionToUpdate = regions.find(r => r.id === regionId)
        if (!regionToUpdate) return

        const updatedRegion = {
          ...regionToUpdate,
          regionNameEnglish: editNameEnglish,
          regionNameArabic: editNameArabic,
        }

        const response = await updateRegion(regionId, updatedRegion)
        if (response.status === 200) {
          setRegions(
            regions.map((region) => {
              if (region.id === regionId) {
                return response.data
              }
              return region
            })
          )
          showToast("Region Updated", `Region has been updated successfully.`)
        } else {
          showToast("Error", "Failed to update region", "destructive")
        }
      } else if (type === "city" && cityId) {
        if (!editNameEnglish.trim() || !editNameArabic.trim()) return

        const regionToUpdate = regions.find(r => r.id === regionId)
        if (!regionToUpdate) return

        const updatedRegion = {
          ...regionToUpdate,
          cities: regionToUpdate.cities.map((city) => {
            if (city.id === cityId) {
              return {
                ...city,
                cityNameEnglish: editNameEnglish,
                cityNameArabic: editNameArabic,
              }
            }
            return city
          }),
        }

        const response = await updateRegion(regionId, updatedRegion)
        if (response.status === 200) {
          setRegions(
            regions.map((region) => {
              if (region.id === regionId) {
                return response.data
              }
              return region
            })
          )
          showToast("City Updated", `City has been updated successfully.`)
        } else {
          showToast("Error", "Failed to update city", "destructive")
        }
      } else if (type === "neighborhood" && cityId && neighborhoodId) {
        if (!editValueEnglish.trim() || !editValueArabic.trim()) return

        const regionToUpdate = regions.find(r => r.id === regionId)
        if (!regionToUpdate) return

        const updatedRegion = {
          ...regionToUpdate,
          cities: regionToUpdate.cities.map((city) => {
            if (city.id === cityId) {
              return {
                ...city,
                neighborhoods: city.neighborhoods.map((neighborhood) => {
                  if (neighborhood.id === neighborhoodId) {
                    return {
                      ...neighborhood,
                      valueEnglish: editValueEnglish,
                      valueArabic: editValueArabic,
                    }
                  }
                  return neighborhood
                }),
              }
            }
            return city
          }),
        }

        const response = await updateRegion(regionId, updatedRegion)
        if (response.status === 200) {
          setRegions(
            regions.map((region) => {
              if (region.id === regionId) {
                return response.data
              }
              return region
            })
          )
          showToast("Neighborhood Updated", `Neighborhood has been updated successfully.`)
        } else {
          showToast("Error", "Failed to update neighborhood", "destructive")
        }
      }
    } catch (err) {
      showToast("Error", "Failed to update: " + err.message, "destructive")
    }

    closeEditDialog()
  }

  const closeEditDialog = () => {
    setEditItem({
      ...editItem,
      isOpen: false,
    })
    setEditNameEnglish("")
    setEditNameArabic("")
    setEditValueEnglish("")
    setEditValueArabic("")
  }

  // Delete functions
  const confirmDelete = (type, regionId, name, cityId, neighborhoodId) => {
    setDeleteConfirmation({
      isOpen: true,
      type,
      regionId,
      cityId,
      neighborhoodId,
      name,
    })
  }

  const handleDelete = async () => {
    const { type, regionId, cityId, neighborhoodId } = deleteConfirmation

    try {
      if (type === "region") {
        const response = await deleteRegion(regionId)
        if (response.status === 200) {
          setRegions(regions.filter((region) => region.id !== regionId))
          if (selectedRegionId === regionId) {
            setSelectedRegionId(null)
            setSelectedCityId(null)
          }
          showToast("Region Deleted", `${deleteConfirmation.name} and all its contents have been deleted.`, "destructive")
        } else {
          showToast("Error", "Failed to delete region", "destructive")
        }
      } else if (type === "city" && cityId) {
        const regionToUpdate = regions.find(r => r.id === regionId)
        if (!regionToUpdate) return

        const updatedRegion = {
          ...regionToUpdate,
          cities: regionToUpdate.cities.filter((city) => city.id !== cityId),
        }

        const response = await updateRegion(regionId, updatedRegion)
        if (response.status === 200) {
          setRegions(
            regions.map((region) => {
              if (region.id === regionId) {
                return response.data
              }
              return region
            })
          )
          if (selectedCityId === cityId) {
            setSelectedCityId(null)
          }
          showToast(
            "City Deleted",
            `${deleteConfirmation.name} and all its neighborhoods have been deleted.`,
            "destructive",
          )
        } else {
          showToast("Error", "Failed to delete city", "destructive")
        }
      } else if (type === "neighborhood" && cityId && neighborhoodId) {
        const regionToUpdate = regions.find(r => r.id === regionId)
        if (!regionToUpdate) return

        const updatedRegion = {
          ...regionToUpdate,
          cities: regionToUpdate.cities.map((city) => {
            if (city.id === cityId) {
              return {
                ...city,
                neighborhoods: city.neighborhoods.filter((n) => n.id !== neighborhoodId),
              }
            }
            return city
          }),
        }

        const response = await updateRegion(regionId, updatedRegion)
        if (response.status === 200) {
          setRegions(
            regions.map((region) => {
              if (region.id === regionId) {
                return response.data
              }
              return region
            })
          )
          showToast("Neighborhood Deleted", `${deleteConfirmation.name} has been deleted.`, "destructive")
        } else {
          showToast("Error", "Failed to delete neighborhood", "destructive")
        }
      }
    } catch (err) {
      showToast("Error", "Failed to delete: " + err.message, "destructive")
    }

    setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })
  }

  const closeDeleteDialog = () => {
    setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })
  }
  // Get counts
  const getCounts = () => {
    let cityCount = 0
    let neighborhoodCount = 0

    regions.forEach((region) => {
      cityCount += region.cities.length
      region.cities.forEach((city) => {
        neighborhoodCount += city.neighborhoods.length
      })
    })

    return {
      regions: regions.length,
      cities: cityCount,
      neighborhoods: neighborhoodCount,
    }
  }

  const counts = getCounts()

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Main content */}
      <main className={`pt-16 transition-all duration-300 ease-in-out`}>
        <div className="p-6">
          {/* Dashboard stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow border-l-4 border-blue">
              <div className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Regions</p>
                  <h3 className="text-3xl font-bold text-blue">{counts.regions}</h3>
                </div>
                <div className="p-3 bg-primary rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow border-l-4 border-orange-500">
              <div className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Cities</p>
                  <h3 className="text-3xl font-bold text-orange-500">{counts.cities}</h3>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-orange-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow border-l-4 border-blue">
              <div className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Neighborhoods</p>
                  <h3 className="text-3xl font-bold text-blue">{counts.neighborhoods}</h3>
                </div>
                <div className="p-3 bg-primary rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main content tabs */}
          <div className="w-full">
            <div className="mb-6 border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("manage")}
                  className={`py-2 px-4 font-medium ${activeTab === "manage" ? "text-blue border-b-2 border-blue" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Manage Locations
                </button>
                <button
                  onClick={() => setActiveTab("view")}
                  className={`py-2 px-4 font-medium ${activeTab === "view" ? "text-blue border-b-2 border-blue" : "text-gray-500 hover:text-gray-700"}`}
                >
                  View Structure
                </button>
                <button
                  onClick={() => setActiveTab("data")}
                  className={`py-2 px-4 font-medium ${activeTab === "data" ? "text-blue border-b-2 border-blue" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Data Preview
                </button>
              </div>
            </div>

            {/* Manage Tab */}
            {activeTab === "manage" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Add Region Form */}
                <div className="bg-white rounded-lg shadow">
                  <div className="bg-primary border-b p-4">
                    <h3 className="text-blue font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                        <line x1="8" y1="2" x2="8" y2="18" />
                        <line x1="16" y1="6" x2="16" y2="22" />
                      </svg>
                      Add Region
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Region Name (English)</label>
                        <input
                          type="text"
                          placeholder="Region Name in English"
                          value={newRegionNameEnglish}
                          onChange={(e) => setNewRegionNameEnglish(e.target.value)}
                          className="w-full px-3 py-2 border border-blue rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Region Name (Arabic)</label>
                        <input
                          type="text"
                          placeholder="Region Name in Arabic"
                          value={newRegionNameArabic}
                          onChange={(e) => setNewRegionNameArabic(e.target.value)}
                          className="w-full px-3 py-2 border border-blue rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                        />
                      </div>

                      <button
                        onClick={addRegion}
                        className="w-full py-2 px-4 bg-primary hover:bg-primary text-white font-medium rounded-md flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Add Region
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add City Form */}
                <div className="bg-white rounded-lg shadow">
                  <div className="bg-orange-50 border-b p-4">
                    <h3 className="text-orange-600 font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      Add City
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Region</label>
                        <select
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          value={selectedRegionId || ""}
                          onChange={(e) => setSelectedRegionId(e.target.value || null)}
                        >
                          <option value="">Select a Region</option>
                          {regions.map((region) => (
                            <option key={region.id} value={region.id}>
                              {region.regionNameEnglish}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">City Name (English)</label>
                        <input
                          type="text"
                          placeholder="City Name in English"
                          value={newCityNameEnglish}
                          onChange={(e) => setNewCityNameEnglish(e.target.value)}
                          disabled={!selectedRegionId}
                          className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:text-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">City Name (Arabic)</label>
                        <input
                          type="text"
                          placeholder="City Name in Arabic"
                          value={newCityNameArabic}
                          onChange={(e) => setNewCityNameArabic(e.target.value)}
                          disabled={!selectedRegionId}
                          className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:text-gray-400"
                        />
                      </div>

                      <button
                        onClick={addCity}
                        disabled={!selectedRegionId}
                        className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Add City
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add Neighborhood Form */}
                <div className="bg-white rounded-lg shadow">
                  <div className="bg-primary border-b p-4">
                    <h3 className="text-blue font-medium flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      Add Neighborhood
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Region</label>
                        <select
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                          value={selectedRegionId || ""}
                          onChange={(e) => {
                            setSelectedRegionId(e.target.value || null)
                            setSelectedCityId(null)
                          }}
                        >
                          <option value="">Select a Region</option>
                          {regions.map((region) => (
                            <option key={region.id} value={region.id}>
                              {region.regionNameEnglish}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select City</label>
                        <select
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                          value={selectedCityId || ""}
                          onChange={(e) => setSelectedCityId(e.target.value || null)}
                          disabled={!selectedRegionId}
                        >
                          <option value="">Select a City</option>
                          {selectedRegionId &&
                            regions
                              .find((r) => r.id === selectedRegionId)
                              ?.cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                  {city.cityNameEnglish}
                                </option>
                              ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Neighborhood Name (English)</label>
                        <input
                          type="text"
                          placeholder="English Name"
                          value={newNeighborhoodEnglish}
                          onChange={(e) => setNewNeighborhoodEnglish(e.target.value)}
                          disabled={!selectedCityId}
                          className="w-full px-3 py-2 border border-blue rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue disabled:bg-gray-100 disabled:text-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Neighborhood Name (Arabic)</label>
                        <input
                          type="text"
                          placeholder="Arabic Name"
                          value={newNeighborhoodArabic}
                          onChange={(e) => setNewNeighborhoodArabic(e.target.value)}
                          disabled={!selectedCityId}
                          className="w-full px-3 py-2 border border-blue rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue disabled:bg-gray-100 disabled:text-gray-400"
                        />
                      </div>

                      <button
                        onClick={addNeighborhood}
                        disabled={!selectedCityId}
                        className="w-full py-2 px-4 bg-primary hover:bg-primary text-white font-medium rounded-md flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Add Neighborhood
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Structure Tab */}
            {activeTab === "view" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Location Structure</h3>

                {regions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border border-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-300 mb-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                      <line x1="8" y1="2" x2="8" y2="18" />
                      <line x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                    <p className="text-gray-500 font-medium">No regions have been added yet</p>
                    <p className="text-gray-400 text-sm mt-1">Add your first region to get started</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {regions.map((region) => (
                      <div key={region.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div
                          className="bg-blue-50 px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => toggleAccordion(region.id)}
                        >
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-lg mr-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                                <line x1="8" y1="2" x2="8" y2="18" />
                                <line x1="16" y1="6" x2="16" y2="22" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{region.regionNameEnglish}</h4>
                              <p className="text-sm text-gray-500">{region.regionNameArabic}</p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog("region", region.id);
                              }}
                              className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors mr-2"
                              aria-label="Edit region"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                              </svg>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete("region", region.id, region.regionNameEnglish);
                              }}
                              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors mr-2"
                              aria-label="Delete region"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>

                            <div
                              className={`p-1 rounded-full transition-colors ${openAccordions[region.id] ? "bg-blue-100" : "bg-transparent"}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 text-blue-600 transition-transform ${openAccordions[region.id] ? "transform rotate-180" : ""}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {openAccordions[region.id] && (
                          <div className="bg-white p-5 border-t border-gray-200">
                            {region.cities.length === 0 ? (
                              <div className="flex justify-center items-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <p className="text-gray-500 text-sm">No cities have been added to this region</p>
                              </div>
                            ) : (
                              <div className="pl-6 space-y-4">
                                {region.cities.map((city) => (
                                  <div key={city.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <div
                                      className="bg-orange-50 px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-orange-100 transition-colors"
                                      onClick={() => toggleAccordion(`city-${city.id}`)}
                                    >
                                      <div className="flex items-center">
                                        <div className="bg-orange-100 p-2 rounded-lg mr-3">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-orange-600"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                          </svg>
                                        </div>
                                        <div>
                                          <h5 className="font-medium text-gray-800">{city.cityNameEnglish}</h5>
                                          <p className="text-xs text-gray-500">{city.cityNameArabic}</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openEditDialog("city", region.id, city.id);
                                          }}
                                          className="p-2 text-gray-500 hover:text-orange-600 rounded-full hover:bg-orange-100 transition-colors mr-2"
                                          aria-label="Edit city"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                          </svg>
                                        </button>

                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            confirmDelete("city", region.id, city.cityNameEnglish, city.id);
                                          }}
                                          className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors mr-2"
                                          aria-label="Delete city"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                          </svg>
                                        </button>

                                        <div
                                          className={`p-1 rounded-full transition-colors ${openAccordions[`city-${city.id}`] ? "bg-orange-100" : "bg-transparent"}`}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-5 w-5 text-orange-600 transition-transform ${openAccordions[`city-${city.id}`] ? "transform rotate-180" : ""}`}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <polyline points="6 9 12 15 18 9" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>

                                    {openAccordions[`city-${city.id}`] && (
                                      <div className="bg-white p-4 border-t border-gray-200">
                                        {city.neighborhoods.length === 0 ? (
                                          <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <p className="text-gray-500 text-sm">No neighborhoods have been added to this city</p>
                                          </div>
                                        ) : (
                                          <div className="pl-6 space-y-3">
                                            {city.neighborhoods.map((neighborhood) => (
                                              <div
                                                key={neighborhood.id}
                                                className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center justify-between"
                                              >
                                                <div className="flex items-center">
                                                  <div className="bg-blue-100 p-1 rounded-md mr-3">
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      className="h-4 w-4 text-blue-700"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    >
                                                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                                      <polyline points="9 22 9 12 15 12 15 22" />
                                                    </svg>
                                                  </div>
                                                  <div>
                                                    <h6 className="font-medium text-gray-800">{neighborhood.valueEnglish}</h6>
                                                    <p className="text-xs text-gray-500">{neighborhood.valueArabic}</p>
                                                  </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                  <button
                                                    onClick={() =>
                                                      openEditDialog(
                                                        "neighborhood",
                                                        region.id,
                                                        city.id,
                                                        neighborhood.id
                                                      )
                                                    }
                                                    className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                                                    aria-label="Edit neighborhood"
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      className="h-4 w-4"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    >
                                                      <path d="M12 20h9" />
                                                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                    </svg>
                                                  </button>

                                                  <button
                                                    onClick={() =>
                                                      confirmDelete(
                                                        "neighborhood",
                                                        region.id,
                                                        neighborhood.valueEnglish,
                                                        city.id,
                                                        neighborhood.id
                                                      )
                                                    }
                                                    className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                                    aria-label="Delete neighborhood"
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      className="h-4 w-4"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth="2"
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                    >
                                                      <polyline points="3 6 5 6 21 6" />
                                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                  </button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* Data Preview Tab */}
            {activeTab === "data" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Data Structure Preview</h3>
                <div className="overflow-x-auto">
                  <pre className="bg-gray-100 p-4 rounded-md text-sm">{JSON.stringify(regions, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      {editItem.isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editItem.type === "region" && "Edit Region"}
              {editItem.type === "city" && "Edit City"}
              {editItem.type === "neighborhood" && "Edit Neighborhood"}
            </h3>
            <div className="space-y-4">
              {(editItem.type === "region" || editItem.type === "city") && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                      value={editNameEnglish}
                      onChange={(e) => setEditNameEnglish(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                      value={editNameArabic}
                      onChange={(e) => setEditNameArabic(e.target.value)}
                    />
                  </div>
                </>
              )}

              {editItem.type === "neighborhood" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                      value={editValueEnglish}
                      onChange={(e) => setEditValueEnglish(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue focus:border-blue"
                      value={editValueArabic}
                      onChange={(e) => setEditValueArabic(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={closeEditDialog}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button onClick={handleEdit} className="px-4 py-2 bg-primary rounded-md text-white hover:bg-blue">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex items-center text-red-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium">{deleteConfirmation.name}</span>?
              {deleteConfirmation.type === "region" &&
                " This will also delete all cities and neighborhoods in this region."}
              {deleteConfirmation.type === "city" && " This will also delete all neighborhoods in this city."}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteDialog}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
