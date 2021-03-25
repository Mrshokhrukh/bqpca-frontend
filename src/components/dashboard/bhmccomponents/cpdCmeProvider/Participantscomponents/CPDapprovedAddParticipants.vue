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
      <SingleEntryForm v-if="!isLoading && activeTab === 'single'" 
        :cpdTasks="cpdTasks" 
        :participants="participants"
        @submit="handleSingleSubmit" 
        @cancel="cancel" />

      <BulkUploadForm v-if="!isLoading && activeTab === 'bulk'" 
        :cpdTasks="cpdTasks" 
        @submit="handleBulkSubmit" 
        @cancel="cancel" />

      <AttendancePhotoForm v-if="!isLoading && activeTab === 'photo'" 
        :cpdTasks="cpdTasks" 
        @submit="handlePhotoSubmit"
        @cancel="cancel" />

      <!-- Status Message -->
      <StatusMessage v-if="message" :message="message" :type="messageType" @close="message = ''" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/services';

import TabNavigation from './TabNavigation.vue';
import SingleEntryForm from './SingleEntryForm.vue';
import BulkUploadForm from './BulkUploadForm.vue';
import AttendancePhotoForm from './AttendancePhotoForm.vue';
import StatusMessage from './StatusMessage.vue';

const router = useRouter();
const cpdTasks = ref([]);
const participants = ref([]);
const message = ref('');
const messageType = ref('');
const activeTab = ref('single'); // 'single', 'bulk', or 'photo'
const isLoading = ref(true);

onMounted(fetchData);

async function fetchData() {
  isLoading.value = true;
  try {
    // Use Promise.all to make parallel requests
    const [tasksResponse, participantsResponse] = await Promise.all([
      apiService.getMhpcCpdTask(),
      apiService.getMhpcCounsellors()
    ]);

    cpdTasks.value = tasksResponse.data.results || tasksResponse.data;
    participants.value = participantsResponse.data.results || participantsResponse.data;
    
    console.log('Loaded tasks:', cpdTasks.value.length);
    console.log('Loaded participants:', participants.value.length);
  } catch (error) {
    console.error('Error fetching data:', error);
    showMessage('Failed to load data. Please try again.', 'error');
  } finally {
    isLoading.value = false;
  }
}

async function handleSingleSubmit(formData) {
  try {
    // Check if formData is already processed (response from API)
    if (formData && formData.id) {
      showMessage('Participant added successfully!', 'success');
      return;
    }

    // For FormData submission
    if (formData instanceof FormData) {
      await apiService.createMhpcCpdTaskParticipant(formData);
    } else {
      // For JSON submission
      await apiService.createMhpcCpdTaskParticipant(formData);
    }
    
    showMessage('Participant added successfully!', 'success');
    
    // Refresh the task data after adding a participant
    await fetchData();
  } catch (error) {
    console.error('Error submitting form:', error);
    showMessage('Failed to add participant. Please try again.', 'error');
  }
}

async function handleBulkSubmit({ cpdTask, file }) {
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('cpd_task', cpdTask);
    formDataToSend.append('participants_csv', file);

    await apiService.bulkCreateMhpcCpdTaskParticipants(formDataToSend);
    showMessage('Participants uploaded successfully!', 'success');
    
    // Refresh the data after bulk upload
    await fetchData();
  } catch (error) {
    console.error('Error uploading participants:', error);
    showMessage('Failed to upload participants. Please check your CSV file and try again.', 'error');
  }
}

async function handlePhotoSubmit({ cpdTask, photo, description }) {
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
    console.error('Error uploading photo:', error);
    showMessage('Failed to upload attendance photo. Please try again.', 'error');
  }
}

function cancel() {
  router.go(-1);
}

function showMessage(text, type) {
  message.value = text;
  messageType.value = type;
  setTimeout(() => message.value = '', 4000);
}
</script>