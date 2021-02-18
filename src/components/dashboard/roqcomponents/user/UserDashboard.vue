<template>
  <div class="space-y-6">
    <!-- Enhanced Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
        <StatsCard title="Total Applied" :count="stats.totalApplied" :icon="FileText" color="blue"
          trend="+12% from last month" />
        <StatsCard title="Success Rate" :count="`${successRate}%`" :icon="TrendingUp" color="emerald"
          trend="Based on approved applications" />
      </div>
      <div class="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
        <StatsCard title="Avg. Processing Time"
          :count="`${avgProcessingTime.days} days ${avgProcessingTime.hours} hours ${avgProcessingTime.seconds} seconds`"
          :icon="Clock" color="purple" trend="Based on Days hours and Seconds " class="text-xl mb-2" />
        <StatsCard title="Total Drafts" :count="stats.totalDraft" :icon="Pencil" color="amber" trend="Draft" />
      </div>
    </div>

    <!-- Application Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatusCard title="Approved" :count="stats.totalApproved" :icon="CheckCircle" color="green"
        :percentage="(stats.totalApproved / stats.totalApplied) * 100" />
      <StatusCard title="Pending" :count="stats.totalPending" :icon="Clock" color="yellow"
        :percentage="(stats.totalPending / stats.totalApplied) * 100" />
      <StatusCard title="Regretted" :count="stats.totalRegretted" :icon="XCircle" color="red"
        :percentage="(stats.totalRegretted / stats.totalApplied) * 100" />
    </div>

    <!-- Timeline Chart -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold mb-4">Application Timeline</h3>
      <div class="h-[350px]">
        <VueApexCharts :options="chartOptions" :series="chartSeries" height="100%" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import StatsCard from '../../../common/ROQStatsCard.vue';
import StatusCard from '../../../common/ROQStatusCard.vue';
import { FileText, CheckCircle, XCircle, Clock, TrendingUp, Pencil } from 'lucide-vue-next';
import VueApexCharts from 'vue3-apexcharts'
import apiService from '@/services/services';

const { user } = useAuthStore();
const applications = ref([]);

// Compute statistics
const stats = computed(() => ({
  totalApplied: applications.value.filter(app => app.status === 'applied').length,
  totalApproved: applications.value.filter(app => app.status === 'approved').length,
  totalRegretted: applications.value.filter(app => app.status === 'regretted').length,
  totalPending: applications.value.filter(app => app.status === 'applied').length,
  totalDraft: applications.value.filter(app => app.status === 'draft').length,
}));

// Calculate average processing time
const avgProcessingTime = computed(() => {
  if (applications.value.length === 0) return { days: 0, hours: 0, seconds: 0 };
  const totalProcessingTime = applications.value.reduce((acc, app) => {
    const createdAt = new Date(app.created_at);
    const updatedAt = new Date(app.updated_at);
    const processingTime = (updatedAt - createdAt); // Time in milliseconds
    return acc + processingTime;
  }, 0);
  const avgProcessingTimeMs = totalProcessingTime / applications.value.length;
  const days = Math.floor(avgProcessingTimeMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((avgProcessingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const seconds = Math.floor((avgProcessingTimeMs % (1000 * 60 * 60)) / 1000);
  return { days, hours, seconds };
});

const successRate = computed(() => {
  if (applications.value.length === 0) return 0;
  return ((stats.value.totalApproved / applications.value.length) * 100).toFixed(1);
});

// Chart configuration
const chartOptions = ref({
  chart: {
    height: 350,
    type: 'bar',
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
    width: 3
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
  }
});

const chartSeries = ref([
  {
    name: 'Applied',
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
  applications.forEach(app => {
    const date = new Date(app.created_at);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const monthYear = `${month} ${year}`;
    if (!grouped[monthYear]) {
      grouped[monthYear] = { applications: 0, approved: 0 };
    }
    if (app.status === 'applied') {
      grouped[monthYear].applications += 1;
    }
    if (app.status === 'approved') {
      grouped[monthYear].approved += 1;
    }
  });

  // Sort the grouped data based on the date and return the sorted grouped object
  const sortedGrouped = Object.keys(grouped)
    .sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);

      return dateA - dateB;
    })
    .reduce((obj, key) => {
      obj[key] = grouped[key];
      return obj;
    }, {});

  return sortedGrouped;
};

// Update chart data
const updateChartData = () => {
  const groupedData = groupApplicationsByMonth(applications.value);
  const months = Object.keys(groupedData);
  const applicationCounts = months.map(month => groupedData[month].applications);
  const approvedCounts = months.map(month => groupedData[month].approved);

  // Update the chart options and series
  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      ...chartOptions.value.xaxis,
      categories: months
    }
  };

  chartSeries.value = [
    {
      name: 'Applied',
      data: applicationCounts
    },
    {
      name: 'Approved',
      data: approvedCounts
    }
  ];
};

// Load applications
const loadApplications = async () => {
  try {
    const response = await apiService.getRecognitionOfQualifications();
    applications.value = response.data.results.filter(app => app.applicant === user.id);
    updateChartData();
  } catch (error) {
    console.error('Error loading applications:', error);
  }
};

onMounted(() => {
  loadApplications();
});
</script>
