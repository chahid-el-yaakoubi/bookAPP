import React, { useEffect, useState } from 'react';
import { X, Trash2, Plus, Filter, Check, Save, Edit2 } from 'lucide-react';
import useFetch from '../../../hooks/useFetch';
import { useParams } from 'react-router-dom';
import ImgHotel from './imgHotel';
import { deletePhotosProperty, updatePhotosProperty } from '../../../Lib/api';

const ImageGallery = () => {
  const { id } = useParams();
  const { data, loading, error, reFetch } = useFetch(`/api/hotels/${id}/photos`);

  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [showImageModalAdd, setShowImageModalAdd] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [editingType, setEditingType] = useState(false);
  const [newImageType, setNewImageType] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    if (data) {
      setImages(data);
      setFilteredImages(data);
    }
  }, [data]);

  useEffect(() => {
    if (!showImageModalAdd) {
      reFetch();
    }
  }, [showImageModalAdd]);

  useEffect(() => {
    filterImages(filterType);
  }, [filterType, images]);

  // Filter images based on type
  const filterImages = (type) => {
    if (type === 'all') {
      setFilteredImages(images);
    } else {
      // Filter by image type or URL pattern
      const filtered = images.filter(image => {
        if (image?.type && image.type === type) {
          return true;
        }
        if (type === 'url' && image?.url) {
          return true;
        }
        return false;
      });
      setFilteredImages(filtered);
    }
  };

  // Get unique image types for filter options
  const getImageTypes = () => {
    const types = new Set(['all']);
    images.forEach(image => {
      if (image?.type) types.add(image.type);
    });
    return Array.from(types);
  };

  // Add image module
  const handleImageModalOpen = () => {
    setShowImageModalAdd(!showImageModalAdd);
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    setImagesToDelete([]);
  };

  // Handle image selection for deletion
  const toggleImageSelection = (imageUrl) => {
    if (imagesToDelete.includes(imageUrl)) {
      setImagesToDelete(imagesToDelete.filter(url => url !== imageUrl));
    } else {
      setImagesToDelete([...imagesToDelete, imageUrl]);
    }
  };

  // Remove selected images
  const removeSelectedImages = async () => {
    const confirmRemove = confirm('Are you sure you want to remove selected images from the list of  selected images ?');
    if (imagesToDelete.length === 0 || !confirmRemove) return;
    const formdata = {
      data: { images: imagesToDelete }
    };
    try {
      const response = await deletePhotosProperty(id, formdata);

      if (response.data.success) {
        setImagesToDelete([]);
        setSelectionMode(false);
        reFetch();
      } else {
        throw new Error(response.data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting images:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert("Failed to delete images: " + (error.response?.data?.message || error.message));
    }
  };

  // Toggle filter menu
  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  // Handle image click
  const handleImageClick = (image) => {
    if (selectionMode) {
      toggleImageSelection(image.url);
    } else {
      setSelectedImage(image.url);
      setSelectedImageData(image);
      setNewImageType(image.type || '');
    }
  };

  // Update image type
  const updateImageType = async () => {
    if (!selectedImageData) return;

    const imageTypeToSave = newImageType === 'Other' ? customType : newImageType;

    // Check if a custom type is entered when "Other" is selected
    if (newImageType === 'Other' && !customType) {
      alert('Please enter a custom type!');
      return;
    }

    try {
      const formdata = {
        photoUrl: selectedImageData.url,  // Ensure this matches the server's expected field
        newType: imageTypeToSave          // Send the custom type or selected type
      };
      const response = await updatePhotosProperty(id, formdata);

      if (response.status === 200) {  // Corrected to check response.status
        setEditingType(false);
        // Update the local state with the new type
        const updatedImages = images.map(img =>
          img.url === selectedImageData.url ? { ...img, type: imageTypeToSave } : img
        );
        setImages(updatedImages);
        setSelectedImageData({ ...selectedImageData, type: imageTypeToSave });
        reFetch();
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating image type:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert("Failed to update image type: " + (error.response?.data?.message || error.message));
    }
  };

  const [customType, setCustomType] = useState('');


  if (error) {
    return <div>Error fetching images: {error.message}</div>;
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  return (

    <>

      {/* Full-size Image Modal with Type Editing */}
      {(selectedImage && !selectionMode) ? (
        <div
          className="container mx-auto px-4 py-8  h-full"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedImage(null);
          }}
        >
          <div className="relative max-w-full max-h-full md:max-h-[70vh] bg-white rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full    md:max-h-[64vh] object-contain"
            />

            {/* Image Type Editor */}
            <div className="p-4 bg-white border-t">
              {editingType ? (
                <div className="flex items-center gap-2">
                  <select
                    value={newImageType}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewImageType(value);
                      if (value !== 'Other') {
                        setCustomType(''); // Clear the custom type if not "Other"
                      }
                    }}
                    className="flex-1 p-2 border rounded-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">Select image type...</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Exterior">Exterior</option>
                    <option value="Dining Room">Dining Room</option>
                    <option value="Balcony / Terrace">Balcony / Terrace</option>
                    <option value="Pool">Pool</option>
                    <option value="Gym / Fitness Area">Gym / Fitness Area</option>
                    <option value="Lobby / Entrance">Lobby / Entrance</option>
                    <option value="Reception / Front Desk">Reception / Front Desk</option>
                    <option value="Hallway / Corridor">Hallway / Corridor</option>
                    <option value="Parking Area">Parking Area</option>
                    <option value="Garden / Yard">Garden / Yard</option>
                    <option value="View / Panorama">View / Panorama</option>
                    <option value="Meeting Room / Business Area">Meeting Room / Business Area</option>
                    {/* <option value="Other">Other</option> */}

                  </select>

                  {/* Input field for custom type if "Other" is selected */}
                  {newImageType === 'Other' && (
                    <input
                      type="text"
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value)}
                      className="flex-1 p-2 border rounded-md"
                      placeholder="Enter custom type..."
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateImageType(); // Update the image type (save it)
                    }}
                    className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    <Save size={20} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingType(false);
                      setNewImageType(selectedImageData?.type || '');
                      setCustomType(''); // Reset custom type when canceling
                    }}
                    className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Type:</span>
                    <span>{selectedImageData?.type || 'None'}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingType(true);
                    }}
                    className="p-2 text-gray-900 hover:bg-blue rounded-md"
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
              )}
            </div>



            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
                setSelectedImageData(null);
                setEditingType(false);
              }}
              className="absolute top-2 right-2 
                        bg-red-500 hover:bg-red-600
                        text-white p-2 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      ) :
        (<div className="container mx-auto px-4 py-8">
          <div className="flex justify-between mb-8">
            <div className="flex gap-4">
              {/* Filter Button */}
              <div className="relative">
                <button
                  className="p-2 rounded-full hover:scale-105 bg-orange-300 flex items-center gap-1"
                  onClick={toggleFilterMenu}
                  aria-label="Filter images"
                >
                  <Filter className="h-5 w-5" />
                  <span className="text-sm hidden md:inline">Filter: {filterType}</span>
                </button>

                {/* Filter Dropdown Menu */}
                {showFilterMenu && (
                  <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md z-10 min-w-40 py-2">
                    {getImageTypes().map(type => (
                      <button
                        key={type}
                        className={`w-full text-left px-4 py-2 hover:bg-blue/40 ${filterType === type ? 'bg-blue text-gray-900' : ''}`}
                        onClick={() => {
                          setFilterType(type);
                          setShowFilterMenu(false);
                        }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Images Button */}
              <button
                className="p-2 rounded-full bg-orange-400 hover:scale-105  shadow-lg flex items-center gap-1"
                onClick={handleImageModalOpen}
                aria-label="Add images"
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm hidden md:inline">Add images</span>
              </button>

              {/* Select/Delete Multiple Button */}
              <button
                className={`p-2 px-4 rounded-full flex items-center gap-2 ${selectionMode ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-orange-500 hover:scale-105 shadow-lg  '
                  }`}
                onClick={toggleSelectionMode}
                aria-label={selectionMode ? "Cancel selection" : "Select multiple"}
              >
                {selectionMode ? (
                  <>
                    <X className="h-5 w-5" />
                    <span className="text-sm hidden md:inline">Cancel</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-5 w-5 text-red-600 bg-white rounded-full p-1" />
                    <span className="text-sm hidden md:inline">Select</span>
                  </>
                )}
              </button>

              {/* Delete Selected Button - Show only when in selection mode */}
              {selectionMode && imagesToDelete.length > 0 && (
                <button
                  className="p-2 bg-red-500 text-white rounded-md flex items-center gap-1 hover:bg-red-600"
                  onClick={removeSelectedImages}
                  aria-label="Delete selected"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="text-sm">Delete ({imagesToDelete.length})</span>
                </button>
              )}
            </div>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No images found with the selected filter.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredImages.map((image, i) => (
                <div
                  key={i}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden ${selectionMode && imagesToDelete.includes(image.url) ? 'ring-4 ring-blue' : ''
                    }`}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={image?.url}
                    alt={`Gallery image ${i}`}
                    className={`w-full h-48 object-cover transition-transform duration-300 
                          ${selectionMode ? '' : 'group-hover:scale-105 group-hover:brightness-75'}`}
                  />

                  {/* Image Type Badge */}
                  {image?.type && (
                    <span className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      {image.type}
                    </span>
                  )}

                  {/* Selection Checkbox - Only visible in selection mode */}
                  {selectionMode && (
                    <div
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center
                            ${imagesToDelete.includes(image.url)
                          ? 'bg-blue text-white'
                          : 'bg-white bg-opacity-70'}`}
                    >
                      {imagesToDelete.includes(image.url) && <Check size={16} />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}





          {/* Add Image Modal */}
          {showImageModalAdd && <ImgHotel setShowModal={setShowImageModalAdd} showModal={showImageModalAdd} type={'property'} hotelId={id} path={''} reFetch={reFetch} />}
        </div>)
      }

    </>

  );
};

export default ImageGallery;