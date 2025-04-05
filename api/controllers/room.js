import Hotel from '../models/property.js';
import Room from '../models/room.js';

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


export const createRoom = async (req, res, next) => {
    const hotelId = req.params.hotelId;
    const newRoom = new Room(req.body)
    try {
        const savedRoom = await newRoom.save();

        try {
            await Hotel.findByIdAndUpdate(hotelId, {$push : {rooms : savedRoom._id}});
        } catch (err) {
            next(err);
        }
        res.status(200).json(savedRoom);
    } catch (err) {
        next(err);
    }
}


export const updateRoom = async (req, res, next) => {

    try {
        const updateRoom = await Room.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateRoom);
    } catch (err) {
       next(err);
    }
}



export const deleteRoom = async (req, res, next) => {
    const hotelId = req.params.hotelId;
    
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }

        const updatedHotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { $pull: { rooms: req.params.id } },
            { new: true }
        );

        if (!updatedHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        res.status(200).json({ message: "Room has been deleted and removed from hotel.", updatedHotel });
    } catch (err) {
        next(err);
    }
};

  


export const getRoom = async (req, res, next) => {
    try {
        const room= await Room.findById(req.params.id);
        res.status(200).json(room);
    } catch (err) {
       next(err);
    }
}


export const getRooms = async (req, res, next) => {
    const hotelId = req.params.hotelId;
    try {
        const hotel = await Hotel.findById(hotelId);
        const rooms = await Room.find({ _id: { $in: hotel.rooms } });
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
}


export const uploadImgs = async (req, res, next) => {
    console.log("Uploading images...");

    try {
        const roomId = req.params.roomId;

        // Basic validation
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded"
            });
        }

        // Validate room existence
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        // Upload to Cloudinary
        const uploadPromises = req.files.map(file =>
            cloudinary.v2.uploader.upload(file.path, {
                folder: "rooms"
            })
        );

        const results = await Promise.allSettled(uploadPromises);

        const uploadedImages = results
            .filter(result => result.status === "fulfilled")
            .map(result => ({
                url: result.value.secure_url,
                public_id: result.value.public_id // Optional but useful
            }));

        if (uploadedImages.length === 0) {
            return res.status(500).json({
                success: false,
                message: "Image upload failed"
            });
        }

        // Save URLs to the room
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { $push: { photos: { $each: uploadedImages } } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `${uploadedImages.length} image(s) uploaded successfully`,
            room: updatedRoom
        });
    } catch (err) {
        console.error("Upload error:", err);
        next(err);
    }
};


export const getRoomPhotos = async (req, res, next) => {
    try {
      const room = await Room.findById(req.params.id);
      if (room && room?.photos) {
        res.status(200).json(room.photos);
      } else {
        res.status(404).json({ message: "Photos not found" });
      }
    } catch (err) {
      next(err);
    }
  };
  
 

  export const deleteRoomImg = async (req, res, next) => {
    const { roomId } = req.params;

    const imgUrl = req.body.imgUrl;

    console.log(roomId, imgUrl);
    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        const decodedUrl = decodeURIComponent(imgUrl);

        const imageExists = room.photos.some(photo => photo.url === decodedUrl);
        if (!imageExists) {
            return res.status(404).json({
                success: false,
                message: "Image not found in this room"
            });
        }

        // Remove image URL from DB
        await Room.findByIdAndUpdate(roomId, {
            $pull: { photos: { url: decodedUrl } }
        });

        res.status(200).json({
            success: true,
            message: "Image removed from database successfully"
        });

    } catch (err) {
        console.error("Delete image error:", err);
        next(err);
    }
};
