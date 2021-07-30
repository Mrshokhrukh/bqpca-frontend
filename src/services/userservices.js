import apiClient from './apiClient'

export default {
  // Authentication
  register(userData) {
    return apiClient.post('/users/register/', userData)
  },
  login(credentials) {
    return apiClient.post('/users/login/', credentials)
  },
  refreshToken(refreshToken) {
    return apiClient.post('/users/token/refresh/', { refresh: refreshToken })
  },
  verifyToken(token) {
    return apiClient.post('/users/token/verify/', { token: token })
  },
  passwordResetRequest(email) {
    return apiClient.post('/users/password/reset/', { email: email })
  },
  passwordResetConfirm(uid, token, newPassword) {
    return apiClient.post(`/users/password/reset/confirm/${uid}/${token}/`, {
      new_password: newPassword,
    })
  },

  // User Management (General - depends on your permissions!)
  getAllUsers() {
    return apiClient.get('/users/users/')
  },
  createUser(userData) {
    return apiClient.post('/users/users/', userData)
  },
  getUserDetails(id) {
    return apiClient.get(`/users/users/${id}/`)
  },
  updateUser(id, userData) {
    return apiClient.put(`/users/users/${id}/`, userData) // Full update
  },
  patchUser(id, userData) {
    return apiClient.patch(`/users/users/${id}/`, userData) // Partial update
  },
  deleteUser(id) {
    return apiClient.delete(`/users/users/${id}/`)
  },

  // User Profile (Specific to the logged-in user)
  updateProfile(id, updateData, config = {}) {
    return apiClient.patch(`/users/users/${id}/`, updateData, config) // Use PATCH
  },

  // Citizen Details (Assuming this is public/semi-public)
  fetchCitizenDetails(cid, config) {
    return apiClient.get(`/users/fetch-citizen-details/${cid}/`, config)
  },

  fetchRubDetails(cid, stUid) {
    return apiClient.get(`/masters/fetch-rub-details/${cid}/${stUid}/`)
  },

  // NDI Authentication
  finalizeNdiLogin(data) {
    return apiClient.post('/users/ndi/finalize-login/', data)
  },
  generateNdiQrCode(data) {
    return apiClient.post('/users/ndi/generate-qr-code/', data)
  },
  ndiRegistrationCallback(data) {
    return apiClient.post('/users/ndi/registration-callback/', data)
  },
  verifyNdiProof(data) {
    return apiClient.post('/users/ndi/verify-proof/', data)
  },
  handleNdiWebhook(data) {
    return apiClient.post('/users/ndi/webhook/', data)
  },
}
