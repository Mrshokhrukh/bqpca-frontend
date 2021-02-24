<template>
  <div class="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800">Review CPD Applications</h2>
        <p class="mt-1 text-sm text-gray-500">Manage and review continuing professional development applications</p>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPD ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date</th>
                <th scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ app.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ app.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ app.applicantName }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[getStatusColor(app.status), 'px-2 py-1 text-xs font-medium rounded-full']">
                    {{ app.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ app.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center justify-center space-x-2">
                    <!-- View Button -->
                    <button @click="openViewModal(app)"
                      class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>

                    <!-- Approve Button -->
                    <button @click="openApproveModal(app)"
                      class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors">
                      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>

                    <!-- Reject Button -->
                    <button @click="openRejectModal(app)"
                      class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors">
                      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- View/Edit Modal -->
    <CpdViewApplicationsModal v-if="isViewModalOpen" :application="selectedApplication" @edit="openEditModal"
      @close="closeViewModal" />

    <!-- Edit Modal -->
    <CpdEditApplicationModal v-if="isEditModalOpen" :application="selectedApplication" @save="saveApplication"
      @close="closeEditModal" />

    <!-- Approve Modal -->
    <div v-if="isApproveModalOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="absolute right-0 top-0 pr-4 pt-4">
              <button @click="closeApproveModal" class="rounded-md bg-white text-gray-400 hover:text-gray-500">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-base font-semibold leading-6 text-gray-900">Approve Application</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Please provide any notes or comments for this approval.</p>
                </div>
                <div class="mt-4">
                  <textarea v-model="approvalMessage" rows="4"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    placeholder="Enter approval notes..."></textarea>
                </div>
              </div>
            </div>

            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button @click="approveApplication"
                class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">
                Approve Application
              </button>
              <button @click="closeApproveModal"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="isRejectModalOpen" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div class="absolute right-0 top-0 pr-4 pt-4">
              <button @click="closeRejectModal" class="rounded-md bg-white text-gray-400 hover:text-gray-500">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-base font-semibold leading-6 text-gray-900">Reject Application</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Please provide a reason for rejecting this application. This message
                    will be sent to the applicant.</p>
                </div>
                <div class="mt-4">
                  <textarea v-model="rejectionMessage" rows="4"
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6"
                    placeholder="Enter rejection reason..."></textarea>
                </div>
              </div>
            </div>

            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button @click="rejectApplication"
                class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                Reject Application
              </button>
              <button @click="closeRejectModal"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CpdViewApplicationsModal from './modals/CpdViewApplicationsModal.vue';
import CpdEditApplicationModal from './modals/CpdEditApplicationModal.vue';
import apiServices from '@/services/services';

const applications = ref([]); // Initialize as empty array
const selectedApplication = ref(null);
const isViewModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isRejectModalOpen = ref(false);
const isApproveModalOpen = ref(false);
const rejectionMessage = ref('');
const approvalMessage = ref('');

const getStatusColor = (status) => {
  return {
    'Pending': 'bg-yellow-100 text-yellow-900',
    'Approved': 'bg-green-100 text-green-900',
    'Rejected': 'bg-red-100 text-red-900'
  }[status] || 'bg-gray-100 text-gray-800';
};

const openViewModal = (app) => {
  selectedApplication.value = app;
  isViewModalOpen.value = true;
};

const closeViewModal = () => {
  isViewModalOpen.value = false;
  selectedApplication.value = null;
};

const openEditModal = (app) => {
  selectedApplication.value = { ...app }; // Create a copy of the application
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedApplication.value = null;
};

const saveApplication = (updatedApp) => {
  const index = applications.value.findIndex((a) => a.id === updatedApp.id);
  if (index !== -1) {
    applications.value[index] = updatedApp;
  }
  closeEditModal();
};

const openApproveModal = (app) => {
  selectedApplication.value = app;
  isApproveModalOpen.value = true;
};

const closeApproveModal = () => {
  isApproveModalOpen.value = false;
  approvalMessage.value = '';
  selectedApplication.value = null;
};

const approveApplication = () => {
  const index = applications.value.findIndex((a) => a.id === selectedApplication.value.id);
  if (index !== -1) {
    applications.value[index].status = 'Approved';
    applications.value[index].remarks = approvalMessage.value || 'Application approved';
  }
  closeApproveModal();
};

const openRejectModal = (app) => {
  selectedApplication.value = app;
  isRejectModalOpen.value = true;
};

const closeRejectModal = () => {
  isRejectModalOpen.value = false;
  rejectionMessage.value = '';
  selectedApplication.value = null;
};

const rejectApplication = () => {
  const index = applications.value.findIndex((a) => a.id === selectedApplication.value.id);
  if (index !== -1) {
    applications.value[index].status = 'Rejected';
    applications.value[index].remarks = rejectionMessage.value || 'Application rejected without remarks.';
  }
  closeRejectModal();
};

onMounted(async () => {
  try {
    const response = await apiServices.getBmhcCpdRecords();
    if (response && response.results) {
      // Map the API response to the structure expected by your component
      applications.value = response.results.map(item => ({
        id: item.id, // or item.registration_no if you prefer to use registration number as ID
        title: item.title_of_cpd,
        applicantName: item.full_name,
        status: item.review_status,
        date: new Date(item.created_at).toLocaleDateString(), // Format date as needed
        registrationNumber: item.registration_no,
        cidNumber: item.cid_no,
        fullName: item.full_name,
        gender: item.gender,
        cpdTitle: item.title_of_cpd,
        relevance: item.relevance_to_profession,
        participationCategory: item.participation_category?.participation_category_name, // Safe access in case of null
        participantSubCategory: item.participant_sub_category?.participation_sub_category_name, // Safe access in case of null
        activityType: item.type_of_cpd_activity?.cpd_activity_name, // Safe access in case of null
        attachment: item.attachment ? { name: item.attachment } : null, // Handle attachment structure
        cpdCredits: item.cpd_credit,
        reviewStatus: item.review_status,
        remarks: item.remark,
      }));
    } else {
      console.error('Error fetching CPD records: Unexpected response format', response);
      // Optionally set applications.value to an empty array or display an error message to the user
      applications.value = [];
    }
  } catch (error) {
    console.error('Error fetching CPD records:', error);
    // Optionally set applications.value to an empty array or display an error message to the user
    applications.value = [];
  }
});
</script>
<style scoped>
.review-application {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
}

button {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  resize: vertical;
}
</style>
