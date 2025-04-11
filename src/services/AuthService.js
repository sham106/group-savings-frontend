import api from './api';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.errors ? Object.values(error.errors).join(' ') : error.error || 'Registration failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Login failed');
  }
};

export const getProfile = async (token) => {
  try {
    const response = await api.get('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.error || 'Failed to fetch profile');
  }
};

export const updateProfile = async (token, profileData) => {
  try {
    const response = await api.put('/api/auth/profile', profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.errors ? Object.values(error.errors).join(' ') : error.error || 'Profile update failed');
  }
};