// src/stores/mhpcNavigationStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiServices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import dayjs from 'dayjs'

export const useHealthCertificationStore = defineStore('healthCertification', () => {
  // State
  const applicationDetails = ref({
    results: [],
  })
  const isLoading = ref(false)
  const error = ref(null)

  // Getters (computed)
  const currentUserApplication = computed(() => {
    const authStore = useAuthStore()
    if (!applicationDetails.value?.results || !authStore?.email) {
      return null
    }

    const userApplications = applicationDetails.value.results
      .filter((app) => app.email_address === authStore.email)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return userApplications[0] || null
  })

  const hasApplication = computed(() => {
    return Boolean(currentUserApplication.value)
  })

  const hasSubmittedApplication = computed(() => {
    const application = currentUserApplication.value
    return Boolean(application?.user_qualifications?.length)
  })

  const hasApprovedQualification = computed(() => {
    const application = currentUserApplication.value
    if (!application?.user_qualifications) return false
    return application.user_qualifications.some((qual) => qual.endorsement_decision === 'Approved')
  })

  const isRenewalPeriod = computed(() => {
    const application = currentUserApplication.value
    if (!application?.expiry_date || !hasApprovedQualification.value) return false

    // Use dayjs for more accurate date calculations
    const expiryDate = dayjs(application.expiry_date)
    const today = dayjs()

    // Check if we're within 3 months of expiry
    const threeMonthsBefore = expiryDate.subtract(3, 'month')

    // Return true if today is after or equal to threeMonthsBefore AND before expiry date
    return (
      (today.isAfter(threeMonthsBefore) || today.isSame(threeMonthsBefore, 'day')) &&
      today.isBefore(expiryDate)
    )
  })

  const isInReregistrationPeriod = computed(() => {
    const application = currentUserApplication.value
    if (!application?.expiry_date || !hasApprovedQualification.value) return false

    const expiryDate = new Date(application.expiry_date)
    const today = new Date()
    const monthsSinceExpiry = (today - expiryDate) / (1000 * 60 * 60 * 24 * 30)

    return monthsSinceExpiry > 0 && monthsSinceExpiry <= 2
  })

  const hasPendingRenewalApplication = computed(() => {
    if (!applicationDetails.value?.results || applicationDetails.value.results.length === 0) {
      return false
    }

    // Filter applications to find renewals that are pending review
    const pendingRenewals = applicationDetails.value.results.filter((app) => {
      // Check if this is a renewal application
      const isRenewalType = app.registration_type?.name?.toLowerCase().includes('renewal')

      // Check if it's still under review (not approved/rejected)
      const isPending = app.user_qualifications?.some(
        (qual) =>
          qual.application_review_status === 'Pending' ||
          qual.physical_review_status === 'Pending' ||
          qual.endorsement_decision === 'Pending',
      )

      return isRenewalType && isPending
    })

    return pendingRenewals.length > 0
  })

  const visibleMenus = computed(() => {
    // 1. After Registration (but before application):
    if (!hasSubmittedApplication.value) {
      return {
        baseMenus: {
          dashboard: true,
          certification: true,
          cpdManagement: false,
          cogsManagement: false,
          profile: true,
        },
        certificationSubMenus: {
          applyForCertification: true,
          myApplications: false,
          renewal: false,
          reRegistration: false,
          additionalQualification: false, // Add it here, initially false
        },
        hasRenewalInProgress: false,
      }
    }

    // 2. Once Application is Applied (but not yet approved):
    if (hasSubmittedApplication.value && !hasApprovedQualification.value) {
      return {
        baseMenus: {
          dashboard: true,
          certification: true,
          cpdManagement: false,
          cogsManagement: false,
          profile: true,
        },
        certificationSubMenus: {
          applyForCertification: true,
          myApplications: true,
          renewal: false,
          reRegistration: false,
          additionalQualification: false, // Also false here
        },
        hasRenewalInProgress: false,
      }
    }

    // 3. Once Application is Approved:
    if (hasApprovedQualification.value) {
      let baseMenus = {
        dashboard: true,
        certification: true,
        cpdManagement: true,
        cogsManagement: true,
        profile: true,
      }

      let certificationSubMenus = {
        applyForCertification: true,
        myApplications: true,
        renewal: false,
        reRegistration: false,
        additionalQualification: true, // Set to true when approved!
      }

      // 4. Renewal Period:
      if (isRenewalPeriod.value) {
        // Add the hasPendingRenewalApplication check here
        if (!hasPendingRenewalApplication.value) {
          certificationSubMenus.renewal = true
        } else {
          // Still set to true but will be handled in the UI with a message
          certificationSubMenus.renewal = true
        }
      }

      // 5. Re-registration Period:
      if (isInReregistrationPeriod.value) {
        certificationSubMenus.reRegistration = true
      }

      return {
        baseMenus,
        certificationSubMenus,
        hasRenewalInProgress: hasPendingRenewalApplication.value,
      }
    }
    //default menus incase of an error
    return {
      baseMenus: {
        dashboard: true,
        certification: false,
        cpdManagement: false,
        cogsManagement: false,
        profile: true,
      },
      certificationSubMenus: {
        applyForCertification: false,
        myApplications: false,
        renewal: false,
        reRegistration: false,
        additionalQualification: false, // Add it here
      },
      hasRenewalInProgress: false,
    }
  })

  // Actions
  const fetchApplicationDetails = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiServices.getMhpcNewApplications()
      if (response?.data) {
        applicationDetails.value = response.data
      } else {
        applicationDetails.value = { results: [] }
      }
    } catch (err) {
      console.error('Error fetching application details:', err)
      error.value = err.response?.data?.message || 'Failed to fetch application details'
      applicationDetails.value = { results: [] }
    } finally {
      isLoading.value = false
    }
  }

  const initialize = async () => {
    const authStore = useAuthStore()
    if (authStore?.isAuthenticated) {
      await fetchApplicationDetails()
    }
  }

  const resetStore = () => {
    applicationDetails.value = { results: [] }
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    applicationDetails,
    isLoading,
    error,

    // Getters
    currentUserApplication,
    hasApplication,
    hasSubmittedApplication,
    hasApprovedQualification,
    isRenewalPeriod,
    isInReregistrationPeriod,
    hasPendingRenewalApplication,
    visibleMenus,

    // Actions
    fetchApplicationDetails,
    initialize,
    resetStore,
  }
})
