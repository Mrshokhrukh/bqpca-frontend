<!-- Example Filename:EpcCpdApplicationList.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <!-- Inline Notification -->
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
          <!-- Icons for notification types -->
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

    <!-- Header Card -->
    <div class="m mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">EPC CPD Applications</h1>
        <!-- Updated Title -->
        <div class="flex mt-4 space-x-6">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-gray-600">Total: {{ applications.length }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span class="text-gray-600">Pending: {{ pendingCount }}</span>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search by name, CID or registration number..."
          />
        </div>
        <select
          v-model="statusFilter"
          class="w-full md:w-64 block pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading applications...</span>
      </div>

      <!-- Empty State -->
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
              ? 'No applications match your current filters.'
              : 'No EPC CPD applications have been submitted for review.'
          }}
        </p>
      </div>

      <!-- Applications Table -->
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
                  CPD Title
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
                  Date
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
                  <div class="text-sm font-medium text-gray-900">{{ app.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ app.applicantName }}</div>
                  <div class="text-xs text-gray-500">{{ app.cidNumber }}</div>
                  <div class="text-xs text-gray-500">Reg: {{ app.registrationNumber }}</div>
                  <!-- Added Reg No -->
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ app.title }}</div>
                  <div class="text-xs text-gray-500">{{ app.activityType }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      getStatusColor(app.status),
                      'px-2 py-1 text-xs font-medium rounded-full',
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
                    class="text-blue-600 hover:text-blue-900 font-medium text-sm"
                  >
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
          <div class="flex-1 flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to
                <span class="font-medium">{{ paginationEnd }}</span> of
                <span class="font-medium">{{ filteredApplications.length }}</span> results
              </p>
            </div>
            <div class="flex">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                :class="[
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
                ]"
              >
                <svg
                  class="h-5 w-5 mr-2"
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
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                :class="[
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
                  'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
                ]"
              >
                Next
                <svg
                  class="h-5 w-5 ml-2"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Modal -->
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
import CpdViewApplicationsModal from '../modals/CpdViewApplicationsModal.vue' // Verify path
import apiServices from '@/services/services' // Assuming this imports your API service functions

const applications = ref([])
const selectedApplication = ref(null)
const isViewModalOpen = ref(false)
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('All')
const currentPage = ref(1)
const pageSize = ref(10) // Adjust page size as needed

// Notification state
const notification = ref({
  show: false,
  type: 'info', // 'success', 'error', 'info'
  title: '',
  message: '',
  timeout: null,
})

// Calculate pending applications count
const pendingCount = computed(() => {
  // Ensure status comparison is accurate
  return applications.value.filter((app) => getTaskStatus(app) === 'Pending').length
})

// Filter applications based on search query and status filter
const filteredApplications = computed(() => {
  let filtered = applications.value

  // Apply status filter first
  if (statusFilter.value !== 'All') {
    filtered = filtered.filter((app) => getTaskStatus(app) === statusFilter.value)
  } else {
    // Exclude 'Draft' status when 'All' is selected unless explicitly chosen
    filtered = filtered.filter((app) => getTaskStatus(app) !== 'Draft')
  }

  // Apply search filter if there's a search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (app) =>
        (app.applicantName && app.applicantName.toLowerCase().includes(query)) ||
        (app.cidNumber && app.cidNumber.toString().includes(query)) ||
        (app.title && app.title.toLowerCase().includes(query)) ||
        (app.registrationNumber && app.registrationNumber.toString().toLowerCase().includes(query)), // Include registration number in search
    )
  }

  return filtered
})

// --- Pagination Logic ---
const totalPages = computed(() => {
  return Math.ceil(filteredApplications.value.length / pageSize.value) || 1
})

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

const paginationEnd = computed(() => {
  // Correctly calculate the end index
  const end = paginationStart.value + pageSize.value
  return Math.min(end, filteredApplications.value.length)
})

const paginatedApplications = computed(() => {
  // Slice the filtered applications based on calculated start and end
  return filteredApplications.value.slice(paginationStart.value, paginationEnd.value)
})

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

// Reset pagination to page 1 when filters change
const resetPagination = () => {
  currentPage.value = 1
}

// Watch for changes in filters to reset pagination
watch([searchQuery, statusFilter], () => {
  resetPagination()
})
// --- End Pagination Logic ---

// --- Notification Logic ---
const showNotification = (type, title, message, duration = 5000) => {
  if (notification.value.timeout) clearTimeout(notification.value.timeout) // Clear existing timeout

  notification.value = { show: true, type, title, message, timeout: null } // Set new notification

  if (duration > 0) {
    // Auto-close if duration is set
    notification.value.timeout = setTimeout(closeNotification, duration)
  }
}

const closeNotification = () => {
  notification.value.show = false
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
    notification.value.timeout = null
  }
}
// --- End Notification Logic ---

// --- UI Helpers ---
const getStatusColor = (status) => {
  return (
    {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Draft: 'bg-gray-100 text-gray-800',
    }[status] || 'bg-gray-100 text-gray-800' // Default fallback
  )
}

const openViewModal = (app) => {
  selectedApplication.value = { ...app } // Use a copy to prevent direct modification
  isViewModalOpen.value = true
}

const closeViewModal = () => {
  isViewModalOpen.value = false
  selectedApplication.value = null
}
// --- End UI Helpers ---

// --- CRUD Operations ---

// Note: 'saveApplication' currently only patches 'credit'. Adjust if more fields need saving.
const saveApplication = async (updatedApp) => {
  // This function seems specific to saving just the 'credit' field from the modal.
  // If the modal allows saving other fields, expand the patchData object accordingly.
  if (!updatedApp || !updatedApp.id) {
    showNotification('error', 'Save Failed', 'Invalid application data provided.')
    return
  }

  try {
    loading.value = true // Show loading indicator during save

    const patchData = {
      // Map the field from the modal (updatedApp.cpdCredits) to the backend field name ('credit')
      credit: updatedApp.cpdCredits,
      // Add any other fields from updatedApp that should be saved via PATCH
      // e.g., remarks: updatedApp.remarks
    }

    // Use the EPC PATCH endpoint
    await apiServices.patchEpcCpdTask(updatedApp.id, patchData)

    showNotification('success', 'Application Updated', 'Changes saved successfully.')

    // Refresh the list to show updated data
    await fetchApplications()
    closeViewModal() // Close modal on successful save
  } catch (err) {
    console.error('Failed to save application:', err.response ? err.response.data : err)
    showNotification(
      'error',
      'Save Failed',
      `Error saving changes: ${err.response?.data?.detail || err.message || 'Please try again.'}`,
    )
  } finally {
    loading.value = false // Hide loading indicator
  }
}

const approveApplication = async (applicationData) => {
  if (!applicationData || !applicationData.id) {
    showNotification('error', 'Approval Failed', 'Invalid application data provided.')
    return
  }
  try {
    loading.value = true
    console.log('Approving application data:', applicationData)

    const updatedApplication = { ...applicationData } // Work with a copy
    let patchData = {
      review_status: 'Approved', // Set the main status
      // Include remarks if they were provided in the modal
      review_remarks: updatedApplication.remarks || '',
    }

    // Handle participants update if applicable and needed
    if (
      updatedApplication.participants &&
      Array.isArray(updatedApplication.participants) &&
      updatedApplication.participants.length > 0
    ) {
      const participantsToUpdate = updatedApplication.participants
        .filter(
          (p) => p && typeof p === 'object' && p.review_status && p.review_status !== 'Pending',
        ) // Find participants changed in modal
        .map((p) => ({
          id: p.id,
          review_status: p.review_status, // Use the status set in the modal (e.g., 'Approved')
          review_remarks: p.review_remarks || '',
          // Ensure correct field name for credits from your Participant Serializer
          cpd_credits: p.cpd_credits || 0, // Adjust field name if necessary
          // cpd_credits_for_participant: p.cpd_credits_for_participant || 0 // Example alternative
        }))

      if (participantsToUpdate.length > 0) {
        patchData.participants = participantsToUpdate // Add to payload if changes exist
      }
    }

    // Use the EPC PATCH endpoint
    await apiServices.patchEpcCpdTask(updatedApplication.id, patchData)

    showNotification(
      'success',
      'Application Approved',
      'The CPD application has been approved successfully.',
    )
    closeViewModal()
    await fetchApplications() // Refresh the list
  } catch (err) {
    console.error('Failed to approve application:', err.response ? err.response.data : err)
    showNotification(
      'error',
      'Approval Failed',
      `Error approving application: ${err.response?.data?.detail || err.message || 'Please try again.'}`,
    )
  } finally {
    loading.value = false
  }
}

const rejectApplication = async (rejectionData) => {
  if (!rejectionData || !rejectionData.id) {
    showNotification('error', 'Rejection Failed', 'Invalid application data provided.')
    return
  }
  try {
    loading.value = true
    console.log('Rejecting application data:', rejectionData)

    const updatedApplication = { ...rejectionData } // Work with a copy
    let patchData = {
      review_status: 'Rejected', // Set the main status
      // Ensure rejection remarks are included
      review_remarks: updatedApplication.remarks || 'Rejected due to review.',
    }

    // Handle participants update if applicable (e.g., reject all participants)
    if (
      updatedApplication.participants &&
      Array.isArray(updatedApplication.participants) &&
      updatedApplication.participants.length > 0
    ) {
      // Option: Mark all participants as Rejected when the main task is rejected
      const participantsToUpdate = updatedApplication.participants
        .filter((p) => p && typeof p === 'object') // Ensure valid participants
        .map((p) => ({
          id: p.id,
          review_status: 'Rejected', // Set participant status
          review_remarks: updatedApplication.remarks || 'Rejected with main application.', // Apply main remarks
          // Set credits to 0 on rejection
          cpd_credits: 0, // Adjust field name if necessary
          // cpd_credits_for_participant: 0 // Example alternative
        }))

      if (participantsToUpdate.length > 0) {
        patchData.participants = participantsToUpdate
      }
    }

    // Use the EPC  PATCH endpoint
    await apiServices.patchEpcCpdTask(updatedApplication.id, patchData)

    showNotification('success', 'Application Rejected', 'The CPD application has been rejected.')
    closeViewModal()
    await fetchApplications() // Refresh the list
  } catch (err) {
    console.error('Failed to reject application:', err.response ? err.response.data : err)
    showNotification(
      'error',
      'Rejection Failed',
      `Error rejecting application: ${err.response?.data?.detail || err.message || 'Please try again.'}`,
    )
  } finally {
    loading.value = false
  }
}

// Function to fetch applications
const fetchApplications = async () => {
  try {
    loading.value = true

    const response = await apiServices.getEpcCpdTasks() // Assumed function name for LIST

    // Robustly handle potential API response structures
    let results = []
    if (response?.data?.results && Array.isArray(response.data.results)) {
      results = response.data.results // Standard DRF pagination
    } else if (response?.data && Array.isArray(response.data)) {
      results = response.data // Direct array response
    } else if (response?.results && Array.isArray(response.results)) {
      results = response.results // Less common structure
    } else {
      console.warn('Unexpected API response structure:', response)
    }

    processApiResponse(results) // Process the extracted data
  } catch (err) {
    console.error('Failed to fetch applications:', err.response ? err.response.data : err)
    showNotification('error', 'Load Failed', 'There was an error loading the CPD applications.')
    applications.value = [] // Clear data on error
  } finally {
    loading.value = false
  }
}

// Function to process API response data into the format needed by the template
const processApiResponse = (results) => {
  if (!Array.isArray(results)) {
    console.error('processApiResponse received non-array data:', results)
    applications.value = []
    return
  }
  applications.value = results.map((item) => ({
    // --- Core Task Info ---
    id: item.id,
    title: item.title_of_cpd || 'N/A',
    status: getTaskStatus(item), // Use helper for status logic
    date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A', // Format date safely
    isDraft: item.is_draft || false,

    // --- Applicant Info (Assuming from related EnggApplication or directly on Task) ---
    applicantName: item.full_name || 'Unknown', // Check if this comes directly or needs lookup
    cidNumber: item.cid_no || 'N/A', // Check if this comes directly or needs lookup
    // Handle registration_no potentially being an object {id: x, registration_no: '...'} or just a string
    registrationNumber:
      typeof item.registration_no === 'object'
        ? item.registration_no?.registration_no
        : item.registration_no || 'N/A',
    fullName: item.full_name || 'Unknown', // Redundant? Same as applicantName?
    gender: item.gender || 'Not specified', // Needs to come from related Application

    // --- CPD Specific Details (Directly from EnggCPDTask model/serializer) ---
    cpdTitle: item.title_of_cpd || 'N/A', // Redundant? Same as title?
    venue: item.venue || '',
    fromDate: item.from_date ? new Date(item.from_date).toLocaleDateString() : 'N/A',
    toDate: item.to_date ? new Date(item.to_date).toLocaleDateString() : 'N/A',
    activityType: getActivityType(item), // Use helper based on 'type_of_cpd' field
    expected_outcome: item.expected_outcome || '',
    cpdCredits: item.credit || 0, // Main credit field on the task
    relevance: item.relevance_to_topic || item.reason_for_details || 'Not specified', // Check serializer output

    // --- Review Info ---
    reviewStatus: item.review_status || 'Pending', // Main review status
    // Combine remark fields if necessary, check serializer output
    remarks: item.review_remarks || item.remark || '',

    // --- Attachments (Assuming URL strings) ---
    attachment: item.attachment
      ? { name: item.attachment.split('/').pop(), url: item.attachment }
      : null,
    // Add other attachments if needed (e.g., course_document, attendance_sheet_attachment)

    // --- Timestamps ---
    createdAt: item.created_at, // Store raw value if needed
    updatedAt: item.updated_at, // Store raw value if needed

    // --- Participants (Map if included in Task List Serializer) ---
    // Ensure participants data structure matches your Participant Serializer output
    participants: Array.isArray(item.participants)
      ? item.participants.map((p) => ({
          id: p.id,
          participant_reg_no: p.participant_reg_no, // Adjust based on serializer
          participant_name: p.participant_name || 'N/A', // If name is included
          review_status: p.review_status || 'Pending',
          review_remarks: p.review_remarks || '',
          // Use the specific credit field for participants
          cpd_credits: p.cpd_credits || 0, // Adjust field name if needed (e.g., cpd_credits_for_participant)
        }))
      : [],

    // --- Placeholders for fields NOT typically on EnggCPDTask (check your serializer) ---
    // These likely come from related models like EnggCPDRecord if nested
    participationCategory: getParticipationCategory(item), // Update helper based on actual data
    participantSubCategory: getParticipantSubcategory(item), // Update helper based on actual data
  }))
}

// --- Helper functions for processing API data ---
// Determines the display status based on draft flag and review status
const getTaskStatus = (item) => {
  if (item.is_draft) return 'Draft'
  return item.review_status || 'Pending' // Default to Pending if null/undefined
}

// *** IMPORTANT: Adjust these helpers based on your ACTUAL EnggCPDTask Serializer output ***
// These helpers assume certain nested structures or field names. Verify them.

const getParticipationCategory = (item) => {
  // This field is likely on a related model (EnggCPDRecord?), not EnggCPDTask directly.
  // Check how your serializer includes this data (if at all).
  // Example if nested: return item.related_record?.participation_category?.name || 'N/A';

  // --- MODIFICATION START: Address unused 'item' warning ---
  // Log the item to satisfy the linter/type checker that 'item' is used.
  // Replace this whole function with actual logic based on your serializer.
  if (!item) {
    // Basic check to use 'item'
    console.warn('getParticipationCategory called with invalid item')
  }
  // console.log("Processing item for Participation Category:", item.id); // Example usage
  // --- MODIFICATION END ---

  return 'N/A' // Placeholder - Requires knowledge of your serializer
}

const getParticipantSubcategory = (item) => {
  // Similar to Participation Category - check your serializer output.
  // Example if nested: return item.related_record?.participant_sub_category?.name || 'N/A';

  // --- MODIFICATION START: Address unused 'item' warning ---
  // Log the item to satisfy the linter/type checker that 'item' is used.
  // Replace this whole function with actual logic based on your serializer.
  if (!item) {
    // Basic check to use 'item'
    console.warn('getParticipantSubcategory called with invalid item')
  }
  // console.log("Processing item for Participant SubCategory:", item.id); // Example usage
  // --- MODIFICATION END ---

  return 'N/A' // Placeholder - Requires knowledge of your serializer
}

const getActivityType = (item) => {
  // Accesses the 'type_of_cpd' field, expecting an object with 'cpd_activity_name'
  // This corresponds to the EnggCPDActivityAlt model.
  if (
    item?.type_of_cpd &&
    typeof item.type_of_cpd === 'object' &&
    item.type_of_cpd.cpd_activity_name
  ) {
    return item.type_of_cpd.cpd_activity_name
  }
  // Fallback if it's just an ID or missing
  return item?.type_of_cpd || 'Not specified' // Add optional chaining for safety
}
// --- End Helper Functions ---

// Fetch initial data when the component mounts
onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
/* Simple fade/slide transition for notifications */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.4s ease;
}
.notification-enter-from {
  opacity: 0;
  transform: translateX(100%); /* Slide in from right */
}
.notification-leave-to {
  opacity: 0;
  transform: translateY(-20px); /* Slide up slightly on exit */
}

/* Ensure table layout handles overflow */
.table-fixed {
  table-layout: fixed;
}
</style>
