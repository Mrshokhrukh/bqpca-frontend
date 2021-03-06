<template>
  <div class="space-y-6">
    <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <XCircle class="h-5 w-5 text-red-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>

    <div v-else>
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
          <StatsCard title="Total Applications" :count="stats.totalApplications" :icon="FileText" color="blue"
            trend="Total applications submitted" />
          <StatsCard title="Success Rate" :count="`${successRate}%`" :icon="TrendingUp" color="emerald"
            trend="Based on processed applications" />
        </div>
        <div class="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
          <StatsCard title="Avg. Processing Time" :count="`${avgProcessingTime.days}d ${avgProcessingTime.hours}h`"
            :icon="Clock" color="purple" trend="Average processing duration" />
          <StatsCard title="Total Processing" :count="stats.totalProcessing" :icon="Pencil" color="amber"
            trend="Applications in process" />
        </div>
      </div>

      <!-- Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard title="Approved" :count="stats.totalApproved" :icon="CheckCircle" color="green"
          :percentage="applications.length ? (stats.totalApproved / applications.length) * 100 : 0" />
        <StatusCard title="Processing" :count="stats.totalProcessing" :icon="Clock" color="yellow"
          :percentage="applications.length ? (stats.totalProcessing / applications.length) * 100 : 0" />
        <StatusCard title="Regretted" :count="stats.totalRegretted" :icon="XCircle" color="red"
          :percentage="applications.length ? (stats.totalRegretted / applications.length) * 100 : 0" />
      </div>

      <!-- Timeline Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Application Timeline</h3>
        <div class="h-[350px]" ref="chartContainer">
          <VueApexCharts v-if="!isLoading && applications.length > 0" :options="chartOptions" :series="chartSeries"
            height="100%" />
          <div v-else-if="!isLoading && applications.length === 0"
            class="flex items-center justify-center h-full text-gray-500">
            No application data available
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import StatsCard from '../../../common/ROQ/ROQStatsCard.vue';
import StatusCard from '../../../common/ROQ/ROQStatusCard.vue';
import { FileText, CheckCircle, XCircle, Clock, TrendingUp, Pencil } from 'lucide-vue-next';
import VueApexCharts from 'vue3-apexcharts';
import apiService from '@/services/services';

const { user } = useAuthStore();
const applications = ref([]);
const isLoading = ref(false);
const error = ref(null);
const chartContainer = ref(null);
const isChartReady = ref(false);

// Compute statistics
const stats = computed(() => {
  return {
    totalApplications: applications.value.length,
    totalApproved: applications.value.filter(app => app.status === 'approved').length,
    totalRegretted: applications.value.filter(app => app.status === 'regretted').length,
    totalProcessing: applications.value.filter(app => app.status === 'processing').length
  };
});

// Calculate average processing time
const avgProcessingTime = computed(() => {
  const processedApplications = applications.value.filter(app =>
    app.created_at && app.updated_at
  );

  if (processedApplications.length === 0) {
    return { days: 0, hours: 0, seconds: 0 };
  }

  const totalProcessingTime = processedApplications.reduce((acc, app) => {
    const createdAt = new Date(app.created_at);
    const updatedAt = new Date(app.updated_at);
    return acc + (updatedAt - createdAt);
  }, 0);

  const avgTimeMs = totalProcessingTime / processedApplications.length;

  return {
    days: Math.floor(avgTimeMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((avgTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    seconds: Math.floor((avgTimeMs % (1000 * 60 * 60)) / 1000)
  };
});

// Calculate success rate
const successRate = computed(() => {
  const totalProcessed = applications.value.filter(app =>
    ['approved', 'regretted'].includes(app.status)
  ).length;

  const approved = applications.value.filter(app => app.status === 'approved').length;

  if (totalProcessed === 0) return 0;
  return ((approved / totalProcessed) * 100).toFixed(1);
});

// Chart configuration
const chartOptions = ref({
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 3,
    lineCap: 'round'
  },
  markers: {
    size: 4,
    colors: ['#3B82F6', '#10B981'],
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: {
      size: 7,
    }
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    },
    borderColor: '#f3f4f6'
  },
  xaxis: {
    categories: [],
    labels: {
      rotate: -45,
      trim: false
    }
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return val.toFixed(0)
      }
    }
  },
  colors: ['#3B82F6', '#10B981'],
  legend: {
    position: 'top'
  },
  tooltip: {
    theme: 'light',
    x: {
      show: true
    },
    y: {
      formatter: function (value) {
        return value.toFixed(0) + ' applications'
      }
    }
  }
});

const chartSeries = ref([
  {
    name: 'Total Applications',
    data: []
  },
  {
    name: 'Approved',
    data: []
  }
]);

// Helper function to group applications by month
const groupApplicationsByMonth = (applications) => {
  const grouped = {};
  const now = new Date();
  const monthsAgo = new Date(now.setMonth(now.getMonth() - 11));

  // Initialize the last 12 months
  for (let d = new Date(monthsAgo); d <= new Date(); d.setMonth(d.getMonth() + 1)) {
    const monthYear = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    grouped[monthYear] = {
      total: 0,
      approved: 0,
      regretted: 0,
      processing: 0
    };
  }

  // Fill in actual values
  applications.forEach(app => {
    const date = new Date(app.created_at);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });

    if (grouped[monthYear]) {
      grouped[monthYear].total++;

      switch (app.status) {
        case 'approved':
          grouped[monthYear].approved++;
          break;
        case 'regretted':
          grouped[monthYear].regretted++;
          break;
        case 'processing':
          grouped[monthYear].processing++;
          break;
      }
    }
  });

  return grouped;
};

// Update chart data
const updateChartData = () => {
  if (!isChartReady.value) return;

  const groupedData = groupApplicationsByMonth(applications.value);
  const months = Object.keys(groupedData);
  const totalCounts = months.map(month => groupedData[month].total);
  const approvedCounts = months.map(month => groupedData[month].approved);

  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      ...chartOptions.value.xaxis,
      categories: months
    }
  };

  chartSeries.value = [
    {
      name: 'Total Applications',
      data: totalCounts
    },
    {
      name: 'Approved',
      data: approvedCounts
    }
  ];
};

// Watch for data changes and update chart
watchEffect(() => {
  if (applications.value.length > 0 && !isLoading.value) {
    isChartReady.value = true;
    updateChartData();
  }
});

// Load applications
const loadApplications = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const params = {
      applicant: user.id,
      ordering: '-created_at'
    };

    const response = await apiService.getRecognitionOfQualifications(params);
    applications.value = response.data.results.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

  } catch (err) {
    console.error('Error loading applications:', err);
    error.value = 'Failed to load application data. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadApplications();
});
</script>../../../common/ROQ/ROQStatsCard.vue../../../common/ROQ/ROQStatusCard.vue
