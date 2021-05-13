<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <!-- Notification System -->
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
        <!-- Notification Icon -->
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
        <!-- Notification Text -->
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
        <!-- Notification Close Button -->
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

    <!-- Main Content Area -->
    <div class="mx-auto w-full">
      <!-- Use DOPageHeader Component -->
      <DOPageHeader
        title="Self CPD Applications"
        :description="headerDescription"
        :search-query="searchQuery"
        @update:searchQuery="searchQuery = $event"
        search-placeholder="Search by name, registration or activity..."
        :filter-value="statusFilter"
        @update:filterValue="statusFilter = $event"
        :filter-options="statusFilterOptions"
      />



      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex justify-center items-center py-16 bg-white rounded-lg shadow-sm mt-6"
      >
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading applications...</span>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredParticipants.length === 0"
        class="bg-white shadow-sm rounded-lg py-16 text-center border border-gray-200 mt-6"
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
            participants.length > 0
              ? 'Try adjusting your search or filter criteria.'
              : 'No self CPD applications have been submitted.'
          }}
        </p>
      </div>

      <!-- Participants Table -->
      <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 mt-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applicant Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Registration Number
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CPD Activity
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Credits Awarded
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
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
                v-for="participant in paginatedParticipants"
                :key="participant.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ participant.fullName }}</div>
                  <div class="text-xs text-gray-500">CID: {{ participant.cidNumber }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ participant.registrationNoDisplay }}</div>
                </td>
                <td class="px-6 py-4 max-w-xs">
                  <div class="text-sm text-gray-900 truncate" :title="participant.cpdTitle">
                    {{ participant.cpdTitle }}
                  </div>
                  <div class="text-xs text-gray-500">{{ participant.activityTypeDisplay }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-sm font-medium text-gray-900">
                    {{ participant.cpdCredits ?? '-' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    :class="[
                      getStatusColor(participant.reviewStatus),
                      'inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full', // Adjusted padding/font
                    ]"
                  >
                    {{ participant.reviewStatus || 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="openDetailsModal(participant)"
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to
                <span class="font-medium">{{ paginationEnd }}</span> of
                <span class="font-medium">{{ filteredParticipants.length }}</span> results
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
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                >
                  {{ currentPage }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

    <!-- **** DETAILS MODAL COMPONENT USAGE **** -->
    <CpdApplicationDetailsModal
      v-model="isDetailsModalVisible"
      :participant="selectedParticipant"
      @approve="handleApproveApplication"
      @reject="handleRejectApplication"
      @awardCredits="handleUpdateCredits"
    />
    <!-- **** END MODAL COMPONENT USAGE **** -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiServices from '@/services/services'
import CpdApplicationDetailsModal from '../modals/AwardCpdCreditsModal.vue'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue' // Import the header

// --- State ---
const participants = ref([])
const selectedParticipant = ref(null)
const isDetailsModalVisible = ref(false)
const isLoading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('') // Default to empty string for "All Statuses"
const currentPage = ref(1)
const pageSize = ref(10)
const notification = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  timeout: null,
})

// --- Computed properties ---
const totalCreditsAwarded = computed(() => {
  return participants.value
    .filter((p) => p.reviewStatus === 'Approved' && typeof p.cpdCredits === 'number')
    .reduce((total, p) => total + p.cpdCredits, 0)
})

const pendingCount = computed(
  () => participants.value.filter((p) => (p.reviewStatus || 'Pending') === 'Pending').length,
)
const approvedCount = computed(
  () => participants.value.filter((p) => p.reviewStatus === 'Approved').length,
)
const regrettedCount = computed(
  () => participants.value.filter((p) => p.reviewStatus === 'Regretted').length,
)

// Computed property for the header description
const headerDescription = computed(() => {
  const total = participants.value.length
  return `Total: ${total} | Pending: ${pendingCount.value} | Approved: ${approvedCount.value} | Regretted: ${regrettedCount.value} | Total Credits (Approved): ${totalCreditsAwarded.value}`
})

// Options for the status filter dropdown in DOPageHeader
const statusFilterOptions = ref([
  { value: '', text: 'All Statuses' }, // Use empty string for "All"
  { value: 'Pending', text: 'Pending' },
  { value: 'Approved', text: 'Approved' },
  { value: 'Regretted', text: 'Regretted' },
])

const filteredParticipants = computed(() => {
  let filtered = participants.value

  // Filter by status (using empty string for "All")
  if (statusFilter.value) {
    if (statusFilter.value === 'Pending') {
      filtered = filtered.filter((p) => !p.reviewStatus || p.reviewStatus === 'Pending')
    } else {
      filtered = filtered.filter((p) => p.reviewStatus === statusFilter.value)
    }
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (p) =>
        p.fullName?.toLowerCase().includes(query) ||
        p.registrationNoDisplay?.toString().toLowerCase().includes(query) ||
        p.cpdTitle?.toLowerCase().includes(query) ||
        p.activityTypeDisplay?.toLowerCase().includes(query) ||
        p.participationCategoryDisplay?.toLowerCase().includes(query) ||
        p.participantSubCategoryDisplay?.toLowerCase().includes(query) ||
        p.cidNumber?.toString().toLowerCase().includes(query), // Added CID search
    )
  }
  return filtered
})

// Pagination Computeds
const totalPages = computed(() => {
  return Math.ceil(filteredParticipants.value.length / pageSize.value) || 1
})

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

watch([filteredParticipants, totalPages], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

const paginationEnd = computed(() => {
  return Math.min(paginationStart.value + pageSize.value, filteredParticipants.value.length)
})

const paginatedParticipants = computed(() => {
  return filteredParticipants.value.slice(paginationStart.value, paginationEnd.value)
})

// --- Methods ---

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

const showNotification = (type, title, message, duration = 5000) => {
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
  }
  notification.value = {
    show: true,
    type,
    title,
    message,
    timeout: setTimeout(() => closeNotification(), duration > 0 ? duration : 5000),
  }
}

const closeNotification = () => {
  notification.value.show = false
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
    notification.value.timeout = null
  }
}

const getStatusColor = (status) => {
  status = status || 'Pending'
  return (
    {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Regretted: 'bg-red-100 text-red-800',
    }[status] || 'bg-gray-100 text-gray-800'
  )
}

const openDetailsModal = (participant) => {
  selectedParticipant.value = { ...participant }
  isDetailsModalVisible.value = true
}

watch(isDetailsModalVisible, (newValue) => {
  if (!newValue) {
    setTimeout(() => {
      selectedParticipant.value = null
    }, 300)
  }
})

const handleApproveApplication = async (payload) => {
  const { participantId, remarks } = payload
  const participantToUpdate = participants.value.find((p) => p.id === participantId)
  if (!participantToUpdate) return handleActionError(participantId, 'approve')

  isLoading.value = true
  const updatedData = {
    review_status: 'Approved',
    remark: remarks,
  }

  try {
    const response = await apiServices.patchMhpcCpdRecord(participantId, updatedData)
    handleActionSuccess(response.data, 'Approved')
  } catch (error) {
    handleActionError(participantId, 'approve', error)
  } finally {
    isLoading.value = false
  }
}

const handleRejectApplication = async (payload) => {
  const { participantId, remarks } = payload
  const participantToUpdate = participants.value.find((p) => p.id === participantId)
  if (!participantToUpdate) return handleActionError(participantId, 'regret')

  isLoading.value = true
  const updatedData = {
    review_status: 'Regretted',
    remark: remarks,
    cpd_credit: 0,
  }

  try {
    const response = await apiServices.patchMhpcCpdRecord(participantId, updatedData)
    handleActionSuccess(response.data, 'Regretted')
  } catch (error) {
    handleActionError(participantId, 'regret', error)
  } finally {
    isLoading.value = false
  }
}

const handleUpdateCredits = async (payload) => {
  const { participantId, credits } = payload
  const participantToUpdate = participants.value.find((p) => p.id === participantId)
  if (!participantToUpdate) return handleActionError(participantId, 'update credits')

  const updatedData = {
    cpd_credit: credits,
  }

  try {
    const response = await apiServices.patchMhpcCpdRecord(participantId, updatedData)
    const updatedItem = mapApiResponseToParticipant(response.data)
    updateLocalParticipant(updatedItem)
    if (selectedParticipant.value && selectedParticipant.value.id === participantId) {
      selectedParticipant.value = {
        ...selectedParticipant.value,
        cpdCredits: updatedItem.cpdCredits,
      }
    }
    showNotification(
      'success',
      'Credits Updated',
      `Credits for ${updatedItem.fullName} set to ${updatedItem.cpdCredits}.`,
    )
  } catch (error) {
    handleActionError(participantId, 'update credits', error)
  }
}

const handleActionSuccess = (apiResponseData, actionType) => {
  const updatedItem = mapApiResponseToParticipant(apiResponseData)
  updateLocalParticipant(updatedItem)
  showNotification(
    'success',
    `Application ${actionType}`,
    `${updatedItem.fullName}'s application status updated to ${actionType}.`,
  )
}

const handleActionError = (participantId, actionType, error = null) => {
  console.error(`Error during ${actionType} for participant ${participantId}:`, error)
  const participantName =
    participants.value.find((p) => p.id === participantId)?.fullName || `ID ${participantId}`
  const apiErrorMessage =
    error?.response?.data?.detail || error?.response?.data?.message || error?.message
  const fallbackMessage = `Failed to ${actionType} application for ${participantName}.`
  const actionTitle = actionType.charAt(0).toUpperCase() + actionType.slice(1)
  showNotification('error', `${actionTitle} Failed`, apiErrorMessage || fallbackMessage)
}

const updateLocalParticipant = (updatedItem) => {
  const index = participants.value.findIndex((p) => p.id === updatedItem.id)
  if (index !== -1) {
    participants.value.splice(index, 1, updatedItem)
  } else {
    console.warn("Tried to update local participant but couldn't find ID:", updatedItem.id)
    // Consider fetching data again if this happens unexpectedly
    // fetchData();
  }
}

const mapApiResponseToParticipant = (item) => ({
  id: item.id,
  fullName: item.full_name,
  registrationNoDisplay: item.registration_no_display,
  cpdTitle: item.title_of_cpd,
  cpdCredits: item.cpd_credit,
  cidNumber: item.cid_no,
  gender: item.gender,
  relevance: item.relevance_to_profession,
  participationCategoryDisplay: item.participation_category_display || 'N/A',
  participantSubCategoryDisplay: item.participant_sub_category_display || 'N/A',
  activityTypeDisplay: item.type_of_cpd_activity_display || 'N/A',
  attachment: item.attachment
    ? { url: item.attachment, name: item.attachment.split('/').pop() }
    : null, // Include name
  reviewStatus: item.review_status || 'Pending',
  remarks: item.remark,
})

const fetchData = async () => {
  isLoading.value = true
  try {
    // Fetching all records, filtering happens client-side for this component
    const response = await apiServices.getMhpcCpdRecords({ page_size: 1000 }) // Adjust page_size if needed
    if (response && response.data && Array.isArray(response.data.results)) {
      participants.value = response.data.results.map(mapApiResponseToParticipant)
    } else {
      console.error('Error fetching CPD records: Unexpected response format', response)
      participants.value = []
      showNotification('error', 'Data Loading Failed', 'Received invalid data from server.')
    }
  } catch (error) {
    console.error('Error fetching CPD records:', error)
    participants.value = []
    const apiError =
      error?.response?.data?.detail || error?.message || 'Failed to connect to the server.'
    showNotification('error', 'Connection Error', `Could not fetch records. ${apiError}`)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Notification Animation */
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
