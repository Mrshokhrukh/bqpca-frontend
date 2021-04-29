<template>
  <div class="p-6 bg-gray-50 min-h-screen"> <!-- Added bg-gray-50 and min-h-screen -->
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">All ROQ Applications</h1>
      <div class="flex space-x-4">
        <!-- Changed Button -->
        <button
          @click="exportToCSV"
          :disabled="loading || applications.length === 0"
          class="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="pi pi-file-csv mr-2"></i> <!-- Changed icon -->
          Export CSV
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"> <!-- Responsive grid -->
      <div class="bg-white p-6 rounded-lg shadow"> <!-- Added shadow -->
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-500">Pending Applications</span>
          <Clock class="w-5 h-5 text-gray-400" />
        </div>
        <div class="text-3xl font-semibold text-gray-900">{{ stats.pending }}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-500">Processing Applications</span>
          <Hourglass class="w-5 h-5 text-gray-400" />
        </div>
        <div class="text-3xl font-semibold text-gray-900">{{ stats.processing }}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-500">Approved</span>
          <CheckCircle class="w-5 h-5 text-green-500" /> <!-- Colored icon -->
        </div>
        <div class="text-3xl font-semibold text-green-600">{{ stats.approved }}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-500">Regretted</span>
          <XCircle class="w-5 h-5 text-red-500" /> <!-- Colored icon -->
        </div>
        <div class="text-3xl font-semibold text-red-600">{{ stats.regretted }}</div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="pi pi-search text-gray-400"></i>
        </span>
        <input
          type="text"
          v-model="searchQuery"
          @input="debouncedFetchApplications"
          class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          placeholder="Search by Name, CID, Endorsement No..."
        />
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden"> <!-- Added overflow-hidden -->
      <div class="overflow-x-auto"> <!-- Wrapper for horizontal scroll -->
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr class="border-b border-gray-200">
              <th
                v-for="header in TABLE_HEADERS"
                :key="header.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                 @click="header.sortable !== false ? sortBy(header.key) : null" :class="{ 'hover:bg-gray-100': header.sortable !== false }"
              >
                {{ header.label }}
                <i
                  v-if="sortKey === header.key && header.sortable !== false"
                  :class="['pi', sortOrder === 'asc' ? 'pi-sort-up' : 'pi-sort-down', 'ml-1']"
                ></i>
                 <i
                   v-else-if="header.sortable !== false"
                   class="pi pi-sort-alt ml-1 text-gray-400"
                 ></i>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
             <tr v-if="loading && applications.length === 0"> <!-- Initial Loading state -->
               <td :colspan="TABLE_HEADERS.length" class="text-center py-10 text-gray-500">
                 <i class="pi pi-spin pi-spinner text-2xl"></i> Loading applications...
               </td>
             </tr>
             <tr v-else-if="!loading && applications.length === 0"> <!-- No data state -->
               <td :colspan="TABLE_HEADERS.length" class="text-center py-10 text-gray-500">
                 No applications found matching your criteria.
               </td>
             </tr>
            <tr v-else v-for="app in paginatedData" :key="app.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{{ app.id }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{{ app.applicants_name }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{{ app.cid_no || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{{ app.qec_number || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" :title="app.course_title">{{ app.course_title || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{{ getModeOfDelivery(app) }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" :title="app.name_of_institute">{{ app.name_of_institute || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" :title="app.name_of_university">{{ app.name_of_university || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{{ app.country || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{{ hasCompleteDocuments(app) ? 'Yes' : 'No' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(app.status)">
                    {{ formatStatus(app.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{{ getEndorsementInfo(app) }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" :title="app.dealing_officer_remarks || app.chief_remarks">{{ app.dealing_officer_remarks || app.chief_remarks || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" :title="app.remarks">{{ app.remarks || '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ formatDate(app.created_at) }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ calculateProcessingDays(app) }} days</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 bg-white"> <!-- Ensure bg is white -->
        <div class="flex items-center justify-between flex-wrap gap-y-2">
          <div class="text-sm text-gray-600">
             <span v-if="totalItems > 0">
              Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }} entries
            </span>
            <span v-else>
              No entries
            </span>
          </div>
          <div class="flex items-center space-x-2 sm:space-x-4">
            <select
              v-model="itemsPerPage"
              class="px-3 py-1.5 rounded-md text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              @change="handlePerPageChange"
            >
              <option :value="10">10 / page</option>
              <option :value="25">25 / page</option>
              <option :value="50">50 / page</option>
              <option :value="100">100 / page</option>
            </select>
            <button
              @click="previousPage"
              :disabled="currentPage === 1 || loading"
              class="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              Previous
            </button>
            <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages || loading || totalItems === 0"
              class="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading indicator overlay (only when fetching data) -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center z-50"
    >
      <i class="pi pi-spin pi-spinner text-white text-4xl"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { Clock, CheckCircle, XCircle, Hourglass } from 'lucide-vue-next'
import { format, isValid, parseISO, differenceInCalendarDays } from 'date-fns'
import Papa from 'papaparse' // Import Papa Parse
import debounce from 'lodash/debounce'
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'

const toast = useToast()
const authStore = useAuthStore() // Use the store instance

// Constants
const TABLE_HEADERS = [
  { key: 'id', label: 'App ID', sortable: true },
  { key: 'applicants_name', label: 'Name', sortable: true },
  { key: 'cid_no', label: 'CID', sortable: true },
  { key: 'qec_number', label: 'Endorsement No', sortable: true },
  { key: 'course_title', label: 'Qualification', sortable: true },
  { key: 'mode_of_delivery', label: 'Mode', sortable: false }, // Virtual column
  { key: 'name_of_institute', label: 'Institute', sortable: true },
  { key: 'name_of_university', label: 'University', sortable: true },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'documents', label: 'Docs OK?', sortable: false }, // Virtual column
  { key: 'status', label: 'Status', sortable: true },
  { key: 'endorsement', label: 'Endorsed?', sortable: false }, // Virtual column
  { key: 'notes', label: 'Officer Note', sortable: false }, // Virtual column
  { key: 'remarks', label: 'Remarks', sortable: true },
  { key: 'created_at', label: 'Submitted', sortable: true },
  { key: 'processing_time', label: 'Proc. Time', sortable: false }, // Virtual column
]

const STATUS_CLASSES = {
  draft: 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700',
  applied: 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700',
  processing:'px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700',
  processing_payment:'px-2.5 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700', // Assuming orange for payment step
  under_review:'px-2.5 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700',
  approved: 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700',
  regretted: 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700',
  reprocess: 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700', // Or another color
  reupload: 'px-2.5 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700', // Example
}

// State
const applications = ref([])
const allFetchedApplications = ref([]) // Store all data for export
const searchQuery = ref('')
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortKey = ref('created_at') // Default sort
const sortOrder = ref('desc')     // Default sort order
const totalItems = ref(0)
const error = ref(null)

// Computed Properties
const stats = computed(() => {
  // Calculate stats based on ALL fetched data if available, otherwise current page
  const dataSet = allFetchedApplications.value.length > 0 ? allFetchedApplications.value : applications.value;
  const apps = dataSet || []
  return {
    pending: apps.filter(
      (app) => app?.status === 'applied' || app?.status === 'processing_payment',
    ).length,
    processing: apps.filter(
      (app) => app?.status === 'processing' || app?.status === 'under_review' || app?.status === 'reprocess' || app?.status === 'reupload',
    ).length,
    approved: apps.filter((app) => app?.status === 'approved').length,
    regretted: apps.filter((app) => app?.status === 'regretted').length,
  }
})

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value))

// paginatedData now relies purely on the API response for the current page
const paginatedData = computed(() => applications.value);

// Methods
const fetchApplications = async (fetchAll = false) => {
  if (!authStore.userId && !fetchAll) { // Don't fetch if userId isn't ready unless fetching all
      console.warn("User ID not available yet, delaying fetch.");
      // Optionally set loading to false or handle this state
      return;
    }

  try {
    error.value = null
    loading.value = true
    allFetchedApplications.value = []; // Clear previous full data if fetching paginated

    const params = {
      page: fetchAll ? 1 : currentPage.value,
      page_size: fetchAll ? 1000 : itemsPerPage.value, // Fetch large amount if fetchAll
      search: searchQuery.value || undefined,
      ordering: sortKey.value ? (sortOrder.value === 'asc' ? sortKey.value : `-${sortKey.value}`) : undefined,
      user_id: authStore.userId, // Make sure userId is accessed correctly
    }

    // Remove undefined params
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

    const response = await apiService.getRecognitionOfQualifications(params)

    if (response?.data) {
        if (fetchAll) {
           // If fetching all, potentially handle pagination if API limit is hit
           // For simplicity now, assume 1000 limit is enough or handle multiple fetches later
           allFetchedApplications.value = response.data.results || [];
           // We might need to update totalItems if API provides it differently for large fetches
           totalItems.value = response.data.count || allFetchedApplications.value.length;
        } else {
            applications.value = response.data.results || [];
            totalItems.value = response.data.count || 0;
             // Reset page if current page becomes invalid
            if (currentPage.value > totalPages.value && totalPages.value > 0) {
                currentPage.value = totalPages.value;
                // Optionally re-fetch, but usually totalPages logic handles display
            } else if (totalItems.value === 0) {
                currentPage.value = 1; // Reset to page 1 if no items
            }
        }

    } else {
      throw new Error('Invalid response format')
    }
  } catch (err) {
    console.error('Error fetching applications:', err)
    const errorMessage = err.response?.data?.detail || err.response?.data?.message || 'Failed to load applications.';
    error.value = errorMessage;
    toast.error(errorMessage);
    applications.value = []
    allFetchedApplications.value = [];
    totalItems.value = 0
  } finally {
    loading.value = false
  }
}

// Debounced fetch for search input
const debouncedFetchApplications = debounce(() => {
    currentPage.value = 1; // Reset page on search
    fetchApplications();
}, 500); // 500ms delay


const sortBy = (key) => {
  const header = TABLE_HEADERS.find(h => h.key === key);
  if (!header || header.sortable === false) {
      return; // Do nothing if column is not sortable
  }

  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  // Always fetch from API when sorting changes
  currentPage.value = 1; // Reset to first page when sorting
  fetchApplications()
}

const formatDate = (dateString, forFilename = false) => {
  try {
    if (!dateString) return '-';
    let date = parseISO(dateString); // Use parseISO for standard ISO strings
    if (!isValid(date)) {
        // Fallback for potentially non-ISO formats (use with caution)
        date = new Date(dateString);
        if (!isValid(date)) {
            return '-';
        }
    }
    if (forFilename) {
        return format(date, 'yyyy-MM-dd');
    }
    return format(date, 'dd MMM yyyy'); // Changed format slightly
  } catch (err) {
    console.error('Error formatting date:', dateString, err); // Log error with input
    return '-';
  }
};


const calculateProcessingDays = (application) => {
  try {
    if (!application?.created_at) return 0;
    const submissionDate = parseISO(application.created_at);
    if (!isValid(submissionDate)) return 0;

    // Use completion_date if available and valid, otherwise today
    let endDate = new Date(); // Default to today
    if (application.completion_date) {
        const parsedCompletionDate = parseISO(application.completion_date);
        if (isValid(parsedCompletionDate)) {
            endDate = parsedCompletionDate;
        }
    }

    // Calculate difference in calendar days
    return differenceInCalendarDays(endDate, submissionDate);

  } catch (err) {
    console.error('Error calculating processing days:', application?.id, err);
    return 0;
  }
};


const getStatusClass = (status) => {
  const lowerStatus = status?.toLowerCase() || 'draft'; // Default to draft if null/undefined
  return STATUS_CLASSES[lowerStatus] || STATUS_CLASSES.draft; // Fallback to draft class
}

const formatStatus = (status) => {
  if (!status) return 'Draft' // Handle null/undefined
  return status
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
}

// Helper methods for virtual columns (remain the same)
const getModeOfDelivery = (app) => {
  // Ensure boolean check is correct
  return app?.from_in_country === true ? 'In-Country' : 'International';
}

const hasCompleteDocuments = (app) => {
    if (!app) return false;
    // Define required docs based on the type
    const baseDocs = [app.degree_certificate, app.academic_transcript, app.passport_size_photo];
    const requiredCount = app.is_second_copy ? baseDocs.length + 1 : baseDocs.length;
    const availableDocs = baseDocs.filter(Boolean); // Filter out null/undefined/empty strings

    if (app.is_second_copy) {
        if (app.second_copy_supporting_document) {
            availableDocs.push(app.second_copy_supporting_document);
        }
    }
    return availableDocs.length >= requiredCount;
};


const getEndorsementInfo = (app) => {
    if (!app) return 'Pending';
    // Check chief decision first if it exists
    if (app.chief_decision === 'approved') return 'Endorsed (Chief)';
    if (app.chief_decision === 'regretted') return 'Rejected (Chief)';
    // Then check dealing officer
    if (app.dealing_officer_decision === 'approved') return 'Endorsed (Officer)';
    if (app.dealing_officer_decision === 'regretted') return 'Rejected (Officer)';
    // Check if forwarded
    if (app.forward) return 'Forwarded'; // Assuming 'forward' is a boolean or timestamp
    return 'Pending';
};


// --- NEW CSV Export Function ---
const exportToCSV = async () => {
    if (loading.value) return;
    loading.value = true;
    toast.info("Preparing CSV export...", { timeout: 2000 });

    try {
        // Option 1: Fetch all data matching current filters (potentially slow for large datasets)
         await fetchApplications(true); // Fetch all data into allFetchedApplications
         const dataToExport = allFetchedApplications.value;

        // Option 2: Export only the currently visible data (faster, but less complete)
        // const dataToExport = applications.value;

        if (!dataToExport || dataToExport.length === 0) {
            toast.warning("No data available to export for the current filters.");
            loading.value = false;
            return;
        }

        // Prepare data using the *same* helpers as the table display
        const csvData = dataToExport.map(app => ({
            'Application ID': app.id,
            'Name': app.applicants_name,
            'CID': app.cid_no || '',
            'Endorsement No': app.qec_number || '',
            'Name of Qualification': app.course_title || '',
            'Mode of Delivery': getModeOfDelivery(app),
            'Institute/College': app.name_of_institute || '',
            'University': app.name_of_university || '',
            'Country': app.country || '',
            'Complete Documents': hasCompleteDocuments(app) ? 'Yes' : 'No',
            'Status': formatStatus(app.status),
            'Endorsement': getEndorsementInfo(app), // Use the correct helper
            'Officer/Chief Note': app.dealing_officer_remarks || app.chief_remarks || '', // Combine notes
            'Remarks': app.remarks || '',
            'Submission Date': formatDate(app.created_at), // Use consistent format
            'Processing Time (days)': calculateProcessingDays(app),
            // Add any other relevant fields from the API if needed
            'Dealing Officer Decision': app.dealing_officer_decision || '',
            'Chief Decision': app.chief_decision || '',
            'Completion Date': formatDate(app.completion_date) || '',
        }));

        // Define headers explicitly based on the keys of the mapped object
        const headers = Object.keys(csvData[0]);

        // Use Papa Parse to convert JSON to CSV string
        const csv = Papa.unparse(csvData, {
            header: true, // Use the keys from the objects as headers
            columns: headers // Ensure column order
        });

        // Create a Blob and trigger download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const filename = `roq_applications_${formatDate(new Date(), true)}.csv`;

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('CSV file exported successfully!');

    } catch (err) {
        console.error('Error generating CSV:', err);
        toast.error('Failed to generate CSV file. Please try again.');
        error.value = 'CSV Export failed.';
    } finally {
        loading.value = false;
         // Optionally refetch paginated data if fetchAll was used and modified the main list
         // await fetchApplications();
    }
};

// Remove old export functions
// const exportToExcel = () => { ... } // REMOVE
// const downloadReport = async () => { ... } // REMOVE
// const hexToRgb = (hex) => { ... } // REMOVE (if only used by PDF)


// Pagination handlers
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchApplications()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchApplications()
  }
}

const handlePerPageChange = () => {
  currentPage.value = 1 // Reset to page 1 when changing items per page
  fetchApplications()
}

// Watchers
// Watch search query is handled by debounced function on input event

// Watch for userId becoming available if needed (using store directly now)
watch(() => authStore.userId, (newUserId) => {
    if (newUserId && applications.value.length === 0 && !loading.value) {
        console.log("User ID available, fetching initial applications.");
        fetchApplications();
    }
});


// Lifecycle hooks
onMounted(() => {
    // Check if userId is already available on mount
    if (authStore.userId) {
        fetchApplications();
    } else {
         console.log("Waiting for user ID before initial fetch...");
         // The watcher will trigger fetchApplications once userId is set
    }
})
</script>

<style scoped>
/* Use PrimeFlex icons or your chosen icon library */
.pi {
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  vertical-align: middle; /* Align icons nicely */
}

/* Add styles for specific icons if not using a library */
.pi-file-csv::before { content: "📄"; margin-right: 0.5em; } /* Example simple icon */
.pi-search::before { content: "🔍"; }
.pi-sort-up::before { content: "▲"; font-size: 0.8em; }
.pi-sort-down::before { content: "▼"; font-size: 0.8em; }
.pi-sort-alt::before { content: "↕"; font-size: 0.8em; }
.pi-spin::before { content: "⏳"; } /* Simple spinner */
.pi-spinner::before {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: pi-spin 1s linear infinite;
}


@keyframes pi-spin {
  to { transform: rotate(360deg); }
}

/* Improve table cell spacing and alignment */
td, th {
    vertical-align: middle;
}

/* Ensure stats cards look good on smaller screens */
@media (max-width: 640px) {
    .grid-cols-4 {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }
}
@media (min-width: 640px) and (max-width: 1024px) {
     .grid-cols-4 {
         grid-template-columns: repeat(2, minmax(0, 1fr));
     }
}

/* Style disabled buttons */
button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Tailwind focus rings for accessibility */
input:focus, select:focus, button:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px theme('colors.white'), 0 0 0 4px theme('colors.blue.500');
}
</style>
