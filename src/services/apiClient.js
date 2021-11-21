// src/services/apiClient.js
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const apiClient = axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshTokenPromise = null

apiClient.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken // Or authStore.token, depending on your store's state property

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore() // Use the store here as well

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      error.response?.data?.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        if (!refreshTokenPromise) {
          refreshTokenPromise = axios.post(`${apiClient.defaults.baseURL}/users/token/refresh/`, {
            refresh: authStore.refreshToken,
          })
        }

        const response = await refreshTokenPromise
        refreshTokenPromise = null

        const newAccessToken = response.data.access
        authStore.setNewAccessToken(newAccessToken) // Assuming you have a method like this

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        refreshTokenPromise = null
        authStore.logout()
        window.location.href = '/login' // Redirect after logout
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
