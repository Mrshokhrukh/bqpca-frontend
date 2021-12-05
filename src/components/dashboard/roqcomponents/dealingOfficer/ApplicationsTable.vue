<template>
  <div class="p-4 w-full">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-3xl font-serif font-bold text-slate-900">ROQ Application Workspace</h2>
      <button class="inline-flex items-center px-6 py-3 bg-blue-600 text-white ..." @click="loadAllData(true)"
        :disabled="loading">
        <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
        {{ loading ? 'Refreshing...' : 'Refresh Lists' }}
      </button>
    </div>

    <div class="mb-12">
      <h3 class="text-2xl font-serif font-semibold text-slate-800 border-b-2 border-blue-200 pb-2 mb-6">
        Unclaimed Application Pool
      </h3>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <div v-else class="w-full overflow-x-auto">
          <ApplicationList :applications="paginatedUnclaimedApplications" :current-page="unclaimedCurrentPage"
            :total-results="unclaimedFilteredTotal" :per-page="unclaimedPerPage" :search-query="unclaimedSearchQuery"
            :user-role="userRole" :no-results="unclaimedApplications.length === 0" :show-claim-button="true"
            @page-change="handleUnclaimedPageChange" @per-page-change="handleUnclaimedPerPageChange"
            @search-query-change="handleUnclaimedSearchChange" @claim="handleClaimApplication" />
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-2xl font-serif font-semibold text-slate-800 border-b-2 border-green-200 pb-2 mb-6">
        My Assigned Applications
      </h3>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
        <div v-else class="w-full overflow-x-auto">
          <ApplicationList :applications="paginatedAssignedApplications" :current-page="assignedCurrentPage"
            :total-results="assignedFilteredTotal" :per-page="assignedPerPage" :search-query="assignedSearchQuery"
            :selected-status="assignedSelectedStatus" :user-role="userRole"
            :no-results="assignedApplications.length === 0" :show-claim-button="false"
            @page-change="handleAssignedPageChange" @per-page-change="handleAssignedPerPageChange"
            @search-query-change="handleAssignedSearchChange" @status-filter-change="handleAssignedStatusChange"
            @action="handleApplicationAction" @refresh="loadAllData" />
        </div>
      </div>
    </div>

    <ApplicationModal :show-modal="showModal" :modal-type="modalType" :application="selectedApplication"
      :user-role="userRole" @close="closeModal" @update="handleApplicationUpdate" />
    <RemarksModal :show-modal="showRemarksModal" :chief-remarks="selectedApplication.chief_remarks"
      :dealing-officer-remarks="selectedApplication.dealing_officer_remarks"
      :private-remarks="selectedApplication.chief_to_do_remarks" @close="closeRemarksModal" />
    <ViewCertificateModal v-if="modalType === 'viewCertificate'" :show-modal="showModal"
      :application="selectedApplication" @close="closeModal" />
    <ReuploadModal v-if="showReuploadModal" :show-modal="showReuploadModal" :application="selectedApplication"
      v-model:remarks="reuploadRemarks" @close="closeReuploadModal" @submit="handleReuploadSubmit" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import ApplicationList from '@/components/common/ROQ/ROQAdminApplicationList.vue'
import ApplicationModal from '@/components/common/ROQ/ROQApplicationModal.vue'
import RemarksModal from '@/components/common/ROQ/ROQRemarksModal.vue'
import ViewCertificateModal from '@/components/common/ROQ/ROQViewCertificateModal.vue'
import apiService from '@/services/services'
import { RefreshCw } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import ReuploadModal from '@/components/common/ROQ/ReuploadModal.vue'

const toast = useToast()
const authStore = useAuthStore()
const userRole = computed(() => authStore.user?.role || null)

const loading = ref(false)
const error = ref(null)

// --- State for UNCLAIMED List ---
const unclaimedApplications = ref([])
const unclaimedCurrentPage = ref(1)
const unclaimedPerPage = ref(5) // Maybe show fewer in the pool
const unclaimedSearchQuery = ref('')

// --- State for ASSIGNED List ---
const assignedApplications = ref([])
const assignedCurrentPage = ref(1)
const assignedPerPage = ref(10)
const assignedSearchQuery = ref('')
const assignedSelectedStatus = ref('')

// --- State for Modals (Shared) ---
const showModal = ref(false)
const modalType = ref(null)
const selectedApplication = ref({})
const showRemarksModal = ref(false)
const showReuploadModal = ref(false)
const reuploadRemarks = ref('')

// --- Computed Properties for UNCLAIMED List ---
const unclaimedFilteredApplications = computed(() =>
  unclaimedApplications.value.filter(app =>
    Object.values(app).some(val =>
      String(val).toLowerCase().includes(unclaimedSearchQuery.value.toLowerCase())
    ) && app.is_second_copy === false
  )
)

const closeReuploadModal = () => {
  showReuploadModal.value = false
  reuploadRemarks.value = ''
  selectedApplication.value = {}
}

const handleReuploadSubmit = async () => {
  const updateLoadingToast = toast.info('Updating application for re-upload...', { timeout: false })
  try {
    await apiService.patchRecognitionOfQualification(selectedApplication.value.id, {
      dealing_officer_remarks: reuploadRemarks.value,
      status: 'reupload',
    })
    toast.dismiss(updateLoadingToast)
    toast.success('Application marked for re-upload.')
    await loadAllData()
  } catch (e) {
    toast.dismiss(updateLoadingToast)
    toast.error(e.response?.data?.detail || 'Failed to update application.')
  } finally {
    closeReuploadModal()
  }
}

const unclaimedFilteredTotal = computed(() => unclaimedFilteredApplications.value.length)
const paginatedUnclaimedApplications = computed(() => {
  const start = (unclaimedCurrentPage.value - 1) * unclaimedPerPage.value
  const end = start + unclaimedPerPage.value
  return unclaimedFilteredApplications.value.slice(start, end)
})
watch(unclaimedSearchQuery, () => { unclaimedCurrentPage.value = 1 })

// --- Computed Properties for ASSIGNED List ---
const assignedFilteredApplications = computed(() =>
  assignedApplications.value.filter(app => {
    const matchesStatus = assignedSelectedStatus.value ? app.status === assignedSelectedStatus.value : true
    const matchesSearch = assignedSearchQuery.value
      ? Object.values(app).some(val =>
        String(val).toLowerCase().includes(assignedSearchQuery.value.toLowerCase())
      )
      : true && app.is_second_copy === false
    return matchesStatus && matchesSearch
  })
)
const assignedFilteredTotal = computed(() => assignedFilteredApplications.value.length)
const paginatedAssignedApplications = computed(() => {
  const start = (assignedCurrentPage.value - 1) * assignedPerPage.value
  const end = start + assignedPerPage.value
  return assignedFilteredApplications.value.slice(start, end)
})
watch([assignedSearchQuery, assignedSelectedStatus], () => { assignedCurrentPage.value = 1 })

// --- Data Fetching ---
const loadAllData = async (showLoadingToast = false) => {
  loading.value = true
  error.value = null
  let loadingToastId = null
  if (showLoadingToast) {
    loadingToastId = toast.info('Refreshing application lists...', { timeout: false })
  }

  try {
    const [unclaimedResponse, assignedResponse] = await Promise.all([
      apiService.getRecognitionOfQualifications({ unclaimed: true }),
      apiService.getRecognitionOfQualifications({ assigned_to: authStore.userId }),
    ])
    unclaimedApplications.value = unclaimedResponse.data.results || []
    assignedApplications.value = assignedResponse.data.results || []

    if (showLoadingToast) {
      toast.dismiss(loadingToastId)
      toast.success('Lists refreshed successfully')
    }
  } catch (err) {
    error.value = err
    console.error('Failed to load applications:', err)
    if (loadingToastId) toast.dismiss(loadingToastId)
    toast.error('Failed to refresh one or more lists.')
  } finally {
    loading.value = false
  }
}

// --- Event Handlers ---

// UNCLAIMED List Handlers
const handleUnclaimedPageChange = (newPage) => { unclaimedCurrentPage.value = newPage }
const handleUnclaimedPerPageChange = (newPerPage) => { unclaimedPerPage.value = newPerPage; unclaimedCurrentPage.value = 1 }
const handleUnclaimedSearchChange = (newQuery) => { unclaimedSearchQuery.value = newQuery }

const handleClaimApplication = async (application) => {
  const claimToastId = toast.info(`Claiming application for ${application.applicants_name}...`, { timeout: false });
  try {
    await apiService.claimApplication(application.id);
    toast.dismiss(claimToastId);
    toast.success('Application successfully claimed!');
    await loadAllData(); // Refresh both lists
  } catch (err) {
    toast.dismiss(claimToastId);
    toast.error(err.response?.data?.detail || 'Failed to claim application.');
  }
};

// ASSIGNED List Handlers
const handleAssignedPageChange = (newPage) => { assignedCurrentPage.value = newPage }
const handleAssignedPerPageChange = (newPerPage) => { assignedPerPage.value = newPerPage; assignedCurrentPage.value = 1 }
const handleAssignedSearchChange = (newQuery) => { assignedSearchQuery.value = newQuery }
const handleAssignedStatusChange = (newStatus) => { assignedSelectedStatus.value = newStatus }

const handleApplicationAction = ({ action, application }) => {
  selectedApplication.value = { ...application }
  modalType.value = action
  if (action === 'viewRemarks' || action === 'viewPrivateRemarks') {
    showRemarksModal.value = true
  }
  else if (action === 'reUpload') {
    showReuploadModal.value = true 
  }
  else {
    showModal.value = true
  }
}

// Modal Handlers (Shared)
const closeModal = () => { showModal.value = false; selectedApplication.value = {}; }
const closeRemarksModal = () => { showRemarksModal.value = false; selectedApplication.value = {}; }

const handleApplicationUpdate = async (updateData) => {
  const updateLoadingToast = toast.info('Updating application...', { timeout: false })
  try {
    await apiService.patchRecognitionOfQualification(selectedApplication.value.id, updateData)
    toast.dismiss(updateLoadingToast)
    toast.success('Application updated successfully.')
    await loadAllData() // Refresh both lists to ensure status is up to date
  } catch (e) {
    toast.dismiss(updateLoadingToast)
    toast.error(e.response?.data?.detail || 'Failed to update application.')
  } finally {
    closeModal()
  }
}

onMounted(() => {
  loadAllData()
})
</script>