<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500">Welcome back! Here's an overview of your applications.</p>
      </div>

      <!-- Site Visit Notification -->
      <div
        v-if="siteVisitScheduled && !siteVisitConfirmed"
        class="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-xl shadow-sm mb-6"
      >
        <div class="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <p class="font-bold">Action Required: Site Visit Scheduled</p>
            <p>
              A site visit has been scheduled for your institution. Please confirm or request a
              reschedule.
            </p>
            <router-link
              to="/admin/user/accreditation/site_visit_confirmation"
              class="text-blue-600 hover:underline font-medium"
              >View Details</router-link
            >
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Applications -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Applications</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ totalApplications }}</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6 text-blue-500"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Pending Reviews -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Pending Reviews</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ pendingReviews }}</p>
            </div>
            <div class="bg-yellow-50 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6 text-yellow-500"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Completed Reviews -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Completed Reviews</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ completedReviews }}</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6 text-green-500"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900">Recent Activities</h2>
        </div>
        <div class="border-t border-gray-100">
          <ul class="divide-y divide-gray-100">
            <li
              v-for="activity in recentActivities"
              :key="activity.id"
              class="p-6 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ activity.description }}</p>
                  <p class="text-sm text-gray-500 mt-1">{{ activity.timestamp }}</p>
                </div>
                <div
                  :class="{
                    'bg-blue-50 text-blue-700': activity.type === 'submission',
                    'bg-yellow-50 text-yellow-700': activity.type === 'update',
                    'bg-green-50 text-green-700': activity.type === 'completion',
                  }"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ activity.type }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {} from 'lucide-vue-next'

const totalApplications = ref(0)
const pendingReviews = ref(0)
const completedReviews = ref(0)
const recentActivities = ref([
  {
    id: 1,
    description: 'Application submitted for review',
    timestamp: '2 hours ago',
    type: 'submission',
  },
  {
    id: 2,
    description: 'Document updated by John Doe',
    timestamp: '4 hours ago',
    type: 'update',
  },
  {
    id: 3,
    description: 'Review completed for Project X',
    timestamp: '1 day ago',
    type: 'completion',
  },
])

const siteVisitScheduled = ref(true) // Mock data.  This will be set by checking with the API
const siteVisitConfirmed = ref(false) // Track whether the site visit has been confirmed

const fetchDashboardData = () => {
  // Simulated API call
  totalApplications.value = 5
  pendingReviews.value = 2
  completedReviews.value = 3
}

onMounted(() => {
  fetchDashboardData()
})
</script>
