<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Training Center Renewal Applications</h1>
      <div class="flex flex-wrap items-center text-gray-600 space-x-6">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ renewalApplications.length }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          Pending: {{ pendingApplications.length }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          Awaiting Payment: {{ awaitingPaymentApplications.length }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          Rejected: {{ rejectedApplications.length }}
        </span>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center my-8">
      <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
      <p class="ml-2 text-gray-600">Loading renewal applications...</p>
    </div>

    <div
      v-else-if="apiError"
      class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6"
    >
      <h3 class="text-lg font-medium mb-2">Error Loading Applications</h3>
      <p>{{ errorMessage }}</p>
      <button
        @click="fetchRenewals"
        class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Try Again
      </button>
    </div>

    <div
      v-else-if="renewalApplications.length > 0"
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Center Name
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Institute
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Submitted On
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Renewal Status
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
            <tr
              v-for="renewal in renewalApplications"
              :key="renewal.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ renewal.teaching_center.center_name }}
                </div>
                <div class="text-xs text-gray-500">ID: {{ renewal.teaching_center.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ renewal.teaching_center.institute_details.name_of_institution }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(renewal.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(renewal.renewal_status)"
                >
                  {{ renewal.renewal_status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    v-if="renewal.renewal_status === 'PENDING'"
                    @click="handleApprove(renewal)"
                    class="btn btn-success"
                  >
                    Approve
                  </button>
                  <button
                    v-if="renewal.renewal_status === 'PENDING'"
                    @click="handleReject(renewal)"
                    class="btn btn-danger"
                  >
                    Reject
                  </button>
                  <button @click="openDetailsModal(renewal)" class="btn btn-primary">
                    View Details
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
      <p class="text-gray-600">No teaching center renewal applications found.</p>
    </div>

    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-xl font-bold text-gray-900">Renewal Application Details</h3>
          <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedRenewal" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Center Information</h4>
              <div class="p-4 bg-gray-50 rounded-lg space-y-2">
                <p class="text-sm">
                  <span class="font-semibold text-gray-600">Name:</span>
                  {{ selectedRenewal.teaching_center.center_name }}
                </p>
                <p class="text-sm">
                  <span class="font-semibold text-gray-600">Location:</span>
                  {{ selectedRenewal.teaching_center.center_location }},
                  {{ selectedRenewal.teaching_center.state_dzongkhag }}
                </p>
                <p class="text-sm">
                  <span class="font-semibold text-gray-600">Current Validity:</span>
                  {{ formatDate(selectedRenewal.teaching_center.valid_till) }}
                </p>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Applicant Submission</h4>
              <div class="p-4 bg-gray-50 rounded-lg space-y-2">
                <p class="text-sm">
                  <span class="font-semibold text-gray-600">Document:</span>
                  <a
                    v-if="selectedRenewal.renewal_document"
                    :href="selectedRenewal.renewal_document"
                    target="_blank"
                    class="text-blue-600 hover:underline ml-2"
                    >View Document</a
                  >
                  <span v-else class="text-gray-500 italic ml-2">None</span>
                </p>
                <p class="text-sm">
                  <span class="font-semibold text-gray-600">Remarks:</span>
                  {{ selectedRenewal.user_remarks || 'No remarks provided.' }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="selectedRenewal.renewal_status === 'PENDING'" class="pt-4 border-t">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Review Application</h4>
            <div>
              <label for="officerRemarks" class="block text-sm font-medium text-gray-700 mb-1"
                >Your Remarks (Reason for Rejection)</label
              >
              <textarea
                id="officerRemarks"
                v-model="officerRemarks"
                rows="3"
                placeholder="Enter reason for rejection here..."
                class="w-full rounded-md border-gray-300 shadow-sm"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3 mt-4">
              <button
                @click="submitReview('reject')"
                class="btn btn-danger"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Rejecting...' : 'Reject' }}
              </button>
              <button
                @click="submitReview('approve')"
                class="btn btn-success"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Approving...' : 'Approve' }}
              </button>
            </div>
          </div>

          <div v-else class="pt-4 border-t">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Review History</h4>
            <div class="p-4 bg-gray-50 rounded-lg space-y-2">
              <p class="text-sm">
                <span class="font-semibold text-gray-600">Decision:</span>
                {{ selectedRenewal.renewal_status }}
              </p>
              <p class="text-sm">
                <span class="font-semibold text-gray-600">Reviewed By:</span>
                {{ selectedRenewal.reviewed_by_name || 'N/A' }}
              </p>
              <p class="text-sm">
                <span class="font-semibold text-gray-600">Reviewed At:</span>
                {{ formatDate(selectedRenewal.reviewed_at) }}
              </p>
              <p class="text-sm">
                <span class="font-semibold text-gray-600">Officer Remarks:</span>
                {{ selectedRenewal.officer_remarks || 'N/A' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import { Loader } from 'lucide-vue-next'

// --- State Management ---
const renewalApplications = ref([])
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const selectedRenewal = ref(null)
const showDetailsModal = ref(false)
const isSubmitting = ref(false)
const officerRemarks = ref('')
const toast = useToast()

// --- Computed Properties ---
const pendingApplications = computed(() =>
  renewalApplications.value.filter((app) => app.renewal_status === 'PENDING')
)
const awaitingPaymentApplications = computed(() =>
  renewalApplications.value.filter((app) => app.renewal_status === 'AWAITING_PAYMENT')
)
const rejectedApplications = computed(() =>
  renewalApplications.value.filter((app) => app.renewal_status === 'REJECTED')
)

// --- Utility Functions ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'COMPLETED':
    case 'AWAITING_PAYMENT':
      return 'bg-green-100 text-green-800'
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// --- Event Handlers & API Calls ---
const fetchRenewals = async () => {
  isLoading.value = true
  apiError.value = false
  try {
    const response = await apiServices.getAllTeachingCenterRenewals()
    renewalApplications.value = response.data?.results || response.data || []
  } catch (error) {
    errorMessage.value =
      error.response?.data?.detail || 'Error fetching renewals. Please try again.'
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

const openDetailsModal = (renewal) => {
  selectedRenewal.value = renewal
  officerRemarks.value = '' // Reset remarks field
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedRenewal.value = null
}

const handleApprove = (renewal) => {
  if (
    confirm(
      `Are you sure you want to approve the renewal for "${renewal.teaching_center.center_name}"?`
    )
  ) {
    selectedRenewal.value = renewal
    submitReview('approve', 'Quickly approved from list view.')
  }
}

const handleReject = (renewal) => {
  const reason = prompt(
    `Please provide a reason for rejecting the renewal for "${renewal.teaching_center.center_name}":`
  )
  if (reason) {
    selectedRenewal.value = renewal
    submitReview('reject', reason)
  }
}

const submitReview = async (decision, remarks) => {
  if (!selectedRenewal.value) return

  const finalRemarks = remarks || officerRemarks.value
  if (decision === 'reject' && !finalRemarks.trim()) {
    toast.error('A reason for rejection is required.')
    return
  }

  isSubmitting.value = true
  try {
    const renewalId = selectedRenewal.value.id
    const payload = { remarks: finalRemarks }

    if (decision === 'approve') {
      await apiServices.approveTeachingCenterRenewal(renewalId, payload)
      toast.success('Renewal application approved successfully!')
    } else {
      await apiServices.rejectTeachingCenterRenewal(renewalId, payload)
      toast.error('Renewal application has been rejected.')
    }
    await fetchRenewals() // Refresh list
    closeDetailsModal()
  } catch (error) {
    toast.error(error.response?.data?.remarks?.[0] || 'Failed to submit review.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchRenewals)
</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center rounded-lg border border-transparent py-2 px-4 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}
.btn-success {
  @apply bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
}
.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}
</style>