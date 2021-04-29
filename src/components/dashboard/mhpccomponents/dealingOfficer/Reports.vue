<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">MHPC Reports Dashboard</h1>
      <div class="flex gap-4">
        <!-- Changed Button -->
        <button @click="exportToCSV" class="btn-primary" :disabled="isLoading || !reportData.length">
          <span v-if="isLoading" class="mr-2">
            <i class="fas fa-spinner fa-spin"></i>
          </span>
          📄 Export CSV
        </button>
      </div>
    </div>

    <!-- Report Type Selector -->
    <div class="mb-6">
      <select v-model="activeReport" class="report-type-selector" @change="handleReportTypeChange">
        <option v-for="report in reportTypes" :key="report.value" :value="report.value">
          {{ report.label }}
        </option>
      </select>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      <!-- Global Search -->
      <div>
        <label class="filter-label">Global Search</label>
        <input
          v-model="filters.search"
          type="text"
          class="filter-input"
          placeholder="Search..."
          @input="debouncedFetchData"
        />
      </div>

      <!-- Date Range -->
      <div>
        <label class="filter-label">Date Range</label>
        <div class="flex gap-2">
          <input v-model="filters.startDate" type="date" class="filter-input" @change="fetchData" />
          <input v-model="filters.endDate" type="date" class="filter-input" @change="fetchData" />
        </div>
      </div>

      <!-- Status Filter -->
      <div>
        <label class="filter-label">Status</label>
        <select v-model="filters.status" class="filter-input" @change="fetchData">
          <option value="">All Statuses</option>
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !reportData.length" class="flex justify-center items-center py-8">  <!-- Show loader only if no data yet -->
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
      <button @click="fetchData" class="text-red-600 underline mt-2">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!reportData.length && !isLoading" class="bg-white rounded-lg shadow p-8 text-center"> <!-- Check isLoading too -->
      <p class="text-gray-500">No data available for the selected filters</p>
    </div>

    <!-- Report Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-x-auto relative">
      <!-- Loading overlay for table refresh -->
       <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
       </div>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="header in activeHeaders" :key="header.key" class="table-header">
              <div class="flex items-center">
                {{ header.label }}
                <template v-if="header.sortable">
                  <button @click="handleSort(header.key)" class="ml-1 focus:outline-none">
                    <i
                      :class="[
                        'fas',
                        sortBy === header.key
                          ? sortOrder === 'asc'
                            ? 'fa-sort-up'
                            : 'fa-sort-down'
                          : 'fa-sort',
                      ]"
                    ></i>
                  </button>
                </template>
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in reportData" :key="item.id || index"> <!-- Added index as fallback key -->
            <td v-for="header in activeHeaders" :key="header.key" class="table-cell">
              <!-- Use getNestedValue helper for all data access -->
              <template v-if="header.key === 'status' || header.key.endsWith('_status') || header.key === 'is_cpd_approved'">
                 <span :class="statusBadge(getNestedValue(item, header.key))">
                   {{ getNestedValue(item, header.key) }}
                 </span>
               </template>
              <template v-else-if="header.type === 'date'">
                {{ formatDate(getNestedValue(item, header.key)) }}
              </template>
              <template v-else-if="header.type === 'currency'">
                {{ formatCurrency(getNestedValue(item, header.key)) }}
              </template>
              <template v-else>
                {{ getNestedValue(item, header.key) }}
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
            Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }}
          </span>
          <span v-else>
            No results
          </span>
      </div>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="currentPage === 1 || isLoading" class="pagination-btn">
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages || isLoading || totalItems === 0"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import debounce from 'lodash/debounce'
import Papa from 'papaparse' // Import Papa Parse
import bmhcServices from '@/services/services'

const toast = useToast()

// Constants
const ITEMS_PER_PAGE = 10

const reportTypes = [
  { label: 'Registrations', value: 'registrations' },
  { label: 'Renewals', value: 'renewals' },
  { label: 'CPD Activities', value: 'cpd' },
  { label: 'CoGS Issuance', value: 'cogs' },
]

// Headers remain the same
const headers = {
  registrations: [
    { key: 'registration_no', label: 'Reg Number', sortable: true },
    { key: 'applicant_name', label: 'Applicant Name', sortable: true }, // Transformed field
    { key: 'registration_type', label: 'Type', sortable: true },
    { key: 'registration_date', label: 'Reg Date', type: 'date', sortable: true },
    { key: 'expiry_date', label: 'Expiry Date', type: 'date', sortable: true },
    { key: 'application_review_status', label: 'Status', sortable: true },
    { key: 'payment_status', label: 'Payment Status', sortable: true }, // Transformed field
  ],
  renewals: [
    { key: 'renewal_id', label: 'Renewal ID', sortable: true }, // Transformed field
    { key: 'user_qualification.registration_no', label: 'Reg Number', sortable: true }, // Nested field
    { key: 'applicant_name', label: 'Applicant Name', sortable: true }, // Transformed field
    { key: 'renewal_review_status', label: 'Status', sortable: true },
    { key: 'new_expiry_date', label: 'New Expiry Date', type: 'date', sortable: true },
    { key: 'created_at', label: 'Renewal Date', type: 'date', sortable: true },
  ],
  cpd: [
    // Assuming the actual API returns 'id' for CPD activities for a unique key
    { key: 'id', label: 'CPD ID', sortable: true },
    { key: 'applicant_name', label: 'Applicant Name', sortable: true }, // Transformed field
    { key: 'title_of_cpd', label: 'Activity Name', sortable: true },
    { key: 'cpd_credit', label: 'Credits', sortable: true }, // Adjusted key based on previous example
    // { key: 'number_of_participants', label: 'Participants', sortable: true }, // Potentially available
    { key: 'start_date', label: 'Start Date', type: 'date', sortable: true }, // Transformed field
    { key: 'end_date', label: 'End Date', type: 'date', sortable: true }, // Transformed field
    { key: 'review_status', label: 'Status', sortable: true }, // Transformed field
  ],
  cogs: [
    { key: 'cogs_number', label: 'CoGS Number', sortable: true }, // Transformed field
    { key: 'full_name', label: 'Applicant Name', sortable: true },
    { key: 'cogs_approved_date', label: 'Issuance Date', type: 'date', sortable: true },
    { key: 'review_status', label: 'Status', sortable: true },
  ],
}

// Reactive State
const activeReport = ref('registrations')
const reportData = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalItems = ref(0)
const sortBy = ref('')
const sortOrder = ref('asc') // Default to ascending

const filters = reactive({
  search: '',
  startDate: '',
  endDate: '',
  status: '',
})

// Computed Properties
const activeHeaders = computed(() => headers[activeReport.value] || []) // Ensure fallback
const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE))
const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE)
// Correct endIndex calculation
const endIndex = computed(() => Math.min(startIndex.value + ITEMS_PER_PAGE, totalItems.value > 0 ? totalItems.value : 0))


// Helper to safely access nested properties
const getNestedValue = (obj, path) => {
  if (!path) return obj // Handle cases where path might be undefined
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}


// API mapping object for different report types
// IMPORTANT: Adjust fetch methods and transformations based on your actual service API structure
const apiMethods = {
  registrations: {
    fetch: bmhcServices.getMhpcNewQualifications, // Assuming this fetches registration-like data
    transform: (item) => ({
      ...item,
      id: item.id || item.registration_no, // Ensure a unique ID
      applicant_name: item.application?.full_name || item.full_name || 'N/A', // Handle potential variations
      payment_status: item.is_payment_complete ? 'Paid' : 'Unpaid',
    }),
    statusField: 'application_review_status', // Field to use for status filter/display
  },
  renewals: {
    fetch: bmhcServices.getMhpcRenewals,
    transform: (item) => ({
      ...item,
      id: item.id || `renewal-${item.user_qualification?.registration_no}`, // Ensure unique ID
      renewal_id: `REN-${item.id}`,
      applicant_name: item.user_qualification?.user?.full_name || 'N/A', // Example nested path
      'user_qualification.registration_no': item.user_qualification?.registration_no, // Explicitly map nested for getNestedValue
    }),
    statusField: 'renewal_review_status',
  },
  cpd: {
    // Assuming a specific endpoint exists for CPD reports
    fetch: bmhcServices.getEpcCpdRecords, // Using the one from the first example
    transform: (item) => ({
      ...item,
      id: item.id, // Ensure unique ID
      applicant_name: item.full_name || 'N/A',
      start_date: item.from_date, // Map API field to header key
      end_date: item.to_date, // Map API field to header key
      // Keep 'review_status' as the standard status field
    }),
     statusField: 'review_status', // Use the standard field from the API
  },
  cogs: {
    fetch: bmhcServices.getMhpcCogs,
    transform: (item) => ({
      ...item,
       id: item.id || item.registration_no, // Ensure unique ID
      cogs_number: `COGS-${item.registration_no}`,
    }),
     statusField: 'review_status',
  },
}

// Methods
const fetchData = async (resetPage = false) => {
  if (resetPage) {
     currentPage.value = 1;
  }
  isLoading.value = true
  error.value = null
  const reportConfig = apiMethods[activeReport.value]

  if (!reportConfig || typeof reportConfig.fetch !== 'function') {
      error.value = `Configuration error: API fetch method for report type "${activeReport.value}" is not defined.`;
      toast.error(error.value);
      isLoading.value = false;
      reportData.value = [];
      totalItems.value = 0;
      return;
  }


  try {
    // Use the specific status field defined in apiMethods
    const statusFilterKey = reportConfig.statusField || 'status';

    const params = {
      page: currentPage.value,
      page_size: ITEMS_PER_PAGE,
      ordering: sortBy.value ? `${sortOrder.value === 'desc' ? '-' : ''}${sortBy.value}` : '',
      search: filters.search,
      ...(filters.status && { [statusFilterKey]: filters.status }), // Apply status filter correctly
      ...(filters.startDate && { start_date: filters.startDate }), // Assuming API accepts these query param names
      ...(filters.endDate && { end_date: filters.endDate }),
    }

    // Remove empty params
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });


    const response = await reportConfig.fetch(params)

    if (response && response.data && Array.isArray(response.data.results)) {
        reportData.value = response.data.results.map((item) =>
            reportConfig.transform ? reportConfig.transform(item) : item // Apply transform if defined
        );
        totalItems.value = response.data.count !== undefined ? response.data.count : 0; // Handle potential missing count
         // Reset page if current page becomes invalid after filtering/fetching
        if (currentPage.value > totalPages.value && totalPages.value > 0) {
            currentPage.value = totalPages.value;
            // Optionally re-fetch data for the last page, but usually not needed if count is correct
        } else if (totalItems.value === 0) {
             currentPage.value = 1; // Reset to page 1 if no items
        }

    } else {
        console.error("Invalid API response structure:", response);
        throw new Error("Received invalid data structure from API.");
    }


  } catch (err) {
    error.value = 'Error fetching data. Please check console for details.'
    toast.error(error.value)
    console.error(`Error fetching ${activeReport.value} data:`, err)
    reportData.value = [] // Clear data on error
    totalItems.value = 0 // Reset count on error
  } finally {
    isLoading.value = false
  }
}

// Debounced search - fetches data after 500ms of inactivity
const debouncedFetchData = debounce(() => fetchData(true), 500) // Pass true to reset page on search

// Event Handlers
const handleSort = (key) => {
  if (!activeHeaders.value.find(h => h.key === key)?.sortable) return; // Check if sortable

  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'asc'
  }
  fetchData() // Don't reset page when sorting
}

const handleReportTypeChange = () => {
  // Reset filters, sorting, and pagination when report type changes
  currentPage.value = 1
  sortBy.value = ''
  sortOrder.value = 'asc'
  filters.search = ''
  filters.status = ''
  filters.startDate = ''
  filters.endDate = ''
  error.value = null // Clear previous errors
  fetchData()
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchData()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchData()
  }
}

// --- NEW CSV Export Function ---
const exportToCSV = async () => {
  if (isLoading.value) return; // Prevent multiple exports
  if (reportData.value.length === 0) {
      toast.info('No data available to export.');
      return;
  }
  isLoading.value = true; // Indicate export process started
  toast.info('Preparing export...', { timeout: 1500 });

  try {
    // 1. Fetch all data for the current filters
    const allData = await fetchAllData();

    if (!allData || allData.length === 0) {
        toast.warning('No data found for the selected filters to export.');
        isLoading.value = false;
        return;
    }

    // 2. Prepare data for Papa Parse (Map to use header labels as keys)
    const dataToExport = allData.map(item => {
      const row = {};
      activeHeaders.value.forEach(header => {
        const rawValue = getNestedValue(item, header.key);
        let formattedValue = rawValue;

        // Apply formatting consistent with the table display
        if (header.type === 'date') {
          formattedValue = formatDate(rawValue);
        } else if (header.type === 'currency') {
          formattedValue = formatCurrency(rawValue); // Assumes you have formatCurrency
        } else if (header.key === 'status' || header.key.endsWith('_status') || header.key === 'is_cpd_approved') {
           // Use the raw status string directly, badge is only for display
           formattedValue = rawValue;
        }

        // Ensure value is a string or number for CSV
        row[header.label] = (formattedValue === null || formattedValue === undefined) ? '' : String(formattedValue);
      });
      return row;
    });

    // 3. Use Papa Parse to convert JSON to CSV string
    const csv = Papa.unparse(dataToExport);

    // 4. Create a Blob and trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const filename = `${activeReport.value}_report_${formatDate(new Date(), true)}.csv`; // Use date in filename

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up

    toast.success('Report exported successfully!');

  } catch (err) {
    console.error('Export error:', err);
    toast.error('Failed to export report. Check console for details.');
     error.value = 'Export failed.'; // Optionally update UI error state
  } finally {
    isLoading.value = false; // Export process finished
  }
}


// Utility Functions (fetchAllData remains similar, ensure it uses the correct fetch method)
const fetchAllData = async () => {
  toast.info('Fetching all data for export, this may take a moment...', { autoClose: 3000 });
  const allData = []
  let page = 1
  let hasMore = true
  const reportConfig = apiMethods[activeReport.value];

  if (!reportConfig || typeof reportConfig.fetch !== 'function') {
      console.error(`Configuration error: API fetch method for report type "${activeReport.value}" is not defined.`);
      throw new Error('Export configuration error.');
  }

  const statusFilterKey = reportConfig.statusField || 'status';

  while (hasMore) {
    const params = {
      page,
      page_size: 100, // Fetch in larger chunks for export efficiency
      ordering: sortBy.value ? `${sortOrder.value === 'desc' ? '-' : ''}${sortBy.value}` : '',
      search: filters.search,
       ...(filters.status && { [statusFilterKey]: filters.status }),
      ...(filters.startDate && { start_date: filters.startDate }),
      ...(filters.endDate && { end_date: filters.endDate }),
    }
     // Remove empty params
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });


    try {
      const response = await reportConfig.fetch(params)
       if (response && response.data && Array.isArray(response.data.results)) {
            const transformedData = response.data.results.map((item) =>
                reportConfig.transform ? reportConfig.transform(item) : item
            );
            allData.push(...transformedData);

            // Check if there's a next page URL or if the number of items fetched is less than page_size
             hasMore = response.data.next !== null && response.data.next !== undefined;
             if (!hasMore && response.data.results.length === params.page_size && response.data.count > allData.length) {
                 // Optional: Add a safeguard if 'next' is null but count suggests more pages
                 // This depends on API consistency. Might indicate an API issue.
                 console.warn("API indicates no next page, but fetched count might be incomplete.");
             }

            page++;
            // Add a small delay to avoid overwhelming the server if fetching many pages
             if (hasMore) await new Promise(resolve => setTimeout(resolve, 50));

        } else {
             console.error("Invalid API response structure during 'fetchAllData':", response);
             hasMore = false; // Stop fetching on invalid structure
             throw new Error("Received invalid data structure from API during export fetch.");
        }

    } catch (err) {
      console.error(`Error fetching page ${page} for export:`, err);
      throw err // Propagate error to the export function
    }
  }

  return allData
}

// Updated formatDate to handle filename format and invalid dates
const formatDate = (date, forFilename = false) => {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-'; // Check for invalid date

  if (forFilename) {
      // Format suitable for filenames (YYYY-MM-DD)
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
  } else {
      // Format for display (DD/MM/YYYY)
      return d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
      });
  }
};

// Currency formatting utility
const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  // You can adjust the locale and currency as needed
  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};


// Status Badge Logic - simplified and made more robust
const statusBadge = (status) => {
  const lowerStatus = String(status).toLowerCase(); // Handle case variations and potential non-string values
  let baseClasses = 'px-2 py-1 rounded-full text-xs font-medium inline-block'; // Use inline-block

  if (lowerStatus.includes('approve') || lowerStatus === 'paid' || lowerStatus === 'active') {
    return `${baseClasses} bg-green-100 text-green-800`;
  } else if (lowerStatus.includes('pending') || lowerStatus === 'unpaid') {
    return `${baseClasses} bg-yellow-100 text-yellow-800`;
  } else if (lowerStatus.includes('reject') || lowerStatus.includes('cancel')) {
    return `${baseClasses} bg-red-100 text-red-800`;
  } else if (lowerStatus.includes('expire')) {
     return `${baseClasses} bg-purple-100 text-purple-800`; // Example for expired
  } else {
    // Default/fallback style
    return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};


// Status options - ensure consistency with API values and transformations
const statusOptions = computed(() => {
    // These should reflect the possible *string values* that appear in the
    // `statusField` of the transformed data for the active report type.
    const optionsMap = {
        registrations: ['Pending', 'Approved', 'Rejected'], // Based on application_review_status
        renewals: ['Pending', 'Approved', 'Rejected'], // Based on renewal_review_status
        cpd: ['Pending', 'Approved', 'Rejected'], // Based on review_status
        cogs: ['Pending', 'Approved', 'Rejected', 'Expired'], // Based on review_status
    };
    return optionsMap[activeReport.value] || [];
});


// Watchers
watch(filters, () => {
    // Use debounced fetch only for search input
    // For date/status dropdown changes, fetch immediately but reset page
    if (filters.search !== '') {
        // Debounce is handled by @input on the search field
    } else {
        // fetchData(true); // Trigger immediate fetch for date/status changes if search is empty
        // Or let the @change handlers on date/status inputs trigger fetchData(true)
    }
}, { deep: true }); // Watch nested properties

// Watch report type change separately
watch(activeReport, () => {
    handleReportTypeChange(); // Resets filters and fetches
});


// Initial data fetch on mount
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Styles from the original component */
.filter-label {
  display: block;
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  color: #374151; /* gray-700 */
  margin-bottom: 0.25rem; /* 4px */
}

.filter-input,
.report-type-selector {
  display: block; /* Ensure select takes full width */
  width: 100%;
  padding: 0.5rem 0.75rem; /* Adjusted padding */
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  background-color: #ffffff; /* white */
  font-size: 0.875rem; /* 14px */
}

.filter-input:focus,
.report-type-selector:focus {
  outline: none;
  border-color: #3b82f6; /* blue-500 */
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); /* ring-blue-500 */
}

.table-header {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  color: #6b7280; /* gray-500 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #f9fafb; /* gray-50 */
}

.table-cell {
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem; /* 14px */
  color: #1f2937; /* gray-800 */
}

/* Basic button styles for primary action (CSV Export) */
.btn-primary {
  display: inline-flex; /* Use inline-flex for icon alignment */
  align-items: center;
  background-color: #3b82f6; /* blue-500 */
  color: white;
  padding: 0.5rem 1rem; /* 8px 16px */
  border-radius: 0.375rem; /* rounded-md */
  font-weight: 500;
  font-size: 0.875rem; /* 14px */
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb; /* blue-600 */
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4); /* ring */
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


/* Pagination button styles */
.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  background-color: white;
  font-size: 0.875rem; /* 14px */
  color: #374151; /* gray-700 */
  transition: background-color 0.2s;
  cursor: pointer;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f9fafb; /* gray-50 */
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Ensure Font Awesome icons are displayed correctly */
[class*='fa-'] {
  display: inline-block;
  line-height: 1;
}
</style>
