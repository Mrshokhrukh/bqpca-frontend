import { defineStore } from 'pinia'
import apiServices from '@/services/services'
import dayjs from 'dayjs'
import { useAuthStore } from '@/stores/authStore'

export const useEpcDashboardStore = defineStore('epcDashboard', {
  state: () => ({
    userDetail: {
      username: '',
      registration_no: '',
      name: '',
      id: '',
      email: '',
      phone: '',
      qualification: '',
      registrationType: '',
      photo: null,
    },
    applications: [],
    cpdCredits: 0,
    licenseExpiryDate: null,
    licenseStatus: null,
    renewalMessage: '',
    showViewCertificateButton: false,
    recentActivities: [],
    upcomingDeadlines: [],
    selectedApplications: [],
    modalTitle: '',
    isLoading: false,
    selectedApplication: null,
    showCertificateModal: false,
    error: null,
  }),

  getters: {
    currentUserApplication() {
      const authStore = useAuthStore()
      if (!this.applications || !authStore.user?.cid) {
        return null
      }
      const userApplications = this.applications.filter((app) => app.cid === authStore.user.cid)
      return (
        userApplications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null
      )
    },

    hasApplication() {
      return !!this.currentUserApplication
    },

    hasSubmitted() {
      return !!this.currentUserApplication?.status
    },

    hasApprovedApp() {
      const app = this.currentUserApplication
      if (!app) return false
      return app.user_qualifications?.some((q) => q.endorsement_decision === 'Approved') ?? false
    },

    isRenewalPeriod() {
      if (!this.hasApprovedApp || !this.licenseExpiryDate) return false
      const expiryDate = new Date(this.licenseExpiryDate)
      const today = new Date()
      const monthsRemaining = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)
      return monthsRemaining <= 3 && monthsRemaining > 0
    },

    isInReregistrationPeriod() {
      if (!this.hasApprovedApp || !this.licenseExpiryDate) return false
      const expiryDate = new Date(this.licenseExpiryDate)
      const today = new Date()
      const monthsSinceExpiry =
        (today.getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      return monthsSinceExpiry > 0 && monthsSinceExpiry <= 2
    },
  },

  actions: {
    /** Fetch all dashboard data with proper error handling (similar to MHPC structure) */
    async fetchAllData(cid) {
      this.isLoading = true
      this.error = null

      try {
        // Fetch applications data
        const applicationsData = await apiServices
          .getEpcFullApplicationListByCid(cid)
          .catch((error) => {
            console.error('Error fetching EPC applications data:', error)
            return null
          })

        // Fetch CPD data
        const cpdData = await apiServices.getEpcCpdRecordsByCid(cid).catch((error) => {
          console.error('Error fetching EPC CPD data:', error)
          return null
        })

        // Process data only if it exists
        if (applicationsData) this.processApplicationsData(applicationsData)
        if (cpdData) this.processCpdData(cpdData)

        this.updateActivitiesAndDeadlines()
      } catch (error) {
        console.error('Error in fetchAllData:', error)
        this.error = 'An unexpected error occurred. Some data may be incomplete.'
      } finally {
        this.isLoading = false
      }
    },

    /** Process applications data with null safety and empty case handling */
    processApplicationsData(response) {
      // Handle both direct array and paginated response structure
      const results = Array.isArray(response?.data) ? response.data : response?.data?.results || []

      if (results.length > 0) {
        const latestApp = results[0]
        this.updateUserDetails(latestApp)
        this.updateLicenseStatus(latestApp)
        this.processApplicationsList(results)
        this.checkExpiration(latestApp.expiry_date)
      } else {
        this.renewalMessage = 'No applications available'
        this.applications = []
      }
    },

    /** Process CPD data with null safety */
    processCpdData(response) {
      const cpdDetails = response?.data?.details
      if (response?.data?.valid && cpdDetails) {
        this.cpdCredits = cpdDetails.cpd_credit || 0
        this.addCpdApplication(cpdDetails)
      } else {
        this.cpdCredits = 0
      }
    },

    /** Update user details with null checks - FIXED to get registration_no from top level */
    updateUserDetails(app) {
      if (app) {
        const primaryQualification = app.user_qualifications?.find(
          (q) => q.is_primary_qualification,
        )

        // Registration number is at the top level of the application object
        this.userDetail.registration_no = app.registration_no || ''
        this.userDetail.username = app.full_name || ''
        this.userDetail.name = app.full_name || ''
        this.userDetail.id = app.cid_no || ''
        this.userDetail.email = app.email_address || ''
        this.userDetail.phone = app.contact_no || ''
        this.userDetail.registrationType = app.registration_type_name || ''
        this.userDetail.photo = app.passport_photo || null

        // Dates can come from app or primary qualification
        this.licenseExpiryDate = app.expiry_date || primaryQualification?.expiry_date || null
        this.licenseStatus = app.user_qualifications?.[0]?.endorsement_decision || 'Unknown'

        // Extract primary qualification details if available
        if (primaryQualification) {
          this.userDetail.qualification = primaryQualification.qualification_name_display || 'N/A'
        }
      }
    },

    /** Update license status with null safety */
    updateLicenseStatus(app) {
      if (app?.user_qualifications && Array.isArray(app.user_qualifications)) {
        this.showViewCertificateButton = app.user_qualifications.every(
          (q) => q?.endorsement_decision === 'Approved',
        )
      } else {
        this.showViewCertificateButton = false
      }
    },

    /** Process applications list with null safety */
    processApplicationsList(results) {
      if (Array.isArray(results)) {
        this.applications = results.map((app) => ({
          ...app,
          name: app?.registration_type_name || 'Unknown Application',
          type: this.determineApplicationType(app?.registration_type_name),
          date: app?.created_at || '',
          status: app?.user_qualifications?.[0]?.endorsement_decision || 'Status Unavailable',
          remarks: app?.user_qualifications?.[0]?.endorsement_remarks || '',
        }))
      } else {
        this.applications = []
      }
    },

    /** Determine application type with null check */
    determineApplicationType(name) {
      if (!name) return 'Other'
      if (name.includes('Registration') || name.includes('Certification')) return 'License'
      if (name.includes('CPD')) return 'CPD'
      if (name.includes('Education') || name.includes('Program')) return 'Engineering Program'
      return 'Other'
    },

    /** Add CPD application with null safety */
    addCpdApplication(cpdDetails) {
      if (cpdDetails) {
        this.applications.push({
          ...cpdDetails,
          name: cpdDetails.title_of_cpd || 'CPD Record',
          type: 'CPD',
          date: cpdDetails.created_at || '',
          status: cpdDetails.review_status || 'Pending',
          remarks: cpdDetails.remark || '',
        })
      }
    },

    /** Check expiration with date validation */
    checkExpiration(expiryDate) {
      if (!expiryDate || !dayjs(expiryDate).isValid()) {
        this.renewalMessage = 'Expiry date not available'
        return
      }

      const expiry = dayjs(expiryDate)
      const current = dayjs()
      const threeMonths = expiry.subtract(3, 'month')
      const twoWeeks = expiry.subtract(2, 'week')

      if (current.isAfter(expiry)) {
        this.renewalMessage = 'License has expired'
      } else if (current.isAfter(twoWeeks)) {
        this.renewalMessage = 'License expires in less than 2 weeks'
      } else if (current.isAfter(threeMonths)) {
        this.renewalMessage = 'License expires in less than 3 months'
      } else {
        this.renewalMessage = 'License is valid'
      }
    },

    /** Update activities and deadlines with null safety */
    updateActivitiesAndDeadlines() {
      if (Array.isArray(this.applications)) {
        this.recentActivities = this.applications.slice(0, 5).map((app) => ({
          type: (app.type || 'other').toLowerCase(),
          title: app.name || 'Untitled',
          date: app.date || '',
          status: app.status || 'Unknown',
          description:
            app.remarks || `Your application has been ${app.status?.toLowerCase() || 'processed'}`,
        }))

        this.upcomingDeadlines = [
          {
            title: 'CPD Points Target',
            date: dayjs().endOf('year').format('YYYY-MM-DD'),
            type: 'CPD',
            description: 'Submit your CPD records for the year',
          },
          {
            title: 'License Renewal',
            date: this.licenseExpiryDate || null,
            type: 'Renewal',
            description: 'Submit your renewal application before license expires',
          },
        ].filter((deadline) => deadline.date)
      } else {
        this.recentActivities = []
        this.upcomingDeadlines = []
      }
    },

    /** Set selected applications with null safety */
    setSelectedApplications(status) {
      if (Array.isArray(this.applications)) {
        this.selectedApplications = this.applications.filter((app) => app.status === status)
        this.modalTitle = `${status} Applications`
      } else {
        this.selectedApplications = []
        this.modalTitle = ''
      }
    },

    /** Clear selected applications */
    clearSelectedApplications() {
      this.selectedApplications = []
      this.modalTitle = ''
    },

    /** Toggle certificate modal with null safety */
    async setShowCertificateModal(show) {
      this.showCertificateModal = show
      if (show && Array.isArray(this.applications)) {
        // Find an approved application
        const approvedApp = this.applications.find((app) =>
          app.user_qualifications?.some((q) => q.endorsement_decision === 'Approved'),
        )

        if (approvedApp) {
          try {
            const response = await apiServices.getEpcNewApplication(approvedApp.id)
            const applicationData = response.data

            if (applicationData) {
              const primaryQualification = applicationData.user_qualifications?.find(
                (q) => q.is_primary_qualification,
              )

              this.selectedApplication = {
                ...applicationData,
                // Registration number is at top level of application
                registrationNumber: applicationData.registration_no || 'N/A',
                fullName: applicationData.full_name || 'N/A',
                issueDate: applicationData.registration_date || applicationData.created_at,
                expiryDate: applicationData.expiry_date || null,
                qualificationName: primaryQualification?.qualification_name_display || 'N/A',
              }
            } else {
              this.selectedApplication = null
            }
          } catch (error) {
            console.error('Error fetching EPC application details for certificate:', error)
            this.error = error.message || 'Failed to fetch certificate details.'
            this.selectedApplication = null
          }
        }
      } else {
        this.selectedApplication = null
      }
    },

    setSelectedApplication(application) {
      this.selectedApplication = application
    },

    /** Reset store to initial state */
    resetStore() {
      Object.assign(this, {
        userDetail: {
          username: '',
          registration_no: '',
          name: '',
          id: '',
          email: '',
          phone: '',
          qualification: '',
          registrationType: '',
          photo: null,
        },
        applications: [],
        cpdCredits: 0,
        licenseExpiryDate: null,
        licenseStatus: null,
        renewalMessage: '',
        showViewCertificateButton: false,
        recentActivities: [],
        upcomingDeadlines: [],
        selectedApplications: [],
        modalTitle: '',
        isLoading: false,
        selectedApplication: null,
        showCertificateModal: false,
        error: null,
      })
    },
  },
})
