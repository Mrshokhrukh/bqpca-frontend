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
              <p class="text-xl font-bold text-gray-800">{{ totalRenewalsCount }}</p>
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
              <p class="text-xl font-bold text-gray-800">{{ pendingRenewalsCount }}</p>
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
              <p class="text-xl font-bold text-gray-800">{{ approvedRenewalsCount }}</p>
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
              <p class="text-xs font-semibold text-gray-500 uppercase">Regretted</p>
              <p class="text-xl font-bold text-gray-800">{{ rejectedRenewalsCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main heading -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">ECPF Renewal Applications - Chief Review</h2>
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
              <option value="Regretted">Regretted</option>
              <option value="On Hold">On Hold</option>
              <option value="Corrective Measures Required">Corrective Measures Required</option>
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
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PAYMENT STATUS</th>
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
                  <span :class="getPaymentStatusClasses(application.paymentStatus)">
                    {{ application.paymentStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(application.status)">
                    {{ application.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewApplication(application)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      View/Edit
                    </button>
                    <button
                      :disabled="application.paymentStatus !== 'paid'"
                      :class="[application.paymentStatus === 'paid' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed']"
                      class="text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                      @click="approveApplication(application)"  
                    >
                      Approve  <!-- Renamed button label -->
                    </button>
                    <button
                      @click="regretApplication(application)"
                      class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      Regret
                    </button>
                    <button
                      @click="holdApplication(application)"
                      class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      Hold
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredApplications.length === 0">
                <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No applications found.</td>
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
              Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredApplications.length }}</span> of <span class="font-medium">{{ totalRenewalsCount }}</span> results
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
    <ECPFRenewalModal
      v-if="isModalOpen"
      :application="selectedApplication"
      @close="closeModal"
    />
    <CorrectiveMeasureModal
      v-if="isCorrectiveModalOpen"
      :application="selectedApplication"
      @close="closeCorrectiveModal"
      @save="saveCorrectiveMeasures"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ECPFRenewalModal from './modals/ECPFRenewalModal.vue'; // Assuming you have a modal for viewing/editing details


import apiServices from '@/services/services';

const searchQuery = ref('');
const statusFilter = ref('');
const isModalOpen = ref(false);
const selectedApplication = ref(null);
const isCorrectiveModalOpen = ref(false);
const correctiveMeasuresInput = ref('');

const applications = ref([]); // Initialize as empty array to be populated by API

// Dashboard Summary Counts
const totalRenewalsCount = computed(() => applications.value.length);
const pendingRenewalsCount = computed(() => applications.value.filter(app => app.status.toLowerCase() === 'pending').length);
const approvedRenewalsCount = computed(() => applications.value.filter(app => app.status.toLowerCase() === 'approved').length);
const rejectedRenewalsCount = computed(() => applications.value.filter(app => app.status.toLowerCase() === 'regretted').length);


const filteredApplications = computed(() => {
  return applications.value.filter(application => {
    const searchLower = searchQuery.value.toLowerCase();
    const statusLower = statusFilter.value.toLowerCase();

    const matchesSearch =
      !searchQuery.value ||
      application.applicant_name.toLowerCase().includes(searchLower) || // Assuming API returns applicant_name
      application.ecpf_name.toLowerCase().includes(searchLower) ||       // Assuming API returns ecpf_name
      application.previous_ecpf_info.toLowerCase().includes(searchLower); // Assuming API returns previous_ecpf_info

    const matchesStatus =
      !statusFilter.value || application.status.toLowerCase() === statusLower;

    return matchesSearch && matchesStatus;
  });
});

const getStatusClasses = (status) => {
  return  [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
    {
      'bg-yellow-100 text-yellow-800': status.toLowerCase() === 'pending',
      'bg-green-100 text-green-800': status.toLowerCase() === 'approved',
      'bg-red-100 text-red-800': status.toLowerCase() === 'regretted', // Changed 'rejected' to 'regretted'
      'bg-blue-100 text-blue-800': status.toLowerCase() === 'on hold', // Assuming 'In Review' is replaced by 'On Hold' or similar
      'bg-gray-100 text-gray-800': status.toLowerCase() === 'corrective measures required',
    }
  ];
};

const getPaymentStatusClasses = (status) => {
  return  [
    'px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
    {
      'bg-green-200 text-green-800': status.toLowerCase() === 'paid',
      'bg-yellow-200 text-yellow-800': status.toLowerCase() === 'pending',
      'bg-gray-200 text-gray-800': status.toLowerCase() === 'not paid', // Add more status classes as needed
    }
  ];
};


const viewApplication = (application) => {
  selectedApplication.value = application;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

const approveApplication = async (application) => { // Renamed function to `approveApplication`
  if (application.paymentStatus !== 'paid') {
    alert('Payment must be made before approving this application.');
    return;
  }

  try {
    await apiServices.patchEcpfRenewal(application.id, { status: 'Approved' }); // Or 'Accepted', check backend status options
    // Simulate email notification and eRecommendation letter generation
    console.log('Email notification sent to applicant for approval.');
    console.log('eRecommendation letter generated and available for download.');
    alert(`Application for ${application.applicant_name} has been Approved.`); // Updated alert message

    // Update local data after successful API call
    const index = applications.value.findIndex(app => app.id === application.id);
    if (index !== -1) {
      applications.value[index].status = 'Approved'; // Update status in local array
    }
  } catch (error) {
    console.error('Error approving application:', error); // Updated error message
    alert('Failed to approve application. Please try again.'); // Updated alert message
  }
};

const regretApplication = (application) => {
  selectedApplication.value = application;
  isCorrectiveModalOpen.value = true; // Open corrective measure modal
};

const closeCorrectiveModal = () => {
  isCorrectiveModalOpen.value = false;
  selectedApplication.value = null;
  correctiveMeasuresInput.value = ''; // Clear input if needed
};

const saveCorrectiveMeasures = async (measures) => {
  if (!selectedApplication.value) return;

  try {
    await apiServices.patchEcpfRenewal(selectedApplication.value.id, {
      status: 'Corrective Measures Required', // Or 'Rejected with Corrections', check backend status options
      corrective_measures: measures // Assuming backend field is corrective_measures
    });
    console.log(`Application for ${selectedApplication.value.applicant_name} marked as Regretted with corrective measures.`);
    alert(`Application for ${selectedApplication.value.applicant_name} marked as Regretted and Applicant is asked for Corrective Measures.`);
    closeCorrectiveModal();

     // Update local data after successful API call
    const index = applications.value.findIndex(app => app.id === selectedApplication.value.id);
    if (index !== -1) {
      applications.value[index].status = 'Corrective Measures Required'; // Update status in local array
    }

  } catch (error) {
    console.error('Error regretting application with corrective measures:', error);
    alert('Failed to regret application and request corrective measures. Please try again.');
  }
};


const holdApplication = async (application) => {
  try {
    await apiServices.patchEcpfRenewal(application.id, { status: 'On Hold' }); // Or 'Hold', check backend status options
    console.log(`Application for ${application.applicant_name} placed on hold.`);
    alert(`Application for ${application.applicant_name} has been placed On Hold.`);

     // Update local data after successful API call
    const index = applications.value.findIndex(app => app.id === application.id);
    if (index !== -1) {
      applications.value[index].status = 'On Hold'; // Update status in local array
    }
  } catch (error) {
    console.error('Error putting application on hold:', error);
    alert('Failed to put application on hold. Please try again.');
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

onMounted(async () => {
  try {
    const response = await apiServices.getEcpfRenewals();
    applications.value = response.data.results; // Assuming API response.data is the array of applications
    console.log("ECPF Renewal Applications Fetched:", applications.value);
  } catch (error) {
    console.error("Error fetching ECPF renewal applications:", error);
    alert("Failed to load ECPF renewal applications. Please check console for details.");
  }
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>