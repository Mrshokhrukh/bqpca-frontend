<template>
  <div class="application-history-page mx-auto my-10 p-6 bg-gray-50 rounded-lg shadow-xl">
    <h2 class="text-3xl font-extrabold text-center text-blue-700 mb-8">My Accreditation Applications</h2>

    <!-- Application History Table Section -->
    <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-gray-300">
      <div class="flex items-center text-gray-700 mb-4">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <h3 class="text-xl font-semibold">Application History</h3>
      </div>

      <!-- Loading state for the table -->
      <div v-if="loadingApplicationsList" class="text-center py-8">
        <div class="animate-spin inline-block w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full" role="status"></div>
        <p class="mt-3 text-gray-600">Loading your application history...</p>
      </div>

      <!-- Error state for the table -->
      <div v-else-if="errors.applicationsList" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline ml-2">{{ errors.applicationsList }}</span>
      </div>

      <!-- Table of applications -->
      <div v-else-if="userApplications.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accreditation Cycle</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISAR Deadline</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="app in userApplications" :key="app.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ app.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatAccreditationCycle(app.accreditation_cycle) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ new Date(app.created_at).toLocaleDateString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <span v-if="app.isar_submission_deadline">{{ new Date(app.isar_submission_deadline).toLocaleDateString() }}</span>
                <span v-else class="text-gray-400">N/A</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="['px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center', statusBadgeClass(app.status)]" v-html="statusIconChar(app.status) + ' ' + (app.status_display || app.status)"></span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <button @click="handleViewDetails(app.id)"
                        class="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline"
                        title="View application details">
                   View Details
                 </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state for the table -->
      <div v-else class="text-center py-8 bg-blue-50 rounded-lg">
          <p class="text-gray-600">You have not created any accreditation applications yet.</p>
          <p class="text-gray-500 text-sm mt-1">
            <a href="/new-application" class="text-blue-600 hover:underline">Click here to start a new application.</a>
          </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/services';

const userApplications = ref([]);
const loadingApplicationsList = ref(true);
const errors = ref({ applicationsList: null });
const router = useRouter();

const fetchUserApplications = async () => {
  loadingApplicationsList.value = true;
  errors.value.applicationsList = null;
  try {
    const response = await apiService.getAccreditationApplications();
    userApplications.value = response.data.results || response.data || [];
  } catch (error) {
    console.error("Error fetching user's applications:", error.response?.data || error);
    errors.value.applicationsList = "Could not load your application history. Please try reloading the page.";
  } finally {
    loadingApplicationsList.value = false;
  }
};

const handleViewDetails = (appId) => {
  router.push({ name: 'ApplicationForm', params: { applicationId: appId } });
};

const formatAccreditationCycle = (cycleKey) => {
  const mapping = {
    'first': 'First Cycle',
    'second': 'Second Cycle',
    'third': 'Third Cycle',
    'other': 'Other Cycle',
  };
  return mapping[cycleKey] || cycleKey || 'N/A';
};

const statusBadgeClass = (statusKey) => {
  const mapping = {
    // Initial Application Statuses
    'draft_initial': 'bg-gray-200 text-gray-800 border border-gray-300',
    'pending_payment': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    'initial_app_submitted_heqc_review': 'bg-blue-100 text-blue-800 border border-blue-300',
    'initial_app_rejected': 'bg-red-100 text-red-800 border border-red-300',
    // Awaiting ISAR Status
    'initial_app_approved_awaiting_isar': 'bg-teal-100 text-teal-800 border border-teal-300',
    // ISAR and Assessment Statuses
    'isar_submitted_heqc_review': 'bg-sky-100 text-sky-800 border border-sky-300',
    'assessment_scheduled': 'bg-indigo-100 text-indigo-800 border border-indigo-300',
    'assessment_completed': 'bg-purple-100 text-purple-800 border border-purple-300',
    // Final Decision Statuses
    'approved_accredited': 'bg-green-100 text-green-800 border border-green-300',
    'approved_conditional': 'bg-lime-100 text-lime-800 border border-lime-300',
    'rejected_not_accredited': 'bg-red-200 text-red-900 border border-red-400',
    'appealed': 'bg-orange-100 text-orange-800 border border-orange-300',
    // Closed Statuses
    'closed_withdrawn': 'bg-gray-300 text-gray-900 border border-gray-400',
    'closed_completed': 'bg-gray-300 text-gray-900 border border-gray-400',
  };
  // Fallback for any unexpected status keys
  return mapping[statusKey] || 'bg-gray-100 text-gray-700 border border-gray-200';
};

const statusIconChar = (statusKey) => {
  const mapping = {
    'draft_initial': '', // Draft
    'pending_payment': '', // Payment
    'initial_app_submitted_heqc_review': '⏳', // Review
    'initial_app_rejected': '❌', // Rejected
    'initial_app_approved_awaiting_isar': '', // ISAR Awaiting
    'isar_submitted_heqc_review': '', // ISAR Submitted
    'assessment_scheduled': '', // Scheduled
    'assessment_completed': '', // Completed
    'approved_accredited': '✅', // Approved
    'approved_conditional': '✅', // Approved Conditional
    'rejected_not_accredited': '⛔', // Not Accredited
    'appealed': '⚖️', // Appealed
    'closed_withdrawn': '', // Withdrawn/Closed
    'closed_completed': '', // Completed/Closed
  };
  return mapping[statusKey] || ''; // Default icon
};

onMounted(() => {
  fetchUserApplications();
});
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>