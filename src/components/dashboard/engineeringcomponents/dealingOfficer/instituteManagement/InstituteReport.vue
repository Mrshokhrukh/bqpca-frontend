<template>
  <div class="min-h-screen bg-slate-50 py-8">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-200">
          <h3 class="text-xl font-semibold text-slate-900">EOI/DPR Reports</h3>
          <p class="mt-2 text-sm text-slate-600">
            View and filter submitted Expressions of Interest and Detailed Project Proposals.
          </p>
        </div>

        <!-- Filters Section -->
        <div class="p-6 border-b border-slate-200 bg-slate-50">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Status Filter -->
            <div class="space-y-1.5">
              <label for="statusFilter" class="block text-sm font-medium text-slate-700"
                >Status</label
              >
              <select
                id="statusFilter"
                v-model="filters.status"
                :disabled="isLoading"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">All</option>
                <!-- These values MUST match the 'status' derived in the mapping below -->
                <option value="Submitted">Submitted</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <!-- Add other potential mapped statuses if needed -->
                <option value="Pending">Pending</option>
                <!-- If API 'Pending' isn't mapped to 'Submitted' -->
              </select>
            </div>

            <!-- Type Filter -->
            <div class="space-y-1.5">
              <label for="typeFilter" class="block text-sm font-medium text-slate-700">Type</label>
              <select
                id="typeFilter"
                v-model="filters.type"
                :disabled="isLoading"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">All</option>
                <!-- These values MUST match the 'type' derived in the mapping below -->
                <option value="EOI">EOI</option>
                <option value="DPR">DPR</option>
              </select>
            </div>

            <!-- Search Filter (by Institute Name) -->
            <div class="space-y-1.5">
              <label for="searchFilter" class="block text-sm font-medium text-slate-700"
                >Search by Name</label
              >
              <input
                type="text"
                id="searchFilter"
                v-model="filters.search"
                placeholder="Search by Institute Name"
                :disabled="isLoading"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <!-- Date From -->
            <div class="space-y-1.5">
              <label for="dateFrom" class="block text-sm font-medium text-slate-700"
                >Submitted From</label
              >
              <input
                type="date"
                id="dateFrom"
                v-model="filters.dateFrom"
                :disabled="isLoading"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <!-- Date To -->
            <div class="space-y-1.5">
              <label for="dateTo" class="block text-sm font-medium text-slate-700"
                >Submitted To</label
              >
              <input
                type="date"
                id="dateTo"
                v-model="filters.dateTo"
                :disabled="isLoading"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <!-- Region Filter (Dzongkhag) -->
            <div class="space-y-1.5">
              <label for="regionFilter" class="block text-sm font-medium text-slate-700"
                >Region (Dzongkhag)</label
              >
              <select
                id="regionFilter"
                v-model="filters.region"
                :disabled="isLoading"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">All</option>
                <!-- Add actual Dzongkhag names from your API data or a predefined list -->
                <option value="Molestiae rerum opti">Molestiae rerum opti</option>
                <!-- Example from your data -->
                <!-- <option value="Thimphu">Thimphu</option> -->
                <!-- <option value="Paro">Paro</option> -->
                <!-- <option value="Gelephu">Gelephu</option> -->
                <!-- Add other regions/dzongkhags dynamically or manually -->
              </select>
            </div>
          </div>
          <!-- Refresh Button -->
          <div class="mt-4 text-right">
            <button
              @click="fetchReports"
              :disabled="isLoading"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isLoading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
        </div>

        <!-- Table Section -->
        <div class="overflow-x-auto">
          <!-- Loading State -->
          <div v-if="isLoading && !reports.length" class="p-6 text-center text-slate-500">
            Loading reports...
          </div>

          <!-- Error State -->
          <div
            v-if="error"
            class="p-6 text-center text-red-600 bg-red-50 border border-red-200 rounded-md"
          >
            <p class="font-medium">Error loading data:</p>
            <p class="text-sm">{{ error }}</p>
            <p class="text-xs mt-2">Check the developer console (F12) for more details.</p>
          </div>

          <!-- No Data State -->
          <div
            v-if="!isLoading && !error && filteredReports.length === 0 && reports.length > 0"
            class="p-6 text-center text-slate-500"
          >
            No reports found matching your current filter criteria.
          </div>
          <div
            v-if="!isLoading && !error && reports.length === 0"
            class="p-6 text-center text-slate-500"
          >
            No reports available.
          </div>

          <!-- Table -->
          <table v-if="!error && reports.length > 0" class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Institute Name
                  <!-- Updated Header -->
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Date Submitted
                  <!-- Updated Header -->
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Region (Dzongkhag)
                  <!-- Updated Header -->
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-right">
                  <span class="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <!-- Displaying filteredReports -->
              <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-slate-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {{ report.name }}
                  <!-- Mapped from name_of_institution -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ report.type }}
                  <!-- Mapped based on DPR fields -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ formatDate(report.dateSubmitted) }}
                  <!-- Mapped from created_at -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ report.region }}
                  <!-- Mapped from dzongkhag -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <!-- Status badge logic uses the mapped 'status' -->
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      report.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : report.status === 'Reviewed'
                            ? 'bg-blue-100 text-blue-800'
                            : report.status === 'Submitted'
                              ? 'bg-yellow-100 text-yellow-800'
                              : report.status === 'Pending'
                                ? 'bg-gray-100 text-gray-800' // Style for 'Pending' if kept
                                : 'bg-gray-100 text-gray-800', // Default/fallback style
                    ]"
                  >
                    {{ report.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <!-- Pass the mapped report object to the modal -->
                  <button
                    @click="openReportModal(report)"
                    class="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pass the selectedReport (which contains mapped + potentially raw data) -->
    <ReportModal :isOpen="isReportModalOpen" :report="selectedReport" @close="closeReportModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ReportModal from './InstituteReportModal.vue'
import apiService from '@/services/services'

// --- State ---
const reports = ref([]) // Holds the original mapped data from API
const isLoading = ref(false)
const error = ref(null)

const filters = ref({
  status: '',
  type: '',
  search: '', // For Institute Name
  dateFrom: '', // For Submitted Date
  dateTo: '', // For Submitted Date
  region: '', // For Dzongkhag
})

const isReportModalOpen = ref(false)
const selectedReport = ref(null) // Holds the report object for the modal

// --- API Fetching ---
const fetchReports = async () => {
  isLoading.value = true
  error.value = null
  reports.value = [] // Clear previous results
  console.log('Fetching reports from API...')
  try {
    const response = await apiService.getEpcInstitutes()
    console.log('API Raw Response:', response)
    console.log('API Raw Response Data:', response.data)

    let institutesArray = []

    // Extract the array from response.data.results
    if (
      response &&
      response.data &&
      response.data.results &&
      Array.isArray(response.data.results)
    ) {
      institutesArray = response.data.results
      console.log('Data source: response.data.results')
    } else {
      console.warn("Could not find 'results' array in response.data.")
      error.value = "Received data is not in the expected format (missing 'results' array)."
    }

    console.log('Extracted Institutes Array:', institutesArray)

    if (Array.isArray(institutesArray)) {
      reports.value = institutesArray.map((item) => {
        // --- START MAPPING LOGIC based on provided JSON ---

        // 1. Determine Status: Prioritize DPR status, fallback to general review, default to Pending/Submitted
        let currentStatus = 'Submitted' // Default assumption for frontend
        // Check specific API fields. Modify these checks based on actual possible values from API.
        const apiDprStatus = item.do_dpr_review_decision // e.g., 'Pending', 'Approved', 'Rejected', 'Reviewed' ?
        const apiEoiStatus = item.review_decision // e.g., 'Regretted'

        // Check DPR status first if available and not 'Pending' (or adapt logic)
        if (apiDprStatus && apiDprStatus !== 'Pending') {
          if (apiDprStatus === 'Approved') currentStatus = 'Approved'
          else if (apiDprStatus === 'Rejected')
            currentStatus = 'Rejected' // Assuming API uses 'Rejected'
          else if (apiDprStatus === 'Reviewed')
            currentStatus = 'Reviewed' // Assuming API uses 'Reviewed'
          else currentStatus = apiDprStatus // Use API value directly if unexpected
        }
        // Fallback to EOI status if DPR status is Pending or missing
        else if (apiEoiStatus) {
          if (apiEoiStatus === 'Regretted') currentStatus = 'Rejected'
          // Add checks for other possible EOI statuses (Approved, Reviewed?) if applicable
          else if (apiEoiStatus === 'Approved') currentStatus = 'Approved'
          else currentStatus = apiEoiStatus // Use API value directly if unexpected
        }
        // If both are missing or Pending, it stays as 'Submitted' (initial default)
        else if (apiDprStatus === 'Pending') {
          currentStatus = 'Submitted' // Explicitly map API 'Pending' to FE 'Submitted'
        }

        // 2. Determine Type: Heuristic - If DPR fields exist, assume DPR, else EOI.
        // This might need refinement based on exact business logic or a dedicated API field.
        const reportType =
          item.dpr_name || item.do_dpr_report || item.institute_dpr_remarks ? 'DPR' : 'EOI'

        // 3. Map other fields directly
        const mappedReport = {
          id: item.id,
          name: item.name_of_institution || `Unnamed Institute ${item.id}`, // Primary Name Field
          type: reportType,
          dateSubmitted: item.created_at || null, // Submission Date Field
          status: currentStatus,
          region: item.dzongkhag || 'N/A', // Region Field
          // Include details or the whole item for the modal
          details: item.remarks || item.executive_summary || 'No additional details provided.',
          // OPTIONAL: Pass the original raw data if the modal needs fields not explicitly mapped here
          rawData: item,
        }
        // --- END MAPPING LOGIC ---
        return mappedReport
      })
      console.log('Mapped Reports:', reports.value)
    } else {
      console.error('institutesArray is not an array after extraction attempts.')
      if (!error.value) {
        error.value = 'Failed to process the received data.'
      }
      reports.value = []
    }
  } catch (err) {
    console.error('Error fetching reports:', err)
    let errorMessage = 'Failed to load reports. Please check the connection or try again later.'
    // ... (rest of error handling remains the same) ...
    if (err.response) {
      console.error('API Error Response Status:', err.response.status)
      console.error('API Error Response Data:', err.response.data)
      if (typeof err.response.data === 'string') {
        errorMessage = err.response.data
      } else if (err.response.data && typeof err.response.data.detail === 'string') {
        errorMessage = err.response.data.detail
      } else if (err.response.statusText) {
        errorMessage = `Error ${err.response.status}: ${err.response.statusText}`
      }
    } else if (err.request) {
      errorMessage = 'No response received from the server. It might be down or unreachable.'
      console.error('Error Request:', err.request)
    } else {
      errorMessage = err.message || 'An unexpected error occurred during the request setup.'
      console.error('Error Message:', err.message)
    }
    error.value = errorMessage
    reports.value = []
  } finally {
    isLoading.value = false
    console.log('Finished fetching reports. Loading:', isLoading.value)
  }
}

// --- Lifecycle Hook ---
onMounted(() => {
  fetchReports()
})

// --- Computed Properties ---
const filteredReports = computed(() => {
  // Use the 'reports' array which now contains the mapped data
  let filtered = reports.value || []

  // Apply filters based on the mapped fields
  if (filters.value.status) {
    filtered = filtered.filter((report) => report.status === filters.value.status)
  }
  if (filters.value.type) {
    filtered = filtered.filter((report) => report.type === filters.value.type)
  }
  if (filters.value.region) {
    // Ensure comparison uses the mapped region field (dzongkhag)
    filtered = filtered.filter((report) => report.region === filters.value.region)
  }
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    // Ensure search uses the mapped name field (name_of_institution)
    filtered = filtered.filter(
      (report) => report.name && report.name.toLowerCase().includes(searchTerm),
    )
  }

  // Date Filtering (uses mapped dateSubmitted field - created_at)
  const dateFrom = filters.value.dateFrom ? new Date(filters.value.dateFrom) : null
  const dateTo = filters.value.dateTo ? new Date(filters.value.dateTo) : null
  if (dateTo) {
    dateTo.setHours(23, 59, 59, 999) // Include full end date
  }

  if (dateFrom || dateTo) {
    filtered = filtered.filter((report) => {
      if (!report.dateSubmitted) return false
      try {
        const submittedDate = new Date(report.dateSubmitted)
        if (isNaN(submittedDate.getTime())) return false // Invalid date check
        const afterFrom = !dateFrom || submittedDate >= dateFrom
        const beforeTo = !dateTo || submittedDate <= dateTo
        return afterFrom && beforeTo
      } catch {
        return false
      }
    })
  }

  return filtered
})

// --- Methods ---
const openReportModal = (report) => {
  // The 'report' object passed here is the one from the filteredReports computed property,
  // which includes the mapped fields and potentially the rawData.
  selectedReport.value = report
  isReportModalOpen.value = true
  console.log('Opening modal for report:', report) // Log the data passed to modal
}

const closeReportModal = () => {
  isReportModalOpen.value = false
  selectedReport.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-GB', {
      // UK format DD/MM/YYYY
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return 'Invalid Date'
  }
}
</script>

<style scoped>
/* Basic styling for disabled inputs/selects */
select:disabled,
input:disabled {
  cursor: not-allowed;
  background-color: #f1f5f9;
  opacity: 0.7;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
