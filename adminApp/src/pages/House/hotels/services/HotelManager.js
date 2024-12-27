import axios from 'axios';

class HotelManager {
    constructor() {
        this.initialState = {
            basicInfo: {
                name: "",
                title: "",
                type: "",
                city: "",
                address: "",
                distance: "",
                phone: "",
                description: "test",
                rating: 0,
                featured: false
            },
            pricing: {
                basePrice: "",
            },
            rental: {
                durationType: "",
                customDays: "",
                hasFurniture: false,
            },
            policies: {
                pets: { allowed: false },
                smoking: { allowed: false },
                events: { allowed: false },
                quietHours: {
                    enforced: false,
                    from: "",
                    to: ""
                },
                checkIn: {
                    from: "",
                    to: ""
                },
                checkOut: {
                    from: "",
                    to: ""
                }
            },
            languages: ["English", "Arabic", "French"],
            amenities: {
                wifi: false,
                parking: false,
                pool: false,
                restaurant: false,
                gym: false,
                spa: false,
                airConditioning: false,
                kitchen: false,
                tv: false,
                elevator: false,
                beachAccess: false,
                garden: false,
                // ... add all other amenities
            }
        };

        this.availableLanguages = [
            "English",
            "Arabic",
            "French",
            "Spanish",
            "German",
            "Italian",
            "Chinese",
            "Japanese",
            "Russian",
            "Portuguese"
        ];

        this.amenityCategories = {
            basic: {
                title: "Basic Amenities",
                items: [
                    { label: "WiFi", name: "wifi", icon: "faWifi" },
                    { label: "Parking", name: "parking", icon: "faParking" },
                    { label: "Pool", name: "pool", icon: "faSwimmingPool" },
                    { label: "Restaurant", name: "restaurant", icon: "faUtensils" },
                    { label: "Gym", name: "gym", icon: "faDumbbell" },
                ]
            },
            // ... add other categories
        };
    }

    handleChange(event, setFormData) {
        const { name, value, type, checked } = event.target;
        
        setFormData(prevData => {
            const newData = { ...prevData };
            if (name.includes('.')) {
                const [section, field] = name.split('.');
                newData[section] = {
                    ...newData[section],
                    [field]: type === 'checkbox' ? checked : value
                };
            } else {
                newData[name] = type === 'checkbox' ? checked : value;
            }
            return newData;
        });
    }

    handleQuietHoursToggle(event, setFormData) {
        const { checked } = event.target;
        
        setFormData(prevData => ({
            ...prevData,
            policies: {
                ...prevData.policies,
                quietHours: {
                    ...prevData.policies.quietHours,
                    enforced: checked,
                    from: checked ? prevData.policies.quietHours.from : "",
                    to: checked ? prevData.policies.quietHours.to : ""
                }
            }
        }));
    }

    handleAddLanguage(selectedLanguage, formData, setFormData) {
        if (selectedLanguage && !formData.languages.includes(selectedLanguage)) {
            setFormData(prevData => ({
                ...prevData,
                languages: [...prevData.languages, selectedLanguage]
            }));
        }
    }

    handleRemoveLanguage(languageToRemove, setFormData) {
        setFormData(prevData => ({
            ...prevData,
            languages: prevData.languages.filter(lang => lang !== languageToRemove)
        }));
    }

    handleReset(setFormData, setSelectedLanguage) {
        setFormData(this.initialState);
        setSelectedLanguage("");
    }

    validateFormData(formData) {
        const errors = {};

        // Basic Info Validation
        if (!formData.basicInfo.name) errors.name = "Name is required";
        if (!formData.basicInfo.type) errors.type = "Property type is required";
        if (!formData.basicInfo.city) errors.city = "City is required";
        if (!formData.basicInfo.address) errors.address = "Address is required";
        if (!formData.basicInfo.phone) errors.phone = "Phone number is required";

        // Pricing Validation
        if (!formData.pricing.basePrice) errors.basePrice = "Base price is required";

        // Rental Validation
        if (!formData.rental.durationType) errors.durationType = "Duration type is required";
        if (formData.rental.durationType === 'custom' && !formData.rental.customDays) {
            errors.customDays = "Custom days is required";
        }

        // Check-in/Check-out Validation
        if (!formData.policies.checkIn.from || !formData.policies.checkIn.to) {
            errors.checkIn = "Check-in time range is required";
        }
        if (!formData.policies.checkOut.from || !formData.policies.checkOut.to) {
            errors.checkOut = "Check-out time range is required";
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    async handleSubmit(event, formData, navigate, setError) {
        event.preventDefault();
        
        // Validate form data
        const { isValid, errors } = this.validateFormData(formData);
        if (!isValid) {
            setError(errors);
            return;
        }

        try {
            const formattedData = this.formatDataForAPI(formData);
            const response = await axios.post('/api/hotels', formattedData);
            
            if (response.data) {
                navigate('/hotels');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    }

    formatDataForAPI(formData) {
        // Format the data as needed for the API
        return {
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    async fetchHotelById(hotelId) {
        try {
            const response = await axios.get(`/api/hotels/${hotelId}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch hotel data');
        }
    }

    async updateHotel(hotelId, formData) {
        try {
            const formattedData = this.formatDataForAPI(formData);
            const response = await axios.put(`/api/hotels/${hotelId}`, formattedData);
            return response.data;
        } catch (error) {
            throw new Error('Failed to update hotel');
        }
    }

    async deleteHotel(hotelId) {
        try {
            await axios.delete(`/api/hotels/${hotelId}`);
            return true;
        } catch (error) {
            throw new Error('Failed to delete hotel');
        }
    }

    getAmenityCategories() {
        return this.amenityCategories;
    }

    getAvailableLanguages() {
        return this.availableLanguages;
    }
}

export default HotelManager; 