<template>
  <div class="p-4 w-full">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-3xl font-serif font-bold text-slate-900">All ROQ Applications</h2>
      <button
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow"
        @click="handleApplicationSubmitted"
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
          :selected-status="selectedStatus"
          @page-change="handlePageChange"
          @action="handleApplicationAction"
          @per-page-change="handlePerPageChange"
          @search-query-change="handleSearchChange"
          @status-filter-change="handleStatusChange"
          @refresh="handleRefreshRequest"
          :no-results="filteredApplications.length === 0 && !loading"
          :user-role="userRole"
        />
      </div>
    </div>

    <ApplicationModal
      :show-modal="showModal"
      :modal-type="modalType"
      :application="selectedApplication"
      @close="closeModal"
      @update="handleApplicationUpdate"
    />
    <RemarksModal
      :show-modal="showRemarksModal"
      :chief-remarks="selectedApplication.chief_remarks"
      :dealing-officer-remarks="selectedApplication.dealing_officer_remarks"
      @close="closeRemarksModal"
    />
    <ViewCertificateModal
      v-if="modalType === 'viewCertificate'"
      :show-modal="showModal"
      :application="selectedApplication"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import ApplicationList from '@/components/common/ROQ/ROQAdminApplicationList.vue'
import ApplicationModal from '@/components/common/ROQ/ROQApplicationModal.vue'
import RemarksModal from '@/components/common/ROQ/ROQRemarksModal.vue'
import ViewCertificateModal from '@/components/common/ROQ/ROQViewCertificateModal.vue'
import apiService from '@/services/services'
import { RefreshCw } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

const toast = useToast()
const authStore = useAuthStore()
const userRole = computed(() => authStore.user?.role || null)

const noteText = ref('')
const showModal = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const applications = ref([])
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const modalType = ref(null)
const selectedApplication = ref({})
const showRemarksModal = ref(false)
const error = ref(null)

const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    const matchesStatus = selectedStatus.value ? app.status === selectedStatus.value : true
    const matchesType = selectedType.value ? app.type_of_course === selectedType.value : true
    const matchesSearch = searchQuery.value
      ? Object.values(app).some((value) =>
          String(value).toLowerCase().includes(searchQuery.value.toLowerCase()),
        )
      : true
    const isNotSecondCopy = !app.is_second_copy
    const isNotDraft = app.status !== 'draft'

    return matchesStatus && matchesType && matchesSearch && isNotSecondCopy && isNotDraft
  })
})

const filteredTotal = computed(() => filteredApplications.value.length)

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredApplications.value.slice(start, end)
})

watch([selectedStatus, selectedType, searchQuery], () => {
  currentPage.value = 1
})

const loadData = async (showLoadingToast = false) => {
  loading.value = true
  error.value = null
  let loadingToastId = null
  if (showLoadingToast) {
    loadingToastId = toast.info('Refreshing applications...', {
      timeout: false,
      closeButton: false,
    })
  }

  try {
    const response = await apiService.getRecognitionOfQualifications()
    applications.value = response.data.results || []
    if (showLoadingToast) {
      toast.dismiss(loadingToastId)
      toast.success('Applications refreshed successfully')
    }
  } catch (err) {
    error.value = err
    console.error('Failed to load/refresh applications:', err)
    if (showLoadingToast) {
      toast.dismiss(loadingToastId)
      toast.error('Failed to refresh applications. Please try again.')
    } else {
      toast.error('Failed to load applications.')
    }
  } finally {
    loading.value = false
  }
}

const handleApplicationSubmitted = async () => {
  if (loading.value) return
  showModal.value = false
  await loadData(true)
  await nextTick()
}

const handleRefreshRequest = async () => {
  await loadData(false) // Refresh data without showing the main loading toast
  await nextTick()
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

const handleStatusChange = (newStatus) => {
  selectedStatus.value = newStatus
}

const handleApplicationAction = ({ action, application }) => {
  selectedApplication.value = { ...application }
  if (action === 'regretReason') {
    showRemarksModal.value = true
  } else if (action === 'viewCertificate') {
    modalType.value = 'viewCertificate'
    showModal.value = true
  } else {
    modalType.value = action
    if (action === 'addNote') {
      noteText.value = application.remarks
    }
    showModal.value = true
  }
}

const closeModal = () => {
  showModal.value = false
  modalType.value = null
  selectedApplication.value = {}
}

const closeRemarksModal = () => {
  showRemarksModal.value = false
  selectedApplication.value = {}
}

const handleApplicationUpdate = async (updateData) => {
  const updateLoadingToast = toast.info('Updating application...', {
    timeout: false,
    closeButton: false,
  })
  try {
    await apiService.patchRecognitionOfQualification(selectedApplication.value.id, updateData)
    toast.dismiss(updateLoadingToast)
    toast.success('Application updated successfully.')
    await loadData()
  } catch (e) {
    console.error('Error updating application:', e)
    toast.dismiss(updateLoadingToast)
    const errorMsg = e.response?.data?.detail || 'Failed to update application.'
    toast.error(errorMsg)
  } finally {
    closeModal()
  }
}

onMounted(() => {
  loadData()
})
</script>
