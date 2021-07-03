<!-- ProfessionalsReport.vue -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <DOPageHeader
      title="MHPC Professionals Dashboard"
      :search-query="filters.search"
      @update:searchQuery="handleSearchUpdate"
      search-placeholder="Search by Name, Reg. No..."
      :filter-value="filters.endorsement_decision"
      @update:filterValue="handleStatusUpdate"
      :filter-options="CONFIG.statusFilterOptions"
    >
      <template #actions>
        <div class="flex items-center ml-4">
          <button
            @click="exportToExcel"
            class="btn-primary"
            :disabled="isLoading || !reportData.length || isLoadingExport"
          >
            <LoaderCircle v-if="isLoadingExport" class="mr-2 h-4 w-4 animate-spin" />
            <FileSpreadsheet v-else class="mr-2 h-4 w-4" />
            Export Excel
          </button>
        </div>
      </template>
    </DOPageHeader>

    <!-- Filters Section -->
    <div class="my-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-medium text-gray-800">Filters</h2>
        <button @click="resetFilters" class="text-sm font-medium text-blue-600 hover:text-blue-800">
          Reset Filters
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Date Range Filter -->
        <div>
          <label class="filter-label">Endorsement Date Range</label>
          <div class="flex gap-2">
            <input v-model="filters.start_date" type="date" class="filter-input" aria-label="Start Date" :max="filters.end_date || today" />
            <input v-model="filters.end_date" type="date" class="filter-input" aria-label="End Date" :min="filters.start_date" :max="today" />
          </div>
        </div>
        <!-- Registration Type Filter -->
        <div>
          <label for="regTypeFilter" class="filter-label">Registration Type</label>
          <select id="regTypeFilter" v-model="filters.registration_type_name" class="filter-input">
            <option v-for="option in CONFIG.registrationTypeOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <!-- Payment Status Filter -->
        <div>
          <label for="paymentStatusFilter" class="filter-label">Payment Status</label>
          <select id="paymentStatusFilter" v-model="filters.payment_status" class="filter-input">
            <option v-for="option in CONFIG.paymentStatusOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !reportData.length" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800 font-semibold">An Error Occurred</p>
      <p class="text-red-700 mt-1">{{ error }}</p>
      <button @click="fetchData(true)" class="text-red-600 underline mt-2 font-medium">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!reportData.length && !isLoading" class="bg-white rounded-lg shadow p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
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
                <button v-if="header.sortable" @click="handleSort(header.key)" class="ml-2 focus:outline-none text-gray-400 hover:text-gray-600" :aria-label="`Sort by ${header.label}`">
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
              <span v-if="header.type === 'status'" :class="statusBadge(item[header.key])">{{ item[header.key] || 'N/A' }}</span>
              <span v-else-if="header.type === 'date'">{{ formatDate(item[header.key]) }}</span>
              <span v-else>{{ item[header.key] ?? 'N/A' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
      <p class="text-sm text-gray-700">
        <span v-if="totalItems > 0">Showing <b>{{ startIndex + 1 }}</b> to <b>{{ endIndex }}</b> of <b>{{ totalItems }}</b> results</span>
        <span v-else>No results</span>
      </p>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1 || isLoading" class="pagination-btn">Previous</button>
        <button @click="nextPage" :disabled="currentPage >= totalPages || isLoading" class="pagination-btn">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DealingOfficerReports'
}
</script>
<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import debounce from 'lodash/debounce';
import * as XLSX from 'xlsx';
import apiServices from '@/services/services';
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue';
import { FileSpreadsheet, LoaderCircle, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-vue-next';

const toast = useToast();
const ITEMS_PER_PAGE = 10;

// --- Configuration ---
// Grouping static config makes it easier to manage and read.
const CONFIG = {
  apiMethod: apiServices.getMhpcNewApplications,
  statusFilterOptions: [
    { value: '', text: 'All Statuses' },
    { value: 'Approved', text: 'Approved' },
    { value: 'Pending', text: 'Pending' },
    { value: 'Regretted', text: 'Regretted' },
  ],
  registrationTypeOptions: [
    { value: '', text: 'All Types' },
    { value: 'New Registration', text: 'New Registration' },
    { value: 'Renewal', text: 'Renewal' },
    { value: 'Additional Qualification', text: 'Additional Qualification' },
  ],
  paymentStatusOptions: [
    { value: '', text: 'All Payment Statuses' },
    { value: 'paid', text: 'Paid' },
    { value: 'completed', text: 'Completed' }, // As per your API response
    { value: 'pending', text: 'Pending' },
    { value: 'failed', text: 'Failed' },
    { value: 'waived', text: 'Waived' },
  ],
};

const tableHeaders = [
  { key: 'registration_no', label: 'Reg Number', sortable: true },
  { key: 'applicant_name', label: 'Applicant Name', sortable: true },
  { key: 'registration_type', label: 'Type', sortable: true },
  { key: 'status', label: 'Status', type: 'status', sortable: true },
  { key: 'payment_status', label: 'Payment Status', type: 'status', sortable: true },
  { key: 'endorsed_at', label: 'Endorsed Date', type: 'date', sortable: true },
  { key: 'endorsed_by', label: 'Endorsed By', sortable: true },
];

// --- Data Transformation ---
// This is the key fix. It correctly processes the nested API structure.
const transformData = (apiItem) => {
  // Find the primary qualification, or fall back to the first one.
  const qualification =
    apiItem.user_qualifications?.find((q) => q.is_primary_qualification) ||
    apiItem.user_qualifications?.[0] ||
    {};

  return {
    id: apiItem.id, // Use top-level ID for the table row key
    registration_no: qualification.registration_no || apiItem.registration_no || 'N/A',
    applicant_name: apiItem.full_name || 'N/A',
    registration_type: qualification.registration_type_name || apiItem.registration_type_name || 'N/A',
    status: qualification.endorsement_decision || 'Pending', // Default to 'Pending' if not present
    payment_status: qualification.payment_status || apiItem.payment_status || 'N/A',
    endorsed_at: qualification.endorsed_at,
    endorsed_by: qualification.endorsed_by_name || 'N/A',
  };
};

// --- Component State ---
const reportData = ref([]);
const isLoading = ref(false);
const isLoadingExport = ref(false);
const error = ref(null);
const currentPage = ref(1);
const totalItems = ref(0);
const sortBy = ref('');
const sortOrder = ref('asc');

// Use more descriptive keys that match API query parameters
const initialFilters = {
  search: '',
  start_date: '',
  end_date: '',
  endorsement_decision: '',
  registration_type_name: '',
  payment_status: '',
};
const filters = reactive({ ...initialFilters });

// --- Computed Properties ---
const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE));
const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE);
const endIndex = computed(() => Math.min(startIndex.value + ITEMS_PER_PAGE, totalItems.value));
const today = computed(() => new Date().toISOString().split('T')[0]);

// --- Data Fetching ---
const fetchData = async (resetPage = false) => {
  if (resetPage) currentPage.value = 1;
  isLoading.value = true;
  error.value = null;

  try {
    // Build a clean params object, excluding empty values.
    const params = {
      page: currentPage.value,
      page_size: ITEMS_PER_PAGE,
      ordering: sortBy.value ? `${sortOrder.value === 'desc' ? '-' : ''}${sortBy.value}` : null,
      ...filters,
    };
    Object.keys(params).forEach((key) => {
      if (params[key] === '' || params[key] === null) delete params[key];
    });

    const response = await CONFIG.apiMethod(params);

    if (response?.data?.results) {
      reportData.value = response.data.results.map(transformData);
      totalItems.value = response.data.count || 0;
    } else {
      throw new Error('Received invalid data structure from API.');
    }
  } catch (err) {
    error.value = `Error fetching professionals data. Please check the console for more details and try again.`;
    toast.error('An API error occurred.');
    console.error('Error fetching professionals data:', err);
    reportData.value = [];
    totalItems.value = 0;
  } finally {
    isLoading.value = false;
  }
};

const debouncedFetchData = debounce(() => fetchData(true), 500);

// --- Event Handlers ---
const handleSearchUpdate = (newValue) => {
  filters.search = newValue;
};
watch(() => filters.search, debouncedFetchData);

const handleStatusUpdate = (newValue) => {
  filters.endorsement_decision = newValue;
};

const handleSort = (key) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    sortOrder.value = 'asc';
  }
  fetchData();
};

const resetFilters = () => {
  Object.assign(filters, initialFilters);
  // The watcher will automatically trigger fetchData
};

const prevPage = () => currentPage.value > 1 && fetchData();
const nextPage = () => currentPage.value < totalPages.value && fetchData();

// --- Export Logic ---
const fetchAllDataForExport = async () => {
  toast.info('Fetching all data for export, this may take a moment...', { autoClose: false });
  const allData = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const params = {
      page,
      page_size: 100, // Fetch in larger chunks for export
      ordering: sortBy.value ? `${sortOrder.value === 'desc' ? '-' : ''}${sortBy.value}` : null,
      ...filters,
    };
    Object.keys(params).forEach((key) => (params[key] == null || params[key] === '') && delete params[key]);

    try {
      const response = await CONFIG.apiMethod(params);
      if (response?.data?.results) {
        allData.push(...response.data.results);
        hasMore = !!response.data.next;
        page++;
        if (hasMore) await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay between requests
      } else {
        hasMore = false;
        throw new Error('API error during full data fetch for export.');
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Could not fetch all data for export.');
      console.error(err);
      return []; // Return empty array on failure
    }
  }
  toast.dismiss();
  return allData;
};

const exportToExcel = async () => {
  if (isLoadingExport.value) return;
  if (!totalItems.value) {
    toast.info('No data available to export.');
    return;
  }
  isLoadingExport.value = true;

  try {
    const rawData = await fetchAllDataForExport();
    if (!rawData.length) {
      toast.warning('No data found for the selected filters to export.');
      return;
    }

    const transformedForExport = rawData.map(transformData);
    const dataToExport = transformedForExport.map((item) => {
      const row = {};
      tableHeaders.forEach((header) => {
        const rawValue = item[header.key];
        row[header.label] = header.type === 'date' ? formatDate(rawValue, 'excel') : rawValue ?? 'N/A';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Professionals Report');

    worksheet['!cols'] = tableHeaders.map((header) => ({ wch: Math.max(header.label.length, 20) }));
    XLSX.writeFile(workbook, `professionals_report_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast.success('Excel Report exported successfully!');
  } catch (err) {
    console.error('Excel Export error:', err);
    toast.error('Failed to export Excel report.');
  } finally {
    isLoadingExport.value = false;
  }
};

// --- Formatting and Style Helpers ---
const formatDate = (date, format = 'display') => {
  if (!date) return '–';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '–';

  if (format === 'excel') {
    return d.toLocaleDateString('en-CA'); // YYYY-MM-DD format is good for Excel
  }
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const statusBadge = (status) => {
  const lowerStatus = String(status ?? '').toLowerCase().trim();
  let baseClasses = 'px-2 py-1 rounded-full text-xs font-medium inline-block capitalize';
  switch (lowerStatus) {
    case 'approved':
    case 'completed':
    case 'active':
    case 'paid':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'pending':
    case 'processing':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'regretted':
    case 'rejected':
    case 'cancelled':
    case 'failed':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'expired':
      return `${baseClasses} bg-purple-100 text-purple-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

// --- Watchers & Lifecycle ---
watch(
  () => [filters.endorsement_decision, filters.start_date, filters.end_date, filters.registration_type_name, filters.payment_status],
  () => {
    fetchData(true);
  },
  { deep: true }
);

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Scoped styles are the same as your original, they are well-written */
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