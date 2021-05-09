<!-- eslint-disable vue/multi-word-component-names -->
<!-- Complaints.vue -->
<template>
  <div class="p-4 md:p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Dealing Officer Complaint Dashboard</h1>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold text-gray-700">Total Complaints Received</h2>
        <p class="text-3xl font-bold text-blue-600">{{ totalComplaints }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold text-gray-700">Pending Review</h2>
        <p class="text-3xl font-bold text-yellow-500">{{ pendingReviewCount }}</p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold text-gray-700">Total Adverse Records (Active/Pending)</h2>
        <p class="text-3xl font-bold text-red-500">{{ activeAdverseRecordsCount }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-4 bg-white p-4 rounded-lg shadow">
      <label for="statusFilter" class="block text-sm font-medium text-gray-700 mb-1">Filter by Status:</label>
      <select
        id="statusFilter"
        v-model="statusFilter"
        class="w-full md:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Statuses</option>
        <!-- Assuming complaintStatuses.value is an array of objects like { id: ..., name: ... } -->
        <!-- or an array of strings if your API returns that -->
        <option v-for="statusObj in complaintStatuses" :key="statusObj.id || statusObj" :value="statusObj.name || statusObj">
          {{ statusObj.name || statusObj }}
        </option>
      </select>
    </div>

    <!-- Complaints Table -->
    <div class="bg-white shadow-md rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint ID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complainant</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Received</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnel Involved</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading && !allComplaints.length"> <!-- Show loading only if no complaints yet -->
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">Loading complaints...</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="7" class="px-6 py-4 text-center text-red-500">Error loading complaints: {{ error }}</td>
          </tr>
          <tr v-else-if="filteredComplaints.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-gray-500">No complaints found.</td>
          </tr>
          <!-- ***** MODIFIED SECTION FOR DISPLAYING COMPLAINT DATA ***** -->
          <tr v-for="complaint in filteredComplaints" :key="complaint.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ complaint.complaint_id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate" :title="complaint.grievance_details">
              {{ complaint.grievance_details }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ complaint.submitted_by_name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ formatDate(complaint.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(complaint.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ complaint.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ complaint.professional_name || 'None' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="openManageModal(complaint)"
                class="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors duration-150"
              >
                View / Manage
              </button>
            </td>
          </tr>
          <!-- ********************************************************** -->
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <ComplaintManageModal
      :is-open="isModalOpen"
      :complaint="selectedComplaint"
      :complaint-statuses="complaintStatuses"
      @close="closeModal"
      @updated="handleComplaintUpdated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import ComplaintManageModal from './modals/ComplaintsModal.vue'; // Ensure this path is correct
import apiServices from '@/services/services'; // Adjust path to your API client

// State
const allComplaints = ref([]);
const complaintStatuses = ref([]); // Expecting array of objects like {id: ..., name: ...} or array of strings
const loading = ref(true);
const error = ref(null);
const statusFilter = ref('');
const selectedComplaint = ref(null);
const isModalOpen = ref(false);

// Fetch complaint statuses
const fetchComplaintStatuses = async () => {
  try {
    const response = await apiServices.getComplaintMasterStatuses();
    console.log('Fetched complaint statuses:', response.data);
    // Assuming response.data is an array of status objects or strings
    if (Array.isArray(response.data)) {
        complaintStatuses.value = response.data;
    } else if (response.data && Array.isArray(response.data.results)) { // If it's paginated
        complaintStatuses.value = response.data.results;
    } else {
        console.warn('Complaint statuses not in expected array format:', response.data);
        complaintStatuses.value = [];
    }
  } catch (err) {
    console.error('Failed to fetch complaint statuses:', err);
    // error.value = err.message || 'Failed to fetch complaint statuses.'; // You might not want to overwrite main error
    complaintStatuses.value = []; // Default to empty
  }
};

// Fetch all complaints
const fetchComplaints = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiServices.getComplaints();
    console.log('Fetched all complaints (response.data):', response.data);

    // ***** MODIFIED SECTION FOR HANDLING PAGINATED COMPLAINTS *****
    if (response.data && Array.isArray(response.data.results)) {
      allComplaints.value = response.data.results;
    } else if (Array.isArray(response.data)) {
      // Fallback if the API returns a direct array
      allComplaints.value = response.data;
    } else {
      console.warn("Unexpected data structure for complaints. Expected an array or an object with a 'results' array.");
      allComplaints.value = [];
    }
    // **************************************************************

  } catch (err) {
    console.error('Failed to fetch complaints:', err);
    error.value = err.message || 'Failed to fetch complaints.';
    allComplaints.value = [];
  } finally {
    loading.value = false;
  }
};

// Fetch detailed complaint for modal
const fetchComplaintDetails = async (complaintId) => {
  // Ensure this uses the correct ID for fetching details.
  // If your primary ID is 'id' (the integer), use that.
  // If you need to use 'complaint_id' (the string like "COMP-xxx"), adjust apiServices.getComplaintDetails
  try {
    const response = await apiServices.getComplaintDetails(complaintId); // Assuming complaintId is the PK (e.g., complaint.id)
    return response.data;
  } catch (err) {
    // Don't overwrite main error.value here, let openManageModal handle specific modal errors
    console.error('Failed to fetch complaint details for modal:', err);
    return null;
  }
};

// Initialize data on mount
onMounted(async () => {
  loading.value = true; // Set loading true at the beginning of onMounted
  await Promise.all([fetchComplaintStatuses(), fetchComplaints()]);
  // loading.value = false; // Loading is handled within fetchComplaints finally block
});

// Computed properties
const filteredComplaints = computed(() => {
  if (!allComplaints.value || !Array.isArray(allComplaints.value)) { // Guard against non-array
      return [];
  }
  if (!statusFilter.value) {
    return allComplaints.value;
  }
  return allComplaints.value.filter(c => c.status === statusFilter.value);
});

const totalComplaints = computed(() => {
    return allComplaints.value && Array.isArray(allComplaints.value) ? allComplaints.value.length : 0;
});

const pendingReviewCount = computed(() => {
    if (!allComplaints.value || !Array.isArray(allComplaints.value)) return 0;
    // Adjust 'Pending Review' if your actual status string from backend is different
    return allComplaints.value.filter(c => c.status === 'Pending Review' || c.status === 'Submitted').length;
});

const activeAdverseRecordsCount = computed(() => {
  if (!allComplaints.value || !Array.isArray(allComplaints.value)) return 0;
  // Ensure these status strings match exactly what your backend provides
  const nonAdverseStatuses = ['Dismissed', 'Resolved - No Action', 'Closed', 'Resolved']; // Add all "good" or "closed" statuses
  return allComplaints.value.filter(c => !nonAdverseStatuses.includes(c.status)).length;
});

// Modal handling
const openManageModal = async (complaint) => {
  const modalLoadingIndicator = ref(true); // Optional: for modal specific loading
  error.value = null; // Clear previous main errors
  try {
    // Use complaint.id (the integer PK) if your getComplaintDetails expects that.
    // If it expects complaint.complaint_id (the string), use that.
    const detailedComplaint = await fetchComplaintDetails(complaint.id);
    if (detailedComplaint) {
      selectedComplaint.value = detailedComplaint;
      isModalOpen.value = true;
    } else {
      // Handle error specific to fetching modal details, e.g., show a toast or modal error message
      console.error('Unable to load complaint details for modal.');
      // Optionally set a local error for the modal: selectedComplaint.value = { error: '...' };
    }
  } catch (error) {
    console.error('Error opening manage modal:', error);
  } finally {
    modalLoadingIndicator.value = false;
  }
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedComplaint.value = null;
};

const handleComplaintUpdated = async (updatedComplaintData) => {
  // The modal should emit the complete updated complaint object or just the data to be patched.
  // Assuming updatedComplaintData contains the ID and fields to update.
  try {
    // Ensure you're passing the correct ID (complaint.id or complaint.complaint_id)
    // and the payload for the update.
    await apiServices.updateComplaint(updatedComplaintData.id, updatedComplaintData);
    await fetchComplaints(); // Refresh the complaint list
    closeModal();
  } catch (err) {
    console.error('Failed to update complaint:', err);
    // error.value = err.message || 'Failed to update complaint.'; // Display error in modal or as a toast
  }
};

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    console.warn("Invalid date string for formatDate:", dateString, e);
    return 'Invalid Date';
  }
};

const getStatusClass = (status) => {
  // Ensure these cases match the exact status strings from your backend
  switch (status) {
    case 'Received': return 'bg-blue-100 text-blue-800';
    case 'Submitted': return 'bg-blue-100 text-blue-800'; // Added Submitted based on your data
    case 'Pending Review': return 'bg-yellow-100 text-yellow-800';
    case 'Under Investigation': return 'bg-orange-100 text-orange-800';
    case 'Additional Info Requested': return 'bg-cyan-100 text-cyan-800';
    case 'Resolved with Action': return 'bg-green-100 text-green-800';
    case 'Resolved - No Action': return 'bg-gray-200 text-gray-800'; // Slightly different gray
    case 'Resolved': return 'bg-green-100 text-green-800'; // Generic Resolved
    case 'Dismissed': return 'bg-red-100 text-red-800';
    case 'Rejected': return 'bg-red-200 text-red-800'; // Slightly different red
    case 'Appealed': return 'bg-purple-100 text-purple-800';
    case 'Closed': return 'bg-gray-300 text-gray-700'; // For closed status
    case 'Action Taken': return 'bg-teal-100 text-teal-800'; // Example
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>

<style scoped>
.max-w-xs { max-width: 20rem; } /* Adjust as needed for subject column */
</style>