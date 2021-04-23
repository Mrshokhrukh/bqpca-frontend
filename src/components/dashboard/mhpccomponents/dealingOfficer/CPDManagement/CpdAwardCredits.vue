<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <!-- Notification System -->
    <Transition name="notification">
       <div
        v-if="notification.show"
        :class="[
          'fixed right-4 top-4 p-4 rounded-md shadow-lg flex items-center z-50 max-w-md',
          notification.type === 'success'
            ? 'bg-green-50 border-l-4 border-green-500'
            : notification.type === 'error'
              ? 'bg-red-50 border-l-4 border-red-500'
              : 'bg-blue-50 border-l-4 border-blue-500',
        ]"
      >
        <!-- Notification Icon -->
        <div
          :class="[
            'flex-shrink-0 w-6 h-6',
            notification.type === 'success'
              ? 'text-green-500'
              : notification.type === 'error'
                ? 'text-red-500'
                : 'text-blue-500',
          ]"
        >
          <svg v-if="notification.type === 'success'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          <svg v-else-if="notification.type === 'error'" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <!-- Notification Text -->
        <div class="ml-3">
          <h3 :class="['text-sm font-medium', notification.type === 'success' ? 'text-green-800' : notification.type === 'error' ? 'text-red-800' : 'text-blue-800']">
            {{ notification.title }}
          </h3>
          <p :class="['text-sm mt-1', notification.type === 'success' ? 'text-green-700' : notification.type === 'error' ? 'text-red-700' : 'text-blue-700']">
            {{ notification.message }}
          </p>
        </div>
        <!-- Notification Close Button -->
        <button @click="closeNotification" class="ml-4 text-gray-500 hover:text-gray-600">
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </Transition>

    <!-- Main Content Area -->
     <div class="mx-auto w-full"> <!-- Added max-width for better large screen layout -->
      <!-- Header Card -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Self CPD Applications</h1>
        <div class="flex flex-wrap mt-4 gap-x-6 gap-y-2"> <!-- Use flex-wrap and gap -->
          <div class="flex items-center">
            <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span class="text-gray-600 text-sm">Total: {{ participants.length }}</span>
          </div>
           <div class="flex items-center">
             <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
             <span class="text-gray-600 text-sm">Pending: {{ pendingCount }}</span>
           </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
             <span class="text-gray-600 text-sm">Approved: {{ approvedCount }}</span>
          </div>
           <div class="flex items-center">
             <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
             <!-- CHANGED: Label -->
             <span class="text-gray-600 text-sm">Regretted: {{ regrettedCount }}</span>
           </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-700 rounded-full mr-2"></div> <!-- Slightly darker green -->
            <span class="text-gray-600 text-sm">Total Credits (Approved): {{ totalCreditsAwarded }}</span>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="Search by name, registration number or activity..."
          />
        </div>
        <select
          v-model="statusFilter"
          class="w-full md:w-64 block pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <!-- CHANGED: Value and Text -->
          <option value="Regretted">Regretted</option>
        </select>
      </div>


      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex justify-center items-center py-16 bg-white rounded-lg shadow-sm"
      >
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading applications...</span>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredParticipants.length === 0"
        class="bg-white shadow-sm rounded-lg py-16 text-center border border-gray-200"
      >
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <h3 class="mt-2 text-base font-medium text-gray-900">No applications found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ participants.length > 0 ? 'No applications match your current filters.' : 'No self CPD applications have been submitted for review.' }}
        </p>
      </div>


      <!-- Participants Table -->
      <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Number</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPD Activity</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="participant in paginatedParticipants"
                :key="participant.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ participant.fullName }}</div>
                  <div class="text-xs text-gray-500">{{ participant.cidNumber }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ participant.registrationNumber }}</div>
                </td>
                <td class="px-6 py-4 max-w-xs">
                  <div class="text-sm text-gray-900 truncate" :title="participant.cpdTitle">{{ participant.cpdTitle }}</div>
                   <div class="text-xs text-gray-500">{{ participant.activityTypeDisplay }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="text-sm font-medium text-gray-900">
                    {{ participant.cpdCredits ?? 0 }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    :class="[
                      getStatusColor(participant.reviewStatus),
                      'inline-block px-2 py-1 text-xs font-medium rounded-full',
                    ]"
                  >
                    {{ participant.reviewStatus || 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="openDetailsModal(participant)"
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                       <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                     </svg>
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
         <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between items-center">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to
                <span class="font-medium">{{ paginationEnd }}</span> of
                <span class="font-medium">{{ filteredParticipants.length }}</span> results
              </p>
            </div>
            <div class="flex">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                :class="[ currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50', 'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white']"
              >
                <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                :class="[ currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50', 'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white']"
              >
                Next
                <svg class="h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- **** DETAILS MODAL COMPONENT USAGE **** -->
    <!-- This modal now handles its own confirmation internally -->
    <CpdApplicationDetailsModal
        v-model="isDetailsModalVisible"
        :participant="selectedParticipant"
        @approve="handleApproveApplication"
        @reject="handleRejectApplication"
        @awardCredits="handleUpdateCredits"
    />
     <!-- **** END MODAL COMPONENT USAGE **** -->

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiServices from '@/services/services'; // Assuming your API service path
import CpdApplicationDetailsModal from '../modals/AwardCpdCreditsModal.vue'; // Adjust path to your modal component

// --- State ---
const participants = ref([]);
const selectedParticipant = ref(null);
const isDetailsModalVisible = ref(false);
const isLoading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('All');
const currentPage = ref(1);
const pageSize = ref(10); // Adjust page size as needed
const notification = ref({
  show: false,
  type: 'info', // 'success', 'error', 'info'
  title: '',
  message: '',
  timeout: null,
});

// --- Computed properties ---
const totalCreditsAwarded = computed(() => {
  return participants.value
    .filter(p => p.reviewStatus === 'Approved' && typeof p.cpdCredits === 'number')
    .reduce((total, p) => total + p.cpdCredits, 0);
});

const pendingCount = computed(() => participants.value.filter(p => (p.reviewStatus || 'Pending') === 'Pending').length);
const approvedCount = computed(() => participants.value.filter(p => p.reviewStatus === 'Approved').length);
// CHANGED: Computed property name and status check
const regrettedCount = computed(() => participants.value.filter(p => p.reviewStatus === 'Regretted').length);


const filteredParticipants = computed(() => {
  let filtered = participants.value;

  // Filter by status
  if (statusFilter.value !== 'All') {
    // Handle 'Pending' specifically if reviewStatus can be null/undefined
    if (statusFilter.value === 'Pending') {
        filtered = filtered.filter(p => !p.reviewStatus || p.reviewStatus === 'Pending');
    } else {
        filtered = filtered.filter(p => p.reviewStatus === statusFilter.value);
    }
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.fullName?.toLowerCase().includes(query) ||
        p.registrationNumber?.toString().toLowerCase().includes(query) || // Ensure string comparison
        p.cpdTitle?.toLowerCase().includes(query) ||
        p.activityTypeDisplay?.toLowerCase().includes(query) ||
        p.participationCategoryDisplay?.toLowerCase().includes(query) ||
        p.participantSubCategoryDisplay?.toLowerCase().includes(query)
    );
  }
  return filtered;
});

// Pagination Computeds
const totalPages = computed(() => {
  return Math.ceil(filteredParticipants.value.length / pageSize.value) || 1;
});

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value;
});

// Add watcher to handle pagination adjustment
watch([filteredParticipants, totalPages], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

const paginationEnd = computed(() => {
  return Math.min(paginationStart.value + pageSize.value, filteredParticipants.value.length);
});

const paginatedParticipants = computed(() => {
  return filteredParticipants.value.slice(paginationStart.value, paginationEnd.value);
});

// --- Methods ---

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

// Reset to page 1 when filters change
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1;
});

// Notification Methods
const showNotification = (type, title, message, duration = 5000) => {
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout);
  }
  notification.value = {
    show: true,
    type,
    title,
    message,
    timeout: setTimeout(() => closeNotification(), duration > 0 ? duration : 5000),
  };
};

const closeNotification = () => {
  notification.value.show = false;
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout);
    notification.value.timeout = null;
  }
};

// UI Helper
const getStatusColor = (status) => {
    status = status || 'Pending'; // Treat null/undefined as Pending
    return (
        {
            Pending: 'bg-yellow-100 text-yellow-800',
            Approved: 'bg-green-100 text-green-800',
            // CHANGED: Status key
            Regretted: 'bg-red-100 text-red-800',
        }[status] || 'bg-gray-100 text-gray-800' // Fallback for unexpected statuses
    );
};

// Modal Interaction
const openDetailsModal = (participant) => {
  selectedParticipant.value = { ...participant }; // Pass a copy
  isDetailsModalVisible.value = true;
};

// Watch for modal closing to reset selected participant
watch(isDetailsModalVisible, (newValue) => {
    if (!newValue) {
        // Delay slightly to allow closing animation
        setTimeout(() => {
           selectedParticipant.value = null;
        }, 300);
    }
});


// --- Event Handlers for Modal Actions ---

// Handle the '@approve' event from CpdApplicationDetailsModal
const handleApproveApplication = async (payload) => {
  const { participantId, remarks } = payload;
  const participantToUpdate = participants.value.find(p => p.id === participantId);
  if (!participantToUpdate) return handleActionError(participantId, 'approve');

  isLoading.value = true; // Consider a more granular loading state if preferred
  const updatedData = {
    review_status: 'Approved',
    remark: remarks,
    // Credits are handled separately by awardCredits or already set
  };

  try {
      const response = await apiServices.patchMhpcCpdRecord(participantId, updatedData);
      handleActionSuccess(response.data, 'Approved');
  } catch (error) {
      handleActionError(participantId, 'approve', error);
  } finally {
      isLoading.value = false;
  }
  // The modal component should close itself after successfully emitting 'approve'
};

// Handle the '@reject' event from CpdApplicationDetailsModal
const handleRejectApplication = async (payload) => {
  const { participantId, remarks } = payload;
  const participantToUpdate = participants.value.find(p => p.id === participantId);
  if (!participantToUpdate) return handleActionError(participantId, 'regret'); // Changed action name for error

  // The modal should ensure remarks are provided before emitting 'reject' (handled in modal)
  isLoading.value = true;
  const updatedData = {
    // ****** CRITICAL CHANGE HERE ******
    review_status: 'Regretted', // Use 'Regretted' to match backend expectation
    // **********************************
    remark: remarks,
    cpd_credit: 0, // Explicitly set credits to 0 on rejection/regret
  };

  try {
      const response = await apiServices.patchMhpcCpdRecord(participantId, updatedData);
      // CHANGED: Action type text in success handler
      handleActionSuccess(response.data, 'Regretted');
  } catch (error) {
      // CHANGED: Action type text in error handler
      handleActionError(participantId, 'regret', error);
  } finally {
      isLoading.value = false;
  }
   // The modal component should close itself after successfully emitting 'reject'
};

// Handle the '@awardCredits' event from CpdApplicationDetailsModal
const handleUpdateCredits = async (payload) => {
  const { participantId, credits } = payload;
  const participantToUpdate = participants.value.find(p => p.id === participantId);
  if (!participantToUpdate) return handleActionError(participantId, 'update credits');

  // Don't use global isLoading here, maybe a button-specific state in the modal
  const updatedData = {
    cpd_credit: credits,
    // Intentionally not changing status or remarks here
  };

  try {
    const response = await apiServices.patchMhpcCpdRecord(participantId, updatedData);
    const updatedItem = mapApiResponseToParticipant(response.data);

    // Update the main list
    updateLocalParticipant(updatedItem);

    // ** Crucially, update selectedParticipant for immediate modal update **
    if (selectedParticipant.value && selectedParticipant.value.id === participantId) {
         selectedParticipant.value = { ...selectedParticipant.value, cpdCredits: updatedItem.cpdCredits };
    }

    showNotification(
        'success',
        'Credits Updated',
        `Credits for ${updatedItem.fullName} set to ${updatedItem.cpdCredits}.`
    );
  } catch (error) {
      handleActionError(participantId, 'update credits', error);
  }
  // Modal stays open after awarding credits
};

// --- Helper Functions for Actions ---

const handleActionSuccess = (apiResponseData, actionType) => {
    const updatedItem = mapApiResponseToParticipant(apiResponseData);
    updateLocalParticipant(updatedItem);
    showNotification(
        'success',
        // CHANGED: Use dynamic actionType
        `Application ${actionType}`,
        // CHANGED: Use dynamic actionType
        `${updatedItem.fullName}'s application status updated to ${actionType}.`
    );
};

const handleActionError = (participantId, actionType, error = null) => {
    console.error(`Error during ${actionType} for participant ${participantId}:`, error);
    const participantName = participants.value.find(p => p.id === participantId)?.fullName || `ID ${participantId}`;
    // Try to get specific error detail from API response
    const apiErrorMessage = error?.response?.data?.detail || error?.response?.data?.message || error?.message;
    // CHANGED: Wording for failed action
    const fallbackMessage = `Failed to ${actionType} application for ${participantName}.`;
    // CHANGED: Wording for notification title
    const actionTitle = actionType.charAt(0).toUpperCase() + actionType.slice(1);
    showNotification('error', `${actionTitle} Failed`, apiErrorMessage || fallbackMessage);
};

const updateLocalParticipant = (updatedItem) => {
     const index = participants.value.findIndex(p => p.id === updatedItem.id);
     if (index !== -1) {
         // Replace the item in the array to ensure reactivity
         participants.value.splice(index, 1, updatedItem);
     } else {
         console.warn("Tried to update local participant but couldn't find ID:", updatedItem.id);
         // Optionally fetch data again if consistency is critical
         // fetchData();
     }
};

// Helper function to map API response keys to frontend keys
const mapApiResponseToParticipant = (item) => ({
    id: item.id,
    fullName: item.full_name,
    registrationNumber: item.registration_no,
    cpdTitle: item.title_of_cpd,
    cpdCredits: item.cpd_credit, // Ensure this maps correctly
    cidNumber: item.cid_no,
    gender: item.gender,
    relevance: item.relevance_to_profession,
    participationCategoryDisplay: item.participation_category_display || 'N/A',
    participantSubCategoryDisplay: item.participant_sub_category_display || 'N/A',
    activityTypeDisplay: item.type_of_cpd_activity_display || 'N/A',
    attachment: item.attachment ? { url: item.attachment } : null,
    reviewStatus: item.review_status || 'Pending', // Default to Pending if null/undefined
    remarks: item.remark,
});

// --- Data Fetching ---
const fetchData = async () => {
    isLoading.value = true;
    try {
        const response = await apiServices.getMhpcCpdRecords(); // Replace with your actual API call
        if (response && response.data && Array.isArray(response.data.results)) {
            participants.value = response.data.results.map(mapApiResponseToParticipant);
        } else {
            console.error('Error fetching CPD records: Unexpected response format', response);
            participants.value = [];
            showNotification('error', 'Data Loading Failed', 'Received invalid data from server.');
        }
    } catch (error) {
        console.error('Error fetching CPD records:', error);
        participants.value = [];
        // Add specific error message if available
        const apiError = error?.response?.data?.detail || error?.message || 'Failed to connect to the server.';
        showNotification('error', 'Connection Error', `Could not fetch records. ${apiError}`);
    } finally {
        isLoading.value = false;
    }
};

// --- Lifecycle Hook ---
onMounted(() => {
  fetchData(); // Fetch data when component mounts
});
</script>

<style scoped>
/* Notification Animation */
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

/* Ensure modal styles are defined within CpdApplicationDetailsModal.vue */
</style>
