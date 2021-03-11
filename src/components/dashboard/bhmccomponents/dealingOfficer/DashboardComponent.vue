<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Dashboard Header - Simplified and less colorful -->
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-2xl p-8 mb-8 shadow-sm border-b border-gray-200">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-semibold text-gray-800 mb-1">Dealing Officer Dashboard</h1>
            <p class="text-gray-600 text-sm">Overview of registration, renewals, and CPD management</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-gray-100 rounded-lg py-2 px-4 text-gray-700">
              <div class="text-xs text-gray-500">Today</div>
              <div class="font-medium">{{ currentDate }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Summary Stats - Less colorful -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        <div v-for="(stat, index) in quickStats" :key="index"
          class="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow duration-200 border border-gray-100">
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-700">
              <component :is="getIconComponent(stat.icon)" class="h-5 w-5" />
            </div>
          </div>
          <div>
            <p class="text-gray-500 text-sm">{{ stat.title }}</p>
            <p class="text-xl font-bold text-gray-800">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Priority Tasks - Removed urgency keywords, simplified styling -->
      <div class="bg-white rounded-xl p-6 shadow-md mb-8 border border-gray-100">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-xl font-semibold text-gray-900">Priority Tasks</h2>
          <div class="flex space-x-2">
            <button
              class="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors">
              View All
            </button>
            <button
              class="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors">
              Sort
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="task in priorityTasks" :key="task.id"
            class="border rounded-xl p-5 flex flex-col space-y-3 cursor-pointer hover:shadow-md transform hover:-translate-y-1 transition-all duration-200 border-gray-100"
            @click="navigateToTask(task)">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="bg-gray-100 text-gray-700 p-2 rounded-lg">
                  <component :is="getIconComponent(task.icon)" class="h-5 w-5" />
                </div>
                <p class="font-medium text-gray-800">{{ task.title }}</p>
              </div>
              <!-- Urgency Badge Removed -->
            </div>
            <div class="flex justify-between items-center">
              <p class="text-2xl font-bold text-gray-800">{{ task.pending_Counts }}</p>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Overview - Less colorful cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Pending Reviews Card -->
        <div
          class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
          <div class="flex items-center space-x-4 mb-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-gray-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512m0 6.375V19.5a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021 19.5V12.417m-9 .375a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Pending Reviews</h3>
              <div class="flex items-baseline">
                <p class="text-2xl font-bold text-blue-600">{{ stats.pendingReviews }}</p>
                <span class="ml-2 text-sm text-gray-500">applications</span>
              </div>
            </div>
          </div>

          <!-- Mini progress bars - Gray background, blue progress -->
          <div class="mt-4 space-y-3">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">New Registrations</span>
                <span class="font-medium">{{ stats.newRegistrations }}</span>
              </div>
              <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="bg-blue-500 h-2 rounded-full"
                  :style="{ width: stats.pendingReviews > 0 ? `${(stats.newRegistrations / stats.pendingReviews) * 100}%` : '0%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Renewals</span>
                <span class="font-medium">{{ stats.renewals }}</span>
              </div>
              <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="bg-blue-400 h-2 rounded-full"
                  :style="{ width: stats.pendingReviews > 0 ? `${(stats.renewals / stats.pendingReviews) * 100}%` : '0%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Additional Qualifications</span>
                <span class="font-medium">{{ stats.additionalQuals }}</span>
              </div>
              <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="bg-blue-300 h-2 rounded-full"
                  :style="{ width: stats.pendingReviews > 0 ? `${(stats.additionalQuals / stats.pendingReviews) * 100}%` : '0%' }"></div>
              </div>
            </div>
          </div>

          <div class="mt-5 text-right">
            <button class="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center justify-end w-full">
              View all applications
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- CPD Activities Card - Less colorful -->
        <!-- Improved CPD Activities Card -->
<div class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 transform hover:-translate-y-1 transition-transform">
  <!-- Header Section -->
  <div class="flex items-center space-x-4 mb-6">
    <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 text-green-600 shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001l-.628-.349m-1.263-.52V4.046c0-1.26-1.517-1.867-2.583-1.513m-3.764 1.088c-1.031.888-1.951 2.274-2.227 4.141m-1.29-3.801c-.051.49-.186 1.08-1.504 1.979m9.583-.302v.003h4.992M15 6.75a3.75 3.75 0 11-7.5 0 3.75 0 017.5 0z" />
      </svg>
    </div>
    <div>
      <h3 class="text-lg font-semibold text-gray-900">CPD Activities</h3>
      <div class="flex items-baseline">
        <p class="text-2xl font-bold text-green-600">{{ stats.pendingCPD }}</p>
        <span class="ml-2 text-sm text-gray-500">pending review</span>
      </div>
    </div>
  </div>

  <!-- CPD Distribution Chart Section -->
  <div class="flex items-center space-x-6 mt-8">
    <div class="w-20 h-20 relative">
      <svg viewBox="0 0 36 36" class="w-full h-full">
        <path class="stroke-none fill-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        <path class="stroke-none fill-green-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" :stroke-dasharray="`${stats.cpdPercentage}, 100`" />
        <text x="18" y="20.5" class="fill-gray-800 font-medium text-[10px]" text-anchor="middle">{{ stats.cpdPercentage }}%</text>
      </svg>
    </div>
    <div class="flex-1 space-y-3">
      <div class="flex justify-between text-sm items-center">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-green-500 inline-block mr-2"></span>
          <span class="text-gray-600">Self-Directed</span>
        </span>
        <span class="font-medium text-gray-800">{{ stats.selfDirectedCPD }}</span>
      </div>
      <div class="flex justify-between text-sm items-center">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-green-200 inline-block mr-2"></span>
          <span class="text-gray-600">Program Approvals</span>
        </span>
        <span class="font-medium text-gray-800">{{ stats.programApprovals }}</span>
      </div>
    </div>
  </div>

  <!-- Footer Section -->
  <div class="mt-10 text-right">
    <button class="text-green-600 text-sm font-semibold hover:text-green-800 flex items-center justify-end w-full transition-colors duration-200">
      Manage CPD activities
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</div>

        <!-- CoGS Requests Card - Less colorful gauge -->
        <div
          class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
          <div class="flex items-center space-x-4 mb-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-gray-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">CoGS Requests</h3>
              <div class="flex items-baseline">
                <p class="text-2xl font-bold text-purple-600">{{ stats.cogsRequests }}</p>
                <span class="ml-2 text-sm text-gray-500">pending</span>
              </div>
            </div>
          </div>

        <!-- Semi-circular gauge - Gray and Purple tones -->
<div class="mt-4 flex flex-col items-center">
  <div class="relative w-32 h-16 mb-2">
    <svg class="w-full h-full" viewBox="0 0 100 50">
      <!-- Base gray track -->
      <path
        d="M5,50 A45,45 0 0,1 95,50"
        class="stroke-gray-200 fill-none"
        stroke-width="10"
        stroke-linecap="round"
      />

      <!-- Purple progress indicator -->
      <path
        d="M5,50 A45,45 0 0,1 95,50"
        class="stroke-purple-500 fill-none"
        stroke-width="10"
        stroke-linecap="round"
        :stroke-dasharray="90"
        :stroke-dashoffset="90 - (90 * stats.cogsCompletionRate / 100)"
      />
    </svg>
    <div class="absolute bottom-0 left-0 right-0 text-center text-purple-700 font-bold text-lg">
      {{ stats.cogsCompletionRate }}%
    </div>
  </div>
  <p class="text-sm text-gray-600 font-medium">Processing Rate</p>
</div>

          <div class="mt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Completed Today</span>
              <span class="font-medium">12</span> <!-- //TODO: Dynamic data if available -->
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Avg. Processing Time</span>
              <span class="font-medium">2.3 days</span><!-- //TODO: Dynamic data if available -->
            </div>
          </div>

          <div class="mt-5 text-right">
            <button
              class="text-purple-600 text-sm font-medium hover:text-purple-800 flex items-center justify-end w-full">
              Process CoGS requests
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Activity Timeline - Still placeholder data -->
      <div class="bg-white rounded-xl p-6 shadow-md mb-8 border border-gray-100">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <button class="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors">
            View All
          </button>
        </div>

        <div class="relative">
          <div class="absolute top-0 left-4 w-px h-full bg-gray-200"></div>
          <div class="space-y-4">
            <div v-for="(activity, index) in recentActivities" :key="index" class="ml-10 relative">
              <div class="absolute -left-10 top-1 w-6 h-6 rounded-full flex items-center justify-center bg-gray-200"> <!-- Neutral dot color -->
                <component :is="getIconComponent(activity.icon)" class="h-3 w-3 text-gray-700" /> <!-- Neutral icon color -->
              </div>
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200"> <!-- Added border for definition -->
                <div class="flex justify-between">
                  <h4 class="font-medium text-gray-800">{{ activity.title }}</h4>
                  <span class="text-xs text-gray-500">{{ activity.time }}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
                <div v-if="activity.actionable" class="mt-2">
                  <button class="text-xs text-blue-600 hover:text-blue-800 font-medium">View details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Applications Table -->
      <div class="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-xl font-semibold text-gray-900">Recent Applications</h2>
          <div class="flex space-x-2">
            <div class="relative">
              <input type="text" placeholder="Search..."
                class="text-sm border border-gray-300 rounded-lg pl-8 py-1.5 pr-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 absolute left-2.5 top-2"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <button
              class="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors">
              Filter
            </button>
          </div>
        </div>

        <DashboardTableRecentApp />
      </div>
    </div>
  </div>
</template>

<script setup>
import DashboardTableRecentApp from './DashboardTableRecentApp.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiservice from '@/services/bmhcservices';
import {
  DocumentTextIcon,
  AcademicCapIcon,
  DocumentCheckIcon,
  CogIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();

const currentDate = ref(new Date().toLocaleDateString('en-US', {
  weekday: 'short', month: 'short', day:
    'numeric'
}));

const iconMap = {
  DocumentTextIcon: DocumentTextIcon,
  AcademicCapIcon: AcademicCapIcon,
  DocumentCheckIcon: DocumentCheckIcon,
  CogIcon: CogIcon,
  ClipboardDocumentCheckIcon: ClipboardDocumentCheckIcon,
  UserGroupIcon: UserGroupIcon,
  CalendarIcon: CalendarIcon,
  ChartBarIcon: ChartBarIcon
};

const getIconComponent = (iconName) => {
  return iconMap[iconName] || null;
};

const pendingApplicationCount = ref(0);
const pendingPhysicalCount = ref(0);
const pendingCpdCount = ref(0);
const pendingCogsCount = ref(0);
const totalApplicationsCount = ref(0);
const approvedApplicationsTodayCount = ref(0);

const quickStats = computed(() => [
  {
    title: 'Total Applications',
    value: totalApplicationsCount.value.toLocaleString(),
    icon: 'DocumentTextIcon',
  },
  {
    title: 'Approved Today',
    value: approvedApplicationsTodayCount.value.toLocaleString(),
    icon: 'ClipboardDocumentCheckIcon',
  },
  {
    title: 'Active Practitioners', // //TODO: Need API endpoint for dynamic data
    value: '5', // Static Value - Dynamic value needs a dedicated API
    icon: 'UserGroupIcon',
  },
  {
    title: 'Pending Renewals', // Approximation - see notes
    value: pendingApplicationCount.value.toLocaleString(),
    icon: 'CalendarIcon',
  }
]);

const priorityTasks = ref([
  {
    id: 1,
    title: 'Application Registration',
    pending_Counts: 0,
    urgency: 'high', // Kept for internal logic if needed, but not displayed
    icon: 'DocumentTextIcon',
    route: '/admin/dealing_officer/health_certification/application_lists'
  },
  {
    id: 2,
    title: 'CPD Program Approval',
    pending_Counts: 0,
    urgency: 'critical', // Kept for internal logic if needed, but not displayed
    icon: 'AcademicCapIcon',
    route: '/admin/dealing_officer/health_certification/cpd_management'
  },
  {
    id: 3,
    title: 'Verify Documents',
    pending_Counts: 0,
    urgency: 'medium', // Kept for internal logic if needed, but not displayed
    icon: 'DocumentCheckIcon',
    route: '/admin/dealing_officer/health_certification/application_lists'
  },
  {
    id: 4,
    title: 'Process CoGS Request',
    pending_Counts: 0,
    urgency: 'high', // Kept for internal logic if needed, but not displayed
    icon: 'CogIcon',
    route: '/admin/dealing_officer/health_certification/cogs'
  }
]);

const recentActivities = ref([ // Still Placeholder Data - Requires API
  {
    title: 'New Registration Submitted',
    description: 'John Smith submitted an application for Medical Laboratory Technologist registration.',
    time: '10 minutes ago',
    icon: 'DocumentTextIcon',
    actionable: true
  },
  {
    title: 'CPD Program Approved',
    description: 'You approved "Advanced Diagnostic Techniques" program for 15 CPD credits.',
    time: '1 hour ago',
    icon: 'AcademicCapIcon',
    actionable: true
  },
  {
    title: 'Document Verification Pending',
    description: '3 applicants have uploaded new documents for verification.',
    time: '3 hours ago',
    icon: 'DocumentCheckIcon',
    actionable: true
  },
  {
    title: 'Registration Renewed',
    description: 'Sarah Johnson\'s registration was successfully renewed for another year.',
    time: 'Yesterday',
    icon: 'ClipboardDocumentCheckIcon',
    actionable: false
  }
]);

const stats = computed(() => {
  const totalPendingReviews = pendingApplicationCount.value + pendingPhysicalCount.value;
  const newRegistrations = Math.round(pendingApplicationCount.value * 0.65);
  const renewals = Math.round(pendingApplicationCount.value * 0.25);
  const additionalQuals = Math.round(pendingApplicationCount.value * 0.10);
  const selfDirectedCPD = Math.round(pendingCpdCount.value * 0.7);
  const programApprovals = Math.round(pendingCpdCount.value * 0.3);
  const cpdPercentage = pendingCpdCount.value > 0 ? Math.round((selfDirectedCPD / pendingCpdCount.value) * 100) : 0;

  return {
    pendingReviews: totalPendingReviews,
    newRegistrations: newRegistrations,
    renewals: renewals,
    additionalQuals: additionalQuals,
    pendingCPD: pendingCpdCount.value,
    selfDirectedCPD: selfDirectedCPD,
    programApprovals: programApprovals,
    cogsRequests: pendingCogsCount.value,
    cogsCompletionRate: 68, // Static Value - Dynamic rate needs more data
    cpdPercentage: cpdPercentage
  };
});

onMounted(async () => {
  try {
    const applicantsResponse = await apiservice.getBhmcNewQualifications();
    const applicantsData = applicantsResponse.data.results || [];

    totalApplicationsCount.value = applicantsData.length;
    approvedApplicationsTodayCount.value = applicantsData.filter(app => app.application_review_status === 'Approved').length;

    pendingApplicationCount.value = applicantsData.filter(app => app.application_review_status === 'Pending').length;
    pendingPhysicalCount.value = applicantsData.filter(app => app.physical_review_status === 'Pending').length;

    priorityTasks.value[0].pending_Counts = pendingApplicationCount.value;

    const cpdRecordsResponse = await apiservice.getBmhcCpdRecords();
    const cpdData = cpdRecordsResponse.data.results || [];
    pendingCpdCount.value = cpdData.filter(cpd => cpd.review_status === 'Pending').length;
    priorityTasks.value[1].pending_Counts = pendingCpdCount.value;

    priorityTasks.value[2].pending_Counts = pendingPhysicalCount.value;

    const cogsRecordsResponse = await apiservice.getBmhcCogs();
    const cogsData = cogsRecordsResponse.data.results || [];
    pendingCogsCount.value = cogsData.filter(cogs => cogs.review_status === 'Pending').length;
    priorityTasks.value[3].pending_Counts = pendingCogsCount.value;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const navigateToTask = (task) => {
  router.push(task.route);
};
</script>

<style scoped>
/* Optional: Add these styles if you want smooth transitions - kept for consistency */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Optional: Custom scrollbar - kept for consistency */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
