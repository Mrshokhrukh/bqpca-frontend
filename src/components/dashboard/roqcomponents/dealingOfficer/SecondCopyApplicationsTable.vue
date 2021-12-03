<template>
  <div class="p-4 w-full">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-3xl font-serif font-bold text-slate-900">All ROQ Applications </h2>
      <button
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow"
        @click="handleApplicationSubmitted" :disabled="loading">
        <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
        {{ loading ? 'Refreshing...' : 'Refresh Application List' }}
      </button>
    </div>
    <div class="mb-12">
      <h3 class="text-2xl font-serif font-semibold text-slate-800 border-b-2 border-blue-200 pb-2 mb-6">
        Unclaimed Second Copy Application Pool
      </h3>
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <div v-else class="w-full overflow-x-auto">
          <ApplicationList :applications="paginatedUnclaimedSecondCopy" :current-page="secondCopyCurrentPage"
            :total-results="filteredUnclaimedSecondCopy.length" :per-page="secondCopyPerPage"
            :search-query="secondCopySearchQuery" :user-role="authStoreRole"
            :no-results="filteredUnclaimedSecondCopy.length === 0" :show-claim-button="true"
            @page-change="newPage => secondCopyCurrentPage.value = newPage"
            @per-page-change="newPerPage => { secondCopyPerPage.value = newPerPage; secondCopyCurrentPage.value = 1 }"
            @search-query-change="newQuery => secondCopySearchQuery.value = newQuery"
            @claim="handleClaimSecondCopyApplication" />
        </div>
      </div>
    </div>

    <!-- Application Table with Loading State -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div v-else class="w-full overflow-x-auto">
        <ApplicationList :applications="paginatedAssignedSecondCopy" :current-page="assignedSecondCopyCurrentPage"
          :total-results="filteredAssignedSecondCopy.length" :per-page="assignedSecondCopyPerPage"
          :search-query="assignedSecondCopySearchQuery" :user-role="authStoreRole"
          :no-results="filteredAssignedSecondCopy.length === 0" :show-claim-button="false"
          @page-change="newPage => assignedSecondCopyCurrentPage.value = newPage"
          @per-page-change="newPerPage => { assignedSecondCopyPerPage.value = newPerPage; assignedSecondCopyCurrentPage.value = 1 }"
          @search-query-change="newQuery => assignedSecondCopySearchQuery.value = newQuery"
          @action="handleApplicationAction" />
      </div>
    </div>

    <ApplicationModal :show-modal="showModal" :modal-type="modalType" :application="selectedApplication"
      @close="closeModal" @update="handleApplicationUpdate" :user-role="authStoreRole" />

    <ViewCertificateModal v-if="modalType === 'viewCertificate'" :show-modal="showModal"
      :application="selectedApplication" @close="closeModal" />
    <RemarksModal v-if="showRemarksModal" :show-modal="showRemarksModal"
      :chief-remarks="selectedApplication.chief_remarks"
      :dealing-officer-remarks="selectedApplication.dealing_officer_remarks" @close="closeRemarksModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import ApplicationList from '@/components/common/ROQ/ROQAdminApplicationList.vue'
import ApplicationModal from '@/components/common/ROQ/ROQApplicationModal.vue'
import RemarksModal from '@/components/common/ROQ/ROQRemarksModal.vue'
import ViewCertificateModal from '@/components/common/ROQ/ROQViewCertificateModal.vue'
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { RefreshCw } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

const toast = useToast()
const authStore = useAuthStore()
const authStoreRole = computed(() => authStore.role)

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
const unclaimedSecondCopyApplications = ref([])
const assignedSecondCopyApplications = ref([])
const notSelectedStatus = ref(['draft', 'processing_payment'])
const selectedApplication = ref({})
const showRemarksModal = ref(false)
const error = ref(null)


const secondCopySearchQuery = ref('')
const secondCopyCurrentPage = ref(1)
const secondCopyPerPage = ref(5)

const filteredUnclaimedSecondCopy = computed(() =>
  unclaimedSecondCopyApplications.value.filter(app =>
    Object.values(app).some(val =>
      String(val).toLowerCase().includes(secondCopySearchQuery.value.toLowerCase())
    ) && !notSelectedStatus.value.includes(app.status)
  )
)

const paginatedUnclaimedSecondCopy = computed(() => {
  const start = (secondCopyCurrentPage.value - 1) * secondCopyPerPage.value
  const end = start + secondCopyPerPage.value
  return filteredUnclaimedSecondCopy.value.slice(start, end)
})

// const filteredSecondCopyApplications = computed(() =>
//   unclaimedSecondCopyApplications.value.filter(app =>
//     Object.values(app).some(val =>
//       String(val).toLowerCase().includes(secondCopySearchQuery.value.toLowerCase())
//     ) && !notSelectedStatus.value.includes(app.status)
//   )
// )

// const paginatedSecondCopyApplications = computed(() => {
//   const start = (secondCopyCurrentPage.value - 1) * secondCopyPerPage.value
//   const end = start + secondCopyPerPage.value
//   return filteredSecondCopyApplications.value.slice(start, end)
// })

const assignedSecondCopySearchQuery = ref('')
const assignedSecondCopyCurrentPage = ref(1)
const assignedSecondCopyPerPage = ref(10)

const filteredAssignedSecondCopy = computed(() =>
  assignedSecondCopyApplications.value.filter(app =>
    Object.values(app).some(val =>
      String(val).toLowerCase().includes(assignedSecondCopySearchQuery.value.toLowerCase())
    )
  )
)

// Computed Property for filtered Applications
const filteredApplications = computed(() => {
  console.log(applications.value);

  return applications.value.filter((app) => {
    const matchesStatus = selectedStatus.value ? app.status === selectedStatus.value : true
    const matchesType = selectedType.value ? app.type_of_course === selectedType.value : true
    const unmatchedStatus = !notSelectedStatus.value.includes(app.status)
    const matchesSearch = searchQuery.value
      ? Object.values(app).some((value) =>
        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
      : true
    const isSecondCopy = app.is_second_copy // Exclude if is_second_copy is true
    const isNotDraft = app.status !== 'draft'

    return matchesStatus && matchesType && matchesSearch && isSecondCopy && isNotDraft && unmatchedStatus
  })
})

const paginatedAssignedSecondCopy = computed(() => {
  const start = (assignedSecondCopyCurrentPage.value - 1) * assignedSecondCopyPerPage.value
  const end = start + assignedSecondCopyPerPage.value
  return filteredAssignedSecondCopy.value.slice(start, end)
})


const handleClaimSecondCopyApplication = async (application) => {
  const claimToastId = toast.info(`Claiming second copy application for ${application.applicants_name}...`, { timeout: false });
  try {
    await apiService.claimApplication(application.id);
    toast.dismiss(claimToastId);
    toast.success('Second copy application successfully claimed!');
    await loadData(); // Refresh lists so claimed app moves to assigned
  } catch (err) {
    toast.dismiss(claimToastId);
    toast.error(err.response?.data?.detail || 'Failed to claim application.');
  }
};

// const unclaimedSecondCopyApplications = computed(() =>
//   applications.value.filter(app =>
//     app.is_second_copy === true &&
//     !app.assigned_to // or whatever field indicates it's unclaimed
//   )
// )

// Compute total for pagination
// const filteredTotal = computed(() => filteredApplications.value.length)

// // Get paginated data
// const paginatedApplications = computed(() => {
//   const start = (currentPage.value - 1) * perPage.value
//   const end = start + perPage.value

//   return filteredApplications.value.slice(start, end)
// })

// Reset pagination when filters change
watch([selectedStatus, selectedType, searchQuery], () => {
  currentPage.value = 1
})

// Method for closing the modal and refreshing data
const handleApplicationSubmitted = async () => {
  if (loading.value) return // Prevent multiple clicks

  showModal.value = false
  loading.value = true
  error.value = null

  try {
    // Show a persistent loading toast
    const loadingToast = toast.info('Refreshing applications...', {
      timeout: false, // Prevent auto-dismissal
      closeButton: false, // Hide the close button
    })

    await loadData()
    await nextTick()

    toast.dismiss(loadingToast)
    toast.success('Applications refreshed successfully')
  } catch (err) {
    error.value = err
    console.error('Failed to refresh applications:', err)
    toast.error('Failed to refresh applications. Please try again.')
  } finally {
    loading.value = false // Ensure loading is reset
  }
}

// Load Data Function
const loadData = async () => {
  loading.value = true
  try {
    // Fetch all applications with is_second_copy=true
    const response = await apiService.getRecognitionOfQualifications({ is_second_copy: true })
    const allSecondCopyApps = response.data.results || []

    // Split into unclaimed and assigned
    unclaimedSecondCopyApplications.value = allSecondCopyApps.filter(app => !app.assigned_to)
    assignedSecondCopyApplications.value = allSecondCopyApps.filter(app => app.assigned_to === authStore.userId)
  } catch (error) {
    console.error('Error loading second copy applications:', error)
  } finally {
    loading.value = false
  }
}

// Page Change Handler
const handlePageChange = (newPage) => {
  currentPage.value = newPage
}

const handlePerPageChange = (newPerPage) => {
  perPage.value = newPerPage
  currentPage.value = 1 // Reset to first page when per page changes
}

//search query change handler
const handleSearchChange = (newQuery) => {
  searchQuery.value = newQuery
}

//Status filter change
const handleStatusChange = (newStatus) => {
  selectedStatus.value = newStatus
}

const handleApplicationAction = ({ action, application }) => {
  if (action === 'regretReason') {
    selectedApplication.value = application
    showRemarksModal.value = true
    return
  } else if (action === 'viewCertificate') {
    modalType.value = 'viewCertificate'
    selectedApplication.value = application
    showModal.value = true
    return
  }
  else if (action === 'viewRemarks') { // <-- fix here
    selectedApplication.value = application
    showRemarksModal.value = true
    return
  }
  else {
    modalType.value = action
  }
  selectedApplication.value = application
  if (action === 'addNote') {
    noteText.value = application.remarks
  }
  showModal.value = true
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
  const updateLoadingToast = toast.info('Updating application...', { timeout: false })
  try {
    await apiService.patchRecognitionOfQualification(selectedApplication.value.id, updateData)
    toast.dismiss(updateLoadingToast)
    toast.success('Application updated successfully.')
    await loadData()
  } catch (e) {
    toast.dismiss(updateLoadingToast)
    toast.error(e.response?.data?.detail || 'Failed to update application.')
  } finally {
    closeModal()
  }
}

onMounted(() => {
  loadData()
})
</script>
