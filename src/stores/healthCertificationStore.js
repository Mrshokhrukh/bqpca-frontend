import { defineStore } from 'pinia'
import bmhcServices from '@/services/bmhcservices'

export const useHealthCertificationStore = defineStore('healthCertification', {
  state: () => ({
    applicationDetails: null,
    certificateDetails: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasSubmittedApplication: (state) => {
      return (
        state.applicationDetails?.status === 'SUBMITTED' ||
        state.applicationDetails?.status === 'APPROVED'
      )
    },

    isRenewalPeriod: (state) => {
      if (!state.certificateDetails?.expiry_date) return false
      const expiryDate = new Date(state.certificateDetails.expiry_date)
      const today = new Date()
      const monthsRemaining = (expiryDate - today) / (1000 * 60 * 60 * 24 * 30)
      return monthsRemaining <= 3 && monthsRemaining > 0
    },

    isExpired: (state) => {
      if (!state.certificateDetails?.expiry_date) return false
      const expiryDate = new Date(state.certificateDetails.expiry_date)
      return new Date() > expiryDate
    },
  },

  actions: {
    async fetchApplicationDetails() {
      try {
        this.loading = true
        const response = await bmhcServices.getBhmcNewApplications()
        if (response.data && response.data.length > 0) {
          this.applicationDetails = response.data[0]
        }
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchCertificateDetails() {
      try {
        this.loading = true
        const response = await bmhcServices.getCertificateDetails()
        this.certificateDetails = response.data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
  },
})
