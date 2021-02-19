<template>
  <div class="space-y-6">
    <!-- Provider Profile Banner -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="bg-purple-100 p-4 rounded-full">
            <Building2 class="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h2 class="text-xl font-bold">{{ providerDetail.name }}</h2>
            <p class="text-gray-600">Provider ID: {{ providerDetail.id }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button class="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus class="w-4 h-4" />
            <span>New Program</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="(stat, index) in keyStats" :key="index"
        class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div class="flex items-center space-x-3">
          <div :class="[
            'p-2 rounded-full',
            stat.bgColor
          ]">
            <component :is="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
          </div>
          <div>
            <p class="text-gray-600 text-sm">{{ stat.label }}</p>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
          </div>
        </div>
        <div class="mt-2">
          <span :class="[
            'text-sm',
            stat.trend > 0 ? 'text-green-600' : 'text-red-600'
          ]">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}% from last month
          </span>
        </div>
      </div>
    </div>

    <!-- Active Programs and Analytics -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Active Programs -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-semibold text-lg">Active Programs</h3>
          <button class="text-purple-600 text-sm hover:text-purple-700">View All</button>
        </div>
        <div class="space-y-4">
          <div v-for="program in activePrograms" :key="program.id" class="border-b last:border-0 pb-4 last:pb-0">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium">{{ program.title }}</h4>
                <p class="text-sm text-gray-500">{{ program.date }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <span class="flex items-center text-sm text-gray-600">
                    <Users class="w-4 h-4 mr-1" />
                    {{ program.participants }} enrolled
                  </span>
                  <span class="flex items-center text-sm text-gray-600">
                    <Award class="w-4 h-4 mr-1" />
                    {{ program.credits }} CPD credits
                  </span>
                </div>
              </div>
              <span :class="[
                'px-2 py-1 rounded-full text-xs',
                program.status === 'In Progress' ? 'bg-green-100 text-green-800' :
                  program.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
              ]">
                {{ program.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Analytics -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="font-semibold text-lg mb-6">Monthly Analytics</h3>
        <div class="space-y-4">
          <div v-for="metric in monthlyMetrics" :key="metric.label" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">{{ metric.label }}</span>
              <span class="font-medium">{{ metric.value }}</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div class="h-2 rounded-full" :class="metric.color" :style="{ width: `${metric.percentage}%` }">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities and Upcoming Schedule -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Recent Activities -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="font-semibold text-lg mb-4">Recent Activities</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
            <div :class="[
              'p-2 rounded-full',
              activity.type === 'approval' ? 'bg-green-100' :
                activity.type === 'submission' ? 'bg-blue-100' :
                  'bg-purple-100'
            ]">
              <component :is="activity.icon" class="w-4 h-4" :class="activity.type === 'approval' ? 'text-green-500' :
                activity.type === 'submission' ? 'text-blue-500' :
                  'text-purple-500'" />
            </div>
            <div>
              <p class="text-sm font-medium">{{ activity.title }}</p>
              <p class="text-xs text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Schedule -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="font-semibold text-lg mb-4">Upcoming Schedule</h3>
        <div class="space-y-4">
          <div v-for="event in upcomingSchedule" :key="event.id" class="flex items-start space-x-3">
            <div class="bg-gray-100 p-2 rounded text-center min-w-[3rem]">
              <span class="text-sm font-bold block">{{ event.day }}</span>
              <span class="text-xs text-gray-600">{{ event.month }}</span>
            </div>
            <div>
              <h4 class="font-medium">{{ event.title }}</h4>
              <p class="text-sm text-gray-600">{{ event.time }}</p>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-xs bg-gray-100 px-2 py-1 rounded">
                  {{ event.duration }}
                </span>
                <span class="text-xs bg-gray-100 px-2 py-1 rounded">
                  {{ event.participants }} registered
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue';
import {
  Building2,
  Users,
  Award,
  Calendar,
  TrendingUp,
  // UserCheck,
  Plus,
  CheckCircle,
  // FileText,
} from 'lucide-vue-next';
import bmhcService from '@/services/bmhcservices';

// State Management
const applications = ref([]);
const isLoading = ref(false);
const error = ref(null);

// Get user data from localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}');

const providerDetail = {
  id: user?.id || "",
  name: user?.institution || "Medical Training Institute",
  status: "Active"
};

// Fetch applications from API
const fetchApplications = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await bmhcService.getBmhcInstitutes();
    applications.value = response.data.results;
  } catch (err) {
    console.error('Error fetching applications:', err);
    error.value = 'Failed to load applications';
  } finally {
    isLoading.value = false;
  }
};

// Filter applications by current user's CID
const userApplications = computed(() => {
  return applications.value.filter(app => app.CID === user.cid);
});

// Key Statistics
const keyStats = computed(() => {
  const totalApps = userApplications.value.length;
  const eoiApps = userApplications.value.filter(app => !app.dpr_name || app.dpr_name === '').length;
  const dprApps = userApplications.value.filter(app => app.dpr_name && app.dpr_name !== '').length;
  const approvedApps = userApplications.value.filter(app =>
    app.review_decision === 'Approved' || app.do_dpr_review_decision === 'Approved'
  ).length;

  return [
    {
      label: "Total Programs",
      value: totalApps.toString(),
      trend: 0,
      icon: Calendar,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-500'
    },
    {
      label: "EOI Applications",
      value: eoiApps.toString(),
      trend: 0,
      icon: Users,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500'
    },
    {
      label: "DPR Applications",
      value: dprApps.toString(),
      trend: 0,
      icon: Award,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-500'
    },
    {
      label: "Approved",
      value: approvedApps.toString(),
      trend: 0,
      icon: TrendingUp,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-500'
    }
  ];
});

// Active Programs (Latest 3 applications)
const activePrograms = computed(() => {
  return userApplications.value
    .slice()
    .sort((a, b) => new Date(b.commencement_date) - new Date(a.commencement_date))
    .slice(0, 3)
    .map(app => ({
      id: app.id,
      title: app.name_of_institution,
      date: new Date(app.commencement_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      participants: app.course_duration,
      credits: app.type_of_programme === 'D' ? 'Diploma' : 'Bachelor',
      status: app.dpr_name ? app.do_dpr_review_decision : app.review_decision
    }));
});

// Monthly Analytics
const monthlyMetrics = computed(() => {
  const total = userApplications.value.length;
  if (total === 0) return [];

  const approved = userApplications.value.filter(app =>
    app.review_decision === 'Approved' || app.do_dpr_review_decision === 'Approved'
  ).length;

  const pending = userApplications.value.filter(app =>
    app.review_decision === 'Pending' || app.do_dpr_review_decision === 'Pending'
  ).length;

  return [
    {
      label: "Program Completion Rate",
      value: `${Math.round((approved / total) * 100)}%`,
      percentage: Math.round((approved / total) * 100),
      color: "bg-green-500"
    },
    {
      label: "Pending Applications",
      value: `${Math.round((pending / total) * 100)}%`,
      percentage: Math.round((pending / total) * 100),
      color: "bg-blue-500"
    }
  ];
});

// Recent Activities
const recentActivities = computed(() => {
  return userApplications.value
    .map(app => ({
      id: app.id,
      type: app.dpr_name ? 'dpr' : 'eoi',
      icon: CheckCircle,
      title: `${app.dpr_name ? 'DPR' : 'EOI'} Application submitted for ${app.name_of_institution}`,
      time: new Date(app.commencement_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }))
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 4);
});

// Upcoming Schedule (using commencement dates)
const upcomingSchedule = computed(() => {
  return userApplications.value
    .filter(app => new Date(app.commencement_date) > new Date())
    .sort((a, b) => new Date(a.commencement_date) - new Date(b.commencement_date))
    .slice(0, 3)
    .map(app => {
      const date = new Date(app.commencement_date);
      return {
        id: app.id,
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        title: app.name_of_institution,
        time: `Course Duration: ${app.course_duration} months`,
        duration: app.type_of_programme === 'D' ? 'Diploma' : 'Bachelor',
        participants: 'Pending Approval'
      };
    });
});

// Initialize data on component mount
onMounted(() => {
  fetchApplications();
});
</script>