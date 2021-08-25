<template>
  <div class="min-h-screen">
    <div class="mx-auto w-full py-10 px-4 sm:px-6 lg:px-8">
      <!-- Use DOPageHeader Component -->
      <DOPageHeader
        title="Dealing Officer Dashboard"
        description="Overview of registration, renewals, and CPD management"
        :show-controls="false"
      />

      <!-- Date Display (Separate from Header) -->
      <div class="flex justify-end mb-8 -mt-4">
        <div
          class="bg-white/60 backdrop-blur-sm rounded-lg py-2 px-5 text-gray-700 shadow-sm border border-gray-200"
        >
          <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Today</div>
          <div class="font-semibold text-gray-800 text-sm">{{ currentDate }}</div>
        </div>
      </div>

      <!-- Quick Summary Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div
          v-for="(stat, index) in quickStats"
          :key="index"
          class="bg-white rounded-2xl p-5 shadow-sm flex items-center space-x-4 border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
          <div class="flex-shrink-0">
            <div
              :class="[
                'flex items-center justify-center h-12 w-12 rounded-xl',
                stat.bgColor || 'bg-blue-100',
                stat.textColor || 'text-blue-600',
              ]"
            >
              <component :is="getIconComponent(stat.icon)" class="h-6 w-6" />
            </div>
          </div>
          <div class="flex-1">
            <p class="text-gray-500 text-sm font-medium truncate">{{ stat.title }}</p>
            <p class="text-2xl font-bold text-gray-800">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Priority Tasks -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold text-gray-800 mb-5 px-1">Priority Tasks</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="task in priorityTasks"
            :key="task.id"
            class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between min-h-[150px]"
            @click="navigateToTask(task)"
          >
            <div>
              <div class="flex items-center space-x-3 mb-3">
                <div
                  :class="[
                    'bg-opacity-10 p-2.5 rounded-lg',
                    task.bgColor || 'bg-blue-100',
                    task.textColor || 'text-blue-600',
                  ]"
                >
                  <component :is="getIconComponent(task.icon)" class="h-5 w-5" />
                </div>
                <p class="font-semibold text-gray-700 text-base">
                  {{ task.title }}
                </p>
              </div>
            </div>
            <div class="flex justify-between items-end mt-2">
              <p class="text-3xl font-bold text-gray-800">
                {{ task.pending_Counts }}
                <span class="text-lg font-medium text-gray-500">Pending</span>
              </p>
              <span
                class="bg-gray-100 text-gray-500 rounded-full p-1.5 hover:bg-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <!-- Pending Reviews Card -->
        <div
          class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col transition-shadow duration-300 hover:shadow-lg"
        >
          <div class="flex items-center space-x-4 mb-5">
            <div
              class="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Pending Reviews</h3>
              <p class="text-2xl font-bold text-blue-600">
                {{ stats.pendingReviews }}
                <span class="text-sm font-medium text-gray-500">applications</span>
              </p>
            </div>
          </div>

          <div class="space-y-4 flex-grow">
            <div v-for="item in pendingReviewDetails" :key="item.label">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">{{ item.label }}</span>
                <span class="font-medium text-gray-800">{{ item.value }}</span>
              </div>
              <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  :class="['h-1.5 rounded-full', item.color]"
                  :style="{
                    width: calculatePercentage(item.value, stats.pendingReviews),
                  }"
                ></div>
              </div>
            </div>
          </div>

          <div class="mt-6 text-right">
            <button
              class="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center justify-end w-full group"
            >
              View all applications
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- CPD Activities Card -->
        <div
          class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col transition-shadow duration-300 hover:shadow-lg"
        >
          <div class="flex items-center space-x-4 mb-5">
            <div
              class="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 text-green-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">CPD Activities</h3>
              <p class="text-2xl font-bold text-green-600">
                {{ stats.pendingCPD }}
                <span class="text-sm font-medium text-gray-500">pending review</span>
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-6 mt-4 flex-grow">
            <div class="w-24 h-24 relative flex-shrink-0">
              <svg viewBox="0 0 36 36" class="w-full h-full">
                <defs>
                  <linearGradient id="cpdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color: #10b981; stop-opacity: 1" />
                    <stop offset="100%" style="stop-color: #6ee7b7; stop-opacity: 1" />
                  </linearGradient>
                </defs>
                <path
                  class="stroke-gray-100 fill-none"
                  stroke-width="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  class="fill-none"
                  stroke="url(#cpdGradient)"
                  stroke-width="3"
                  stroke-linecap="round"
                  :stroke-dasharray="`${stats.cpdPercentage}, 100`"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text
                  x="18"
                  y="21"
                  class="fill-gray-700 font-bold text-[10px]"
                  text-anchor="middle"
                >
                  {{ stats.cpdPercentage }}%
                </text>
              </svg>
            </div>
            <div class="flex-1 space-y-3">
              <div class="flex justify-between text-sm items-center">
                <span class="flex items-center text-gray-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-green-500 inline-block mr-2"></span>
                  Self-Directed
                </span>
                <span class="font-medium text-gray-800">{{ stats.selfDirectedCPD }}</span>
              </div>
              <div class="flex justify-between text-sm items-center">
                <span class="flex items-center text-gray-600">
                  <span class="w-2.5 h-2.5 rounded-full bg-green-300 inline-block mr-2"></span>
                  Program Approvals
                </span>
                <span class="font-medium text-gray-800">{{ stats.programApprovals }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 text-right">
            <button
              class="text-green-600 text-sm font-medium hover:text-green-800 flex items-center justify-end w-full group"
            >
              Manage CPD activities
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- CoGS Requests Card -->
        <div
          class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col transition-shadow duration-300 hover:shadow-lg"
        >
          <div class="flex items-center space-x-4 mb-5">
            <div
              class="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">CoGS Requests</h3>
              <p class="text-2xl font-bold text-purple-600">
                {{ stats.cogsRequests }}
                <span class="text-sm font-medium text-gray-500">pending</span>
              </p>
            </div>
          </div>

          <div class="mt-4 flex flex-col items-center flex-grow">
            <div class="relative w-36 h-20 mb-2">
              <svg class="w-full h-full" viewBox="0 0 100 50">
                <defs>
                  <linearGradient id="cogsGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color: #a855f7; stop-opacity: 1" />
                    <stop offset="100%" style="stop-color: #c084fc; stop-opacity: 1" />
                  </linearGradient>
                </defs>
                <path
                  d="M5,50 A45,45 0 0,1 95,50"
                  class="stroke-gray-100 fill-none"
                  stroke-width="8"
                  stroke-linecap="round"
                />
                <path
                  d="M5,50 A45,45 0 0,1 95,50"
                  class="fill-none"
                  stroke="url(#cogsGradient)"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="141.37"
                  :stroke-dashoffset="141.37 - (141.37 * stats.cogsCompletionRate) / 100"
                />
              </svg>
              <div
                class="absolute bottom-1 left-0 right-0 text-center text-purple-700 font-bold text-xl"
              >
                {{ stats.cogsCompletionRate }}<span class="text-sm">%</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 font-medium -mt-1">Processing Rate</p>
          </div>

          <div class="mt-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Completed Today</span>
              <span class="font-medium text-gray-800">5</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Avg. Processing Time</span>
              <span class="font-medium text-gray-800">1.8 days</span>
            </div>
          </div>

          <div class="mt-6 text-right">
            <button
              class="text-purple-600 text-sm font-medium hover:text-purple-800 flex items-center justify-end w-full group"
            >
              Process CoGS requests
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Applications Table -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4"
        >
          <h2 class="text-xl font-semibold text-gray-800">Recent Applications</h2>
          <div class="flex space-x-2 w-full sm:w-auto">
            <div class="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder="Search applications..."
                class="text-sm border border-gray-300 rounded-lg pl-9 pr-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <button
              class="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-lg transition-colors flex items-center whitespace-nowrap"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-4 h-4 mr-1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
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
import DashboardTableRecentApp from './DashboardTableRecentApp.vue'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue' // Import the header
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiServices from '@/services/services'
import {
  DocumentTextIcon,
  AcademicCapIcon,
  DocumentCheckIcon,
  CogIcon, // Keep CogIcon if used elsewhere, otherwise replace with appropriate icon
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  CalendarDaysIcon, // Changed from CalendarIcon for more clarity
  ChartBarIcon,
  ClockIcon, // Example for processing time or pending duration
  InboxStackIcon, // Example for total applications
  CheckBadgeIcon, // Example for Approved Today
  ArrowPathIcon, // Example for Pending Renewals
} from '@heroicons/vue/24/outline'

const router = useRouter()

const currentDate = ref(
  new Date().toLocaleDateString('en-GB', {
    // Use en-GB for DD/MM/YYYY style consistency if needed
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

// Define icon map with imported icons
const iconMap = {
  DocumentTextIcon: DocumentTextIcon,
  AcademicCapIcon: AcademicCapIcon,
  DocumentCheckIcon: DocumentCheckIcon,
  CogIcon: CogIcon, // Example: Use CogIcon for CoGS processing task
  ClipboardDocumentCheckIcon: ClipboardDocumentCheckIcon,
  UserGroupIcon: UserGroupIcon,
  CalendarDaysIcon: CalendarDaysIcon,
  ChartBarIcon: ChartBarIcon,
  InboxStackIcon: InboxStackIcon,
  CheckBadgeIcon: CheckBadgeIcon,
  ArrowPathIcon: ArrowPathIcon,
  ClockIcon: ClockIcon,
}

const getIconComponent = (iconName) => {
  return iconMap[iconName] || DocumentTextIcon // Fallback icon
}

// Data refs
const pendingApplicationCount = ref(0)
const pendingCpdCount = ref(0)
const pendingCogsCount = ref(0)
const totalApplicationsCount = ref(0)
const approvedApplicationsTodayCount = ref(0)
const activePractitionersCount = ref(0) // //TODO: Need API

// Computed property for Quick Stats with better icons and colors
const quickStats = computed(() => [
  {
    title: 'Total Applications',
    value: totalApplicationsCount.value.toLocaleString(),
    icon: 'InboxStackIcon',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    title: 'Approved Today',
    value: approvedApplicationsTodayCount.value.toLocaleString(),
    icon: 'CheckBadgeIcon',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    title: 'Active Practitioners',
    value: activePractitionersCount.value.toLocaleString(), // Use dynamic count
    icon: 'UserGroupIcon',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
  },
  {
    title: 'Pending Renewals', // Approximation, clarify what this number represents
    value: pendingApplicationCount.value.toLocaleString(),
    icon: 'ArrowPathIcon',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
  },
])

// Priority Tasks with matching colors to Quick Stats (optional enhancement)
const priorityTasks = ref([
  {
    id: 1,
    title: 'Application Review',
    pending_Counts: 0,
    icon: 'DocumentTextIcon',
    route: '/admin/dealing_officer/health_certification/application_lists',
    bgColor: 'bg-blue-50', // Match Total Applications
    textColor: 'text-blue-600',
  },
  {
    id: 2,
    title: 'CPD Approval',
    pending_Counts: 0,
    icon: 'AcademicCapIcon',
    route: '/admin/dealing_officer/health_certification/cpd_management',
    bgColor: 'bg-green-50', // Match Approved Today (as an example)
    textColor: 'text-green-600',
  },
  {
    id: 3,
    title: 'Verify Documents',
    pending_Counts: 0,
    icon: 'DocumentCheckIcon',
    route: '/admin/dealing_officer/health_certification/application_lists', // Can link to specific filtered view
    bgColor: 'bg-yellow-50', // Match Active Practitioners
    textColor: 'text-yellow-600',
  },
  {
    id: 4,
    title: 'Process CoGS',
    pending_Counts: 0,
    icon: 'CogIcon', // Using CogIcon as example for process
    route: '/admin/dealing_officer/health_certification/cogs',
    bgColor: 'bg-purple-50', // Distinct color for CoGS
    textColor: 'text-purple-600',
  },
])

// Detailed stats computed property
const stats = computed(() => {
  const totalPendingReviews = pendingApplicationCount.value // Example: Assume only app review counts here
  const newRegistrations = Math.round(pendingApplicationCount.value * 0.65) // Example breakdown
  const renewals = Math.round(pendingApplicationCount.value * 0.25) // Example breakdown
  const additionalQuals = pendingApplicationCount.value - newRegistrations - renewals // Remainder

  const selfDirectedCPD = Math.round(pendingCpdCount.value * 0.7) // Example breakdown
  const programApprovals = pendingCpdCount.value - selfDirectedCPD // Remainder

  const cpdPercentage =
    pendingCpdCount.value > 0 ? Math.round((programApprovals / pendingCpdCount.value) * 100) : 0 // Example: % of program approvals

  return {
    pendingReviews: totalPendingReviews,
    newRegistrations: newRegistrations,
    renewals: renewals,
    additionalQuals: additionalQuals,
    pendingCPD: pendingCpdCount.value,
    selfDirectedCPD: selfDirectedCPD,
    programApprovals: programApprovals,
    cogsRequests: pendingCogsCount.value,
    cogsCompletionRate: 68, 
    cpdPercentage: cpdPercentage,
  }
})

// Structure for pending review details in the card
const pendingReviewDetails = computed(() => [
  { label: 'New Registrations', value: stats.value.newRegistrations, color: 'bg-blue-500' },
  { label: 'Renewals', value: stats.value.renewals, color: 'bg-blue-400' },
  { label: 'Additional Quals', value: stats.value.additionalQuals, color: 'bg-blue-300' },
])

// Helper to calculate percentage for progress bars
const calculatePercentage = (value, total) => {
  if (total <= 0 || value <= 0) return '0%'
  const percentage = (value / total) * 100
  return `${Math.min(Math.max(percentage, 0), 100)}%` // Clamp between 0 and 100
}

// Fetch data on mount
onMounted(async () => {
  try {
    // Fetch application data (Registrations, Renewals etc.)
    const applicantsResponse = await apiServices.getMhpcNewQualifications({ page_size: 1000 }) // Fetch more if needed
    const applicantsData = applicantsResponse.data.results || []
    totalApplicationsCount.value = applicantsResponse.data.count || 0 // Use count from API if available

    // Filter for approved today - adjust date logic if needed
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    approvedApplicationsTodayCount.value = applicantsData.filter(
      (app) =>
        app.application_review_status === 'Approved' &&
        app.application_review_date && // Ensure date exists
        new Date(app.application_review_date) >= today,
    ).length

    pendingApplicationCount.value = applicantsData.filter(
      (app) => app.application_review_status === 'Pending',
    ).length

    priorityTasks.value.find((t) => t.id === 1).pending_Counts = pendingApplicationCount.value

    // Fetch CPD data
    const cpdRecordsResponse = await apiServices.getMhpcCpdRecords({ page_size: 1000 })
    const cpdData = cpdRecordsResponse.data.results || []
    pendingCpdCount.value = cpdData.filter((cpd) => cpd.review_status === 'Pending').length
    priorityTasks.value.find((t) => t.id === 2).pending_Counts = pendingCpdCount.value

    // Fetch CoGS data
    const cogsRecordsResponse = await apiServices.getMhpcCogs({ page_size: 1000 })
    const cogsData = cogsRecordsResponse.data.results || []
    pendingCogsCount.value = cogsData.filter((cogs) => cogs.review_status === 'Pending').length
    priorityTasks.value.find((t) => t.id === 4).pending_Counts = pendingCogsCount.value

    activePractitionersCount.value = 125 // Placeholder
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
})

// Navigation function
const navigateToTask = (task) => {
  if (task.route) {
    router.push(task.route)
  } else {
    console.warn(`No route defined for task: ${task.title}`)
  }
}
</script>

<style scoped>
/* Add minimal scoped styles if needed, relying mostly on Tailwind */
</style>
