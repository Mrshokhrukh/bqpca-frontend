<template>
  <div class="space-y-6">
    <!-- Enhanced Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
        <StatsCard
          title="Total Applications"
          :count="stats.totalApplications"
          :icon="FileText"
          color="blue"
          trend="+10% from last week"
        />
        <StatsCard
          title="Avg. Turnaround Time"
          :count="avgTurnaroundTime"
          :icon="Clock"
          color="purple"
          trend="-1 day from last week"
        >
          <div class="mt-2">
            <p class="text-sm text-gray-500">Based on completed applications</p>
          </div>
        </StatsCard>
      </div>
      <div class="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
        <StatsCard
          title="Applied Applications"
          :count="stats.applied"
          :icon="Hourglass"
          color="yellow"
          trend="Waiting for review"
        />
        <StatsCard
          title="Applications Under Review"
          :count="stats.underReview"
          :icon="Eye"
          color="teal"
          trend="Currently being processed"
        />
      </div>
    </div>

    <!-- Application Status Breakdown -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatusCard
        title="Approved Applications"
        :count="stats.approved"
        :icon="CheckCircle"
        color="green"
        :percentage="calculatePercentage(stats.approved)"
      />
      <StatusCard
        title="Reupload Applications"
        :count="stats.reupload"
        :icon="PauseCircle"
        color="amber"
        :percentage="calculatePercentage(stats.reupload)"
      />
      <StatusCard
        title="Regretted Applications"
        :count="stats.regretted"
        :icon="XCircle"
        color="red"
        :percentage="calculatePercentage(stats.regretted)"
      />
      <StatusCard
        title="Processing Applications"
        :count="stats.processing"
        :icon="Hourglass"
        color="blue-grey"
        :percentage="calculatePercentage(stats.processing)"
      />
    </div>

    <!-- Timeline Chart -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div class="p-6 pb-0">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800">Application Timeline</h3>
          <div class="flex items-center space-x-2">
            <button
              v-for="range in timeRanges"
              :key="range.value"
              @click="selectedTimeRange = range.value"
              :class="[
                'px-3 py-1 rounded-full text-xs transition-all duration-300',
                selectedTimeRange === range.value
                  ? `bg-${chartColor}-500 text-white`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ]"
            >
              {{ range.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="h-[400px] px-4 pt-2 pb-6">
        <VueApexCharts :options="chartOptions" :series="chartSeries" height="100%" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import StatsCard from '@/components/common/ROQ/ROQStatsCard.vue'
import StatusCard from '@/components/common/ROQ/ROQStatusCard.vue'
import VueApexCharts from 'vue3-apexcharts'
import { FileText, Clock, CheckCircle, XCircle, Eye, Hourglass, PauseCircle } from 'lucide-vue-next'
import apiService from '@/services/services'

// Data
const applications = ref([])
const selectedTimeRange = ref('all')
const chartOptions = ref({})
const chartSeries = ref([])

// Props
const props = defineProps({
  chartColor: {
    type: String,
    default: 'blue',
  },
})

// Time ranges
const timeRanges = [
  { value: 'all', label: 'All Time' },
  { value: '6m', label: 'Last 6M' },
  { value: '3m', label: 'Last 3M' },
]

// Stats computation
const stats = computed(() => {
  const totalApplications = applications.value.filter((app) => !app.is_second_copy && app.status !== 'draft' && app.status !== 'processing_payment').length

  return {
    totalApplications,
    applied: applications.value.filter((app) => app.status === 'applied').length,
    processing: applications.value.filter((app) => app.status === 'processing').length,
    underReview: applications.value.filter((app) => app.status === 'under_review').length,
    approved: applications.value.filter((app) => app.status === 'approved').length,
    reupload: applications.value.filter((app) => app.status === 'reupload').length,
    regretted: applications.value.filter((app) => app.status === 'regretted').length,
  }
})

// Percentage calculation
const calculatePercentage = (count) => {
  if (stats.value.totalApplications === 0) return 0
  return (count / stats.value.totalApplications) * 100
}

// Average turnaround time
const avgTurnaroundTime = computed(() => {
  const completedApplications = applications.value.filter(
    (app) => app.status === 'approved' || app.status === 'regretted'
  )
  if (completedApplications.length === 0) return 'N/A'

  let totalTimeDiff = 0
  completedApplications.forEach((app) => {
    const createdDate = new Date(app.created_at)
    const completedDate = new Date(app.updated_at)
    totalTimeDiff += completedDate.getTime() - createdDate.getTime()
  })

  const avgTimeDiffInDays = Math.ceil(
    totalTimeDiff / completedApplications.length / (1000 * 60 * 60 * 24)
  )
  return `${avgTimeDiffInDays} days`
})

// Filter data by time range
const filterDataByTimeRange = (data) => {
  if (selectedTimeRange.value === 'all') return data

  const now = new Date()
  const monthsToSubtract = selectedTimeRange.value === '6m' ? 6 : 3
  const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsToSubtract, 1)

  return data.filter((item) => new Date(item.created_at) >= cutoffDate)
}

// Group applications by month (memoized)
const groupApplicationsByMonth = (apps) => {
  const grouped = {}
  apps.forEach((app) => {
    const date = new Date(app.created_at)
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()
    const monthYear = `${month} ${year}`

    if (!grouped[monthYear]) {
      grouped[monthYear] = {
        totalApplications: 0,
        completedApplications: 0,
      }
    }
    grouped[monthYear].totalApplications += 1
    if (app.status === 'approved' || app.status === 'regretted') {
      grouped[monthYear].completedApplications += 1
    }
  })

  // Sort and reduce
  return Object.entries(grouped)
    .sort(([keyA], [keyB]) => {
      const [monthA, yearA] = keyA.split(' ')
      const [monthB, yearB] = keyB.split(' ')
      const monthOrder = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      const monthIndexA = monthOrder.indexOf(monthA)
      const monthIndexB = monthOrder.indexOf(monthB)

      return parseInt(yearA) - parseInt(yearB) || monthIndexA - monthIndexB
    })
    .reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {})
}

// Computed months for the chart
const computedMonths = computed(() => {
  if (applications.value.length === 0) {
    return [] // Fallback for empty data
  }
  const filteredData = filterDataByTimeRange(applications.value)
  const groupedData = groupApplicationsByMonth(filteredData)
  const months = Object.keys(groupedData)
  return months
})

const lineChartOptions = {
  chart: {
    type: 'line',
    height: 350,
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif',
    background: 'transparent',
    zoom: { enabled: false },
  },
  stroke: {
    curve: 'smooth',
    width: 4,
    colors: ['#3B82F6', '#10B981'],
  },
  markers: {
    size: 5,
    colors: ['#3B82F6', '#10B981'],
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: {
      size: 7,
    },
  },
  xaxis: {
    categories: computedMonths.value,
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
        fontWeight: 500,
      },
      rotate: -45,
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    title: {
      text: 'Number of Applications',
      style: {
        color: '#6b7280',
        fontSize: '12px',
      },
    },
    labels: {
      formatter: (val) => val.toFixed(0),
      style: {
        colors: '#6b7280',
      },
    },
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 3,
    row: {
      colors: ['transparent', 'transparent'],
    },
  },
  tooltip: {
    theme: 'light',
    x: { show: true },
    y: {
      formatter: (val) => `${val} Applications`,
      title: {
        formatter: (seriesName) => seriesName,
      },
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -30,
    labels: {
      colors: '#6b7280',
    },
  },
}

// Watcher to update chart options and series
watch([computedMonths, () => props.chartColor], () => {
  const filteredData = filterDataByTimeRange(applications.value)
  const groupedData = groupApplicationsByMonth(filteredData)

  // Choose one of these:
  chartOptions.value = lineChartOptions // Or stackedBarChartOptions

  chartSeries.value = [
    {
      name: 'Total Applications',
      data: Object.values(groupedData).map((group) => group.totalApplications),
    },
    {
      name: 'Completed Applications',
      data: Object.values(groupedData).map((group) => group.completedApplications),
    },
  ]
})

// Load applications
const loadApplications = async () => {
  try {
    const response = await apiService.getRecognitionOfQualifications()
    applications.value = response.data.results
  } catch (error) {
    console.error('Error loading applications:', error)
  }
}

// Lifecycle hook
onMounted(() => {
  loadApplications()
})
</script>
