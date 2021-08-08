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

    const expiryDate = dayjs(application.expiry_date)
    const today = dayjs()
    const threeMonthsBefore = expiryDate.subtract(3, 'month')

    return (
      (today.isAfter(threeMonthsBefore) || today.isSame(threeMonthsBefore, 'day')) &&
      today.isBefore(expiryDate)
    )
  })

  const isExpired = computed(() => {
    const application = currentUserApplication.value
    if (!application?.expiry_date || !hasApprovedQualification.value) return false
    return dayjs().isAfter(dayjs(application.expiry_date), 'day')
  })

  const hasPendingRenewalApplication = computed(() => {
    if (!applicationDetails.value?.results || applicationDetails.value.results.length === 0) {
      return false
    }
    const pendingRenewals = applicationDetails.value.results.filter((app) => {
      const isRenewalType = app.registration_type?.name?.toLowerCase().includes('renewal')
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

  // =================================================================
  // MODIFIED SECTION: The entire visibleMenus logic is restructured.
  // =================================================================
  const visibleMenus = computed(() => {
    const authStore = useAuthStore()
    const isCounselor = authStore.user?.is_counselor || false

    // State 3: User has an Approved Qualification (active, in renewal, or expired)
    if (hasApprovedQualification.value) {
      return {
        baseMenus: {
          dashboard: true,
          certification: true, // ALWAYS true for qualified users
          cpdManagement: true,
          cogsManagement: true,
          counselorManagement: isCounselor,
          profile: true,
        },
        certificationSubMenus: {
          applyForCertification: false,
          myApplications: true,
          // Show renewal link if in renewal period OR if it's expired
          renewal: isRenewalPeriod.value || isExpired.value,
          additionalQualification: true,
        },
        hasRenewalInProgress: hasPendingRenewalApplication.value,
        isExpired: isExpired.value,
      }
    }
    // State 2: User has submitted but is not yet approved
    else if (hasSubmittedApplication.value) {
      return {
        baseMenus: {
          dashboard: true,
          certification: true, // True, so they can track it
          cpdManagement: false,
          cogsManagement: false,
          counselorManagement: isCounselor,
          profile: true,
        },
        certificationSubMenus: {
          applyForCertification: true,
          myApplications: true, // Main difference is this is now true
          renewal: false,
          additionalQualification: false,
        },
        hasRenewalInProgress: false,
        isExpired: false,
      }
    }
    // State 1: New user or any other case (default)
    else {
      return {
        baseMenus: {
          dashboard: true,
          certification: true, // True, so they can apply
          cpdManagement: false,
          cogsManagement: false,
          counselorManagement: isCounselor,
          profile: true,
        },
        certificationSubMenus: {
          applyForCertification: true,
          myApplications: false,
          renewal: false,
          additionalQualification: false,
        },
        hasRenewalInProgress: false,
        isExpired: false,
      }
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
    hasSubmittedApplication,
    hasApprovedQualification,
    isRenewalPeriod,
    isExpired,
    hasPendingRenewalApplication,
    visibleMenus,
    // Actions
    fetchApplicationDetails,
    initialize,
    resetStore,
  }
})
