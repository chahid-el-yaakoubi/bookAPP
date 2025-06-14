// import Hotel from '../models/hotel.js';
import Hotel from '../models/property.js';
import User from '../models/user.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
// import { console } from 'inspector';
dotenv.config();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// UPLOAD IMAGES

export const uploadImgs = async (req, res, next) => {

  try {
    const hotelId = req.params.hotelId; // Extract hotel ID from the URL params
    const { type } = req.body
    // Validate if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded"
      });
    }

    // Find the hotel first
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "House not found"
      });
    }
    if (!hotel.property_details.photos) {
      hotel.property_details.photos = [];
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map(file =>
      cloudinary.v2.uploader.upload(file.path, { folder: "hotels" })
    );

    const results = await Promise.allSettled(uploadPromises); // Prevent failure if one upload fails

    // Extract successful uploads
    const uploadedImages = results
      .filter(result => result.status === "fulfilled")
      .map(result => ({
        url: result.value.secure_url, // Get the image URL
        type: type // Assign the provided type
      }));

    if (uploadedImages.length === 0) {
      return res.status(500).json({ success: false, message: "Image upload failed" });
    }

    // Push new images to the hotel's photos array
    const updatedHouse = await Hotel.findByIdAndUpdate(
      hotelId,
      { $push: { 'property_details.photos': { $each: uploadedImages } } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      hotel: updatedHouse
    });
  } catch (err) {
    console.error('Upload error:', err); // Debug log for errors
    next(err);
  }
}

export const creatHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);
  try {
    const saveHotel = await newHotel.save();
    res.status(200).json(saveHotel);
  } catch (err) {
    console.error('Error creating hotel:', err); // Log the error
    next(err);
  }
}



export const updateHotel = async (req, res, next) => {
  const { id } = req.params;
  const { adminId } = req.query;

  try {
    const hotel = await Hotel.findById(id);

    if (hotel && (hotel.created_by.toString() === adminId || req.user.adminFull)) {
      const updatedHotel = await Hotel.findByIdAndUpdate(id, { $set: req.body }, { new: true });
      return res.status(200).json(updatedHotel); 
    }

    // This will only execute if the above condition fails
    return res.status(403).json({ message: "Unauthorized: You do not have permission to update this hotel." });

  } catch (err) {
    next(err);
  }
};


export const updatePhotoType = async (req, res, next) => {
  const { id } = req.params; // Hotel ID
  const { photoUrl, newType } = req.body;

  try {
    const updatedHotel = await Hotel.findOneAndUpdate(
      {
        _id: id,
        "property_details.photos.url": photoUrl
      },
      {
        $set: {
          "property_details.photos.$.type": newType
        }
      },
      { new: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({ message: "Photo or hotel not found" });
    }

    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};




export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("hotel has been deleted.");
  } catch (err) {
    next(err);
  }
}


export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate({ path: 'rooms', select: 'status roomNumber type price capacity amenities beds bathrooms photos' });
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
}



// export const getHotels = async (req, res, next) => {
//     const { min, max, limit, ...other } = req.query;
//     const city = other.city;
//     const condition = city ? { "location.city": city } : {};

//     console.log(condition)
//     try {
//         const hotels = await Hotel.find(condition) ; //.skip(4)
//         res.status(200).json(hotels);
//     } catch (err) {
//         next(err);
//     }
// }

export const getHotels = async (req, res, next) => {
  const { limit, type, city } = req.query;

  let query = {};

  if (city) {
    query["location.city"] = city;
  }

  console.log(city)

  if (type === 'multi') {
    query["type.type"] = { $in: ['hotel', 'guesthouse'] };
  } else if (type === 'single') {
    query["type.type"] = { $in: ['house', 'apartment', 'villa'] };
  }

  try {
    let listings;
    if (type === 'multi') {
      listings = await Hotel.find(query)
        .populate({
          path: 'rooms',
          select: 'status roomNumber type price capacity amenities beds bathrooms photos'
        })
        .limit(limit ? parseInt(limit) : 0);

      // Transform the data to include detailed room information
      listings = listings.map(hotel => ({
        ...hotel.toObject(),
        roomSummary: {
          totalRooms: hotel.rooms?.length || 0,
          roomStatus: {
            available: hotel.rooms?.filter(room => room.status === 'available').length || 0,
            booked: hotel.rooms?.filter(room => room.status === 'booked').length || 0,
            maintenance: hotel.rooms?.filter(room => room.status === 'maintenance').length || 0
          },
          roomTypes: hotel.rooms?.reduce((acc, room) => {
            if (!acc[room.type]) {
              acc[room.type] = {
                count: 0,
                minPrice: Infinity,
                maxPrice: 0,
                totalCapacity: 0,
                totalBeds: 0
              };
            }
            acc[room.type].count++;
            acc[room.type].minPrice = Math.min(acc[room.type].minPrice, room.price || 0);
            acc[room.type].maxPrice = Math.max(acc[room.type].maxPrice, room.price || 0);
            acc[room.type].totalCapacity += room.capacity || 0;
            acc[room.type].totalBeds += room.beds?.reduce((sum, bed) => sum + (bed.count || 0), 0) || 0;
            return acc;
          }, {}) || {}
        },
        rooms: hotel.rooms?.map(room => ({
          id: room._id,
          roomNumber: room.roomNumber,
          type: room.type,
          status: room.status,
          price: room.price,
          capacity: room.capacity,
          amenities: room.amenities,
          beds: room.beds,
          bathrooms: room.bathrooms,
          photos: room.photos
        })) || []
      }));
    } else {
      listings = await Hotel.find(query).limit(limit ? parseInt(limit) : 0);

      // Fetch room details for each hotel
      listings = await Promise.all(listings.map(async hotel => {
        const rooms = await Hotel.findById(hotel._id).populate('rooms');
        return {
          ...hotel.toObject(),
          roomSummary: {
            totalRooms: rooms.rooms.length,
            totalBeds: rooms.rooms.reduce((sum, room) => {
              // Sum the count of beds for each room
              return sum + (room.beds ? room.beds.reduce((bedSum, bed) => bedSum + (bed.count || 0), 0) : 0);
            }, 0), // Ensure this is a number
            minPrice: Math.min(...rooms.rooms.map(room => room.price || Infinity)),
            maxPrice: Math.max(...rooms.rooms.map(room => room.price || 0))
          }
        };
      }));
    }

    res.status(200).json(listings);
    console.log('Admin hotels fetched successfully:', listings.length);

  } catch (err) {
    next(err);
  }
};


export const getAdminHotels = async (req, res, next) => {
  const { id, type } = req.params;
  try {
    const query = { created_by: id };

    if (type === 'multi') {
      query["type.type"] = { $in: ['hotel', 'guesthouse'] };
    } else if (type === 'single') {
      query["type.type"] = { $in: ['house', 'apartment', 'villa'] };
    }

    let listings;
    if (type === 'multi') {
      listings = await Hotel.find(query)
        .populate({
          path: 'rooms',
          select: 'status roomNumber type price capacity amenities beds bathrooms photos'
        });

      // Transform the data to include detailed room information
      listings = listings.map(hotel => ({
        ...hotel.toObject(),
        roomSummary: {
          totalRooms: hotel.rooms?.length || 0,
          roomStatus: {
            available: hotel.rooms?.filter(room => room.status === 'available').length || 0,
            booked: hotel.rooms?.filter(room => room.status === 'booked').length || 0,
            maintenance: hotel.rooms?.filter(room => room.status === 'maintenance').length || 0
          },
          roomTypes: hotel.rooms?.reduce((acc, room) => {
            if (!acc[room.type]) {
              acc[room.type] = {
                count: 0,
                minPrice: Infinity,
                maxPrice: 0,
                totalCapacity: 0,
                totalBeds: 0
              };
            }
            acc[room.type].count++;
            acc[room.type].minPrice = Math.min(acc[room.type].minPrice, room.price || 0);
            acc[room.type].maxPrice = Math.max(acc[room.type].maxPrice, room.price || 0);
            acc[room.type].totalCapacity += room.capacity || 0;
            acc[room.type].totalBeds += room.beds?.reduce((sum, bed) => sum + (bed.count || 0), 0) || 0;
            return acc;
          }, {}) || {}
        },
        rooms: hotel.rooms?.map(room => ({
          id: room._id,
          roomNumber: room.roomNumber,
          type: room.type,
          status: room.status,
          price: room.price,
          capacity: room.capacity,
          amenities: room.amenities,
          beds: room.beds,
          bathrooms: room.bathrooms,
          photos: room.photos
        })) || []
      }));
    } else {
      listings = await Hotel.find(query);
    }

    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
};






export const getPartners = async (req, res, next) => {

  console.log('partners')

  try {
    // 1. Find all hotels and populate the created_by user info
    const hotels = await Hotel.find().populate("created_by", "username email phoneNumber");

    // 2. Group the hotels by partner
    const partnerMap = {};

    hotels.forEach(hotel => {
      if (!hotel.created_by) return; // in case missing user

      const partnerId = hotel.created_by._id.toString();

      if (!partnerMap[partnerId]) {
        partnerMap[partnerId] = {
          _id: partnerId,
          username: hotel.created_by.username,
          email: hotel.created_by.email,
          phoneNumber: hotel.created_by.phoneNumber,
          totalProperties: 0,
          statuses: []
        };
      }

      partnerMap[partnerId].totalProperties += 1;
      partnerMap[partnerId].statuses.push(hotel.status.status);
    });

    // 3. Create the final partner array
    const partners = Object.values(partnerMap).map(partner => ({
      ...partner,
      statusCount: partner.statuses.reduce((acc, status) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {})
    }));

    res.status(200).json({ partners });

  } catch (err) {
    next(err);
  }
};




export const countByCity = async (req, res, next) => {
  const { id } = req.params;
  const condition = id === "all" ? {} : { isA: id };
  try {
    const hotelCount = await Hotel.countDocuments(condition);
    res.status(200).json(hotelCount);
  } catch (err) {
    next(err);
  }
}


export const test = async (req, res, next) => {
  const { id } = req.params;
  const condition = id === "all" ? {} : { isA: id };
  try {
    const hotelCount = await Hotel.countDocuments(condition);
    res.status(200).json(hotelCount);
  } catch (err) {
    next(err);
  }
}

export const countByType = async (req, res, next) => {

  try {
    const hotelCount = await Hotel.countDocuments({ type: "Hotel" });
    const villaCount = await Hotel.countDocuments({ type: "Villa" });
    const apartementCount = await Hotel.countDocuments({ type: "Apartement" });
    const restortCount = await Hotel.countDocuments({ type: "Restort" });
    const cabinCount = await Hotel.countDocuments({ type: "Cabin" });
    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "villa", count: villaCount },
      { type: "apartement", count: apartementCount },
      { type: "restort", count: restortCount },
      { type: "cabin", count: cabinCount }
    ]);
  } catch (err) {
    next(err);
  }
}


export const removeImgs = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const { images } = req.body; // Array of image URLs to remove

    if (!images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images provided for deletion"
      });
    }

    // Find the hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "House not found"
      });
    }

    // Ensure `property_details.photos` exists
    if (!hotel.property_details?.photos) {
      return res.status(400).json({
        success: false,
        message: "No photos found in this property"
      });
    }

    // Extract public IDs from Cloudinary URLs
    const deletePromises = images.map((imgUrl) => {
      try {
        const parts = imgUrl.split('/');
        const fileNameWithExtension = parts[parts.length - 1]; // Get "filename.jpg"
        const folderName = parts[parts.length - 2]; // Get folder name ("hotels")
        const publicId = `${folderName}/${fileNameWithExtension.split('.')[0]}`; // Extract public ID

        return cloudinary.v2.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error extracting public ID:", error);
        return Promise.resolve(null); // Prevent breaking the loop
      }
    });

    // Execute deletions with error handling
    const deleteResults = await Promise.allSettled(deletePromises);
    console.log("Cloudinary delete responses:", deleteResults);

    // Remove images from `property_details.photos`
    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotelId,
      { $pull: { 'property_details.photos': { url: { $in: images } } } }, // Match by `url`
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Images successfully removed",
      hotel: updatedHotel
    });
  } catch (err) {
    console.error("Remove images error:", err);
    next(err);
  }
};



export const getHotelPhotos = async (req, res, next) => {
  console.log('getHotelPhotos called with ID:', req.params.id);
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel && hotel.property_details?.photos) {
      res.status(200).json(hotel.property_details.photos);
    } else {
      res.status(404).json({ message: "Photos not found" });
    }
  } catch (err) {
    next(err);
  }
};





