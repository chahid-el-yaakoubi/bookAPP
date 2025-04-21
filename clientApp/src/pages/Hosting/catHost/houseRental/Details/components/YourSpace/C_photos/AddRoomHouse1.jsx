"use client"

import { useState, useEffect } from "react"
import {
    FaFan,
    FaThermometerHalf,
    FaHome,
    FaLightbulb,
    FaVolumeMute,
    FaBuilding,
    FaSuitcase,
    FaCamera,
    FaLock,
    FaPhone,
    FaClock,
    FaCut,
    FaTemperatureHigh,
} from "react-icons/fa"
import { MdCurtainsClosed } from "react-icons/md"
import { FaTreeCity } from "react-icons/fa6"
import { ArrowLeft, Layout, Minus, Plus, Users, X } from "lucide-react"

const BED_TYPES = [
    { english: "Single Bed", arabic: "سرير مفرد" },
    { english: "Double Bed", arabic: "سرير مزدوج" },
    { english: "Queen Bed", arabic: "سرير كوين" },
    { english: "King Bed", arabic: "سرير كينج" },
    { english: "Small Double Bed", arabic: "سرير مزدوج صغير" },
    { english: "Bunk Bed", arabic: "سرير بطابقين" },
    { english: "Sofa Bed", arabic: "أريكة سرير" },
    { english: "Couch", arabic: "كنبة" },
    { english: "Floor Mattress", arabic: "فراش أرضي" },
    { english: "Air Mattress", arabic: "فراش هوائي" },
    { english: "Crib", arabic: "سرير أطفال" },
    { english: "Toddler Bed", arabic: "سرير للأطفال الصغار" },
    { english: "Hammock", arabic: "أرجوحة" },
    { english: "Water Bed", arabic: "سرير مائي" },
]

const RoomFeatures = [
    { id: "air_conditioning", label: "Air Conditioning", arabic: "تكييف هواء", category: "Room Features", icon: FaTemperatureHigh },
    { id: "heating_system", label: "Heating System", arabic: "نظام تدفئة", category: "Room Features", icon: FaThermometerHalf },
    { id: "fan", label: "Fan", arabic: "مروحة", category: "Room Features", icon: FaFan },
    { id: "wardrobe", label: "Wardrobe/Closet", arabic: "خزانة ملابس", category: "Room Features", icon: FaHome },
    { id: "full_length_mirror", label: "Full-Length Mirror", arabic: "مرآة بطول كامل", category: "Room Features", icon: FaCamera },
    { id: "blackout_curtains", label: "Blackout Curtains", arabic: "ستائر معتمة", category: "Room Features", icon: MdCurtainsClosed },
    { id: "reading_lights", label: "Reading Lights", arabic: "أضواء للقراءة", category: "Room Features", icon: FaLightbulb },
    { id: "soundproofing", label: "Soundproofing", arabic: "عزل صوتي", category: "Room Features", icon: FaVolumeMute },
    { id: "balcony", label: "Balcony", arabic: "شرفة", category: "Room Features", icon: FaBuilding },
    { id: "terrace", label: "Terrace", arabic: "تراس", category: "Room Features", icon: FaTreeCity },
    { id: "safe", label: "In-Room Safe", arabic: "خزنة داخل الغرفة", category: "Room Features", icon: FaLock },
    { id: "iron", label: "Iron & Ironing Board", arabic: "مكواة ولوح كي", category: "Room Features", icon: FaCut },
    { id: "luggage_rack", label: "Luggage Rack", arabic: "رف للأمتعة", category: "Room Features", icon: FaSuitcase },
    { id: "telephone", label: "Telephone", arabic: "هاتف", category: "Room Features", icon: FaPhone },
    { id: "alarm_clock", label: "Alarm Clock", arabic: "ساعة منبه", category: "Room Features", icon: FaClock },
]

const RoomHouse = ({ onSubmit, initialData, onCancel, typeProperty }) => {
    const [formData, setFormData] = useState({
        features: [],
        beds: [],
        roomFeatures: [], // Added this property which is used in renderRoomFeatures
        tempBed: { type: "Single Bed", count: 1 }, // Added tempBed with default values
    })

    const [errors, setErrors] = useState({}) // Added errors state

    // Update form data when initial data changes
    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                ...initialData,
            }))
        }
    }, [initialData])

    // Validation function
    const validateForm = () => {
        const newErrors = {}

        if (formData.beds.length === 0) {
            newErrors.beds = "At least one bed type is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate form
        if (!validateForm()) {
            return
        }

        try {
            // Call parent submit handler with form data
            await onSubmit(formData)
        } catch (error) {
            console.error("Room submission error:", error)
            setErrors({
                submit: error.message || "Failed to submit room details",
            })
        }
    }

    // Function to render room features
    const renderRoomFeatures = () => {
        return RoomFeatures.map((item) => {
            const isChecked = formData.roomFeatures.includes(item.id)

            return (
                <div
                    key={item.id}
                    className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue transition-all"
                    onClick={() => toggleRoomFeature(item.id)}
                >
                    <input
                        type="checkbox"
                        name={item.id}
                        className="h-5 w-5 text-blue focus:ring-blue border-gray-300 rounded"
                        checked={isChecked}
                        onChange={() => {}} // Prevent native change handler since the click on div handles it
                    />
                    {item.icon && <item.icon className="ml-2 mr-2 text-gray-800" size={20} />}
                    <label htmlFor={item.id} className="ml-1 block text-sm text-gray-700 flex justify-between w-full">
                        <span>{item.label}</span>
                        <span className="text-gray-500 text-right rtl">{item.arabic}</span>
                    </label>
                </div>
            )
        })
    }

    const toggleRoomFeature = (featureId) => {
        setFormData((prev) => {
            const currentFeatures = prev.roomFeatures
            if (currentFeatures.includes(featureId)) {
                // Remove feature if already selected
                return {
                    ...prev,
                    roomFeatures: currentFeatures.filter((id) => id !== featureId),
                }
            } else {
                // Add feature if not selected
                return {
                    ...prev,
                    roomFeatures: [...currentFeatures, featureId],
                }
            }
        })
    }

    // Find bed type object by english name
    const findBedTypeByEnglish = (englishName) => {
        return BED_TYPES.find(bed => bed.english === englishName) || BED_TYPES[0];
    }

    return (
        <div className="bg-gradient-to-b from-gray-600 to-blue bg-opacity-40 min-h-screen pb-12">
            {/* Hero Header */}
            <div className="bg-blue/50 text-white py-16 px-8 mb-12">
                <button
                    onClick={onCancel}
                    className="group mb-8 flex items-center text-gray-900 hover:scale-105 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-lg">Back to Dashboard</span>
                </button>
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">{initialData ? "Update Room Details" : "Create New Room"}</h1>
                    <p className="text-xl opacity-80 max-w-2xl">
                        Provide comprehensive details about your accommodation to give guests the perfect picture of what to expect.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Beds Card */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center mb-6">
                            <Users className="text-blue mr-4" size={28} />
                            <h2 className="text-2xl font-bold text-gray-800">
                                <span>Beds & Capacity</span>
                                <span className="text-gray-500 text-lg mr-2 float-right">الأسرّة والسعة</span>
                            </h2>
                        </div>

                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-3 flex justify-between">
                                <span>Add Beds</span>
                                <span className="text-gray-500">إضافة أسرّة</span>
                            </label>
                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                {/* Bed Type Selection */}
                                <select
                                    value={formData.tempBed?.type || "Single Bed"}
                                    onChange={(e) => {
                                        const newType = e.target.value
                                        // Update only the tempBed field, not the actual beds array
                                        setFormData((prev) => ({
                                            ...prev,
                                            tempBed: {
                                                type: newType,
                                                count: prev.tempBed?.count || 1,
                                            },
                                        }))
                                    }}
                                    className="flex-grow px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue focus:ring focus:ring-blue transition"
                                >
                                    {BED_TYPES.map((bed) => (
                                        <option key={bed.english} value={bed.english}>
                                            {bed.english} - {bed.arabic}
                                        </option>
                                    ))}
                                </select>

                                {/* Bed Count Input with +/- buttons */}
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentCount = formData.tempBed?.count || 1
                                            if (currentCount > 1) {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    tempBed: {
                                                        type: prev.tempBed?.type || "Single Bed",
                                                        count: currentCount - 1,
                                                    },
                                                }))
                                            }
                                        }}
                                        className="px-3 py-3 bg-gray-200 text-gray-800 rounded-l-lg hover:bg-gray-300 transition flex items-center justify-center"
                                        disabled={formData.tempBed?.count <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>

                                    <input
                                        type="number"
                                        value={formData.tempBed?.count || 1}
                                        onChange={(e) => {
                                            try {
                                                const newCount = Math.max(1, Number(e.target.value) || 1)
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    tempBed: {
                                                        type: prev.tempBed?.type || "Single Bed",
                                                        count: newCount,
                                                    },
                                                }))
                                            } catch (error) {
                                                console.error("Error updating bed count:", error)
                                                // Keep previous value in case of error
                                            }
                                        }}
                                        className="w-14 px-2 py-3 text-lg text-center border-y-2 border-gray-300 focus:outline-none focus:border-blue focus:ring focus:ring-blue transition"
                                        min="1"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const currentCount = formData.tempBed?.count || 1
                                            setFormData((prev) => ({
                                                ...prev,
                                                tempBed: {
                                                    type: prev.tempBed?.type || "Single Bed",
                                                    count: currentCount + 1,
                                                },
                                            }))
                                        }}
                                        className="px-3 py-3 bg-gray-200 text-gray-800 rounded-r-lg hover:bg-gray-300 transition flex items-center justify-center"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Add Bed Button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        try {
                                            // Check if we have a valid tempBed
                                            if (!formData.tempBed) {
                                                // Initialize with defaults if tempBed doesn't exist
                                                const newBed = { type: "Single Bed", count: 1 }
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    beds: [...prev.beds, newBed],
                                                    tempBed: { ...newBed }, // Keep a copy in tempBed
                                                }))
                                                return
                                            }

                                            // Check if this bed type already exists
                                            const existingBedIndex = formData.beds.findIndex((bed) => bed.type === formData.tempBed.type)

                                            if (existingBedIndex >= 0) {
                                                // Update existing bed count
                                                setFormData((prev) => {
                                                    const updatedBeds = [...prev.beds]
                                                    updatedBeds[existingBedIndex] = {
                                                        ...updatedBeds[existingBedIndex],
                                                        count: updatedBeds[existingBedIndex].count + prev.tempBed.count,
                                                    }
                                                    return {
                                                        ...prev,
                                                        beds: updatedBeds,
                                                    }
                                                })
                                            } else {
                                                // Add new bed
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    beds: [...prev.beds, { ...prev.tempBed }],
                                                }))
                                            }
                                        } catch (error) {
                                            console.error("Error adding bed:", error)
                                        }
                                    }}
                                    className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue transition flex items-center gap-2"
                                >
                                    <Plus size={20} />
                                    <span>Add</span>
                                </button>
                            </div>

                            {/* Current Beds Display */}
                            <div className="p-6 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-700 mb-4 flex justify-between">
                                    <span>Current Beds</span>
                                    <span className="text-gray-500">الأسرّة الحالية</span>
                                </h3>
                                {!formData.beds || formData.beds.length === 0 ? (
                                    <p className="text-gray-500">No beds added yet</p>
                                ) : (
                                    <div className="flex flex-wrap gap-3">
                                        {formData.beds.map((bed, index) => {
                                            const bedType = findBedTypeByEnglish(bed.type);
                                            return (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-4 py-2 rounded-lg text-md bg-white border-2 border-gray-200 shadow-sm"
                                                >
                                                    {bed.count}x {bed.type} - {bedType.arabic}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            try {
                                                                const newBeds = [...formData.beds]
                                                                newBeds.splice(index, 1)
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    beds: newBeds,
                                                                }))
                                                            } catch (error) {
                                                                console.error("Error removing bed:", error)
                                                            }
                                                        }}
                                                        className="ml-2 text-gray-500 hover:text-red-500"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </span>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Features Card */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center mb-6">
                            <Layout className="text-blue mr-4" size={28} />
                            <h2 className="text-2xl font-bold text-gray-800 flex justify-between w-full">
                                <span>Room Features</span>
                                <span className="text-gray-500 text-lg">ميزات الغرفة</span>
                            </h2>
                        </div>

                        <div className="mt-8">
                            <label className="block text-lg font-medium text-gray-700 mb-4 flex justify-between">
                                <span>Room Features</span>
                                <span className="text-gray-500">ميزات الغرفة</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{renderRoomFeatures()}</div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end mt-8">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="mr-4 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-3 bg-blue text-white rounded-lg hover:bg-blue transition">
                            {initialData ? "Update Room" : "Create Room"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RoomHouse