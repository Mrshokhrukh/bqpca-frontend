<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Training Center Administration</h1>
      <p class="text-gray-600">Review and process teaching center applications.</p>
    </div>

    <div
      v-if="alert.show"
      :class="`mb-4 p-4 rounded-md ${
        alert.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
      }`"
    >
      <div class="flex">
        <div class="ml-3">
          <p class="text-sm font-medium">{{ alert.message }}</p>
        </div>
      </div>
    </div>

    <div v-if="loading && !isModalOpen" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div
      v-else-if="!loading && publishedCenters.length === 0"
      class="bg-white p-8 text-center text-gray-500 rounded-xl shadow-sm border border-gray-100"
    >
      <p>No teaching center applications found.</p>
    </div>

    <div
      v-else-if="!loading"
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
                Location
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
              v-for="center in publishedCenters"
              :key="center.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ center.center_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ center.institute.name_of_institution }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ center.city_gewog }}, {{ center.state_dzongkhag }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(center.status)"
                >
                  {{ center.status_display }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    @click="openModal(center)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    View/Review
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          @click="closeModal"
        ></div>
        <div
          class="inline-block align-bottom bg-gray-50 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-2xl leading-6 font-bold text-gray-900">Application Review</h3>
                <p class="text-sm text-gray-500 mt-1">
                  Proposal for
                  <span class="font-semibold text-indigo-600">{{
                    selectedCenter?.center_name
                  }}</span>
                </p>
              </div>
              <button
                @click="closeModal"
                class="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="max-h-[70vh] overflow-y-auto px-6 py-4 bg-gray-50">
            <div class="lg:grid lg:grid-cols-5 lg:gap-8">
              <div class="lg:col-span-3">
                <section class="mb-8">
                  <h4 class="text-lg font-semibold text-gray-800 mb-3">
                    Proponent & Proposal Details
                  </h4>
                  <dl class="divide-y divide-gray-200">
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Institute Name</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ selectedCenter.institute?.name_of_institution }}
                      </dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Contact</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ selectedCenter.institute?.contact_no }}
                      </dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Email</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ selectedCenter.institute?.email_address }}
                      </dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Center Name</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ selectedCenter.center_name }}
                      </dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Location</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ selectedCenter.center_location }}, {{ selectedCenter.city_gewog }},
                        {{ selectedCenter.state_dzongkhag }}
                      </dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Applicant Remarks</dt>
                      <dd
                        class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap"
                      >
                        {{ selectedCenter.remarks || 'N/A' }}
                      </dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Attachments</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <a
                          v-if="selectedCenter.tc_attachments"
                          :href="selectedCenter.tc_attachments"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="font-medium text-indigo-600 hover:text-indigo-500"
                          >View Attachment</a
                        ><span v-else>None</span>
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
              <div class="lg:col-span-2 mt-8 lg:mt-0">
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 class="text-lg font-semibold text-gray-800 mb-4">Review Action</h4>
                  <div
                    v-if="selectedCenter.status !== 'PENDING_REVIEW'"
                    class="p-4 mb-4 text-sm text-blue-800 bg-blue-50 rounded-lg border border-blue-300"
                  >
                    This application has already been processed (Status:
                    {{ selectedCenter.status_display }}). No further actions can be taken.
                  </div>
                  <div v-else class="space-y-4">
                    <p class="text-sm text-gray-600">
                      Review the details and choose an action below. Approving will move the
                      application to "Awaiting Payment".
                    </p>
                    <button
                      @click="openApproveDialog"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Approve for Payment
                    </button>
                    <button
                      @click="openRejectDialog"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reject Application
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl border-t"
          >
            <button
              type="button"
              @click="closeModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="approveDialog.show" class="fixed z-20 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="closeApproveDialog"></div>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Approve Training Center</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Provide any optional remarks for this approval. The applicant will be notified to
                proceed with payment.
              </p>
              <textarea
                v-model="approveDialog.message"
                rows="4"
                class="mt-3 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="e.g., Application approved, pending payment."
              ></textarea>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="confirmApprove"
              :disabled="loading"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              <span v-if="loading">Approving...</span><span v-else>Confirm Approval</span>
            </button>
            <button
              type="button"
              @click="closeApproveDialog"
              :disabled="loading"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="rejectDialog.show" class="fixed z-20 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="closeRejectDialog"></div>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Reject Training Center</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                You must provide a reason for rejecting this application.
              </p>
              <textarea
                v-model="rejectDialog.message"
                rows="4"
                class="mt-3 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter rejection reason here..."
              ></textarea>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="confirmReject"
              :disabled="loading || !rejectDialog.message.trim()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              <span v-if="loading">Rejecting...</span><span v-else>Confirm Rejection</span>
            </button>
            <button
              type="button"
              @click="closeRejectDialog"
              :disabled="loading"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
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
import { ref, onMounted, computed } from 'vue'
import apiServices from '@/services/services'

const teachingCenters = ref([])
const isModalOpen = ref(false)
const selectedCenter = ref({ institute: {} })
const loading = ref(false)
const alert = ref({ show: false, type: 'success', message: '' })
const approveDialog = ref({ show: false, message: '' })
const rejectDialog = ref({ show: false, message: '' })

const publishedCenters = computed(() => {
  return teachingCenters.value.filter((center) => !center.is_draft)
})

onMounted(async () => {
  await fetchTeachingCenters()
})

const fetchTeachingCenters = async () => {
  loading.value = true
  try {
    const response = await apiServices.getEpcTeachingCenters()
    teachingCenters.value = response.data.results || response.data || []
  } catch (error) {
    console.error('API Error fetching centers:', error)
    showAlert('error', 'Failed to load teaching center applications.')
  } finally {
    loading.value = false
  }
}

const openModal = (center) => {
  selectedCenter.value = center
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedCenter.value = { institute: {} }
}

const openApproveDialog = () => {
  approveDialog.value = { show: true, message: 'Application approved, pending payment.' }
}

const closeApproveDialog = () => {
  approveDialog.value.show = false
}

const openRejectDialog = () => {
  rejectDialog.value = { show: true, message: '' }
}

const closeRejectDialog = () => {
  rejectDialog.value.show = false
}

const confirmApprove = async () => {
  if (!selectedCenter.value?.id) return

  loading.value = true
  try {
    const payload = {
      remarks: approveDialog.value.message,
    }

    const response = await apiServices.approveEpcTeachingCenter(selectedCenter.value.id, payload)

    const index = teachingCenters.value.findIndex((c) => c.id === selectedCenter.value.id)
    if (index !== -1) {
      teachingCenters.value[index] = response.data
    }

    showAlert('success', `Center "${selectedCenter.value.center_name}" approved for payment.`)
    closeApproveDialog()
    closeModal()
  } catch (error) {
    console.error('API Error approving center:', error.response || error)
    showAlert('error', `Failed to approve: ${error.response?.data?.detail || error.message}`)
  } finally {
    loading.value = false
  }
}

const confirmReject = async () => {
  if (!selectedCenter.value?.id) return
  if (!rejectDialog.value.message.trim()) {
    showAlert('error', 'A reason for rejection is required.')
    return
  }

  loading.value = true
  try {
    const payload = {
      remarks: rejectDialog.value.message,
    }

    const response = await apiServices.rejectEpcTeachingCenter(selectedCenter.value.id, payload)

    const index = teachingCenters.value.findIndex((c) => c.id === selectedCenter.value.id)
    if (index !== -1) {
      teachingCenters.value[index] = response.data
    }

    showAlert('success', `Center "${selectedCenter.value.center_name}" has been rejected.`)
    closeRejectDialog()
    closeModal()
  } catch (error) {
    console.error('API Error rejecting center:', error.response || error)
    showAlert('error', `Failed to reject: ${error.response?.data?.detail || error.message}`)
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'PENDING_REVIEW':
      return 'bg-yellow-100 text-yellow-800'
    case 'AWAITING_PAYMENT':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const showAlert = (type, message) => {
  alert.value = { show: true, type, message }
  setTimeout(() => {
    alert.value.show = false
  }, 5000)
}
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>