// src/stores/institutionNavigationStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import bmhcServices from '@/services/bmhcservices'
import { useAuthStore } from '@/stores/authStore'

export const useInstitutionStore = defineStore('institution', () => {
  // State
  const institutionData = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const userInstitutions = computed(() => {
    const authStore = useAuthStore()
    if (!institutionData.value.length || !authStore?.user?.cid) {
      return []
    }

    return institutionData.value
      .filter((institute) => institute.CID === authStore.user.cid)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  })

  // Application status getters
  const hasInstitutions = computed(() => userInstitutions.value.length > 0)

  const hasEoiApplication = computed(() => hasInstitutions.value)

  const isEoiApproved = computed(() => {
    return userInstitutions.value.some((institute) => institute.review_decision === 'Approved')
  })

  const hasDprApplication = computed(() => {
    return userInstitutions.value.some(
      (institute) => institute.dpr_name && institute.dpr_name.trim() !== '',
    )
  })

  const isDprApproved = computed(() => {
    return userInstitutions.value.some(
      (institute) => institute.do_dpr_review_decision === 'Approved',
    )
  })

  // Menu visibility computations
  const visibleMenus = computed(() => {
    return {
      // Always show dashboard
      showDashboard: true,

      // EOI Management visibility
      showEoiManagement: !isDprApproved.value,
      showApplyForEoi: !isEoiApproved.value,
      showTrackEoi: hasEoiApplication.value,

      // DPR Management visibility
      showDprManagement: isEoiApproved.value && !isDprApproved.value,
      showApplyForDpr: isEoiApproved.value && !hasDprApplication.value,
      showTrackDpr: hasDprApplication.value,

      // Show other menus only after DPR approval
      showOtherMenus: isDprApproved.value,
    }
  })

  // Actions
  const fetchInstitutionData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await bmhcServices.getBmhcInstitutes()
      if (response?.data?.results) {
        institutionData.value = response.data.results
      } else {
        institutionData.value = []
      }
    } catch (err) {
      console.error('Error fetching institution data:', err)
      error.value = err.response?.data?.message || 'Failed to fetch institution data'
      institutionData.value = []
    } finally {
      isLoading.value = false
    }
  }

  const initialize = async () => {
    const authStore = useAuthStore()
    if (authStore?.isAuthenticated) {
      await fetchInstitutionData()
    }
  }

  const resetStore = () => {
    institutionData.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    institutionData,
    isLoading,
    error,

    // Getters
    userInstitutions,
    hasInstitutions,
    hasEoiApplication,
    isEoiApproved,
    hasDprApplication,
    isDprApproved,
    visibleMenus,

    // Actions
    fetchInstitutionData,
    initialize,
    resetStore,
  }
})
