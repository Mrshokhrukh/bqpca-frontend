// src/services/services.js
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_BASE_URL_PROD
    : import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  register(userData) {
    return apiClient.post('/users/register/', userData)
  },
  login(credentials) {
    return apiClient.post('/users/login/', credentials)
  },
}
