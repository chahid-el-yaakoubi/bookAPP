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

// Auth API
export const login = async (username, password) => {
  const response = await api.post('/api/auth/login', { username, password });
  console.log({'data' : response.data})

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
export const getProperties = async () => {
  const response = await api.get('/api/hotels');

  return response;
};

export const createProperty = async (propertyData) => {
  const response = await api.post('/api/hotels', propertyData);
  return response;
};

export const updateProperty = async (id, propertyData) => {
  const response = await api.put(`/api/properties/${id}`, propertyData);
  return response.data;
};

export const deleteProperty = async (id) => {
  const response = await api.delete(`/api/hotels/${id}`);
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
  return response.data;
};


// Example for logout (optional, just clear localStorage in frontend)
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};
