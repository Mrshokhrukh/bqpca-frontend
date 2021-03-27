<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <!-- Inline Notification -->
    <Transition name="notification">
      <div v-if="notification.show" :class="[
        'fixed right-4 top-4 p-4 rounded-md shadow-lg flex items-center z-50 max-w-md',
        notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
          notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
            'bg-blue-50 border-l-4 border-blue-500'
      ]">
        <div :class="[
        'flex-shrink-0 w-6 h-6',
        notification.type === 'success' ? 'text-green-500' :
          notification.type === 'error' ? 'text-red-500' :
            'text-blue-500'
      ]">
          <svg v-if="notification.type === 'success'" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="notification.type === 'error'" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 :class="[
        'text-sm font-medium',
        notification.type === 'success' ? 'text-green-800' :
          notification.type === 'error' ? 'text-red-800' :
            'text-blue-800'
      ]">
            {{ notification.title }}
          </h3>
          <p :class="[
        'text-sm mt-1',
        notification.type === 'success' ? 'text-green-700' :
          notification.type === 'error' ? 'text-red-700' :
            'text-blue-700'
      ]">
            {{ notification.message }}
          </p>
        </div>
        <button @click="closeNotification" class="ml-4 text-gray-500 hover:text-gray-600">
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Header Card -->
    <div class="m mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">CPD Applications</h1>
        <div class="flex mt-4 space-x-6">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-gray-600">Total: {{ applications.length }}</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span class="text-gray-600">Pending: {{ pendingCount }}</span>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd" />
            </svg>
          </div>
          <input v-model="searchQuery" type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Search by name, CID or registration number...">
        </div>
        <select v-model="statusFilter"
          class="w-full md:w-64 block pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading applications...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredApplications.length === 0"
        class="bg-white shadow-sm rounded-lg py-16 text-center border border-gray-200">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-base font-medium text-gray-900">No applications found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ applications.length > 0
        ? 'No applications match your current filters.'
        : 'No CPD applications have been submitted for review.' }}
        </p>
      </div>

      <!-- Applications Table -->
      <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPD Title</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date</th>
                <th scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="app in paginatedApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ app.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ app.applicantName }}</div>
                  <div class="text-xs text-gray-500">{{ app.cidNumber }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ app.title }}</div>
                  <div class="text-xs text-gray-500">{{ app.activityType }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[getStatusColor(app.status), 'px-2 py-1 text-xs font-medium rounded-full']">
                    {{ app.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ app.date }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button @click="openViewModal(app)" class="text-blue-600 hover:text-blue-900 font-medium text-sm">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to <span class="font-medium">{{
        paginationEnd }}</span> of <span class="font-medium">{{ filteredApplications.length }}</span> results
              </p>
            </div>
            <div class="flex">
              <button @click="prevPage" :disabled="currentPage === 1"
                :class="[currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50', 'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white']">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                :class="[currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50', 'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white']">
                Next
                <svg class="h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <CpdViewApplicationsModal v-if="isViewModalOpen" :application="selectedApplication" @save="saveApplication"
      @approve="approveApplication" @reject="rejectApplication" @close="closeViewModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import CpdViewApplicationsModal from '../modals/CpdViewApplicationsModal.vue';
import apiServices from '@/services/services';

const applications = ref([]);
const selectedApplication = ref(null);
const isViewModalOpen = ref(false);
const loading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('All');
const currentPage = ref(1);
const pageSize = ref(10);

// Notification state
const notification = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  timeout: null
});

// Calculate pending applications count
const pendingCount = computed(() => {
  return applications.value.filter(app => app.status === 'Pending').length;
});

// Filter applications based on search query and status filter
const filteredApplications = computed(() => {
  let filtered = applications.value;

  // Apply status filter if not "All"
  if (statusFilter.value !== 'All') {
    filtered = filtered.filter(app => app.status === statusFilter.value);
  }

  //Exclude draft applications
  filtered = filtered.filter(app => app.status !== 'Draft');

  // Apply search filter if there's a search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(app =>
      app.applicantName.toLowerCase().includes(query) ||
      app.cidNumber.toString().includes(query) ||
      app.title.toLowerCase().includes(query) ||
      (app.registrationNumber && app.registrationNumber.toString().includes(query))
    );
  }

  return filtered;
});


// Pagination logic
const totalPages = computed(() => {
  return Math.ceil(filteredApplications.value.length / pageSize.value) || 1;
});

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value;
});

const paginationEnd = computed(() => {
  return Math.min(paginationStart.value + pageSize.value, filteredApplications.value.length);
});

const paginatedApplications = computed(() => {
  return filteredApplications.value.slice(paginationStart.value, paginationEnd.value);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Reset pagination when filters change
const resetPagination = () => {
  currentPage.value = 1;
};

// Use watch to reset pagination when searchQuery or statusFilter changes
watch([searchQuery, statusFilter], () => {
  resetPagination();
});

const showNotification = (type, title, message, duration = 5000) => {
  // Clear any existing timeout
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout);
  }

  // Set notification values
  notification.value = {
    show: true,
    type,
    title,
    message,
    timeout: null
  };

  // Auto close after duration
  if (duration > 0) {
    notification.value.timeout = setTimeout(() => {
      closeNotification();
    }, duration);
  }
};

const closeNotification = () => {
  notification.value.show = false;
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout);
    notification.value.timeout = null;
  }
};

const getStatusColor = (status) => {
  return {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Draft': 'bg-gray-100 text-gray-800'
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

const saveApplication = async (updatedApp) => {
  try {
    loading.value = true;

    // Changed to use the CPD Task API endpoint
    await apiServices.patchEpcCpdTask(updatedApp.id, {
      credit: updatedApp.cpdCredits
    });

    const index = applications.value.findIndex((a) => a.id === updatedApp.id);
    if (index !== -1) {
      applications.value[index] = { ...applications.value[index], ...updatedApp };
    }

    showNotification('success', 'Application Updated', 'The CPD credits have been updated successfully.');

    // Refresh the data to ensure we have the latest state
    await fetchApplications();
  } catch (err) {
    console.error('Failed to save application:', err);
    showNotification('error', 'Update Failed', 'There was an error updating the application. Please try again.');
  } finally {
    loading.value = false;
  }
};

const approveApplication = async (applicationData) => {
  try {
    loading.value = true;
    console.log('Application data received for approval:', applicationData);

    // Ensure applicationData is not null or undefined
    if (!applicationData) {
      console.error("Application data is null or undefined.");
      showNotification('error', 'Approval Failed', 'Invalid application data. Please try again.');
      return;
    }

    // Create a defensive copy of the application
    const updatedApplication = { ...applicationData };

    // Initialize participants array if it's missing or not an array
    if (!updatedApplication.participants || !Array.isArray(updatedApplication.participants)) {
      console.warn("Participants is not an array or is null/undefined - initializing empty array");
      updatedApplication.participants = [];

      // If there are no participants, directly update the application status
      const patchData = {
        review_status: 'Approved',  // Set the application's status to approved
        id: updatedApplication.id
      };

      // Update the application status in the database
      await apiServices.patchEpcCpdTask(updatedApplication.id, patchData);

      showNotification('success', 'Application Approved', 'The CPD application has been approved successfully.');
      closeViewModal();
      await fetchApplications();
      return;
    }

    // Process participants if they exist
    if (updatedApplication.participants.length > 0) {
      // Create an array to collect participants that need updating
      const participantsToUpdate = [];

      // Iterate through the participants
      for (const participant of updatedApplication.participants) {
        // Skip invalid participant objects
        if (!participant || typeof participant !== 'object') continue;

        // Check if the participant's review status needs to be updated
        if (participant.review_status && participant.review_status !== 'Pending') {
          participantsToUpdate.push({
            id: participant.id,
            review_status: participant.review_status,
            review_remarks: participant.review_remarks || '',
            cpd_credits_for_participant: participant.cpd_credits_for_participant || 0
          });
        }
      }

      // If we have participants to update, send the request
      if (participantsToUpdate.length > 0) {
        const patchData = {
          participants: participantsToUpdate,
          review_status: 'Approved'  // Also update the application's status
        };

        // Send the PATCH request to update the CPD task in the database
        await apiServices.patchEpcCpdTask(updatedApplication.id, patchData);

        // Update the application data in the component's state
        const appIndex = applications.value.findIndex(app => app.id === updatedApplication.id);
        if (appIndex !== -1) {
          applications.value[appIndex].status = 'Approved';

          // Update each participant in the local state
          for (const updatedParticipant of participantsToUpdate) {
            const participantIndex = applications.value[appIndex].participants.findIndex(p => p.id === updatedParticipant.id);
            if (participantIndex !== -1) {
              Object.assign(applications.value[appIndex].participants[participantIndex], updatedParticipant);
            }
          }
        }
      } else {
        // If no participants need updating, just update the application status
        const patchData = {
          review_status: 'Approved'
        };

        await apiServices.patchEpcCpdTask(updatedApplication.id, patchData);
      }
    } else {
      // If there are no participants, directly update the application status
      const patchData = {
        review_status: 'Approved'
      };

      await apiServices.patchEpcCpdTask(updatedApplication.id, patchData);
    }

    showNotification('success', 'Application Approved', 'The CPD application has been approved successfully.');

    // Close the modal
    closeViewModal();

    // Refresh the data to ensure we have the latest state
    await fetchApplications();
  } catch (err) {
    console.error('Failed to approve application:', err);
    showNotification('error', 'Approval Failed', 'There was an error approving the application. Please try again.');
  } finally {
    loading.value = false;
  }
};

const rejectApplication = async (rejectionData) => {
  try {
    loading.value = true;
    console.log('Application data received for rejection:', rejectionData);

    // Ensure rejectionData is not null or undefined
    if (!rejectionData) {
      console.error("Rejection data is null or undefined.");
      showNotification('error', 'Rejection Failed', 'Invalid application data. Please try again.');
      return;
    }

    // Create a defensive copy of the application
    const updatedApplication = { ...rejectionData };

    // Initialize participants array if it's missing or not an array
    if (!updatedApplication.participants || !Array.isArray(updatedApplication.participants)) {
      console.warn("Participants is not an array or is null/undefined - initializing empty array");
      updatedApplication.participants = [];

      // If there are no participants, directly update the application status
      const patchData = {
        review_status: 'Rejected',  // Set the application's status to rejected
        id: updatedApplication.id,
        review_remarks: updatedApplication.remarks || ''
      };

      // Update the application status in the database
      await apiServices.patchEpcCpdTask(updatedApplication.id, patchData);

      showNotification('success', 'Application Rejected', 'The CPD application has been rejected.');
      closeViewModal();
      await fetchApplications();
      return;
    }

    // Process participants if they exist
    if (updatedApplication.participants.length > 0) {
      // Create an array to collect participants that need updating
      const participantsToUpdate = [];

      // Iterate through the participants
      for (const participant of updatedApplication.participants) {
        // Skip invalid participant objects
        if (!participant || typeof participant !== 'object') continue;

        // Check if the participant's review status needs to be updated
        if (participant.review_status && participant.review_status !== 'Pending') {
          participantsToUpdate.push({
            id: participant.id,
            review_status: participant.review_status || 'Rejected',
            review_remarks: participant.review_remarks || '',
            cpd_credits_for_participant: participant.cpd_credits_for_participant || 0
          });
        }
      }

      // If we have participants to update, send the request
      if (participantsToUpdate.length > 0) {
        const patchData = {
          participants: participantsToUpdate,
          review_status: 'Rejected',  // Also update the application's status
          review_remarks: updatedApplication.remarks || ''
        };

        // Send the PATCH request to update the CPD task in the database
        await apiServices.patchMhpcCpdTask(updatedApplication.id, patchData);

        // Update the application data in the component's state
        const appIndex = applications.value.findIndex(app => app.id === updatedApplication.id);
        if (appIndex !== -1) {
          applications.value[appIndex].status = 'Rejected';

          // Update each participant in the local state
          for (const updatedParticipant of participantsToUpdate) {
            const participantIndex = applications.value[appIndex].participants.findIndex(p => p.id === updatedParticipant.id);
            if (participantIndex !== -1) {
              Object.assign(applications.value[appIndex].participants[participantIndex], updatedParticipant);
            }
          }
        }
      } else {
        // If no participants need updating, just update the application status
        const patchData = {
          review_status: 'Rejected',
          review_remarks: updatedApplication.remarks || ''
        };

        await apiServices.patchMhpcCpdTask(updatedApplication.id, patchData);
      }
    } else {
      // If there are no participants, directly update the application status
      const patchData = {
        review_status: 'Rejected',
        review_remarks: updatedApplication.remarks || ''
      };

      await apiServices.patchMhpcCpdTask(updatedApplication.id, patchData);
    }

    showNotification('success', 'Application Rejected', 'The CPD application has been rejected.');

    // Close the modal
    closeViewModal();

    // Refresh the data to ensure we have the latest state
    await fetchApplications();
  } catch (err) {
    console.error('Failed to reject application:', err);
    showNotification('error', 'Rejection Failed', 'There was an error rejecting the application. Please try again.');
  } finally {
    loading.value = false;
  }
};

// Function to fetch applications (can be reused for refreshing data)
const fetchApplications = async () => {
  try {
    loading.value = true;
    // Changed to use the CPD Task API endpoint
    const response = await apiServices.getMhpcCpdTask();

    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      processApiResponse(response.data.results);
    } else if (response.results && Array.isArray(response.results)) {
      processApiResponse(response.results);
    } else {
      applications.value = [];
    }
  } catch (err) {
    console.error('Failed to fetch applications:', err);
    showNotification('error', 'Load Failed', 'There was an error loading the CPD applications.');
    applications.value = [];
  } finally {
    loading.value = false;
  }
};

// Function to process API response data
const processApiResponse = (results) => {
  applications.value = results.map(item => ({
    id: item.id,
    title: item.title_of_cpd || 'N/A',
    applicantName: item.full_name || 'Unknown',
    // For CPD tasks, we need to check different status fields
    status: getTaskStatus(item),
    date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
    registrationNumber: item.registration_no,
    cidNumber: item.cid_no || 'N/A',
    fullName: item.full_name || 'Unknown',
    gender: item.gender || 'Not specified',
    cpdTitle: item.title_of_cpd || 'N/A',
    relevance: item.relevance_to_topic || 'Not specified',
    // For CPD tasks, we need to check fields differently
    participationCategory: getParticipationCategory(item),
    participantSubCategory: getParticipantSubcategory(item),
    activityType: getActivityType(item),
    attachment: item.attachment ? {
      name: item.attachment.split('/').pop(),
      url: item.attachment
    } : null,
    // Credit may be stored differently in CPD tasks
    cpdCredits: item.credit || 0,
    reviewStatus: item.review_status || 'Pending',
    remarks: item.remark || '',
    // Additional CPD task specific fields
    isDraft: item.is_draft || false,
    expected_outcome: item.expected_outcome || '',
    venue: item.venue || '',
    fromDate: item.from_date ? new Date(item.from_date).toLocaleDateString() : 'N/A',
    toDate: item.to_date ? new Date(item.to_date).toLocaleDateString() : 'N/A',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    participants: item.participants || []
  }));
};

// Helper functions to extract and format data from CPD tasks
const getTaskStatus = (item) => {
  if (item.is_draft) return 'Draft';
  return item.review_status || 'Pending';
};

const getParticipationCategory = (item) => {
  if (item.participation_category) {
    return typeof item.participation_category === 'object' ?
      item.participation_category.participation_category_name : 'Not specified';
  }
  return 'Not specified';
};

const getParticipantSubcategory = (item) => {
  if (item.participant_sub_category) {
    return typeof item.participant_sub_category === 'object' ?
      item.participant_sub_category.participation_sub_category_name : 'Not specified';
  }
  return 'Not specified';
};

const getActivityType = (item) => {
  if (item.type_of_cpd) {
    return typeof item.type_of_cpd === 'object' ?
      item.type_of_cpd.cme_activity_name : 'Not specified';
  }
  return 'Not specified';
};

onMounted(() => {
  fetchApplications();
});
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
