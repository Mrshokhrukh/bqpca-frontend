<template>
  <div class="space-y-6">
    <!-- Enhanced Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
        <StatsCard title="Total Applications" :count="stats.totalApplications" :icon="FileText" color="blue"
          trend="+10% from last week" />
        <StatsCard title="Avg. Turnaround Time" :count="avgTurnaroundTime" :icon="Clock" color="purple"
          trend="-1 day from last week">
          <div class="mt-2">
            <p class="text-sm text-gray-500">Based on completed applications</p>
          </div>
        </StatsCard>
      </div>
      <div class="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
        <StatsCard title="Applications Pending" :count="stats.pending" :icon="Hourglass" color="yellow"
          trend="Waiting for review" />
        <StatsCard title="Applications Under Review" :count="stats.underReview" :icon="Eye" color="teal"
          trend="Currently being processed" />
      </div>
    </div>

    <!-- Application Status Breakdown -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatusCard title="QEC Issued" :count="stats.qecIssued" :icon="CheckCircle" color="green"
        :percentage="calculatePercentage(stats.qecIssued)" />
      <StatusCard title="Suspended Applications" :count="stats.suspend" :icon="PauseCircle" color="amber"
        :percentage="calculatePercentage(stats.suspend)" />
      <StatusCard title="Regretted Applications" :count="stats.regretted" :icon="XCircle" color="red"
        :percentage="calculatePercentage(stats.regretted)" />
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
import StatsCard from '@/components/common/ROQStatsCard.vue';
import StatusCard from '@/components/common/ROQStatusCard.vue'
import VueApexCharts from 'vue3-apexcharts'
import { FileText, Clock, CheckCircle, XCircle, Eye, Hourglass, PauseCircle } from 'lucide-vue-next';
import apiService from '@/services/services';

const applications = ref([]);

const stats = computed(() => {
  const totalApplications = applications.value.length;

  return {
    totalApplications,
    pending: applications.value.filter(app => app.status === 'applied').length,
    underReview: applications.value.filter(app => app.status === 'processing').length, // Updated status
    qecIssued: applications.value.filter(app => app.status === 'approved').length, // Updated Status
    suspend: applications.value.filter(app => app.status === 'reupload').length, // Updated Status
    regretted: applications.value.filter(app => app.status === 'regretted').length, // Updated Status
  };
});


const calculatePercentage = (count) => {
  if (stats.value.totalApplications === 0) return 0
  return (count / stats.value.totalApplications) * 100
};


const avgTurnaroundTime = computed(() => {
  const completedApplications = applications.value.filter(app => app.status === 'approved' || app.status === 'regretted');
  if (completedApplications.length === 0) return 'N/A';

  let totalTimeDiff = 0;
  completedApplications.forEach(app => {
    const createdDate = new Date(app.created_at);
    const completedDate = new Date(app.updated_at);
    totalTimeDiff += (completedDate.getTime() - createdDate.getTime());

  });

  const avgTimeDiffInDays = Math.ceil(totalTimeDiff / completedApplications.length / (1000 * 60 * 60 * 24));
  return `${avgTimeDiffInDays} days`;
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
    name: 'Applications',
    data: []
  },
  {
    name: 'Completed',
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
      grouped[monthYear] = { applications: 0, completed: 0 };
    }
    grouped[monthYear].applications += 1;
    if (app.status === 'approved' || app.status === 'regretted') {
      grouped[monthYear].completed += 1;
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
  const completedCounts = months.map(month => groupedData[month].completed);

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
      name: 'Applications',
      data: applicationCounts
    },
    {
      name: 'Completed',
      data: completedCounts
    }
  ];
};

// Load applications
const loadApplications = async () => {
  try {
    const response = await apiService.getRecognitionOfQualifications();
    applications.value = response.data.results;
    updateChartData();
  } catch (error) {
    console.error('Error loading applications:', error);
  }
};


onMounted(() => {
  loadApplications();
});
</script>
