// stores/healthCertificationStore.js
import { defineStore } from 'pinia'
import bmhcServices from '@/services/bmhcservices'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'

export const useHealthCertificationStore = defineStore('healthCertification', {
  state: () => ({
    applicationDetails: null,
    certificateDetails: null,
    loading: false,
    error: null,
    certificateNumber: null,
    registrationDetails: null,
    allApplications: [],
    cpds: [],
    cogs: [],
  }),

  getters: {
    // Application Status Getters
    hasSubmittedApplication: (state) => {
      return !!state.applicationDetails && state.applicationDetails.status !== 'draft'
    },

    hasApprovedApplication: (state) => {
      if (!state.applicationDetails) return false
      return state.applicationDetails.user_qualifications?.some(
        (qual) => qual.endorsement_decision === 'Approved',
      )
    },

    // Certificate Status Getters
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

    isInReregistrationPeriod: (state) => {
      if (!state.applicationDetails?.expiry_date) return false
      const expiryDate = new Date(state.applicationDetails.expiry_date)
      const today = new Date()
      const monthsSinceExpiry = (today - expiryDate) / (1000 * 60 * 60 * 24 * 30)
      return monthsSinceExpiry > 0 && monthsSinceExpiry <= 2
    },

    // Menu Visibility Getters
    userMenuAccess: (state) => {
      return {
        showDashboard: true, // Always shown
        showCertification: true, // Always shown
        showMyApplications: state.hasSubmittedApplication,
        showCPDManagement: state.hasApprovedApplication,
        showCoGSManagement: state.hasApprovedApplication,
        showRenewal: state.isRenewalPeriod,
        showReRegistration: state.isInReregistrationPeriod,
        showProfile: true, // Always shown
      }
    },

    // Application Details Getters
    applicationStatus: (state) => {
      return state.applicationDetails?.status || null
    },

    qualifications: (state) => {
      return state.applicationDetails?.user_qualifications || []
    },

    // CPD and CoGS Getters
    activeCPDs: (state) => {
      return state.cpds.filter((cpd) => cpd.status === 'active')
    },

    activeCoGS: (state) => {
      return state.cogs.filter((cog) => cog.status === 'active')
    },
  },

  actions: {
    // Initialize Store
    async initialize() {
      console.log('Initializing health certification store...')
      await this.checkApplicationStatus()
      if (this.hasApprovedApplication) {
        await Promise.all([this.fetchCPDs(), this.fetchCoGS()])
      }
    },

    // Application Actions
    async fetchApplicationDetails() {
      try {
        this.loading = true
        const authStore = useAuthStore()
        const response = await bmhcServices.getBhmcNewApplications()

        if (response.data && response.data.results) {
          this.allApplications = response.data.results
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

    async submitApplication(applicationData) {
      try {
        this.loading = true
        const response = await bmhcServices.submitBhmcApplication(applicationData)
        if (response.data) {
          this.applicationDetails = response.data
          useToast().success('Application submitted successfully')
        }
        return response.data
      } catch (error) {
        this.error = error.message
        useToast().error('Failed to submit application')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Certificate Actions
    async fetchCertificateDetails() {
      if (!this.applicationDetails?.certificate_number) return
      try {
        this.loading = true
        const response = await bmhcServices.getCertificateDetails(
          this.applicationDetails.certificate_number,
        )
        if (response.data) {
          this.certificateDetails = response.data
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching certificate details:', error)
      } finally {
        this.loading = false
      }
    },

    async submitRenewal(renewalData) {
      try {
        this.loading = true
        const response = await bmhcServices.submitRenewal(renewalData)
        if (response.data) {
          useToast().success('Renewal submitted successfully')
        }
        return response.data
      } catch (error) {
        this.error = error.message
        useToast().error('Failed to submit renewal')
        throw error
      } finally {
        this.loading = false
      }
    },

    async submitReregistration(reregistrationData) {
      try {
        this.loading = true
        const response = await bmhcServices.submitReregistration(reregistrationData)
        if (response.data) {
          useToast().success('Re-registration submitted successfully')
        }
        return response.data
      } catch (error) {
        this.error = error.message
        useToast().error('Failed to submit re-registration')
        throw error
      } finally {
        this.loading = false
      }
    },

    // CPD Actions
    async fetchCPDs() {
      try {
        this.loading = true
        const response = await bmhcServices.getCPDs()
        if (response.data) {
          this.cpds = response.data
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching CPDs:', error)
      } finally {
        this.loading = false
      }
    },

    async submitCPD(cpdData) {
      try {
        this.loading = true
        const response = await bmhcServices.submitCPD(cpdData)
        if (response.data) {
          useToast().success('CPD submitted successfully')
          await this.fetchCPDs()
        }
        return response.data
      } catch (error) {
        this.error = error.message
        useToast().error('Failed to submit CPD')
        throw error
      } finally {
        this.loading = false
      }
    },

    // CoGS Actions
    async fetchCoGS() {
      try {
        this.loading = true
        const response = await bmhcServices.getCoGS()
        if (response.data) {
          this.cogs = response.data
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching CoGS:', error)
      } finally {
        this.loading = false
      }
    },

    async submitCoGS(cogsData) {
      try {
        this.loading = true
        const response = await bmhcServices.submitCoGS(cogsData)
        if (response.data) {
          useToast().success('CoGS submitted successfully')
          await this.fetchCoGS()
        }
        return response.data
      } catch (error) {
        this.error = error.message
        useToast().error('Failed to submit CoGS')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Status Check Actions
    async checkApplicationStatus() {
      await this.fetchApplicationDetails()
      if (this.hasApprovedApplication) {
        await this.fetchCertificateDetails()
      }
    },

    // Error Handling
    clearError() {
      this.error = null
    },

    // Reset Store
    resetStore() {
      this.applicationDetails = null
      this.certificateDetails = null
      this.loading = false
      this.error = null
      this.certificateNumber = null
      this.registrationDetails = null
      this.allApplications = []
      this.cpds = []
      this.cogs = []
    },
  },
})
