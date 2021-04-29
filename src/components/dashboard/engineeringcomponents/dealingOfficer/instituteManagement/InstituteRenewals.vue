<template>
  <div class="p-6 md:p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-6 md:p-8 mb-8 shadow-sm border border-gray-100">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        EPC Institute Renewal Applications
      </h1>
      <div
        v-if="!isLoading && !apiError"
        class="flex flex-wrap items-center text-gray-600 text-sm gap-x-4 gap-y-1"
      >
        <span class="flex items-center">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></span>
          Total Relevant: {{ institutes.length }}
          <!-- Adjusted text -->
        </span>
        <span class="flex items-center">
          <span class="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1.5"></span>
          Pending Review: {{ pendingReviewCount }}
        </span>
        <span class="flex items-center">
          <span class="w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></span>
          Active: {{ activeCount }}
        </span>
      </div>
      <div v-else-if="isLoading" class="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-10">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"
      ></div>
      <p class="mt-3 text-gray-600">Loading applications...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="apiError"
      class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg shadow-sm"
    >
      <h3 class="text-lg font-medium mb-2">Error Loading Data</h3>
      <p class="mb-4">{{ errorMessage }}</p>
      <button
        @click="fetchInstitutes"
        class="bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
      >
        Try Again
      </button>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Institute Name (ID)
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Applicant
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Course Title
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Active Status
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Valid Till
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Review Decision
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="institutes.length === 0 && !isLoading">
              <!-- Only show if not loading -->
              <td
                colspan="7"
                class="px-6 py-10 whitespace-nowrap text-center text-sm text-gray-500"
              >
                No relevant applications found matching the criteria.
              </td>
            </tr>
            <tr
              v-for="institute in institutes"
              :key="institute.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ institute.name_of_institution || 'N/A' }}
                </div>
                <div class="text-xs text-gray-500">ID: {{ institute.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ institute.full_name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ institute.title_of_course || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <!-- Status based on is_active -->
                <span :class="getActiveStatusClass(institute.is_active)">
                  {{ institute.is_active ? 'Active' : 'Inactive / Pending' }}
                  <!-- Updated text -->
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm"
                :class="getValidityClass(institute.valid_till)"
              >
                {{ formatDate(institute.valid_till) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <!-- Review Decision Status -->
                <span :class="getReviewDecisionClass(institute.do_dpr_review_decision)">
                  {{ institute.do_dpr_review_decision || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="openModal(institute)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
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
                  <!-- Add other potential actions like quick approve/reject here if needed -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Placeholder -->
    <div
      v-if="!isLoading && !apiError && institutes.length > 0"
      class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100"
    >
      <div class="text-sm text-gray-600">
        Showing <span class="font-medium">{{ institutes.length }}</span> results
        <!-- Add total count from API if pagination is implemented -->
      </div>
      <!-- Pagination controls would go here -->
    </div>

    <!-- Modal -->
    <InstituteRenewalApplicationDetailsModal
      v-if="selectedInstitute"
      :is-open="isModalOpen"
      :application-details="selectedInstitute"
      @close-modal="closeModal"
      @approve-application="handleApprove"
      @regret-application="handleRegret"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
// *** ADJUST PATH AS NEEDED ***
import InstituteRenewalApplicationDetailsModal from '../modals/InstituteRenewalApplicationDetailsModal.vue'
// *** ADJUST PATH AS NEEDED ***
import apiService from '@/services/services'

// --- Reactive State ---
const institutes = ref([])
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const isModalOpen = ref(false)
const selectedInstitute = ref(null) // Use null initially
const isProcessingAction = ref(false) // For loading state during approve/regret

const toast = useToast()

// --- Computed Properties for Counts ---
const pendingReviewCount = computed(() => {
  if (!Array.isArray(institutes.value)) return 0
  // Counts institutes where the specific review decision field is 'Pending'
  return institutes.value.filter((inst) => inst.do_dpr_review_decision === 'Pending').length
})

const activeCount = computed(() => {
  if (!Array.isArray(institutes.value)) return 0
  return institutes.value.filter((inst) => inst.is_active === true).length
})

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchInstitutes()
})

// --- API Methods ---
const fetchInstitutes = async () => {
  isLoading.value = true
  apiError.value = false
  errorMessage.value = ''
  institutes.value = []

  try {
    const response = await apiService.getEpcInstitutes()
    let dataToProcess = []
    if (Array.isArray(response)) {
      dataToProcess = response
    } else if (response && response.data && Array.isArray(response.data.results)) {
      dataToProcess = response.data.results
    } else if (response && response.data && Array.isArray(response.data)) {
      dataToProcess = response.data
    } else {
      console.warn('Unexpected API response format:', response)
      throw new Error('Received unexpected data format from the server.')
    }

    // Filter for expired applications submitted for renewal
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize to start of day
    institutes.value = dataToProcess.filter((inst) => {
      let isExpired = false
      if (inst.valid_till) {
        try {
          const validTillDate = new Date(inst.valid_till)
          validTillDate.setHours(0, 0, 0, 0)
          isExpired = validTillDate < today
        } catch  {
          console.warn(`Invalid valid_till date for institute ${inst.id}:`, inst.valid_till)
          isExpired = false // Treat invalid dates as not expired to avoid false positives
        }
      }
      return isExpired && inst.do_dpr_review_decision === 'Pending'
    })
  } catch (error) {
    console.error('Error fetching institute data:', error)
    apiError.value = true
    const msg =
      error?.response?.data?.detail ||
      error?.message ||
      'Failed to load institute data. Please check the console for details.'
    errorMessage.value = msg
    toast.error(msg)
    institutes.value = []
  } finally {
    isLoading.value = false
  }
}

const handleApprove = async (instituteToUpdate) => {
  // Receives data from modal emit
  if (!instituteToUpdate || !instituteToUpdate.id || isProcessingAction.value) {
    if (!instituteToUpdate || !instituteToUpdate.id)
      toast.error('Invalid institute data for approval.')
    return
  }

  isProcessingAction.value = true
  try {
    const currentDate = new Date()
    // Use valid_till if it exists and is a valid date, otherwise use today
    let currentValidTill = null
    if (instituteToUpdate.valid_till) {
      try {
        currentValidTill = new Date(instituteToUpdate.valid_till)
        if (isNaN(currentValidTill.getTime())) {
          // Check if date is valid
          currentValidTill = currentDate
          console.warn(
            `Invalid valid_till date for institute ${instituteToUpdate.id}, using current date.`,
          )
        }
      } catch (e) {
        currentValidTill = currentDate
        console.warn(
          `Error parsing valid_till date for institute ${instituteToUpdate.id}, using current date:`,
          e,
        )
      }
    } else {
      currentValidTill = currentDate
    }

    let newValidSince
    let newValidTill = new Date()

    // Check if currentValidTill is actually in the future compared to today
    const todayNormalized = new Date(currentDate)
    todayNormalized.setHours(0, 0, 0, 0)
    const expiryNormalized = new Date(currentValidTill)
    expiryNormalized.setHours(0, 0, 0, 0)

    if (expiryNormalized >= todayNormalized) {
      // If currently valid or expiring today/future, start new period after current expiry
      newValidSince = new Date(currentValidTill)
      newValidSince.setDate(newValidSince.getDate() + 1) // Day after current expiry
      newValidTill = new Date(newValidSince)
      newValidTill.setFullYear(newValidTill.getFullYear() + 1) // Extend 1 year
    } else {
      // If expired or first approval, start from today
      newValidSince = new Date(currentDate)
      newValidTill = new Date(currentDate)
      newValidTill.setFullYear(newValidTill.getFullYear() + 1) // Extend 1 year
    }

    const updatedData = {
      is_active: true,
      do_dpr_review_decision: 'Approved',
      is_payment_complete: true, // As requested
      valid_since: newValidSince.toISOString().split('T')[0],
      valid_till: newValidTill.toISOString().split('T')[0],
      do_dpr_reason_if_rejected: null, // Clear any previous rejection reason
    }

    // *** Use the correct API PATCH method ***
    await apiService.patchEpcInstitute(instituteToUpdate.id, updatedData)

    toast.success(`Approved application for: ${instituteToUpdate.name_of_institution}`)
    closeModal() // Close modal on success
    await fetchInstitutes() // Refresh list
  } catch (error) {
    console.error('Error approving institute:', error)
    const msg =
      error?.response?.data?.detail ||
      error?.response?.data ||
      error?.message ||
      'Failed to approve application.'
    // Check if error response is an object and stringify it for better readability in toast
    const errorDetail = typeof msg === 'object' ? JSON.stringify(msg) : msg
    toast.error(`Approval failed: ${errorDetail}`)
  } finally {
    isProcessingAction.value = false
  }
}

const handleRegret = async (instituteToUpdate, reason) => {
  // Accepts reason from modal
  if (!instituteToUpdate || !instituteToUpdate.id || isProcessingAction.value) {
    if (!instituteToUpdate || !instituteToUpdate.id)
      toast.error('Invalid institute data for rejection.')
    return
  }
  // Reason validation now happens within the modal

  isProcessingAction.value = true
  try {
    const updatedData = {
      is_active: false, // Ensure inactive
      do_dpr_review_decision: 'Rejected', // Use 'Rejected' or 'Regretted' consistently
      do_dpr_reason_if_rejected: reason, // Reason from modal
      is_payment_complete: false, // Set payment false on rejection
      // Decide if validity dates should be cleared or kept
      // valid_since: null,
      // valid_till: null,
    }

    // *** Use the correct API PATCH method ***
    await apiService.patchEpcInstitute(instituteToUpdate.id, updatedData)

    toast.info(`Regretted application for: ${instituteToUpdate.name_of_institution}`)
    closeModal() // Close modal on success
    await fetchInstitutes() // Refresh list
  } catch (error) {
    console.error('Error regretting institute:', error)
    const msg =
      error?.response?.data?.detail ||
      error?.response?.data ||
      error?.message ||
      'Failed to regret application.'
    const errorDetail = typeof msg === 'object' ? JSON.stringify(msg) : msg
    toast.error(`Regret failed: ${errorDetail}`)
  } finally {
    isProcessingAction.value = false
  }
}

// --- Modal Control ---
const openModal = (institute) => {
  // Clone the object to prevent accidental direct mutation if modal edits data locally
  selectedInstitute.value = JSON.parse(JSON.stringify(institute))
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedInstitute.value = null // Clear selected data
}

// --- Formatting and Styling ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      // DD/MM/YYYY
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch (e) {
    console.error('Error formatting date:', dateString, e)
    return 'Invalid Date'
  }
}

const getActiveStatusClass = (isActive) => {
  // For the 'Active' / 'Inactive' status based on is_active
  if (isActive === true) {
    return 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
  } else {
    // Covers false, null, undefined
    return 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800' // Changed Inactive to Gray
  }
}

const getReviewDecisionClass = (decision) => {
  // For the administrative review decision
  const lowerDecision = String(decision).toLowerCase()
  if (lowerDecision === 'approved') {
    return 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'
  } else if (lowerDecision === 'rejected' || lowerDecision === 'regretted') {
    return 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
  } else if (lowerDecision === 'pending') {
    return 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
  } else {
    // Handles null, undefined, or other values
    return 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
}

const getValidityClass = (validTillDate) => {
  if (!validTillDate) return 'text-gray-500'
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize today's date
  let expiryDate
  try {
    expiryDate = new Date(validTillDate)
    if (isNaN(expiryDate.getTime())) throw new Error('Invalid Date')
    expiryDate.setHours(0, 0, 0, 0) // Normalize expiry date
  } catch {
    return 'text-purple-600 font-medium' // Indicate invalid date format
  }

  const diffTime = expiryDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return 'text-red-600 font-medium' // Expired
  } else if (diffDays <= 30) {
    return 'text-orange-600' // Expiring soon (30 days or less)
  } else if (diffDays <= 90) {
    return 'text-yellow-600' // Expiring (90 days or less)
  } else {
    return 'text-gray-600' // Valid
  }
}
</script>

<style scoped>
/* Add any component-specific styles here if needed */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
