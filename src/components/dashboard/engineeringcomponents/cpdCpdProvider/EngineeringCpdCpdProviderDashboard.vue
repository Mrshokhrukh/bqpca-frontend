<template>
  <div class="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
    <div class="mx-auto">
      <!-- Page Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">My Dashboard</h1>
        <p class="mt-1 text-md text-gray-600">
          Welcome back! Here's an overview of your CPD submissions.
        </p>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-500">Loading dashboard data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- Heroicon: x-circle -->
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">An Error Occurred</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content: Stats and Table -->
      <div v-else class="space-y-8">
        <!-- Stats Cards Grid -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="item in statItems" :key="item.name" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0" v-html="item.icon">
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">{{ item.name }}</dt>
                    <dd class="text-3xl font-semibold text-gray-900">{{ item.value }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Submissions Table -->
        <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Recent Submissions</h2>
            <div class="bg-white shadow overflow-hidden sm:rounded-md">
                <div v-if="recentTasks.length > 0" class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>

                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="task in recentTasks" :key="task.id">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate" :title="task.title_of_cpd">{{ task.title_of_cpd }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(task.created_at) }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <span :class="getStatusClass(task.status)" class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full">
                                      {{ task.status_display }}
                                  </span>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Empty State for Table -->
                <div v-else class="text-center py-16 px-6">
                    <!-- Heroicon: document-add -->
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="mt-2 text-lg font-medium text-gray-900">No Submissions Yet</h3>
                    <p class="mt-1 text-sm text-gray-500">Get started by creating your first CPD task application.</p>
                    <div class="mt-6">
                        <!-- Updated link to the correct route -->
                        <router-link to="/admin/cme_cpd_provider/engineering_certification/cpd_application_details" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Submit a New CPD Task
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
// Make sure this path correctly points to your API services file
import apiService from '@/services/services';

// --- Reactive State ---
const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  draft: 0
});
const recentTasks = ref([]);
const isLoading = ref(true);
const error = ref(null);

// --- Computed property for dynamic stats cards (removed drafts) ---
const statItems = computed(() => [
  {
    name: 'Total Submissions',
    value: stats.value.total,
    icon: `<div class="flex-shrink-0 bg-blue-500 rounded-md p-3"><svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>`,
  },
  {
    name: 'Approved',
    value: stats.value.approved,
    icon: `<div class="flex-shrink-0 bg-green-500 rounded-md p-3"><svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>`,
  },
  {
    name: 'Pending Review',
    value: stats.value.pending,
    icon: `<div class="flex-shrink-0 bg-yellow-500 rounded-md p-3"><svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>`,
  },
  {
    name: 'Rejected',
    value: stats.value.rejected,
    icon: `<div class="flex-shrink-0 bg-red-500 rounded-md p-3"><svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg></div>`,
  },
]);


// --- Methods ---

const fetchDashboardData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await apiService.getCPDProviderDashboard();
    // Safely assign data, with fallbacks for safety
    stats.value = response.data.stats || stats.value;
    recentTasks.value = response.data.recent_tasks || [];
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err);
    // Provide a user-friendly error from the API response, or a generic one
    error.value = err.response?.data?.error || 'Could not connect to the server. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

/**
 * Returns Tailwind CSS classes for a status badge based on the status string.
 * @param {string} status - The status from the API (e.g., 'Approved', 'Pending').
 */
const getStatusClass = (status) => {
  const classes = {
    'Approved': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Draft': 'bg-gray-100 text-gray-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800'; // Default style
};

/**
 * Formats a date string into a more readable format (e.g., "August 20, 2025").
 * @param {string} dateString - An ISO 8601 date string.
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Lifecycle Hook ---
// Fetch data when the component is first mounted to the page.
onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>