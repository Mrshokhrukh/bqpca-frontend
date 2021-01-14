<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h1 class="text-2xl font-semibold text-gray-800">Welcome, {{ authStore.fullName }}!</h1>
      <p class="text-gray-600 mt-2">{{ authStore.role }} - {{ authStore.serviceType }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Applied Card -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <FileText class="h-6 w-6 text-blue-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total Applied</p>
            <p class="text-2xl font-semibold text-gray-800">{{ stats.totalApplied }}</p>
          </div>
        </div>
      </div>

      <!-- Total Approved Card -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <CheckCircle class="h-6 w-6 text-green-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total Approved</p>
            <p class="text-2xl font-semibold text-gray-800">{{ stats.totalApproved }}</p>
          </div>
        </div>
      </div>

      <!-- Total Regretted Card -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-100">
            <XCircle class="h-6 w-6 text-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total Regretted</p>
            <p class="text-2xl font-semibold text-gray-800">{{ stats.totalRegretted }}</p>
          </div>
        </div>
      </div>

      <!-- Total Pending Card -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <Clock class="h-6 w-6 text-yellow-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total Pending</p>
            <p class="text-2xl font-semibold text-gray-800">{{ stats.totalPending }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- History Table -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800">Application History</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="application in applications" :key="application.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(application.date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ application.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(application.status)"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ application.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="text-blue-600 hover:text-blue-900" @click="viewApplication(application.id)">View</button>
              </td>
            </tr>
            <tr v-if="applications.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">No applications found</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">1</span>
              to
              <span class="font-medium">10</span>
              of
              <span class="font-medium">{{ applications.length }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Stats data
const stats = ref({
  totalApplied: 0,
  totalApproved: 0,
  totalRegretted: 0,
  totalPending: 0
});

// Applications data
const applications = ref([]);

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Get status class for badge
const getStatusClass = (status) => {
  const classes = {
    'Approved': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Regretted': 'bg-red-100 text-red-800',
    'In Progress': 'bg-blue-100 text-blue-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

// View application details
const viewApplication = (id) => {
  router.push(`/applications/${id}`);
};

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    // Replace with actual API calls
    stats.value = {
      totalApplied: 125,
      totalApproved: 80,
      totalRegretted: 15,
      totalPending: 30
    };

    // Mock applications data
    applications.value = [
      {
        id: 'APP001',
        date: '2024-01-10',
        type: 'New Application',
        status: 'Approved'
      },
      {
        id: 'APP002',
        date: '2024-01-15',
        type: 'Renewal',
        status: 'Pending'
      },
      // Add more mock data as needed
    ];
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>