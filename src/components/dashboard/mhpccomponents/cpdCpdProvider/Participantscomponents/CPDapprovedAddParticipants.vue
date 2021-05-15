<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      Add CPD Task Participant
      <div class="h-1 w-20 bg-green-500 rounded mx-auto mt-3"></div>
    </h1>

    <!-- Tab Navigation -->
    <TabNavigation :activeTab="activeTab" @tab-change="activeTab = $event" :disabled="isBulkUploading || isSingleSubmitting || isPhotoUploading" />

    <div class="bg-white rounded-xl shadow-md p-6 md:p-8">
      <!-- Loading indicator for initial data fetch -->
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span class="ml-2 text-gray-600">Loading data...</span>
      </div>

      <!-- Tab Content -->
      <SingleEntryForm
        v-if="!isLoading && activeTab === 'single'"
        :cpdTasks="cpdTasks"
        :participants="participants"
        :current-provider-cid="currentProviderCid"
        :is-submitting="isSingleSubmitting"
        @submit="handleSingleSubmit"
        @cancel="cancel"
      />

      <BulkUploadForm
        v-if="!isLoading && activeTab === 'bulk'"
        :cpdTasks="cpdTasks"
        :current-provider-cid="currentProviderCid"
        :is-processing-upload="isBulkUploading"
        @submit="handleBulkSubmit"
        @cancel="cancel"
        ref="bulkUploadFormRef" 
      />

      <AttendancePhotoForm
        v-if="!isLoading && activeTab === 'photo'"
        :cpdTasks="cpdTasks"
        :current-provider-cid="currentProviderCid"
        :is-submitting="isPhotoUploading"
        @submit="handlePhotoSubmit"
        @cancel="cancel"
      />

      <!-- Status Message -->
      <StatusMessage v-if="message" :message="message" :type="messageType" @close="message = ''" />

      <!-- Detailed Bulk Upload Errors (Optional Advanced Display) -->
      <div v-if="bulkUploadErrorList.length > 0 && activeTab === 'bulk'" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <h4 class="text-md font-semibold text-red-700 mb-2">Bulk Upload Issues:</h4>
        <ul class="list-disc list-inside text-sm text-red-600 space-y-1">
          <li v-for="(err, index) in bulkUploadErrorList" :key="index">
            Row {{ err.row }} (Reg No: {{ err.participant_reg_no || 'N/A' }}): {{ err.error }}
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/services' // Your API service

// Import child components
import TabNavigation from './TabNavigation.vue'
import SingleEntryForm from './SingleEntryForm.vue'
import BulkUploadForm from './BulkUploadForm.vue'
import AttendancePhotoForm from './AttendancePhotoForm.vue'
import StatusMessage from './StatusMessage.vue'

const router = useRouter()
const cpdTasks = ref([])
const participants = ref([])
const message = ref('')
const messageType = ref('')
const activeTab = ref('single')
const isLoading = ref(true)
const currentProviderCid = ref(null)

// Submission loading states
const isSingleSubmitting = ref(false);
const isBulkUploading = ref(false); // Specific loading state for bulk uploads
const isPhotoUploading = ref(false);

const bulkUploadFormRef = ref(null); // Ref for BulkUploadForm child
const bulkUploadErrorList = ref([]); // To store detailed errors from bulk upload

onMounted(async () => {
  try {
    const userString = localStorage.getItem('user');
    if (userString) {
      const loggedInUser = JSON.parse(userString);
      if (loggedInUser && loggedInUser.cid) {
        currentProviderCid.value = loggedInUser.cid;
      } else {
        console.warn("Logged in user data found, but 'cid' property is missing or null.");
      }
    } else {
      console.warn("No user data found in localStorage. Provider CID cannot be determined.");
    }
  } catch (error) {
    console.error("Error retrieving or parsing user data for provider CID:", error);
  }
  await fetchData();
});

async function fetchData() {
  isLoading.value = true;
  try {
    const [tasksResponse, participantsResponse] = await Promise.all([
      apiService.getMhpcCpdTask(),
      apiService.getMhpcCounsellors(),
    ]);
    cpdTasks.value = tasksResponse.data.results || tasksResponse.data || [];
    participants.value = participantsResponse.data.results || participantsResponse.data || [];
  } catch (error) {
    console.error('Error fetching initial data:', error);
    showMessage('Failed to load essential data. Please try refreshing the page.', 'error');
    cpdTasks.value = [];
    participants.value = [];
  } finally {
    isLoading.value = false;
  }
}

async function handleSingleSubmit(submissionData) {
  isSingleSubmitting.value = true;
  message.value = '';
  bulkUploadErrorList.value = [];
  try {
    // Assuming apiService.createMhpcCpdTaskParticipant handles the POST request
    // to your standard participant creation endpoint (not bulk)
    await apiService.createMhpcCpdTaskParticipant(submissionData);
    showMessage('Participant added successfully!', 'success');
    // Potentially reset form or navigate
  } catch (error) {
    console.error('Error submitting single participant:', error);
    let errorMessage = 'Failed to add participant.';
    if (error.response && error.response.data) {
      const errors = error.response.data;
      if (typeof errors === 'object' && !Array.isArray(errors)) { // Check if it's an object of errors
          errorMessage += ' Details: ' + Object.entries(errors).map(([key, value]) => `${key}: ${value.join ? value.join(', ') : value}`).join('; ');
      } else if (Array.isArray(errors)) { // If it's an array of error messages
          errorMessage += ' Details: ' + errors.join('; ');
      } else if (typeof errors === 'string') { // If it's a single error string
          errorMessage += ' Details: ' + errors;
      }
    }
    showMessage(errorMessage, 'error');
  } finally {
    isSingleSubmitting.value = false;
  }
}

async function handleBulkSubmit({ cpdTask, file }) {
  isBulkUploading.value = true;
  message.value = ''; // Clear previous messages
  bulkUploadErrorList.value = []; // Clear previous bulk errors

  const formDataToSend = new FormData();
  formDataToSend.append('cpd_task', cpdTask); // Key from backend `request.data.get('cpd_task')`
  formDataToSend.append('file', file);       // Key from backend `request.FILES.get('file')`

  try {
    // Ensure apiService.bulkCreateMhpcCpdTaskParticipants POSTs to the `bulk-upload` action URL
    // e.g., /api/your-prefix/cpd-task-participants/bulk-upload/
    // and returns the response data directly.
    const responseData = await apiService.bulkCreateMhpcCpdTaskParticipants(formDataToSend);

    const { created_count = 0, failed_count = 0, errors = [] } = responseData;

    let summaryMessage = `${created_count} participant(s) were successfully processed.`;
    let currentMessageType = 'success';

    if (failed_count > 0) {
      summaryMessage += ` ${failed_count} participant(s) could not be processed.`;
      currentMessageType = 'warning';
    }

    if (errors.length > 0) {
      bulkUploadErrorList.value = errors; // Store for detailed display
      if (currentMessageType === 'success') currentMessageType = 'warning';
      summaryMessage += ` There were ${errors.length} issue(s) with specific rows.`;
       // No need to add "see console" if displaying them directly
    }

    showMessage(summaryMessage, currentMessageType);

    if (created_count > 0 && failed_count === 0 && errors.length === 0) {
        // Full success, reset form
        if (bulkUploadFormRef.value && typeof bulkUploadFormRef.value.resetForm === 'function') {
            bulkUploadFormRef.value.resetForm();
        }
    }

  } catch (error) {
    console.error('Critical error during bulk upload:', error);
    let errorMessage = 'Bulk upload failed.';
    if (error.response && error.response.data && error.response.data.error) {
      // For specific error messages from backend like "CSV file is required."
      errorMessage = error.response.data.error;
    } else if (error.response && error.response.data) {
      // For other structured errors from the backend (e.g. DRF validation on the request itself)
       const errors = error.response.data;
       if (typeof errors === 'object') {
           errorMessage = Object.values(errors).flat().join(' ');
       } else if (typeof errors === 'string') {
           errorMessage = errors;
       }
    }
    showMessage(errorMessage, 'error');
    bulkUploadErrorList.value = []; // Clear any partial list on critical failure
  } finally {
    isBulkUploading.value = false;
  }
}


async function handlePhotoSubmit({ cpdTask, photo, description }) {
  isPhotoUploading.value = true;
  message.value = '';
  bulkUploadErrorList.value = [];
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('cpd_task', cpdTask);
    formDataToSend.append('attendance_photo', photo);
    if (description) {
      formDataToSend.append('photo_description', description);
    }
    await apiService.uploadCpdTaskAttendancePhoto(formDataToSend);
    showMessage('Attendance photo uploaded successfully!', 'success');
  } catch (error) {
    console.error('Error uploading attendance photo:', error);
    showMessage('Failed to upload attendance photo. Please try again.', 'error');
  } finally {
    isPhotoUploading.value = false;
  }
}

function cancel() {
  router.go(-1);
}

function showMessage(text, type = 'info') {
  message.value = text;
  messageType.value = type;
  // Auto-clear message after 7 seconds for better UX with potentially longer messages
  setTimeout(() => {
    if (message.value === text) { // Only clear if it's still the same message
        message.value = '';
        messageType.value = '';
    }
  }, 7000);
}
</script>