<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Conflict of Interest Review</h1>
      <p class="text-gray-600 max-w-3xl mx-auto">
        Review conflict of interest declarations from assessors assigned to your institute's accreditation application. Approve or dispute each declaration to proceed.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span class="ml-4 text-gray-600">Loading COI records...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>

    <!-- Main Table for Review -->
    <div v-else class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessor Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessor's Declaration</th>
              <!-- CHANGE: Renamed column for clarity -->
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute's Response</th>
              <!-- CHANGE: Renamed column for clarity -->
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in userCoiRecords" :key="record.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ record.assessor_details?.name || 'Unknown Assessor' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <span :class="getAssessorStatusClass(record)" class="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getAssessorStatusText(record) }}
                </span>
                <p v-if="record.assessor_coi_remarks" class="text-xs text-gray-500 mt-1 italic">
                  Remarks: "{{ record.assessor_coi_remarks }}"
                </p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getInstituteResponseClass(record)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  <!-- CHANGE: This function now provides much clearer text -->
                  {{ getInstituteResponseText(record) }}
                </span>
                <p v-if="record.institute_rejection_remarks && record.status !== 'pending_institute_review'" class="text-xs text-gray-500 mt-1 italic">
                  Your Remarks: "{{ record.institute_rejection_remarks }}"
                </p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <!-- CHANGE: Logic is now more explicit for each step of the workflow -->
                <div v-if="record.status === 'pending_institute_review'">
                  <button @click="handleApprove(record)" class="px-3 py-1.5 bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-xs font-semibold mr-2" :disabled="isSubmitting">Approve</button>
                  <button @click="openDisputeModal(record)" class="px-3 py-1.5 bg-red-100 text-red-800 rounded-md hover:bg-red-200 text-xs font-semibold" :disabled="isSubmitting">Dispute</button>
                </div>
                <div v-else-if="record.status === 'pending_assessor'" class="text-sm text-gray-500">
                  Awaiting Assessor's Action
                </div>
                <div v-else class="text-sm text-gray-400">
                  Responded on {{ formatDate(record.institute_response_at) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Empty State -->
      <div v-if="!loading && userCoiRecords.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No COI Records</h3>
        <p class="mt-1 text-sm text-gray-500">No conflict of interest declarations are available for review. Please check back later or contact support if you believe this is an error.</p>
      </div>
    </div>

    <!-- Dispute Declaration Modal (No changes needed here) -->
    <div v-if="isDisputeModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeDisputeModal">
      <!-- ... modal content ... -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import apiService from '@/services/services';

// --- State (No changes here) ---
const allCoiRecords = ref([]);
const loading = ref(true);
const error = ref(null);
const currentUser = ref(null);

const isDisputeModalOpen = ref(false);
const selectedRecord = ref(null);
const disputeRemarks = ref('');
const disputeFile = ref(null);
const isSubmitting = ref(false);
const submissionError = ref(null);

// --- Computed Properties (No changes here, the previous fix was correct) ---
const userCoiRecords = computed(() => {
  if (!currentUser.value || !allCoiRecords.value) return [];
  return allCoiRecords.value.filter(record =>
    record.application_details?.institute_profile_details?.user_liaison_username === currentUser.value.username
  );
});

// --- Lifecycle Hooks & API Calls (No changes here) ---
onMounted(() => {
  const userString = localStorage.getItem('user');
  if (userString) {
    try {
      currentUser.value = JSON.parse(userString);
      fetchCoiRecords();
    } catch (err) {
      error.value = 'Invalid user data. Please log in again.';
      loading.value = false;
    }
  } else {
    error.value = 'Could not find user information. Please log in again.';
    loading.value = false;
  }
});

const fetchCoiRecords = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiService.getApplicationAssessorCOIs();
    allCoiRecords.value = response.data.results || [];
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to load COI records. Please try again later.';
    console.error('Error fetching COI records:', err);
  } finally {
    loading.value = false;
  }
};

// --- UI Helpers ---
const getAssessorStatusClass = (record) => {
  if (record.assessor_has_coi === null) return 'bg-gray-100 text-gray-800';
  return record.assessor_has_coi ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
};

const getAssessorStatusText = (record) => {
  // This logic is already correct
  if (record.assessor_has_coi === null) return 'Pending Assessor Response';
  return record.assessor_has_coi ? 'Conflict Declared' : 'No Conflict Declared';
};

const getInstituteResponseClass = (record) => {
  // CHANGE: Added specific styling for 'pending_assessor'
  const statusMap = {
    pending_assessor: 'bg-gray-100 text-gray-800',
    pending_institute_review: 'bg-yellow-100 text-yellow-800',
    disputed_by_institute: 'bg-orange-100 text-orange-800',
    approved_no_conflict: 'bg-green-100 text-green-800',
    conflict_acknowledged: 'bg-blue-100 text-blue-800',
  };
  return statusMap[record.status] || 'bg-gray-100 text-gray-800';
};

const getInstituteResponseText = (record) => {
  // CHANGE: Added specific, clearer text for each state of the workflow
  const statusMap = {
    pending_assessor: 'Awaiting Assessor',
    pending_institute_review: 'Pending Your Review',
    disputed_by_institute: 'You Disputed',
    approved_no_conflict: 'You Approved (No Conflict)',
    conflict_acknowledged: 'You Acknowledged Conflict',
  };
  return statusMap[record.status] || 'Responded';
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const handleFileChange = (event) => {
  disputeFile.value = event.target.files[0] || null;
};

// --- API Actions (No changes needed here) ---
const handleApprove = async (record) => {
  if (!confirm(`Are you sure you want to approve the COI declaration for ${record.assessor_details?.name || 'this assessor'}?`)) return;

  isSubmitting.value = true;
  const formData = new FormData();
  // Using the new field names from your models.py
  formData.append('institute_agrees_with_assessor', 'true');
  formData.append('institute_rejection_remarks', 'Approved by institute.');

  try {
    const response = await apiService.respondToCOI(record.id, formData);
    const index = allCoiRecords.value.findIndex(r => r.id === record.id);
    if (index !== -1) {
      allCoiRecords.value[index] = response.data;
    }
    alert('COI declaration approved successfully.');
  } catch (err) {
    alert(err.response?.data?.detail || 'Failed to approve the declaration. Please try again.');
    console.error('Approval failed:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const openDisputeModal = (record) => {
  selectedRecord.value = record;
  disputeRemarks.value = '';
  disputeFile.value = null;
  submissionError.value = null;
  isDisputeModalOpen.value = true;
};

const closeDisputeModal = () => {
  isDisputeModalOpen.value = false;
  selectedRecord.value = null;
};

const handleDisputeSubmit = async () => {
  if (!disputeRemarks.value.trim()) {
    submissionError.value = 'Reason for dispute is required.';
    return;
  }

  isSubmitting.value = true;
  submissionError.value = null;

  const formData = new FormData();
  // Using the new field names from your models.py
  formData.append('institute_agrees_with_assessor', 'false');
  formData.append('institute_rejection_remarks', disputeRemarks.value);
  if (disputeFile.value) {
    formData.append('dispute_document', disputeFile.value);
  }

  try {
    const response = await apiService.respondToCOI(selectedRecord.value.id, formData);
    const index = allCoiRecords.value.findIndex(r => r.id === selectedRecord.value.id);
    if (index !== -1) {
      allCoiRecords.value[index] = response.data;
    }
    alert('Dispute Submitted Successfully.');
    closeDisputeModal();
  } catch (err) {
    submissionError.value = err.response?.data?.detail || 'Failed to submit dispute. Please try again.';
    console.error('Dispute submission failed:', err);
  } finally {
    isSubmitting.value = false;
  }
};

</script>

<style scoped>
/* No changes needed */
</style>