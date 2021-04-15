<!-- ChiefReport.vue -->
<template>
  <div class="p-4">
    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-4 rounded-lg shadow-lg">
        <span class="text-lg">Loading...</span>
      </div>
    </div>

    <!-- Header with Export Button -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-gray-900">Chief's Report</h1>
      <button
        @click="downloadReport"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <i class="pi pi-download mr-2"></i>
        Export Report
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div
        v-for="(stat, index) in statsArray"
        :key="index"
        class="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-500">{{ stat.label }}</span>
          <component :is="stat.icon" class="w-4 h-4 text-gray-500" />
        </div>
        <p class="text-2xl font-bold">{{ stat.value }}</p>
        <p class="text-sm text-gray-500">{{ stat.trend }}</p>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            v-model="dateRange"
            class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search applications..."
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <i class="pi pi-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="header in tableHeaders"
                :key="header.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                @click="sortBy(header.key)"
              >
                {{ header.label }}
                <i
                  v-if="sortKey === header.key"
                  :class="['pi', sortOrder === 'asc' ? 'pi-sort-up' : 'pi-sort-down', 'ml-1']"
                >
                </i>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="app in paginatedData" :key="app.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ app.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ app.full_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(app.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ app.user?.username || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(getQualificationStatus(app))">
                  {{ getQualificationStatus(app) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ app.registration_no || '-' }}</td>
              <td class="px-6 py-4">
                <div class="truncate max-w-xs" :title="getDealingOfficerRemarks(app)">
                  {{ getDealingOfficerRemarks(app) || '-' }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="truncate max-w-xs" :title="getChiefRemarks(app)">
                  {{ getChiefRemarks(app) || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ calculateProcessingDays(app) }} days</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredData.length }} entries
          </div>
          <div class="flex gap-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded"
              :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border rounded"
              :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from 'vue-toastification'
import { Clock, CheckCircle, XCircle, ClipboardList } from 'lucide-vue-next'
import {
  format,
  subDays,
  startOfWeek,
  startOfMonth,
  startOfYear,
  isWithinInterval,
  differenceInDays,
} from 'date-fns'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import apiService from '@/services/services'

// State variables
const searchQuery = ref('')
const dateRange = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortKey = ref('created_at') // Changed default sort key
const sortOrder = ref('desc')
const applications = ref([]) // Local state, no globalState
const loading = ref(false) // Local loading state

// Table configuration (Adjusted keys to match updated data structure)
const tableHeaders = [
  { key: 'id', label: 'Application ID' },
  { key: 'full_name', label: 'Applicant Name' },
  { key: 'created_at', label: 'Submission Date' },
  { key: 'user.username', label: 'Dealing Officer' }, // Nested property
  { key: 'status', label: 'Status' },
  { key: 'registration_no', label: 'QEC Number' }, //Might need to change.
  { key: 'dealing_officer_remarks', label: 'DO Remarks' },
  { key: 'chief_remarks', label: 'Chief Remarks' },
  { key: 'processing_time', label: 'Processing Time' },
]

// Computed properties
const stats = computed(() => {
  const total = applications.value.length
  const approved = applications.value.filter(
    (app) => getQualificationStatus(app) === 'Approved',
  ).length
  const regretted = applications.value.filter(
    (app) => getQualificationStatus(app) === 'Regretted',
  ).length
  const pending = applications.value.filter(
    (app) => getQualificationStatus(app) === 'Pending',
  ).length

  return {
    total,
    approved,
    regretted,
    pending,
    approvalRate: total ? ((approved / total) * 100).toFixed(1) : 0,
  }
})

const statsArray = computed(() => [
  {
    label: 'Total Reviews',
    value: stats.value.total,
    icon: ClipboardList,
    trend: 'All applications',
  },
  {
    label: 'Pending Review',
    value: stats.value.pending,
    icon: Clock,
    trend: 'Awaiting decision',
  },
  {
    label: 'Approved',
    value: stats.value.approved,
    icon: CheckCircle,
    trend: `${stats.value.approvalRate}% approval rate`,
  },
  {
    label: 'Regretted',
    value: stats.value.regretted,
    icon: XCircle,
    trend: `${(100 - stats.value.approvalRate).toFixed(1)}% regret rate`,
  },
])

const dateRangeFilter = computed(() => {
  const now = new Date()
  switch (dateRange.value) {
    case 'today':
      return { start: subDays(now, 1), end: now }
    case 'week':
      return { start: startOfWeek(now), end: now }
    case 'month':
      return { start: startOfMonth(now), end: now }
    case 'year':
      return { start: startOfYear(now), end: now }
    default:
      return null
  }
})

const filteredData = computed(() => {
  let filtered = [...applications.value]

  // Date range filter
  if (dateRangeFilter.value) {
    filtered = filtered.filter((app) => {
      const appDate = new Date(app.created_at) // Use created_at
      return isWithinInterval(appDate, dateRangeFilter.value)
    })
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (app) =>
        String(app.id).toLowerCase().includes(query) ||
        app.full_name?.toLowerCase().includes(query) || // Use full_name
        app.user?.username?.toLowerCase().includes(query) || // Nested property
        getQualificationStatus(app).toLowerCase().includes(query) ||
        app.registration_no?.toLowerCase().includes(query) || // Use registration_no
        getDealingOfficerRemarks(app)?.toLowerCase().includes(query) ||
        getChiefRemarks(app)?.toLowerCase().includes(query),
    )
  }

  // Sort
  return filtered.sort((a, b) => {
    let aValue = a[sortKey.value]
    let bValue = b[sortKey.value]

    // Handle nested properties (user.username)
    if (sortKey.value.includes('.')) {
      const keys = sortKey.value.split('.')
      aValue = a[keys[0]] ? a[keys[0]][keys[1]] : null
      bValue = b[keys[0]] ? b[keys[0]][keys[1]] : null
    }

    if (sortKey.value === 'created_at') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }
    //null and undefined check
    if (aValue == null) aValue = ''
    if (bValue == null) bValue = ''

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length),
)
const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value))

const toast = useToast()
let refreshInterval
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes

const fetchApplications = async () => {
  loading.value = true
  try {
    const response = await apiService.getMhpcNewApplications() // Use the correct endpoint
    //console.log("API Response:", response);

    if (response?.data?.results && Array.isArray(response.data.results)) {
      applications.value = response.data.results
    } else {
      applications.value = []
      console.error('Unexpected API response format:', response)
      toast.error('Failed to load applications: Invalid response format.')
    }
  } catch (error) {
    console.error('Error fetching applications:', error)
    applications.value = []
    if (error.response) {
      toast.error(`API Error: ${error.response.status} - ${error.response.data}`)
    } else if (error.request) {
      toast.error('Network Error: No response from server.')
    } else {
      toast.error('Request Error: ' + error.message)
    }
  } finally {
    loading.value = false
  }
}

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}
const getQualificationStatus = (app) => {
  if (app.user_qualifications && app.user_qualifications.length > 0) {
    // Use endorsement_decision as the primary status indicator
    return app.user_qualifications[0].endorsement_decision || 'Pending'
  }
  return 'Pending' // Default status
}

const getDealingOfficerRemarks = (app) => {
  if (app.user_qualifications && app.user_qualifications.length > 0) {
    return app.user_qualifications[0].physical_review_remark
  }
  return ''
}

const getChiefRemarks = (app) => {
  if (app.user_qualifications && app.user_qualifications.length > 0) {
    return app.user_qualifications[0].endorsement_remarks
  }
  return ''
}

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const calculateProcessingDays = (application) => {
  const submissionDate = new Date(application.created_at) // Use created_at
  const currentDate = new Date() // Always use current date for processing time
  return differenceInDays(currentDate, submissionDate)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A' // Handle null/undefined dates
  return format(new Date(dateString), 'MMM dd, yyyy')
}

const getStatusClass = (status) => {
  // Use the same status values
  const classes = {
    Approved:
      'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
    Regretted: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
    Pending:
      'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
    Processing:
      'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800', // This won't be used now
  }
  return (
    classes[status] ||
    'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'
  )
}
const downloadReport = () => {
  const doc = new jsPDF()

  doc.setFontSize(20)
  doc.text("Chief's Applications Report", 14, 22)
  doc.setFontSize(12)
  doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 32)

  doc.setFontSize(16)
  doc.text('Summary Statistics', 14, 45)
  doc.setFontSize(12)
  let yPos = 55
  Object.entries(stats.value).forEach(([key, value]) => {
    if (key !== 'approvalRate') {
      doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 14, yPos)
      yPos += 10
    }
  })
  doc.text(`Approval Rate: ${stats.value.approvalRate}%`, 14, yPos)

  const tableData = filteredData.value.map((app) => [
    app.id,
    app.full_name,
    formatDate(app.created_at),
    app.user?.username || '-', // Handle potentially missing user
    getQualificationStatus(app), // Use the helper function
    app.registration_no || '-',
    getDealingOfficerRemarks(app) || '-',
    getChiefRemarks(app) || '-',
    `${calculateProcessingDays(app)} days`,
  ])

  doc.autoTable({
    startY: yPos + 20,
    head: [
      [
        'ID',
        'Applicant',
        'Submission Date',
        'Dealing Officer',
        'Status',
        'Reg. Number',
        'DO Remarks',
        'Chief Remarks',
        'Processing Time',
      ],
    ],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 },
      6: { cellWidth: 35 },
      7: { cellWidth: 35 },
      8: { cellWidth: 20 },
    },
    styles: { overflow: 'linebreak' },
  })

  doc.save(`chief_applications_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
  toast.success('Report downloaded successfully')
}

onMounted(async () => {
  await fetchApplications()
  refreshInterval = setInterval(fetchApplications, AUTO_REFRESH_INTERVAL)
})

onBeforeUnmount(() => {
  clearInterval(refreshInterval)
})
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
