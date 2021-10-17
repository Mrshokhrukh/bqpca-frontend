<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="mx-auto max-w-7xl">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">COI Declaration</h1>

      <!-- State: Loading -->
      <div v-if="loading" class="text-center py-12">
        <Loader2 class="animate-spin inline-block w-8 h-8 text-gray-500" />
        <p class="text-gray-600 mt-4">Loading your assigned applications...</p>
      </div>

      <!-- State: Error -->
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        <p class="font-bold">An Error Occurred</p>
        <p>{{ error }}</p>
      </div>

      <!-- State: Main Content -->
      <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute Name</th>
                <!-- CHANGED: Header is now more generic -->
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- State: Empty (No Data) -->
              <tr v-if="assignments.length === 0">
                <td colspan="4" class="text-center py-12 text-gray-500">
                  No applications are currently assigned to you.
                </td>
              </tr>
              <!-- Loop through assignments -->
              <tr v-for="item in assignments" :key="item.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.application_details.application_uid.slice(0, 8) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.application_details.institute_profile_details.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <!-- CHANGED: We now use the item's status for color and its status_display for text -->
                  <span :class="getCoiStatusClass(item.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full leading-4">
                    {{ item.status_display }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <!-- This logic is still correct: the button is disabled if a declaration has been made -->
                  <button @click="openCoiModal(item)" class="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center" :disabled="item.assessor_has_coi !== null">
                    <Edit class="w-4 h-4 mr-2" />
                    {{ item.assessor_has_coi !== null ? 'Declaration Submitted' : 'Declare COI' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- COI Declaration Modal -->
    <div v-if="isCoiModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center" @click.self="closeCoiModal">
       <div class="relative mx-auto p-6 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">Conflict of Interest Declaration</h3>
            <button @click="closeCoiModal" class="p-2 hover:bg-gray-200 rounded-full">
                <X class="w-6 h-6" />
            </button>
        </div>
        <form @submit.prevent="submitCoiDeclaration">
            <div class="mb-4">
                <p class="font-medium">Do you have a conflict of interest with this institution?</p>
                <div class="flex items-center space-x-4 mt-2">
                    <label class="flex items-center">
                        <input type="radio" v-model="coiFormData.has_coi" :value="true" class="form-radio h-4 w-4 text-indigo-600">
                        <span class="ml-2">Yes</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" v-model="coiFormData.has_coi" :value="false" class="form-radio h-4 w-4 text-indigo-600">
                        <span class="ml-2">No</span>
                    </label>
                </div>
            </div>

            <div v-if="coiFormData.has_coi === true" class="mb-4">
                <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
                <textarea v-model="coiFormData.remarks" id="remarks" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
            </div>

            <div v-if="submissionError" class="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                {{ submissionError }}
            </div>

            <div class="flex justify-end space-x-4">
                <button type="button" @click="closeCoiModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
                    <Loader2 v-if="isSubmitting" class="animate-spin inline-block w-5 h-5" />
                    <span v-else>Submit</span>
                </button>
            </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from '@/services/services';
import { Loader2, Edit, X } from 'lucide-vue-next';

// --- Reactive State (Unchanged) ---
const loading = ref(true);
const error = ref(null);
const assignments = ref([]);
const isCoiModalOpen = ref(false);
const selectedCoiRecord = ref(null);
const isSubmitting = ref(false);
const submissionError = ref(null);
const coiFormData = ref({ has_coi: null, remarks: '' });

// --- Data Fetching (Unchanged) ---
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiService.getApplicationAssessorCOIs();
    assignments.value = response.data.results || [];
  } catch (err) {
    console.error("Failed to fetch assignments:", err);
    error.value = "Could not load your assigned applications. Please try again later.";
  } finally {
    loading.value = false;
  }
};

// --- Lifecycle Hook (Unchanged) ---
onMounted(fetchData);

// --- UI Helper Functions ---

// CHANGED: This function now bases the color on the overall workflow status string.
const getCoiStatusClass = (status) => {
  switch (status) {
    case 'pending_assessor':
    case 'pending_institute_review':
      return 'bg-yellow-100 text-yellow-800'; // Yellow for pending states

    case 'approved_no_conflict':
      return 'bg-green-100 text-green-800'; // Green for successful resolution

    case 'disputed_by_institute':
    case 'conflict_acknowledged':
      return 'bg-red-100 text-red-800'; // Red for conflicts/disputes

    default:
      return 'bg-gray-100 text-gray-800'; // A neutral default
  }
};

// NO LONGER NEEDED: The 'status_display' from the API replaces this.
// const getCoiStatusText = (hasConflict) => { ... };

const openCoiModal = (record) => {
  selectedCoiRecord.value = record;
  coiFormData.value = { has_coi: null, remarks: '' };
  submissionError.value = null;
  isCoiModalOpen.value = true;
};

const closeCoiModal = () => {
  isCoiModalOpen.value = false;
  selectedCoiRecord.value = null;
};

// --- Form Submission Logic (Unchanged) ---
const submitCoiDeclaration = async () => {
  if (coiFormData.value.has_coi === null) {
    submissionError.value = "Please select whether you have a conflict of interest.";
    return;
  }
  if (coiFormData.value.has_coi === true && !coiFormData.value.remarks.trim()) {
    submissionError.value = "Remarks are required when declaring a conflict of interest.";
    return;
  }
  isSubmitting.value = true;
  submissionError.value = null;
  try {
    const payload = {
      assessor_has_coi: coiFormData.value.has_coi,
      assessor_coi_remarks: coiFormData.value.remarks,
    };
    await apiService.declareAssessorCOI(selectedCoiRecord.value.id, payload);
    await fetchData();
    closeCoiModal();
    alert('COI declaration submitted successfully!');
  } catch (err) {
    console.error("Failed to submit COI declaration:", err);
    submissionError.value = err.response?.data?.detail || "An unexpected error occurred during submission.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>