<template>
  <div class="p-6 font-sans">
    <h1 class="text-2xl font-bold mb-6">Institutional Self-Assessment Report (ISAR)</h1>

    <div v-if="loading" class="text-center py-10">
      <p>Loading application details...</p>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-500">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="!canSubmitIsar" class="text-center py-10 bg-gray-100 rounded-lg">
      <p class="font-semibold text-lg">ISAR Submission Not Available</p>
      <p class="text-gray-600">{{ isarEligibilityMessage }}</p>
    </div>

    <form v-else @submit.prevent="submitIsar" class="space-y-8">
      <!-- Part I: Executive Summary -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Part I: Executive Summary</h3>
        <textarea v-model="isarData.executive_summary" rows="10" class="w-full p-2 border rounded" required></textarea>
      </div>

      <!-- Part II: Profile of the Institution -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Part II: Institutional Profile & Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block font-medium">Focal Person for IQA</label>
            <input type="text" v-model="isarData.isar_focal_person_iqa_details" class="w-full mt-1 p-2 border rounded" />
          </div>
          <div>
            <label class="block font-medium">Institutional Website</label>
            <input type="url" v-model="isarData.isar_website_details" class="w-full mt-1 p-2 border rounded" />
          </div>
           <div>
            <label class="block font-medium">Telephone</label>
            <input type="text" v-model="isarData.isar_telephone_details" class="w-full mt-1 p-2 border rounded" />
          </div>
           <div>
            <label class="block font-medium">Email</label>
            <input type="email" v-model="isarData.isar_email_details" class="w-full mt-1 p-2 border rounded" />
          </div>
          <!-- TODO: Add all other fields from your ISARReport model here -->
        </div>
      </div>

      <!-- Part III: Standard Documents -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-4">Part III: Standard Documents</h3>
        <div v-for="standard in standards" :key="standard.id" class="mb-4">
          <label class="block font-medium">{{ standard.standard_name }}</label>
          <input type="file" @change="handleFileUpload($event, standard.id)" class="w-full mt-1" required/>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" :disabled="isSubmitting" class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
          {{ isSubmitting ? 'Submitting...' : 'Finalize and Submit ISAR' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiService from '@/services/services';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref(null);
const application = ref(null);
const standards = ref([]);
const isSubmitting = ref(false);

const isarData = ref({
  // Initialize all fields you have in your form to prevent reactivity issues
  executive_summary: '',
  isar_focal_person_iqa_details: '',
  isar_website_details: '',
  isar_telephone_details: '',
  isar_email_details: '',
  // TODO: Add all other fields from your model here
  documents: {}, // To hold the files
});

const applicationId = route.query.applicationId;

const fetchRequiredData = async () => {
  if (!applicationId) {
    error.value = "Application ID is missing. Please return to the applications list and select one to proceed.";
    loading.value = false;
    return;
  }
  try {
    const appResponse = await apiService.getAccreditationApplication(applicationId);
    application.value = appResponse.data;
    const standardsResponse = await apiService.getMastersStandards();
    standards.value = standardsResponse.data.results || standardsResponse.data;
  } catch (err) {
    console.error("Error fetching data:", err);
    error.value = "Failed to load required data.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRequiredData);

// canSubmitIsar and isarEligibilityMessage computed properties remain the same as your original code

const handleFileUpload = (event, standardId) => {
  const file = event.target.files[0];
  if (file) {
    isarData.value.documents[standardId] = file;
  }
};

const submitIsarReport = async () => {
  const formData = new FormData();
  formData.append('application', applicationId);
  formData.append('executive_summary', isarData.value.executive_summary);
  formData.append('status', 'submitted_isar');

  for (const standardId in isarData.value.documents) {
    formData.append(`standard_document_${standardId}`, isarData.value.documents[standardId]);
  }

  try {
    await apiService.createIsarReport(formData);
    alert('ISAR report submitted successfully!');
    // Optionally, redirect the user
  } catch (err) {
    console.error("Error submitting ISAR report:", err);
    alert('Failed to submit ISAR report.');
  }
};
</script>