<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Application List</h2>

    <!-- Tabs -->
    <div class="flex space-x-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'px-4 py-2 rounded-t-lg font-medium transition-colors',
          activeTab === tab.value
            ? 'bg-white text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:bg-gray-100'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Status Filter -->
    <div class="mb-6">
      <select
        v-model="filterStatus"
        class="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Under Process">Under Process</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
        <option value="Suspended">Suspended</option>
      </select>
    </div>

    <!-- Tables for each type -->
    <div v-for="tab in tabs" :key="tab.value">
      <div v-if="activeTab === tab.value" class="overflow-x-auto bg-white rounded-lg shadow">
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
            <tr 
              v-for="app in paginatedApplications(tab.value)" 
              :key="app.id" 
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="py-3 px-4 text-sm text-gray-700">{{ app.id }}</td>
              <td class="py-3 px-4 text-sm text-gray-700">{{ app.fullName }}</td>
              <td class="py-3 px-4 text-sm text-gray-700">{{ app.type }}</td>
              <td class="py-3 px-4 text-sm text-gray-700">
                <span :class="statusClasses(app.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ app.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-700">{{ app.submissionDate }}</td>
              <td class="py-3 px-4 text-sm text-gray-700">
                <button @click="viewDetails(app)" class="text-blue-500 hover:text-blue-700 hover:underline">View</button>
                <button @click="approveApplication(app)" class="text-green-500 hover:text-green-700 hover:underline ml-2">Approve</button>
                <button @click="rejectApplication(app)" class="text-red-500 hover:text-red-700 hover:underline ml-2">Reject</button>
                <button @click="suspendApplication(app)" class="text-purple-500 hover:text-purple-700 hover:underline ml-2">Suspend</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center items-center space-x-4">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-sm text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Modals -->
    <ViewDetailsModal v-if="selectedApplication" :application="selectedApplication" @close="closeModal" />
    <ConfirmationModal
      v-if="showConfirmationModal"
      :message="confirmationMessage"
      :type="actionType"
      @confirm="handleConfirm"
      @cancel="closeConfirmationModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ViewDetailsModal from './modals/ViewDetailsModal.vue';
import ConfirmationModal from './modals/ConfirmationModal.vue';

const tabs = ref([
  { label: 'Registration', value: 'Registration' },
  { label: 'Renewal', value: 'Renewal' },
  { label: 'Re-registration', value: 'Re-registration' },
]);

// Sample data with more statuses
const applications = ref([
  { id: 1, fullName: 'John Doe', type: 'Registration', status: 'Pending', submissionDate: '2023-10-01' },
  { id: 2, fullName: 'Jane Smith', type: 'Renewal', status: 'Under Process', submissionDate: '2023-10-02' },
  { id: 3, fullName: 'Alice Johnson', type: 'Re-registration', status: 'Suspended', submissionDate: '2023-10-03' },
  { id: 4, fullName: 'Bob Wilson', type: 'Registration', status: 'Rejected', submissionDate: '2023-10-04' },
  { id: 5, fullName: 'Charlie Brown', type: 'Renewal', status: 'Approved', submissionDate: '2023-10-05' },
]);

const activeTab = ref('Registration');
const filterStatus = ref('all');
const currentPage = ref(1);
const itemsPerPage = 5;
const selectedApplication = ref(null);
const showConfirmationModal = ref(false);
const confirmationMessage = ref('');
const actionType = ref('');
let actionApplication = null;

const filteredApplications = (type) => {
  return applications.value.filter(app => {
    return app.type === type &&
           (filterStatus.value === 'all' || app.status === filterStatus.value);
  });
};

const paginatedApplications = (type) => {
  const filtered = filteredApplications(type);
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filtered.slice(start, end);
};

const totalPages = computed(() => {
  const filtered = filteredApplications(activeTab.value);
  return Math.ceil(filtered.length / itemsPerPage);
});

const statusClasses = (status) => {
  return {
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-blue-100 text-blue-800': status === 'Under Process',
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-red-100 text-red-800': status === 'Rejected',
    'bg-purple-100 text-purple-800': status === 'Suspended'
  };
};

// Actions
const viewDetails = (app) => {
  selectedApplication.value = app;
};

const approveApplication = (app) => {
  actionApplication = app;
  actionType.value = 'approve';
  confirmationMessage.value = `Are you sure you want to approve ${app.fullName}'s application?`;
  showConfirmationModal.value = true;
};

const rejectApplication = (app) => {
  actionApplication = app;
  actionType.value = 'reject';
  confirmationMessage.value = `Are you sure you want to reject ${app.fullName}'s application?`;
  showConfirmationModal.value = true;
};

const suspendApplication = (app) => {
  actionApplication = app;
  actionType.value = 'suspend';
  confirmationMessage.value = `Are you sure you want to suspend ${app.fullName}'s application?`;
  showConfirmationModal.value = true;
};

const handleConfirm = () => {
  switch(actionType.value) {
    case 'approve':
      actionApplication.status = 'Approved';
      break;
    case 'reject':
      actionApplication.status = 'Rejected';
      break;
    case 'suspend':
      actionApplication.status = 'Suspended';
      break;
  }
  closeConfirmationModal();
};

const closeModal = () => {
  selectedApplication.value = null;
};

const closeConfirmationModal = () => {
  showConfirmationModal.value = false;
  actionType.value = '';
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
</script>