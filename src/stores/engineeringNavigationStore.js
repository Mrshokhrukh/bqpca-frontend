// Updated engineeringNavigationStore.js with simple expiry logic

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiServices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import dayjs from 'dayjs'

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

  const hasSubmittedApplication = computed(() => {
    if (!applicationDetails.value?.results || applicationDetails.value.results.length === 0) {
      return false
    }

    const authStore = useAuthStore()
    if (!authStore?.user?.cid) {
      return false
    }

    const userCid = authStore.user.cid
    const applicationsWithQualifications = applicationDetails.value.results.filter(
      (app) =>
        app.cid_no === userCid && app.user_qualifications && app.user_qualifications.length > 0,
    )

    return applicationsWithQualifications.length > 0
  })

  const hasApprovedQualification = computed(() => {
    const authStore = useAuthStore()
    if (!applicationDetails.value?.results || !authStore?.user?.cid) {
      return false
    }

    const userCid = authStore.user.cid

    return applicationDetails.value.results
      .filter((app) => app.cid_no === userCid)
      .some(
        (app) =>
          app.user_qualifications &&
          app.user_qualifications.some((qual) => qual.endorsement_decision === 'Approved'),
      )
  })

  // NEW: Check if qualification has expired
  const hasExpiredQualification = computed(() => {
    const authStore = useAuthStore()
    if (!applicationDetails.value?.results || !authStore?.user?.cid) {
      return false
    }

    const userCid = authStore.user.cid
    const today = dayjs()

    // Find all approved qualifications for the user
    const approvedQualifications = applicationDetails.value.results
      .filter((app) => app.cid_no === userCid)
      .flatMap((app) => app.user_qualifications || [])
      .filter((qual) => qual.endorsement_decision === 'Approved')

    if (approvedQualifications.length === 0) {
      return false
    }

    // Check if ANY approved qualification has expired
    return approvedQualifications.some((qual) => {
      if (!qual.expiry_date) return false
      const expiryDate = dayjs(qual.expiry_date)
      return today.isAfter(expiryDate)
    })
  })

  const isRenewalPeriod = computed(() => {
    const authStore = useAuthStore()
    if (!applicationDetails.value?.results || !authStore?.user?.cid || !hasApprovedQualification.value) {
      return false
    }

    const userCid = authStore.user.cid
    const today = dayjs()

    // Find the most recent approved qualification
    const approvedQualifications = applicationDetails.value.results
      .filter((app) => app.cid_no === userCid)
      .flatMap((app) => app.user_qualifications || [])
      .filter((qual) => qual.endorsement_decision === 'Approved')
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))

    if (approvedQualifications.length === 0) {
      return false
    }

    const latestQualification = approvedQualifications[0]
    if (!latestQualification.expiry_date) return false

    const expiryDate = dayjs(latestQualification.expiry_date)
    const monthsToExpiry = expiryDate.diff(today, 'month', true)

    // Within 3 months of expiry but not yet expired, OR already expired (allow renewal for expired)
    return monthsToExpiry <= 3
  })

  const hasPendingRenewalApplication = computed(() => {
    // This would require fetching renewal data
    // For now, we'll assume no pending renewals unless we have renewal data
    return false
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
          renewal: false,
          additionalQualification: false,
        },
      }
    }

    // If user has submitted an application (has qualifications on any application)
    if (hasSubmittedApplication.value) {
      let baseMenus = {
        dashboard: true,
        certification: true,
        cpdManagement: false,
        cogsManagement: false,
        profile: true,
      }

      let certificationSubMenus = {
        registration: false, // Hide registration after application submitted
        myApplications: true,
        renewal: false,
        additionalQualification: false,
      }

      // If any qualification is approved, show additional menus
      if (hasApprovedQualification.value) {
        // If qualification has expired, disable CPD and CoGS management
        if (!hasExpiredQualification.value) {
          baseMenus.cpdManagement = true
          baseMenus.cogsManagement = true
          certificationSubMenus.additionalQualification = true
        }

        // Show renewal option if within renewal period (including expired qualifications)
        if (isRenewalPeriod.value && !hasPendingRenewalApplication.value) {
          certificationSubMenus.renewal = true
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
        renewal: false,
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

      const response = await apiServices.getEpcFullApplicationListByCid(authStore.user.cid)

      if (response?.data) {
        applicationDetails.value = response.data
        console.log('Fetched application details:', applicationDetails.value)
        
        // Log expiry status for debugging
        if (hasExpiredQualification.value) {
          console.log('User has expired qualification(s) - CPD and CoGS disabled')
        }
        if (isRenewalPeriod.value) {
          console.log('User is in renewal period')
        }
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
    hasExpiredQualification, // NEW
    isRenewalPeriod,
    hasPendingRenewalApplication,
    visibleMenus,

    // Actions
    fetchApplicationDetails,
    initialize,
    resetStore,
  }
})