// services/authService.js
import axios from 'axios';

export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    const response = await axios.post('http://127.0.0.1:8000/users/token/refresh/', {
      refresh,
    });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    return access;
  } catch (error) {
    console.error('Failed to refresh token', error);
    return null;
  }
};
