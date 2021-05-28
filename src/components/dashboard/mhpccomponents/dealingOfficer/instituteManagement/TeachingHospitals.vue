<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Teaching Center Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total Pending/Reviewed: {{ teachingCenters.length }}
        </span>
      </div>
    </div>

    <!-- Alert for Success/Error Messages -->
    <div
      v-if="alert.show"
      :class="`mb-4 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`"
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
                ? 'text-green-500 hover:bg-green-100'
                : 'text-red-500 hover:bg-red-100'
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


    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- No Data Message -->
    <div
      v-else-if="teachingCenters.length === 0"
      class="bg-white p-8 text-center text-gray-500 rounded-xl shadow-sm border border-gray-100"
    >
      <p>No new teaching center applications found.</p>
    </div>

    <!-- Teaching Hospitals Table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="table-th">Institute</th>
              <th scope="col" class="table-th">Center Name</th>
              <th scope="col" class="table-th">Location (Center)</th>
              <th scope="col" class="table-th">Target Category</th>
              <th scope="col" class="table-th">Applied On</th>
              <th scope="col" class="table-th">Status</th>
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
              <td class="table-td font-medium text-gray-900">{{ center.center_name }}</td>
              <td class="table-td">{{ center.center_location }}, {{ center.state_dzongkhag }}</td>
              <td class="table-td">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">
                  {{ center.target_category }}
                </span>
              </td>
              <td class="table-td">{{ center.created_at ? new Date(center.created_at).toLocaleDateString() : 'N/A' }}</td>
              <td class="table-td">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(center.tc_review_decision)"
                >
                  {{ center.tc_review_decision ? center.tc_review_decision.replace(/_/g, ' ') : 'Pending Review' }}
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

    <!-- Confirmation Modal -->
    <div v-if="confirmModal.show" class="fixed z-30 inset-0 overflow-y-auto">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="confirmModal.show = false"
        ></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
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
                  <p class="text-sm text-gray-500">
                    {{ confirmModal.message }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="confirmAction"
              :class="`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
                ${confirmModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                : confirmModal.action === 'submit-verification' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`"
            >
              {{ confirmModal.buttonText || 'Confirm' }}
            </button>
            <button
              type="button"
              @click="confirmModal.show = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

onMounted(async () => {
  await fetchTeachingCenters()
})

const fetchTeachingCenters = async () => {
  loading.value = true
  try {
    const response = await apiServices.getMhpcTeachingCenters()

    const applications = response.data?.results || response.data || response.results || response || []
    if (Array.isArray(applications)) {
      // No complex mapping needed here if modal directly uses `institute_details`
      // And handles single string URLs for tc_attachments and tc_report
      teachingCenters.value = applications;
    } else {
      console.error('Unexpected API response structure for teaching centers:', response)
      showAlert('error', 'Failed to load applications: Unexpected data format.')
      teachingCenters.value = []
    }
  } catch (error) {
    console.error('Error fetching teaching center applications:', error)
    showAlert('error', `Failed to load applications: ${error.message || 'Server error'}`)
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  if (status === 'Approved') return 'bg-green-100 text-green-800';
  if (status === 'Rejected' || status === 'Regretted') return 'bg-red-100 text-red-800';
  if (status === 'Verification_Completed') return 'bg-blue-100 text-blue-800';
  return 'bg-yellow-100 text-yellow-800';
};

const openApplicationModal = (application) => {
  // The `application` object from `teachingCenters.value` now directly contains `institute_details`
  selectedApplication.value = { ...application };
  isModalOpen.value = true
}

const closeApplicationModal = () => {
  isModalOpen.value = false
  selectedApplication.value = {}
}

const triggerApprove = () => {
  confirmModal.value = {
    show: true,
    title: 'Approve Application',
    message: `Are you sure you want to approve the application for "${selectedApplication.value.center_name}"? This will enable payment for the institute.`,
    action: 'approve',
    centerId: selectedApplication.value.id,
    payload: null,
    buttonText: 'Approve',
  }
}

const triggerReject = (rejectionReason) => {
  confirmModal.value = {
    show: true,
    title: 'Reject Application',
    message: `Are you sure you want to reject the application for "${selectedApplication.value.center_name}"?`,
    action: 'reject',
    centerId: selectedApplication.value.id,
    payload: { tc_reason_if_rejected: rejectionReason },
    buttonText: 'Reject',
  }
}

const triggerSubmitVerification = (verificationData) => {
  confirmModal.value = {
    show: true,
    title: 'Submit Physical Verification',
    message: `Record physical verification for "${selectedApplication.value.center_name}"?`,
    action: 'submit-verification',
    centerId: selectedApplication.value.id,
    payload: verificationData,
    buttonText: 'Submit Verification',
  }
}

const confirmAction = async () => {
  loading.value = true;
  const id = confirmModal.value.centerId;
  const action = confirmModal.value.action;
  const payload = confirmModal.value.payload;
  let updateData = {};
  let successMessage = '';

  try {
    if (!id) throw new Error('Application ID is missing');

    switch (action) {
      case 'approve':
        updateData = { tc_review_decision: 'Approved', tc_reason_if_rejected: null };
        successMessage = 'Application approved successfully. Payment is now enabled for the institute.';
        break;
      case 'reject':
        if (!payload?.tc_reason_if_rejected?.trim()) {
          showAlert('error', 'Rejection reason is required.');
          loading.value = false;
          return;
        }
        updateData = {
          tc_review_decision: 'Rejected',
          tc_reason_if_rejected: payload.tc_reason_if_rejected.trim()
        };
        successMessage = 'Application rejected successfully.';
        break;
      case 'submit-verification':
        if (!payload?.verificationDate || !payload?.verificationReport?.trim()) {
          showAlert('error', 'Verification date and report are required.');
          loading.value = false;
          return;
        }
        updateData = {
          verification_date: payload.verificationDate,
          verification_report: payload.verificationReport,
           tc_review_decision: 'Verification_Completed'
        };
        successMessage = 'Physical verification details submitted successfully.';
        break;
      default:
        throw new Error('Invalid action specified.');
    }

    await apiServices.patchMhpcTeachingCenter(id, updateData);

    showAlert('success', successMessage);
    await fetchTeachingCenters();
    confirmModal.value.show = false;

    if (action === 'approve' || action === 'reject') {
      closeApplicationModal();
    } else if (action === 'submit-verification') {
      const freshApp = teachingCenters.value.find(app => app.id === id);
      if(freshApp) {
        selectedApplication.value = { ...freshApp };
      } else {
        closeApplicationModal();
      }
    }

  } catch (error) {
    console.error(`Error during ${action}:`, error.response?.data || error.message || error);
    let errorDetail = 'An unexpected error occurred.';
    if (error.response?.data) {
        if (typeof error.response.data === 'string') {
            errorDetail = error.response.data;
        } else if (typeof error.response.data === 'object') {
            errorDetail = error.response.data.detail || error.response.data.message || JSON.stringify(error.response.data);
        }
    } else if (error.message) {
        errorDetail = error.message;
    }
    showAlert('error', `Failed to ${action.replace('-', ' ')}. ${errorDetail}`);
  } finally {
    loading.value = false;
  }
}

const showAlert = (type, message) => {
  alert.value = { show: true, type, message }
  setTimeout(() => { alert.value.show = false }, 7000)
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