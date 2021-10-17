<template>
  <div class="min-h-screen">
    <div class="mx-auto p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-1">System-wide statistics and recent activity. </p>
      </header>

      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
        <p class="font-bold"> Error Loading Dashboard </p>
        <p>{{ error }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon="Calendar" :value="stats.totalThisYear" label="Total Applications (This Year)" color="indigo" />
        <StatCard icon="Clock" :value="stats.activeProcesses" label="Active Processes" color="blue" />
        <StatCard icon="CheckCircle" :value="stats.accredited" label="Accredited Institutes" color="green" />
        <StatCard icon="ClipboardCheck" :value="stats.completed" label="Completed Processes" color="gray" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900"> Recent Activity </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference No.
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stage
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated
                  </th>
                  <th scope="col" class="relative px-6 py-3"><span class="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="loading">
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    <div class="flex justify-center items-center">
                      <Loader2 class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" />
                      Loading recent activity...
                    </div>
                  </td>
                </tr>
                <tr v-else-if="recentApplications.length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-500">No applications found in the
                    system.</td>
                </tr>
                <tr v-for="app in recentApplications" :key="app.application_uid">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{
                    app.application_reference_no }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ app.institute_profile_name_display }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="getStatusClass(app.status)">{{ app.status_display }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(app.updated_at) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" @click.prevent="viewApplication(app.id)" class="text-blue-600 hover:text-blue-900">View
                      Details</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <div v-if="loading" class="text-center text-gray-500 py-4">Loading stats...</div>
          <div v-else class="space-y-3">
            <div v-for="status in applicationStatusDistribution" :key="status.name" class="w-full">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">{{ status.name }}</span>
                <span class="text-sm font-medium text-gray-500">{{ status.count }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div :class="status.barClass" class="h-2.5 rounded-full" :style="{ width: status.percentage + '%' }">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/services';
import StatCard from '../admin/StatCard.vue';
import { Calendar, Clock, CheckCircle, ClipboardCheck, Loader2 } from 'lucide-vue-next';

const router = useRouter();

const loading = ref(true);
const error = ref(null);
const stats = ref({ totalThisYear: 0, activeProcesses: 0, accredited: 0, completed: 0 });
const recentApplications = ref([]);

const FINAL_STATUSES = ['approved_accredited', 'approved_conditional', 'rejected_not_accredited', 'closed_withdrawn', 'closed_completed'];

onMounted(() => {
  fetchDashboardData();
});

const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const currentYear = new Date().getFullYear();

    const [
      totalThisYearResponse,
      accreditedResponse,
      allAppsResponse,
    ] = await Promise.all([
      apiService.getAccreditationApplications({ created_at__year: currentYear }),
      apiService.getAccreditationApplications({ status: 'approved_accredited' }),
      apiService.getAccreditationApplications({ limit: 200, ordering: '-updated_at' }),
    ]);

    const allApps = allAppsResponse.data.results;

    stats.value.totalThisYear = totalThisYearResponse.data.count;
    stats.value.accredited = accreditedResponse.data.count;
    stats.value.activeProcesses = allApps.filter(app => !FINAL_STATUSES.includes(app.status)).length;
    stats.value.completed = allApps.filter(app => FINAL_STATUSES.includes(app.status)).length;
    recentApplications.value = allApps.slice(0, 10);

  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    error.value = 'Failed to load dashboard data. The API might be unreachable or an error occurred.';
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const getStatusClass = (status) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const classMap = {
    'initial_app_submitted_heqc_review': 'bg-blue-100 text-blue-800',
    'isar_submitted_heqc_review': 'bg-yellow-100 text-yellow-800',
    'assessment_report_submitted': 'bg-purple-100 text-purple-800',
    'approved_accredited': 'bg-green-100 text-green-800',
    'rejected_not_accredited': 'bg-gray-200 text-gray-800',
    'appealed': 'bg-red-100 text-red-800',
    'site_visit_scheduled': 'bg-teal-100 text-teal-800',
    'draft_initial': 'bg-gray-100 text-gray-700'
  };
  return `${base} ${classMap[status] || 'bg-gray-100 text-gray-800'}`;
};

const viewApplication = (appId) => {
  router.push({
    path: '/admin/dealing_officer/accreditation/isar_reports',
    query: { view: appId }
  });
};

const applicationStatusDistribution = computed(() => {
  if (loading.value || recentApplications.value.length === 0) return [];

  const statusCounts = recentApplications.value.reduce((acc, app) => {
    const displayName = app.status_display || 'Unknown Status';
    acc[displayName] = (acc[displayName] || 0) + 1;
    return acc;
  }, {});

  const total = recentApplications.value.length;
  if (total === 0) return [];

  const barColorMap = {
    'Initial App Submitted (HEQC Review)': 'bg-blue-500',
    'ISAR Submitted (HEQC Review)': 'bg-yellow-500',
    'Assessment Report Submitted': 'bg-purple-500',
    'Approved & Accredited': 'bg-green-500',
    'Rejected / Not Accredited': 'bg-gray-600',
    'Appealed': 'bg-red-500',
    'Site Visit: Scheduled': 'bg-teal-500',
    'Draft Initial Application': 'bg-gray-400',
  };

  return Object.entries(statusCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: (count / total) * 100,
      barClass: barColorMap[name] || 'bg-indigo-500',
    }))
    .sort((a, b) => b.count - a.count);
});
</script>
