// src/services/apiClient.js
import axios from 'axios'

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
    const token = localStorage.getItem('accessToken')

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

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      error.response?.data?.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        // Use existing refresh token promise if it exists
        if (!refreshTokenPromise) {
          refreshTokenPromise = axios.post(`${apiClient.defaults.baseURL}/users/token/refresh/`, {
            refresh: localStorage.getItem('refreshToken'),
          })
        }

        const response = await refreshTokenPromise
        refreshTokenPromise = null

        const newAccessToken = response.data.access
        localStorage.setItem('accessToken', newAccessToken)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return apiClient(originalRequest)
      } catch (refreshError) {
        refreshTokenPromise = null
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
