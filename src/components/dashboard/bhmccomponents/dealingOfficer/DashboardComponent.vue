<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Dashboard Header -->
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10 shadow-md">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dealing Officer Dashboard</h1>
            <p class="text-gray-600">Overview of registration, renewals, and CPD management</p>
          </div>
        </div>
      </div>

      <!-- Priority Tasks -->
      <div class="bg-white rounded-xl p-6 shadow-md mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Priority Tasks</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="task in priorityTasks" :key="task.id"
            class="border rounded-lg p-4 flex items-center space-x-3 cursor-pointer"
            :class="getTaskUrgencyClass(task.urgency)" @click="navigateToTask(task)">
            <div class="flex-shrink-0">
              <!--  Use dynamic import or a mapping for the icons -->
              <component :is="getIconComponent(task.icon)" class="h-6 w-6" />
            </div>
            <div class="flex-1">
              <p class="font-medium">{{ task.title }}</p>
              <p class="text-sm">{{ task.pending_Counts }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Pending Reviews Card -->
        <div class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 text-blue-600">
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
          <div class="mt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">New Registrations</span>
              <span class="font-medium">{{ stats.newRegistrations }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Renewals</span>
              <span class="font-medium">{{ stats.renewals }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Additional Qualifications</span>
              <span class="font-medium">{{ stats.additionalQuals }}</span>
            </div>
          </div>
        </div>

        <!-- CPD Activities Card -->
        <div class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001l-.628-.349m-1.263-.52V4.046c0-1.26-1.517-1.867-2.583-1.513m-3.764 1.088c-1.031.888-1.951 2.274-2.227 4.141m-1.29-3.801c-.051.49-.186 1.08-1.504 1.979m9.583-.302v.003h4.992M15 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
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
          <div class="mt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Self-Directed</span>
              <span class="font-medium">{{ stats.selfDirectedCPD }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Program Approvals</span>
              <span class="font-medium">{{ stats.programApprovals }}</span>
            </div>
          </div>
        </div>

        <!-- CoGS Requests Card -->
        <div class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-100 text-purple-600">
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
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-purple-600 h-2 rounded-full" :style="{ width: `${stats.cogsCompletionRate}%` }"></div>
            </div>
            <div class="flex justify-between mt-2 text-sm text-gray-600">
              <span>Processing Rate</span>
              <span>{{ stats.cogsCompletionRate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Applications Table -->
      <DashboardTableRecentApp />
    </div>
  </div>
</template>

<script setup>
import DashboardTableRecentApp from './DashboardTableRecentApp.vue'; // Ensure correct import
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiservice from '@/services/bmhcservices'; // Ensure correct import

// --- Icon Imports (Heroicons example) ---
// You'll need to install heroicons:  npm install @heroicons/vue
import { DocumentTextIcon, AcademicCapIcon, DocumentCheckIcon, CogIcon } from '@heroicons/vue/24/outline';

const router = useRouter();

// --- Icon Mapping ---
const iconMap = {
  DocumentTextIcon: DocumentTextIcon,
  AcademicCapIcon: AcademicCapIcon,
  DocumentCheckIcon: DocumentCheckIcon,
  CogIcon: CogIcon,
};

const getIconComponent = (iconName) => {
  return iconMap[iconName] || null; // Returns null if not found
};

// --- Refs for counts ---
const pendingApplicationCount = ref(0);
const pendingPhysicalCount = ref(0);
const pendingCpdCount = ref(0);
const pendingCogsCount = ref(0);

// --- Priority Tasks (Using Option 1: Direct Mapping in onMounted) ---
const priorityTasks = ref([
  {
    id: 1,
    title: 'Application Registration',
    pending_Counts: 0,
    urgency: 'high',
    icon: 'DocumentTextIcon', // Use string names now
    route: '/admin/dealing_officer/health_certification/application_lists'
  },
  {
    id: 2,
    title: 'CPD Program Approval',
    pending_Counts: 0,
    urgency: 'critical',
    icon: 'AcademicCapIcon', // Use string names now
    route: '/admin/dealing_officer/health_certification/cpd_management'
  },
  {
    id: 3,
    title: 'Verify Documents',
    pending_Counts: 0,
    urgency: 'medium',
    icon: 'DocumentCheckIcon', // Use string names now
    route: '/admin/dealing_officer/health_certification/application_lists'
  },
  {
    id: 4,
    title: 'Process CoGS Request',
    pending_Counts: 0,
    urgency: 'high',
    icon: 'CogIcon', // Use string names now
    route: '/admin/dealing_officer/health_certification/cogs'
  }
]);

// Stats data (using computed properties for derived values)
const stats = computed(() => ({
  pendingReviews: pendingApplicationCount.value + pendingPhysicalCount.value,
  newRegistrations: 0, // Replace with your calculation, based on API data
  renewals: 0,        // Replace with your calculation
  additionalQuals: 0,  // Replace with your calculation
  pendingCPD: pendingCpdCount.value,
  selfDirectedCPD: 0, //Replace
  programApprovals: 0, //Replace
  cogsRequests: pendingCogsCount.value,
  cogsCompletionRate: 0 //Replace
}));

// Fetch data on mounted
onMounted(async () => {
  try {
    const applicantsResponse = await apiservice.getBhmcNewQualifications();
    const applicantsData = applicantsResponse.data.results || [];

    pendingApplicationCount.value = applicantsData.filter(app => app.application_review_status === 'Pending').length;
    pendingPhysicalCount.value = applicantsData.filter(app => app.physical_review_status === 'Pending').length;

    const cpdRecordsResponse = await apiservice.getBmhcCpdRecords();
    const cpdData = cpdRecordsResponse.data.results || [];
    pendingCpdCount.value = cpdData.filter(cpd => cpd.review_status === 'Pending').length;

    const cogsRecordsResponse = await apiservice.getBmhcCogs();
    const cogsData = cogsRecordsResponse.data.results || [];
    pendingCogsCount.value = cogsData.filter(cogs => cogs.review_status === 'Pending').length;

    // Update priorityTasks pending_Counts (Option 1: Direct Mapping)
    priorityTasks.value[0].pending_Counts = pendingApplicationCount.value;
    priorityTasks.value[1].pending_Counts = pendingCpdCount.value;
    priorityTasks.value[2].pending_Counts = pendingPhysicalCount.value;
    priorityTasks.value[3].pending_Counts = pendingCogsCount.value;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Navigation function
const navigateToTask = (task) => {
  router.push(task.route);
};

// Utility functions for styling (no changes here)
const getTaskUrgencyClass = (urgency) => {
  const classes = {
    critical: 'border-red-500 bg-red-50',
    high: 'border-orange-500 bg-orange-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-green-500 bg-green-50'
  };
  return classes[urgency] || classes.medium;
};


</script>
