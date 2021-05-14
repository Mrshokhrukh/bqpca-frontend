<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      Add CPD Task Participant
      <div class="h-1 w-20 bg-green-500 rounded mx-auto mt-3"></div>
    </h1>

    <!-- Tab Navigation -->
    <TabNavigation :activeTab="activeTab" @tab-change="activeTab = $event" />

    <div class="bg-white rounded-xl shadow-md p-6 md:p-8">
      <!-- Loading indicator -->
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
        @submit="handleSingleSubmit"
        @cancel="cancel"
      />

      <BulkUploadForm
        v-if="!isLoading && activeTab === 'bulk'"
        :cpdTasks="cpdTasks"
        :current-provider-cid="currentProviderCid"
        @submit="handleBulkSubmit"
        @cancel="cancel"
      />

      <AttendancePhotoForm
        v-if="!isLoading && activeTab === 'photo'"
        :cpdTasks="cpdTasks"
        :current-provider-cid="currentProviderCid"
        @submit="handlePhotoSubmit"
        @cancel="cancel"
      />

      <!-- Status Message -->
      <StatusMessage v-if="message" :message="message" :type="messageType" @close="message = ''" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/services' // Your API service

// Import child components
import TabNavigation from './TabNavigation.vue'
import SingleEntryForm from './SingleEntryForm.vue' // This form expects currentProviderCid
import BulkUploadForm from './BulkUploadForm.vue'
import AttendancePhotoForm from './AttendancePhotoForm.vue'
import StatusMessage from './StatusMessage.vue'

const router = useRouter()
const cpdTasks = ref([]) // Will hold the raw list of CPD Provider Applications
const participants = ref([]) // Will hold the list of potential participants
const message = ref('')
const messageType = ref('')
const activeTab = ref('single') // Default tab
const isLoading = ref(true)
const currentProviderCid = ref(null) // To store the CID of the logged-in provider

onMounted(async () => {
  // --- Determine currentProviderCid ---
  // This is a PLACEHOLDER. Replace with your actual method of getting the logged-in provider's CID.
  // This might come from a Pinia/Vuex store, a global user object, etc.
  try {
    const userString = localStorage.getItem('user'); // Example: retrieving from localStorage
    if (userString) {
      const loggedInUser = JSON.parse(userString);
      if (loggedInUser && loggedInUser.cid) { // Assuming your user object has a 'cid' property
        currentProviderCid.value = loggedInUser.cid;
        console.log('Provider CID found:', currentProviderCid.value);
      } else {
        console.warn("Logged in user data found, but 'cid' property is missing or null.");
        // Handle if CID is strictly required for providers, e.g., show error or redirect.
      }
    } else {
      console.warn("No user data found in localStorage. Provider CID cannot be determined.");
      // This might be okay for an admin user who sees all tasks,
      // or an error if a provider CID is always expected.
    }
  } catch (error) {
    console.error("Error retrieving or parsing user data for provider CID:", error);
  }
  // --- End determining currentProviderCid ---

  await fetchData(); // Now fetch data, currentProviderCid might be used by child components
});

async function fetchData() {
  isLoading.value = true
  try {
    // Use Promise.all to make parallel requests
    const [tasksResponse, participantsResponse] = await Promise.all([
      // IMPORTANT: Ensure this API call (getMhpcCpdTask) returns the list of
      // "CPD Provider Applications" as objects. Each object should ideally have:
      // id, title_of_cpd, from_date, is_cpd_approved, cid_no (provider's CID)
      // The SingleEntryForm will use this raw list and filter it using currentProviderCid.
      apiService.getMhpcCpdTask(),

      // IMPORTANT: Ensure this API call (getMhpcCounsellors) returns the full list of users
      // who can be participants. Each user object should have at least:
      // reg_no, full_name (or name).
      // If any registered user can be a participant (not just counsellors),
      // an endpoint like `apiService.searchProfessionals('')` might be more appropriate,
      // assuming it returns all users with an empty query.
      apiService.getMhpcCounsellors(),
    ])

    // Assuming the data is in response.data.results or response.data
    cpdTasks.value = tasksResponse.data.results || tasksResponse.data || [];
    participants.value = participantsResponse.data.results || participantsResponse.data || [];

    console.log('Loaded CPD tasks/applications:', cpdTasks.value.length);
    console.log('Loaded participants:', participants.value.length);

  } catch (error) {
    console.error('Error fetching initial data:', error);
    showMessage('Failed to load essential data. Please try refreshing the page.', 'error');
    cpdTasks.value = []; // Ensure they are empty on error
    participants.value = [];
  } finally {
    isLoading.value = false;
  }
}

async function handleSingleSubmit(submissionData) {
  // The submissionData here is the payload from SingleEntryForm,
  // which should be { cpd_task: ..., participant_reg_no: ... }
  try {
    await apiService.createMhpcCpdTaskParticipant(submissionData);
    showMessage('Participant added successfully to the CPD task!', 'success');
    // Optionally, you might want to refresh some data or navigate
    // await fetchData(); // Re-fetch data if the list of participants for a task needs updating
  } catch (error) {
    console.error('Error submitting single participant:', error);
    let errorMessage = 'Failed to add participant.';
    if (error.response && error.response.data) {
        // Try to get more specific error messages from the API response
        const errors = error.response.data;
        if (typeof errors === 'object') {
            errorMessage += ' Details: ' + Object.values(errors).flat().join(' ');
        } else if (typeof errors === 'string') {
            errorMessage += ' Details: ' + errors;
        }
    }
    showMessage(errorMessage, 'error');
  }
}

async function handleBulkSubmit({ cpdTask, file }) {
  // This function seems to expect a `cpdTask` (ID of the CPD Provider Application)
  // and a `file` (CSV).
  // Ensure the `cpdTask` selected in BulkUploadForm is the ID of a CpdProviderApplication.
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('cpd_task', cpdTask); // This should be the ID of the selected CPD Application
    formDataToSend.append('participants_csv', file);

    // Assuming you have an API endpoint for bulk creation like this:
    await apiService.bulkCreateMhpcCpdTaskParticipants(formDataToSend);
    showMessage('Participants uploaded successfully via CSV!', 'success');
    // await fetchData(); // Optionally re-fetch
  } catch (error) {
    console.error('Error uploading bulk participants:', error);
    showMessage('Failed to upload participants. Please check your CSV file format and try again.', 'error');
  }
}

async function handlePhotoSubmit({ cpdTask, photo, description }) {
  // Similar to bulk, cpdTask should be the ID of the CPD Provider Application.
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('cpd_task', cpdTask); // ID of the selected CPD Application
    formDataToSend.append('attendance_photo', photo);
    if (description) {
      formDataToSend.append('photo_description', description);
    }

    // Assuming you have an API endpoint for photo upload:
    await apiService.uploadCpdTaskAttendancePhoto(formDataToSend);
    showMessage('Attendance photo uploaded successfully!', 'success');
  } catch (error) {
    console.error('Error uploading attendance photo:', error);
    showMessage('Failed to upload attendance photo. Please try again.', 'error');
  }
}

function cancel() {
  router.go(-1); // Or navigate to a specific route: router.push('/dashboard');
}

function showMessage(text, type = 'info') {
  message.value = text;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
    messageType.value = '';
  }, 5000); // Increased timeout for better readability
}
</script>