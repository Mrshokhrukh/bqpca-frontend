// src/stores/healthCertificationStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import bmhcServices from '@/services/bmhcservices'
import { useAuthStore } from '@/stores/authStore'

export const useHealthCertificationStore = defineStore('healthCertification', () => {
  // State
  const applicationDetails = ref({
    results: []
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
      .filter(app => app.email_address === authStore.email)
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

    return application.user_qualifications.some(
      qual => qual.endorsement_decision === 'Approved'
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
          };
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
          };
      }

      // 3. Once Application is Approved:
      if (hasApprovedQualification.value) {
          let baseMenus = {
              dashboard: true,
              certification: true,
              cpdManagement: true,
              cogsManagement: true,
              profile: true,
          };

          let certificationSubMenus = {
              applyForCertification: true,
              myApplications: true,
              renewal: false,
              reRegistration: false,
              additionalQualification: true, // Set to true when approved!
          };

          // 4. Renewal Period:
          if (isRenewalPeriod.value) {
              certificationSubMenus.renewal = true;
          }

          // 5. Re-registration Period:
          if (isInReregistrationPeriod.value) {
              certificationSubMenus.reRegistration = true;
          }

          return { baseMenus, certificationSubMenus };
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
      };
    })

  // Actions
  const fetchApplicationDetails = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await bmhcServices.getBhmcNewApplications()
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
      console.log('Initializing health certification store...')
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
    resetStore
  }
})