<template>
  <div class="p-4 w-full space-y-6">
    <!-- Error Handling -->
    <div
      v-if="error"
      :class="[
        error.includes('no application')
          ? 'bg-blue-50 border-l-4 border-blue-400 p-4 mb-4'
          : 'bg-red-50 border-l-4 border-red-400 p-4 mb-4',
      ]"
    >
      <div class="flex items-center">
        <XCircle
          class="h-5 w-5"
          :class="[error.includes('no application') ? 'text-blue-400' : 'text-red-400']"
        />
        <div>
          <p
            class="text-sm"
            :class="[error.includes('no application') ? 'text-blue-700' : 'text-red-700']"
          >
            {{ error }}
          </p>
          <router-link
            v-if="error.includes('no application')"
            to="/admin/user/roq/my_applications"
            class="text-blue-700 underline mt-2 inline-block"
            >Apply Now</router-link
          >
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else>
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Applications"
          :count="stats.totalApplications"
          :icon="FileText"
          color="blue"
          trend="Total applications submitted"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
        />
        <StatsCard
          title="Success Rate"
          :count="`${successRate}%`"
          :icon="TrendingUp"
          color="emerald"
          trend="Based on processed applications"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
        />
        <StatsCard
          title="Avg. Processing Time"
          :count="`${avgProcessingTime.days}d ${avgProcessingTime.hours}h`"
          :icon="Clock"
          color="purple"
          trend="Average processing duration"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
        />
        <StatsCard
          title="Total Processing"
          :count="stats.totalProcessing"
          :icon="Pencil"
          color="amber"
          trend="Applications in process"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
        />
      </div>

      <!-- Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatusCard
          title="Approved"
          :count="stats.totalApproved"
          :icon="CheckCircle"
          color="green"
          :percentage="
            filteredApplications.length
              ? (stats.totalApproved / filteredApplications.length) * 100
              : 0
          "
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
        />
        <StatusCard
          title="Processing"
          :count="stats.totalProcessing"
          :icon="Clock"
          color="yellow"
          :percentage="
            filteredApplications.length
              ? (stats.totalProcessing / filteredApplications.length) * 100
              : 0
          "
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
        />
        <StatusCard
          title="Regretted"
          :count="stats.totalRegretted"
          :icon="XCircle"
          color="red"
          :percentage="
            filteredApplications.length
              ? (stats.totalRegretted / filteredApplications.length) * 100
              : 0
          "
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
        />
      </div>

      <!-- Timeline Chart -->
      <div class="bg-white rounded-lg shadow p-6 mt-6">
        <h3 class="text-lg font-semibold mb-4 text-slate-900">Application Timeline</h3>
        <div class="h-[350px]" ref="chartContainer">
          <VueApexCharts
            v-if="!isLoading && filteredApplications.length > 0"
            :options="chartOptions"
            :series="chartSeries"
            height="100%"
          />
          <div
            v-else-if="!isLoading && filteredApplications.length === 0"
            class="flex items-center justify-center h-full text-gray-500"
          >
            No application data available
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import StatsCard from '../../../common/ROQ/ROQStatsCard.vue'
import StatusCard from '../../../common/ROQ/ROQStatusCard.vue'
import { FileText, CheckCircle, XCircle, Clock, TrendingUp, Pencil } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import apiService from '@/services/services'

const { user } = useAuthStore()
const applications = ref([])
const isLoading = ref(false)
const error = ref(null)
const chartContainer = ref(null)
const isChartReady = ref(false)

// Filtered applications (exclude is_second_copy: true)
const filteredApplications = computed(() => {
  return applications.value.filter((app) => !app.is_second_copy)
})

// Compute statistics
const stats = computed(() => {
  return {
    totalApplications: filteredApplications.value.length,
    totalApproved: filteredApplications.value.filter((app) => app.status === 'approved').length,
    totalRegretted: filteredApplications.value.filter((app) => app.status === 'regretted').length,
    totalProcessing: filteredApplications.value.filter((app) => app.status === 'processing').length,
  }
})

// Calculate average processing time
const avgProcessingTime = computed(() => {
  const processedApplications = filteredApplications.value.filter(
    (app) => app.created_at && app.updated_at
  )

  if (processedApplications.length === 0) {
    return { days: 0, hours: 0 }
  }

  const totalProcessingTime = processedApplications.reduce((acc, app) => {
    const createdAt = new Date(app.created_at)
    const updatedAt = new Date(app.updated_at)
    return acc + (updatedAt - createdAt)
  }, 0)

  const avgTimeMs = totalProcessingTime / processedApplications.length

  return {
    days: Math.floor(avgTimeMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((avgTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
  }
})

// Calculate success rate
const successRate = computed(() => {
  const totalProcessed = filteredApplications.value.filter((app) =>
    ['approved', 'regretted'].includes(app.status)
  ).length

  const approved = filteredApplications.value.filter((app) => app.status === 'approved').length

  if (totalProcessed === 0) return 0
  return ((approved / totalProcessed) * 100).toFixed(1)
})

// Chart configuration
const chartOptions = ref({
  chart: {
    height: 350,
    type: 'line',
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3, lineCap: 'round' },
  markers: {
    size: 4,
    colors: ['#3B82F6', '#10B981'],
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: { size: 7 },
  },
  grid: {
    row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
    borderColor: '#f3f4f6',
  },
  xaxis: {
    categories: [],
    labels: { rotate: -45, trim: false },
  },
  yaxis: {
    labels: { formatter: (val) => val.toFixed(0) },
  },
  colors: ['#3B82F6', '#10B981'],
  legend: { position: 'top' },
  tooltip: {
    theme: 'light',
    x: { show: true },
    y: { formatter: (value) => `${value.toFixed(0)} applications` },
  },
})

const chartSeries = ref([
  { name: 'Total Applications', data: [] },
  { name: 'Approved', data: [] },
])

// Group applications by month
const groupApplicationsByMonth = () => {
  const grouped = {}
  const now = new Date()
  const monthsAgo = new Date(now.setMonth(now.getMonth() - 11))

  // Initialize the last 12 months
  for (let d = new Date(monthsAgo); d <= new Date(); d.setMonth(d.getMonth() + 1)) {
    const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' })
    grouped[monthYear] = { total: 0, approved: 0, regretted: 0, processing: 0 }
  }

  // Fill in actual values
  filteredApplications.value.forEach((app) => {
    const date = new Date(app.created_at)
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' })

    if (grouped[monthYear]) {
      grouped[monthYear].total++
      switch (app.status) {
        case 'approved':
          grouped[monthYear].approved++
          break
        case 'regretted':
          grouped[monthYear].regretted++
          break
        case 'processing':
          grouped[monthYear].processing++
          break
      }
    }
  })

  return grouped
}

// Update chart data
const updateChartData = () => {
  if (!isChartReady.value) return

  const groupedData = groupApplicationsByMonth()
  const months = Object.keys(groupedData)
  const totalCounts = months.map((month) => groupedData[month].total)
  const approvedCounts = months.map((month) => groupedData[month].approved)

  chartOptions.value = {
    ...chartOptions.value,
    xaxis: { ...chartOptions.value.xaxis, categories: months },
  }

  chartSeries.value = [
    { name: 'Total Applications', data: totalCounts },
    { name: 'Approved', data: approvedCounts },
  ]
}

// Watch for data changes and update chart
watchEffect(() => {
  if (filteredApplications.value.length > 0 && !isLoading.value) {
    isChartReady.value = true
    updateChartData()
  }
})

// Load applications
const loadApplications = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiService.getRecognitionOfQualification(user.cid)
    applications.value = response.data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )
  } catch (err) {
    console.error('Error loading applications:', err)
    if (
      err.response?.status === 404 &&
      err.response?.data?.detail === 'No record found with the given ID or CID.'
    ) {
      error.value =
        'There seems to be no application under your user name. Please proceed and apply for a new application.'
    } else {
      error.value = 'Failed to load application data. Please try again later.'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadApplications()
})
</script>
