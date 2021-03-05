import apiClient from './apiClient'

export default {
  // ECPF endpoints
  getEpcCapas() {
    return apiClient.get('/api/epc/epc-capa/')
  },
}
