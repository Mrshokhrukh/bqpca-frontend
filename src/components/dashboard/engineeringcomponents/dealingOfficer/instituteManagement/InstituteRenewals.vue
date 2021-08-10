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
        <!-- CORRECTED: Stats now reflect the list of renewal applications pending review -->
        <span class="flex items-center">
          <span class="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1.5"></span>
          Pending Review: {{ renewalApplications.length }}
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
      <!-- CORRECTED: Calls the correct fetch function -->
      <button
        @click="fetchRenewalApplications"
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
              <!-- CORRECTED: Column headers updated for relevance -->
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Institute Name (ID)</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Title</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Renewal Status</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Validity</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="renewalApplications.length === 0 && !isLoading">
              <td colspan="7" class="px-6 py-10 whitespace-nowrap text-center text-sm text-gray-500">
                No renewal applications are currently pending review.
              </td>
            </tr>
            <!-- CORRECTED: Loop over renewalApplications and access nested institute_details -->
            <tr v-for="renewal in renewalApplications" :key="renewal.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ renewal.institute_details.name_of_institution || 'N/A' }}</div>
                <div class="text-xs text-gray-500">ID: {{ renewal.institute_details.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ renewal.institute_details.full_name || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ renewal.institute_details.title_of_course || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <!-- Uses a new status class function -->
                <span :class="getRenewalStatusClass(renewal.renewal_status)">
                  {{ renewal.renewal_status_display || renewal.renewal_status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getValidityClass(renewal.institute_details.valid_till)">
                {{ formatDate(renewal.institute_details.valid_till) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(renewal.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <!-- Passes the entire renewal object to the modal -->
                  <button @click="openModal(renewal)" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Review
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Placeholder -->
    <div v-if="!isLoading && !apiError && renewalApplications.length > 0" class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div class="text-sm text-gray-600">
        Showing <span class="font-medium">{{ renewalApplications.length }}</span> results
      </div>
    </div>

    <!-- Modal -->
    <!-- CORRECTED: The modal now receives the entire renewal object.
         Its internal implementation will also need to be updated to access `applicationDetails.institute_details` -->
    <InstituteRenewalApplicationDetailsModal
      v-if="selectedRenewal"
      :is-open="isModalOpen"
      :application-details="selectedRenewal"
      @close-modal="closeModal"
      @approve-application="handleApprove"
      @regret-application="handleRegret"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import InstituteRenewalApplicationDetailsModal from '../modals/InstituteRenewalApplicationDetailsModal.vue'
// IMPORTANT: Make sure this path points to your actual api service file
import apiService from '@/services/services'

// --- Reactive State ---
const renewalApplications = ref([])
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const isModalOpen = ref(false)
const selectedRenewal = ref(null)
const isProcessingAction = ref(false)
const toast = useToast()

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchRenewalApplications()
})

// --- API Methods ---

// CORRECTED: This function now fetches renewal data using the correct endpoint and filtering.
const fetchRenewalApplications = async () => {
  isLoading.value = true
  apiError.value = false
  renewalApplications.value = []

  try {
    // Your API viewset supports filtering, so we use it to get only pending reviews.
    // This assumes your getEpcInstituteRenewals function can accept query parameters.
    const response = await apiService.getEpcInstituteRenewals({ params: { renewal_status: 'PENDING_REVIEW' } })

    // Handle different possible API response structures (e.g., with pagination)
    if (response.data && Array.isArray(response.data.results)) {
        renewalApplications.value = response.data.results
    } else if (Array.isArray(response.data)) {
        renewalApplications.value = response.data
    } else {
      throw new Error('Received unexpected data format from the server.')
    }
  } catch (error) {
    console.error('Error fetching institute renewal data:', error)
    apiError.value = true
    const msg = error?.response?.data?.detail || error.message || 'Failed to load renewal applications.'
    errorMessage.value = msg
    toast.error(msg)
  } finally {
    isLoading.value = false
  }
}

// CORRECTED: Approval logic is simplified. It just updates the renewal status.
const handleApprove = async (renewalToUpdate, remarks) => {
  if (!renewalToUpdate || !renewalToUpdate.id || isProcessingAction.value) return

  isProcessingAction.value = true
  try {
    const updatedData = {
      renewal_status: 'AWAITING_PAYMENT', // Move to the next step in the workflow
      officer_remarks: remarks || 'Approved for payment.', // Pass remarks from modal
    }

    // Call the correct API method to PATCH the renewal object
    await apiService.patchEpcInstituteRenewal(renewalToUpdate.id, updatedData)

    toast.success(`Application for ${renewalToUpdate.institute_details.name_of_institution} has been approved and is now awaiting payment.`)
    closeModal()
    await fetchRenewalApplications() // Refresh the list to remove the approved item
  } catch (error) {
    console.error('Error approving renewal:', error)
    const msg = error?.response?.data?.detail || JSON.stringify(error?.response?.data) || 'Approval failed.'
    toast.error(msg)
  } finally {
    isProcessingAction.value = false
  }
}

// CORRECTED: Rejection logic is simplified to update the renewal status.
const handleRegret = async (renewalToUpdate, reason) => {
  if (!renewalToUpdate || !renewalToUpdate.id || !reason || isProcessingAction.value) {
    if(!reason) toast.error("A reason is required for rejection.")
    return
  }

  isProcessingAction.value = true
  try {
    const updatedData = {
      renewal_status: 'REJECTED',
      officer_remarks: reason, // The reason from the modal
    }

    // Call the correct API method to PATCH the renewal object
    await apiService.patchEpcInstituteRenewal(renewalToUpdate.id, updatedData)

    toast.info(`Application for ${renewalToUpdate.institute_details.name_of_institution} has been rejected.`)
    closeModal()
    await fetchRenewalApplications() // Refresh the list
  } catch (error) {
    console.error('Error rejecting renewal:', error)
    const msg = error?.response?.data?.detail || JSON.stringify(error?.response?.data) || 'Rejection failed.'
    toast.error(msg)
  } finally {
    isProcessingAction.value = false
  }
}

// --- Modal Control ---
const openModal = (renewal) => {
  selectedRenewal.value = JSON.parse(JSON.stringify(renewal))
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedRenewal.value = null
}

// --- Formatting and Styling ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch (e) {
    return 'Invalid Date'
  }
}

// NEW: Styling for the renewal status from the `EnggInstituteRenewal` model
const getRenewalStatusClass = (status) => {
  const lowerStatus = String(status).toLowerCase();
  if (lowerStatus === 'completed' || lowerStatus === 'completed & active') {
    return 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
  } else if (lowerStatus === 'awaiting_payment') {
    return 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'
  } else if (lowerStatus === 'rejected') {
    return 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
  } else if (lowerStatus === 'pending_review') {
    return 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
  }
  return 'px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
}

const getValidityClass = (validTillDate) => {
  if (!validTillDate) return 'text-gray-500 font-medium' // Was expired, now just not set
  const today = new Date();
  today.setHours(0, 0, 0, 0)
  const expiryDate = new Date(validTillDate)
  expiryDate.setHours(0, 0, 0, 0)

  if (expiryDate < today) {
    return 'text-red-600 font-medium' // Expired
  }
  const diffTime = expiryDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 30) {
    return 'text-orange-600' // Expiring soon
  }
  return 'text-gray-600' // Valid
}
</script>
<style scoped>
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