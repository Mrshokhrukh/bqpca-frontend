<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
    <div class="mx-auto">
      <!-- Header Section -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Accreditation Reports
            </h1>
            <p class="text-slate-600 mt-2 text-lg">Manage and monitor institutional accreditation applications</p>
          </div>
          <button
            @click="exportToCSV"
            :disabled="isLoading || mappedApplications.length === 0"
            class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to CSV
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
        <h2 class="text-2xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
          <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          Search & Filters
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <!-- Search -->
          <div class="xl:col-span-2">
            <label for="search" class="block text-sm font-semibold text-slate-700 mb-2">Search Applications</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                v-model="searchQuery"
                placeholder="Search by Institute Name or Reference No..."
                class="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/70"
              />
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label for="status" class="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select
              id="status"
              v-model="statusFilter"
              class="block w-full px-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
            >
              <option value="">All Statuses</option>
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>

          <!-- Grade Filter -->
          <div>
            <label for="grade" class="block text-sm font-semibold text-slate-700 mb-2">Grade</label>
            <select
              id="grade"
              v-model="gradeFilter"
              class="block w-full px-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
            >
              <option value="">All Grades</option>
              <option v-for="grade in grades" :key="grade.id" :value="grade.id">
                {{ grade.rating_category_name }}
              </option>
            </select>
          </div>

          <!-- Start Date -->
          <div>
            <label for="start-date" class="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
            <input
              type="date"
              id="start-date"
              v-model="startDate"
              class="block w-full px-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
            />
          </div>

          <!-- End Date -->
          <div>
            <label for="end-date" class="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
            <input
              type="date"
              id="end-date"
              v-model="endDate"
              class="block w-full px-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
            />
          </div>
        </div>
      </div>

      <!-- Data Table Section -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6">
          <h2 class="text-2xl font-semibold text-white flex items-center gap-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Applications Data
          </h2>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-slate-50/80">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    Reference No
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Institute Name
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0H4m0 0v10a1 1 0 001 1h14a1 1 0 001-1V7M4 7h16m-4 4v4m-4-4v4m-4-4v4" />
                    </svg>
                    Submission Date
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Final Grade
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Status
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white/60 backdrop-blur-sm divide-y divide-slate-200">
              <!-- Loading State -->
              <tr v-if="isLoading">
                <td colspan="5" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p class="text-lg text-slate-600">Loading applications...</p>
                  </div>
                </td>
              </tr>

              <!-- Error State -->
              <tr v-else-if="error">
                <td colspan="5" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="rounded-full bg-red-100 p-4">
                      <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <p class="text-lg text-red-600 font-semibold">{{ error }}</p>
                  </div>
                </td>
              </tr>

              <!-- No Data State -->
              <tr v-else-if="mappedApplications.length === 0">
                <td colspan="5" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center gap-4">
                    <div class="rounded-full bg-slate-100 p-4">
                      <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div class="space-y-2">
                      <p class="text-lg text-slate-600 font-semibold">No applications found</p>
                      <p class="text-slate-500">Try adjusting your search criteria or filters</p>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-else v-for="app in mappedApplications" :key="app.id" class="hover:bg-white/80 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
                      {{ app.referenceNo }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm">
                    <div class="font-semibold text-slate-900">{{ app.instituteName }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m4 0H4m0 0v10a1 1 0 001 1h14a1 1 0 001-1V7M4 7h16" />
                    </svg>
                    <span class="text-sm text-slate-900">{{ app.submissionDate }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 border border-indigo-200">
                    {{ app.finalGrade }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold shadow-sm"
                    :class="getStatusClass(app.statusKey)"
                  >
                    <span
                      class="absolute inset-0 rounded-full opacity-20"
                      :class="getStatusBackgroundClass(app.statusKey)"
                    ></span>
                    <span class="relative flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full" :class="getStatusIndicatorClass(app.statusKey)"></div>
                      {{ app.status }}
                    </span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiService from '@/services/services'; // Make sure this path is correct
import { useUtils } from './Utils'; // Assuming your composable is in this path

const { downloadCSV } = useUtils();

// --- STATE ---
const applications = ref([]);
const grades = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Filters State
const statusFilter = ref('');
const gradeFilter = ref('');
const searchQuery = ref('');
const startDate = ref('');
const endDate = ref('');

// Simplified status options for the filter dropdown
const statusOptions = ref([
  { value: 'initial_app_submitted_heqc_review', text: 'Pending Review' },
  { value: 'site_visit_scheduled', text: 'Site Visit Scheduled' },
  { value: 'approved_accredited', text: 'Approved' },
  { value: 'rejected_not_accredited', text: 'Rejected' },
  { value: 'appealed', text: 'Appealed' },
]);

// --- DATA FETCHING ---
const fetchApplications = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const params = {};
    if (statusFilter.value) params.status = statusFilter.value;
    if (searchQuery.value) params.search = searchQuery.value;
    if (gradeFilter.value) params.final_grade_awarded = gradeFilter.value;
    if (startDate.value) params.created_at__gte = startDate.value;
    if (endDate.value) params.created_at__lte = endDate.value;

    const response = await apiService.getAccreditationApplications(params);
    applications.value = response.data.results || response.data;
  } catch (e) {
    console.error('Failed to fetch accreditation reports:', e);
    error.value = 'Failed to load data. Please check your connection and try again.';
  } finally {
    isLoading.value = false;
  }
};

const fetchGrades = async () => {
  try {
    const response = await apiService.getMastersRatingCategories();
    const results = response.data.results || response.data;

    if (Array.isArray(results)) {
      grades.value = results.filter(grade => grade && grade.id);
    } else {
      grades.value = [];
    }

  } catch (e) {
    console.error('Failed to fetch grades:', e);
    grades.value = [];
  }
}

// Initial data load on component mount
onMounted(() => {
  fetchApplications();
  fetchGrades();
});

// Watch all filters to refetch data when they change
watch([statusFilter, gradeFilter, startDate, endDate], fetchApplications);

let searchDebounceTimer = null;
watch(searchQuery, () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(fetchApplications, 500);
});

// --- DATA TRANSFORMATION ---
const mappedApplications = computed(() => {
  if (!Array.isArray(applications.value)) return [];
  return applications.value.map(app => ({
      id: app.id,
      referenceNo: app.application_reference_no || `APP-${app.id}`,
      instituteName: app.institute_profile_details?.name || 'N/A',
      submissionDate: app.date_initial_app_submitted_to_heqc
        ? new Date(app.date_initial_app_submitted_to_heqc).toLocaleDateString()
        : 'N/A',
      finalGrade: app.final_grade_awarded_details?.rating_category_name || 'N/A',
      status: app.status_display || 'Unknown',
      statusKey: app.status,
    }));
});

// --- METHODS ---
const exportToCSV = () => {
  if (mappedApplications.value.length === 0) return;

  const headers = [
    { label: 'Reference No', key: 'referenceNo' },
    { label: 'Institute Name', key: 'instituteName' },
    { label: 'Submission Date', key: 'submissionDate' },
    { label: 'Final Grade', key: 'finalGrade' },
    { label: 'Status', key: 'status' },
  ];

  downloadCSV(mappedApplications.value, headers, 'accreditation_report.csv');
};

const getStatusClass = (statusKey) => {
  if (statusKey?.includes('rejected')) return 'text-red-800 bg-red-100 border-red-200';
  if (statusKey?.includes('approved_accredited')) return 'text-emerald-800 bg-emerald-100 border-emerald-200';
  if (statusKey?.includes('appealed')) return 'text-orange-800 bg-orange-100 border-orange-200';
  if (statusKey?.includes('site_visit') || statusKey?.includes('coi')) return 'text-purple-800 bg-purple-100 border-purple-200';
  if (statusKey?.includes('submitted') || statusKey?.includes('review') || statusKey?.includes('pending')) return 'text-blue-800 bg-blue-100 border-blue-200';
  return 'text-slate-800 bg-slate-100 border-slate-200';
};

const getStatusBackgroundClass = (statusKey) => {
  if (statusKey?.includes('rejected')) return 'bg-red-200';
  if (statusKey?.includes('approved_accredited')) return 'bg-emerald-200';
  if (statusKey?.includes('appealed')) return 'bg-orange-200';
  if (statusKey?.includes('site_visit') || statusKey?.includes('coi')) return 'bg-purple-200';
  if (statusKey?.includes('submitted') || statusKey?.includes('review') || statusKey?.includes('pending')) return 'bg-blue-200';
  return 'bg-slate-200';
};

const getStatusIndicatorClass = (statusKey) => {
  if (statusKey?.includes('rejected')) return 'bg-red-500';
  if (statusKey?.includes('approved_accredited')) return 'bg-emerald-500';
  if (statusKey?.includes('appealed')) return 'bg-orange-500';
  if (statusKey?.includes('site_visit') || statusKey?.includes('coi')) return 'bg-purple-500';
  if (statusKey?.includes('submitted') || statusKey?.includes('review') || statusKey?.includes('pending')) return 'bg-blue-500';
  return 'bg-slate-500';
};
</script>