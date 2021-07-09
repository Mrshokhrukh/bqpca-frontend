<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Teaching Center Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total Pending/Reviewed: {{ loading ? 'Loading...' : teachingCenters.length }}
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

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- No Data Message -->
    <div
      v-else-if="!loading && teachingCenters.length === 0"
      class="bg-white p-8 text-center text-gray-500 rounded-xl shadow-sm border border-gray-100"
    >
      <p>No new teaching center applications found.</p>
    </div>

    <!-- Teaching Centers Table -->
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
                {{ center.center_location || 'N/A' }}{{ center.state_dzongkhag ? `, ${center.state_dzongkhag}` : '' }}
              </td>
              <td class="table-td">
                <span v-if="center.target_category" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">
                  {{ center.target_category }}
                </span>
                <span v-else>N/A</span>
              </td>
              <td class="table-td">{{ center.created_at ? new Date(center.created_at).toLocaleDateString() : 'N/A' }}</td>
              <td class="table-td">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(center.tc_review_decision)"
                >
                  {{ formatStatusText(center.tc_review_decision) }}
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

    <!-- Application Details Modal -->
    <TeachingHospitalsDetailsModal
      :is-open="isModalOpen"
      :hospital-details="selectedApplication"
      @close-modal="closeApplicationModal"
      @approve="triggerApprove"
      @reject="triggerReject"
      @submit-verification="triggerSubmitVerification"
    />

    <!-- Confirmation Modal for Actions -->
    <div v-if="confirmModal.show" class="fixed z-30 inset-0 overflow-y-auto">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="confirmModal.show = false"
          aria-hidden="true"
        ></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>
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
                  'bg-red-100': confirmModal.action === 'reject'
                }"
              >
                <!-- Icon based on action -->
                <svg v-if="confirmModal.action === 'approve'" class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else-if="confirmModal.action === 'submit-verification'" class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
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
                  <!-- Additional input for rejection reason if action is reject and payload structure needs it -->
                   <div v-if="confirmModal.action === 'reject' && !confirmModal.payload?.tc_reason_if_rejected" class="mt-4">
                      <label for="rejectionReasonConfirm" class="block text-sm font-medium text-gray-700">Rejection Reason (Required)</label>
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
              :disabled="loading || (confirmModal.action === 'reject' && !confirmModal.payload?.tc_reason_if_rejected && !rejectionReasonInput.trim())"
              :class="`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
                ${confirmModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300'
                : confirmModal.action === 'submit-verification' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300'
                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300'}`"
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
// Make sure these paths are correct for your project structure
import TeachingHospitalsDetailsModal from '../modals/TeachingHospitalsDetailsModal.vue'
import apiServices from '@/services/services.js'

const teachingCenters = ref([])
const isModalOpen = ref(false)
const selectedApplication = ref({}) // Will hold the center object for the modal
const loading = ref(false) // General loading state for the page/actions

const alert = ref({ show: false, type: 'success', message: '' })
const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  action: '', // 'approve', 'reject', 'submit-verification'a
  centerId: null,
  payload: null, // Data to be sent with the action (e.g., rejection reason, verification details)
  buttonText: 'Confirm',
})
const rejectionReasonInput = ref(''); // For the confirmation modal's textarea if needed


onMounted(async () => {
  await fetchTeachingCenters()
})

const fetchTeachingCenters = async () => {
  loading.value = true
  teachingCenters.value = [] // Clear previous data
  try {
    const response = await apiServices.getMhpcTeachingCenters()
    console.log("API Response Raw for Teaching Centers:", response);

    let applicationsData = null;

    if (response && response.data && Array.isArray(response.data.results)) {
      applicationsData = response.data.results; // Standard DRF paginated response
    } else if (response && response.data && Array.isArray(response.data)) {
      applicationsData = response.data; // Non-paginated list
    } else if (response && Array.isArray(response.results) && !response.data) {
      applicationsData = response.results; // Alternative paginated if axios strips 'data'
    } else if (response && Array.isArray(response)) {
      applicationsData = response; // Direct array response
    } else {
      console.error('Unexpected API response structure for teaching centers:', response);
      showAlert('error', 'Failed to load applications: Unexpected data format. Check console.');
    }

    if (applicationsData && Array.isArray(applicationsData)) {
      teachingCenters.value = applicationsData.map(app => ({
        ...app,
        institute_details: app.institute_details || { name_of_institution: 'N/A (Missing Institute Data)' }
      }));
      console.log("Processed teachingCenters.value:", teachingCenters.value);
      if (teachingCenters.value.length === 0 && !alert.value.show) { // Only show if no other alert is active
         // The v-else-if for no data message will handle this.
      }
    } else {
      console.warn('applicationsData is not an array or is null after parsing:', applicationsData);
      if (!alert.value.show) {
        // showAlert('info', 'No teaching center applications found at this time.'); // Can be redundant with the "No data" message
      }
      teachingCenters.value = [];
    }

  } catch (error) {
    console.error('Error fetching teaching center applications:', error);
    let errorMessage = 'Failed to load applications.';
    if (error.response) {
      const data = error.response.data;
      errorMessage += ` Status ${error.response.status}. `;
      if (data && data.detail) errorMessage += data.detail;
      else if (data && typeof data === 'object') errorMessage += JSON.stringify(data);
      else if (typeof data === 'string') errorMessage += data;
    } else if (error.request) {
      errorMessage += ' No response from server. Check network connection.';
    } else {
      errorMessage += ` ${error.message || 'An unknown error occurred.'}`;
    }
    showAlert('error', errorMessage);
    teachingCenters.value = [];
  } finally {
    loading.value = false;
  }
}

const getStatusClass = (statusKey) => {
  // Match backend status keys (e.g., 'Pending', 'Approved', 'Rejected', 'VERIFIED_PV')
  const status = String(statusKey).toLowerCase();
  if (status === 'approved') return 'bg-green-100 text-green-800';
  if (status === 'rejected' || status === 'regretted') return 'bg-red-100 text-red-800';
  if (status === 'verification_completed' || status === 'verified_pv' || status === 'physically verified') return 'bg-blue-100 text-blue-800';
  // Default for 'Pending', 'Pending_Review', 'PENDING_PV', etc.
  return 'bg-yellow-100 text-yellow-800';
};

const formatStatusText = (statusKey) => {
  if (!statusKey) return 'Pending Review';
  return String(statusKey).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getPaymentStatusClass = (statusKey) => {
  const status = String(statusKey).toLowerCase();
  if (status === 'paid') return 'bg-green-100 text-green-800';
  if (status === 'awaiting_payment') return 'bg-purple-100 text-purple-800';
  if (status === 'processing_payment') return 'bg-blue-100 text-blue-800';
  if (status === 'failed') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800'; // For 'not_paid' or 'not_applicable'
};

const formatPaymentStatusText = (statusKey) => {
  if (!statusKey) return 'N/A';
  return String(statusKey).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const openApplicationModal = (application) => {
  console.log("Opening modal for application:", JSON.parse(JSON.stringify(application)));
  selectedApplication.value = { ...application }; // Create a copy to avoid direct mutation if needed
  isModalOpen.value = true;
}

const closeApplicationModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = {};
}

const triggerApprove = (/* approvalPayloadFromModal - if modal sends anything */) => {
  if (!selectedApplication.value || !selectedApplication.value.id) {
    showAlert('error', 'No application selected for approval.');
    return;
  }
  confirmModal.value = {
    show: true,
    title: 'Approve Application',
    message: `Are you sure you want to approve the application for "${selectedApplication.value.center_name}"? This will enable payment for the institute.`,
    action: 'approve',
    centerId: selectedApplication.value.id,
    payload: { /* approvalMessage: approvalPayloadFromModal?.message */ }, // Example if modal sends a message
    buttonText: 'Approve',
  };
  rejectionReasonInput.value = ''; // Clear any previous input
}

const triggerReject = (rejectionDetails) => { // Expects { rejectionReason: '...' } from modal
  if (!selectedApplication.value || !selectedApplication.value.id) {
    showAlert('error', 'No application selected for rejection.');
    return;
  }
  const reason = rejectionDetails?.rejectionReason || '';
  confirmModal.value = {
    show: true,
    title: 'Reject Application',
    message: `Are you sure you want to reject the application for "${selectedApplication.value.center_name}"? Please provide a reason.`,
    action: 'reject',
    centerId: selectedApplication.value.id,
    payload: { tc_reason_if_rejected: reason }, // Pre-fill if modal already provided it
    buttonText: 'Reject',
  };
  rejectionReasonInput.value = reason; // Sync with textarea in confirm modal
}

const triggerSubmitVerification = (verificationData) => {
  if (!selectedApplication.value || !selectedApplication.value.id) {
    showAlert('error', 'No application selected for verification submission.');
    return;
  }
  confirmModal.value = {
    show: true,
    title: 'Confirm Verification Update',
    message: `You are about to save the verification status for "${selectedApplication.value.center_name}". This will update the record. Continue?`,
    action: 'submit-verification',
    centerId: selectedApplication.value.id,
    payload: verificationData, // The payload now contains file objects
    buttonText: 'Confirm Update',
  };
};

const confirmAction = async () => {
  loading.value = true;
  const { centerId, action, payload } = confirmModal.value;

  try {
    if (!centerId) throw new Error('Application ID is missing.');

    let successMessage = '';
    let apiCall;

    switch (action) {
      case 'approve':
        apiCall = apiServices.patchMhpcTeachingCenter(centerId, { tc_review_decision: 'Approved' });
        successMessage = 'Application approved successfully.';
        break;

      case 'reject':
        const reason = payload?.rejectionReason || rejectionReasonInput.value.trim();
        if (!reason) {
            showAlert('error', 'Rejection reason is required.');
            loading.value = false;
            return;
        }
        apiCall = apiServices.patchMhpcTeachingCenter(centerId, {
          tc_review_decision: 'Rejected',
          tc_reason_if_rejected: reason,
        });
        successMessage = 'Application rejected successfully.';
        break;

      case 'submit-verification':
        const formData = new FormData();
        formData.append('physical_verification_status', payload.verificationStatus);
        formData.append('physical_verification_remarks', payload.verificationReport);
        formData.append('send_to_user', payload.sendToUser);

        // Conditionally add dates if they are not null/empty
        if (payload.siteVisitScheduleDate) {
          formData.append('site_visit_schedule_date', payload.siteVisitScheduleDate);
        }
        if (payload.actualVerificationDate) {
          formData.append('physical_verification_date', payload.actualVerificationDate);
        }

        // Append officer attachments
        if (payload.officer_attachments && payload.officer_attachments.length > 0) {
          for (const file of payload.officer_attachments) {
            formData.append('officer_attachments', file);
          }
        }

        // Append officer report if it exists
        if (payload.officer_report) {
          formData.append('tc_report', payload.officer_report);
        }

        console.log("PATCHING with FormData:", formData);
        apiCall = apiServices.patchMhpcTeachingCenter(centerId, formData);
        successMessage = 'Verification details updated successfully.';
        break;

      default:
        throw new Error('Invalid action specified.');
    }

    await apiCall;

    showAlert('success', successMessage);
    confirmModal.value.show = false;
    await fetchTeachingCenters(); // Refresh list

    // Refresh data in the open modal
    const freshApp = teachingCenters.value.find(app => app.id === centerId);
    if (freshApp) {
      selectedApplication.value = { ...freshApp };
    } else {
      closeApplicationModal();
    }

  } catch (error) {
    // ... (your existing error handling) ...
  } finally {
    loading.value = false;
  }
}
const showAlert = (type, message) => {
  alert.value = { show: true, type, message };
  setTimeout(() => {
    if (alert.value.message === message) { // Only hide if it's still the same message
        alert.value.show = false;
    }
  }, 7000);
}
</script>

<style scoped>
.table-th {
  @apply px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider;
}
.table-td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-700;
}
/* Add any other styles you need */
</style>
