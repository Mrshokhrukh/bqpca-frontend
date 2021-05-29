<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Site Visit Schedules</h1>
            <p class="text-gray-600">Monitor and track teaching center verification schedules</p>
          </div>
          <button
            @click="fetchSchedules"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {{ loading ? 'Refreshing...' : 'Refresh' }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && schedules.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Loading Schedules</h3>
          <p class="text-gray-500">Please wait while we fetch the latest site visit schedules...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.5 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Unable to Load Schedules</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">{{ errorMessage }}</p>
          <button
            @click="fetchSchedules"
            class="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Try Again
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="schedules.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m0 0V7a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Schedules Available</h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">
            There are currently no site visit schedules available. New schedules will appear here once they are published.
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p class="text-sm text-blue-800">
              <strong>Need help?</strong> Contact support if you believe schedules should be available or if you have questions about the verification process.
            </p>
          </div>
        </div>
      </div>

      <!-- Schedules Table -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Stats Bar -->
        <div class="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-6">
              <div class="text-sm">
                <span class="font-medium text-gray-900">{{ schedules.length }}</span>
                <span class="text-gray-500">{{ schedules.length === 1 ? 'schedule' : 'schedules' }} found</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-600">{{ verifiedCount }} Verified</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-600">{{ unverifiedCount }} Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Teaching Center
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Verification Report
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="schedule in schedules"
                :key="schedule.id"
                class="hover:bg-gray-50 transition-colors duration-150"
                :class="{ 'bg-green-50': schedule.verification_status === 'VERIFIED_PV' }"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-indigo-700">{{ schedule.center_name.charAt(0).toUpperCase() }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ schedule.center_name }}</div>
                      <div class="text-sm text-gray-500">Center ID: {{ schedule.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(schedule.verification_date) }}</div>
                  <div class="text-sm text-gray-500">{{ formatTime(schedule.verification_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    :class="schedule.verification_status === 'VERIFIED_PV'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'"
                  >
                    <svg
                      class="mr-1.5 h-3 w-3"
                      :class="schedule.verification_status === 'VERIFIED_PV' ? 'text-green-600' : 'text-amber-600'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        v-if="schedule.verification_status === 'VERIFIED_PV'"
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                      <path
                        v-else
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ schedule.verification_status === 'VERIFIED_PV' ? 'Verified' : 'Pending Verification' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div v-if="schedule.verification_report" class="text-sm text-gray-900">
                    {{ schedule.verification_report }}
                  </div>
                  <div v-else class="text-sm text-gray-400 italic">
                    Report pending
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer Info -->
      <div v-if="schedules.length > 0" class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="text-sm text-blue-800">
            <p class="font-medium mb-1">About Site Visit Schedules</p>
            <p>These schedules show upcoming verification visits to teaching centers. Verified centers have completed the verification process, while pending centers are awaiting their scheduled visit.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import apiServices from '@/services/services';

// State
const schedules = ref([]);
const loading = ref(true);
const errorMessage = ref('');

// Toast composable
const toast = useToast();

// Computed properties
const verifiedCount = computed(() =>
  schedules.value.filter(schedule => schedule.verification_status === 'VERIFIED_PV').length
);

const unverifiedCount = computed(() =>
  schedules.value.filter(schedule => schedule.verification_status !== 'VERIFIED_PV').length
);

// Date formatting functions
const formatDate = (dateString) => {
  if (!dateString) return 'Date not available';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date not available';
  }
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

// Fetch schedules function
const fetchSchedules = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';

    const response = await apiServices.getMhpcTeachingCenters();
    console.log('API Response:', JSON.stringify(response.data, null, 2));

    let centers = [];

    // Handle different response formats
    if (Array.isArray(response.data)) {
      centers = response.data;
    } else if (response.data && 'results' in response.data) {
      if (!Array.isArray(response.data.results)) {
        throw new Error('Invalid server response: Expected array of teaching centers');
      }
      centers = response.data.results;
    } else if (response.data && typeof response.data === 'object') {
      if (!response.data.id || !response.data.center_name) {
        throw new Error('Invalid teaching center data received from server');
      }
      centers = [response.data];
    } else {
      throw new Error('Unexpected response format from server');
    }

    // Filter for centers with send_to_user: true and verification_date
    schedules.value = centers.filter(
      (center) => center.send_to_user && center.verification_date
    );

    // Success toast only if we have schedules
    if (schedules.value.length > 0) {
      toast.success(`Successfully loaded ${schedules.value.length} schedule${schedules.value.length === 1 ? '' : 's'}`);
    }

  } catch (error) {
    console.error('Error fetching schedules:', error);

    // More user-friendly error messages
    if (error.message.includes('network') || error.message.includes('fetch')) {
      errorMessage.value = 'Network connection error. Please check your internet connection and try again.';
    } else if (error.message.includes('timeout')) {
      errorMessage.value = 'Request timed out. The server may be experiencing high traffic. Please try again in a moment.';
    } else if (error.message.includes('404')) {
      errorMessage.value = 'Service not found. Please contact support if this issue persists.';
    } else if (error.message.includes('500')) {
      errorMessage.value = 'Server error occurred. Our team has been notified. Please try again later.';
    } else {
      errorMessage.value = error.message || 'An unexpected error occurred while loading schedules. Please try again.';
    }

    toast.error('Failed to load schedules');
  } finally {
    loading.value = false;
  }
};

// Load schedules on component mount
onMounted(() => {
  fetchSchedules();
});
</script>

