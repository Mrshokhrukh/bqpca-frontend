<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Page Header -->
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Teaching Hospital Reports
        </h1>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0 items-center">
        <div class="relative">
          <input
            type="text"
            v-model="filters.search"
            placeholder="Search by Hospital or Title..."
            class="filter-input w-64 pr-10"
          />
          <Search class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          @click="exportToExcel"
          class="btn-primary ml-3"
          :disabled="isLoading || !allReports.length || isLoadingExport"
        >
          <LoaderCircle v-if="isLoadingExport" class="mr-2 h-4 w-4 animate-spin" />
          <FileSpreadsheet v-else class="mr-2 h-4 w-4" />
          Export Excel
        </button>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="my-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-800">Filters</h2>
        <button @click="resetFilters" class="text-sm font-medium text-blue-600 hover:text-blue-800">
          Reset Filters
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label for="yearFilter" class="filter-label">Year Submitted</label>
          <select id="yearFilter" v-model="filters.year" class="filter-input">
            <option value="">All Years</option>
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <div>
          <label for="statusFilter" class="filter-label">Status</label>
          <select id="statusFilter" v-model="filters.status" class="filter-input">
            <option value="">All Statuses</option>
             <option v-for="status in availableStatuses" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !allReports.length" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800 font-semibold">An Error Occurred</p>
      <p class="text-red-700 mt-1">{{ error }}</p>
      <button @click="fetchData" class="text-red-600 underline mt-2 font-medium">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!paginatedReports.length && !isLoading" class="bg-white rounded-lg shadow p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No Data Available</h3>
      <p class="mt-1 text-sm text-gray-500">No records match your current filters. Try adjusting them.</p>
    </div>

    <!-- Report Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-x-auto relative">
       <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="header in tableHeaders" :key="header.key" class="table-header">
              <div class="flex items-center">
                <span>{{ header.label }}</span>
                <button v-if="header.sortable" @click="handleSort(header.key)" class="ml-2 focus:outline-none text-gray-400 hover:text-gray-600">
                  <template v-if="sortBy === header.key">
                    <ChevronUp v-if="sortOrder === 'asc'" class="h-4 w-4" />
                    <ChevronDown v-else class="h-4 w-4" />
                  </template>
                  <ChevronsUpDown v-else class="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in paginatedReports" :key="item.id" class="hover:bg-gray-50">
            <td v-for="header in tableHeaders" :key="header.key" class="table-cell">
              <span v-if="header.type === 'status'" :class="statusBadge(item[header.key])">{{ item[header.key] || 'N/A' }}</span>
              <span v-else-if="header.type === 'date'">{{ formatDate(item[header.key]) }}</span>
              <span v-else>{{ item[header.key] ?? 'N/A' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
      <p class="text-sm text-gray-700">
        Showing <b>{{ startIndex + 1 }}</b> to <b>{{ endIndex }}</b> of <b>{{ filteredReports.length }}</b> results
      </p>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1 || isLoading" class="pagination-btn">Previous</button>
        <button @click="nextPage" :disabled="currentPage >= totalPages || isLoading" class="pagination-btn">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

import * as XLSX from 'xlsx';
import apiService from '@/services/services';
import { FileSpreadsheet, LoaderCircle, ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-vue-next';

const toast = useToast();
const ITEMS_PER_PAGE = 10;

// --- Configuration & Data Transformation ---
const tableHeaders = [
  { key: 'hospitalName', label: 'Hospital Name', sortable: true },
  { key: 'title', label: 'Report Title', sortable: true },
  { key: 'dateSubmitted', label: 'Submitted On', sortable: true, type: 'date' },
  { key: 'status', label: 'Status', sortable: true, type: 'status' },
  { key: 'reviewedBy', label: 'Reviewed By', sortable: true },
  { key: 'lastUpdated', label: 'Last Updated', sortable: true, type: 'date' },
];

const transformData = (apiItem) => ({
  id: apiItem.id,
  hospitalName: apiItem.institute_details?.name_of_institution || 'Unknown Institute',
  title: apiItem.center_name,
  dateSubmitted: apiItem.created_at,
  status: apiItem.tc_review_decision_display,
  reviewedBy: apiItem.tc_reviewed_by_name || 'N/A',
  lastUpdated: apiItem.updated_at,
});

// --- Component State ---
const allReports = ref([]);
const isLoading = ref(false);
const isLoadingExport = ref(false);
const error = ref(null);
const currentPage = ref(1);
const sortBy = ref('dateSubmitted');
const sortOrder = ref('desc');

const initialFilters = { search: '', year: '', status: '' };
const filters = reactive({ ...initialFilters });

const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await apiService.getMhpcTeachingCenters();
    if (response?.data?.results) {
      allReports.value = response.data.results.map(transformData);
    } else {
      throw new Error('Received invalid data structure from API.');
    }
  } catch (err) {
    error.value = `Error fetching reports. Please try again.`;
    toast.error('An API error occurred.');
    console.error('Error fetching reports:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);

// --- Computed Properties for Filtering, Sorting, and Pagination ---
const filteredReports = computed(() => {
  let data = [...allReports.value];

  // Apply filters
  data = data.filter(report => {
    const searchMatch = (report.hospitalName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         report.title.toLowerCase().includes(filters.search.toLowerCase()));
    const yearMatch = filters.year ? new Date(report.dateSubmitted).getFullYear() === Number(filters.year) : true;
    const statusMatch = filters.status ? report.status === filters.status : true;
    return searchMatch && yearMatch && statusMatch;
  });

  // Apply sorting
  if (sortBy.value) {
    data.sort((a, b) => {
      let valA = a[sortBy.value];
      let valB = b[sortBy.value];
      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return data;
});

const totalPages = computed(() => Math.ceil(filteredReports.value.length / ITEMS_PER_PAGE));
const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE);
const endIndex = computed(() => Math.min(startIndex.value + ITEMS_PER_PAGE, filteredReports.value.length));

const paginatedReports = computed(() => {
  return filteredReports.value.slice(startIndex.value, endIndex.value);
});

const availableYears = computed(() => Array.from(new Set(allReports.value.map(r => new Date(r.dateSubmitted).getFullYear()))).sort((a, b) => b - a));
const availableStatuses = computed(() => Array.from(new Set(allReports.value.map(r => r.status))));

// --- Event Handlers ---
const handleSort = (key) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortOrder.value = 'asc';
  }
};

const resetFilters = () => {
  Object.assign(filters, initialFilters);
};

const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

watch(filters, () => {
  currentPage.value = 1;
});

// --- Export Logic ---
const exportToExcel = () => {
  if (isLoadingExport.value || !filteredReports.value.length) return;

  isLoadingExport.value = true;
  try {
    const dataToExport = filteredReports.value.map(item => {
      const row = {};
      tableHeaders.forEach(header => {
        const rawValue = item[header.key];
        row[header.label] = header.type === 'date' ? formatDate(rawValue) : rawValue ?? 'N/A';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hospital Reports');
    worksheet['!cols'] = tableHeaders.map(header => ({ wch: Math.max(header.label.length, 25) }));
    XLSX.writeFile(workbook, `teaching_hospital_reports_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel report exported successfully!');
  } catch (err) {
    console.error('Excel Export error:', err);
    toast.error('Failed to export report.');
  } finally {
    isLoadingExport.value = false;
  }
};

// --- Formatting & Style Helpers ---
const formatDate = (date) => {
  if (!date) return '–';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '–';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusBadge = (status) => {
  const lowerStatus = String(status ?? '').toLowerCase().trim();
  let baseClasses = 'px-2 py-1 rounded-full text-xs font-medium inline-block capitalize';
  if (lowerStatus.includes('approved')) return `${baseClasses} bg-green-100 text-green-800`;
  if (lowerStatus.includes('pending')) return `${baseClasses} bg-yellow-100 text-yellow-800`;
  if (lowerStatus.includes('regretted')) return `${baseClasses} bg-red-100 text-red-800`;
  return `${baseClasses} bg-gray-100 text-gray-800`;
};
</script>

<style scoped>
/* Copied directly from ProfessionalsReport.vue for consistency */
.filter-label {
  display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.25rem;
}
.filter-input {
  display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); background-color: #ffffff; font-size: 0.875rem;
}
.filter-input:focus {
  outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}
.table-header {
  padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 500; color: #6b7280;
  text-transform: uppercase; letter-spacing: 0.05em; background-color: #f9fafb; white-space: nowrap;
}
.table-cell {
  padding: 1rem 1.5rem; white-space: nowrap; font-size: 0.875rem; color: #1f2937;
}
.btn-primary {
  display: inline-flex; align-items: center; background-color: #3b82f6; color: white; padding: 0.5rem 1rem;
  border-radius: 0.375rem; font-weight: 500; font-size: 0.875rem; border: none; cursor: pointer;
  transition: background-color 0.2s ease-in-out; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}
.btn-primary:disabled {
  opacity: 0.6; cursor: not-allowed;
}
.pagination-btn {
  padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background-color: white;
  font-size: 0.875rem; color: #374151; transition: background-color 0.2s; cursor: pointer;
}
.pagination-btn:hover:not(:disabled) {
  background-color: #f9fafb;
}
.pagination-btn:disabled {
  opacity: 0.5; cursor: not-allowed;
}
</style>