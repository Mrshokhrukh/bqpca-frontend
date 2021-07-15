<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Teaching Hospital Renewal Applications</h1>
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
                Hospital Name
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
                <div class="text-sm text-gray-900">
                  {{ center.institute_details.name_of_institution }}
                </div>
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
      <p class="text-gray-600">No teaching hospital renewal applications found.</p>
    </div>

    <!-- Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-start mb-6">
          <h3 class="text-xl font-bold text-gray-900">Teaching Hospital Details</h3>
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
          <!-- Center & Institute Info (No Changes) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Hospital Information</h4>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-1 gap-3">
                  <div>
                    <p class="text-xs text-gray-500">Hospital Name</p>
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
                      {{ selectedCenter.institute_details.name_of_institution }}
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
          <!-- Attachments & Remarks (No Changes) -->
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Application Documents & Remarks</h4>
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
                      ><svg
                        class="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        ></path></svg
                      >View Document</a
                    >
                    <p v-else class="text-gray-500 italic">No attachments provided</p>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Applicant Remarks</p>
                  <p class="text-sm text-gray-800 mt-1">
                    {{ selectedCenter.remarks || 'No remarks provided' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Review Form (only for pending applications) - MODIFIED -->
          <div v-if="selectedCenter.tc_review_decision === 'Pending'">
            <div class="p-4 bg-gray-50 rounded-lg space-y-4">
              <h4 class="text-lg font-semibold text-gray-800 mb-2">Review Form</h4>
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
                  >Report Upload (Optional)</label
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
                <label for="reviewRemarks" class="block text-sm font-medium text-gray-700"
                  >Reviewer Remarks</label
                >
                <textarea
                  id="reviewRemarks"
                  v-model="reviewForm.tc_remarks"
                  rows="2"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              <!-- Rejection Reason Text Area - MODIFIED to be always visible for clarity -->
              <div>
                <label for="rejectionReason" class="block text-sm font-medium text-gray-700"
                  >Reason for Rejection (Required if rejecting)</label
                >
                <textarea
                  id="rejectionReason"
                  v-model="reviewForm.tc_reason_if_rejected"
                  rows="2"
                  placeholder="Enter reason here if you are rejecting the application..."
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              <!-- NEW: Action Buttons instead of dropdown -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  @click="closeDetailsModal"
                  class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  :disabled="isSubmitting"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="submitRejection"
                  class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Submitting...' : 'Reject Application' }}
                </button>
                <button
                  type="button"
                  @click="submitApproval"
                  class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Submitting...' : 'Approve Application' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Previous Review (No Changes) -->
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
                      ><svg
                        class="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        ></path></svg
                      >View Report</a
                    >
                    <p v-else class="text-gray-500 italic">No report provided</p>
                  </div>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Decision</p>
                  <p class="text-sm font-medium">
                    <span
                      class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusClass(selectedCenter.tc_review_decision)"
                      >{{ selectedCenter.tc_review_decision }}</span
                    >
                  </p>
                </div>
                <div v-if="selectedCenter.tc_review_decision === 'Rejected'">
                  <p class="text-xs text-gray-500">Rejection Reason</p>
                  <p class="text-sm text-gray-800">
                    {{ selectedCenter.tc_reason_if_rejected || 'N/A' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Reviewer Remarks</p>
                  <p class="text-sm text-gray-800">{{ selectedCenter.tc_remarks || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve/Reject Modals (No Changes) -->
    <div
      v-if="showApproveModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Approval</h3>
        <p class="mb-6 text-gray-600">
          Are you sure you want to approve the renewal application for
          <span class="font-semibold">{{ selectedCenter?.center_name }}</span
          >? This will extend the validity by one year.
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="cancelApprove"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="isSubmitting"
          >
            Cancel</button
          ><button
            @click="confirmApprove"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Approving...' : 'Confirm Approval' }}
          </button>
        </div>
      </div>
    </div>
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
          <label for="rejectReason" class="block text-sm font-medium text-gray-700 mb-1"
            >Reason for Rejection (Required)</label
          ><textarea
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
            :disabled="isSubmitting"
          >
            Cancel</button
          ><button
            @click="confirmReject"
            :disabled="!rejectReason.trim() || isSubmitting"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Rejecting...' : 'Confirm Rejection' }}
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

// --- State Management (No Changes) ---
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

const reviewForm = ref({
  tc_renewal_review_name: '',
  tc_review_summary: '',
  tc_report: null,
  tc_review_decision: 'Pending',
  tc_reason_if_rejected: '',
  tc_remarks: '',
})

const toast = useToast()

// --- Computed Properties & Utility Functions (No Changes) ---
const pendingApplications = computed(() =>
  teachingCenters.value.filter((center) => center.tc_review_decision === 'Pending'),
)
const approvedApplications = computed(() =>
  teachingCenters.value.filter((center) => center.tc_review_decision === 'Approved'),
)
const rejectedApplications = computed(() =>
  teachingCenters.value.filter((center) => center.tc_review_decision === 'Rejected'),
)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (e) {
    console.error('Invalid date format:', dateString, e)
    return 'Invalid Date'
  }
}

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

// --- Event Handlers (MODIFIED) ---

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

const openDetailsModal = (center) => {
  selectedCenter.value = center
  reviewForm.value = {
    tc_renewal_review_name: center.tc_renewal_review_name || `Review for ${center.center_name}`,
    tc_review_summary: center.tc_review_summary || '',
    tc_report: null,
    tc_review_decision: 'Pending', // Always start as pending
    tc_reason_if_rejected: center.tc_reason_if_rejected || '',
    tc_remarks: center.tc_remarks || '',
  }
  selectedFile.value = null
  selectedFileName.value = ''
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedCenter.value = null
}

const handleApprove = (center) => {
  selectedCenter.value = center
  showApproveModal.value = true
}
const cancelApprove = () => {
  showApproveModal.value = false
}

const handleReject = (center) => {
  selectedCenter.value = center
  rejectReason.value = ''
  showRejectModal.value = true
}
const cancelReject = () => {
  showRejectModal.value = false
}

// --- API Calls (MODIFIED) ---

const confirmApprove = async () => {
  if (!selectedCenter.value) return
  isSubmitting.value = true
  try {
    const approvalData = {
      tc_review_decision: 'Approved',
      tc_renewal_review_name: `Renewal Approval for ${selectedCenter.value.center_name}`,
      tc_review_summary: 'Application reviewed and approved via quick action.',
    }
    await apiServices.patchMhpcTeachingCenter(selectedCenter.value.id, approvalData)
    await fetchTeachingCenters()
    toast.success('Teaching hospital renewal approved successfully!')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to approve renewal.')
  } finally {
    isSubmitting.value = false
    showApproveModal.value = false
  }
}

const confirmReject = async () => {
  if (!selectedCenter.value || !rejectReason.value.trim()) {
    toast.error('Reason for rejection is required.')
    return
  }
  isSubmitting.value = true
  try {
    const rejectionData = {
      tc_review_decision: 'Rejected',
      tc_reason_if_rejected: rejectReason.value,
      tc_renewal_review_name: `Renewal Rejection for ${selectedCenter.value.center_name}`,
      tc_review_summary: 'Application reviewed and rejected.',
    }
    await apiServices.patchMhpcTeachingCenter(selectedCenter.value.id, rejectionData)
    await fetchTeachingCenters()
    toast.success('Teaching hospital renewal rejected.')
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to reject renewal.')
  } finally {
    isSubmitting.value = false
    showRejectModal.value = false
  }
}

// NEW: Function to handle the detailed review submission
const _submitReviewDecision = async (decision) => {
  if (!selectedCenter.value) return

  // Set the final decision in the form data
  reviewForm.value.tc_review_decision = decision

  // Validate rejection reason
  if (decision === 'Rejected' && !reviewForm.value.tc_reason_if_rejected.trim()) {
    toast.error('Reason for rejection is required to reject the application.')
    return
  }
  // Clear rejection reason if accidentally approving with text in the box
  if (decision === 'Approved') {
    reviewForm.value.tc_reason_if_rejected = ''
  }

  isSubmitting.value = true
  try {
    const formData = new FormData()
    Object.keys(reviewForm.value).forEach((key) => {
      if (key !== 'tc_report' && reviewForm.value[key] !== null) {
        formData.append(key, reviewForm.value[key])
      }
    })
    if (selectedFile.value) {
      formData.append('tc_report', selectedFile.value)
    }

    await apiServices.patchMhpcTeachingCenter(selectedCenter.value.id, formData)
    await fetchTeachingCenters()
    toast.success(`Application has been successfully ${decision.toLowerCase()}!`)
    closeDetailsModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to submit review.')
  } finally {
    isSubmitting.value = false
  }
}

// NEW: Specific handlers for the modal buttons
const submitApproval = () => {
  _submitReviewDecision('Approved')
}

const submitRejection = () => {
  _submitReviewDecision('Rejected')
}

const fetchTeachingCenters = async () => {
  isLoading.value = true
  apiError.value = false
  try {
    const response = await apiServices.getMhpcTeachingCenters()
    teachingCenters.value = response.data?.results || []
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error fetching data. Please try again.'
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchTeachingCenters)
</script>
