// src/stores/epcUserDashboardStore.js
import { defineStore } from 'pinia'
import epcServices from '@/services/epcServices'

export const useEpcDashboardStore = defineStore('epcDashboard', {
  state: () => ({
    userDetail: null,
    applications: [],
    cpdCredits: 0,
    licenseExpiryDate: null,
    licenseStatus: 'Inactive',
    renewalMessage: '',
    showViewCertificateButton: false,
    recentActivities: [],
    upcomingDeadlines: [],
    selectedApplications: [],
    modalTitle: '',
    isLoading: false,
    selectedApplication: null,
    showCertificateModal: false,
  }),

  actions: {
    async fetchAllData(cid) {
      this.isLoading = true
      try {
        // Fetch all required data in parallel
        await Promise.all([
          this.fetchUserDetails(cid),
          this.fetchApplications(cid),
          this.fetchCpdCredits(cid),
          this.fetchActivities(cid),
          this.fetchDeadlines(cid),
        ])

        // Determine license status and expiry based on retrieved data
        this.determineLicenseStatus()

        // Set renewal message if needed
        this.determineRenewalMessage()

        // Determine if certificate button should be shown
        this.determineShowCertificateButton()
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchUserDetails(cid) {
      try {
        // Assuming there's an endpoint for fetching user details
        const response = await epcServices.getApplicationWithCid(cid)

        // Check if response.data is an array, if not check for results property
        const userData = Array.isArray(response.data) ? response.data : response.data?.results || []

        if (userData.length > 0) {
          // Get the most recent application with user details
          const latestApplication = userData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
          )[0]

          this.userDetail = {
            name: latestApplication.full_name || 'N/A',
            id: latestApplication.cid || 'N/A',
            email: latestApplication.email || 'N/A',
            phone: latestApplication.contact_number || 'N/A',
            qualification: latestApplication.qualification_name || 'N/A',
            registrationNumber: latestApplication.registration_number || 'N/A',
            registrationType: latestApplication.registration_type || 'N/A',
            photo: latestApplication.photo_url || null,
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
      }
    },

    async fetchApplications(cid) {
      try {
        // Fetch all applications for the user
        const response = await epcServices.getApplicationWithCid(cid)

        // Check if response.data is an array, if not check for results property
        const applicationsData = Array.isArray(response.data)
          ? response.data
          : response.data?.results || []

        if (applicationsData.length > 0) {
          this.applications = applicationsData.map((app) => ({
            id: app.id,
            type: app.registration_type || 'Registration',
            status: app.status || 'Pending',
            date: app.created_at || new Date().toISOString(),
            message: app.remarks || '',
          }))
        } else {
          this.applications = [] // Ensure it's an empty array if no data
        }
      } catch (error) {
        console.error('Error fetching applications:', error)
      }
    },

    async fetchCpdCredits(cid) {
      try {
        // Fetch CPD credits
        const response = await epcServices.getEpcCpdTasks()

        // Check if response.data is an array, if not check for results property
        const cpdData = Array.isArray(response.data) ? response.data : response.data?.results || []

        // Filter tasks for the current user and calculate total credits
        const userTasks = cpdData.filter((task) => task.cid === cid)
        this.cpdCredits = userTasks.reduce((total, task) => total + (task.credits || 0), 0)
      } catch (error) {
        console.error('Error fetching CPD credits:', error)
      }
    },

    async fetchActivities(cid) {
      try {
        // Fetch recent activities
        // This could be a combination of application updates, CPD submissions, etc.
        const appResponse = await epcServices.getApplicationWithCid(cid)
        const cpdResponse = await epcServices.getEpcCpdTasks()

        const activities = []

        // Check if appResponse.data is an array, if not check for results property
        const appData = Array.isArray(appResponse.data)
          ? appResponse.data
          : appResponse.data?.results || []

        // Add application activities
        if (appData.length > 0) {
          appData.forEach((app) => {
            activities.push({
              id: `app-${app.id}`,
              type: 'Application',
              status: app.status,
              date: app.updated_at || app.created_at,
              title: `${app.registration_type || 'Registration'} application ${app.status?.toLowerCase() || 'pending'}`,
              description:
                app.remarks ||
                `Your application has been ${app.status?.toLowerCase() || 'processed'}`,
            })
          })
        }

        // Check if cpdResponse.data is an array, if not check for results property
        const cpdData = Array.isArray(cpdResponse.data)
          ? cpdResponse.data
          : cpdResponse.data?.results || []

        // Add CPD activities
        if (cpdData.length > 0) {
          const userCpdTasks = cpdData.filter((task) => task.cid === cid)
          userCpdTasks.forEach((cpd) => {
            activities.push({
              id: `cpd-${cpd.id}`,
              type: 'CPD',
              status: cpd.status || 'Submitted',
              date: cpd.created_at,
              title: `CPD Activity: ${cpd.title || 'Activity'}`,
              description: `${cpd.credits || 0} credits earned for ${cpd.description || 'professional development'}`,
            })
          })
        }

        // Sort by date (newest first) and limit to 5
        this.recentActivities = activities
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    },

    async fetchDeadlines(cid) {
      try {
        // Fetch deadlines - could include renewal dates, CPD submission deadlines, etc.
        const appResponse = await epcServices.getApplicationWithCid(cid)

        const deadlines = []

        // Check if appResponse.data is an array, if not check for results property
        const appData = Array.isArray(appResponse.data)
          ? appResponse.data
          : appResponse.data?.results || []

        // Add renewal deadlines
        if (appData.length > 0) {
          const approvedApplications = appData.filter(
            (app) => app.status === 'Approved' && app.expiry_date,
          )

          approvedApplications.forEach((app) => {
            deadlines.push({
              id: `renewal-${app.id}`,
              title: 'License Renewal',
              date: app.expiry_date,
              type: 'Renewal',
              description: 'Submit your renewal application before license expires',
            })
          })
        }

        // Add CPD deadlines
        // Assuming CPD has annual submission deadline at the end of the year
        const currentYear = new Date().getFullYear()
        const cpdDeadline = new Date(currentYear, 11, 31) // December 31st of current year

        deadlines.push({
          id: 'cpd-annual',
          title: 'Annual CPD Submission',
          date: cpdDeadline.toISOString(),
          type: 'CPD',
          description: 'Submit your CPD records for the year',
        })

        // Sort by date (soonest first)
        this.upcomingDeadlines = deadlines
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3)
      } catch (error) {
        console.error('Error fetching deadlines:', error)
      }
    },

    determineLicenseStatus() {
      // Find the most recently approved application
      const approvedApp = this.applications
        .filter((app) => app.status === 'Approved')
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]

      if (approvedApp) {
        // Check if the application has expiry information
        const currentDate = new Date()
        const expiryDate = new Date(approvedApp.expiryDate)

        if (expiryDate) {
          this.licenseExpiryDate = approvedApp.expiryDate

          if (expiryDate > currentDate) {
            this.licenseStatus = 'Active'
          } else {
            this.licenseStatus = 'Expired'
          }
        } else {
          // If no expiry date but approved, consider active
          this.licenseStatus = 'Active'
          // Set a default expiry date (eg. one year from approval)
          const approvalDate = new Date(approvedApp.date)
          approvalDate.setFullYear(approvalDate.getFullYear() + 1)
          this.licenseExpiryDate = approvalDate.toISOString()
        }
      } else {
        this.licenseStatus = 'Inactive'
        this.licenseExpiryDate = null
      }
    },

    determineRenewalMessage() {
      if (this.licenseStatus === 'Active' && this.licenseExpiryDate) {
        const expiryDate = new Date(this.licenseExpiryDate)
        const today = new Date()
        const daysToExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))

        if (daysToExpiry <= 30) {
          this.renewalMessage = `Your license will expire in ${daysToExpiry} days. Please renew soon.`
        } else if (daysToExpiry <= 90) {
          this.renewalMessage = 'Your license renewal is due in the next 3 months.'
        } else {
          this.renewalMessage = ''
        }
      } else if (this.licenseStatus === 'Expired') {
        this.renewalMessage = 'Your license has expired. Please renew immediately.'
      } else {
        this.renewalMessage = ''
      }
    },

    determineShowCertificateButton() {
      // Show certificate button only if user has an approved application
      this.showViewCertificateButton = this.applications.some((app) => app.status === 'Approved')
    },

    setSelectedApplications(status) {
      this.selectedApplications = this.applications.filter((app) => app.status === status)
      this.modalTitle = `${status} Applications`
    },

    clearSelectedApplications() {
      this.selectedApplications = []
      this.modalTitle = ''
    },

    async setShowCertificateModal(show) {
      if (show) {
        // Find the most recent approved application to show certificate for
        const approvedApp = this.applications
          .filter((app) => app.status === 'Approved')
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0]

        if (approvedApp) {
          try {
            // Fetch full application details for the certificate
            const response = await epcServices.getEpcNewApplication(approvedApp.id)

            // Check if response.data exists
            const applicationData = response.data || {}

            this.selectedApplication = {
              ...applicationData,
              // Add any additional formatting needed for certificate display
              registrationNumber: applicationData.registration_number || 'N/A',
              fullName: applicationData.full_name || 'N/A',
              issueDate: applicationData.approved_date || applicationData.updated_at,
              expiryDate: applicationData.expiry_date || null,
              qualificationName: applicationData.qualification_name || 'N/A',
            }
          } catch (error) {
            console.error('Error fetching application details for certificate:', error)
          }
        }
      }

      this.showCertificateModal = show
    },
  },
})
