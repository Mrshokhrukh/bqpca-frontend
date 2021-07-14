<template>
  <div class="mx-auto p-6">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Program Applications</h2>
      <p class="text-gray-600">Review and manage education program applications</p>
    </div>

    <!-- Loading / Error / No Data -->
    <div v-if="loading || loadingTeachingCenters" class="flex justify-center items-center py-8">
      <div
        class="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
      ></div>
      <span class="ml-3 text-gray-600">Loading...</span>
    </div>
    <div v-else-if="error" class="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-md">
      <p class="text-red-800">{{ error }}</p>
    </div>
    <div
      v-else-if="applications.length === 0"
      class="p-4 bg-gray-50 border-l-4 border-gray-400 rounded-r-md"
    >
      <p class="text-gray-800">No applications found.</p>
    </div>

    <!-- Applications Table -->
    <div v-else class="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table class="min-w-full border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">ID</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
              Institute
            </th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
              Program Name
            </th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
              Program Title
            </th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
              Teaching Center
            </th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
              Submission Date
            </th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50">
            <td class="py-3 px-4 border-b text-gray-800">{{ app.id }}</td>
            <td class="py-3 px-4 border-b text-gray-800">
              {{ app.institute_details?.name_of_institution || 'N/A' }}
            </td>
            <td class="py-3 px-4 border-b text-gray-800">
              {{ app.program_master?.program_name || 'N/A' }}
            </td>
            <td class="py-3 px-4 border-b text-gray-800">
              {{ app.specific_program_title || 'N/A' }}
            </td>
            <td class="py-3 px-4 border-b text-gray-800">
              {{ getTeachingCenterName(app.teaching_center) || 'N/A' }}
            </td>
            <td class="py-3 px-4 border-b">
              <span
                :class="{
                  'px-2 py-1 rounded-full text-xs font-medium': true,
                  'bg-blue-100 text-blue-800': app.status === 'Pending',
                  'bg-green-100 text-green-800': app.status === 'Approved',
                  'bg-red-100 text-red-800': app.status === 'Rejected',
                }"
              >
                {{ app.status || 'Unknown' }}
              </span>
            </td>
            <td class="py-3 px-4 border-b text-gray-800">{{ formatDate(app.created_at) }}</td>
            <td class="py-3 px-4 border-b text-gray-800 whitespace-nowrap">
              <button
                @click.stop="openViewModal(app)"
                class="text-blue-600 hover:text-blue-800 font-medium text-sm"
                title="View Application"
              >
                View
              </button>
              <!-- DELETE BUTTON ADDED HERE -->
              <button
                @click.stop="promptDelete(app)"
                class="ml-2 text-red-600 hover:text-red-800 font-medium text-sm"
                title="Delete Application"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- View Modal -->
    <EducationProgramDetailsModal
      v-if="isViewModalOpen && selectedApplication"
      :isVisible="isViewModalOpen"
      :application="selectedApplication"
      :teachingCenterName="
        selectedApplication ? getTeachingCenterName(selectedApplication.teaching_center) : 'N/A'
      "
      @close="closeViewModal"
      @approve="promptApprove"
      @reject="promptReject"
      @delete="promptDelete"
    />

    <!-- Confirm Dialog -->
    <ConfirmDialog
      v-if="isConfirmModalOpen && actionContext"
      :isVisible="isConfirmModalOpen"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirmButtonText="confirmDialog.confirmButtonText"
      :confirmButtonClass="confirmDialog.confirmButtonClass"
      :showRemarks="actionContext.type === 'approve' || actionContext.type === 'reject'"
      :remarks="actionContext.remarks"
      @update:remarks="val => actionContext.remarks = val"
      @confirm="executeAction"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import EducationProgramDetailsModal from '../modals/NewEducationProgramDetailsModal.vue'
import ConfirmDialog from '../modals/ConfirmDialog.vue'

const toast = useToast()
const applications = ref([])
const allTeachingCenters = ref([])
const loading = ref(true)
const loadingTeachingCenters = ref(true)
const error = ref(null)

// Modal states
const isViewModalOpen = ref(false)
const selectedApplication = ref(null)
const isConfirmModalOpen = ref(false)
const actionContext = ref(null) // { type: 'approve' | 'reject' | 'delete', application: object, remarks: string }
const confirmDialog = ref({
  title: '',
  message: '',
  confirmButtonText: '',
  confirmButtonClass: '',
})

// Fetch data
const fetchAllData = async () => {
  loading.value = true
  loadingTeachingCenters.value = true
  error.value = null
  try {
    await Promise.all([fetchTeachingCenters(), fetchApplications()])
  } catch (err) {
    console.error('Error fetching data:', err)
    error.value = 'Failed to fetch data.'
    toast.error(error.value)
  }
}

const fetchTeachingCenters = async () => {
  loadingTeachingCenters.value = true
  try {
    const response = await apiServices.getMhpcTeachingCenters()
    allTeachingCenters.value = response.data.results || response.data || []
  } catch (err) {
    console.error('Error fetching teaching centers:', err)
    toast.error('Failed to load teaching centers.')
  } finally {
    loadingTeachingCenters.value = false
  }
}

const fetchApplications = async () => {
  loading.value = true
  try {
    const response = await apiServices.getMhpcProgramsOffered()
    applications.value = (response.data.results || response.data || []).map((app) => {
      // console.log('Processing application:', app); // Keep for debugging if needed
      return {
        ...app,
        institute_details: app.institute || { name_of_institution: 'N/A' }, // Ensure institute_details exists
        curriculum_validation_letter: app.curriculum_validation_letter || null,
        curriculum_document: app.curriculum_document || null,
      }
    })
  } catch (err) {
    console.error('Error fetching applications:', err)
    error.value = 'Failed to load applications.'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// Helpers
const getTeachingCenterName = (tcId) => {
  if (!tcId || !allTeachingCenters.value.length) {
    return null
  }
  const center = allTeachingCenters.value.find((tc) => tc.id === tcId)
  if (center) {
    return `${center.center_name}${center.center_location ? ` - ${center.center_location}` : ''}`
  }
  return `ID: ${tcId}` // Fallback if center not found
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// View Modal
const openViewModal = (app) => {
  console.log('Opening modal with application:', app)
  selectedApplication.value = {
    // Create a deep enough copy for editing files
    ...app,
    // Ensure files are handled correctly if they are File objects vs strings
    curriculum_validation_letter: app.curriculum_validation_letter,
    curriculum_document: app.curriculum_document,
  }
  isViewModalOpen.value = true
}

const closeViewModal = () => {
  isViewModalOpen.value = false
  selectedApplication.value = null
}

// Confirm Actions
const promptDelete = (app) => {
  actionContext.value = {
    type: 'delete',
    application: { ...app }, // Pass a copy
    remarks: '', // Not used for delete but part of the structure
  }
  confirmDialog.value = {
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete application for '${app.specific_program_title || `ID: ${app.id}`}'? This cannot be undone.`,
    confirmButtonText: 'Delete',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700',
  }
  isConfirmModalOpen.value = true
}

const promptApprove = (appFromModal) => {
  // appFromModal might have updated files
  actionContext.value = {
    type: 'approve',
    application: { ...appFromModal },
    remarks: '',
  }
  confirmDialog.value = {
    title: 'Approve Application',
    message: `You are about to approve '${appFromModal.specific_program_title || `ID: ${appFromModal.id}`}'. Provide remarks (optional).`,
    confirmButtonText: 'Approve',
    confirmButtonClass: 'bg-green-600 hover:bg-green-700',
  }
  isConfirmModalOpen.value = true
}

const promptReject = (appFromModal) => {
  // appFromModal might have updated files
  actionContext.value = {
    type: 'reject',
    application: { ...appFromModal },
    remarks: '',
  }
  confirmDialog.value = {
    title: 'Reject Application',
    message: `You are about to reject '${appFromModal.specific_program_title || `ID: ${appFromModal.id}`}'. Provide remarks (required).`,
    confirmButtonText: 'Reject',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700',
  }
  isConfirmModalOpen.value = true
}

const closeConfirmModal = () => {
  isConfirmModalOpen.value = false
  actionContext.value = null
}

const executeAction = async () => {
  if (!actionContext.value) return
  const { type, application, remarks } = actionContext.value

  try {
    if (type === 'delete') {
      await apiServices.deleteMhpcProgramOffered(application.id)
      applications.value = applications.value.filter((app) => app.id !== application.id)
      toast.success(
        `Application '${application.specific_program_title || application.id}' deleted.`,
      )
    } else if (type === 'approve' || type === 'reject') {
      if (type === 'reject' && !remarks.trim()) {
        toast.error('Remarks are required for rejection.')
        // Do not close confirm modal on validation error
        isConfirmModalOpen.value = true // Keep it open
        return
      }

      const formData = new FormData()
      // Ensure IDs are present and valid
      if (!application.institute_details?.id) {
        toast.error('Institute ID is missing.')
        closeConfirmModal() // Close confirm modal on critical error
        return
      }
      formData.append('institute_id', application.institute_details.id)

      if (!application.program_master?.id) {
        toast.error('Program Master ID is missing.')
        closeConfirmModal()
        return
      }
      formData.append('program_master_id', application.program_master.id)

      formData.append('specific_program_title', application.specific_program_title || '')
      if (application.teaching_center) {
        // Ensure it's not null/undefined before appending
        formData.append('teaching_center', application.teaching_center)
      }

      // Handle file uploads: only append if it's a File object (newly uploaded)
      if (application.curriculum_validation_letter instanceof File) {
        formData.append('curriculum_validation_letter', application.curriculum_validation_letter)
      }
      if (application.curriculum_document instanceof File) {
        formData.append('curriculum_document', application.curriculum_document)
      }

      formData.append('terms', JSON.stringify(application.terms || [])) // Ensure terms is an array
      formData.append('is_payment_complete', application.is_payment_complete ? 'true' : 'false')
      if (application.payment_id) {
        // Ensure it's not null/undefined
        formData.append('payment_id', application.payment_id)
      }
      formData.append('status', type === 'approve' ? 'Approved' : 'Rejected')
      if (remarks && remarks.trim()) {
        // Only append if remarks are provided
        formData.append('status_remarks', remarks.trim())
      }

      // Log formData for debugging
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}: ${value instanceof File ? value.name : value}`);
      // }

      await apiServices.updateMhpcProgramOffered(application.id, formData)

      // Update local state
      const appIndex = applications.value.findIndex((app) => app.id === application.id)
      if (appIndex !== -1) {
        applications.value[appIndex].status = formData.get('status')
        applications.value[appIndex].status_remarks =
          formData.get('status_remarks') || applications.value[appIndex].status_remarks // Keep old if not updated
        // If files were uploaded, their string URLs won't be immediately available without a re-fetch
        // For now, status and remarks update is the most important for UI feedback
      }
      toast.success(
        `Application '${application.specific_program_title || application.id}' ${type === 'approve' ? 'approved' : 'rejected'}.`,
      )
      // Optionally re-fetch the specific application or all applications if file URLs need to be updated in the view
      // await fetchApplications(); // Or a more targeted fetch
    }
  } catch (err) {
    console.error(`Error executing ${type}:`, err)
    const errorData = err.response?.data
    let errorMessage = `Failed to ${type} application.`
    if (errorData && typeof errorData === 'object') {
      const fieldErrors = Object.entries(errorData)
        .map(([field, fieldErrorMessages]) => {
          const messages = Array.isArray(fieldErrorMessages)
            ? fieldErrorMessages.join(', ')
            : fieldErrorMessages
          return `${field}: ${messages}`
        })
        .join('; ')
      if (fieldErrors) errorMessage += ` Details: ${fieldErrors}`
    } else if (typeof errorData === 'string') {
      errorMessage += ` Server says: ${errorData}`
    }
    toast.error(errorMessage, { timeout: 7000 })
  } finally {
    // Only close confirm modal if not a validation error that keeps it open
    if (!(type === 'reject' && !remarks.trim())) {
      closeConfirmModal()
    }
    if (isViewModalOpen.value && selectedApplication.value?.id === application.id) {
      closeViewModal() // Close the details modal if it was for the acted-upon application
    }
  }
}

onMounted(() => {
  fetchAllData()
})
</script>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
td.whitespace-nowrap {
  white-space: nowrap;
}
</style>
