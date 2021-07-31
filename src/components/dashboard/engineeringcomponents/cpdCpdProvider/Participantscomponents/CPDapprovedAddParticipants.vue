<!-- CPDapprovedAddParticipants.vue -->
<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      Add CPD Task Participant
      <div class="h-1 w-20 bg-green-500 rounded mx-auto mt-3"></div>
    </h1>

    <TabNavigation :activeTab="activeTab" @tab-change="handleTabChange"
      :disabled="isBulkUploading || isSingleSubmitting || isPhotoUploading" />

    <div class="bg-white rounded-xl shadow-md p-6 md:p-8 mt-6">
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span class="ml-2 text-gray-600">Loading data...</span>
      </div>

      <SingleEntryForm v-show="!isLoading && activeTab === 'single'" ref="singleEntryFormRef"
        :cpdTasks="cpdTasksForSelection" :participants="participants" :current-provider-cid="currentProviderCid"
        :is-submitting="isSingleSubmitting" @submit="handleSingleSubmit" @cancel="cancel" />

      <BulkUploadForm v-show="!isLoading && activeTab === 'bulk'" ref="bulkUploadFormRef"
        :cpdTasks="cpdTasksForSelection" :current-provider-cid="currentProviderCid"
        :is-processing-upload="isBulkUploading" :preselected-task-id="preselectedTaskId" @submit="handleBulkSubmit"
        @cancel="cancel" />

      <AttendancePhotoForm v-show="!isLoading && activeTab === 'photo'" ref="attendancePhotoFormRef"
        :cpdTasks="cpdTasksForSelection" :current-provider-cid="currentProviderCid" :is-submitting="isPhotoUploading"
        @submit="handlePhotoSubmit" @cancel="cancel" />

      <StatusMessage v-if="message" :message="message" :type="messageType" @close="clearMessage" class="mt-6" />

      <!-- The error list UI remains the same, it will now show validation errors -->
      <div v-if="bulkUploadErrorList.length > 0 && activeTab === 'bulk'"
        class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <h4 class="text-md font-semibold text-red-700 mb-2">Upload Cancelled. Please fix the following issues in your
          CSV:</h4>
        <ul class="list-disc list-inside text-sm text-red-600 space-y-1">
          <li v-for="(err, index) in bulkUploadErrorList" :key="index">
            Reg No: <strong>{{ err.participant_reg_no || 'N/A' }}</strong> - {{ err.error }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiService from '@/services/services';
import { useToast } from 'vue-toastification';
import Papa from 'papaparse';
import TabNavigation from './TabNavigation.vue';
import SingleEntryForm from './SingleEntryForm.vue';
import BulkUploadForm from './BulkUploadForm.vue';
import AttendancePhotoForm from './AttendancePhotoForm.vue';
import StatusMessage from './StatusMessage.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const allCpdTasks = ref([]);
const participants = ref([]); // This holds all valid participants fetched from the API
const currentProviderCid = ref(null);
const preselectedTaskId = ref(null);

const activeTab = ref('single');
const isLoading = ref(true);
const message = ref('');
const messageType = ref('');
const messageTimeoutId = ref(null);

const isSingleSubmitting = ref(false);
const isBulkUploading = ref(false);
const isPhotoUploading = ref(false);

const singleEntryFormRef = ref(null);
const bulkUploadFormRef = ref(null);
const attendancePhotoFormRef = ref(null);

const bulkUploadErrorList = ref([]);

const cpdTasksForSelection = computed(() => {
  const filtered = allCpdTasks.value
    .filter((task) => {
      const isApproved = task.is_cpd_approved === true;
      if (currentProviderCid.value) {
        return isApproved && String(task.cid_no).trim() === String(currentProviderCid.value).trim();
      }
      return isApproved;
    })
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  return filtered;
});

// A computed property to quickly look up participants by their registration number
const participantRegNoSet = computed(() => {
  return new Set(participants.value.map(p => p.registration_no || p.reg_no));
});

onMounted(async () => {
  if (route.query.add_participants === 'true' && route.query.id) {
    activeTab.value = 'bulk';
    preselectedTaskId.value = route.query.id;
  }
  try {
    const userString = localStorage.getItem('user');
    if (userString) currentProviderCid.value = JSON.parse(userString)?.cid || null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
  }
  await fetchData();
});

async function fetchData() {
  isLoading.value = true;
  try {
    const [tasksResponse, participantsResponse] = await Promise.all([
      apiService.getEpcCpdTasks(),
      apiService.getEpcFullApplicationListByCid(''), // This fetches all valid participants
    ]);
    allCpdTasks.value = tasksResponse.data?.results || tasksResponse.data || [];
    participants.value = participantsResponse.data?.results || participantsResponse.data || [];
  } catch (error) {
    console.error('Error fetching initial data:', error);
    showMessage('Failed to load essential data.', 'error');
  } finally {
    isLoading.value = false;
  }
}

function handleTabChange(newTab) {
  activeTab.value = newTab;
}

watch(activeTab, () => {
  clearMessage();
});

async function handleSingleSubmit(submissionData) {
  isSingleSubmitting.value = true;
  clearMessage();
  try {
    await apiService.createEpcCpdTaskParticipant(submissionData);
    showMessage('Participant added successfully!', 'success');
    if (singleEntryFormRef.value?.resetForm) singleEntryFormRef.value.resetForm(true);
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'Failed to add participant.';
    showMessage(errorMessage, 'error');
  } finally {
    isSingleSubmitting.value = false;
  }
}

// --- NEW "ALL OR NOTHING" LOGIC FOR `handleBulkSubmit` ---
async function handleBulkSubmit({ cpdTask, file }) {
  isBulkUploading.value = true;
  clearMessage();

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const participantsToUpload = results.data;
      const validationErrors = [];

      if (!participantsToUpload || participantsToUpload.length === 0) {
        showMessage('CSV file is empty or could not be read.', 'error');
        isBulkUploading.value = false;
        return;
      }

      // --- STAGE 1: VALIDATION ---
      // We check every row before submitting anything.
      for (const participant of participantsToUpload) {
        const regNo = participant.participant_reg_no?.trim();

        if (!regNo) {
          validationErrors.push({ participant_reg_no: 'Empty Row', error: 'Registration number was missing.' });
        } else if (!participantRegNoSet.value.has(regNo)) {
          // Use our Set for a fast check to see if the participant exists
          validationErrors.push({ participant_reg_no: regNo, error: 'This registration number does not exist in the system.' });
        }
      }

      // --- DECISION POINT ---
      // If there are any validation errors, STOP and show the errors. Do not submit.
      if (validationErrors.length > 0) {
        bulkUploadErrorList.value = validationErrors;
        showMessage(`Upload cancelled. ${validationErrors.length} error(s) found in your file.`, 'error');
        isBulkUploading.value = false;
        return; // Stop the entire process
      }

      // --- STAGE 2: SUBMISSION ---
      // This part only runs if validation was 100% successful.
      showMessage(`Validation successful. Now uploading ${participantsToUpload.length} participants...`, 'info');

      const submissionPromises = participantsToUpload.map(participant => {
        const payload = {
          cpd_task: cpdTask,
          participant_reg_no: participant.participant_reg_no.trim(),
        };
        return apiService.createEpcCpdTaskParticipant(payload);
      });

      try {
        // Wait for all the individual API calls to complete
        await Promise.all(submissionPromises);

        // If we get here, everything succeeded
        showMessage(`${participantsToUpload.length} participants were uploaded successfully!`, 'success');
        if (bulkUploadFormRef.value) {
          bulkUploadFormRef.value.resetForm(false);
        }

      } catch (error) {
        // This catch block would only trigger if there's a network error
        // or a server error *after* validation passed, which is rare.
        showMessage('An unexpected error occurred during the submission phase. Some participants may not have been added.', 'error');
      } finally {
        isBulkUploading.value = false;
      }
    },
    error: (err) => {
      showMessage(`Failed to parse CSV file: ${err.message}`, 'error');
      isBulkUploading.value = false;
    }
  });
}

// handlePhotoSubmit remains unchanged
async function handlePhotoSubmit({ cpdTask, photo, description }) { /* ... */ }

function cancel() {
  router.go(-1);
}

function showMessage(text, type = 'info', duration = 7000) {
  message.value = text;
  messageType.value = type;
  if (messageTimeoutId.value) clearTimeout(messageTimeoutId.value);
  messageTimeoutId.value = setTimeout(clearMessage, duration);
}

function clearMessage() {
  message.value = '';
  messageType.value = '';
  bulkUploadErrorList.value = [];
  if (messageTimeoutId.value) clearTimeout(messageTimeoutId.value);
}
</script>
