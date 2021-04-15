<template>
  <div class="min-h-screen bg-gray-50">
    <div class=" mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10 shadow-md">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Certificate of Good Standing Applications</h1>
            <p class="text-gray-600">Manage and review COGS applications.</p>
          </div>
          <div class="flex space-x-4">
            <div class="relative">
              <input v-model.trim="searchQuery" type="text" placeholder="Search by name, CID, or registration number..."
                class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80 shadow-sm" />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon class="w-5 h-5" />
              </span>
            </div>
            <select v-model="statusFilter"
              class="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 mr-4">
              <ClipboardCheckIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Total Applications</p>
              <p class="text-2xl font-bold text-gray-900">{{ applications.length }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 mr-4">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Pending</p>
              <p class="text-2xl font-bold text-gray-900">{{ getPendingCount() }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Approved</p>
              <p class="text-2xl font-bold text-gray-900">{{ getApprovedCount() }}</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl p-6 shadow-md border-l-4 border-red-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 mr-4">
              <XCircleIcon class="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Rejected</p>
              <p class="text-2xl font-bold text-gray-900">{{ getRejectedCount() }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-md">
        <Loader2Icon class="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p class="text-gray-600 font-medium">Loading applications...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 mb-6 shadow-md">
        <div class="flex items-center">
          <CircleAlert class="w-8 h-8 text-red-500 mr-4" />
          <div>
            <h3 class="text-lg font-bold text-red-800">An error occurred</h3>
            <p class="text-red-700 mt-1">{{ error }}</p>
            <button @click="fetchData"
              class="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-medium">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="group px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors">
                  <div class="flex items-center">
                    Registration No.
                    <ArrowUpDownIcon class="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant Details
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="application in displayedApplications" :key="application.id"
                class="hover:bg-blue-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">{{ application.registration_no }}</div>
                  <div class="text-xs text-gray-500">ID: {{ application.id }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-start">
                    <div
                      class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {{ getInitials(application.full_name) }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ application.full_name }}</div>
                      <div class="text-xs text-gray-500 mt-1">CID: {{ application.cid_no }}</div>
                      <div class="text-xs text-gray-500">{{ application.email_address }}</div>
                      <div class="text-xs text-gray-500">Contact: {{ application.contact_number }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ application.supervisor_name }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ application.supervisor_designation }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="space-y-2">
                    <span :class="getStatusClass(application.review_status)"
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                      <span class="w-2 h-2 rounded-full mr-1 mt-1.5"
                        :class="getStatusDotClass(application.review_status)"></span>
                      Review: {{ application.review_status }}
                    </span>
                    <span :class="getStatusClass(application.endorsement_decision)"
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                      <span class="w-2 h-2 rounded-full mr-1 mt-1.5"
                        :class="getStatusDotClass(application.endorsement_decision)"></span>
                      Endorsement: {{ application.endorsement_decision }}
                    </span>
                    <span v-if="application.is_payment_complete"
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      <span class="w-2 h-2 rounded-full bg-green-500 mr-1 mt-1.5"></span>
                      Payment Complete
                    </span>
                    <span v-else
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      <span class="w-2 h-2 rounded-full bg-yellow-500 mr-1 mt-1.5"></span>
                      Payment Pending
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex flex-col space-y-2">
                    <button @click="reviewApplication(application)"
                      class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                      <EyeIcon class="h-4 w-4 mr-1" />
                      View / Edit
                    </button>
                    <button v-if="application.endorsement_decision === 'Approved'"
                      @click="downloadCertificate(application.id)"
                      class="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                      <DownloadIcon class="h-4 w-4 mr-1" />
                      Certificate
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!displayedApplications.length && !isLoading && applications.length > 0" class="text-center py-16">
          <div class="mx-auto h-24 w-24 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <InboxIcon class="h-12 w-12" />
          </div>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
          <p class="mt-1 text-gray-500 max-w-md mx-auto">No COGS applications match your current search criteria. Try
            adjusting your filters or search terms.</p>
          <button @click="resetFilters"
            class="mt-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium">
            Reset Filters
          </button>
        </div>
      </div>

      <div v-if="totalPages > 1" class="mt-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-md">
        <div class="text-sm text-gray-700 flex items-center">
          <span class="font-medium">Page {{ currentPage }}</span> of {{ totalPages }}
          <span class="ml-4 text-gray-500">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredApplications.length) }}
            of {{ filteredApplications.length }} applications
          </span>
        </div>
        <div class="flex space-x-2">
          <button @click="currentPage = 1" :disabled="currentPage === 1"
            class="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronsLeftIcon class="w-5 h-5" />
          </button>
          <button @click="currentPage--" :disabled="currentPage === 1"
            class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
            <ChevronLeftIcon class="w-5 h-5 mr-1" />
            Prev
          </button>
          <button @click="currentPage++" :disabled="currentPage === totalPages"
            class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
            Next
            <ChevronRightIcon class="w-5 h-5 ml-1" />
          </button>
          <button @click="currentPage = totalPages" :disabled="currentPage === totalPages"
            class="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronsRightIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <CogsReviewModal v-if="isModalOpen" :isOpen="isModalOpen" :application="selectedApplication"
      @close="closeReviewModal" @update="handleUpdate" />

    <CogsConfirmationModal v-if="showConfirmation" :message="confirmationMessage" @confirm="confirmReviewAction"
      @cancel="cancelReviewAction" />

    <div v-if="showSuccessToast"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center transition-all duration-300"
      :class="{ 'opacity-100 translate-y-0': showSuccessToast, 'opacity-0 translate-y-8': !showSuccessToast }">
      <CheckCircleIcon class="w-5 h-5 mr-2" />
      <span>{{ toastMessage }}</span>
      <button @click="showSuccessToast = false" class="ml-4 text-white hover:text-green-200">
        <XIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Loader2Icon, SearchIcon, CircleAlert, InboxIcon, ClipboardCheckIcon,
  ClockIcon, CheckCircleIcon, XCircleIcon, EyeIcon, DownloadIcon,
  ArrowUpDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon,
  ChevronsRightIcon, XIcon
} from 'lucide-vue-next' // Ensure all used icons are imported
import apiServices from '@/services/services' // Adjust path if necessary
import CogsReviewModal from '../modals/CogsReviewModal.vue' // Adjust path if necessary
import CogsConfirmationModal from '../modals/CogsConfirmationModal.vue' // Adjust path if necessary

// --- State ---
const applications = ref([])
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10) // Items per page
const selectedApplication = ref(null) // For the modal data
const isModalOpen = ref(false); // *** ADDED: State to control modal visibility ***
const showConfirmation = ref(false) // Confirmation modal visibility
const confirmationMessage = ref('') // Confirmation message
const showSuccessToast = ref(false) // Success toast visibility
const toastMessage = ref('') // Success toast message
const confirmData = ref(null) // Data payload for confirmed action

// --- Computed Properties ---

// Calculate counts for dashboard stats
const getPendingCount = () => applications.value.filter(app => app.review_status === 'Pending' || app.endorsement_decision === 'Pending').length;
const getApprovedCount = () => applications.value.filter(app => app.endorsement_decision === 'Approved').length;
const getRejectedCount = () => applications.value.filter(app => app.review_status === 'Rejected' || app.endorsement_decision === 'Rejected').length;

// Get initials for avatar placeholder
const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
};

// Filter applications based on search query and status filter
const filteredApplications = computed(() => {
  let filtered = applications.value;
  if (statusFilter.value) {
    filtered = filtered.filter(app =>
      app.review_status === statusFilter.value || app.endorsement_decision === statusFilter.value
    );
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(app =>
      (app.full_name && app.full_name.toLowerCase().includes(query)) ||
      (app.cid_no && app.cid_no.toLowerCase().includes(query)) ||
      (app.registration_no && app.registration_no.toLowerCase().includes(query))
    );
  }
  return filtered;
});

// Calculate total pages for pagination
const totalPages = computed(() => Math.max(1, Math.ceil(filteredApplications.value.length / itemsPerPage.value)));

// Get applications for the current page
const displayedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredApplications.value.slice(start, end);
});

// --- Methods ---

// Fetch COGS applications from the API
const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await apiServices.getMhpcCogs(); // Ensure this service method exists
    applications.value = response.data?.results || response.data || []; // Handle potential API response structures
  } catch (err) {
    error.value = 'Failed to load applications. Please try again later.';
    console.error('Error fetching applications:', err);
    applications.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Get CSS classes for status badges
const getStatusClass = (status) => {
  const classes = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Processing': 'bg-blue-100 text-blue-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800'; // Default style
};

// Get CSS classes for status indicator dots
const getStatusDotClass = (status) => {
  const classes = {
    'Pending': 'bg-yellow-500',
    'Approved': 'bg-green-500',
    'Rejected': 'bg-red-500',
    'Processing': 'bg-blue-500',
  };
  return classes[status] || 'bg-gray-500'; // Default style
};

// Reset search and filter controls
const resetFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  // currentPage.value = 1; // Watcher handles this
};

// *** UPDATED: Open the modal ***
const reviewApplication = (application) => {
  selectedApplication.value = application; // Set the data for the modal
  isModalOpen.value = true; // Set the flag to open the modal
};

// *** UPDATED: Close the modal ***
const closeReviewModal = () => {
  selectedApplication.value = null; // Clear the data
  isModalOpen.value = false; // Set the flag to close the modal
};

// Handle the update event emitted from the Review Modal
const handleUpdate = (data) => {
  // This data payload should contain the changed fields from the modal
  confirmData.value = data; // Store data for confirmation step

  // Determine action type for confirmation message
  const action = data.review_status || data.endorsement_decision || 'update';
  const type = data.review_status ? 'review' : (data.endorsement_decision ? 'endorsement' : 'application');

  confirmationMessage.value = `Are you sure you want to ${action.toLowerCase()} this ${type}?`;
  showConfirmation.value = true; // Show confirmation modal
};

// Confirm the update action (called after user confirms in CogsConfirmationModal)
const confirmReviewAction = async () => {
  showConfirmation.value = false;
  if (!confirmData.value || !selectedApplication.value) return;

  isLoading.value = true; // Show loading state during API call
  error.value = null;

  try {
    // Call the PATCH API service with the application ID and the changed data
    const response = await apiServices.patchMhpcCogs(selectedApplication.value.id, confirmData.value);

    if (response.status === 200) { // Check for successful response
      // Update the local application list reactively
      const index = applications.value.findIndex(app => app.id === selectedApplication.value.id);
      if (index !== -1) {
        // Merge existing data with response data for robustness
        const updatedApp = { ...applications.value[index], ...response.data };
        // Create a new array to trigger reactivity
        const newApplications = [...applications.value];
        newApplications[index] = updatedApp;
        applications.value = newApplications;
      }

      // Show success feedback
      const action = confirmData.value.review_status || confirmData.value.endorsement_decision || 'updated';
      const type = confirmData.value.review_status ? 'Review' : (confirmData.value.endorsement_decision ? 'Endorsement' : 'Application');
      toastMessage.value = `${type} ${action.toLowerCase()} successfully`;
      showSuccessToast.value = true;
      setTimeout(() => { showSuccessToast.value = false; }, 3000); // Auto-hide toast

      closeReviewModal(); // Close the review modal
    } else {
      // Handle unexpected success statuses if needed
      console.error("Update API returned non-200 status:", response.status, response.data);
      error.value = `Failed to update. Server responded with status ${response.status}.`;
    }
  } catch (err) {
    // Handle API errors
    console.error('Error updating application:', err.response?.data || err.message || err);
    error.value = `Failed to update application: ${err.response?.data?.detail || err.message || 'Please try again.'}`;
  } finally {
    isLoading.value = false;
    confirmData.value = null; // Clear staged data
  }
};

// Cancel the update action (called from CogsConfirmationModal)
const cancelReviewAction = () => {
  showConfirmation.value = false;
  confirmData.value = null; // Clear staged data
};

// Download certificate function (ensure service exists and handles blob response)
const downloadCertificate = async (id) => {
  // Add loading indicator specifically for download if needed
  try {
    // Ensure apiServices.downloadCogsCertificate exists and returns response with blob data and headers
    const response = await apiServices.downloadCogsCertificate(id); // Make sure this service method exists

    if (response.status === 200 && response.data instanceof Blob) {
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = `COGS_Certificate_${id}.pdf`; // Default
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Show success feedback
      toastMessage.value = 'Certificate downloaded successfully';
      showSuccessToast.value = true;
      setTimeout(() => { showSuccessToast.value = false; }, 3000);

    } else {
      throw new Error('Invalid response received for download');
    }
  } catch (err) {
    console.error('Error downloading certificate:', err);
    error.value = 'Failed to download certificate. Please try again.';
  } finally {
    // Turn off specific download loading indicator if used
  }
};


// --- Watchers ---

// Reset pagination when filters change
watch([searchQuery, statusFilter], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  }
});

// --- Lifecycle Hooks ---

// Fetch initial data when component mounts
onMounted(fetchData);
</script>

<style scoped>
/* Optional: Add smooth transitions for hover states */
.hover\:bg-blue-50:hover {
  transition: background-color 0.2s ease-in-out;
}

/* Optional: Add box shadow transition */
.shadow-md,
.shadow-lg {
  transition: box-shadow 0.2s ease-in-out;
}

/* Optional: Add subtle hover effect to the table rows with a left border indicator */
tbody tr {
  position: relative;
}

tbody tr:hover::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #3b82f6;
  /* Tailwind's blue-500 */
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  transition: background-color 0.2s ease-in-out;
}

/* Ensure pagination buttons have clear focus styles for accessibility */
button:focus-visible {
  outline: 2px solid #2563eb;
  /* Tailwind's blue-600 */
  outline-offset: 2px;
}

/* Smooth transition for the toast notification */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

.translate-y-8 {
  transform: translateY(2rem);
}

.translate-y-0 {
  transform: translateY(0);
}
</style>
