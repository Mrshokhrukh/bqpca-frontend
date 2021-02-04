// src/services/services.js
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import bmhcServices from './bmhcservices';
import accreditationServices from './accreditationServices';
import roqservices from './roqservices';
import userservices from './userservices';

const apiClient = axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Consolidated interceptors (removed duplicates)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Handle FormData content type automatically
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      error.response?.data?.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const newAccessToken = await authStore.refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error('Unable to refresh token:', refreshError)
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default {
  uploadFile(url, formData) {
    return apiClient.post(url, formData)
  },
  ...userservices,
  ...bmhcServices,
  ...accreditationServices,
  ...roqservices,

}
