<template>
  <div class="min-h-screen bg-gray-50">
    <div class=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="border-l-4 border-indigo-500 pl-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">IQAR Submissions</h1>
          <p class="text-lg text-gray-600 max-w-3xl">
            Review and manage post-accreditation reports submitted by accredited institutions.
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
        <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-lg font-medium text-gray-700">Loading Submitted Reports...</p>
        <p class="text-sm text-gray-500 mt-1">Please wait while we fetch the latest data</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-red-800">Unable to Load Reports</h3>
            <p class="text-red-700 mt-2">{{ error }}</p>
            <button @click="fetchData" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-6">
        <!-- Search and Controls -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex-1 max-w-md">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by institute name or reference number..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-600">
                <span class="font-medium">{{ filteredAndGroupedReports.length }}</span>
                {{ filteredAndGroupedReports.length === 1 ? 'institution' : 'institutions' }}
              </div>
            </div>
          </div>
        </div>

        <!-- No Results State -->
        <div v-if="filteredAndGroupedReports.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
          <p class="text-gray-500 max-w-md mx-auto">
            {{ searchQuery ? 'No reports match your search criteria. Try adjusting your search terms.' : 'No post-accreditation reports have been submitted yet.' }}
          </p>
          <button v-if="searchQuery" @click="searchQuery = ''" class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Clear Search
          </button>
        </div>

        <!-- Compact Table View -->
        <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5">
                    Institution Details
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/10">
                    <div class="flex items-center">
                      <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Implementation Plan
                      <span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">6 Months</span>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/10">
                    <div class="flex items-center">
                      <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Progress Report
                      <span class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">2.5 Years</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="group in filteredAndGroupedReports"
                    :key="group.application_id"
                    class="hover:bg-gray-50 transition-colors duration-150">

                  <!-- Institution Details -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="space-y-1">
                      <div class="text-sm font-semibold text-gray-900">
                        {{ group.institute_name }}
                      </div>
                      <div class="text-xs text-gray-500 flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        {{ group.ref_no }}
                      </div>
                    </div>
                  </td>

                  <!-- Implementation Plan -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="group.implementation_plan" class="space-y-2">
                      <div class="flex items-center justify-between">
                        <span :class="statusBadgeClass(group.implementation_plan.status)" class="status-badge">
                          {{ group.implementation_plan.status_display }}
                        </span>
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ formatDate(group.implementation_plan.submission_date) }}
                      </div>
                      <button @click="openViewModal(group.implementation_plan)"
                              class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View
                      </button>
                    </div>
                    <div v-else class="flex flex-col items-center py-2 text-center">
                      <svg class="w-6 h-6 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span class="text-xs text-gray-400">Not Submitted</span>
                    </div>
                  </td>

                  <!-- Progress Report -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="group.progress_report" class="space-y-2">
                      <div class="flex items-center justify-between">
                        <span :class="statusBadgeClass(group.progress_report.status)" class="status-badge">
                          {{ group.progress_report.status_display }}
                        </span>
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ formatDate(group.progress_report.submission_date) }}
                      </div>
                      <button @click="openViewModal(group.progress_report)"
                              class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View
                      </button>
                    </div>
                    <div v-else class="flex flex-col items-center py-2 text-center">
                      <svg class="w-6 h-6 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span class="text-xs text-gray-400">Not Submitted</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination (if needed in future) -->
          <div v-if="filteredAndGroupedReports.length > 20" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </a>
              <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </a>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing <span class="font-medium">1</span> to <span class="font-medium">{{ Math.min(20, filteredAndGroupedReports.length) }}</span> of
                  <span class="font-medium">{{ filteredAndGroupedReports.length }}</span> results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced View Details Modal -->
    <div v-if="isModalOpen && selectedReport"
         class="fixed inset-0 z-50 overflow-y-auto"
         @click.self="closeViewModal">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ selectedReport.report_type_display }}</h2>
              <p class="text-sm text-gray-600 mt-1">Detailed report information and submissions</p>
            </div>
            <button @click="closeViewModal"
                    class="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-6">

              <!-- Report Info -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-blue-900">Submission Date:</span>
                    <p class="text-blue-800 mt-1">{{ formatDate(selectedReport.submission_date) }}</p>
                  </div>
                  <div>
                    <span class="font-medium text-blue-900">Status:</span>
                    <div class="mt-1">
                      <span :class="statusBadgeClass(selectedReport.status)" class="status-badge">
                        {{ selectedReport.status_display }}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span class="font-medium text-blue-900">Report Type:</span>
                    <p class="text-blue-800 mt-1">{{ selectedReport.report_type_display }}</p>
                  </div>
                </div>
              </div>

              <!-- Implementation Plan Details -->
              <div v-if="selectedReport.report_type === 'implementation_plan'" class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Implementation Plan Items
                </h3>
                <div v-for="item in selectedReport.implementation_plan_items"
                     :key="item.id"
                     class="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
                  <h4 class="font-semibold text-gray-900 text-base">{{ item.standard_name }}</h4>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <dt class="text-sm font-medium text-gray-600">Recommendations:</dt>
                      <dd class="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">{{ item.recommendations }}</dd>
                    </div>
                    <div class="space-y-2">
                      <dt class="text-sm font-medium text-gray-600">Actions:</dt>
                      <dd class="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">{{ item.actions }}</dd>
                    </div>
                    <div class="space-y-2">
                      <dt class="text-sm font-medium text-gray-600">Lead Person:</dt>
                      <dd class="text-sm text-gray-900 bg-white p-3 rounded border">{{ item.lead_person }}</dd>
                    </div>
                    <div class="space-y-2">
                      <dt class="text-sm font-medium text-gray-600">Timeline:</dt>
                      <dd class="text-sm text-gray-900 bg-white p-3 rounded border">{{ item.timeline }}</dd>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <dt class="text-sm font-medium text-gray-600">Remarks:</dt>
                    <dd class="text-sm text-gray-900 bg-white p-3 rounded border whitespace-pre-wrap">{{ item.remarks }}</dd>
                  </div>
                </div>
              </div>

              <!-- Progress Report Details -->
              <div v-if="selectedReport.report_type === 'progress_report'" class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Progress Report Responses
                </h3>

                <div class="space-y-6">
                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h4 class="font-medium text-gray-900 mb-3">1. Internal Quality Review Activity</h4>
                    <div class="bg-white p-4 rounded border text-sm text-gray-900 whitespace-pre-wrap">
                      {{ selectedReport.q1_internal_review_details }}
                    </div>
                  </div>

                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h4 class="font-medium text-gray-900 mb-3">2. Progress of the Implementation Plan</h4>
                    <div class="bg-white p-4 rounded border text-sm text-gray-900 whitespace-pre-wrap">
                      {{ selectedReport.q2_progress_highlight }}
                    </div>
                  </div>

                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h4 class="font-medium text-gray-900 mb-3">3. Initiatives for Continuous Improvement</h4>
                    <div class="bg-white p-4 rounded border text-sm text-gray-900 whitespace-pre-wrap">
                      {{ selectedReport.q3_initiatives_for_improvement }}
                    </div>
                  </div>

                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h4 class="font-medium text-gray-900 mb-3">4. Unimplemented Recommendations and Reasons</h4>
                    <div class="bg-white p-4 rounded border text-sm text-gray-900 whitespace-pre-wrap">
                      {{ selectedReport.q4_unimplemented_recommendations }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Officer's Remarks -->
              <div v-if="selectedReport.remarks_heqc" class="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <h3 class="text-lg font-semibold text-amber-900 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8m0 0H7m5-3v3m0 0v3"></path>
                  </svg>
                  Officer's Remarks
                </h3>
                <div class="bg-white p-4 rounded border text-sm text-gray-900 whitespace-pre-wrap">
                  {{ selectedReport.remarks_heqc }}
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
            <button @click="closeViewModal"
                    class="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-badge {
  @apply px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full;
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';

const reports = ref([]);
const isLoading = ref(true);
const error = ref(null);
const searchQuery = ref('');

const isModalOpen = ref(false);
const selectedReport = ref(null);
const toast = useToast();

// Group reports by application ID using the new API structure
const groupedReports = computed(() => {
  const groups = new Map();

  reports.value.forEach(report => {
    const appId = report.application;
    if (!appId) return;

    if (!groups.has(appId)) {
      groups.set(appId, {
        application_id: appId,
        institute_name: report.application_details?.institute_name || `Institute (App ID: ${appId})`,
        ref_no: report.application_details?.application_reference_no || 'N/A',
        implementation_plan: null,
        progress_report: null,
      });
    }

    const group = groups.get(appId);
    if (report.report_type === 'implementation_plan') {
      group.implementation_plan = report;
    } else if (report.report_type === 'progress_report') {
      group.progress_report = report;
    }
  });

  return Array.from(groups.values()).sort((a, b) => a.institute_name.localeCompare(b.institute_name));
});

// Filter the grouped reports based on the search query
const filteredAndGroupedReports = computed(() => {
  if (!searchQuery.value) {
    return groupedReports.value;
  }

  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return groupedReports.value.filter(group =>
    group.institute_name.toLowerCase().includes(lowerCaseQuery) ||
    (group.ref_no && group.ref_no.toLowerCase().includes(lowerCaseQuery))
  );
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

const openViewModal = (report) => {
  selectedReport.value = report;
  isModalOpen.value = true;
};

const closeViewModal = () => {
  isModalOpen.value = false;
  selectedReport.value = null;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const statusBadgeClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'submitted': 'bg-blue-100 text-blue-800',
    'reviewed': 'bg-purple-100 text-purple-800',
    'needs_revision': 'bg-orange-100 text-orange-800',
    'accepted': 'bg-green-100 text-green-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
</script>