<template>
  <div class="min-h-screen">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Dashboard Header -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10 shadow-md">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dealing Officer Dashboard</h1>
            <p class="text-gray-600">Overview of registration, renewals, and CPD management</p>
          </div>
          <div class="flex gap-4">
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              New Applications
            </button>
            <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Process CPD
            </button>
          </div>
        </div>
      </div>

      <!-- Priority Tasks -->
      <div class="bg-white rounded-xl p-6 shadow-md mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Priority Tasks</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="task in priorityTasks" :key="task.id"
               class="border rounded-lg p-4 flex items-center space-x-3"
               :class="getTaskUrgencyClass(task.urgency)">
            <div class="flex-shrink-0">
              <component :is="task.icon" class="h-6 w-6" />
            </div>
            <div class="flex-1">
              <p class="font-medium">{{ task.title }}</p>
              <p class="text-sm">{{ task.deadline }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512m0 6.375V19.5a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021 19.5V12.417m-9 .375a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
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

        <div class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001l-.628-.349m-1.263-.52V4.046c0-1.26-1.517-1.867-2.583-1.513m-3.764 1.088c-1.031.888-1.951 2.274-2.227 4.141m-1.29-3.801c-.051.49-.186 1.08-1.504 1.979m9.583-.302v.003h4.992M15 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
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

        <div class="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
          <div class="flex items-center space-x-4">
            <div class="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
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
      <div class="bg-white rounded-xl p-6 shadow-md mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">Recent Applications</h2>
          <button class="text-blue-600 hover:text-blue-800">View All</button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="application in recentApplications" :key="application.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">{{ application.name }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getApplicationTypeClass(application.type)">
                    {{ application.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getStatusClass(application.status)">
                    {{ application.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ application.submittedDate }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button class="text-blue-600 hover:text-blue-900">Review</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Stats data
const stats = ref({
  pendingReviews: 25,
  newRegistrations: 12,
  renewals: 8,
  additionalQuals: 5,
  pendingCPD: 15,
  selfDirectedCPD: 8,
  programApprovals: 7,
  cogsRequests: 10,
  cogsCompletionRate: 85
})

// Priority tasks
const priorityTasks = ref([
  {
    id: 1,
    title: 'Review CID Registration',
    deadline: 'Due in 2 days',
    urgency: 'high',
    icon: 'DocumentIcon'
  },
  {
    id: 2,
    title: 'CPD Program Approval',
    deadline: 'Due today',
    urgency: 'critical',
    icon: 'ClockIcon'
  },
  {
    id: 3,
    title: 'Verify Documents',
    deadline: 'Due in 3 days',
    urgency: 'medium',
    icon: 'CheckCircleIcon'
  },
  {
    id: 4,
    title: 'Process CoGS Request',
    deadline: 'Due tomorrow',
    urgency: 'high',
    icon: 'ShieldCheckIcon'
  }
])

// Recent applications
const recentApplications = ref([
  {
    id: 1,
    name: 'John Doe',
    type: 'Registration',
    status: 'Pending',
    submittedDate: '2024-02-06'
  },
  {
    id: 2,
    name: 'Jane Smith',
    type: 'Renewal',
    status: 'In Review',
    submittedDate: '2024-02-05'
  },
  {
    id: 3,
    name: 'Bob Wilson',
    type: 'CPD',
    status: 'Documents Required',
    submittedDate: '2024-02-04'
  },
  {
    id: 4,
    name: 'Alice Brown',
    type: 'CoGS',
    status: 'Pending',
    submittedDate: '2024-02-03'
  }
])

// Utility functions for styling
const getTaskUrgencyClass = (urgency) => {
  const classes = {
    critical: 'border-red-500 bg-red-50',
    high: 'border-orange-500 bg-orange-50',
    medium: 'border-yellow-500 bg-yellow-50',
    low: 'border-green-500 bg-green-50'
  }
  return classes[urgency] || classes.medium
}

const getApplicationTypeClass = (type) => {
  const classes = {
    'Registration': 'bg-blue-100 text-blue-800',
    'Renewal': 'bg-green-100 text-green-800',
    'CPD': 'bg-purple-100 text-purple-800',
    'CoGS': 'bg-yellow-100 text-yellow-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status) => {
  const classes = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Review': 'bg-blue-100 text-blue-800',
    'Documents Required': 'bg-red-100 text-red-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-gray-100 text-gray-800' // Consider adding a more visually distinct color for 'Rejected'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>
