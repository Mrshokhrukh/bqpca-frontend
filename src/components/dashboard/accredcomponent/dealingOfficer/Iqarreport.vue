<template>
  <div class="mx-auto p-4 sm:p-6 lg:p-8">
    <div class="mx-auto">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 mb-2">Review IQAR Submissions</h1>
      <p class="text-md text-gray-600 mb-8">
        Review and take action on post-accreditation reports submitted by institutions.
      </p>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center p-12">
        <p class="mt-4 text-gray-500 font-semibold">Loading Submitted Reports...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        <p class="font-bold">An Error Occurred</p>
        <p>{{ error }}</p>
      </div>

      <!-- Main Content Area -->
      <div v-else>
        <!-- Filter Bar -->
        <div class="mb-4 bg-gray-50 p-3 rounded-md border">
            <label for="status-filter" class="form-label">Filter by Status:</label>
            <select id="status-filter" v-model="filterStatus" class="form-input w-full md:w-1/3">
                <option value="">All</option>
                <option value="submitted">Submitted</option>
                <option value="reviewed">Reviewed</option>
                <option value="needs_revision">Needs Revision</option>
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
            </select>
        </div>

        <!-- No Reports State -->
        <div v-if="filteredReports.length === 0" class="text-center p-12 bg-gray-50 rounded-lg">
            <h3 class="text-xl font-medium text-gray-900">No Reports Found</h3>
            <p class="mt-2 text-sm text-gray-500">
            There are no reports matching the selected filter.
            </p>
        </div>

        <!-- Reports Table -->
        <div v-else class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="table-header">Institute / Ref No.</th>
                  <th scope="col" class="table-header">Report Type</th>
                  <th scope="col" class="table-header">Submission Date</th>
                  <th scope="col" class="table-header">Status</th>
                  <th scope="col" class="table-header">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="report in filteredReports" :key="report.id">
                  <td class="table-cell">
                    <div class="text-sm font-medium text-gray-900">{{ report.application?.institute_profile?.name || 'N/A' }}</div>
                    <div class="text-xs text-gray-500">{{ report.application?.application_reference_no || 'N/A' }}</div>
                  </td>
                  <td class="table-cell text-sm text-gray-700">{{ report.report_type_display }}</td>
                  <td class="table-cell text-sm text-gray-700">{{ formatDate(report.submission_date) }}</td>
                  <td class="table-cell">
                    <span :class="statusBadgeClass(report.status)" class="status-badge">
                      {{ report.status_display }}
                    </span>
                  </td>
                  <td class="table-cell text-sm font-medium">
                    <button @click="openReviewModal(report)" class="action-button bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500">
                      Review Report
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="isModalOpen && selectedReport" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" @click.self="closeReviewModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-xl font-bold text-gray-800">Review: {{ selectedReport.report_type_display }}</h2>
          <button @click="closeReviewModal" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div class="p-6 overflow-y-auto">
          <!-- Display Submitted Data -->
          <div class="mb-6 space-y-4">
            <h3 class="text-lg font-semibold border-b pb-2">Submitted Information</h3>

            <!-- Implementation Plan Details (Part B) -->
            <div v-if="selectedReport.report_type === 'implementation_plan'">
              <div v-for="item in selectedReport.implementation_plan_items" :key="item.id" class="bg-gray-50 p-3 rounded-md border mb-3">
                <p class="font-bold text-gray-800">{{ item.standard_name }}</p>
                <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-1 text-sm">
                  <div><dt class="text-gray-500">Recommendations:</dt><dd class="text-gray-900 whitespace-pre-wrap">{{ item.recommendations }}</dd></div>
                  <div><dt class="text-gray-500">Actions:</dt><dd class="text-gray-900 whitespace-pre-wrap">{{ item.actions }}</dd></div>
                  <div><dt class="text-gray-500">Lead Person:</dt><dd class="text-gray-900">{{ item.lead_person }}</dd></div>
                  <div><dt class="text-gray-500">Timeline:</dt><dd class="text-gray-900">{{ item.timeline }}</dd></div>
                  <div class="col-span-2"><dt class="text-gray-500">Remarks:</dt><dd class="text-gray-900 whitespace-pre-wrap">{{ item.remarks }}</dd></div>
                </dl>
              </div>
            </div>

            <!-- Progress Report Details (Part C) -->
            <div v-if="selectedReport.report_type === 'progress_report'" class="space-y-4 text-sm">
                <div><p class="font-medium text-gray-600">1. Internal quality review activity:</p><p class="mt-1 p-2 bg-gray-50 border rounded-md whitespace-pre-wrap">{{ selectedReport.q1_internal_review_details }}</p></div>
                <div><p class="font-medium text-gray-600">2. Progress of the Implementation plan:</p><p class="mt-1 p-2 bg-gray-50 border rounded-md whitespace-pre-wrap">{{ selectedReport.q2_progress_highlight }}</p></div>
                <div><p class="font-medium text-gray-600">3. Initiatives for continuous improvement:</p><p class="mt-1 p-2 bg-gray-50 border rounded-md whitespace-pre-wrap">{{ selectedReport.q3_initiatives_for_improvement }}</p></div>
                <div><p class="font-medium text-gray-600">4. Unimplemented recommendations and reasons:</p><p class="mt-1 p-2 bg-gray-50 border rounded-md whitespace-pre-wrap">{{ selectedReport.q4_unimplemented_recommendations }}</p></div>
            </div>
          </div>

          <!-- Officer Action Form -->
          <form @submit.prevent="handleReviewSubmit">
            <h3 class="text-lg font-semibold border-b pb-2 mb-4">Officer's Action</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="action-status" class="form-label">Update Status</label>
                  <select id="action-status" v-model="officerAction.status" class="form-input" required>
                    <option value="reviewed">Mark as Reviewed</option>
                    <option value="needs_revision">Request Revision</option>
                    <option value="accepted">Accept</option>
                  </select>
                </div>
                <div>
                  <label for="action-remarks" class="form-label">Remarks (Feedback for Institute)</label>
                  <textarea id="action-remarks" v-model="officerAction.remarks" rows="3" class="form-textarea" placeholder="Provide feedback or reasons for revision..."></textarea>
                </div>
            </div>
            <div class="mt-6 flex justify-end">
              <button type="button" @click="closeReviewModal" class="form-cancel-btn">Cancel</button>
              <button type="submit" :disabled="isSubmitting" class="form-submit-btn ml-3">
                {{ isSubmitting ? 'Processing...' : 'Submit Review' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-700 mb-1; }
.form-input, .form-textarea { @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm; }
.form-submit-btn { @apply inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed; }
.form-cancel-btn { @apply inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-6 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2; }
.action-button { @apply inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2; }
.table-header { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider; }
.table-cell { @apply px-6 py-4 whitespace-nowrap; }
.status-badge { @apply px-2 inline-flex text-xs leading-5 font-semibold rounded-full; }
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';

const reports = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref(null);
const filterStatus = ref('submitted'); // Default to show 'submitted' reports

const isModalOpen = ref(false);
const selectedReport = ref(null);
const officerAction = ref({ status: 'reviewed', remarks: '' });
const toast = useToast();

const filteredReports = computed(() => {
  if (!filterStatus.value) {
    return reports.value;
  }
  return reports.value.filter(report => report.status === filterStatus.value);
});

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await apiService.getPostAccreditationReports();
    reports.value = response.data.results || response.data;
  } catch (err) {
    console.error("Failed to load IQAR data for officer:", err);
    error.value = err.response?.data?.detail || "Could not load submitted reports.";
    toast.error(error.value);
  } finally {
    isLoading.value = false;
  }
}

const openReviewModal = (report) => {
  selectedReport.value = report;
  officerAction.value = {
    status: 'reviewed', // Default action
    remarks: report.remarks_heqc || '',
  };
  isModalOpen.value = true;
};

const closeReviewModal = () => {
  isModalOpen.value = false;
  selectedReport.value = null;
};

const handleReviewSubmit = async () => {
  if (!selectedReport.value) return;

  if (officerAction.value.status === 'needs_revision' && !officerAction.value.remarks.trim()) {
      toast.error("Remarks are required when requesting a revision.");
      return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      status: officerAction.value.status,
      remarks_heqc: officerAction.value.remarks,
    };
    await apiService.patchPostAccreditationReport(selectedReport.value.id, payload);
    toast.success(`Report status successfully updated to "${officerAction.value.status}"`);
    closeReviewModal();
    await fetchData(); // Refresh the list
  } catch (err) {
    console.error("Failed to submit review:", err);
    const errorDetail = err.response?.data?.detail || "An error occurred while updating the report.";
    toast.error(errorDetail);
  } finally {
    isSubmitting.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const statusBadgeClass = (status) => ({
  'pending': 'bg-yellow-100 text-yellow-800',
  'submitted': 'bg-blue-100 text-blue-800',
  'reviewed': 'bg-purple-100 text-purple-800',
  'needs_revision': 'bg-orange-100 text-orange-800',
  'accepted': 'bg-green-100 text-green-800',
}[status] || 'bg-gray-100 text-gray-800');
</script>
