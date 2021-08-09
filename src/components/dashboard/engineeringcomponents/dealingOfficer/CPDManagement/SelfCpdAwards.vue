<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <!-- Notification Modal -->
    <SelfCPDNotificationModal :notification="notification" @close-notification="closeNotification" />

    <!-- Header Card -->
    <div class="mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Award CPD Credits</h1>
        <div class="flex mt-4 space-x-6">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-gray-600">Total Participants: {{ participants.length }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-gray-600">Awarded Credits: {{ totalCreditsAwarded }}</span>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <input v-model="searchQuery" type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search by name, registration number or activity..." />
        </div>
        <select v-model="statusFilter"
          class="w-full md:w-64 block pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-16 bg-white rounded-lg shadow-sm">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading participants...</span>
      </div>

      <!-- Empty State or Table -->
      <SelfCPDEmptyState v-else-if="filteredParticipants.length === 0" :participants-length="participants.length" />
      <SelfCPDParticipantsTable v-else :participants="paginatedParticipants" :pagination-start="paginationStart"
        :pagination-end="paginationEnd" :total-participants="filteredParticipants.length" :current-page="currentPage"
        :total-pages="totalPages" @open-award-modal="openAwardModal" @prev-page="prevPage" @next-page="nextPage" />

      <!-- Award Modal -->
      <SelfCPDAwardModal v-if="isAwardModalVisible" :participant="selectedParticipant" :credit-score="creditScore"
        :credit-error="creditError" @close-modal="closeAwardModal" @award-credits="awardCredits"
        @approve="handleApprove" @reject="handleReject" @update:credit-score="creditScore = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiServices from '@/services/services'
import SelfCPDNotificationModal from './SelfCPDNotificationModal.vue'
import SelfCPDParticipantsTable from './SelfCPDParticipantsTable.vue'
import SelfCPDEmptyState from './SelfCPDEmptyState.vue'
import SelfCPDAwardModal from './SelfCPDAwardModal.vue'

// State
const participants = ref([])
const selectedParticipant = ref(null)
const isAwardModalVisible = ref(false)
const creditScore = ref(0)
const creditError = ref('')
const isLoading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('All')
const currentPage = ref(1)
const pageSize = ref(10)

// Notification state
const notification = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  timeout: null,
})

// Computed properties
const totalCreditsAwarded = computed(() => {
  return participants.value.reduce((total, p) => total + (p.cpdCredits || 0), 0)
})

const filteredParticipants = computed(() => {
  let filtered = participants.value
  if (statusFilter.value !== 'All') {
    filtered = filtered.filter((p) => p.reviewStatus === statusFilter.value)
  }
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (p) =>
        p.fullName?.toLowerCase().includes(query) ||
        p.registrationNumber?.toString().includes(query) ||
        p.cpdTitle?.toLowerCase().includes(query),
    )
  }
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredParticipants.value.length / pageSize.value) || 1
})

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

const paginationEnd = computed(() => {
  return Math.min(paginationStart.value + pageSize.value, filteredParticipants.value.length)
})

const paginatedParticipants = computed(() => {
  return filteredParticipants.value.slice(paginationStart.value, paginationEnd.value)
})

// Methods
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
    timeout: null,
  }
  if (duration > 0) {
    notification.value.timeout = setTimeout(() => {
      closeNotification()
    }, duration)
  }
}

const closeNotification = () => {
  notification.value.show = false
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
    notification.value.timeout = null
  }
}

const openAwardModal = (participant) => {
  selectedParticipant.value = participant
  isAwardModalVisible.value = true
  creditScore.value = 0
  creditError.value = ''
}

const closeAwardModal = () => {
  isAwardModalVisible.value = false
  setTimeout(() => {
    selectedParticipant.value = null
    creditScore.value = 0
    creditError.value = ''
  }, 300)
}

const updateParticipantInList = (updatedData) => {
  const participantIndex = participants.value.findIndex(
    (p) => p.id === selectedParticipant.value.id,
  )
  if (participantIndex !== -1) {
    participants.value.splice(participantIndex, 1, {
      ...participants.value[participantIndex],
      ...updatedData,
    })
  }
}

const awardCredits = () => {
  creditError.value = ''
  if (creditScore.value <= 0) {
    creditError.value = 'Please enter a valid credit score greater than 0.'
    return
  }
  if (!selectedParticipant.value || selectedParticipant.value.id === undefined) {
    console.error('Selected participant is invalid or has no ID.')
    return
  }

  const updatedCredits = (selectedParticipant.value.cpdCredits || 0) + creditScore.value
  const updatedData = {
    cpd_credit: updatedCredits,
    review_status: 'Approved',
  }

  isLoading.value = true
  apiServices
    .patchEpcCpdRecord(selectedParticipant.value.id, updatedData)
    .then(() => {
      updateParticipantInList({
        cpdCredits: updatedCredits,
        reviewStatus: 'Approved',
      })
      showNotification(
        'success',
        'Credits Awarded',
        `Successfully awarded ${creditScore.value} credits to ${selectedParticipant.value.fullName} and marked as Approved.`,
      )
      closeAwardModal()
    })
    .catch((error) => {
      console.error('Error updating CPD credits:', error)
      showNotification(
        'error',
        'Failed to Award Credits',
        'There was an error processing your request. Please try again.',
      )
    })
    .finally(() => {
      isLoading.value = false
    })
}

const handleApprove = (message) => {
  if (!selectedParticipant.value || selectedParticipant.value.id === undefined) {
    console.error('Selected participant is invalid or has no ID.')
    return
  }

  const updatedData = {
    review_status: 'Approved',
    remark: message || null,
  }

  isLoading.value = true
  apiServices
    .patchEpcCpdRecord(selectedParticipant.value.id, updatedData)
    .then(() => {
      updateParticipantInList({
        reviewStatus: 'Approved',
        remarks: message || null,
      })
      showNotification(
        'success',
        'Application Approved',
        `Successfully approved application for ${selectedParticipant.value.fullName}.`,
      )
      closeAwardModal()
    })
    .catch((error) => {
      console.error('Error approving application:', error)
      showNotification(
        'error',
        'Failed to Approve',
        'There was an error processing your request. Please try again.',
      )
    })
    .finally(() => {
      isLoading.value = false
    })
}

const handleReject = (message) => {
  if (!selectedParticipant.value || selectedParticipant.value.id === undefined) {
    console.error('Selected participant is invalid or has no ID.')
    return
  }

  const updatedData = {
    review_status: 'Rejected',
    remark: message || null,
  }

  isLoading.value = true
  apiServices
    .patchEpcCpdRecord(selectedParticipant.value.id, updatedData)
    .then(() => {
      updateParticipantInList({
        reviewStatus: 'Rejected',
        remarks: message || null,
      })
      showNotification(
        'success',
        'Application Rejected',
        `Successfully rejected application for ${selectedParticipant.value.fullName}.`,
      )
      closeAwardModal()
    })
    .catch((error) => {
      console.error('Error rejecting application:', error)
      showNotification(
        'error',
        'Failed to Reject',
        'There was an error processing your request. Please try again.',
      )
    })
    .finally(() => {
      isLoading.value = false
    })
}

// MODIFIED LIFECYCLE HOOK
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await apiServices.getEpcCpdRecords()
    if (response && response.data && response.data.results) {
      const allResults = response.data.results;

      // 1. Separate draft data from non-draft data
      const draftData = allResults.filter(item => item.is_draft);
      const nonDraftData = allResults.filter(item => !item.is_draft);

      // 2. Show a toast notification if there are drafts
      if (draftData.length > 0) {
        showNotification(
          'info',
          'Drafts Found',
          `You have ${draftData.length} item(s) in your drafts which are not shown in this list.`,
          10000 // Show for 10 seconds
        );
      }
      participants.value = nonDraftData.map((item) => ({
        id: item.id,
        fullName: item.full_name,
        registrationNumber: item?.registration_no_details?.registration_no,
        cpdTitle: item.title_of_cpd,
        cpdCredits: item.cpd_credit,
        cidNumber: item.cid_no,
        gender: item.gender,
        relevance: item.relevance_to_profession,
        participationCategory: item.participation_category_display,
        participantSubCategory: item.participant_sub_category_display,
        activityType: item.type_of_cpd_activity_display,
        attachment: item.attachment ? { url: item.attachment } : null,
        reviewStatus: item.review_status,
        remarks: item.remark,
      }));

    } else {
      console.error('Error fetching CPD records: Unexpected response format', response)
      participants.value = []
      showNotification('error', 'Data Loading Failed', 'Could not retrieve participant records.')
    }
  } catch (error) {
    console.error('Error fetching CPD records:', error)
    participants.value = []
    showNotification(
      'error',
      'Connection Error',
      'Failed to connect to the server. Please try again later.',
    )
  } finally {
    isLoading.value = false
  }
})
</script>
<style scoped>
/* Scoped styles for main component */
</style>
