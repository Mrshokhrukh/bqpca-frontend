<!-- components/TrackIsarReports.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">My Accreditation Applications</h1>
        <p class="text-gray-600">Track and manage your accreditation application status.</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading applications...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="applications.length === 0" class="text-center py-20 bg-white rounded-lg border">
        <div class="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
        <p class="text-gray-500">You haven't submitted any accreditation applications yet.</p>
      </div>

      <!-- Applications Table -->
      <div v-else class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow border-b border-gray-200 sm:rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institute
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application ID
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50 transition-colors duration-150">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ app.institute_profile_details.name }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{{ app.application_uid.substring(0, 8) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ formatDate(app.date_submitted_initial_app) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getStatus(app).className"
                      >
                        {{ getStatus(app).text }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button class="text-blue-600 hover:text-blue-800 transition-colors duration-150">
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from '@/services/services';

const applications = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await apiService.getAccreditationApplications();
    applications.value = response.data.results || [];
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    applications.value = [];
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getStatus = (app) => {
  const statusMap = {
    'draft_isar': { text: 'ISAR in Draft', className: 'bg-blue-100 text-blue-800' },
    'initial_app_submitted_heqc_review': { text: 'In Review', className: 'bg-yellow-100 text-yellow-800' },
    'initial_app_approved_awaiting_isar': { text: 'Awaiting ISAR', className: 'bg-teal-100 text-teal-800' },
    'isar_submitted_heqc_review': { text: 'ISAR in Review', className: 'bg-yellow-100 text-yellow-800' },
    'accredited': { text: 'Accredited', className: 'bg-green-100 text-green-800' },
    'rejected': { text: 'Not Accredited', className: 'bg-red-100 text-red-800' },
    'default': { text: 'Pending', className: 'bg-gray-100 text-gray-800' }
  };

  const statusKey = app?.status;

  if (statusKey && statusMap[statusKey]) {
    // Prefer the more descriptive 'status_display' from the API if it exists
    const text = app.status_display || statusMap[statusKey].text;
    return {
      text: text,
      className: statusMap[statusKey].className
    };
  }

  return statusMap['default'];
};
</script>