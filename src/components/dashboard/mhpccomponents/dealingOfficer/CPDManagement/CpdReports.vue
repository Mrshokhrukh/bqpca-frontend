<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-4">CPD Activity Reports</h2>
        <p class="text-gray-600 text-lg">Generate and export reports on CPD activities</p>
      </div>

      <!-- Filters Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h3 class="text-2xl font-semibold text-gray-800 mb-4">Report Filters</h3>
        <form @submit.prevent="generateReport" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label for="fromDate" class="block text-sm font-medium text-gray-700"
                >From Date</label
              >
              <input
                type="date"
                id="fromDate"
                v-model="filters.fromDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="toDate" class="block text-sm font-medium text-gray-700">To Date</label>
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
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="submit"
              class="bg-blue-600 text-white rounded-md py-3 px-6 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Generate Report
            </button>
            <button
              type="button"
              @click="resetFilters"
              class="bg-gray-200 text-gray-700 rounded-md py-3 px-6 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Reset Filters
            </button>
          </div>
        </form>

        <!-- Export Buttons -->
        <div class="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            @click="exportToCSV"
            class="bg-green-100 text-green-700 rounded-md py-3 px-6 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Export to CSV
          </button>
          <button
            type="button"
            @click="printReport"
            class="bg-red-100 text-red-700 rounded-md py-3 px-6 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Print Report
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200" ref="reportTable">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CPD ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applicant Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="report in filteredReports"
                :key="report.id"
                class="hover:bg-gray-100 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ report.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ report.title }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ report.applicantName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      {
                        'bg-yellow-100 text-yellow-800': report.reviewStatus === 'Pending',
                      },
                      {
                        'bg-green-100 text-green-800': report.reviewStatus === 'Approved',
                      },
                      {
                        'bg-red-100 text-red-800': report.reviewStatus === 'Rejected',
                      },
                      'px-2 py-1 text-xs font-medium rounded-full',
                    ]"
                  >
                    {{ report.reviewStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(report.date) }}
                </td>
              </tr>
              <!-- Loading State -->
              <tr v-if="isLoading">
                <td colspan="5" class="text-center py-4">Loading reports...</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- No Results Message -->
        <div v-if="!isLoading && filteredReports.length === 0" class="text-center py-8">
          <p class="text-gray-500 text-lg">No reports found for the selected filters.</p>
        </div>
      </div>
    </div>

    <!-- Print Template (Hidden) -->
    <div class="hidden-print-template" ref="printTemplate" style="display: none">
      <div class="print-header">
        <h1>CPD Activity Report</h1>
        <p v-if="filters.fromDate || filters.toDate">
          Period: {{ filters.fromDate ? formatDate(filters.fromDate) : 'All' }} to
          {{ filters.toDate ? formatDate(filters.toDate) : 'Present' }}
        </p>
        <p v-if="filters.status">Status Filter: {{ filters.status }}</p>
      </div>
      <table class="print-table">
        <thead>
          <tr>
            <th>CPD ID</th>
            <th>Title</th>
            <th>Applicant Name</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in filteredReports" :key="report.id">
            <td>#{{ report.id }}</td>
            <td>{{ report.title }}</td>
            <td>{{ report.applicantName }}</td>
            <td>{{ report.reviewStatus }}</td>
            <td>{{ formatDate(report.date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import apiServices from '@/services/services'

const filters = reactive({
  fromDate: '',
  toDate: '',
  status: '',
})

const reports = ref([]) // Store the raw API data
const filteredReports = ref([]) // Store the filtered data for display
const isLoading = ref(false)
const reportTable = ref(null)
const printTemplate = ref(null)

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '' // Handle null/undefined dates.
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// Fetch data on component mount
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await apiServices.getMhpcCpdRecords()
    if (response && response.data && response.data.results) {
      reports.value = response.data.results.map((item) => ({
        id: item.id,
        title: item.title_of_cpd,
        applicantName: item.full_name,
        reviewStatus: item.review_status, // Use review_status
        date: item.created_at, // Keep the original date
        registrationNumber: item.registration_no,
        cidNumber: item.cid_no,
        fullName: item.full_name,
        gender: item.gender,
        cpdTitle: item.title_of_cpd,
        relevance: item.relevance_to_profession,
        participationCategory: item.participation_category?.participation_category_name,
        participantSubCategory: item.participant_sub_category?.participation_sub_category_name,
        activityType: item.type_of_cpd_activity?.cpd_activity_name,
        attachment: item.attachment ? { url: item.attachment } : null,
        cpdCredits: item.cpd_credit,
        remarks: item.remark,
      }))
      generateReport() // Apply filters on initial load
    } else {
      console.error('Unexpected API response format:', response)
      reports.value = []
    }
  } catch (error) {
    console.error('Error fetching CPD records:', error)
    reports.value = [] // Set to empty array on error
  } finally {
    isLoading.value = false
  }
})

const generateReport = () => {
  filteredReports.value = reports.value.filter((report) => {
    const reportDate = report.date ? new Date(report.date) : null
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null
    const toDate = filters.toDate ? new Date(filters.toDate) : null
    // Adjust toDate to include the full day
    if (toDate) {
      toDate.setHours(23, 59, 59, 999)
    }

    const isWithinDateRange =
      (!fromDate || (reportDate && reportDate >= fromDate)) &&
      (!toDate || (reportDate && reportDate <= toDate))

    const matchesStatus = !filters.status || report.reviewStatus === filters.status

    return isWithinDateRange && matchesStatus
  })
}

const resetFilters = () => {
  filters.fromDate = ''
  filters.toDate = ''
  filters.status = ''
  generateReport() // Re-apply filters (which will now show all data)
}

// Export to CSV - Native JavaScript approach without external libraries
const exportToCSV = () => {
  if (filteredReports.value.length === 0) {
    alert('No data to export.')
    return
  }

  // Prepare headers
  const headers = ['CPD ID', 'Title', 'Applicant Name', 'Status', 'Date']

  // Prepare rows
  const rows = filteredReports.value.map((report) => [
    report.id,
    report.title,
    report.applicantName,
    report.reviewStatus,
    formatDate(report.date),
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) =>
          // Handle cells that might contain commas or quotes
          typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))
            ? `"${cell.replace(/"/g, '""')}"`
            : cell,
        )
        .join(','),
    ),
  ].join('\n')

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'CPD_Reports.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Print report using browser's print functionality
const printReport = () => {
  if (filteredReports.value.length === 0) {
    alert('No data to print.')
    return
  }

  // Create a new window for printing
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups for this website to print reports.')
    return
  }

  // Create print-friendly content
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>CPD Activity Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; text-align: center; }
        .print-info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .status-pending { background-color: #fff3cd; }
        .status-approved { background-color: #d4edda; }
        .status-rejected { background-color: #f8d7da; }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>CPD Activity Report</h1>
      <div class="print-info">
        ${
          filters.fromDate || filters.toDate
            ? `<p><strong>Period:</strong> ${
                filters.fromDate ? formatDate(filters.fromDate) : 'All'
              } to
          ${filters.toDate ? formatDate(filters.toDate) : 'Present'}</p>`
            : ''
        }
        ${filters.status ? `<p><strong>Status Filter:</strong> ${filters.status}</p>` : ''}
        <p><strong>Total Records:</strong> ${filteredReports.value.length}</p>
        <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>CPD ID</th>
            <th>Title</th>
            <th>Applicant Name</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${filteredReports.value
            .map(
              (report) => `
            <tr class="${
              report.reviewStatus === 'Pending'
                ? 'status-pending'
                : report.reviewStatus === 'Approved'
                  ? 'status-approved'
                  : report.reviewStatus === 'Rejected'
                    ? 'status-rejected'
                    : ''
            }">
              <td>#${report.id}</td>
              <td>${report.title}</td>
              <td>${report.applicantName}</td>
              <td>${report.reviewStatus}</td>
              <td>${formatDate(report.date)}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
      <div style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()">Print Report</button>
      </div>
    </body>
    </html>
  `

  // Write content to the new window and print
  printWindow.document.open()
  printWindow.document.write(printContent)
  printWindow.document.close()
  // Wait for content to be loaded before printing
  printWindow.onload = function () {
    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 250)
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
.hidden-print-template {
  display: none;
}

@media print {
  .hidden-print-template {
    display: block;
  }
}
</style>
