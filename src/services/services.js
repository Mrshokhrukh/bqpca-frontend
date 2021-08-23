// src/services/services.js
import apiClient from './apiClient'
import mhpcServices from './mhpcservices'
import accreditationServices from './accreditationservices'
import roqservices from './roqservices'
import ecpfServices from './ecpfServices'
import epcServices from './epcServices'
import userservices from './userservices'

export default {
  uploadFile(url, formData) {
    return apiClient.post(url, formData)
  },
  makePayment(data) {
    return apiClient.post('/payments/', data)
  },
  getAllPayments(appName) {
    return apiClient.get(`/payment_status/payment_details/?app_name=${appName}`)
  },

  // certificate verification
  verifyCertificate(params) {
    if (params.service_type == 'roq') {
      return apiClient.get(`/recognitions/recognition-of-qualifications/verify-certification/`, {
        params,
      })
    } else if (params.service_type == 'health_certification') {
      return apiClient.get(`/mhpc/mhpc-new-application/verify-certification/`, { params })
    }
  },

  getNotifications(params) {
    return apiClient.get('/users/notifications/', { params })
  },

  markNotificationAsRead(id) {
    return apiClient.post(`/users/notifications/${id}/mark-as-read/`)
  },

  markAllNotificationsAsRead() {
    return apiClient.post(`/users/notifications/mark-all-as-read/`)
  },

  ...userservices,
  ...mhpcServices,
  ...ecpfServices,
  ...accreditationServices,
  ...roqservices,
  ...epcServices,
}
