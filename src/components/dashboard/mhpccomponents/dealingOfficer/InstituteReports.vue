<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <DOPageHeader
      title="MHPC Institutes Dashboard"
      :search-query="filters.search"
      @update:searchQuery="handleSearchUpdate"
      search-placeholder="Search by Name, CID..."
    >
      <template #actions>
        <button
          @click="exportToExcel"
          class="btn-primary ml-4"
          :disabled="isLoading || !reportData.length || isLoadingExport"
        >
          <LoaderCircle v-if="isLoadingExport" class="mr-2 h-4 w-4 animate-spin" />
          <FileSpreadsheet v-else class="mr-2 h-4 w-4" />
          Export Excel
        </button>
      </template>
    </DOPageHeader>

    <!-- Comprehensive Filters Section -->
    <div class="my-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-800">Filters</h2>
        <button @click="resetFilters" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Reset Filters
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Status Filter -->
        <div>
          <label for="status-filter" class="filter-label">Application Status</label>
          <select id="status-filter" v-model="filters.application_status" @change="fetchData(true)" class="filter-input">
            <option value="">All Statuses</option>
            <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>

        <!-- Dzongkhag Filter -->
        <div>
          <label for="dzongkhag-filter" class="filter-label">Dzongkhag</label>
          <select id="dzongkhag-filter" v-model="filters.dzongkhag" @change="fetchData(true)" class="filter-input">
            <option value="">All Dzongkhags</option>
            <option v-for="dzongkhag in dzongkhagOptions" :key="dzongkhag" :value="dzongkhag">{{ dzongkhag }}</option>
          </select>
        </div>

        <!-- Active Status Filter -->
        <div>
          <label for="active-filter" class="filter-label">Active Status</label>
          <select id="active-filter" v-model="filters.is_active" @change="fetchData(true)" class="filter-input">
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <!-- Date Range Filter -->
        <div class="lg:col-span-3">
          <label class="filter-label">Last Updated Date Range</label>
          <div class="flex gap-2">
            <input v-model="filters.start_date" type="date" class="filter-input" @change="fetchData(true)" aria-label="Start Date" />
            <input v-model="filters.end_date" type="date" class="filter-input" @change="fetchData(true)" aria-label="End Date" />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading, Error, and Empty States -->
    <div v-if="isLoading && !reportData.length" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
      <button @click="fetchData(true)" class="text-red-600 underline mt-2">Try Again</button>
    </div>
    <div v-else-if="!reportData.length && !isLoading" class="bg-white rounded-lg shadow p-8 text-center">
       <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
       <p class="mt-2 text-sm font-medium">No data available for the selected filters.</p>
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
                {{ header.label }}
                <button
                  v-if="header.sortable"
                  @click="handleSort(header.key)"
                  class="ml-2 focus:outline-none text-gray-400 hover:text-gray-600"
                  :aria-label="`Sort by ${header.label}`"
                >
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
          <tr v-for="item in reportData" :key="item.id" class="hover:bg-gray-50">
            <td v-for="header in tableHeaders" :key="header.key" class="table-cell">
              <template v-if="header.type === 'status'">
                <span :class="statusBadge(getNestedValue(item, header.key))">
                  {{ getNestedValue(item, header.key) || 'N/A' }}
                </span>
              </template>
              <template v-else-if="header.type === 'date'">
                {{ formatDate(getNestedValue(item, header.key)) }}
              </template>
              <template v-else>
                {{ getNestedValue(item, header.key) ?? 'N/A' }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div class="text-sm text-gray-700">
          <span v-if="totalItems > 0">
            Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }} results
          </span>
          <span v-else> No results </span>
        </div>
        <div class="flex gap-2">
          <button @click="prevPage" :disabled="currentPage === 1 || isLoading" class="pagination-btn">Previous</button>
          <button @click="nextPage" :disabled="currentPage >= totalPages || isLoading || totalItems === 0" class="pagination-btn">Next</button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import debounce from 'lodash/debounce';
// NOTE: You need to have 'xlsx' package installed. Run `npm install xlsx` or `yarn add xlsx`
import * as XLSX from 'xlsx';

import bmhcServices from '@/services/services';
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue';
import { FileSpreadsheet, LoaderCircle, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-vue-next';
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags';

const toast = useToast();
const ITEMS_PER_PAGE = 10;
const apiMethod = bmhcServices.getMhpcInstitutes;
const tableHeaders = [
  { key: 'institute_name', label: 'Institute Name', sortable: true },
  { key: 'application_status', label: 'Overall Status', type: 'status', sortable: true },
  { key: 'eoi_status', label: 'EOI Status', type: 'status', sortable: true },
  { key: 'eoi_reviewed_by', label: 'EOI Reviewed By', sortable: true },
  { key: 'dpr_status', label: 'DPR Status', type: 'status', sortable: true },
  { key: 'dpr_reviewed_by', label: 'DPR Reviewed By', sortable: true },
  { key: 'last_updated', label: 'Last Updated', type: 'date', sortable: true },
];

const transformData = (item) => ({
  id: item.id,
  institute_name: item.name_of_institution,
  application_status: item.application_status,
  eoi_status: item.do_eoi_review_decision,
  eoi_reviewed_by: item.eoi_reviewed_by_name,
  dpr_status: item.do_dpr_review_decision,
  dpr_reviewed_by: item.dpr_reviewed_by_name,
  last_updated: item.updated_at,
});

const reportData = ref([]);
const isLoading = ref(false);
const isLoadingExport = ref(false);
const error = ref(null);
const currentPage = ref(1);
const totalItems = ref(0);
const sortBy = ref('updated_at');
const sortOrder = ref('desc');

const initialFilters = () => ({
  search: '',
  start_date: '',
  end_date: '',
  application_status: '',
  dzongkhag: '',
  is_active: '',
});

const filters = reactive(initialFilters());

const statusOptions = ['Pending', 'EOI Approved', 'DPR Approved', 'Fully Approved', 'Rejected'];
const dzongkhagOptions = ref([]);

const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE));
const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE);
const endIndex = computed(() => Math.min(startIndex.value + ITEMS_PER_PAGE, totalItems.value));

const fetchData = async (resetPage = false) => {
  if (resetPage) currentPage.value = 1;
  isLoading.value = true;
  error.value = null;

  try {
    const params = {
      page: currentPage.value,
      page_size: ITEMS_PER_PAGE,
      ordering: sortBy.value ? `${sortOrder.value === 'desc' ? '-' : ''}${sortBy.value}` : '',
      ...filters,
    };

    Object.keys(params).forEach((key) => {
      if (params[key] === '' || params[key] === null) delete params[key];
    });

    const response = await apiMethod(params);

    if (response?.data?.results) {
      reportData.value = response.data.results.map(transformData);
      totalItems.value = response.data.count || 0;
    } else {
      throw new Error('Received invalid data structure from API.');
    }
  } catch (err) {
    error.value = 'Error fetching institutes data. Please try again.';
    toast.error('An API error occurred.');
    console.error('Error fetching institutes data:', err);
    reportData.value = [];
    totalItems.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const debouncedFetchData = debounce(() => fetchData(true), 500);

const handleSearchUpdate = (newValue) => {
  filters.search = newValue;
  debouncedFetchData();
};

const resetFilters = () => {
  Object.assign(filters, initialFilters());
  fetchData(true);
};

const handleSort = (key) => {
    const keyMap = {
        institute_name: 'name_of_institution',
        last_updated: 'updated_at',
    };
    const backendKey = keyMap[key] || key;
    if (sortBy.value === backendKey) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortBy.value = backendKey;
        sortOrder.value = 'asc';
    }
    fetchData();
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData();
  }
};

const getNestedValue = (obj, path) => {
    if (!path || !obj) return obj;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
const formatDate = (date) => {
    if (!date) return '–';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '–' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
const statusBadge = (status) => {
    const lowerStatus = String(status ?? '').toLowerCase().trim();
    let baseClasses = 'px-2 py-1 rounded-full text-xs font-medium inline-block capitalize';
    if (lowerStatus.includes('approve') || lowerStatus === 'completed' || lowerStatus === 'active') return `${baseClasses} bg-green-100 text-green-800`;
    if (lowerStatus.includes('pending') || lowerStatus.includes('processing')) return `${baseClasses} bg-yellow-100 text-yellow-800`;
    if (lowerStatus.includes('reject') || lowerStatus.includes('regretted')) return `${baseClasses} bg-red-100 text-red-800`;
    return `${baseClasses} bg-gray-100 text-gray-800`;
};

const fetchAllDataForExport = async () => {
  let allData = [];
  let currentPage = 1;
  let hasMore = true;
  const BATCH_SIZE = 100; // Fetch in larger batches for export

  while (hasMore) {
    try {
      const params = {
        page: currentPage,
        page_size: BATCH_SIZE,
        ordering: sortBy.value ? `${sortOrder.value === 'desc' ? '-' : ''}${sortBy.value}` : '',
        ...filters,
      };
      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] === null) delete params[key];
      });

      const response = await apiMethod(params);
      const results = response?.data?.results || [];

      if (results.length > 0) {
        allData.push(...results);
        // Check if there's a 'next' link in the response, which indicates more pages
        if (response.data.next) {
          currentPage++;
        } else {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    } catch (err) {
      console.error(`Error fetching page ${currentPage} for export:`, err);
      toast.error(`Failed to fetch all data. Export may be incomplete.`);
      hasMore = false; // Stop fetching on error
    }
  }
  return allData;
};

const exportToExcel = async () => {
  if (isLoadingExport.value) return;
  isLoadingExport.value = true;
  toast.info('Preparing data for export. This may take a moment...');

  try {
    const allRawData = await fetchAllDataForExport();

    if (!allRawData || allRawData.length === 0) {
      toast.warn('No data available to export for the selected filters.');
      return;
    }

    // Transform raw data to match the table structure
    const dataToExport = allRawData.map(item => {
      const transformed = transformData(item);
      // Further transform for excel readability, e.g. formatting dates
      return {
        ...transformed,
        last_updated: formatDate(transformed.last_updated),
      };
    });

    // Use header labels for the Excel columns
    const exportHeaders = tableHeaders.map(h => h.label);

    // Map dataToExport to an array of arrays, ordered by tableHeaders
    const sheetData = dataToExport.map(row =>
        tableHeaders.map(header => row[header.key] ?? 'N/A')
    );

    const ws = XLSX.utils.aoa_to_sheet([exportHeaders, ...sheetData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MHPC Institutes Report');

    const fileName = `MHPC_Institutes_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast.success('Export successful!');
  } catch (err) {
    console.error('Error exporting to Excel:', err);
    toast.error('An error occurred during the export process.');
  } finally {
    isLoadingExport.value = false;
  }
};

onMounted(() => {
  dzongkhagOptions.value = bhutanDzongkhagsGewogs.map(d => d.dzongkhag).sort();
  fetchData();
});
</script>

<style scoped>
.filter-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}
.filter-input {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  font-size: 0.875rem;
}
.filter-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}
.table-header {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #f9fafb;
  white-space: nowrap;
}
.table-cell {
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: #1f2937;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.2s;
  cursor: pointer;
}
.pagination-btn:hover:not(:disabled) {
  background-color: #f9fafb;
}
.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>