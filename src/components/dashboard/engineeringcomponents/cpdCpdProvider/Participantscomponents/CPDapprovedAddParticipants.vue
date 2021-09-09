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

      <div v-if="bulkUploadErrorList.length > 0 && activeTab === 'bulk'"
        class="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <h4 class="text-md font-semibold text-red-700 mb-2">
          Upload Cancelled. Please fix the following issues in your CSV:
        </h4>
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
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const authStore = useAuthStore();

const allCpdTasks = ref([]);
const participants = ref([]);
const currentProviderCid = ref(null);
const preselectedTaskId = ref(null);

const activeTab = ref('single');
const isLoading = ref(true);

const isSingleSubmitting = ref(false);
const isBulkUploading = ref(false);
const isPhotoUploading = ref(false);

const singleEntryFormRef = ref(null);
const bulkUploadFormRef = ref(null);
const attendancePhotoFormRef = ref(null);

const bulkUploadErrorList = ref([]);

const cpdTasksForSelection = computed(() => {
  if (!allCpdTasks.value) return [];
  return allCpdTasks.value
    .filter((task) => {
      const isApproved = task.status?.toLowerCase() === 'approved';

      if (currentProviderCid.value) {
        return isApproved && String(task.cid_no).trim() === String(currentProviderCid.value).trim();
      }
      return isApproved;
    })
    .sort((a, b) => (a.title_of_cpd || '').localeCompare(b.title_of_cpd || ''));
});

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
  const cid = authStore.user?.cid;

  if (!cid) {
    toast.error("User CID not found. Cannot fetch data.");
    isLoading.value = false;
    return;
  }
  try {
    const [tasksResponse, participantsResponse] = await Promise.all([
      apiService.getEpcCpdTasks({ cid: cid }),
      apiService.getEpcNewApplications(),
    ]);
    allCpdTasks.value = tasksResponse.data?.results || tasksResponse.data || [];
    participants.value = participantsResponse.data?.results || participantsResponse.data || [];
  } catch (error) {
    console.error('Error fetching initial data:', error);
    toast.error('Failed to load essential data.');
  } finally {
    isLoading.value = false;
  }
}

function handleTabChange(newTab) {
  activeTab.value = newTab;
  bulkUploadErrorList.value = [];
}

watch(activeTab, () => {
  bulkUploadErrorList.value = [];
});

async function handleSingleSubmit(submissionData) {
  if (isSingleSubmitting.value) return;
  isSingleSubmitting.value = true;
  bulkUploadErrorList.value = [];

  const toastId = toast.info("Adding participant...", { timeout: false });

  try {
    await apiService.createEpcCpdTaskParticipant(submissionData);
    toast.update(toastId, {
      content: 'Participant added successfully!',
      type: 'success',
      timeout: 5000,
    });
    if (singleEntryFormRef.value?.resetForm) singleEntryFormRef.value.resetForm(true);
  } catch (error) {
    toast.update(toastId, {
      content: `Error:${error.response?.data?.detail || 'Failed to add participant.'}`,
      type: 'error',
      timeout: 5000,
    });
  } finally {
    isSingleSubmitting.value = false;
  }
}

async function handleBulkSubmit({ cpdTask, file }) {
  if (isBulkUploading.value) return;
  isBulkUploading.value = true;
  bulkUploadErrorList.value = [];

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const participantsToUpload = results.data;
      const validationErrors = [];
      if (!participantsToUpload || participantsToUpload.length === 0) {
        toast.error('CSV file is empty or could not be read.');
        isBulkUploading.value = false;
        return;
      }
      for (const p of participantsToUpload) {
        const regNo = p.participant_reg_no?.trim();
        if (!regNo) {
          validationErrors.push({ participant_reg_no: 'Empty Row', error: 'Registration number was missing.' });
        } else if (!participantRegNoSet.value.has(regNo)) {
          validationErrors.push({ participant_reg_no: regNo, error: 'This registration number does not exist in the system.' });
        }
      }
      if (validationErrors.length > 0) {
        bulkUploadErrorList.value = validationErrors;
        toast.error(`Upload cancelled. ${validationErrors.length} error(s) found in the file.`);
        isBulkUploading.value = false;
        return;
      }

      const submissionPromises = participantsToUpload.map(p =>
        apiService.createEpcCpdTaskParticipant({
          cpd_task: cpdTask,
          participant_reg_no: p.participant_reg_no.trim(),
        })
      );

      const toastId = toast.info(`Uploading ${participantsToUpload.length} participants...`, { timeout: false });

      try {
        await Promise.all(submissionPromises);
        toast.update(toastId, {
          content: `${participantsToUpload.length} participants uploaded successfully!`,
          type: 'success',
          timeout: 5000,
        });
        if (bulkUploadFormRef.value) bulkUploadFormRef.value.resetForm(false);
      } catch (error) {
        console.error("An error occurred during bulk submission:", error);
        toast.update(toastId, {
          content: 'An error occurred. Some participants may not have been added.',
          type: 'error',
          timeout: 5000,
        });
      } finally {
        isBulkUploading.value = false;
      }
    },
    error: (err) => {
      toast.error(`Failed to parse CSV file: ${err.message}`);
      isBulkUploading.value = false;
    },
  });
}

async function handlePhotoSubmit({ cpdTask, photo, description }) {
  if (isPhotoUploading.value) return;
  isPhotoUploading.value = true;
  bulkUploadErrorList.value = [];

  const formDataToSend = new FormData();
  formDataToSend.append('attendance_sheet_attachment', photo, photo.name);
  if (description) {
    formDataToSend.append('photo_description', description);
  }

  const toastId = toast.info("Uploading attendance PDF...", { timeout: false });

  try {
    await apiService.patchEpcCpdTask(cpdTask, formDataToSend);
    toast.update(toastId, {
      content: 'Attendance PDF uploaded successfully!',
      type: 'success',
      timeout: 5000,
    });
    if (attendancePhotoFormRef.value?.resetForm) {
      attendancePhotoFormRef.value.resetForm(false);
    }
  } catch (error) {
    let errorMessage = 'Failed to upload attendance PDF.';

    toast.update(toastId, {
      content: `Error: ${errorMessage}`,
      type: 'error',
      timeout: 5000,
    });
  } finally {
    isPhotoUploading.value = false;
  }
}

function cancel() {
  router.go(-1);
}
</script>
