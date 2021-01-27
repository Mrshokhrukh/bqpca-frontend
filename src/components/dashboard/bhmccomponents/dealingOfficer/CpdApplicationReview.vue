<template>
    <div class="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-slate-800">Review CPD Applications</h2>
          <p class="mt-1 text-sm text-slate-500">Manage and review continuing professional development applications</p>
        </div>
  
        <!-- Main Content -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">CPD ID</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applicant</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                <tr v-for="app in applications" :key="app.id" class="hover:bg-slate-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{{ app.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{ app.title }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ app.applicantName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[getStatusColor(app.status), 'px-2 py-1 text-xs font-medium rounded-full']">
                      {{ app.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{{ app.date }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center justify-center space-x-2">
                      <!-- View Button -->
                      <button 
                        @click="openViewModal(app)"
                        class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      
                      <!-- Edit Button -->
                      <button 
                        @click="openEditModal(app)"
                        class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      
                      <!-- Reject Button -->
                      <button 
                        @click="openRejectModal(app)"
                        class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
  
      <!-- View Modal -->
      <CpdViewApplicationsModal 
        v-if="isViewModalOpen" 
        :application="selectedApplication" 
        @close="closeViewModal" 
      />
  
      <!-- Edit Modal -->
      <CpdEditApplicationModal 
        v-if="isEditModalOpen" 
        :application="selectedApplication" 
        @save="saveApplication" 
        @close="closeEditModal" 
      />
  
      <!-- Reject Modal -->
      <div v-if="isRejectModalOpen" class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity">
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div class="absolute right-0 top-0 pr-4 pt-4">
                <button @click="closeRejectModal" class="rounded-md bg-white text-slate-400 hover:text-slate-500">
                  <span class="sr-only">Close</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 class="text-base font-semibold leading-6 text-slate-900">Reject Application</h3>
                  <div class="mt-2">
                    <p class="text-sm text-slate-500">Please provide a reason for rejecting this application. This message will be sent to the applicant.</p>
                  </div>
                  <div class="mt-4">
                    <textarea
                      v-model="rejectionMessage"
                      rows="4"
                      class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
                      placeholder="Enter rejection reason..."
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  @click="rejectApplication"
                  class="inline-flex w-full justify-center rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 sm:ml-3 sm:w-auto"
                >
                  Reject Application
                </button>
                <button
                  @click="closeRejectModal"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
                >
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
  import { ref } from 'vue';
  import CpdViewApplicationsModal from './modals/CpdViewApplicationsModal.vue'; // Import View Modal
  import CpdEditApplicationModal from './modals/CpdEditApplicationModal.vue'; // Import Edit Modal
  
  // Sample data
  const applications = ref([
    {
      id: 1,
      title: 'Microbiology Workshop',
      applicantName: 'John Doe',
      status: 'Pending',
      date: '2025-01-15',
      registrationNumber: '12345',
      cidNumber: 'CID123456',
      fullName: 'John Doe',
      gender: 'Male',
      cpdTitle: 'Microbiology Workshop',
      relevance: 'Highly relevant to medical professionals',
      participationCategory: 'Participant',
      participantSubCategory: 'Attendee',
      activityType: 'Workshop',
      attachment: { name: 'workshop_certificate.pdf' },
      cpdCredits: 2.5,
      reviewStatus: 'Pending',
      remarks: 'Pending review',
    },
    {
      id: 2,
      title: 'ISO Standards Seminar',
      applicantName: 'Jane Smith',
      status: 'Approved',
      date: '2025-01-20',
      registrationNumber: '67890',
      cidNumber: 'CID654321',
      fullName: 'Jane Smith',
      gender: 'Female',
      cpdTitle: 'ISO Standards Seminar',
      relevance: 'Relevant to quality management professionals',
      participationCategory: 'Presenter',
      participantSubCategory: 'Speaker',
      activityType: 'Seminar',
      attachment: { name: 'seminar_certificate.pdf' },
      cpdCredits: 3.0,
      reviewStatus: 'Approved',
      remarks: 'Excellent presentation skills',
    },
  ]);
  
  const selectedApplication = ref(null);
  const isViewModalOpen = ref(false);
  const isEditModalOpen = ref(false);
  const isRejectModalOpen = ref(false);
  const rejectionMessage = ref('');
  
  const getStatusColor = (status) => {
    return {
      'Pending': 'bg-amber-100 text-amber-900',
      'Approved': 'bg-emerald-100 text-emerald-900',
      'Rejected': 'bg-rose-100 text-rose-900'
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
    border: 1px solid #ddd;
    text-align: left;
  }
  
  th {
    background-color: #f0f0f0;
  }
  
  button {
    padding: 8px 12px;
    margin: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .icon {
    font-size: 16px;
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