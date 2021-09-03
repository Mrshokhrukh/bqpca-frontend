<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Training Center Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total Pending/Reviewed: {{ loading ? 'Loading...' : teachingCenters.length }}
        </span>
      </div>
    </div>

    <div
      v-if="alert.show"
      :class="`mb-4 p-4 rounded-md ${
        alert.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      }`"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            v-if="alert.type === 'success'"
            class="h-5 w-5 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">{{ alert.message }}</p>
        </div>
        <div class="ml-auto pl-3">
          <button
            @click="alert.show = false"
            class="inline-flex rounded-md p-1.5"
            :class="
              alert.type === 'success'
                ? 'text-green-500 hover:bg-green-100 focus:ring-2 focus:ring-green-500'
                : 'text-red-500 hover:bg-red-100 focus:ring-2 focus:ring-red-500'
            "
          >
            <span class="sr-only">Dismiss</span>
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div
      v-else-if="!loading && teachingCenters.length === 0"
      class="bg-white p-8 text-center text-gray-500 rounded-xl shadow-sm border border-gray-100"
    >
      <p>No new teaching center applications found.</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="table-th">Institute</th>
              <th scope="col" class="table-th">Center Name</th>
              <th scope="col" class="table-th">Location (Center)</th>
              <th scope="col" class="table-th">Verification Status</th>
              <th scope="col" class="table-th">Applied On</th>
              <th scope="col" class="table-th">Review Status</th>
              <th scope="col" class="table-th">Payment Status</th>
              <th scope="col" class="table-th">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="center in teachingCenters"
              :key="center.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="table-td">{{ center.institute_details?.name_of_institution || 'N/A' }}</td>
              <td class="table-td font-medium text-gray-900">{{ center.center_name || 'N/A' }}</td>
              <td class="table-td">
                {{ center.center_location || 'N/A'
                }}{{ center.state_dzongkhag ? `, ${center.state_dzongkhag}` : '' }}
              </td>
              <td class="table-td">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getVerificationStatusClass(center.physical_verification_status)"
                >
                  {{ center.physical_verification_status_display || 'Pending' }}
                </span>
              </td>
              <td class="table-td">
                {{ center.created_at ? new Date(center.created_at).toLocaleDateString() : 'N/A' }}
              </td>
              <td class="table-td">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getReviewStatusClass(center.tc_review_decision)"
                >
                  {{ formatReviewStatusText(center.tc_review_decision) }}
                </span>
              </td>
              <td class="table-td">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getPaymentStatusClass(center.payment_status)"
                >
                  {{ formatPaymentStatusText(center.payment_status) }}
                </span>
              </td>
              <td class="table-td">
                <button
                  @click="openApplicationModal(center)"
                  class="text-indigo-600 hover:text-indigo-900 font-medium py-1 px-3 rounded-md hover:bg-indigo-50 transition-colors duration-150"
                >
                  View/Process
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <TeachingHospitalsDetailsModal
      :is-open="isModalOpen"
      :hospital-details="selectedApplication"
      @close-modal="closeApplicationModal"
      @approve="triggerApprove"
      @reject="triggerReject"
      @submit-verification="triggerSubmitVerification"
    />

    <div v-if="confirmModal.show" class="fixed z-30 inset-0 overflow-y-auto">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="confirmModal.show = false"
          aria-hidden="true"
        ></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                :class="{
                  'bg-green-100': confirmModal.action === 'approve',
                  'bg-blue-100': confirmModal.action === 'submit-verification',
                  'bg-red-100': confirmModal.action === 'reject',
                }"
              >
                <svg
                  v-if="confirmModal.action === 'approve'"
                  class="h-6 w-6 text-green-600"
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
                  v-else-if="confirmModal.action === 'submit-verification'"
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <svg
                  v-else
                  class="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ confirmModal.title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">{{ confirmModal.message }}</p>
                  <div
                    v-if="
                      confirmModal.action === 'reject' &&
                      !confirmModal.payload?.tc_reason_if_rejected
                    "
                    class="mt-4"
                  >
                    <label
                      for="rejectionReasonConfirm"
                      class="block text-sm font-medium text-gray-700"
                      >Rejection Reason (Required)</label
                    >
                    <textarea
                      id="rejectionReasonConfirm"
                      v-model="rejectionReasonInput"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Provide a clear reason for rejection..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="confirmAction"
              :disabled="
                loading || (confirmModal.action === 'reject' && !rejectionReasonInput.trim())
              "
              :class="`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                confirmModal.action === 'approve'
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300'
                  : confirmModal.action === 'submit-verification'
                  ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300'
              }`"
            >
              <span v-if="loading && confirmModal.show">Processing...</span>
              <span v-else>{{ confirmModal.buttonText || 'Confirm' }}</span>
            </button>
            <button
              type="button"
              @click="confirmModal.show = false"
              :disabled="loading"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TeachingHospitalsDetailsModal from '../modals/TeachingHospitalsDetailsModal.vue'
import apiServices from '@/services/services.js'

const teachingCenters = ref([])
const isModalOpen = ref(false)
const selectedApplication = ref({})
const loading = ref(false)

const alert = ref({ show: false, type: 'success', message: '' })
const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  action: '',
  centerId: null,
  payload: null,
  buttonText: 'Confirm',
})
const rejectionReasonInput = ref('')

onMounted(async () => {
  await fetchTeachingCenters()
})

const fetchTeachingCenters = async () => {
  loading.value = true
  teachingCenters.value = []
  try {
    const response = await apiServices.getMhpcTeachingCenters()
    let applicationsData =
      response?.data?.results || response?.data || response?.results || response || []

    if (Array.isArray(applicationsData)) {
      teachingCenters.value = applicationsData.map((app) => ({
        ...app,
        institute_details: app.institute_details || { name_of_institution: 'N/A' },
      }))
    } else {
      console.error('Unexpected API response structure for teaching centers:', response)
      showAlert('error', 'Failed to load applications: Unexpected data format.')
      teachingCenters.value = []
    }
  } catch (error) {
    console.error('Error fetching teaching center applications:', error)
    let errorMessage = 'Failed to load applications.'
    if (error.response) {
      errorMessage += ` Status ${error.response.status}. ${JSON.stringify(error.response.data)}`
    } else if (error.request) {
      errorMessage += ' No response from server.'
    } else {
      errorMessage += ` ${error.message}`
    }
    showAlert('error', errorMessage)
    teachingCenters.value = []
  } finally {
    loading.value = false
  }
}

const getVerificationStatusClass = (statusKey) => {
  const status = String(statusKey).toLowerCase()
  if (status.includes('verified')) return 'bg-green-100 text-green-800'
  if (status.includes('failed') || status.includes('not_verified')) return 'bg-red-100 text-red-800'
  if (status.includes('progress')) return 'bg-blue-100 text-blue-800'
  if (status.includes('pending')) return 'bg-yellow-100 text-yellow-800'
  return 'bg-gray-100 text-gray-800'
}

const getReviewStatusClass = (statusKey) => {
  const status = String(statusKey).toLowerCase()
  if (status === 'approved') return 'bg-green-100 text-green-800'
  if (status === 'rejected' || status === 'regretted') return 'bg-red-100 text-red-800'
  return 'bg-yellow-100 text-yellow-800'
}

const formatReviewStatusText = (statusKey) => {
  if (!statusKey) return 'Pending Review'
  return String(statusKey)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

const getPaymentStatusClass = (statusKey) => {
  const status = String(statusKey).toLowerCase()
  if (status === 'paid') return 'bg-green-100 text-green-800'
  if (status.includes('awaiting')) return 'bg-purple-100 text-purple-800'
  return 'bg-gray-100 text-gray-800'
}

const formatPaymentStatusText = (statusKey) => {
  if (!statusKey) return 'N/A'
  return String(statusKey)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

const openApplicationModal = (application) => {
  selectedApplication.value = { ...application }
  isModalOpen.value = true
}

const closeApplicationModal = () => {
  isModalOpen.value = false
  selectedApplication.value = {}
}

const triggerApprove = () => {
  if (!selectedApplication.value?.id) return
  confirmModal.value = {
    show: true,
    title: 'Approve Application',
    message: `Are you sure you want to approve the application for "${selectedApplication.value.center_name}"? This will enable payment for the institute.`,
    action: 'approve',
    centerId: selectedApplication.value.id,
    buttonText: 'Approve',
  }
  rejectionReasonInput.value = ''
}

const triggerReject = (rejectionDetails) => {
  if (!selectedApplication.value?.id) return
  const reason = rejectionDetails?.rejectionReason || ''
  confirmModal.value = {
    show: true,
    title: 'Reject Application',
    message: `Are you sure you want to reject the application for "${selectedApplication.value.center_name}"? Please provide a reason.`,
    action: 'reject',
    centerId: selectedApplication.value.id,
    payload: { tc_reason_if_rejected: reason },
    buttonText: 'Reject',
  }
  rejectionReasonInput.value = reason
}

const triggerSubmitVerification = (verificationData) => {
  if (!selectedApplication.value?.id) return
  confirmModal.value = {
    show: true,
    title: 'Confirm Verification Update',
    message: `You are about to save the verification details for "${selectedApplication.value.center_name}". This action cannot be undone. Continue?`,
    action: 'submit-verification',
    centerId: selectedApplication.value.id,
    payload: verificationData,
    buttonText: 'Confirm Update',
  }
}

const confirmAction = async () => {
  loading.value = true
  const { centerId, action, payload } = confirmModal.value

  try {
    if (!centerId) throw new Error('Application ID is missing.')

    let successMessage = ''
    let apiCall

    switch (action) {
      case 'approve':
        apiCall = apiServices.patchMhpcTeachingCenter(centerId, { tc_review_decision: 'Approved' })
        successMessage = 'Application approved successfully.'
        break

      case 'reject':
        const reason = payload?.tc_reason_if_rejected || rejectionReasonInput.value.trim()
        if (!reason) {
          showAlert('error', 'Rejection reason is required.')
          loading.value = false
          return
        }
        apiCall = apiServices.patchMhpcTeachingCenter(centerId, {
          tc_review_decision: 'Rejected',
          tc_reason_if_rejected: reason,
        })
        successMessage = 'Application rejected successfully.'
        break

      case 'submit-verification':
        const formData = new FormData()
        if (payload.verificationStatus) {
          formData.append('physical_verification_status', payload.verificationStatus)
        }
        if (payload.verificationReport) {
          formData.append('physical_verification_remarks', payload.verificationReport)
        }
        formData.append('send_to_user', payload.sendToUser)
        if (payload.siteVisitScheduleDate) {
          formData.append('site_visit_schedule_date', payload.siteVisitScheduleDate)
        }
        if (payload.actualVerificationDate) {
          formData.append('physical_verification_date', payload.actualVerificationDate)
        }
        if (payload.officer_attachments && payload.officer_attachments.length > 0) {
          for (const file of payload.officer_attachments) {
            formData.append('officer_attachments', file)
          }
        }
        if (payload.officer_report) {
          formData.append('tc_report', payload.officer_report)
        }
        apiCall = apiServices.patchMhpcTeachingCenter(centerId, formData)
        successMessage = 'Verification details updated successfully.'
        break

      default:
        throw new Error('Invalid action specified.')
    }

    const response = await apiCall
    showAlert('success', successMessage)

    await fetchTeachingCenters()

    if (isModalOpen.value && response.data) {
      selectedApplication.value = {
        ...response.data,
        institute_details: selectedApplication.value.institute_details,
      }
    }
  } catch (error) {
    console.error(`Error during action '${action}':`, error)
    let errorMessage = `Failed to ${action} application.`
    if (error.response) {
      const data = error.response.data
      errorMessage += ` Status ${error.response.status}.`
      if (data && typeof data === 'object') {
        const errorDetails = Object.entries(data)
          .map(([key, value]) => {
            return `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
          })
          .join('; ')
        errorMessage += ` Details: ${errorDetails}`
      } else if (data && data.detail) {
        errorMessage += ` ${data.detail}`
      } else if (typeof data === 'string') {
        errorMessage += ` ${data}`
      }
    } else if (error.request) {
      errorMessage += ' No response from server. Check network connection.'
    } else {
      errorMessage += ` ${error.message || 'An unknown error occurred.'}`
    }
    showAlert('error', errorMessage)
  } finally {
    loading.value = false
    confirmModal.value.show = false
  }
}

const showAlert = (type, message) => {
  alert.value = { show: true, type, message }
  setTimeout(() => {
    if (alert.value.message === message) {
      alert.value.show = false
    }
  }, 7000)
}
</script>

<style scoped>
.table-th {
  @apply px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider;
}
.table-td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-700;
}
</style>