<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">


    <div class="mx-auto">
      <DOPageHeader
        title="CPD Applications"
        :description="headerDescription"
        :search-query="searchQuery"
        @update:searchQuery="searchQuery = $event"
        search-placeholder="Search by name, CID, registration or title..."
        :filter-value="statusFilter"
        @update:filterValue="statusFilter = $event"
        :filter-options="statusFilterOptions"
      />
      
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading applications...</span>
      </div>

      <div
        v-else-if="filteredApplications.length === 0"
        class="bg-white shadow-sm rounded-lg py-16 text-center border border-gray-200"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-base font-medium text-gray-900">No applications found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            applications.length > 0
              ? 'Try adjusting your search or filter criteria.'
              : 'No CPD applications have been submitted yet.'
          }}
        </p>
      </div>

      <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
                >
                  Applicant
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                >
                  CPD Details
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submitted On
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="app in paginatedApplications"
                :key="app.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 font-medium">{{ app.full_name }}</div>
                  <div class="text-xs text-gray-500">CID: {{ app.cid_no }}</div>
                  <div class="text-xs text-gray-500">
                    Reg. ID: {{ app.registration_no || 'N/A' }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 font-medium break-words">
                    {{ app.title_of_cpd }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Type: {{ app.type_of_cpd?.cpd_activity_name || 'N/A' }}
                  </div>
                  <div class="text-xs text-gray-500">Credits: {{ app.credit }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      getStatusColor(app.application_status),
                      'px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block',
                    ]"
                  >
                    {{ app.application_status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(app.status_last_updated) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="openViewModal(app, null)"
                    class="text-blue-600 hover:text-blue-900 font-medium text-sm px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    View
                  </button>
                  <button
                    v-if="app.application_status === 'SUBMITTED'"
                    @click="openViewModal(app, 'approve')"
                    class="ml-2 text-green-600 hover:text-green-900 font-medium text-sm px-3 py-1 rounded-md hover:bg-green-50 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    v-if="app.application_status === 'SUBMITTED'"
                    @click="openViewModal(app, 'reject')"
                    class="ml-2 text-red-600 hover:text-red-900 font-medium text-sm px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to
                <span class="font-medium">{{ paginationEnd }}</span> of
                <span class="font-medium">{{ filteredApplications.length }}</span> results
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <span
                  aria-current="page"
                  class="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >{{ currentPage }}</span
                >
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Next</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CpdViewApplicationsModal
      v-if="isViewModalOpen"
      :application="selectedApplication"
      :initial-action="initialAction"
      @save="saveApplication"
      @approve="approveApplication"
      @reject="rejectApplication"
      @close="closeViewModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import CpdViewApplicationsModal from '../modals/CpdViewApplicationsModal.vue'
import apiServices from '@/services/services'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue'
import { useToast } from 'vue-toastification'

// --- STATE ---
const applications = ref([])
const selectedApplication = ref(null)
const isViewModalOpen = ref(false)
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const toast = useToast()
// --- NEW: State to control the modal's initial action ---
const initialAction = ref(null)

// --- COMPUTED PROPERTIES ---
const totalApplicationsCount = computed(
  () => applications.value.filter((app) => app.status !== 'Draft').length,
)
const SUBMITTEDCount = computed(
  () => applications.value.filter((app) => app.application_status === 'SUBMITTED').length,
)
const headerDescription = computed(
  () => `Total: ${totalApplicationsCount.value} | SUBMITTED: ${SUBMITTEDCount.value}`,
)
// --- UPDATED: Values now match API status strings for correct filtering ---
const statusFilterOptions = ref([
  { value: '', text: 'All Statuses' },
  { value: 'SUBMITTED', text: 'SUBMITTED' },
  { value: 'APPROVED', text: 'Approved' },
  { value: 'REGRETTED', text: 'Rejected' },
])

const filteredApplications = computed(() => {
  let filtered = applications.value.filter((app) => !app.is_draft)

  if (statusFilter.value) {
    filtered = filtered.filter((app) => app.application_status === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (app) =>
        app.full_name?.toLowerCase().includes(query) ||
        app.cid_no?.toString().includes(query) ||
        app.title_of_cpd?.toLowerCase().includes(query) ||
        app.registration_no?.toString().toLowerCase().includes(query),
    )
  }
  return filtered
})

const totalPages = computed(
  () => Math.ceil(filteredApplications.value.length / pageSize.value) || 1,
)
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value)
const paginationEnd = computed(() =>
  Math.min(paginationStart.value + pageSize.value, filteredApplications.value.length),
)
const paginatedApplications = computed(() =>
  filteredApplications.value.slice(paginationStart.value, paginationEnd.value),
)

// --- METHODS ---

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const resetPagination = () => {
  currentPage.value = 1
}

watch([searchQuery, statusFilter], resetPagination)



const getStatusColor = (status) =>
  ({
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REGRETTED: 'bg-red-100 text-red-800',
    DRAFT: 'bg-gray-100 text-gray-800',
  })[status] || 'bg-gray-100 text-gray-800'

// --- UPDATED: openViewModal now accepts an action ---
const openViewModal = (app, action = null) => {
  selectedApplication.value = app
  initialAction.value = action // 'approve', 'reject', or null
  isViewModalOpen.value = true
}

// --- UPDATED: closeViewModal now resets the action ---
const closeViewModal = () => {
  isViewModalOpen.value = false
  selectedApplication.value = null
  initialAction.value = null // Reset on close
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// --- ACTION HANDLERS & API CALLS (No changes) ---
const saveApplication = async (payload) => {
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('credit', payload.credit)
    await apiServices.patchMhpcCpdTask(payload.id, formData)
    toast.success('The CPD credits have been updated successfully.')
    await fetchApplications()
  } catch (err) {
    console.error('Failed to save application:', err)
    toast.error('Could not update application credits.')
  } finally {
    loading.value = false
    closeViewModal()
  }
}

const approveApplication = async (payload) => {
  try {
    loading.value = true
    const patchData = {
      application_status: 'APPROVED',
      status_remarks: payload.status_remarks,
      credit: payload.credit,
      is_cpd_approved: true,
    }
    const formData = new FormData()
    for (const key in patchData) {
      formData.append(key, patchData[key])
    }
    await apiServices.patchMhpcCpdTask(payload.id, formData)
    toast.success('The CPD application has been approved.')
    await fetchApplications()
  } catch (err) {
    console.error('Failed to approve application:', err)
    toast.error('An error occurred while approving the application.')
  } finally {
    loading.value = false
    closeViewModal()
  }
}

const rejectApplication = async (payload) => {
  try {
    loading.value = true
    const patchData = {
      application_status: 'REGRETTED',
      status_remarks: payload.status_remarks,
      is_cpd_approved: false,
    }
    const formData = new FormData()
    for (const key in patchData) {
      formData.append(key, patchData[key])
    }
    await apiServices.patchMhpcCpdTask(payload.id, formData)
    toast.success('The CPD application has been marked as regretted.')
    await fetchApplications()
  } catch (err) {
    console.error('Failed to reject application:', err)
    toast.error('An error occurred while rejecting the application.')
  } finally {
    loading.value = false
    closeViewModal()
  }
}

const fetchApplications = async () => {
  try {
    loading.value = true
    const response = await apiServices.getMhpcCpdTask()
    applications.value = response.data?.results || []
  } catch (err) {
    console.error('Failed to fetch applications:', err)
    showNotification('error', 'Load Failed', 'Error loading CPD applications.')
    applications.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchApplications()
})
</script>


