<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Application Tracking Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        CPD Application Tracking
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Track the status of your CPD applications.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-lg text-gray-700">Loading applications...</span>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p class="font-bold">Error loading applications</p>
      <p>{{ error }}</p>
      <button @click="fetchApplications" class="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
        Retry
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && applications.length === 0" class="bg-gray-50 rounded-xl p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
      <p class="mt-1 text-gray-500">You haven't submitted any CPD applications yet.</p>
      <button @click="createNewApplication"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Create New Application
      </button>
    </div>

    <!-- Search and Filter Controls -->
    <div v-if="!loading && !error && applications.length > 0"
      class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div class="flex items-center mb-4 sm:mb-0">
        <label for="search" class="mr-3 text-sm font-medium text-gray-700">Search:</label>
        <input type="text" id="search" v-model="searchTerm"
          class="block w-full sm:w-64 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          placeholder="Enter CPD title or ID" />
      </div>

      <div class="flex items-center">
        <label for="statusFilter" class="mr-3 text-sm font-medium text-gray-700">Status:</label>
        <select id="statusFilter" v-model="statusFilter"
          class="block w-full sm:w-auto rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Draft">Draft</option>
        </select>
      </div>
    </div>

    <!-- Application Table -->
    <div v-if="!loading && !error && applications.length > 0"
      class="bg-white border rounded-xl shadow-sm overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title of CPD
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submission Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="application in filteredApplications" :key="application.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ application.id }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
              {{ application.title_of_cpd || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(application.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ application.is_cpd_approved ? 'Approved CPD' : 'New CPD' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span :class="[
      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
      getStatusClass(application)
    ]">
                {{ getStatusText(application) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="viewApplication(application.id)"
                class="text-blue-600 hover:text-blue-900 focus:outline-none">View</button>

              <button v-if="getStatusText(application) === 'Draft'" @click="editApplication(application.id)"
                class="ml-3 text-green-600 hover:text-green-900 focus:outline-none">
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- New Application Button -->
    <div v-if="!loading && applications.length > 0" class="mt-6 flex justify-end">
      <button @click="createNewApplication"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        Create New Application
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import apiservice from '@/services/bmhcservices';

const router = useRouter();
const authStore = useAuthStore();

// Reactive state
const applications = ref([]);
const loading = ref(false);
const error = ref(null);
const searchTerm = ref('');
const statusFilter = ref('');

// Computed properties for filtering applications
const filteredApplications = computed(() => {
  const term = searchTerm.value.toLowerCase().trim();
  const statusTerm = statusFilter.value;

  return applications.value.filter(app => {
    // Title match
    const titleMatch = app.title_of_cpd ?
      app.title_of_cpd.toLowerCase().includes(term) : false;

    // ID match
    const idMatch = app.id ?
      app.id.toString().toLowerCase().includes(term) : false;

    // Status match
    let statusMatch = true;
    if (statusTerm) {
      const appStatus = getStatusText(app);
      statusMatch = appStatus === statusTerm;
    }

    return (titleMatch || idMatch || term === '') && statusMatch;
  });
});

// Fetch all CPD applications
const fetchApplications = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Fetch CPD applications from the backend - single API call
    const response = await apiservice.getBmhcCpdTask();

    // Process the response
    if (response.data && response.data.results) {
      applications.value = response.data.results;
      console.log('Applications loaded:', applications.value.length);
    } else {
      error.value = 'No data received from server';
    }
  } catch (err) {
    console.error('Error fetching applications:', err);
    error.value = err.message || 'Failed to load applications';
  } finally {
    loading.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (err) {
    console.error('Error formatting date:', err);
    return dateString;
  }
};

const getStatusText = (application) => {
  if (application.is_draft) {
    return 'Draft';
  }

  // Check if the application is under review (pending)
  if (!application.review_status || application.review_status === 'Pending') {
    return 'Pending';
  }

  // If review_status is present and not pending, use it
  return application.review_status;
};

const getStatusClass = (application) => {
  const status = getStatusText(application);

  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Draft':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Navigation actions
const viewApplication = (applicationId) => {
  router.push(`/dashboard/cpd-applications/${applicationId}`);
};

const editApplication = (applicationId) => {
  router.push(`/dashboard/cpd-applications/${applicationId}/edit`);
};

const createNewApplication = () => {
  router.push('/dashboard/cpd-provider');
};

// Fetch applications when component mounts
onMounted(() => {
  fetchApplications();
});
</script>
