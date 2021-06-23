<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <Transition name="notification">
      <div
        v-if="notification.show"
        :class="[
          'fixed right-4 top-4 p-4 rounded-md shadow-lg flex items-center z-50 max-w-md',
          notification.type === 'success'
            ? 'bg-green-50 border-l-4 border-green-500'
            : notification.type === 'error'
            ? 'bg-red-50 border-l-4 border-red-500'
            : 'bg-blue-50 border-l-4 border-blue-500',
        ]"
      >
        <div
          :class="[
            'flex-shrink-0 w-6 h-6',
            notification.type === 'success'
              ? 'text-green-500'
              : notification.type === 'error'
              ? 'text-red-500'
              : 'text-blue-500',
          ]"
        >
          <svg
            v-if="notification.type === 'success'"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            v-else-if="notification.type === 'error'"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3
            :class="[
              'text-sm font-medium',
              notification.type === 'success'
                ? 'text-green-800'
                : notification.type === 'error'
                ? 'text-red-800'
                : 'text-blue-800',
            ]"
          >
            {{ notification.title }}
          </h3>
          <p
            :class="[
              'text-sm mt-1',
              notification.type === 'success'
                ? 'text-green-700'
                : notification.type === 'error'
                ? 'text-red-700'
                : 'text-blue-700',
            ]"
          >
            {{ notification.message }}
          </p>
        </div>
        <button @click="closeNotification" class="ml-4 text-gray-500 hover:text-gray-600">
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Transition>

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
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applicant
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                  Submitted
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
                  <div class="text-sm text-gray-900 font-medium">{{ app.title_of_cpd }}</div>
                  <div class="text-xs text-gray-500 mt-1">
                    Type: {{ app.type_of_cpd?.cpd_activity_name || 'N/A' }}
                  </div>
                  <div class="text-xs text-gray-500">Credits: {{ app.credit }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[getStatusColor(app.application_status)]">
                    {{ app.application_status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(app.status_last_updated) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      getStatusColor(app.status),
                      'px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block',
                    ]"
                  >
                    {{ app.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ app.date }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="openViewModal(app)"
                    class="text-blue-600 hover:text-blue-900 font-medium text-sm px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    View
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

// --- STATE (No changes here) ---
const applications = ref([])
const selectedApplication = ref(null)
const isViewModalOpen = ref(false)
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const notification = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  timeout: null,
})

// --- COMPUTED PROPERTIES (No changes here) ---
const totalApplicationsCount = computed(
  () => applications.value.filter((app) => app.status !== 'Draft').length
)
const pendingCount = computed(
  () => applications.value.filter((app) => app.status === 'Pending').length
)
const headerDescription = computed(
  () => `Total: ${totalApplicationsCount.value} | Pending: ${pendingCount.value}`
)
const statusFilterOptions = ref([
  { value: '', text: 'All Statuses' },
  { value: 'Pending', text: 'Pending' },
  { value: 'Approved', text: 'Approved' },
  { value: 'Rejected', text: 'Rejected' },
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
        app.registration_no?.toString().toLowerCase().includes(query)
    )
  }
  return filtered
})

const totalPages = computed(
  () => Math.ceil(filteredApplications.value.length / pageSize.value) || 1
)
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value)
const paginationEnd = computed(() =>
  Math.min(paginationStart.value + pageSize.value, filteredApplications.value.length)
)
const paginatedApplications = computed(() =>
  filteredApplications.value.slice(paginationStart.value, paginationEnd.value)
)

// --- METHODS (No changes here) ---

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

const showNotification = (type, title, message, duration = 5000) => {
  if (notification.value.timeout) clearTimeout(notification.value.timeout)
  notification.value = {
    show: true,
    type,
    title,
    message,
    timeout: setTimeout(closeNotification, duration),
  }
}
const closeNotification = () => {
  notification.value.show = false
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
    notification.value.timeout = null
  }
}

const getStatusColor = (status) =>
  ({
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    DRAFT: 'bg-gray-100 text-gray-800',
  }[status] || 'bg-gray-100 text-gray-800')

const openViewModal = (app) => {
  // Pass the raw, unmodified application object to the modal
  selectedApplication.value = app
  isViewModalOpen.value = true
}
const closeViewModal = () => {
  isViewModalOpen.value = false
  selectedApplication.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

// // --- UPDATED: processApiResponse to be more comprehensive ---
// const processApiResponse = (results) => {
//   if (!Array.isArray(results)) {
//     applications.value = []
//     return
//   }
//   applications.value = results.map((item) => ({
//     // Personal & Basic Info
//     id: item.id,
//     applicantName: item.full_name,
//     fullName: item.full_name,
//     cidNumber: item.cid_no,
//     registrationNumber: item.registration_no || 'N/A',
//     gender: item.gender || 'Not specified',

//     // Status & Dates
//     status: getTaskStatus(item),
//     date: formatDate(item.status_last_updated),
//     fromDate: formatDate(item.from_date),
//     toDate: formatDate(item.to_date),

//     // CPD Core Details
//     title: item.title_of_cpd,
//     cpdTitle: item.title_of_cpd,
//     venue: item.venue || 'Not specified',
//     cpdProvider: item.cpd_providing_agency?.name || 'N/A',
//     durationInHours: item.duration_in_hours || 0,
//     numberOfParticipants: item.number_of_participants || 0,
//     relevance: item.relevance_to_topic,
//     expectedOutcome: item.expected_outcome || 'N/A',
//     activityType: item.type_of_cpd?.cpd_activity_name || 'N/A',

//     // Categories & Methodologies
//     participationCategory:
//       item.target_participant_categories?.map((cat) => cat.category_name).join(', ') || 'N/A',
//     participantSubCategory:
//       item.target_participant_subcategories?.map((sub) => sub.sub_category_name).join(', ') ||
//       'N/A',
//     methodologies:
//       item.methodologies
//         ?.map((m) => m.methodology_name.methodology_name)
//         .filter(Boolean)
//         .join(', ') || 'N/A',
//     learningMethods: item.learning_methods || [], // Keep as array

//     // Attachments
//     attachment: item.attachment
//       ? { name: item.attachment.split('/').pop(), url: item.attachment }
//       : null,
//     courseDocument: item.course_document
//       ? { name: item.course_document.split('/').pop(), url: item.course_document }
//       : null,

//     // Review & Credit Info
//     cpdCredits: item.credit,
//     reviewStatus: item.application_status,
//     remarks: item.status_remarks,

//     // Raw data for reference if needed
//     resources: item.resources || [], // Keep as array
//     isDraft: item.is_draft,
//     rawItem: item,
//   }))
// }

// const getTaskStatus = (item) => {
//   if (item.is_draft) return 'Draft'
//   const statusMap = {
//     SUBMITTED: 'Pending',
//     UNDER_REVIEW: 'Pending',
//     PENDING_CLARIFICATION: 'Pending',
//     APPROVED: 'Approved',
//     REGRETTED: 'Rejected',
//     WITHDRAWN: 'Withdrawn',
//   }
//   return statusMap[item.application_status] || 'Unknown'
// }

// --- FIXED ACTION HANDLERS (Unchanged) ---
const saveApplication = async (payload) => {
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('credit', payload.credit)
    await apiServices.patchMhpcCpdTask(payload.id, formData)
    showNotification(
      'success',
      'Credits Updated',
      'The CPD credits have been updated successfully.'
    )
    await fetchApplications()
  } catch (err) {
    console.error('Failed to save application:', err)
    showNotification('error', 'Update Failed', 'Could not update application credits.')
  } finally {
    loading.value = false
    closeViewModal()
  }
}

const approveApplication = async (payload) => {
  // Logic remains the same
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
    showNotification('success', 'Application Approved', 'The CPD application has been approved.')
    await fetchApplications()
  } catch (err) {
    console.error('Failed to approve application:', err)
    showNotification(
      'error',
      'Approval Failed',
      'An error occurred while approving the application.'
    )
  } finally {
    loading.value = false
    closeViewModal()
  }
}

const rejectApplication = async (payload) => {
  // Logic remains the same
  try {
    loading.value = true
    const patchData = {
      application_status: 'REJECTED', // Use REJECTED as per API
      status_remarks: payload.status_remarks,
      is_cpd_approved: false,
    }
    const formData = new FormData()
    for (const key in patchData) {
      formData.append(key, patchData[key])
    }
    await apiServices.patchMhpcCpdTask(payload.id, formData)
    showNotification(
      'success',
      'Application Regretted',
      'The CPD application has been marked as regretted.'
    )
    await fetchApplications()
  } catch (err) {
    console.error('Failed to reject application:', err)
    showNotification('error', 'Action Failed', 'An error occurred while rejecting the application.')
  } finally {
    loading.value = false
    closeViewModal()
  }
}

const fetchApplications = async () => {
  try {
    loading.value = true
    const response = await apiServices.getMhpcCpdTask()
    // Directly assign the raw results from the API
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

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.notification-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
