<template>
  <div class="min-h-screen bg-gray-100">
    <div class="mx-auto p-6">
      <!-- Dashboard Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">HEQC Officer Dashboard</h1>
        <p class="text-gray-600 mt-1">System-wide statistics and recent activity.</p>
      </header>

      <!-- Error Message Display -->
      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
        <p class="font-bold">Error Loading Dashboard</p>
        <p>{{ error }}</p>
      </div>

      <!-- Stats Cards - Now showing more relevant, historical data -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Applications (This Year) -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Total Applications (This Year)
                </p>
                <div class="flex items-baseline mt-2">
                    <p class="text-3xl font-bold text-gray-900">
                        <span v-if="loading">...</span>
                        <span v-else>{{ stats.totalThisYear }}</span>
                    </p>
                </div>
              </div>
              <div class="p-3 rounded-full bg-indigo-100 text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Processes -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Active Processes
                </p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                    <span v-if="loading">...</span>
                    <span v-else>{{ stats.activeProcesses }}</span>
                </p>
              </div>
              <div class="p-3 rounded-full bg-blue-100 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Accredited Institutes -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Accredited Institutes
                </p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                    <span v-if="loading">...</span>
                    <span v-else>{{ stats.accredited }}</span>
                </p>
              </div>
              <div class="p-3 rounded-full bg-green-100 text-green-500">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Completed Processes (All Time) -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Completed Processes
                </p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                    <span v-if="loading">...</span>
                    <span v-else>{{ stats.completed }}</span>
                </p>
              </div>
              <div class="p-3 rounded-full bg-gray-200 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Recent Activity Table -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference No.</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stage</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th scope="col" class="relative px-6 py-3"><span class="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loading">
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    <div class="flex justify-center items-center">
                      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading recent activity...
                    </div>
                  </td>
                </tr>
                <tr v-else-if="recentApplications.length === 0">
                    <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-500">No applications found in the system.</td>
                </tr>
                <tr v-for="app in recentApplications" :key="app.application_uid">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ app.application_reference_no }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ app.institute_profile_name_display }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="getStatusClass(app.status)">{{ app.status_display }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(app.updated_at) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" @click.prevent="viewApplication(app.id)" class="text-blue-600 hover:text-blue-900">View Details</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Application Status Overview Chart -->
        <div class="bg-white rounded-xl shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
            <div v-if="loading" class="text-center text-gray-500 py-4">Loading stats...</div>
            <div v-else class="space-y-3">
                <div v-for="status in applicationStatusDistribution" :key="status.name" class="w-full">
                    <div class="flex justify-between mb-1">
                        <span class="text-sm font-medium text-gray-700">{{ status.name }}</span>
                        <span class="text-sm font-medium text-gray-500">{{ status.count }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div :class="status.barClass" class="h-2.5 rounded-full" :style="{ width: status.percentage + '%' }"></div>
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
import apiService from '@/services/services'; 

// --- Reactive State ---
const loading = ref(true);
const error = ref(null);
const stats = ref({ totalThisYear: 0, activeProcesses: 0, accredited: 0, completed: 0 });
const recentApplications = ref([]); // For table and chart

// --- Constants for Status Groups ---
const FINAL_STATUSES = ['approved_accredited', 'approved_conditional', 'rejected_not_accredited', 'closed_withdrawn', 'closed_completed'];

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchDashboardData();
});

// --- Main Data Fetching Method ---
const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const currentYear = new Date().getFullYear();

    // Fetch all necessary data in parallel
    const [
      totalThisYearResponse,
      accreditedResponse,
      allAppsResponse,
    ] = await Promise.all([
      // 1. Get count for applications created this year
      apiService.getAccreditationApplications({ created_at__year: currentYear }),
      // 2. Get count of all accredited applications
      apiService.getAccreditationApplications({ status: 'approved_accredited' }),
      // 3. Get a list of all applications for calculating other stats and populating the table
      apiService.getAccreditationApplications({ limit: 200, ordering: '-updated_at' }),
    ]);

    // Populate the dashboard from the fetched data
    const allApps = allAppsResponse.data.results;

    // -- Set Card Statistics --
    stats.value.totalThisYear = totalThisYearResponse.data.count;
    stats.value.accredited = accreditedResponse.data.count;

    // Calculate other stats from the main list
    stats.value.activeProcesses = allApps.filter(app => !FINAL_STATUSES.includes(app.status)).length;
    stats.value.completed = allApps.filter(app => FINAL_STATUSES.includes(app.status)).length;

    // -- Set Recent Activity Table --
    // Show top 10 most recently updated applications
    recentApplications.value = allApps.slice(0, 10);

  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    error.value = 'Failed to load dashboard data. The API might be unreachable or an error occurred.';
  } finally {
    loading.value = false;
  }
};

// --- Helper & Display Functions ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const getStatusClass = (status) => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const classMap = {
        'initial_app_submitted_heqc_review': 'bg-blue-100 text-blue-800',
        'isar_submitted_heqc_review': 'bg-yellow-100 text-yellow-800',
        'assessment_report_submitted': 'bg-purple-100 text-purple-800',
        'approved_accredited': 'bg-green-100 text-green-800',
        'rejected_not_accredited': 'bg-gray-200 text-gray-800',
        'appealed': 'bg-red-100 text-red-800',
        'site_visit_scheduled': 'bg-teal-100 text-teal-800',
        'draft_initial': 'bg-gray-100 text-gray-700'
    };
    return `${base} ${classMap[status] || 'bg-gray-100 text-gray-800'}`;
};

const viewApplication = (appId) => {
    // In a real app, use Vue Router to navigate
    // import { useRouter } from 'vue-router'; const router = useRouter();
    // router.push({ name: 'ApplicationDetails', params: { id: appId } });
    alert(`Navigating to details for application ID: ${appId}`);
};

// --- Computed Properties for Chart ---
const applicationStatusDistribution = computed(() => {
    const statusCounts = recentApplications.value.reduce((acc, app) => {
        const displayName = app.status_display || 'Unknown Status';
        acc[displayName] = (acc[displayName] || 0) + 1;
        return acc;
    }, {});

    const total = recentApplications.value.length;
    if (total === 0) return [];

    const barColorMap = {
        'Initial App Submitted (HEQC Review)': 'bg-blue-500',
        'ISAR Submitted (HEQC Review)': 'bg-yellow-500',
        'Assessment Report Submitted': 'bg-purple-500',
        'Approved & Accredited': 'bg-green-500',
        'Rejected / Not Accredited': 'bg-gray-600',
        'Appealed': 'bg-red-500',
        'Site Visit: Scheduled': 'bg-teal-500',
        'Draft Initial Application': 'bg-gray-400',
    };

    return Object.entries(statusCounts)
        .map(([name, count]) => ({
            name,
            count,
            percentage: (count / total) * 100,
            barClass: barColorMap[name] || 'bg-indigo-500',
        }))
        .sort((a, b) => b.count - a.count);
});
</script>