<template>
    <div class="p-4 bg-gray-50 min-h-screen">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Application List</h2>
  
      <!-- Filters -->
      <div class="flex space-x-4 mb-6">
        <select v-model="filterType" class="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All</option>
          <option value="registration">Registration</option>
          <option value="renewal">Renewal</option>
          <option value="cogs">CoGS</option>
          <option value="additional-qualification">Additional Qualification</option>
        </select>
        <select v-model="filterStatus" class="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
  
      <!-- Table -->
      <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Application ID</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Applicant Name</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Type</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Submission Date</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="app in paginatedApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
              <td class="py-3 px-4 text-sm text-gray-700">{{ app.id }}</td>
              <td class="py-3 px-4 text-sm text-gray-700">{{ app.fullName }}</td>
              <td class="py-3 px-4 text-sm text-gray-700">{{ app.type }}</td>
              <td class="py-3 px-4 text-sm text-gray-700">
                <span :class="{
                  'bg-yellow-100 text-yellow-800': app.status === 'Pending',
                  'bg-green-100 text-green-800': app.status === 'Approved',
                  'bg-red-100 text-red-800': app.status === 'Rejected'
                }" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ app.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-700">{{ app.submissionDate }}</td>
              <td class="py-3 px-4 text-sm text-gray-700">
                <button @click="viewDetails(app)" class="text-blue-500 hover:text-blue-700 hover:underline">View</button>
                <button @click="approveApplication(app)" class="text-green-500 hover:text-green-700 hover:underline ml-2">Approve</button>
                <button @click="rejectApplication(app)" class="text-red-500 hover:text-red-700 hover:underline ml-2">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Pagination -->
      <div class="mt-6 flex justify-center items-center space-x-4">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          Previous
        </button>
        <span class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          Next
        </button>
      </div>
  
      <!-- Modals -->
      <ViewDetailsModal v-if="selectedApplication" :application="selectedApplication" @close="closeModal" />
      <ConfirmationModal v-if="showConfirmationModal" :message="confirmationMessage" @confirm="handleConfirm" @cancel="closeConfirmationModal" />
    </div>
  </template>
  
  <script setup>
import { ref, computed } from 'vue';
import ViewDetailsModal from './modals/ViewDetailsModal.vue';
import ConfirmationModal from './modals/ConfirmationModal.vue';

// Sample data (replace with API call)
const applications = ref([
  { id: 1, fullName: 'John Doe', type: 'Registration', status: 'Pending', submissionDate: '2023-10-01' },
  { id: 2, fullName: 'Jane Smith', type: 'Renewal', status: 'Approved', submissionDate: '2023-10-02' },
  { id: 3, fullName: 'Alice Johnson', type: 'CoGS', status: 'Rejected', submissionDate: '2023-10-03' },
]);

// Filters
const filterType = ref('all');
const filterStatus = ref('all');

// Pagination
const currentPage = ref(1);
const itemsPerPage = 5;

// Selected application for modal
const selectedApplication = ref(null);
const showConfirmationModal = ref(false);
const confirmationMessage = ref('');
let actionApplication = null;

// Computed properties
const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    return (filterType.value === 'all' || app.type === filterType.value) &&
           (filterStatus.value === 'all' || app.status === filterStatus.value);
  });
});

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredApplications.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / itemsPerPage));

// Actions
const viewDetails = (app) => {
  selectedApplication.value = app;
};

const approveApplication = (app) => {
  actionApplication = app;
  confirmationMessage.value = `Are you sure you want to approve ${app.fullName}'s application?`;
  showConfirmationModal.value = true;
};

const rejectApplication = (app) => {
  actionApplication = app;
  confirmationMessage.value = `Are you sure you want to reject ${app.fullName}'s application?`;
  showConfirmationModal.value = true;
};

const handleConfirm = (rejectionMessage = '') => {
  if (confirmationMessage.value.includes('approve')) {
    actionApplication.status = 'Approved';
  } else {
    actionApplication.status = 'Rejected';
    actionApplication.rejectionMessage = rejectionMessage; // Add rejection message
  }
  closeConfirmationModal();
};

const closeModal = () => {
  selectedApplication.value = null;
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
};

// Pagination
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
</script>
  
  <style scoped>
  /* Additional custom styles can be added here if needed */
  </style>