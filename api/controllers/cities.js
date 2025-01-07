import City from '../models/cities.js';
import { createError } from '../utils/error.js';

// Create a new city
export const createCity = async (req, res, next) => {
    const newCity = new City(req.body);
    try {
        const savedCity = await newCity.save();
        res.status(201).json(savedCity);
    } catch (err) {
        next(err);
    }
};

// Get all cities
export const getCities = async (req, res, next) => {
    try {
        const cities = await City.find();
        res.status(200).json(cities);
    } catch (err) {
        next(err);
    }
};

// Get cities by region
export const getCitiesByRegion = async (req, res, next) => {
    const { region } = req.params;
    try {
        const cities = await City.find({ region })
            .populate('neighbors', 'name region');
        res.status(200).json(cities);
    } catch (err) {
        next(err);
    }
};

// Get single city
export const getCity = async (req, res, next) => {
    try {
        const city = await City.findById(req.params.id);
        if (!city) return next(createError(404, "City not found!"));
        res.status(200).json(city);
    } catch (err) {
        next(err);
    }
};

// Update city
export const updateCity = async (req, res, next) => {
    try {
        const updatedCity = await City.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate('neighbors', 'name region');
        if (!updatedCity) return next(createError(404, "City not found!"));
        res.status(200).json(updatedCity);
    } catch (err) {
        next(err);
    }
};

// Delete city
export const deleteCity = async (req, res, next) => {
    try {
        const city = await City.findById(req.params.id);
        if (!city) return next(createError(404, "City not found!"));

        // Remove this city from all its neighbors' neighbor lists
        await City.updateMany(
            { _id: { $in: city.neighbors } },
            { $pull: { neighbors: req.params.id } }
        );

        await City.findByIdAndDelete(req.params.id);
        res.status(200).json("City has been deleted.");
    } catch (err) {
        next(err);
    }
};

// Add neighbor(s)
export const addNeighbor = async (req, res, next) => {
    try {
        const { cityId } = req.params;
        const { neighbors: neighborName } = req.body;

        console.log('Attempting to add neighbor:');
        console.log('City ID:', cityId);
        console.log('Neighbor Name:', neighborName);

        // Validate input
        if (!neighborName) {
            return next(createError(400, "Neighbor name is required"));
        }

        // Get the city and update its neighbors array
        const updatedCity = await City.findByIdAndUpdate(
            cityId,
            { $addToSet: { neighbors: neighborName.trim() } },  // Use addToSet to avoid duplicates
            { new: true }
        );

        if (!updatedCity) {
            return next(createError(404, "City not found"));
        }

        res.status(200).json(updatedCity);

    } catch (err) {
        next(err);
    }
};

// Remove neighbor
export const removeNeighbor = async (req, res, next) => {
    try {
        const { cityId } = req.params;
        const { neighborName } = req.body;

        console.log('Removing neighbor:');
        console.log('City ID:', cityId);
        console.log('Neighbor Name:', neighborName);

        if (!neighborName) {
            return next(createError(400, "Neighbor name is required"));
        }

        // Remove neighbor name from the city's neighbors array
        const updatedCity = await City.findByIdAndUpdate(
            cityId,
            { $pull: { neighbors: neighborName.trim() } },
            { new: true }
        );

        if (!updatedCity) {
            return next(createError(404, "City not found"));
        }

        res.status(200).json(updatedCity);
    } catch (err) {
        next(err);
    }
};



export const countByCity = async (req, res, next) => {
    try {
    const hotelCount = await City.countDocuments({});
        res.status(200).json(hotelCount);
    } catch (err) {
        next(err);
    }
}

