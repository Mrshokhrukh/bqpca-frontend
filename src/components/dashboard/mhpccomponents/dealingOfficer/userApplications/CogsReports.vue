<template>
  <div class="min-h-screen">
    <div class="mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
      <!-- Use the Header Component for the Reports Page -->
      <DOPageHeader
        title="COGS Reports & Analytics"
        description="Analyze trends and statistics for Certificate of Good Standing applications."
      >
        <!-- Custom slot for date range filters -->
        <template #actions>
          <div
            class="flex items-center space-x-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm"
          >
            <CalendarIcon class="h-5 w-5 text-gray-400 ml-2" />
            <div class="flex items-center space-x-2">
              <label for="startDate" class="text-sm font-medium text-gray-600">From:</label>
              <input
                type="date"
                id="startDate"
                v-model="dateRange.start"
                class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1.5"
              />
            </div>
            <div class="flex items-center space-x-2">
              <label for="endDate" class="text-sm font-medium text-gray-600">To:</label>
              <input
                type="date"
                id="endDate"
                v-model="dateRange.end"
                class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-1.5"
              />
            </div>
            <button
              @click="resetDateFilter"
              class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium text-sm"
            >
              Reset
            </button>
          </div>
        </template>
      </DOPageHeader>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col justify-center items-center py-24">
        <div class="w-16 h-16 relative">
          <div
            class="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"
          ></div>
          <div
            class="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"
          ></div>
        </div>
        <p class="text-gray-600 font-medium mt-4">Loading report data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white p-8 rounded-2xl shadow-xl">
        <div class="mx-auto max-w-md bg-red-50 border-l-4 border-red-500 rounded-xl p-6 shadow-md">
          <div class="flex items-center">
            <CircleAlert class="w-8 h-8 text-red-500 mr-4 flex-shrink-0" />
            <div>
              <h3 class="text-lg font-bold text-red-800">An error occurred</h3>
              <p class="text-red-700 mt-1">{{ error }}</p>
              <button
                @click="fetchData"
                class="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Report Content -->
      <div v-else class="space-y-8">
        <!-- Summary Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex items-center space-x-4"
          >
            <div class="bg-indigo-100 p-3 rounded-xl">
              <FileTextIcon class="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Total Applications</p>
              <p class="text-3xl font-bold text-gray-900">{{ summaryStats.total }}</p>
            </div>
          </div>
          <div
            class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex items-center space-x-4"
          >
            <div class="bg-green-100 p-3 rounded-xl">
              <CheckCircle2Icon class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Approved</p>
              <p class="text-3xl font-bold text-gray-900">{{ summaryStats.approved }}</p>
            </div>
          </div>
          <div
            class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex items-center space-x-4"
          >
            <div class="bg-red-100 p-3 rounded-xl">
              <XCircleIcon class="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Rejected</p>
              <p class="text-3xl font-bold text-gray-900">{{ summaryStats.rejected }}</p>
            </div>
          </div>
          <div
            class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex items-center space-x-4"
          >
            <div class="bg-blue-100 p-3 rounded-xl">
              <PercentIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Approval Rate</p>
              <p class="text-3xl font-bold text-gray-900">{{ summaryStats.approvalRate }}%</p>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <!-- Application Trends Chart -->
          <div class="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Application Trends by Month</h3>
            <div class="h-80">
              <Bar
                v-if="trendsChartData.datasets[0]?.data.length > 0"
                :data="trendsChartData"
                :options="chartOptions"
              />
              <div v-else class="flex items-center justify-center h-full text-gray-500">
                <BarChart3Icon class="w-10 h-10 mr-2 opacity-50" /> No data for the selected period.
              </div>
            </div>
          </div>

          <!-- Status Breakdown Chart -->
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Status Breakdown</h3>
            <div class="h-80">
              <Doughnut
                v-if="statusChartData.datasets[0]?.data.some((d) => d > 0)"
                :data="statusChartData"
                :options="chartOptions"
              />
              <div v-else class="flex items-center justify-center h-full text-gray-500">
                <PieChartIcon class="w-10 h-10 mr-2 opacity-50" /> No applications to display.
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State for filters -->
        <div
          v-if="!filteredApplications.length && !isLoading && !error && allApplications.length > 0"
          class="text-center py-16 px-4 bg-white rounded-2xl shadow-xl border border-gray-100"
        >
          <div
            class="mx-auto h-32 w-32 text-indigo-300 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner"
          >
            <InboxIcon class="h-16 w-16" />
          </div>
          <h3 class="mt-2 text-xl font-medium text-gray-900">No Applications Found</h3>
          <p class="mt-1 text-gray-500 max-w-md mx-auto">
            There are no applications matching your selected date range. Try adjusting or resetting
            the dates.
          </p>
          <button
            @click="resetDateFilter"
            class="mt-6 px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-200 font-medium transform hover:scale-105"
          >
            Reset Date Filter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js'
import {
  CircleAlert,
  InboxIcon,
  FileTextIcon,
  CheckCircle2Icon,
  XCircleIcon,
  PercentIcon,
  CalendarIcon,
  BarChart3Icon,
  PieChartIcon,
} from 'lucide-vue-next'
import apiServices from '@/services/services'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

// --- State ---
const allApplications = ref([])
const isLoading = ref(true)
const error = ref(null)
const dateRange = ref({
  start: null,
  end: null,
})

// --- Chart Data & Options ---
const trendsChartData = ref({ labels: [], datasets: [] })
const statusChartData = ref({ labels: [], datasets: [] })
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0, // Ensure y-axis has whole numbers
      },
    },
  },
})

// --- Computed Properties ---

// Filter applications based on the selected date range
const filteredApplications = computed(() => {
  if (!dateRange.value.start && !dateRange.value.end) {
    return allApplications.value
  }
  return allApplications.value.filter((app) => {
    // Assuming 'created_at' is the submission date field. Adjust if necessary.
    const appDate = new Date(app.created_at)
    const startDate = dateRange.value.start ? new Date(dateRange.value.start) : null
    const endDate = dateRange.value.end ? new Date(dateRange.value.end) : null

    if (startDate) startDate.setHours(0, 0, 0, 0)
    if (endDate) endDate.setHours(23, 59, 59, 999)

    const isAfterStart = startDate ? appDate >= startDate : true
    const isBeforeEnd = endDate ? appDate <= endDate : true

    return isAfterStart && isBeforeEnd
  })
})

// Calculate summary statistics from the filtered data
const summaryStats = computed(() => {
  const total = filteredApplications.value.length
  const approved = filteredApplications.value.filter(
    (app) => app.endorsement_decision === 'Approved',
  ).length
  const rejected = filteredApplications.value.filter(
    (app) => app.endorsement_decision === 'Rejected' || app.review_status === 'Rejected',
  ).length
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0

  return { total, approved, rejected, approvalRate }
})

// --- Methods ---

const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiServices.getMhpcCogs()
    allApplications.value = response.data?.results || response.data || []
    // Initial processing of data
    processDataForCharts()
  } catch (err) {
    error.value = 'Failed to load report data. Please try again later.'
    console.error('Error fetching COGS data:', err)
    allApplications.value = []
  } finally {
    isLoading.value = false
  }
}

const resetDateFilter = () => {
  dateRange.value.start = null
  dateRange.value.end = null
}

// Process filtered data to populate chart data structures
const processDataForCharts = () => {
  const apps = filteredApplications.value

  // 1. Process for Status Breakdown (Doughnut Chart)
  const statuses = { Pending: 0, Approved: 0, Rejected: 0 }
  apps.forEach((app) => {
    if (app.endorsement_decision === 'Approved') statuses.Approved++
    else if (app.endorsement_decision === 'Rejected' || app.review_status === 'Rejected')
      statuses.Rejected++
    else statuses.Pending++
  })

  statusChartData.value = {
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [
      {
        label: 'Application Status',
        data: [statuses.Approved, statuses.Rejected, statuses.Pending],
        backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'], // green, red, yellow
        hoverOffset: 4,
      },
    ],
  }

  // 2. Process for Application Trends (Bar Chart)
  const monthlyCounts = {}
  apps.forEach((app) => {
    const date = new Date(app.created_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` // YYYY-MM
    if (!monthlyCounts[monthKey]) {
      monthlyCounts[monthKey] = 0
    }
    monthlyCounts[monthKey]++
  })

  const sortedMonths = Object.keys(monthlyCounts).sort()
  const labels = sortedMonths.map((monthKey) => {
    const [year, month] = monthKey.split('-')
    return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' })
  })
  const data = sortedMonths.map((monthKey) => monthlyCounts[monthKey])

  trendsChartData.value = {
    labels,
    datasets: [
      {
        label: 'Applications per Month',
        data,
        backgroundColor: 'rgba(79, 70, 229, 0.8)', // Indigo
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }
}

// --- Watchers ---

// Re-process chart data whenever the filtered list changes (due to date filter)
watch(
  filteredApplications,
  () => {
    processDataForCharts()
  },
  { deep: true },
)

// --- Lifecycle Hooks ---

onMounted(fetchData)
</script>
