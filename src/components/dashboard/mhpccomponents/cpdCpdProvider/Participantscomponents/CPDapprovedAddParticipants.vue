<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      Add CPD Task Participant
      <div class="h-1 w-20 bg-green-500 rounded mx-auto mt-3"></div>
    </h1>

    <!-- Tab Navigation -->
    <TabNavigation
      :activeTab="activeTab"
      @tab-change="handleTabChange"
      :disabled="isBulkUploading || isSingleSubmitting || isPhotoUploading"
    />

    <div class="bg-white rounded-xl shadow-md p-6 md:p-8 mt-6">
      <!-- Loading indicator for initial data fetch -->
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span class="ml-2 text-gray-600">Loading data...</span>
      </div>

      <!-- Tab Content -->
      <!-- Using v-show to keep component instances alive for easier ref access and state preservation -->
      <SingleEntryForm
        v-show="!isLoading && activeTab === 'single'"
        ref="singleEntryFormRef"
        :cpdTasks="cpdTasksForSelection"
        :participants="participants"
        :current-provider-cid="currentProviderCid"
        :is-submitting="isSingleSubmitting"
        @submit="handleSingleSubmit"
        @cancel="cancel"
      />

      <BulkUploadForm
        v-show="!isLoading && activeTab === 'bulk'"
        ref="bulkUploadFormRef"
        :cpdTasks="cpdTasksForSelection"
        :current-provider-cid="currentProviderCid"
        :is-processing-upload="isBulkUploading"
        @submit="handleBulkSubmit"
        @cancel="cancel"
      />

      <AttendancePhotoForm
        v-show="!isLoading && activeTab === 'photo'"
        ref="attendancePhotoFormRef"
        :cpdTasks="cpdTasksForSelection"
        :current-provider-cid="currentProviderCid"
        :is-submitting="isPhotoUploading"
        @submit="handlePhotoSubmit"
        @cancel="cancel"
      />

      <!-- Status Message -->
      <StatusMessage
        v-if="message"
        :message="message"
        :type="messageType"
        @close="clearMessage"
        class="mt-6"
      />

      <!-- Detailed Bulk Upload Errors -->
      <div
        v-if="bulkUploadErrorList.length > 0 && activeTab === 'bulk'"
        class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md"
      >
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
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/services'

// Import child components
import TabNavigation from './TabNavigation.vue'
import SingleEntryForm from './SingleEntryForm.vue'
import BulkUploadForm from './BulkUploadForm.vue'
import AttendancePhotoForm from './AttendancePhotoForm.vue'
import StatusMessage from './StatusMessage.vue'

const router = useRouter()

// Data refs
const allCpdTasks = ref([]) // Stores all fetched tasks
const participants = ref([])
const currentProviderCid = ref(null)

// UI State refs
const activeTab = ref('single')
const isLoading = ref(true)
const message = ref('')
const messageType = ref('')
const messageTimeoutId = ref(null)

// Submission loading states
const isSingleSubmitting = ref(false)
const isBulkUploading = ref(false)
const isPhotoUploading = ref(false)

// Refs for child components
const singleEntryFormRef = ref(null)
const bulkUploadFormRef = ref(null)
const attendancePhotoFormRef = ref(null)

const bulkUploadErrorList = ref([])

// Computed property to filter CPD tasks for selection dropdowns
const cpdTasksForSelection = computed(() => {
  return allCpdTasks.value
    .filter(task => {
      // Logic for tasks available for adding participants/photos:
      // 1. Must have an 'Approved' review_status OR is_cpd_approved is true.
      // 2. If currentProviderCid is set, filter by tasks where cid_no matches.
      //    (This assumes 'cid_no' on the task is the provider's CID who created it)
      const isApproved = task.review_status === 'Approved' || task.is_cpd_approved === true;
      if (currentProviderCid.value) {
        return isApproved && task.cid_no === currentProviderCid.value;
      }
      return isApproved; // If no provider CID, admin might see all approved tasks
    })
    .sort((a, b) => (a.title_of_cpd || '').localeCompare(b.title_of_cpd || ''));
});


onMounted(async () => {
  try {
    const userString = localStorage.getItem('user')
    if (userString) {
      const loggedInUser = JSON.parse(userString)
      currentProviderCid.value = loggedInUser?.cid || null
      if (!currentProviderCid.value) {
        console.warn("Logged in user data found, but 'cid' (Provider CID) is missing or null.")
      }
    } else {
      console.warn('No user data found in localStorage. Provider CID cannot be determined.')
    }
  } catch (error) {
    console.error('Error retrieving or parsing user data for provider CID:', error)
  }
  await fetchData()
})

async function fetchData() {
  isLoading.value = true
  try {
    const [tasksResponse, participantsResponse] = await Promise.all([
      apiService.getMhpcCpdTask(),
      apiService.getMhpcCounsellors(),
    ]);

    allCpdTasks.value = tasksResponse.data?.results || tasksResponse.data || [];
    participants.value = participantsResponse.data?.results || participantsResponse.data || [];

  } catch (error) {
    console.error('Error fetching initial data:', error)
    showMessage('Failed to load essential data. Please try refreshing the page.', 'error')
    allCpdTasks.value = []
    participants.value = []
  } finally {
    isLoading.value = false
  }
}

function handleTabChange(newTab) {
  activeTab.value = newTab
}

watch(activeTab, (newTab, oldTab) => {
  clearMessage();
  bulkUploadErrorList.value = [];

  // Resetting forms when switching tabs to avoid carrying over old data.
  // Child components must expose `resetForm(showMessageFeedback = true)`
  if (oldTab === 'single' && singleEntryFormRef.value?.resetForm) {
    singleEntryFormRef.value.resetForm(false);
  }
  if (oldTab === 'bulk' && bulkUploadFormRef.value?.resetForm) {
    bulkUploadFormRef.value.resetForm(false);
  }
  if (oldTab === 'photo' && attendancePhotoFormRef.value?.resetForm) {
    attendancePhotoFormRef.value.resetForm(false);
  }
});

async function handleSingleSubmit(submissionData) {
  isSingleSubmitting.value = true
  clearMessage();
  bulkUploadErrorList.value = []
  try {
    // Backend should ideally infer provider from logged-in user if it's a provider-specific action.
    // If explicit CID needed: const payload = { ...submissionData, provider_cid: currentProviderCid.value };
    await apiService.createMhpcCpdTaskParticipant(submissionData)
    showMessage('Participant added successfully!', 'success')
    if (singleEntryFormRef.value?.resetForm) {
      singleEntryFormRef.value.resetForm(false)
    }
  } catch (error) {
    console.error('Error submitting single participant:', error)
    let errorMessage = 'Failed to add participant.'
    if (error.response?.data) { // Standard DRF error handling
      const errors = error.response.data
      if (typeof errors === 'object' && !Array.isArray(errors)) {
        errorMessage = Object.entries(errors)
          .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ')
      } else if (Array.isArray(errors)) {
        errorMessage = errors.join('; ')
      } else if (typeof errors === 'string') {
        errorMessage = errors
      }
    }
    showMessage(errorMessage, 'error')
  } finally {
    isSingleSubmitting.value = false
  }
}

async function handleBulkSubmit({ cpdTask, file }) {
  isBulkUploading.value = true
  clearMessage();
  bulkUploadErrorList.value = []

  const formDataToSend = new FormData()
  formDataToSend.append('cpd_task', cpdTask)
  formDataToSend.append('file', file)
  // If backend bulk endpoint requires provider context and can't infer from user:
  // if (currentProviderCid.value) formDataToSend.append('provider_cid', currentProviderCid.value);

  try {
    const responseData = await apiService.bulkCreateMhpcCpdTaskParticipants(formDataToSend)
    const { created_count = 0, failed_count = 0, errors = [] } = responseData || {}

    let finalMessage = ''
    let finalMessageType = ''

    if (created_count > 0) {
      finalMessage = `${created_count} participant(s) successfully processed.`
      finalMessageType = 'success'
      if (failed_count > 0 || errors.length > 0) {
        finalMessageType = 'warning'
        finalMessage += ` However,`
        if (failed_count > 0) finalMessage += ` ${failed_count} other row(s) could not be processed.`
        if (errors.length > 0) {
          finalMessage += ` There were ${errors.length} additional issue(s) with specific rows.`
          bulkUploadErrorList.value = errors
        }
      } else { // Pure success
        if (bulkUploadFormRef.value?.resetForm) {
          bulkUploadFormRef.value.resetForm(false)
        }
      }
    } else if (failed_count > 0 || errors.length > 0) {
      finalMessage = `CSV processed, but no participants were created.`
      finalMessageType = 'error'
      if (failed_count > 0) finalMessage += ` ${failed_count} row(s) could not be processed.`
      if (errors.length > 0) {
        finalMessage += ` There were ${errors.length} issue(s) with specific rows.`
        bulkUploadErrorList.value = errors
      }
    } else {
      finalMessage = 'CSV processed. No new participants were found or created from the file.'
      finalMessageType = 'info'
       if (bulkUploadFormRef.value?.resetForm) { // Also reset if file was empty/no data
          bulkUploadFormRef.value.resetForm(false)
        }
    }
    showMessage(finalMessage.trim(), finalMessageType)
  } catch (error) {
    console.error('Critical error during bulk upload:', error)
    let errorMessage = 'Bulk upload failed. Please ensure the file format is correct and the CPD Task is valid.'
    if (error.response?.data) {
      const errors = error.response.data;
      if (errors.detail) errorMessage = errors.detail;
      else if (errors.error) errorMessage = errors.error; // Specific 'error' key from backend
      else if (typeof errors === 'object' && !Array.isArray(errors)) {
           errorMessage = Object.entries(errors).map(([key, value]) => `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
      } else if (Array.isArray(errors)) errorMessage = errors.join('; ');
      else if (typeof errors === 'string') errorMessage = errors;
    }
    showMessage(errorMessage, 'error')
    bulkUploadErrorList.value = []
  } finally {
    isBulkUploading.value = false
  }
}

async function handlePhotoSubmit({ cpdTask, photo, description }) {
  isPhotoUploading.value = true
  clearMessage();
  bulkUploadErrorList.value = []
  try {
    const formDataToSend = new FormData()
    formDataToSend.append('cpd_task', cpdTask)
    formDataToSend.append('attendance_photo', photo, photo.name)
    if (description) {
      formDataToSend.append('photo_description', description)
    }
    // If backend photo endpoint requires provider context and can't infer from user:
    // if (currentProviderCid.value) formDataToSend.append('provider_cid', currentProviderCid.value);

    await apiService.uploadCpdTaskAttendancePhoto(formDataToSend)
    showMessage('Attendance photo uploaded successfully!', 'success')
    if (attendancePhotoFormRef.value?.resetForm) {
      attendancePhotoFormRef.value.resetForm(false)
    }
  } catch (error) {
    console.error('Error uploading attendance photo:', error)
    let errorMessage = 'Failed to upload attendance photo.'
    if (error.response?.data) {
        const errors = error.response.data;
        if (errors.detail) errorMessage = errors.detail;
        else if (errors.attendance_photo && Array.isArray(errors.attendance_photo)) errorMessage = `Photo error: ${errors.attendance_photo.join(', ')}`;
        else if (typeof errors === 'string') errorMessage = errors;
        else if (typeof errors === 'object' && !Array.isArray(errors)) {
           errorMessage = Object.entries(errors).map(([key, value]) => `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        } else if (Array.isArray(errors)) errorMessage = errors.join ('; ');
    }
    showMessage(errorMessage, 'error');
  } finally {
    isPhotoUploading.value = false
  }
}

function cancel() {
  router.go(-1)
}

function showMessage(text, type = 'info', duration = 7000) {
  message.value = text
  messageType.value = type
  if (messageTimeoutId.value) clearTimeout(messageTimeoutId.value);
  messageTimeoutId.value = setTimeout(clearMessage, duration)
}

function clearMessage() {
    message.value = '';
    messageType.value = '';
    if (messageTimeoutId.value) {
        clearTimeout(messageTimeoutId.value);
        messageTimeoutId.value = null;
    }
}
</script>