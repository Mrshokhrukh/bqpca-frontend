// src/stores/engineeringNavigationStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiServices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'

export const useEngineeringCertificationStore = defineStore('engineeringCertification', () => {
  // State
  const applicationDetails = ref({
    results: [],
  })
  const isLoading = ref(false)
  const error = ref(null)

  // Getters (computed)
  const currentUserApplication = computed(() => {
    const authStore = useAuthStore()
    if (!applicationDetails.value?.results || !authStore?.user?.cid) {
      return null
    }

    const userApplications = applicationDetails.value.results
      .filter((app) => app.cid_no === authStore.user.cid)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return userApplications[0] || null
  })

  const hasApplication = computed(() => {
    return Boolean(currentUserApplication.value)
  })

  // Checks if user has ANY application with qualifications
  const hasSubmittedApplication = computed(() => {
    // Check if applicationDetails has any results
    if (!applicationDetails.value?.results || applicationDetails.value.results.length === 0) {
      return false
    }

    // Get auth store user
    const authStore = useAuthStore()
    if (!authStore?.user?.cid) {
      return false
    }

    // Check if ANY application for this user has qualifications
    const userCid = authStore.user.cid
    const applicationsWithQualifications = applicationDetails.value.results.filter(
      (app) =>
        app.cid_no === userCid && app.user_qualifications && app.user_qualifications.length > 0,
    )

    return applicationsWithQualifications.length > 0
  })

  const hasApprovedQualification = computed(() => {
    // Get all user applications
    const authStore = useAuthStore()
    if (!applicationDetails.value?.results || !authStore?.user?.cid) {
      return false
    }

    const userCid = authStore.user.cid

    // Check if ANY application has an approved qualification
    return applicationDetails.value.results
      .filter((app) => app.cid_no === userCid)
      .some(
        (app) =>
          app.user_qualifications &&
          app.user_qualifications.some((qual) => qual.endorsement_decision === 'Approved'),
      )
  })

  const isRenewalPeriod = computed(() => {
    const application = currentUserApplication.value
    if (!application?.expiry_date || !hasApprovedQualification.value) return false

    const expiryDate = new Date(application.expiry_date)
    const today = new Date()
    const monthsRemaining = (expiryDate - today) / (1000 * 60 * 60 * 24 * 30)

    return monthsRemaining <= 3 && monthsRemaining > 0
  })

  const isInReregistrationPeriod = computed(() => {
    const application = currentUserApplication.value
    if (!application?.expiry_date || !hasApprovedQualification.value) return false

    const expiryDate = new Date(application.expiry_date)
    const today = new Date()
    const monthsSinceExpiry = (today - expiryDate) / (1000 * 60 * 60 * 24 * 30)

    return monthsSinceExpiry > 0 && monthsSinceExpiry <= 2
  })

  const visibleMenus = computed(() => {
    // If no application details have been fetched yet, show default menu
    if (isLoading.value) {
      return {
        baseMenus: {
          dashboard: true,
          certification: true,
          cpdManagement: false,
          cogsManagement: false,
          profile: true,
        },
        certificationSubMenus: {
          registration: true,
          myApplications: false,
          trackApplication: false,
          renewal: false,
          reRegistration: false,
          additionalQualification: false,
        },
      }
    }

    // If user has submitted an application (has qualifications on any application)
    if (hasSubmittedApplication.value) {
      // Base menus that are always shown after application submission
      let baseMenus = {
        dashboard: true,
        certification: true,
        cpdManagement: false,
        cogsManagement: false,
        profile: true,
      }

      // Certification sub-menus that are always shown after application submission
      let certificationSubMenus = {
        registration: false, // Hide registration after application submitted
        myApplications: true,
        trackApplication: true,
        renewal: false,
        reRegistration: false,
        additionalQualification: false,
      }

      // If any qualification is approved, show additional menus
      if (hasApprovedQualification.value) {
        baseMenus.cpdManagement = true
        baseMenus.cogsManagement = true
        certificationSubMenus.additionalQualification = true

        // Show renewal option if within renewal period
        if (isRenewalPeriod.value) {
          certificationSubMenus.renewal = true
        }

        // Show re-registration option if within re-registration period
        if (isInReregistrationPeriod.value) {
          certificationSubMenus.reRegistration = true
        }
      }

      return { baseMenus, certificationSubMenus }
    }

    // Default state - before any application submission
    return {
      baseMenus: {
        dashboard: true,
        certification: true,
        cpdManagement: false,
        cogsManagement: false,
        profile: true,
      },
      certificationSubMenus: {
        registration: true,
        myApplications: false,
        trackApplication: false,
        renewal: false,
        reRegistration: false,
        additionalQualification: false,
      },
    }
  })

  // Actions
  const fetchApplicationDetails = async () => {
    isLoading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()

      if (!authStore?.user?.cid) {
        console.warn('User CID not available for fetching applications')
        applicationDetails.value = { results: [] }
        return
      }

      // Use the CID to get applications
      const response = await apiServices.getEpcFullApplicationListByCid(authStore.user.cid)

      if (response?.data) {
        applicationDetails.value = response.data
        console.log('Fetched application details:', applicationDetails.value)
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
    visibleMenus,

    // Actions
    fetchApplicationDetails,
    initialize,
    resetStore,
  }
})
