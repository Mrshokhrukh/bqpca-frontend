<template>
  <div class="p-6 min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
      <h1 class="text-2xl font-semibold text-gray-900 mb-4">Training Center Renewal Applications</h1>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span class="text-sm text-gray-600">Total: <span class="font-medium text-gray-900">{{ renewalApplications.length }}</span></span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <span class="text-sm text-gray-600">Pending: <span class="font-medium text-gray-900">{{ pendingApplications.length }}</span></span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span class="text-sm text-gray-600">Awaiting Payment: <span class="font-medium text-gray-900">{{ awaitingPaymentApplications.length }}</span></span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span class="text-sm text-gray-600">Rejected: <span class="font-medium text-gray-900">{{ rejectedApplications.length }}</span></span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
      <span class="ml-3 text-gray-600">Loading renewal applications...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="apiError" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error Loading Applications</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ errorMessage }}</p>
          </div>
          <div class="mt-4">
            <button @click="fetchRenewals" class="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Applications Table -->
    <div v-else-if="renewalApplications.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Details</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="renewal in renewalApplications" :key="renewal.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ renewal.teaching_center?.center_name }}</div>
                <div class="text-sm text-gray-500">ID: {{ renewal.teaching_center?.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ renewal.teaching_center?.institute_details?.name_of_institution }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(renewal.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(renewal.renewal_status)">
                  {{ formatStatus(renewal.renewal_status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="openDetailsModal(renewal)" class="text-blue-600 hover:text-blue-900 font-medium">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
      <p class="mt-1 text-sm text-gray-500">No training center renewal applications have been submitted yet.</p>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Renewal Application Details</h3>
          <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div v-if="selectedRenewal" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Center Information</h4>
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span class="text-sm font-medium text-gray-600">Name:</span>
                    <p class="text-sm text-gray-900 mt-1">{{ selectedRenewal.teaching_center?.center_name }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600">Location:</span>
                    <p class="text-sm text-gray-900 mt-1">{{ selectedRenewal.teaching_center?.center_location }}, {{ selectedRenewal.teaching_center?.state_dzongkhag }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600">Current Validity:</span>
                    <p class="text-sm text-gray-900 mt-1">{{ formatDate(selectedRenewal.teaching_center?.valid_till) }}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Application Details</h4>
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span class="text-sm font-medium text-gray-600">Submitted On:</span>
                    <p class="text-sm text-gray-900 mt-1">{{ formatDate(selectedRenewal.created_at) }}</p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600">Status:</span>
                    <p class="text-sm mt-1">
                      <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(selectedRenewal.renewal_status)">
                        {{ formatStatus(selectedRenewal.renewal_status) }}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span class="text-sm font-medium text-gray-600">Supporting Document:</span>
                    <div class="mt-1">
                      <a v-if="selectedRenewal.renewal_document"
                         :href="selectedRenewal.renewal_document"
                         target="_blank"
                         class="text-sm text-blue-600 hover:text-blue-800 underline">
                        View Document
                      </a>
                      <span v-else class="text-sm text-gray-500 italic">No document provided</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Applicant Remarks -->
            <div>
              <h4 class="text-sm font-medium text-gray-900 mb-3">Applicant Remarks</h4>
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-900">{{ selectedRenewal.user_remarks || 'No remarks provided by the applicant.' }}</p>
              </div>
            </div>

            <!-- Review History -->
            <div v-if="selectedRenewal.renewal_status !== 'PENDING' && selectedRenewal.renewal_status !== 'PENDING_REVIEW'">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Review History</h4>
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <span class="text-sm font-medium text-gray-600">Decision:</span>
                  <p class="text-sm text-gray-900 mt-1">{{ formatStatus(selectedRenewal.renewal_status) }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">Reviewed By:</span>
                  <p class="text-sm text-gray-900 mt-1">{{ selectedRenewal.reviewed_by_name || 'N/A' }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">Review Date:</span>
                  <p class="text-sm text-gray-900 mt-1">{{ formatDate(selectedRenewal.reviewed_at) }}</p>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-600">Officer Remarks:</span>
                  <p class="text-sm text-gray-900 mt-1">{{ selectedRenewal.officer_remarks || 'No remarks provided.' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer with Action Buttons -->
        <div v-if="selectedRenewal && (selectedRenewal.renewal_status === 'PENDING' || selectedRenewal.renewal_status === 'PENDING_REVIEW')"
             class="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button @click="openConfirmationDialog('reject')"
                  class="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500">
            Reject Application
          </button>
          <button @click="openConfirmationDialog('approve')"
                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            Approve Application
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmationDialog" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <!-- Dialog Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            Confirm {{ actionToConfirm === 'approve' ? 'Approval' : 'Rejection' }}
          </h3>
        </div>

        <!-- Dialog Content -->
        <div class="px-6 py-4">
          <p class="text-sm text-gray-600 mb-4">
            Are you sure you want to {{ actionToConfirm }} this renewal application? This action cannot be undone.
          </p>

          <!-- Remarks Input -->
          <div>
            <label for="confirmationRemarks" class="block text-sm font-medium text-gray-700 mb-2">
              {{ actionToConfirm === 'approve' ? 'Approval Comments' : 'Rejection Reason' }}
              <span v-if="actionToConfirm === 'reject'" class="text-red-500">*</span>
            </label>
            <textarea
              id="confirmationRemarks"
              v-model="confirmationRemarks"
              rows="4"
              :placeholder="actionToConfirm === 'reject' ? 'Please provide a reason for rejection...' : 'Optional comments for approval...'"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            ></textarea>
            <p v-if="actionToConfirm === 'reject'" class="mt-1 text-xs text-gray-500">
              A reason for rejection is required.
            </p>
          </div>
        </div>

        <!-- Dialog Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button @click="closeConfirmationDialog"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancel
          </button>
          <button @click="executeAction"
                  :disabled="isSubmitting || (actionToConfirm === 'reject' && !confirmationRemarks.trim())"
                  :class="[
                    'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
                    actionToConfirm === 'approve'
                      ? 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  ]">
            <span v-if="isSubmitting" class="inline-flex items-center">
              <div class="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing...
            </span>
            <span v-else>
              {{ actionToConfirm === 'approve' ? 'Approve' : 'Reject' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'

// Component State
const renewalApplications = ref([])
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const selectedRenewal = ref(null)
const showDetailsModal = ref(false)
const isSubmitting = ref(false)
const toast = useToast()

// Confirmation Dialog State
const showConfirmationDialog = ref(false)
const actionToConfirm = ref(null)
const confirmationRemarks = ref('')

// Computed Properties
const pendingApplications = computed(() =>
  renewalApplications.value.filter(app =>
    app.renewal_status === 'PENDING' || app.renewal_status === 'PENDING_REVIEW'
  )
)

const awaitingPaymentApplications = computed(() =>
  renewalApplications.value.filter(app => app.renewal_status === 'AWAITING_PAYMENT')
)

const rejectedApplications = computed(() =>
  renewalApplications.value.filter(app => app.renewal_status === 'REJECTED')
)

// Utility Functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatStatus = (status) => {
  const statusMap = {
    'PENDING': 'Pending Review',
    'PENDING_REVIEW': 'Pending Review',
    'AWAITING_PAYMENT': 'Awaiting Payment',
    'COMPLETED': 'Completed',
    'REJECTED': 'Rejected'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const statusClasses = {
    'COMPLETED': 'bg-green-100 text-green-800',
    'AWAITING_PAYMENT': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'PENDING': 'bg-amber-100 text-amber-800',
    'PENDING_REVIEW': 'bg-amber-100 text-amber-800'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

// API Functions
const fetchRenewals = async () => {
  isLoading.value = true
  apiError.value = false

  try {
    const response = await apiServices.getTeachingCenterRenewals()
    renewalApplications.value = (response.data?.results || response.data || [])
      .filter(renewal => renewal.teaching_center)
  } catch (error) {
    console.error('Error fetching renewals:', error)
    errorMessage.value = error.response?.data?.detail || 'Failed to load renewal applications. Please try again.'
    apiError.value = true
    toast.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

// Modal Functions
const openDetailsModal = (renewal) => {
  selectedRenewal.value = renewal
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedRenewal.value = null
}

const openConfirmationDialog = (action) => {
  actionToConfirm.value = action
  confirmationRemarks.value = ''
  showConfirmationDialog.value = true
}

const closeConfirmationDialog = () => {
  showConfirmationDialog.value = false
  actionToConfirm.value = null
  confirmationRemarks.value = ''
}

// Action Functions
const executeAction = async () => {
  if (!selectedRenewal.value || !actionToConfirm.value) return

  if (actionToConfirm.value === 'reject' && !confirmationRemarks.value.trim()) {
    toast.error('Please provide a reason for rejection.')
    return
  }

  isSubmitting.value = true

  try {
    const renewalId = selectedRenewal.value.id
    const payload = { remarks: confirmationRemarks.value.trim() }

    if (actionToConfirm.value === 'approve') {
      await apiServices.approveTeachingCenterRenewal(renewalId, payload)
      toast.success('Renewal application approved successfully.')
    } else {
      await apiServices.rejectTeachingCenterRenewal(renewalId, payload)
      toast.success('Renewal application rejected.')
    }

    // Close modals and refresh data
    closeConfirmationDialog()
    closeDetailsModal()
    await fetchRenewals()

  } catch (error) {
    console.error('Error processing action:', error)
    const errorMsg = error.response?.data?.remarks?.[0] ||
                    error.response?.data?.detail ||
                    'Failed to process the request. Please try again.'
    toast.error(errorMsg)
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchRenewals()
})
</script>