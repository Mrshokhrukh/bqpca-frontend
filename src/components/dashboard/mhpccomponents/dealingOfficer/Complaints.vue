<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-4 md:p-6 min-h-screen bg-slate-50">
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
      Dealing Officer Complaint Dashboard
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold text-gray-700">Total Complaints Received</h2>
        <p class="text-3xl font-bold text-blue-600">{{ totalComplaints }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold text-gray-700">Pending Review</h2>
        <p class="text-3xl font-bold text-yellow-500">{{ pendingReviewCount }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold text-gray-700">Total Adverse Records (Active/Pending)</h2>
        <p class="text-3xl font-bold text-red-500">{{ activeAdverseRecordsCount }}</p>
      </div>
    </div>

    <div class="mb-4 bg-white p-4 rounded-lg shadow">
      <label for="statusFilter" class="block text-sm font-medium text-gray-700 mb-1"
        >Filter by Status:</label
      >
      <select
        id="statusFilter"
        v-model="statusFilter"
        class="w-full md:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Statuses</option>
        <option
          v-for="statusObj in complaintStatuses"
          :key="statusObj.id || statusObj"
          :value="statusObj.name || statusObj"
        >
          {{ statusObj.name || statusObj }}
        </option>
      </select>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Complaint ID
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Subject
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Complainant
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date Received
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
              Personnel Involved
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading && !allComplaints.length">
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">Loading complaints...</td>
          </tr>
          <tr v-else-if="fetchError">
            <td colspan="7" class="px-6 py-4 text-center text-red-500">
              Error loading complaints: {{ fetchError }}
            </td>
          </tr>
          <tr v-else-if="!filteredComplaints.length">
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">
              No complaints found matching your criteria.
            </td>
          </tr>
          <tr v-for="complaint in filteredComplaints" :key="complaint.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ complaint.complaint_id }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate"
              :title="complaint.grievance_details"
            >
              {{ complaint.grievance_details }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ complaint.submitted_by_name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ formatDate(complaint.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getStatusClass(complaint.status)"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ complaint.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ complaint.professional_name || 'None' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="openManageModal(complaint)"
                class="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors duration-150"
              >
                View / Manage
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ComplaintManageModal
      :is-open="isModalOpen"
      :complaint="selectedComplaint"
      :complaint-statuses="complaintStatuses"
      @close="closeModal"
      @updated="handleComplaintUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ComplaintManageModal from './modals/ComplaintsModal.vue'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

const toast = useToast()
const allComplaints = ref([])
const complaintStatuses = ref([])
const loading = ref(true)
const fetchError = ref(null)
const statusFilter = ref('')
const selectedComplaint = ref(null)
const isModalOpen = ref(false)
const modalDetailError = ref(null)

const fetchComplaintStatuses = async () => {
  try {
    const response = await apiServices.getComplaintMasterStatuses()
    if (response.data && Array.isArray(response.data.results)) {
      complaintStatuses.value = response.data.results
    } else if (Array.isArray(response.data)) {
      complaintStatuses.value = response.data
    } else {
      console.warn('Complaint statuses not in expected array format:', response.data)
      complaintStatuses.value = []
    }
  } catch (err) {
    console.error('Failed to fetch complaint statuses:', err)
    complaintStatuses.value = []
  }
}

const fetchComplaints = async () => {
  loading.value = true
  fetchError.value = null
  try {
    const response = await apiServices.getComplaints()
    if (response.data && Array.isArray(response.data.results)) {
      allComplaints.value = response.data.results
    } else if (Array.isArray(response.data)) {
      allComplaints.value = response.data
    } else {
      console.warn(
        "Unexpected data structure for complaints. Expected an array or an object with a 'results' array.",
        response.data,
      )
      allComplaints.value = []
    }
  } catch (err) {
    console.error('Failed to fetch complaints:', err)
    fetchError.value = err.message || 'An unknown error occurred while fetching complaints.'
    allComplaints.value = []
  } finally {
    loading.value = false
  }
}

const fetchComplaintDetails = async (complaintId) => {
  try {
    const response = await apiServices.getComplaintDetails(complaintId)
    return response.data
  } catch (err) {
    console.error(`Failed to fetch complaint details for ID ${complaintId}:`, err)
    modalDetailError.value = err.message || 'Failed to load complaint details for the modal.'
    return null
  }
}

onMounted(async () => {
  loading.value = true
  fetchError.value = null
  await Promise.all([fetchComplaintStatuses(), fetchComplaints()])
})

const filteredComplaints = computed(() => {
  if (!Array.isArray(allComplaints.value)) {
    return []
  }
  if (!statusFilter.value) {
    return allComplaints.value
  }
  return allComplaints.value.filter((c) => c.status === statusFilter.value)
})

const totalComplaints = computed(() => {
  return Array.isArray(allComplaints.value) ? allComplaints.value.length : 0
})

const pendingReviewCount = computed(() => {
  if (!Array.isArray(allComplaints.value)) return 0
  const pendingStatuses = ['Pending Review', 'Submitted']
  return allComplaints.value.filter((c) => pendingStatuses.includes(c.status)).length
})

const activeAdverseRecordsCount = computed(() => {
  if (!Array.isArray(allComplaints.value)) return 0
  const nonAdverseStatuses = ['Dismissed', 'Resolved - No Action', 'Closed', 'Resolved']
  return allComplaints.value.filter((c) => !nonAdverseStatuses.includes(c.status)).length
})

const openManageModal = async (complaint) => {
  modalDetailError.value = null
  selectedComplaint.value = null // Clear previous selection

  if (!complaint || typeof complaint.id === 'undefined') {
    console.error('Invalid complaint object passed to openManageModal:', complaint)
    modalDetailError.value = 'Cannot open modal due to invalid complaint data.'
    return
  }

  isModalOpen.value = true // Open modal structure immediately
  const detailedComplaint = await fetchComplaintDetails(complaint.id) // Fetch details, ID should be the primary key
  if (detailedComplaint) {
    selectedComplaint.value = detailedComplaint
  } else {
    // Error is set by fetchComplaintDetails, could close modal or show error within
    // For now, we allow the modal to stay open and show its internal loading/error state.
    // If modalDetailError.value is set, the modal should display it.
    // We could also close the modal here if details fail to load:
    // if (!selectedComplaint.value) isModalOpen.value = false;
  }
}

const closeModal = () => {
  isModalOpen.value = false
  selectedComplaint.value = null
  modalDetailError.value = null
}

const handleComplaintUpdated = async (updatedComplaintData) => {
  if (!updatedComplaintData || typeof updatedComplaintData.id === 'undefined') {
    console.error('Invalid data received for complaint update:', updatedComplaintData)
    toast.error('Failed to update complaint: Invalid data.') // Or a more sophisticated notification
    return
  }
  try {
    await apiServices.updateComplaint(updatedComplaintData.id, updatedComplaintData)
    await fetchComplaints()
    closeModal()
  } catch (err) {
    console.error('Failed to update complaint:', err)
    toast.error(`Failed to update complaint: ${err.message || 'Unknown error'}`)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string for formatDate:', dateString)
    return 'Invalid Date'
  }
  try {
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch (e) {
    console.warn('Error formatting date:', dateString, e)
    return 'Date Error'
  }
}

const getStatusClass = (status) => {
  const statusMap = {
    Received: 'bg-blue-100 text-blue-800',
    Submitted: 'bg-blue-100 text-blue-800',
    'Pending Review': 'bg-yellow-100 text-yellow-800',
    'Under Investigation': 'bg-orange-100 text-orange-800',
    'Additional Info Requested': 'bg-cyan-100 text-cyan-800',
    'Resolved with Action': 'bg-green-100 text-green-800',
    'Resolved - No Action': 'bg-gray-200 text-gray-800',
    Resolved: 'bg-green-100 text-green-800',
    Dismissed: 'bg-red-100 text-red-800',
    Rejected: 'bg-red-200 text-red-800',
    Appealed: 'bg-purple-100 text-purple-800',
    Closed: 'bg-gray-300 text-gray-700',
    'Action Taken': 'bg-teal-100 text-teal-800',
  }
  return statusMap[status] || 'bg-gray-100 text-gray-800'
}
</script>

<style scoped>
.max-w-xs {
  max-width: 20rem;
}
</style>
