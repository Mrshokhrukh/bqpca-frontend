<!-- IndividualEcpfApplications.vue -->
<template>
  <div class="p-8 min-h-screen">
    <div class=" mx-auto">
      <!-- Header with stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <!-- SVG -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Total Applications</p>
              <!-- Use computed total count -->
              <p class="text-xl font-bold text-gray-800">{{ totalApplicationsCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <!-- SVG -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Pending Review</p>
              <!-- Use computed pending count -->
              <p class="text-xl font-bold text-gray-800">{{ pendingCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <!-- SVG -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Shortlisted</p>
              <!-- Use computed shortlisted count -->
              <p class="text-xl font-bold text-gray-800">{{ shortlistedCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <!-- SVG -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Approved</p>
              <!-- Use computed approved count -->
              <p class="text-xl font-bold text-gray-800">{{ approvedCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main heading -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">New ECPF Establishment Applications</h2>
      </div>

      <!-- Filter/Search bar (remains the same) -->
      <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input type="text"
                class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, CID, or firm...">
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant
                  Name</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CID No.
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Firm Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact No.
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Application
                  Status</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="application in applications" :key="application.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold mr-3">
                      <!-- Ensure correct field name -->
                      {{ getInitials(application.applicants_name) }}
                    </div>
                    <div>
                      <!-- Ensure correct field name -->
                      <div class="text-sm font-medium text-gray-900">{{ application.applicants_name }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.cid_no }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.proposed_firm_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.contact_no }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <!-- Use derived status -->
                  <span :class="getStatusClasses(getApplicationStatus(application))">
                    {{ getApplicationStatus(application) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="viewApplication(application)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                      View
                    </button>
                    <!-- Add Forward Button back if needed for this view -->
                    <!-- <button
                      @click="forwardApplication(application)"
                      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      Forward
                    </button> -->
                  </div>
                </td>
              </tr>
              <tr v-if="!loading && applications.length === 0">
                <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No applications
                  found.</td>
              </tr>
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">Loading
                  applications...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination (remains the same, adjust logic if implementing pagination fully) -->
      <div class="flex items-center justify-between py-4">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">1</span> to <span class="font-medium">{{ applications.length }}</span>
              of <span class="font-medium">{{ totalApplicationsCount }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <button aria-current="page"
                class="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">1</button>
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <ecpf-application-modal :is-open="isModalOpen" :application="selectedApplication" @close="closeModal"
      @update-final-decision="handleFinalDecisionUpdate" @generate-recommendation-letter="handleGenerateLetter"
      @register-ecpf="handleRegisterEcpf" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; // Import computed
import EcpfApplicationModal from './modals/IndividualEcpfModal.vue'; // Make sure path is correct
import apiServices from '@/services/services'; // Make sure path is correct

// --- Data ---
const applications = ref([]);
const selectedApplication = ref(null);
const isModalOpen = ref(false);
const loading = ref(false);

// --- Helper function to determine status ---
const getApplicationStatus = (app) => {
  if (!app) return 'Unknown';
  if (app.chief_decision === 'Approved') return 'Approved';
  if (app.chief_decision === 'Regret') return 'Rejected'; // Final rejection by Chief
  if (app.presentation_decision === 'Regret') return 'Rejected'; // Rejection after presentation
  if (app.verification_decision === 'Regret') return 'Rejected'; // Rejection after verification
  if (app.presentation_decision === 'Shortlisted') return 'Shortlisted';
  if (app.verification_decision === 'Pending Review') return 'Pending Review';
  if (app.is_draft) return 'Draft';
  // Default status if none of the above match and not draft
  return 'Pending Review'; // Or 'Submitted' etc.
};


// --- Functions ---
const fetchApplications = async () => {
  loading.value = true;
  try {
    const response = await apiServices.getEcpfProfiles();
    if (response.status === 200 && response.data && Array.isArray(response.data.results)) {
      // --- MODIFICATION START ---
      // Assign ALL results directly without filtering here
      applications.value = response.data.results;
      // --- MODIFICATION END ---

      console.log("Fetched applications:", applications.value); // Add a log to verify

    } else {
      console.error('Failed to fetch applications or invalid data structure:', response);
      applications.value = [];
      alert('Failed to load applications. Please check the console for errors.');
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    applications.value = [];
    alert('Error loading applications. Please check the console for errors.');
  } finally {
    loading.value = false;
  }
};

const viewApplication = (application) => {
  console.log("Viewing application:", application); // Debug log
  selectedApplication.value = application;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

// --- Handlers for Modal Events ---
const handleFinalDecisionUpdate = async (updateData) => {
  console.log('Final Decision Update Received in Parent:', updateData);
  if (!updateData || !updateData.id) {
    alert('Error: Invalid data received for update.');
    return;
  }
  try {
    // Assuming updateData contains { id: ..., chief_decision: 'Approved'/'Regret', chief_remarks_if_regret: '...' }
    const response = await apiServices.updateChiefDecision(updateData.id, updateData); // Adjust service call as needed
    if (response.status === 200 || response.status === 204) {
      alert('Final decision updated successfully.');
      fetchApplications(); // Refresh the list
    } else {
      alert('Failed to update final decision. Status: ' + response.status);
      console.error("Failed update response:", response);
    }
  } catch (error) {
    alert('An error occurred while updating the final decision.');
    console.error("Error updating final decision:", error);
  }
};

const handleGenerateLetter = (data) => {
  console.log('Generate Recommendation Letter Request:', data);
  // TODO: Implement API call to backend to generate and possibly download the letter
  alert(`Generate recommendation letter for application ID: ${data.id || data.cidNo}`);
};

const handleRegisterEcpf = (data) => {
  console.log('Register ECPF Request:', data);
  // TODO: Implement API call to backend to finalize registration with license details
  alert(`Register ECPF for application ID: ${data.id || data.cidNo}`);
};


// --- Styling and Display Helpers ---
const getStatusClasses = (status) => {
  // Map derived status to classes
  const statusMap = {
    'Pending Review': 'bg-yellow-100 text-yellow-800',
    'Shortlisted': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Approved': 'bg-blue-100 text-blue-800',
    'Draft': 'bg-gray-100 text-gray-800',
    'Unknown': 'bg-gray-100 text-gray-800',
  };
  return [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
    statusMap[status] || 'bg-gray-100 text-gray-800' // Default fallback
  ];
};

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

// --- Computed Properties for Counts ---
// Use the getApplicationStatus helper for accurate counts
const totalApplicationsCount = computed(() => applications.value.length);
const pendingCount = computed(() => applications.value.filter(app => getApplicationStatus(app) === 'Pending Review').length);
const shortlistedCount = computed(() => applications.value.filter(app => getApplicationStatus(app) === 'Shortlisted').length);
const approvedCount = computed(() => applications.value.filter(app => getApplicationStatus(app) === 'Approved').length);

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchApplications();
});
</script>