<template>
  <div class="mx-auto p-4 sm:p-6 lg:p-8">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-800">Program Applications</h2>
      <p class="mt-1 text-base text-gray-500">Review and manage education program applications.</p>
    </div>

    <div v-if="loading || loadingTeachingCenters" class="flex justify-center items-center py-12">
      <div
        class="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
      ></div>
      <span class="ml-4 text-lg text-gray-500">Loading Applications...</span>
    </div>
    <div v-else-if="error" class="p-5 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-md">
      <h3 class="font-bold text-red-800">An Error Occurred</h3>
      <p class="text-red-700 mt-1">{{ error }}</p>
    </div>
    <div
      v-else-if="applications.length === 0"
      class="text-center py-16 px-6 bg-white rounded-xl shadow-md"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 class="mt-4 text-lg font-semibold text-gray-800">No Applications Found</h3>
      <p class="mt-1 text-sm text-gray-500">
        There are currently no program applications to display.
      </p>
    </div>

    <div v-else class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow-lg border-b border-gray-200 sm:rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Institute
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Program
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Training Center
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Submission Date
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="app in applications"
                  :key="app.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ app.institute_details?.name_of_institution || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-500">ID: {{ app.id }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ app.program_master?.program_name || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-500 truncate" :title="app.specific_program_title">
                      {{ app.specific_program_title || 'N/A' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {{ getTeachingCenterName(app.teaching_center) || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-blue-100 text-blue-800': app.status === 'Pending',
                        'bg-green-100 text-green-800': app.status === 'AWAITING_PAYMENT',
                        'bg-red-100 text-red-800': app.status === 'REJECTED',
                        'bg-gray-100 text-gray-800': ![
                          'Pending',
                          'AWAITING_PAYMENT',
                          'REJECTED',
                        ].includes(app.status),
                      }"
                    >
                      {{ app.status || 'Unknown' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(app.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click.stop="openViewModal(app)"
                      class="text-blue-600 hover:text-blue-900"
                      title="View Application"
                    >
                      View
                    </button>
                    <button
                      @click.stop="promptDelete(app)"
                      class="ml-4 text-red-600 hover:text-red-900"
                      title="Delete Application"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

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

    <ConfirmDialog
      v-if="isConfirmModalOpen && actionContext"
      :isVisible="isConfirmModalOpen"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirmButtonText="confirmDialog.confirmButtonText"
      :confirmButtonClass="confirmDialog.confirmButtonClass"
      :showRemarks="actionContext.type === 'approve' || actionContext.type === 'reject'"
      :remarks="actionContext.remarks"
      @update:remarks="(val) => (actionContext.remarks = val)"
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

const isViewModalOpen = ref(false)
const selectedApplication = ref(null)
const isConfirmModalOpen = ref(false)
const actionContext = ref(null)
const confirmDialog = ref({
  title: '',
  message: '',
  confirmButtonText: '',
  confirmButtonClass: '',
})

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
      return {
        ...app,
        institute_details: app.institute || { name_of_institution: 'N/A' },
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

const getTeachingCenterName = (centerData) => {

  if (!centerData) {
    return null;
  }


  if (typeof centerData === 'object' && centerData !== null && centerData.center_name) {

    return `${centerData.center_name}${centerData.center_location ? ` - ${centerData.center_location}` : ''}`;
  }

  
  if (typeof centerData === 'number' || typeof centerData === 'string') {
    if (!allTeachingCenters.value.length) {
      return `Loading... (ID: ${centerData})`;
    }
    const center = allTeachingCenters.value.find(tc => String(tc.id) === String(centerData));
    if (center) {
      return `${center.center_name}${center.center_location ? ` - ${center.center_location}` : ''}`;
    }
    return `Unknown Center (ID: ${centerData})`;
  }

  // 4. Fallback for any other weird data
  return 'Invalid Center Data';
};
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

const openViewModal = (app) => {
  console.log('Opening modal with application:', app)
  selectedApplication.value = {
    ...app,
    curriculum_validation_letter: app.curriculum_validation_letter,
    curriculum_document: app.curriculum_document,
  }
  isViewModalOpen.value = true
}

const closeViewModal = () => {
  isViewModalOpen.value = false
  selectedApplication.value = null
}

const promptDelete = (app) => {
  actionContext.value = {
    type: 'delete',
    application: { ...app },
    remarks: '',
  }
  confirmDialog.value = {
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete application for '${
      app.specific_program_title || `ID: ${app.id}`
    }'? This cannot be undone.`,
    confirmButtonText: 'Delete',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700',
  }
  isConfirmModalOpen.value = true
}

const promptApprove = (appFromModal) => {
  actionContext.value = {
    type: 'approve',
    application: { ...appFromModal },
    remarks: '',
  }
  confirmDialog.value = {
    title: 'Approve Application',
    message: `You are about to approve '${
      appFromModal.specific_program_title || `ID: ${appFromModal.id}`
    }'. Provide remarks (optional).`,
    confirmButtonText: 'Approve',
    confirmButtonClass: 'bg-green-600 hover:bg-green-700',
  }
  isConfirmModalOpen.value = true
}

const promptReject = (appFromModal) => {
  actionContext.value = {
    type: 'reject',
    application: { ...appFromModal },
    remarks: '',
  }
  confirmDialog.value = {
    title: 'Reject Application',
    message: `You are about to reject '${
      appFromModal.specific_program_title || `ID: ${appFromModal.id}`
    }'. Provide remarks (required).`,
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
        `Application '${application.specific_program_title || application.id}' deleted.`
      )
    } else if (type === 'approve' || type === 'reject') {
      if (type === 'reject' && !remarks.trim()) {
        toast.error('Remarks are required for rejection.')
        isConfirmModalOpen.value = true
        return
      }

      const formData = new FormData()
      if (!application.institute_details?.id) {
        toast.error('Institute ID is missing.')
        closeConfirmModal()
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
        formData.append('teaching_center', application.teaching_center)
      }

      if (application.curriculum_validation_letter instanceof File) {
        formData.append('curriculum_validation_letter', application.curriculum_validation_letter)
      }
      if (application.curriculum_document instanceof File) {
        formData.append('curriculum_document', application.curriculum_document)
      }

      formData.append('terms', JSON.stringify(application.terms || []))
      formData.append('is_payment_complete', application.is_payment_complete ? 'true' : 'false')
      if (application.payment_id) {
        formData.append('payment_id', application.payment_id)
      }
      formData.append('status', type === 'approve' ? 'AWAITING_PAYMENT' : 'REJECTED')
      if (remarks && remarks.trim()) {
        formData.append('status_remarks', remarks.trim())
      }

      await apiServices.updateMhpcProgramOffered(application.id, formData)

      const appIndex = applications.value.findIndex((app) => app.id === application.id)
      if (appIndex !== -1) {
        applications.value[appIndex].status = formData.get('status')
        applications.value[appIndex].status_remarks =
          formData.get('status_remarks') || applications.value[appIndex].status_remarks
      }
      toast.success(
        `Application '${application.specific_program_title || application.id}' ${
          type === 'approve' ? 'approved' : 'rejected'
        }.`
      )
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
    if (!(type === 'reject' && !remarks.trim())) {
      closeConfirmModal()
    }
    if (isViewModalOpen.value && selectedApplication.value?.id === application.id) {
      closeViewModal()
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