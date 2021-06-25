<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <Transition name="notification">
      <div v-if="notification.show" :class="[
        'fixed right-4 top-4 p-4 rounded-md shadow-lg flex items-center z-50 max-w-md',
        notification.type === 'success'
          ? 'bg-green-50 border-l-4 border-green-500'
          : notification.type === 'error'
            ? 'bg-red-50 border-l-4 border-red-500'
            : 'bg-blue-50 border-l-4 border-blue-500',
      ]">
        <div :class="[
          'flex-shrink-0 w-6 h-6',
          notification.type === 'success'
            ? 'text-green-500'
            : notification.type === 'error'
              ? 'text-red-500'
              : 'text-blue-500',
        ]">
          <svg v-if="notification.type === 'success'" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="notification.type === 'error'" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 :class="[
            'text-sm font-medium',
            notification.type === 'success'
              ? 'text-green-800'
              : notification.type === 'error'
                ? 'text-red-800'
                : 'text-blue-800',
          ]">
            {{ notification.title }}
          </h3>
          <p :class="[
            'text-sm mt-1',
            notification.type === 'success'
              ? 'text-green-700'
              : notification.type === 'error'
                ? 'text-red-700'
                : 'text-blue-700',
          ]">
            {{ notification.message }}
          </p>
        </div>
        <button @click="closeNotification" class="ml-auto pl-3 text-gray-500 hover:text-gray-600">
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>

    <div class="mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">EPC CPD Applications</h1>
        <div class="flex mt-4 space-x-6">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-gray-600">Total (Non-Draft): {{filteredApplications.filter(app => app.status !==
              'Draft').length }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span class="text-gray-600">Pending: {{ pendingCount }}</span>
          </div>
        </div>
      </div>

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
            placeholder="Search by name, CID or registration number..." />
        </div>
        <select v-model="statusFilter"
          class="w-full md:w-64 block pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option value="All">All (Exclude Drafts)</option>
          <option value="AllIncludeDrafts">All (Include Drafts)</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading applications...</span>
      </div>

      <div v-else-if="paginatedApplications.length === 0"
        class="bg-white shadow-sm rounded-lg py-16 text-center border border-gray-200">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

      <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPD Title
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="app in paginatedApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ app.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ app.applicantName }}</div>
                  <div class="text-xs text-gray-500">CID: {{ app.cidNumber }}</div>
                  <div class="text-xs text-gray-500">Reg: {{ app.registrationNumber }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ app.title }}</div>
                  <div class="text-xs text-gray-500">{{ app.activityType }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    getStatusColor(app.status),
                    'px-2 py-1 text-xs font-semibold rounded-full',
                  ]">
                    {{ app.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ app.date }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button @click="openViewModal(app)" class="text-blue-600 hover:text-blue-900 font-medium text-sm">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredApplications.length > pageSize"
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to
                <span class="font-medium">{{ paginationEnd }}</span> of
                <span class="font-medium">{{ filteredApplications.length }}</span> results
              </p>
            </div>
            <div class="flex">
              <button @click="prevPage" :disabled="currentPage === 1" :class="[
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
                'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
              ]">
                <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages" :class="[
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
                'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
              ]">
                Next
                <svg class="h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CpdViewApplicationsModal v-if="isViewModalOpen" :application="selectedApplicationForModal" @save="saveApplication"
      @approve="approveApplication" @reject="rejectApplication" @updateParticipant="updateParticipant"
      @close="closeViewModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
// Ensure this path is correct for your project structure
import CpdViewApplicationsModal from '../modals/CpdViewApplicationsModal.vue'
// Ensure this path is correct and 'services' is properly configured
import apiServices from '@/services/services'

const applications = ref([])
const selectedApplication = ref(null)
const isViewModalOpen = ref(false)
const loading = ref(true)
const searchQuery = ref('')
// Default to 'All' (which excludes drafts by default in filteredApplications)
const statusFilter = ref('All')
const currentPage = ref(1)
const pageSize = ref(10)

// Notification state
const notification = ref({
  show: false,
  type: 'info', // 'success', 'error', 'info'
  title: '',
  message: '',
  timeout: null,
})

// Transform application data for modal
const selectedApplicationForModal = computed(() => {
  if (!selectedApplication.value) return null

  // Transform the data to match what the modal expects
  return {
    // Raw API data (using actual model field names)
    id: selectedApplication.value.id,
    registration_no: selectedApplication.value.registrationNumber,
    cid_no: selectedApplication.value.cidNumber,
    full_name: selectedApplication.value.applicantName,
    title_of_cpd: selectedApplication.value.title,  // ✅ Fixed: map to title_of_cpd
    expected_outcome: selectedApplication.value.description,  // ✅ Fixed: map to expected_outcome
    from_date: selectedApplication.value.startDate,  // ✅ Fixed: map to from_date
    to_date: selectedApplication.value.endDate,  // ✅ Fixed: map to to_date
    venue: selectedApplication.value.location,  // ✅ Fixed: map to venue
    credit: selectedApplication.value.expectedCpdCredits,  // ✅ Fixed: map to credit
    duration_in_hours: selectedApplication.value.durationInHours,
    number_of_participants: selectedApplication.value.numberOfParticipants,
    relevance_to_topic: selectedApplication.value.relevanceToTopic,

    // Attachments
    course_document: selectedApplication.value.courseDocument?.url,
    document_supporting_expertise: selectedApplication.value.supportingDocument?.url,
    attendance_sheet_attachment: selectedApplication.value.attendanceSheetAttachment?.url,

    // Status fields
    status: selectedApplication.value.isDraft === false,
    is_cpd_approved: selectedApplication.value.isCpdApproved,
    is_draft: selectedApplication.value.isDraft,

    // Participants array
    participants: selectedApplication.value.participants || [],

    // Additional fields
    type_of_cpd: selectedApplication.value.typeOfCpdId,
    proposed_training_location: selectedApplication.value.proposedTrainingLocation,
    cpd_providing_agency: selectedApplication.value.cpdProvidingAgency,
    if_others_specify: selectedApplication.value.ifOthersSpecify,
    reason_for_conducting: selectedApplication.value.reasonForConducting,
    reason_for_details: selectedApplication.value.reasonForDetails,
    learning_methods: selectedApplication.value.learningMethods,
    resources: selectedApplication.value.resources,
    methodologies: selectedApplication.value.methodologies,
    created_at: selectedApplication.value.createdAt,
    updated_at: selectedApplication.value.updatedAt,
  }
})

// Determines the display status based on is_draft and is_cpd_approved
const getTaskStatus = (item) => {
  if (item.is_draft === true) {
    return 'Draft'
  }
  // If not a draft, check approval status
  if (item.is_cpd_approved === true) {
    return 'Approved'
  }
  if (item.is_cpd_approved === false) {
    return 'Rejected'
  }
  // If is_cpd_approved is null or undefined (and not a draft), it's Pending
  return 'Pending'
}

// Calculate pending applications count based on the derived status
const pendingCount = computed(() => {
  return applications.value.filter((app) => getTaskStatus(app) === 'Pending').length
})

// Filter applications based on search query and status filter
const filteredApplications = computed(() => {
  let filtered = [...applications.value] // Create a shallow copy to avoid modifying the original

  // Apply search filter first
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (app) =>
        (app.applicantName && app.applicantName.toLowerCase().includes(query)) ||
        (app.cidNumber && app.cidNumber.toString().toLowerCase().includes(query)) ||
        (app.title && app.title.toLowerCase().includes(query)) ||
        (app.registrationNumber && app.registrationNumber.toString().toLowerCase().includes(query))
    )
  }

  // Apply status filter
  if (statusFilter.value === 'All') {
    // 'All' excludes drafts by default
    filtered = filtered.filter((app) => getTaskStatus(app) !== 'Draft')
  } else if (statusFilter.value === 'AllIncludeDrafts') {
    // 'AllIncludeDrafts' shows everything
    // No additional filtering needed here as we started with all applications
  } else {
    // Specific status filter (Pending, Approved, Rejected, Draft)
    filtered = filtered.filter((app) => getTaskStatus(app) === statusFilter.value)
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
  const end = paginationStart.value + pageSize.value
  return Math.min(end, filteredApplications.value.length)
})

const paginatedApplications = computed(() => {
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

// Reset pagination to page 1 when filters or search query change
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})
// --- End Pagination Logic ---

// --- Notification Logic ---
const showNotification = (type, title, message, duration = 5000) => {
  if (notification.value.timeout) clearTimeout(notification.value.timeout)
  notification.value = { show: true, type, title, message, timeout: null }
  if (duration > 0) {
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
  const colors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Draft: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const openViewModal = (app) => {
  selectedApplication.value = { ...app } // Create a copy to avoid direct modification
  isViewModalOpen.value = true
}

const closeViewModal = () => {
  isViewModalOpen.value = false
  selectedApplication.value = null
}
// --- End UI Helpers ---

// --- CRUD Operations ---

// NEW: Handle participant updates
const updateParticipant = async (participantData) => {
  if (!participantData || !participantData.id) {
    showNotification('error', 'Update Failed', 'Invalid participant data.')
    return
  }

  try {
    loading.value = true

    // Call the participant-specific API endpoint
    const patchData = {
      cpd_credits: participantData.cpd_credits,
      review_status: participantData.review_status,
      review_remarks: participantData.review_remarks || 'Updated via review'
    }

    await apiServices.patchEpcCpdTaskParticipant(participantData.id, patchData)

    showNotification('success', 'Participant Updated', 'Participant information updated successfully.')

    // Refresh the applications list to get updated data
    await fetchApplications()

  } catch (err) {
    console.error('Failed to update participant:', err.response ? err.response.data : err)
    showNotification(
      'error',
      'Update Failed',
      `Error updating participant: ${err.response?.data?.detail || err.message || 'Please try again.'}`
    )
  } finally {
    loading.value = false
  }
}

// Updated saveApplication to handle credit field
const saveApplication = async (updatedApplicationData) => {
  if (!updatedApplicationData || !updatedApplicationData.id) {
    showNotification('error', 'Save Failed', 'Invalid application data for saving.')
    return
  }
  try {
    loading.value = true
    const patchData = {
      credit: updatedApplicationData.credit || updatedApplicationData.cpdCredits,  // ✅ Fixed: use credit
      review_remarks: updatedApplicationData.remarks,
    }
    await apiServices.patchEpcCpdTask(updatedApplicationData.id, patchData)
    showNotification('success', 'Application Updated', 'Changes saved successfully.')
    await fetchApplications() // Refresh list
    closeViewModal()
  } catch (err) {
    console.error('Failed to save application:', err.response ? err.response.data : err)
    showNotification(
      'error',
      'Save Failed',
      `Error saving changes: ${err.response?.data?.detail || err.message || 'Please try again.'}`
    )
  } finally {
    loading.value = false
  }
}

const approveApplication = async (applicationDataFromModal) => {
  if (!applicationDataFromModal || !applicationDataFromModal.id) {
    showNotification('error', 'Approval Failed', 'Invalid application data for approval.')
    return
  }
  try {
    loading.value = true
    const patchData = {
      is_cpd_approved: true,
      is_draft: false,
      review_status: 'Approved',
      review_remarks: applicationDataFromModal.remarks || 'Application approved',
      credit: applicationDataFromModal.credit || applicationDataFromModal.cpdCredits,  // ✅ Fixed: use credit
    }

    await apiServices.patchEpcCpdTask(applicationDataFromModal.id, patchData)
    showNotification('success', 'Application Approved', 'The CPD application has been approved.')
    await fetchApplications()
    closeViewModal()
  } catch (err) {
    console.error('Failed to approve application:', err.response ? err.response.data : err)
    showNotification(
      'error',
      'Approval Failed',
      `Error approving application: ${err.response?.data?.detail || err.message || 'Please try again.'}`
    )
  } finally {
    loading.value = false
  }
}

const rejectApplication = async (applicationDataFromModal) => {
  if (!applicationDataFromModal || !applicationDataFromModal.id) {
    showNotification('error', 'Rejection Failed', 'Invalid application data for rejection.')
    return
  }
  try {
    loading.value = true
    const patchData = {
      is_cpd_approved: false,
      is_draft: false,
      review_status: 'Rejected',
      review_remarks: applicationDataFromModal.remarks || 'Application rejected',
      credit: 0,
    }

    await apiServices.patchEpcCpdTask(applicationDataFromModal.id, patchData)
    showNotification('success', 'Application Rejected', 'The CPD application has been rejected.')
    await fetchApplications()
    closeViewModal()
  } catch (err) {
    console.error('Failed to reject application:', err.response ? err.response.data : err)
    showNotification(
      'error',
      'Rejection Failed',
      `Error rejecting application: ${err.response?.data?.detail || err.message || 'Please try again.'}`
    )
  } finally {
    loading.value = false
  }
}

// Function to fetch applications
const fetchApplications = async () => {
  try {
    loading.value = true
    const response = await apiServices.getEpcCpdTasks()

    // 🔍 DEBUG: Log the first application to see actual field names (remove after testing)
    if (response?.data?.results?.[0]) {
      console.log('🔍 First application from API:', response.data.results[0])
      console.log('🔍 Available fields:', Object.keys(response.data.results[0]))
    }

    let rawResults = []
    if (response?.data?.results && Array.isArray(response.data.results)) {
      rawResults = response.data.results
    } else if (response?.data && Array.isArray(response.data)) {
      rawResults = response.data
    } else if (response && Array.isArray(response)) {
      rawResults = response
    } else {
      console.warn('Unexpected API response structure for applications:', response)
    }
    processApiResponse(rawResults)
  } catch (err) {
    console.error('Failed to fetch applications:', err.response ? err.response.data : err)
    showNotification('error', 'Load Failed', 'Error loading CPD applications. Please try again.')
    applications.value = []
  } finally {
    loading.value = false
  }
}

// Helper to safely format date or return N/A
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return 'Invalid Date';
  }
}

// Maps API ID for 'type_of_cpd' to a human-readable name.
const cpdActivityTypeMap = {
  1: 'Workshop',
  2: 'Seminar',
  3: 'Online Course',
  4: 'Conference',
};

const getActivityType = (item) => {
  if (item && item.type_of_cpd !== undefined && item.type_of_cpd !== null) {
    return cpdActivityTypeMap[item.type_of_cpd] || `Unknown Type (ID: ${item.type_of_cpd})`;
  }
  return 'Not specified';
}

// ✅ FIXED: Function to process API response data into the format needed by the template
const processApiResponse = (rawResults) => {
  if (!Array.isArray(rawResults)) {
    console.error('processApiResponse received non-array data:', rawResults)
    applications.value = []
    return
  }

  applications.value = rawResults.map((item) => ({
    // --- Core Task Info ---
    id: item.id,
    title: item.title_of_cpd || 'N/A',  // ✅ Fixed: use title_of_cpd
    status: getTaskStatus(item),
    date: formatDate(item.created_at),
    isDraft: item.is_draft,
    isCpdApproved: item.is_cpd_approved,

    // --- Applicant Info ---
    applicantName: item.full_name || 'Unknown',
    cidNumber: item.cid_no || 'N/A',
    registrationNumber: item.registration_no || 'N/A',

    // --- CPD Specific Details ---
    description: item.expected_outcome || '',  // ✅ Fixed: use expected_outcome
    startDate: item.from_date,  // ✅ Fixed: use from_date
    endDate: item.to_date,  // ✅ Fixed: use to_date
    location: item.venue || '',  // ✅ Fixed: use venue
    venue: item.venue || '',
    expectedCpdCredits: item.credit || 0,  // ✅ Fixed: use credit
    cpdCredits: item.credit || 0,
    activityType: getActivityType(item),
    typeOfCpdId: item.type_of_cpd,

    proposedTrainingLocation: item.proposed_training_location || '',
    cpdProvidingAgency: item.cpd_providing_agency,
    ifOthersSpecify: item.if_others_specify || '',
    reasonForConducting: item.reason_for_conducting,
    reasonForDetails: item.reason_for_details || '',
    expected_outcome: item.expected_outcome || '',
    durationInHours: item.duration_in_hours || 0,
    numberOfParticipants: item.number_of_participants || 0,
    relevanceToTopic: item.relevance_to_topic || '',

    // --- Review Info ---
    reviewStatusApi: item.review_status || 'Pending',
    remarks: item.review_remarks || '',

    // --- Attachments ---
    attachment: item.attachment ? {
      name: item.attachment.split('/').pop(),
      url: item.attachment
    } : null,
    courseDocument: item.course_document ? {
      name: item.course_document.split('/').pop(),
      url: item.course_document
    } : null,
    supportingDocument: item.document_supporting_expertise ? {
      name: item.document_supporting_expertise.split('/').pop(),
      url: item.document_supporting_expertise
    } : null,
    attendanceSheetAttachment: item.attendance_sheet_attachment ? {
      name: item.attendance_sheet_attendance.split('/').pop(),
      url: item.attendance_sheet_attachment
    } : null,

    // --- Timestamps ---
    createdAt: item.created_at,
    updatedAt: item.updated_at,

    // --- Arrays from API ---
    learningMethods: item.learning_methods || [],
    resources: item.resources || [],
    methodologies: item.methodologies || [],

    // --- Participants ---
    participants: Array.isArray(item.participants)
      ? item.participants.map((p) => ({
        id: p.id,
        cpd_task_id: p.cpd_task_id,
        participant_reg_no: p.participant_reg_no || 'N/A',
        review_status: p.review_status || 'Pending',
        review_remarks: p.review_remarks || '',
        cpd_credits: p.cpd_credits !== null ? p.cpd_credits : 0,
        endorsement_decision: p.endorsement_decision || 'Pending',
        endorsement_remarks: p.endorsement_remarks || '',
      }))
      : [],
  }))
}

// Fetch initial data when the component mounts
onMounted(() => {
  fetchApplications();
});
</script>

<style scoped>
/* Simple fade/slide transition for notifications */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.4s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
  /* Slide in from right */
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  /* Slide up slightly on exit */
}
</style>