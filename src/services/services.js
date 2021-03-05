// src/services/services.js
import apiClient from './apiClient';
import bmhcServices from './bmhcservices';
import accreditationServices from './accreditationservices';
import roqservices from './roqservices';
import ecpfServices from './ecpfServices';
import epcServices from './epcServices';
import userservices from './userservices';


export default {
  uploadFile(url, formData) {
    return apiClient.post(url, formData)
  },
  makePayment(data) {
    return apiClient.post('/payments/', data)
  },

  // certificate verification
  verifyCertificate(params) {
    if (params.service_type == 'roq') {
      return apiClient.get(`/recognitions/recognition-of-qualifications/verify-certification/`, { params });
    } else if (params.service_type == 'health_certification') {
      return apiClient.get(`/bmhc/bmhc-new-application/verify-certification/`, { params });
    }
  },

  getNotificationn() {
    return apiClient.get('/notification-events/')
  },

  markNotificationAsRead(id) {
    return apiClient.patch(`/notification-events/${id}/`, { is_read: true })
  },
  markAllNotificationsAsRead() {
    return apiClient.patch(`/notification-events/mark-all-as-read/`)
  },

  ...userservices,
  ...bmhcServices,
  ...ecpfServices,
  ...accreditationServices,
  ...roqservices,
  ...epcServices,
}
