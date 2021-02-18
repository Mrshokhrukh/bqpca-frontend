// stores/healthCertificationStore.js
import { defineStore } from 'pinia'
import bmhcServices from '@/services/bmhcservices'
import { useAuthStore } from '@/stores/authStore'

export const useHealthCertificationStore = defineStore('healthCertification', {
  state: () => ({
    applicationDetails: null,
    certificateDetails: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasSubmittedApplication: (state) => {
      return !!state.applicationDetails && state.applicationDetails.status !== 'draft'
    },

    hasApprovedApplication: (state) => {
      if (!state.applicationDetails) return false

      // Check if user has any qualifications with approved endorsement
      return state.applicationDetails.user_qualifications?.some(
        (qual) => qual.endorsement_decision === 'Approved',
      )
    },

    isRenewalPeriod: (state) => {
      if (!state.applicationDetails?.expiry_date) return false
      const expiryDate = new Date(state.applicationDetails.expiry_date)
      const today = new Date()
      const monthsRemaining = (expiryDate - today) / (1000 * 60 * 60 * 24 * 30)
      return monthsRemaining <= 3 && monthsRemaining > 0
    },

    isExpired: (state) => {
      if (!state.applicationDetails?.expiry_date) return false
      const expiryDate = new Date(state.applicationDetails.expiry_date)
      return new Date() > expiryDate
    },
  },

  actions: {
    async fetchApplicationDetails() {
      try {
        this.loading = true
        const authStore = useAuthStore()

        // Get all applications and filter for current user using email
        const response = await bmhcServices.getBhmcNewApplications()

        if (response.data && response.data.results) {
          // Find application for current user by email
          const userApplication = response.data.results.find(
            (app) => app.email_address === authStore.email,
          )

          if (userApplication) {
            this.applicationDetails = userApplication
          }
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching application details:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchCertificateDetails() {
      // Using the same application details since they contain certificate information
      this.certificateDetails = this.applicationDetails
    },

    async checkApplicationStatus() {
      await this.fetchApplicationDetails()
      await this.fetchCertificateDetails()
    },

    // Add this method to initialize the store
    async initialize() {
      console.log('Initializing health certification store...')
      await this.checkApplicationStatus()
    },
  },
})
