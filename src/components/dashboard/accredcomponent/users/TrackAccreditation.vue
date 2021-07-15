<template>
  <div class="p-6 font-sans">
    <h1 class="text-2xl font-bold mb-6">Track Accreditation Applications</h1>

    <div class="mb-6 flex gap-4">
      <!-- ... search and filter inputs are unchanged ... -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by Application ID or Institute..."
        class="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/3"
      />

      <select
        v-model="selectedStatus"
        class="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Statuses</option>
        <option v-for="status in uniqueStatuses" :key="status" :value="status">{{ status }}</option>
      </select>
    </div>

    <!-- ... loading and error states are unchanged ... -->
    <div v-if="loading" class="text-center py-10">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading applications...</p>
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
      <p>Error loading applications: {{ error }}</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
        <!-- ... table head is unchanged ... -->
        <thead>
          <tr class="bg-gray-100">
            <th class="py-3 px-4 text-left border-b">Application ID</th>
            <th class="py-3 px-4 text-left border-b">Institute Name</th>
            <th class="py-3 px-4 text-left border-b">Submission Date</th>
            <th class="py-3 px-4 text-left border-b">Status</th>
            <th class="py-3 px-4 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- ... empty state is unchanged ... -->
          <tr v-if="filteredApplications.length === 0">
            <td colspan="5" class="py-4 px-4 text-center border-b">No applications found.</td>
          </tr>
          <tr
            v-for="application in filteredApplications"
            :key="application.id"
            class="hover:bg-gray-50"
          >
            <td class="py-3 px-4 border-b">
              {{
                application.application_uid ? application.application_uid.substring(0, 8) : 'N/A'
              }}
            </td>
            <td class="py-3 px-4 border-b">{{ application.institute_profile_details.name }}</td>
            <td class="py-3 px-4 border-b">
              {{
                formatDate(application.date_initial_app_submitted_to_heqc || application.created_at)
              }}
            </td>
            <td class="py-3 px-4 border-b">
              <span :class="getStatusClass(application.status)">
                {{ application.status_display || 'N/A' }}
              </span>
            </td>
            <td class="py-3 px-4 border-b">
              <button
                @click="viewApplication(application)"
                class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm mr-2"
              >
                View Details
              </button>

              <!-- CHANGE: This button now opens the ISAR modal -->
              <button
                v-if="canSubmitIsar(application.status)"
                @click="openIsarModal(application)"
                class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
              >
                Submit ISAR
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <ApplicationDetailsModal
      :is-open="isModalOpen"
      :application="selectedApplication"
      @close="closeModal"
    />

    <!-- CHANGE: Add the new ISAR Modal here -->
    <IsarReportModal
      :is-open="isIsarModalOpen"
      :application="selectedApplicationForIsar"
      @close="closeIsarModal"
      @submit-isar="handleIsarSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/services'
import ApplicationDetailsModal from './ApplicationDetailsModal.vue'
import IsarReportModal from './IsarReportModal.vue' // <-- CHANGE: Import the new modal

const applications = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const selectedStatus = ref('')
const router = useRouter()

// State for Details Modal
const isModalOpen = ref(false)
const selectedApplication = ref(null)

// CHANGE: Add state for the new ISAR Modal
const isIsarModalOpen = ref(false)
const selectedApplicationForIsar = ref(null)

const fetchApplications = async () => {
  // ... this function is unchanged ...
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getAccreditationApplications()
    applications.value = response.data.results || response.data || []
  } catch (err) {
    console.error('Error fetching accreditation applications:', err)
    error.value = 'Failed to load applications.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchApplications)

// ... computed properties (uniqueStatuses, filteredApplications) are unchanged ...
const uniqueStatuses = computed(() => {
  const statuses = new Set(applications.value.map((app) => app.status_display))
  return Array.from(statuses)
})

const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    const matchesSearch =
      (app.application_uid &&
        app.application_uid.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (app.institute_profile_details.name &&
        app.institute_profile_details.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesStatus = selectedStatus.value ? app.status_display === selectedStatus.value : true
    return matchesSearch && matchesStatus
  })
})

// ... helper functions (formatDate, getStatusClass, canSubmitIsar) are unchanged ...
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
const getStatusClass = (statusKey) => {
  const mapping = {
    draft_initial: 'bg-gray-200 text-gray-800',
    pending_payment: 'bg-yellow-100 text-yellow-800',
    initial_app_submitted_heqc_review: 'bg-blue-100 text-blue-800',
    initial_app_rejected: 'bg-red-100 text-red-800',
    initial_app_approved_awaiting_isar: 'bg-green-100 text-green-800',
    isar_submitted_heqc_review: 'bg-indigo-100 text-indigo-800',
    approved_accredited: 'bg-green-200 text-green-900 font-bold',
    rejected_not_accredited: 'bg-red-200 text-red-900 font-bold',
  }
  return `inline-block py-1 px-2 rounded text-xs font-medium ${mapping[statusKey] || 'bg-gray-100 text-gray-800'}`
}
const canSubmitIsar = (status) => {
  const validStatuses = ['initial_app_submitted_heqc_review', 'initial_app_approved_awaiting_isar']
  return validStatuses.includes(status)
}

// Functions for Details Modal
const viewApplication = (application) => {
  selectedApplication.value = application
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
  selectedApplication.value = null
}

// CHANGE: Add functions to control the ISAR Modal
const openIsarModal = (application) => {
  selectedApplicationForIsar.value = application
  isIsarModalOpen.value = true
}

const closeIsarModal = () => {
  isIsarModalOpen.value = false
  selectedApplicationForIsar.value = null
}

const handleIsarSubmit = async (formData) => {
  // You'll need to create a new method in your apiService for this
  // For example: apiService.createIsarReport(formData)
  console.log('Submitting ISAR data:', Object.fromEntries(formData))
  try {
    // IMPORTANT: Ensure your apiService sends this with 'Content-Type': 'multipart/form-data'
    await apiService.createIsarReport(formData) // Assumes this new method exists
    alert('ISAR submitted successfully!')
    closeIsarModal()
    fetchApplications() // Refresh the list to show new status
  } catch (err) {
    console.error('Error submitting ISAR:', err)
    alert('Failed to submit ISAR. Please check the console for errors.')
  }
}
</script>

<style scoped>
/* Scoped styles for the component */
</style>
