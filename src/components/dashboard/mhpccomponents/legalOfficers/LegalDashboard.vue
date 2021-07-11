<template>
  <div class="min-h-screen">
    <div class="mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Complaint Management Dashboard
        </h1>
        <p class="text-lg text-gray-600">
          Oversee, manage, and resolve all submitted complaints.
        </p>
      </div>

      <!-- Key Performance Indicators (KPIs) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-600 mb-1">Total Complaints</h3>
              <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-600 mb-1">Pending (on this page)</h3>
              <p class="text-3xl font-bold text-orange-600">{{ stats.pending }}</p>
            </div>
            <div class="bg-orange-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-600 mb-1">In Progress (on this page)</h3>
              <p class="text-3xl font-bold text-blue-600">{{ stats.inProgress }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-gray-600 mb-1">Resolved (on this page)</h3>
              <p class="text-3xl font-bold text-green-600">{{ stats.resolved }}</p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading and Error States -->
      <div v-if="isLoading" class="flex items-center justify-center py-16">
        <div class="bg-white rounded-xl shadow-lg p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600 text-lg">Loading complaints...</p>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-red-800 font-medium">Failed to load complaints: {{ error }}</p>
        </div>
        <button @click="fetchComplaintsData" class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200">
          Try Again
        </button>
      </div>

      <!-- Complaints Table -->
      <div v-if="!isLoading && !error" class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <p class="text-sm text-gray-600 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Click on a row to view details and update status.
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complaint ID
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Professional Involved
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Submitted
                </th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="complaints.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  No complaints found.
                </td>
              </tr>

              <tr v-for="complaint in complaints" :key="complaint.id"
                  @click="viewDetails(complaint)"
                  class="hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ complaint.complaint_id }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div class="max-w-xs truncate">{{ complaint.subject }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ complaint.professional_name || (complaint.respondent_application ? complaint.respondent_application.full_name : 'N/A') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(complaint.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusClass(complaint.status)
                  ]">
                    {{ complaint.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-center mt-8">
        <nav class="bg-white rounded-lg shadow-lg border border-gray-200 px-6 py-3">
          <div class="flex items-center space-x-4">
            <button @click="changePage(pagination.currentPage - 1)"
                    :disabled="pagination.currentPage === 1"
                    class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Previous
            </button>

            <span class="text-sm text-gray-700 font-medium">
              Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
            </span>

            <button @click="changePage(pagination.currentPage + 1)"
                    :disabled="pagination.currentPage === pagination.totalPages"
                    class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
              Next
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </nav>
      </div>

      <!-- Details Modal -->
      <div v-if="selectedComplaint" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900">
              Complaint Details: {{ selectedComplaint.complaint_id }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6 space-y-6">
            <!-- Grievance Information -->
            <div class="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 class="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Grievance Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Subject:</p>
                  <p class="text-gray-900">{{ selectedComplaint.subject }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Professional Involved:</p>
                  <p class="text-gray-900">{{ selectedComplaint.professional_name }} ({{ selectedComplaint.professional_designation }})</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Workplace:</p>
                  <p class="text-gray-900">{{ selectedComplaint.professional_workplace }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Incident Date:</p>
                  <p class="text-gray-900">{{ formatDateTime(selectedComplaint.incident_datetime) }}</p>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700 mb-2">Details:</p>
                <div class="bg-white border border-blue-200 rounded-lg p-4 text-gray-900 whitespace-pre-wrap">
                  {{ selectedComplaint.grievance_details }}
                </div>
              </div>
              <div v-if="selectedComplaint.attachment" class="mt-4">
                <p class="text-sm font-medium text-gray-700 mb-2">Attachment:</p>
                <a :href="selectedComplaint.attachment" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                  </svg>
                  View Document
                </a>
              </div>
            </div>

            <!-- Respondent Details -->
            <div v-if="selectedComplaint.respondent_application" class="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h4 class="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Respondent Details
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Full Name:</p>
                  <p class="text-gray-900">{{ selectedComplaint.respondent_application.full_name }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Registration No:</p>
                  <p class="text-gray-900">{{ selectedComplaint.respondent_application.registration_no }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Email:</p>
                  <p class="text-gray-900">{{ selectedComplaint.respondent_application.email_address }}</p>
                </div>
              </div>
            </div>

            <!-- Submitted By -->
            <div class="bg-green-50 rounded-xl p-6 border border-green-200">
              <h4 class="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Submitted By
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Name:</p>
                  <p class="text-gray-900">{{ selectedComplaint.submitted_by_name }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Contact:</p>
                  <p class="text-gray-900">{{ selectedComplaint.submitted_by_contact_number }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700 mb-1">Email:</p>
                  <p class="text-gray-900">{{ selectedComplaint.submitted_by_email }}</p>
                </div>
              </div>
            </div>

            <!-- Update Status -->
            <div class="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h4 class="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Update Status
              </h4>
              <div class="space-y-4">
                <div v-if="masterStatuses && masterStatuses.length > 0">
                  <label for="status-update" class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select id="status-update" v-model="updateData.status"
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option v-for="status in masterStatuses" :key="status.id" :value="status.name">
                      {{ status.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label for="remarks-update" class="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                  <textarea id="remarks-update" v-model="updateData.remarks" rows="3"
                            placeholder="Add remarks for this update..."
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
                </div>
                <div class="flex justify-end">
                  <button @click="submitUpdate" :disabled="isUpdating"
                          class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center">
                    <svg v-if="isUpdating" class="animate-spin w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    {{ isUpdating ? 'Updating...' : 'Submit Update' }}
                  </button>
                </div>
                <p v-if="updateError" class="text-red-600 text-sm text-right">{{ updateError }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import apiService from '@/services/services';

const complaints = ref([]);
const isLoading = ref(true);
const error = ref(null);
const masterStatuses = ref([]);
const selectedComplaint = ref(null);
const isUpdating = ref(false);
const updateError = ref(null);

const stats = reactive({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
});

const pagination = reactive({
    currentPage: 1,
    totalPages: 1,
    count: 0
});

const updateData = reactive({
  status: '',
  remarks: ''
});

const calculatePageStats = (complaintsList) => {
    stats.pending = 0;
    stats.inProgress = 0;
    stats.resolved = 0;
    complaintsList.forEach(complaint => {
        const status = (complaint.status || '').toLowerCase();
        if (status.includes('resolved')) {
            stats.resolved++;
        } else if (status.includes('progress')) {
            stats.inProgress++;
        } else {
            stats.pending++;
        }
    });
};

const fetchComplaintsData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const params = { page: pagination.currentPage };
    const response = await apiService.getComplaints(params);
    complaints.value = response.data.results;
    pagination.count = response.data.count;
    stats.total = response.data.count;
    const itemsPerPage = response.data.results.length || 10;
    pagination.totalPages = Math.ceil(response.data.count / itemsPerPage);
    calculatePageStats(complaints.value);
  } catch (err) {
    error.value = err.message || 'An unknown error occurred.';
  } finally {
    isLoading.value = false;
  }
};

const fetchMasterStatuses = async () => {
    try {
        const response = await apiService.getComplaintMasterStatuses();
        if (Array.isArray(response.data)) {
            masterStatuses.value = response.data;
        } else {
            masterStatuses.value = [];
        }
    } catch (err) {
        console.error("Error fetching master statuses:", err);
    }
};

const submitUpdate = async () => {
    if (!selectedComplaint.value) return;
    isUpdating.value = true;
    updateError.value = null;
    try {
        await apiService.updateComplaint(selectedComplaint.value.id, {
            status: updateData.status,
            remarks: updateData.remarks,
        });
        closeModal();
        await fetchComplaintsData();
    } catch (err) {
        updateError.value = err.response?.data?.detail || 'Failed to update. Please try again.';
    } finally {
        isUpdating.value = false;
    }
};

const changePage = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
        pagination.currentPage = page;
        fetchComplaintsData();
    }
};

const viewDetails = (complaint) => {
  selectedComplaint.value = { ...complaint };
  updateData.status = complaint.status;
  updateData.remarks = complaint.remarks || '';
  updateError.value = null;
};

const closeModal = () => {
  selectedComplaint.value = null;
};

const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-GB') : 'N/A';
const formatDateTime = (dateString) => dateString ? new Date(dateString).toLocaleString('en-GB') : 'N/A';

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800';

  const statusLower = status.toLowerCase();
  if (statusLower.includes('resolved')) {
    return 'bg-green-100 text-green-800';
  } else if (statusLower.includes('progress')) {
    return 'bg-blue-100 text-blue-800';
  } else if (statusLower.includes('submitted') || statusLower.includes('pending')) {
    return 'bg-orange-100 text-orange-800';
  }
  return 'bg-gray-100 text-gray-800';
};

onMounted(() => {
  fetchMasterStatuses();
  fetchComplaintsData();
});
</script>