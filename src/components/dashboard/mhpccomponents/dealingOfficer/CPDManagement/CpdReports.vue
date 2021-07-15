<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-4">CPD Activity Report</h2>
        <p class="text-gray-600 text-lg">
          Generate and export reports on Self and Provider CPD activities
        </p>
      </div>

      <!-- Filters Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h3 class="text-2xl font-semibold text-gray-800 mb-6">Report Filters</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label for="reportType" class="block text-sm font-medium text-gray-700">CPD Type</label>
            <select
              id="reportType"
              v-model="filters.reportType"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="All">All CPD Types</option>
              <option value="Self CPD">Self CPD</option>
              <option value="Provider CPD">Provider CPD</option>
            </select>
          </div>
          <div>
            <label for="fromDate" class="block text-sm font-medium text-gray-700">Date From</label>
            <input
              type="date"
              id="fromDate"
              v-model="filters.fromDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="toDate" class="block text-sm font-medium text-gray-700">Date To</label>
            <input
              type="date"
              id="toDate"
              v-model="filters.toDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Regretted">Regretted</option>
              <option value="SUBMITTED">Submitted (Provider)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div
          class="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4"
        >
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Report Results
            <span class="text-sm text-gray-500 font-normal"
              >({{ filteredReports.length }} records found)</span
            >
          </h3>
          <div class="flex space-x-3">
            <button
              type="button"
              @click="exportToExcel"
              :disabled="isLoading || !filteredReports.length"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <!-- ICON ADDED HERE -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M10.75 2.75a.75.75 0 00-1.5 0v8.586l-1.293-1.293a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l2.5-2.5a.75.75 0 10-1.06-1.06l-1.293 1.293V2.75z"
                />
                <path
                  d="M3 12.25a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM3 15.25a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                />
              </svg>
              Export to Excel
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CPD Type
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applicant / Provider
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Approval Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Approved By
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading">
                <td colspan="6" class="text-center py-10 text-gray-500">
                  <svg
                    class="animate-spin h-8 w-8 text-blue-600 mx-auto"
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
                  <p class="mt-2">Loading reports...</p>
                </td>
              </tr>
              <tr
                v-for="report in filteredReports"
                :key="`${report.cpdType}-${report.id}`"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ report.cpdType }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ report.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ report.applicantName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(report.status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ formatStatus(report.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(report.approvalDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ report.approvedBy }}
                </td>
              </tr>
              <tr v-if="!isLoading && filteredReports.length === 0">
                <td colspan="6" class="text-center py-10 text-gray-500">
                  No reports found for the selected filters.
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
import { ref, reactive, onMounted, computed } from 'vue'
import apiServices from '@/services/services'
import * as XLSX from 'xlsx' // Import the xlsx library

// Reactive object for filters
const filters = reactive({
  reportType: 'All',
  fromDate: '',
  toDate: '',
  status: '',
})

// Holds the raw, merged, and standardized data from both APIs
const allReports = ref([])
const isLoading = ref(false)

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Format status for display (e.g., "SUBMITTED" becomes "Submitted")
const formatStatus = (status) => {
  if (!status) return 'N/A'
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

// Get CSS class for status badges
const getStatusClass = (status) => {
  const lowerStatus = status?.toLowerCase() || ''
  if (lowerStatus.includes('approved')) return 'bg-green-100 text-green-800'
  if (lowerStatus.includes('pending') || lowerStatus.includes('submitted'))
    return 'bg-yellow-100 text-yellow-800'
  if (lowerStatus.includes('regretted') || lowerStatus.includes('rejected'))
    return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

// --- DATA FETCHING ---
const fetchData = async () => {
  isLoading.value = true
  try {
    const [selfCpdResponse, providerCpdResponse] = await Promise.all([
      apiServices.getMhpcCpdRecords(),
      apiServices.getMhpcCpdTask(),
    ])

    const selfCpdData = selfCpdResponse.data.results.map((item) => ({
      id: item.id,
      title: item.title_of_cpd,
      applicantName: item.full_name,
      cpdType: 'Self CPD',
      status: item.review_status,
      approvalDate: item.approved_at,
      approvedBy: item.approved_by_name || 'N/A',
      originalDate: item.created_at,
    }))

    const providerCpdData = providerCpdResponse.data.results.map((item) => ({
      id: item.id,
      title: item.title_of_cpd,
      applicantName: item.full_name,
      cpdType: 'Provider CPD',
      status: item.application_status,
      approvalDate: item.approved_at,
      approvedBy: item.approved_by_name || 'N/A',
      originalDate: item.created_at,
    }))

    allReports.value = [...selfCpdData, ...providerCpdData]
  } catch (error) {
    console.error('Error fetching CPD records:', error)
    allReports.value = []
  } finally {
    isLoading.value = false
  }
}

// --- INSTANT FILTERING LOGIC ---
// A computed property that automatically recalculates when `allReports` or `filters` change.
const filteredReports = computed(() => {
  if (isLoading.value) {
    return []
  }

  let reportsToFilter = [...allReports.value]

  // 1. Filter by CPD Type
  if (filters.reportType !== 'All') {
    reportsToFilter = reportsToFilter.filter((r) => r.cpdType === filters.reportType)
  }

  // 2. Filter by Status
  if (filters.status) {
    // Normalize status for comparison (e.g., "SUBMITTED" vs "Submitted")
    const lowerFilterStatus = filters.status.toLowerCase()
    reportsToFilter = reportsToFilter.filter((r) => r.status.toLowerCase() === lowerFilterStatus)
  }

  // 3. Filter by Date Range
  const fromDate = filters.fromDate ? new Date(filters.fromDate) : null
  const toDate = filters.toDate ? new Date(filters.toDate) : null
  if (toDate) toDate.setHours(23, 59, 59, 999) // Include the entire end day

  if (fromDate || toDate) {
    reportsToFilter = reportsToFilter.filter((r) => {
      const reportDate = new Date(r.originalDate)
      const isAfterFrom = !fromDate || reportDate >= fromDate
      const isBeforeTo = !toDate || reportDate <= toDate
      return isAfterFrom && isBeforeTo
    })
  }

  return reportsToFilter
})

// --- ACTIONS ---
onMounted(fetchData)

const exportToExcel = () => {
  if (filteredReports.value.length === 0) return

  const headers = [
    'CPD Type',
    'Title',
    'Applicant/Provider',
    'Status',
    'Approval Date',
    'Approved By',
  ]
  const dataForSheet = filteredReports.value.map((report) => ({
    'CPD Type': report.cpdType,
    Title: report.title,
    'Applicant/Provider': report.applicantName,
    Status: formatStatus(report.status),
    'Approval Date': formatDate(report.approvalDate),
    'Approved By': report.approvedBy,
  }))

  const worksheet = XLSX.utils.json_to_sheet(dataForSheet, { header: headers })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'CPD Report')

  // Set column widths for better readability
  const cols = [
    { wch: 15 }, // CPD Type
    { wch: 40 }, // Title
    { wch: 25 }, // Applicant/Provider
    { wch: 15 }, // Status
    { wch: 15 }, // Approval Date
    { wch: 20 }, // Approved By
  ]
  worksheet['!cols'] = cols

  XLSX.writeFile(workbook, 'CPD_Activity_Report.xlsx')
}
</script>
