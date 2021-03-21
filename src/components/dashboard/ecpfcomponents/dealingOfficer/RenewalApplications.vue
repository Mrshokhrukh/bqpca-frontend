<template>
  <div class="p-8 min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto">
      <!-- Dashboard Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Total Renewals</p>
              <p class="text-xl font-bold text-gray-800">{{ totalRenewals }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Pending</p>
              <p class="text-xl font-bold text-gray-800">{{ pendingRenewals }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Approved</p>
              <p class="text-xl font-bold text-gray-800">{{ approvedRenewals }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Rejected</p>
              <p class="text-xl font-bold text-gray-800">{{ rejectedRenewals }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main heading -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">ECPF Renewal Applications</h2>
      </div>

      <!-- Filter/Search bar -->
      <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                v-model="searchQuery"
                class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, ECPF, etc..."
              />
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select
              v-model="statusFilter"
              class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="In Review">In Review</option>
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
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">APPLICANT NAME</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ECPF NAME</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PREVIOUS ECPF INFO</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STATUS</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACTIONS</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="application in filteredApplications" :key="application.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold mr-3">
                      {{ getInitials(application.applicantName) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ application.applicantName }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ application.ecpfName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ application.previousEcpfInfo }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(application.status)">
                    {{ application.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="openModal(application)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                      @click="forwardApplication(application)"
                    >
                      Forward
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredApplications.length === 0">
                <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No applications found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination (Basic Example - Adjust as needed) -->
      <div class="flex items-center justify-between py-4">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredApplications.length }}</span> of <span class="font-medium">{{ totalApplications }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Renewal Application Modal -->
    <RenewalModal
      v-if="isModalOpen"
      :application="selectedApplication"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import RenewalModal from './modals/ECPFRenewalModal.vue';
import apiServices from '@/services/services'; // Import your API service

const searchQuery = ref('');
const statusFilter = ref('');
const isModalOpen = ref(false);
const selectedApplication = ref(null);
const applications = ref([]); // Store applications fetched from API
const totalApplications = ref(0);

const fetchApplications = async () => {
  try {
    const response = await apiServices.getEcpfRenewals();
    console.log('API Response:', response); // Log the entire response
    console.log('API Response Data:', response.data.results); // Log just the data

    if (response.status === 200 && Array.isArray(response.data.results)) {
      applications.value = response.data.results;
      totalApplications.value = response.data.length; // Assuming API returns all applications for now
    } else {
      console.error('API Error: Invalid response or data format', response);
      alert('Failed to fetch applications. Please check the console for details.');
      applications.value = []; // Initialize as empty array to prevent errors
      totalApplications.value = 0;
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    alert('An unexpected error occurred while fetching applications. Please check the console for details.');
    applications.value = []; // Initialize as empty array in case of fetch error
    totalApplications.value = 0;
  }
};

const filteredApplications = computed(() => {
  if (!Array.isArray(applications.value)) { // Defensive check: applications.value is an array?
    console.warn('applications.value is not a valid array in filteredApplications computed property.', applications.value);
    return []; // Return empty array to avoid errors
  }
  return applications.value.filter(application => {
    const searchLower = searchQuery.value.toLowerCase();
    const statusLower = statusFilter.value.toLowerCase();

    const matchesSearch =
      !searchQuery.value ||
      application.applicantName?.toLowerCase().includes(searchLower) || // Added optional chaining
      application.ecpfName?.toLowerCase().includes(searchLower) || // Added optional chaining
      application.previousEcpfInfo?.toLowerCase().includes(searchLower); // Added optional chaining

    const matchesStatus =
      !statusFilter.value || application.status?.toLowerCase() === statusLower; // Added optional chaining

    return matchesSearch && matchesStatus;
  });
});

const getStatusClasses = (status) => {
  return  [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
    {
      'bg-yellow-100 text-yellow-800': status?.toLowerCase() === 'pending', // Added optional chaining
      'bg-green-100 text-green-800': status?.toLowerCase() === 'approved', // Added optional chaining
      'bg-red-100 text-red-800': status?.toLowerCase() === 'rejected', // Added optional chaining
      'bg-blue-100 text-blue-800': status?.toLowerCase() === 'in review', // Added optional chaining
      'bg-gray-100 text-gray-800': status?.toLowerCase() === 'draft', // If you have 'Draft' status // Added optional chaining
    }
  ];
};

const openModal = (application) => {
  selectedApplication.value = application;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

const forwardApplication = async (application) => {
  try {
    await apiServices.patchEcpfRenewal(application.id, { status: 'In Review' }); // Example: Forward to 'In Review'
    // Optimistically update the status in the local array
    const index = applications.value.findIndex(app => app.id === application.id);
    if (index !== -1) {
      applications.value[index].status = 'In Review';
    }
    alert(`Application for ${application.applicantName} has been forwarded for review.`);
    updateSummaryCards(); // Update summary card counts
  } catch (error) {
    console.error('Error forwarding application:', error);
    alert('Failed to forward application.'); // Better error handling needed
  }
};

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

// Summary card calculations - Defensive checks for array
const totalRenewals = computed(() => Array.isArray(applications.value) ? applications.value.length : 0);
const pendingRenewals = computed(() => Array.isArray(applications.value) ? applications.value.filter(app => app.status?.toLowerCase() === 'pending').length : 0); // Added optional chaining
const approvedRenewals = computed(() => Array.isArray(applications.value) ? applications.value.filter(app => app.status?.toLowerCase() === 'approved').length : 0); // Added optional chaining
const rejectedRenewals = computed(() =>  Array.isArray(applications.value) ? applications.value.filter(app => app.status?.toLowerCase() === 'rejected').length : 0); // Added optional chaining

const updateSummaryCards = () => {
  // Re-calculate summary card values.  (They are already reactive)
};


onMounted(() => {
  fetchApplications();
});
</script>