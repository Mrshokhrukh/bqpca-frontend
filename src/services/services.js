// src/services/services.js
import apiClient from './apiClient';
import bmhcServices from './bmhcservices';
import accreditationServices from './accreditationservices';
import roqservices from './roqservices';
import userservices from './userservices';


export default {
  uploadFile(url, formData) {
    return apiClient.post(url, formData)
  },
  ...userservices,
  ...bmhcServices,
  ...accreditationServices,
  ...roqservices,
}
