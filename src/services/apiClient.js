// src/services/apiClient.js
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore' // <-- IMPORT YOUR AUTH STORE

const apiClient = axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Store refresh promise to prevent multiple refresh calls
let refreshTokenPromise = null

apiClient.interceptors.request.use(
  async (config) => {
    // ✅ CHANGED: Get the token from the Pinia store directly
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
          // Use the refresh token from the store
          refreshTokenPromise = axios.post(`${apiClient.defaults.baseURL}/users/token/refresh/`, {
            refresh: authStore.refreshToken,
          })
        }

        const response = await refreshTokenPromise
        refreshTokenPromise = null

        const newAccessToken = response.data.access
        // ✅ CHANGED: Update the token via a store action/mutation
        // This ensures localStorage and the state are updated together.
        authStore.setNewAccessToken(newAccessToken) // Assuming you have a method like this

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        refreshTokenPromise = null
        // ✅ CHANGED: Use a store action to handle logout
        // This clears state and localStorage consistently.
        authStore.logout()
        window.location.href = '/login' // Redirect after logout
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient