import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HostLayout from '../../ComponentHost/HostLayout';
import TopNavHost from '../../ComponentHost/TopNavHost';
import { FaArrowLeft, FaEdit, FaEye, FaCog, FaCalendarAlt, FaImage, FaDollarSign, FaHome, FaList, FaChartLine, FaBed, FaMapMarkerAlt, FaUserFriends, FaKey, FaClipboardList, FaTimes } from 'react-icons/fa';

const PropertyDetail = () => {

    
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSection, setEditingSection] = useState(null);

    useEffect(() => {
        // Mock data fetch
        const mockProperty = {
            id: parseInt(id),
            name: "Beachfront Villa",
            location: "Miami Beach",
            price: 250,
            status: "active",
            description: "Beautiful beachfront villa with stunning ocean views",
            amenities: ["WiFi", "Pool", "Beach Access", "Air Conditioning", "parking"],
            bedrooms: 3,
            bathrooms: 2,
            maxGuests: 6,
            images: [
                "https://images.pexels.com/photos/2763964/pexels-photo-2763964.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                "https://images.pexels.com/photos/30694632/pexels-photo-30694632/free-photo-of-charmant-restaurant-en-bord-de-mer-a-malibu-californie.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            ]
        };
        setProperty(mockProperty);
    }, [id]);

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: FaHome },
        { id: 'pricing', label: 'Pricing', icon: FaDollarSign },
        { id: 'photos', label: 'Photos', icon: FaImage },
        { id: 'amenities', label: 'Amenities', icon: FaList },
        { id: 'location', label: 'Location', icon: FaMapMarkerAlt },
        { id: 'availability', label: 'Availability', icon: FaCalendarAlt },
        { id: 'booking-settings', label: 'Booking Settings', icon: FaKey },
        { id: 'house-rules', label: 'House Rules', icon: FaClipboardList },
        { id: 'performance', label: 'Performance', icon: FaChartLine },
        { id: 'settings', label: 'Settings', icon: FaCog },
    ];

    const handleUpdateBasicInfo = async (data) => {
        try {
            // API call would go here
            console.log('Updating basic info:', data);
            setProperty({ ...property, ...data });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating basic info:', error);
        }
    };

    const handleUpdatePrice = async (priceData) => {
        try {
            // API call would go here
            console.log('Updating price:', priceData);
            setProperty({ ...property, price: priceData.price });
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating price:', error);
        }
    };

    const handleUpdatePhotos = async (photos) => {
        try {
            // API call would go here
            console.log('Updating photos:', photos);
            setProperty({ ...property, images: [...property.images, ...photos] });
        } catch (error) {
            console.error('Error updating photos:', error);
        }
    };

    const handleDeletePhoto = async (index) => {
        try {
            // API call would go here
            const newImages = property.images.filter((_, i) => i !== index);
            setProperty({ ...property, images: newImages });
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    const handleUpdateAmenities = async (amenities) => {
        try {
            // API call would go here
            console.log('Updating amenities:', amenities);
            setProperty({ ...property, amenities });
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating amenities:', error);
        }
    };

    const handleUpdateLocation = async (locationData) => {
        try {
            // API call would go here
            console.log('Updating location:', locationData);
            setProperty({ ...property, location: locationData.location });
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    const handleUpdateAvailability = async (availabilityData) => {
        try {
            // API call would go here
            console.log('Updating availability:', availabilityData);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating availability:', error);
        }
    };

    const handleUpdateBookingSettings = async (settings) => {
        try {
            // API call would go here
            console.log('Updating booking settings:', settings);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating booking settings:', error);
        }
    };

    const handleUpdateHouseRules = async (rules) => {
        try {
            // API call would go here
            console.log('Updating house rules:', rules);
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating house rules:', error);
        }
    };

    // Edit Modal Component
    const EditModal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    };

    // Edit Forms Components
    const PriceEditForm = ({ onSubmit, initialPrice }) => {
        const [price, setPrice] = useState(initialPrice);

        return (
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ price });
            }}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Nightly Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <button 
                    type="submit"
                    className="px-4 py-2 bg-blue text-white rounded-md"
                >
                    Save Changes
                </button>
            </form>
        );
    };

    const AmenitiesEditForm = ({ onSubmit, initialAmenities }) => {
        const [amenities, setAmenities] = useState(initialAmenities);
        const [newAmenity, setNewAmenity] = useState('');

        const handleAdd = () => {
            if (newAmenity.trim()) {
                setAmenities([...amenities, newAmenity.trim()]);
                setNewAmenity('');
            }
        };

        return (
            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit(amenities);
            }}>
                <div className="mb-4">
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newAmenity}
                            onChange={(e) => setNewAmenity(e.target.value)}
                            className="flex-1 p-2 border rounded-md"
                            placeholder="Add new amenity"
                        />
                        <button 
                            type="button"
                            onClick={handleAdd}
                            className="px-4 py-2 bg-gray-100 rounded-md"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {amenities.map((amenity, index) => (
                            <span 
                                key={index}
                                className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                            >
                                {amenity}
                                <button
                                    type="button"
                                    onClick={() => setAmenities(amenities.filter((_, i) => i !== index))}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <button 
                    type="submit"
                    className="px-4 py-2 bg-blue text-white rounded-md"
                >
                    Save Changes
                </button>
            </form>
        );
    };

    if (!property) {
        return <div>Loading...</div>;
    }

    // Render section content based on activeSection
    const renderSectionContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                                <div className="space-y-3">
                                    <p><span className="font-medium">Location:</span> {property.location}</p>
                                    <p><span className="font-medium">Price per night:</span> ${property.price}</p>
                                    <p><span className="font-medium">Bedrooms:</span> {property.bedrooms}</p>
                                    <p><span className="font-medium">Bathrooms:</span> {property.bathrooms}</p>
                                    <p><span className="font-medium">Max Guests:</span> {property.maxGuests}</p>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Description</h2>
                                <p className="text-gray-700">{property.description}</p>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                            <div className="flex flex-wrap gap-2">
                                {property.amenities.map((amenity, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'pricing':
                return (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Base Price</h2>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span>Nightly base price</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">${property.price}</span>
                                        <button 
                                            onClick={() => {
                                                setEditingSection('price');
                                                setShowEditModal(true);
                                            }}
                                            className="text-blue hover:underline"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Price Settings</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium mb-2">Weekend pricing</h3>
                                    <p className="text-sm text-gray-600">Set higher rates for Friday and Saturday nights</p>
                                    <button className="mt-2 text-blue hover:underline">Add weekend pricing</button>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium mb-2">Seasonal pricing</h3>
                                    <p className="text-sm text-gray-600">Adjust rates for specific seasons or dates</p>
                                    <button className="mt-2 text-blue hover:underline">Add seasonal pricing</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'photos':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Property Photos</h2>
                            <button className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue/90">
                                Add Photos
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {property.images.map((image, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                    <img src={image} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                                            <FaEdit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 bg-white rounded-full hover:bg-gray-100 text-red-600">
                                            <FaTimes className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'location':
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Location</h2>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="mb-4">
                                <h3 className="font-medium mb-2">Address</h3>
                                <p className="text-gray-600">{property.location}</p>
                            </div>
                            <div className="aspect-video rounded-lg bg-gray-200">
                                {/* Map component would go here */}
                                <div className="w-full h-full flex items-center justify-center">
                                    Map placeholder
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'availability':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Calendar</h2>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 border rounded-md hover:bg-gray-50">Block dates</button>
                                <button className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue/90">
                                    Update availability
                                </button>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            {/* Calendar component would go here */}
                            <div className="h-96 flex items-center justify-center border rounded-lg bg-white">
                                Calendar placeholder
                            </div>
                        </div>
                    </div>
                );

            case 'booking-settings':
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Booking Settings</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium mb-2">Instant Book</h3>
                                <p className="text-sm text-gray-600 mb-3">Let guests instantly book your property</p>
                                <button className="px-4 py-2 border rounded-md hover:bg-gray-100">
                                    Configure Instant Book
                                </button>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium mb-2">House Rules</h3>
                                <p className="text-sm text-gray-600 mb-3">Set expectations for guests</p>
                                <button className="px-4 py-2 border rounded-md hover:bg-gray-100">
                                    Edit House Rules
                                </button>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium mb-2">Check-in & Check-out</h3>
                                <p className="text-sm text-gray-600 mb-3">Set your check-in and check-out times</p>
                                <button className="px-4 py-2 border rounded-md hover:bg-gray-100">
                                    Edit Times
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'performance':
                return (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold">Performance Metrics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium mb-2">Occupancy Rate</h3>
                                <p className="text-2xl font-bold">75%</p>
                                <p className="text-sm text-gray-600">Last 30 days</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium mb-2">Average Rating</h3>
                                <p className="text-2xl font-bold">4.8/5</p>
                                <p className="text-sm text-gray-600">From 24 reviews</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium mb-2">Response Rate</h3>
                                <p className="text-2xl font-bold">98%</p>
                                <p className="text-sm text-gray-600">Average response time: 2h</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div>Section under development</div>;
        }
    };

    return (
        <HostLayout>
            <TopNavHost category="properties" />
            <div className="flex-1 flex">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
                    <div className="p-4">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold">{property.name}</h2>
                            <p className="text-sm text-gray-600">{property.location}</p>
                        </div>
                        <nav>
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left mb-2 ${
                                        activeSection === item.id
                                            ? 'bg-blue text-white'
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    <item.icon className={`w-5 h-5 ${
                                        activeSection === item.id ? 'text-white' : 'text-gray-500'
                                    }`} />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-6 bg-gray-50">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/host/properties/listining')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-bold">Property Details</h1>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                                onClick={() => window.open(`/hotel/${property.id}`, '_blank')}
                            >
                                <FaEye />
                                Preview Listing
                            </button>
                            <button 
                                className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue/90 transition-colors flex items-center gap-2"
                                onClick={() => navigate(`/host/properties/edit/${property.id}`)}
                            >
                                <FaEdit />
                                Edit Property
                            </button>
                        </div>
                    </div>

                    {/* Status Banner */}
                    <div className={`mb-6 p-4 rounded-lg ${
                        property.status === 'active' ? 'bg-green-100' :
                        property.status === 'pending' ? 'bg-yellow-100' :
                        'bg-red-100'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">
                                    {property.status === 'active' ? 'Your property is live' :
                                     property.status === 'pending' ? 'Pending Review' :
                                     'Property Inactive'}
                                </h3>
                                <p className="text-sm mt-1">
                                    {property.status === 'active' ? 'Guests can book your property' :
                                     property.status === 'pending' ? 'We are reviewing your property' :
                                     'Your property is not visible to guests'}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                property.status === 'active' ? 'bg-green-200 text-green-800' :
                                property.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-red-200 text-red-800'
                            }`}>
                                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    {/* Content based on active section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {renderSectionContent()}
                    </div>
                </main>
            </div>

            {/* Edit Modals */}
            <EditModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title={`Edit ${editingSection?.charAt(0).toUpperCase()}${editingSection?.slice(1)}`}
            >
                {editingSection === 'price' && (
                    <PriceEditForm
                        onSubmit={handleUpdatePrice}
                        initialPrice={property.price}
                    />
                )}
                {editingSection === 'amenities' && (
                    <AmenitiesEditForm
                        onSubmit={handleUpdateAmenities}
                        initialAmenities={property.amenities}
                    />
                )}
                {/* Add more edit forms as needed */}
            </EditModal>
        </HostLayout>
    );
};

export default PropertyDetail; 