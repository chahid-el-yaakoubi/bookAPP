import axios from 'axios';
 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUserId = () => {
  const userString = localStorage.getItem('user');
  if (!userString) return null;
  try {
    const user = JSON.parse(userString);
    return user.id;
  } catch (error) {
    console.error('Invalid user data in localStorage:', error);
    return null;
  }
};


// Auth API
export const login = async (username, password) => {
  const response = await api.post('/api/auth/login', { username, password });
  console.log({ 'data': response.data })

  return response.data;
};

export const register = async (formdata) => {
  const response = await api.post('/api/auth/register', formdata);
  return response;
};

export const CheckUsername = async (username) => {
  const response = await api.post('/api/auth/check-username', { username });
  return response;
};

// Add other endpoints like getProperties, createProperty, etc. if needed



// PROPERTIES: CRUD (create, read, update, delete)
export const getProperties = async (city, type) => {
  const conditions = city ? `&city=${city}` : '';
  // const type = city ? `&city=${city}` : '';
  const response = await api.get(`/api/hotels?type=${type}${conditions}`);

  return response;
};

export const getProperty = async (id) => {
  const response = await api.get(`/api/hotels/find/${id}`);
  return response;
};

export const createProperty = async (propertyData) => {
  const response = await api.post('/api/hotels', propertyData);
  return response;
};

export const updateProperty = async (id, propertyData) => {
  const adminId = getUserId();
  const response = await api.put(`/api/hotels/${id}?adminId=${adminId}`, propertyData);
  return response;
};



export const deleteProperty = async (id) => {
  const response = await api.delete(`/api/hotels/${id}`);
  return response;
};


export const addPhotosProperty = async (id,type, formdata) => {
  const response = await api.post(`/api/${type}/${id}/upload`, formdata, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  console.log(response)

  return response;
};

export const updatePhotosProperty = async (id, formdata) => {
  const response = await api.put(`/api/hotels/${id}/update_photo`, formdata);
  return response;
};

export const deletePhotosProperty = async (id, formdata) => {
  const response = await api.delete(`/api/hotels/${id}/delete_photos`, formdata);
  return response;
};

// admin properties
export const getPropertiesAdmin = async (id, type) => {
  const response = await api.get(`/api/hotels/${id}/${type}`);

  return response;
};

// rooms
export const getPropertiesRooms = async (id) => {
  const response = await api.get(`/api/rooms/${id}/find`);

  return response;
};

export const createRoom = async (id, formdata) => {
  const response = await api.post(`/api/rooms/${id}`, formdata);

  return response;
};

export const updateRoom = async (id, formdata) => {
  const response = await api.put(`/api/rooms/${id}`, formdata);

  return response;
};


export const deleteRoom = async (id, hotelId) => {
  const response = await api.delete(`/api/rooms/${id}/${hotelId}`);

  return response;
};
// bookoings
export const createBooking = async (bookingData) => {
  const response = await api.post('/api/bookings', bookingData);
  return response;
};

export const updateBooking = async (id, bookingData) => {
  const response = await api.put(`/api/bookings/${id}`, bookingData);
  return response;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/api/bookings/${id}`);
  return response;
};

export const getBookings = async () => {
  const response = await api.get('/api/bookings');
  return response;
};
export const getBookingsPatner = async (partnerId) => {
  const response = await api.get('/api/bookings/' + partnerId);
  return response;
};
export const getBooking = async (id) => {
  const response = await api.get(`/api/bookings/${id}/single`);
  return response;
};

// USERS
export const getUsers = async () => {
  const response = await api.get('/api/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/api/users/${id}`, userData);
  return response;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/api/users/${id}`);
  return response;
};

// add region
// Create a new region
export const createRegion = async (regionData) => {
  const response = await api.post('/api/cities', regionData);
  console.log(regionData)
  return response;
};

export const getRegions = async () => {
  const response = await api.get('/api/cities');
  return response;
};

export const updateRegion = async (id, regionData) => {
  const response = await api.put(`/api/cities/${id}`, regionData);
  console.log(regionData)

  return response;
};

export const deleteRegion = async (id) => {
  const response = await api.delete(`/api/cities/${id}`);
  return response;
};

// Example for logout (optional, just clear localStorage in frontend)
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// REVIEWS: CRUD (create, read, update, delete)
export const createReview = async (reviewData) => {
  const response = await api.post('/api/reviews', reviewData);
  return response;
};
 
export const likeReview = async (id, reviewData) => {
  const response = await api.post(`/api/reviews/${id}/like`, reviewData);
  return response;
};

export const getReviewsForListing = async (listingId) => {
  const response = await api.get(`/api/reviews/listing/${listingId}`);
  return response;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`/api/reviews/${reviewId}`, reviewData);
  return response;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/api/reviews/${reviewId}`);
  return response;
};

// cars 
export const deleteCar = async (id) => {
  const response = await api.delete(`/api/cars/${id}`);
  return response;
};

export const addCar = async (formData) => {
  const response = await api.post(`/api/cars`, formData);
  return response;
};
