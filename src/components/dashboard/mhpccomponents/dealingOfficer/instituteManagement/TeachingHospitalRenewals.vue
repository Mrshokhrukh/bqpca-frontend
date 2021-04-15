<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Teaching Center Renewal Applications</h1>
      <div class="flex items-center text-gray-600 space-x-6">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ teachingCenters.length }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          Pending: {{ pendingApplications.length }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          Approved: {{ approvedApplications.length }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          Rejected: {{ rejectedApplications.length }}
        </span>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center my-8">
      <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
      <p class="ml-2 text-gray-600">Loading applications...</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="apiError"
      class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6"
    >
      <h3 class="text-lg font-medium mb-2">Error Loading Applications</h3>
      <p>{{ errorMessage }}</p>
      <button
        @click="fetchTeachingCenters"
        class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Try Again
      </button>
    </div>

    <!-- Applications Table -->
    <div
      v-else-if="teachingCenters.length > 0"
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
                Institute Name
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Location
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
                Status
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
              v-for="center in teachingCenters"
              :key="center.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ center.center_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ center.institute_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ center.center_location }}, {{ center.state_dzongkhag }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(center.valid_till) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(center.tc_review_decision)"
                >
                  {{ center.tc_review_decision }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    v-if="center.tc_review_decision === 'Pending'"
                    @click="handleApprove(center)"
                    class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    Approve
                  </button>
                  <button
                    v-if="center.tc_review_decision === 'Pending'"
                    @click="handleReject(center)"
                    class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    Reject
                  </button>
                  <button
                    @click="openDetailsModal(center)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No applications message -->
    <div v-else class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
      <p class="text-gray-600">No teaching center renewal applications found.</p>
    </div>

    <!-- Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-4xl w-full">
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-xl font-bold text-gray-900">Teaching Center Details</h3>
          <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-500">
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedCenter" class="space-y-6">
          <!-- Center & Institute Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Center Information</h4>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-1 gap-3">
                  <div>
                    <p class="text-xs text-gray-500">Center Name</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ selectedCenter.center_name }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Location</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ selectedCenter.center_location }}, {{ selectedCenter.state_dzongkhag }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">City/Gewog</p>
                    <p class="text-sm font-medium text-gray-800">{{ selectedCenter.city_gewog }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Target Category</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ selectedCenter.target_category }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Institute Information</h4>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-1 gap-3">
                  <div>
                    <p class="text-xs text-gray-500">Institute Name</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ selectedCenter.institute_name }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Validity Period</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ formatDate(selectedCenter.valid_since) }} to
                      {{ formatDate(selectedCenter.valid_till) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Attachments & Remarks -->
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Documents & Remarks</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Attachments</p>
                  <div class="mt-1">
                    <a
                      v-if="selectedCenter.tc_attachments"
                      :href="selectedCenter.tc_attachments"
                      target="_blank"
                      class="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg
                        class="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        ></path>
                      </svg>
                      View Document
                    </a>
                    <p v-else class="text-gray-500 italic">No attachments provided</p>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Remarks</p>
                  <p class="text-sm text-gray-800 mt-1">
                    {{ selectedCenter.remarks || 'No remarks provided' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Review Form (only for pending applications) -->
          <div v-if="selectedCenter.tc_review_decision === 'Pending'">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Review Form</h4>
            <form @submit.prevent="submitReview" class="p-4 bg-gray-50 rounded-lg space-y-4">
              <div>
                <label for="reviewName" class="block text-sm font-medium text-gray-700"
                  >Review Name</label
                >
                <input
                  type="text"
                  id="reviewName"
                  v-model="reviewForm.tc_renewal_review_name"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label for="reviewSummary" class="block text-sm font-medium text-gray-700"
                  >Review Summary</label
                >
                <textarea
                  id="reviewSummary"
                  v-model="reviewForm.tc_review_summary"
                  rows="3"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              <div>
                <label for="reportUpload" class="block text-sm font-medium text-gray-700"
                  >Report Upload</label
                >
                <input
                  type="file"
                  id="reportUpload"
                  @change="handleReportUpload"
                  class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p v-if="selectedFileName" class="mt-1 text-sm text-green-600">
                  Selected: {{ selectedFileName }}
                </p>
              </div>

              <div>
                <label for="reviewDecision" class="block text-sm font-medium text-gray-700"
                  >Review Decision</label
                >
                <select
                  id="reviewDecision"
                  v-model="reviewForm.tc_review_decision"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div v-if="reviewForm.tc_review_decision === 'Rejected'">
                <label for="rejectionReason" class="block text-sm font-medium text-gray-700"
                  >Reason for Rejection</label
                >
                <textarea
                  id="rejectionReason"
                  v-model="reviewForm.tc_reason_if_rejected"
                  rows="2"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              <div>
                <label for="reviewRemarks" class="block text-sm font-medium text-gray-700"
                  >Review Remarks</label
                >
                <textarea
                  id="reviewRemarks"
                  v-model="reviewForm.tc_remarks"
                  rows="2"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeDetailsModal"
                  class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Previous Review (for already reviewed applications) -->
          <div v-else-if="selectedCenter.tc_review_decision !== 'Pending'">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Review Details</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Review Name</p>
                  <p class="text-sm font-medium text-gray-800">
                    {{ selectedCenter.tc_renewal_review_name || 'N/A' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Review Summary</p>
                  <p class="text-sm text-gray-800">
                    {{ selectedCenter.tc_review_summary || 'N/A' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Report</p>
                  <div class="mt-1">
                    <a
                      v-if="selectedCenter.tc_report"
                      :href="selectedCenter.tc_report"
                      target="_blank"
                      class="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg
                        class="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        ></path>
                      </svg>
                      View Report
                    </a>
                    <p v-else class="text-gray-500 italic">No report provided</p>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Decision</p>
                  <p class="text-sm font-medium">
                    <span
                      class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusClass(selectedCenter.tc_review_decision)"
                    >
                      {{ selectedCenter.tc_review_decision }}
                    </span>
                  </p>
                </div>
                <div v-if="selectedCenter.tc_review_decision === 'Rejected'">
                  <p class="text-xs text-gray-500">Rejection Reason</p>
                  <p class="text-sm text-gray-800">
                    {{ selectedCenter.tc_reason_if_rejected || 'N/A' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Review Remarks</p>
                  <p class="text-sm text-gray-800">{{ selectedCenter.tc_remarks || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve Confirmation Modal -->
    <div
      v-if="showApproveModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Approval</h3>
        <p class="mb-6 text-gray-600">
          Are you sure you want to approve the renewal application for
          <span class="font-semibold">{{ selectedCenter?.center_name }}</span
          >?
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="cancelApprove"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            @click="confirmApprove"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Confirm Approval
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Confirmation Modal -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Rejection</h3>
        <p class="mb-4 text-gray-600">
          Are you sure you want to reject the renewal application for
          <span class="font-semibold">{{ selectedCenter?.center_name }}</span
          >?
        </p>
        <div class="mb-6">
          <label for="rejectReason" class="block text-sm font-medium text-gray-700 mb-1">
            Reason for Rejection
          </label>
          <textarea
            id="rejectReason"
            v-model="rejectReason"
            rows="3"
            required
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div class="flex justify-end space-x-4">
          <button
            @click="cancelReject"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            @click="confirmReject"
            :disabled="!rejectReason.trim()"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :class="{ 'opacity-50 cursor-not-allowed': !rejectReason.trim() }"
          >
            Confirm Rejection
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
import { Loader } from 'lucide-vue-next'

// State variables
const teachingCenters = ref([])
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const selectedCenter = ref(null)
const showDetailsModal = ref(false)
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const rejectReason = ref('')
const isSubmitting = ref(false)
const selectedFile = ref(null)
const selectedFileName = ref('')

// Review form data
const reviewForm = ref({
  tc_renewal_review_name: '',
  tc_review_summary: '',
  tc_report: null,
  tc_review_decision: 'Pending',
  tc_reason_if_rejected: '',
  tc_remarks: '',
})

// Get toast notification
const toast = useToast()

// Computed properties for filtering applications
const pendingApplications = computed(() => {
  return teachingCenters.value.filter((center) => center.tc_review_decision === 'Pending')
})

const approvedApplications = computed(() => {
  return teachingCenters.value.filter((center) => center.tc_review_decision === 'Approved')
})

const rejectedApplications = computed(() => {
  return teachingCenters.value.filter((center) => center.tc_review_decision === 'Rejected')
})

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (e) {
    console.error('Error formatting date:', e)
    return 'N/A'
  }
}

// Get status class for styling
const getStatusClass = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800'
    case 'Rejected':
      return 'bg-red-100 text-red-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// File upload handler
const handleReportUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    selectedFileName.value = file.name
  } else {
    selectedFile.value = null
    selectedFileName.value = ''
  }
}

// Modal handlers
const openDetailsModal = (center) => {
  selectedCenter.value = center
  showDetailsModal.value = true

  // Pre-fill the review form with existing values if available
  reviewForm.value = {
    tc_renewal_review_name: center.tc_renewal_review_name || '',
    tc_review_summary: center.tc_review_summary || '',
    tc_report: null, // This will be handled by file upload
    tc_review_decision: center.tc_review_decision || 'Pending',
    tc_reason_if_rejected: center.tc_reason_if_rejected || '',
    tc_remarks: center.tc_remarks || '',
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
}

// Quick approve handler
const handleApprove = (center) => {
  selectedCenter.value = center
  showApproveModal.value = true
}

const cancelApprove = () => {
  showApproveModal.value = false
}

const confirmApprove = async () => {
  if (!selectedCenter.value) return

  try {
    isSubmitting.value = true

    // Prepare data for approval
    const approvalData = {
      tc_renewal_review_name: `Renewal Approval for ${selectedCenter.value.center_name}`,
      tc_review_summary: 'Application reviewed and approved.',
      tc_review_decision: 'Approved',
      is_active: true,
      is_payment_complete: true, // Assuming payment is complete when approving
    }

    // Send PATCH request to update center
    await apiServices.patchMhpcTeachingCenter(selectedCenter.value.id, approvalData)

    // Update local data
    teachingCenters.value = teachingCenters.value.map((center) => {
      if (center.id === selectedCenter.value.id) {
        return { ...center, ...approvalData }
      }
      return center
    })

    toast.success('Teaching center renewal approved successfully!')
  } catch (error) {
    console.error('Error approving teaching center renewal:', error)
    toast.error(error.response?.data?.message || 'Failed to approve renewal. Please try again.')
  } finally {
    isSubmitting.value = false
    showApproveModal.value = false
  }
}

// Quick reject handler
const handleReject = (center) => {
  selectedCenter.value = center
  rejectReason.value = ''
  showRejectModal.value = true
}

const cancelReject = () => {
  showRejectModal.value = false
}

const confirmReject = async () => {
  if (!selectedCenter.value || !rejectReason.value.trim()) return

  try {
    isSubmitting.value = true

    // Prepare data for rejection
    const rejectionData = {
      tc_renewal_review_name: `Renewal Rejection for ${selectedCenter.value.center_name}`,
      tc_review_summary: 'Application reviewed and rejected.',
      tc_review_decision: 'Rejected',
      tc_reason_if_rejected: rejectReason.value,
      is_active: false,
    }

    // Send PATCH request to update center
    await apiServices.patchMhpcTeachingCenter(selectedCenter.value.id, rejectionData)

    // Update local data
    teachingCenters.value = teachingCenters.value.map((center) => {
      if (center.id === selectedCenter.value.id) {
        return { ...center, ...rejectionData }
      }
      return center
    })

    toast.success('Teaching center renewal rejected.')
  } catch (error) {
    console.error('Error rejecting teaching center renewal:', error)
    toast.error(error.response?.data?.message || 'Failed to reject renewal. Please try again.')
  } finally {
    isSubmitting.value = false
    showRejectModal.value = false
  }
}

// Submit full review
const submitReview = async () => {
  if (!selectedCenter.value) return

  // Validate form based on decision
  if (
    reviewForm.value.tc_review_decision === 'Rejected' &&
    !reviewForm.value.tc_reason_if_rejected
  ) {
    toast.error('Reason for rejection is required')
    return
  }

  try {
    isSubmitting.value = true

    // Prepare FormData for submission with file upload
    const formData = new FormData()

    // Add review fields
    Object.keys(reviewForm.value).forEach((key) => {
      if (key !== 'tc_report' && reviewForm.value[key]) {
        // Skip file and empty values
        formData.append(key, reviewForm.value[key])
      }
    })

    // Set active status based on decision
    formData.append('is_active', reviewForm.value.tc_review_decision === 'Approved')

    // Set payment complete status based on decision
    formData.append('is_payment_complete', reviewForm.value.tc_review_decision === 'Approved')

    // Add file if selected
    if (selectedFile.value) {
      formData.append('tc_report', selectedFile.value)
    }

    // Send PATCH request to update teaching center
    await apiServices.patchMhpcTeachingCenter(selectedCenter.value.id, formData)

    // Update local data
    teachingCenters.value = teachingCenters.value.map((center) => {
      if (center.id === selectedCenter.value.id) {
        return {
          ...center,
          ...reviewForm.value,
          is_active: reviewForm.value.tc_review_decision === 'Approved',
          is_payment_complete: reviewForm.value.tc_review_decision === 'Approved',
        }
      }
      return center
    })

    toast.success(
      `Teaching center renewal ${reviewForm.value.tc_review_decision.toLowerCase()} successfully!`,
    )
    closeDetailsModal()
  } catch (error) {
    console.error('Error submitting review:', error)
    toast.error(error.response?.data?.message || 'Failed to submit review. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Fetch teaching centers data
const fetchTeachingCenters = async () => {
  isLoading.value = true
  apiError.value = false
  errorMessage.value = ''

  try {
    // Fetch teaching centers
    const response = await apiServices.getMhpcTeachingCenters()

    if (response && response.data && response.data.results) {
      teachingCenters.value = response.data.results
    } else {
      teachingCenters.value = []
    }
  } catch (error) {
    console.error('Error fetching teaching centers:', error)
    errorMessage.value = error.response?.data?.message || 'Error fetching data. Please try again.'
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

// Fetch data on component mount
onMounted(fetchTeachingCenters)
</script>
