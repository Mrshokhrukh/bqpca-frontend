<template>
  <div class="p-4 w-full">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-3xl font-serif font-bold text-slate-900">Unclaimed Application Pool</h2>
      <button
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800"
        @click="loadData(true)"
        :disabled="loading"
      >
        <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
        {{ loading ? 'Refreshing...' : 'Refresh Application List' }}
      </button>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div
        v-if="loading && applications.length === 0"
        class="flex justify-center items-center py-12"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div v-else class="w-full overflow-x-auto">
        <ApplicationList
          :applications="paginatedApplications"
          :current-page="currentPage"
          :total-results="filteredTotal"
          :per-page="perPage"
          :search-query="searchQuery"
          @page-change="handlePageChange"
          @per-page-change="handlePerPageChange"
          @search-query-change="handleSearchChange"
          @claim="handleClaimApplication"
          @refresh="loadData"
          :no-results="filteredApplications.length === 0 && !loading"
          :user-role="userRole"
          :show-claim-button="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import ApplicationList from '@/components/common/ROQ/ROQAdminApplicationList.vue'
import apiService from '@/services/services' // Assuming your service file is here
import { RefreshCw } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()
const authStore = useAuthStore()
const userRole = computed(() => authStore.user?.role || null)

const loading = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const applications = ref([])
const searchQuery = ref('')
const error = ref(null)

const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    return searchQuery.value
      ? Object.values(app).some((value) =>
          String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      : true
  })
})

const filteredTotal = computed(() => filteredApplications.value.length)

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredApplications.value.slice(start, end)
})

watch(searchQuery, () => {
  currentPage.value = 1
})

// MODIFIED to fetch unclaimed applications
const loadData = async (showLoadingToast = false) => {
  loading.value = true
  error.value = null
  let loadingToastId = null
  if (showLoadingToast) {
    loadingToastId = toast.info('Fetching unclaimed applications...', { timeout: false })
  }

  try {
    // ✨ CORE LOGIC CHANGE ✨
    // We now fetch all applications that are unassigned
    const response = await apiService.getRecognitionOfQualifications({
      unclaimed: true,
    })
    applications.value = response.data.results || []
    if (showLoadingToast) {
      toast.dismiss(loadingToastId)
      toast.success('Application pool refreshed')
    }
  } catch (err) {
    error.value = err
    console.error('Failed to load unclaimed applications:', err)
    toast.dismiss(loadingToastId)
    toast.error('Failed to load unclaimed applications.')
  } finally {
    loading.value = false
  }
}

// ✨ NEW METHOD TO HANDLE THE CLAIM ACTION ✨
const handleClaimApplication = async (application) => {
  const claimToastId = toast.info(`Claiming application for ${application.applicants_name}...`, {
    timeout: false,
  })
  try {
    // Assuming you add a 'claimApplication' method to your apiService
    await apiService.claimApplication(application.id)
    toast.dismiss(claimToastId)
    toast.success('Application successfully claimed!')

    // Refresh the list of unclaimed applications (the claimed one will be gone)
    await loadData()

    // Optional: Redirect the user to their "Assigned To Me" list
    // router.push({ name: 'AssignedApplications' });
  } catch (err) {
    toast.dismiss(claimToastId)
    const errorMsg = err.response?.data?.detail || 'Failed to claim application.'
    toast.error(errorMsg)
    console.error('Claiming failed:', err)
  }
}

const handlePageChange = (newPage) => {
  currentPage.value = newPage
}
const handlePerPageChange = (newPerPage) => {
  perPage.value = newPerPage
  currentPage.value = 1
}
const handleSearchChange = (newQuery) => {
  searchQuery.value = newQuery
}

onMounted(() => {
  loadData()
})
</script>