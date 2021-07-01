<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header with Assign Button -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Conflict of Interest Assessment</h1>
        <p class="text-gray-600">Review and manage assessor COI declarations</p>
      </div>
      <div>
        <button @click="openAssignModal"
          class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
          Assign Assessor
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading data...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading data</h3>
          <div class="mt-2 text-sm text-red-700">{{ error }}</div>
        </div>
      </div>
    </div>

    <!-- Main Table -->
    <div v-else class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institute Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assessor Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COI
                Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Declaration Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{
                item.application_details.application_uid }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                item.application_details.institute_profile_details.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.assessor_details.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getCoiStatusClass(item.institute_has_coi_with_assessor)"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getCoiStatusText(item.institute_has_coi_with_assessor) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{
                formatDate(item.institute_coi_declared_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="viewDetails(item)"
                  class="text-blue-600 hover:text-blue-900 transition-colors duration-200">View Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && coiData.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No COI assessments</h3>
        <p class="mt-1 text-sm text-gray-500">No conflict of interest assessments found.</p>
      </div>
    </div>

    <!-- View Details Modal (CORRECTED & RESTORED) -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div v-if="selectedItem" class="mt-3">
          <div class="flex items-center justify-between pb-4 border-b">
            <h3 class="text-lg font-medium text-gray-900">COI Assessment Details</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="mt-4">
            <div class="mb-6">
              <h4 class="text-md font-semibold text-gray-900 mb-3">Institute Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div><label class="block text-sm font-medium text-gray-700">Institute Name</label>
                  <p class="mt-1 text-sm text-gray-900">{{
                    selectedItem.application_details.institute_profile_details.name }}</p>
                </div>
                <div><label class="block text-sm font-medium text-gray-700">Institute Type</label>
                  <p class="mt-1 text-sm text-gray-900">{{
                    selectedItem.application_details.institute_profile_details.type_details?.name || 'N/A' }}</p>
                </div>
              </div>
            </div>
            <div class="mb-6">
              <h4 class="text-md font-semibold text-gray-900 mb-3">Assessor Information</h4>
              <div class="bg-blue-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label class="block text-sm font-medium text-gray-700">Name</label>
                  <p class="mt-1 text-sm text-gray-900">{{ selectedItem.assessor_details.name }}</p>
                </div>
                <div><label class="block text-sm font-medium text-gray-700">Email</label>
                  <p class="mt-1 text-sm text-gray-900">{{ selectedItem.assessor_details.email }}</p>
                </div>
              </div>
            </div>
            <div class="mb-6">
              <h4 class="text-md font-semibold text-gray-900 mb-3">Conflict of Interest Status</h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex items-center mb-3">
                  <span class="text-sm font-medium text-gray-700 mr-3">Status:</span>
                  <span :class="getCoiStatusClass(selectedItem.institute_has_coi_with_assessor)"
                    class="inline-flex px-3 py-1 text-sm font-semibold rounded-full">
                    {{ getCoiStatusText(selectedItem.institute_has_coi_with_assessor) }}
                  </span>
                </div>
                <div v-if="selectedItem.institute_coi_remarks">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                  <p class="text-sm text-gray-900 bg-white p-3 rounded border">{{ selectedItem.institute_coi_remarks }}
                  </p>

                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end pt-4 border-t">
            <button @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Assessor Modal -->
    <div v-if="isAssignModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <form @submit.prevent="handleAssignSubmit">
          <div class="flex items-center justify-between pb-4 border-b">
            <h3 class="text-lg font-medium text-gray-900">Assign Assessor to Application</h3>
            <button @click="closeAssignModal" type="button" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="mt-4 space-y-6">
            <div>
              <label for="application" class="block text-sm font-medium text-gray-700">Application</label>
              <select id="application" v-model="newCoiForm.application" required
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option disabled :value="null">Select an application</option>
                <option v-for="app in applications" :key="app.id" :value="app.id">{{ app.application_uid }} ({{
                  app.institute_profile_details.name }})</option>
              </select>
            </div>
            <div>
              <label for="assessor" class="block text-sm font-medium text-gray-700">Assessor</label>
              <select id="assessor" v-model="newCoiForm.assessor" required
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option disabled :value="null">Select an assessor</option>
                <option v-for="assr in assessors" :key="assr.id" :value="assr.id">{{ assr.name }} ({{ assr.email }})
                </option>
              </select>
            </div>
            <!-- NOTE: The COI status and remarks are set by the institute/assessor later, not during assignment. Removed them from this form. -->
            <div v-if="assignError" class="bg-red-50 border border-red-200 text-sm text-red-700 rounded-lg p-3">{{
              assignError }}</div>
          </div>
          <div class="flex items-center justify-end pt-6 mt-6 border-t">
            <button @click="closeAssignModal" type="button"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 mr-3">Cancel</button>
            <button type="submit" :disabled="assignLoading"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
              <span v-if="assignLoading">Saving...</span>
              <span v-else>Save Assignment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiService from '@/services/services';

// Reactive data for the main table
const coiData = ref([]);
const loading = ref(true);
const error = ref(null);

// Reactive data for dropdowns (loaded once for efficiency)
const applications = ref([]);
const assessors = ref([]);

// View Details Modal state
const isModalOpen = ref(false);
const selectedItem = ref(null);

// Assign Assessor Modal state
const isAssignModalOpen = ref(false);
const assignLoading = ref(false);
const assignError = ref(null);
const newCoiForm = ref({
  application: null,
  assessor: null,
});

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return coiData.value.slice(start, start + itemsPerPage);
});

// --- LIFECYCLE HOOK ---
onMounted(() => {
  // Fetch all necessary data in parallel for faster loading
  fetchAllData();
});

// --- DATA FETCHING METHODS ---
const fetchAllData = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Run all initial API calls concurrently
    const [coiResponse, appResponse, assessorResponse] = await Promise.all([
      apiService.getApplicationAssessorCOIs(),
      apiService.getAccreditationApplications(),
      apiService.getMastersAssessorPools()
    ]);

    coiData.value = coiResponse.data.results || [];
    applications.value = appResponse.data.results || [];
    assessors.value = assessorResponse.data.results || [];

  } catch (err) {
    error.value = 'Failed to load initial page data. Please try again.';
    console.error('Error fetching initial data:', err);
  } finally {
    loading.value = false;
  }
};

const refreshCoiTable = async () => {
  try {
    const response = await apiService.getApplicationAssessorCOIs();
    coiData.value = response.data.results || [];
  } catch (err) {
    // Handle error without blocking the whole page
    console.error('Failed to refresh COI table:', err);
    // Maybe show a toast notification here
  }
};


// --- HELPER METHODS ---
const getCoiStatusClass = (hasConflict) => {
  if (hasConflict === null || hasConflict === undefined) return 'bg-yellow-100 text-yellow-800'; // Pending
  return hasConflict ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
};

const getCoiStatusText = (hasConflict) => {
  if (hasConflict === null || hasConflict === undefined) return 'Pending Declaration';
  return hasConflict ? 'Conflict Declared' : 'No Conflict';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

// --- VIEW DETAILS MODAL ---
const viewDetails = (item) => {
  selectedItem.value = item;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedItem.value = null;
};

// --- ASSIGN ASSESSOR MODAL ---
const resetAssignForm = () => {
  newCoiForm.value = { application: null, assessor: null };
  assignError.value = null;
};

const openAssignModal = () => {
  resetAssignForm();
  isAssignModalOpen.value = true;
};

const closeAssignModal = () => {
  isAssignModalOpen.value = false;
};

const handleAssignSubmit = async () => {
  if (!newCoiForm.value.application || !newCoiForm.value.assessor) {
    assignError.value = 'Please select both an application and an assessor.';
    return;
  }

  assignLoading.value = true;
  assignError.value = null;

  try {
    // The payload only needs the IDs. The backend handles the rest.
    await apiService.createApplicationAssessorCOI(newCoiForm.value);
    closeAssignModal();
    await refreshCoiTable(); // Refresh just the table data
    // Optionally: show a success notification/toast
  } catch (err) {
    let userFriendlyError = 'An unexpected error occurred. Please try again.';
    if (err.response?.data) {
      const responseData = err.response.data;
      if (responseData.non_field_errors?.[0]?.includes('must make a unique set')) {
        userFriendlyError = 'This assessor has already been assigned to this application.';
      } else if (responseData.detail) {
        userFriendlyError = responseData.detail;
      }
    }
    assignError.value = userFriendlyError;
    console.error('Error creating COI record:', err);
  } finally {
    assignLoading.value = false;
  }
};
</script>
