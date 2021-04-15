<!-- BQPCA Admin Dashboard.vue -->
<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Header -->
      <header class="bg-white shadow">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center">
            <button class="mr-4 md:hidden" @click="toggleMobileMenu">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 class="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto p-6 bg-gray-100">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-800">Welcome to ECPF Dealing Officer Portal</h1>
          <p class="mt-2 text-gray-600">
            Manage applications, change requests, events, and linkages.
          </p>
        </div>

        <!-- Dashboard Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Application Stats Card -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-5">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-medium text-gray-500">Applications</div>
                  <div class="mt-1 text-3xl font-semibold text-gray-900">24</div>
                </div>
                <div class="h-12 w-12 rounded-md flex items-center justify-center bg-blue-600">
                  <svg
                    class="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div class="mt-4 flex items-center">
                <span class="text-sm font-medium text-green-600">+12%</span>
                <span class="ml-2 text-sm text-gray-500">since last month</span>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3 border-t border-blue-100">
              <div class="text-sm">
                <a href="#" class="font-medium hover:text-indigo-900">View all</a>
              </div>
            </div>
          </div>

          <!-- Change Requests Card -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-5">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-medium text-gray-500">Change Requests</div>
                  <div class="mt-1 text-3xl font-semibold text-gray-900">8</div>
                </div>
                <div class="h-12 w-12 rounded-md flex items-center justify-center bg-green-600">
                  <svg
                    class="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
              <div class="mt-4 flex items-center">
                <span class="text-sm font-medium text-red-600">-3%</span>
                <span class="ml-2 text-sm text-gray-500">since last month</span>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3 border-t border-green-100">
              <div class="text-sm">
                <a href="#" class="font-medium hover:text-indigo-900">View all</a>
              </div>
            </div>
          </div>

          <!-- Events Card -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-5">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-medium text-gray-500">Events</div>
                  <div class="mt-1 text-3xl font-semibold text-gray-900">15</div>
                </div>
                <div class="h-12 w-12 rounded-md flex items-center justify-center bg-purple-600">
                  <svg
                    class="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <div class="mt-4 flex items-center">
                <span class="text-sm font-medium text-green-600">+5%</span>
                <span class="ml-2 text-sm text-gray-500">since last month</span>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3 border-t border-purple-100">
              <div class="text-sm">
                <a href="#" class="font-medium hover:text-indigo-900">View all</a>
              </div>
            </div>
          </div>

          <!-- Linkages Card -->
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-5">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-medium text-gray-500">ECPF Linkages</div>
                  <div class="mt-1 text-3xl font-semibold text-gray-900">42</div>
                </div>
                <div class="h-12 w-12 rounded-md flex items-center justify-center bg-amber-600">
                  <svg
                    class="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
              </div>
              <div class="mt-4 flex items-center">
                <span class="text-sm font-medium text-green-600">+20%</span>
                <span class="ml-2 text-sm text-gray-500">since last month</span>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3 border-t border-amber-100">
              <div class="text-sm">
                <a href="#" class="font-medium hover:text-indigo-900">View all</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Section -->
        <div class="mt-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in recentActivity" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getTypeClass(item.type)"
                    >
                      {{ item.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.description }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="getStatusClass(item.status)"
                    >
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.date }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const recentActivity = [
  {
    type: 'Application',
    description: 'New Individual ECPF Application',
    status: 'Pending',
    date: 'Mar 18, 2025',
  },
  {
    type: 'Change',
    description: 'ECPF Name Change Request',
    status: 'Approved',
    date: 'Mar 17, 2025',
  },
  {
    type: 'Event',
    description: 'Education Fair Application',
    status: 'In Review',
    date: 'Mar 16, 2025',
  },
  {
    type: 'Linkage',
    description: 'New ECPF Linkage Created',
    status: 'Active',
    date: 'Mar 15, 2025',
  },
  {
    type: 'Application',
    description: 'Renewal Application Submitted',
    status: 'Pending',
    date: 'Mar 14, 2025',
  },
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const getTypeClass = (type) => {
  const classes = {
    Application: 'bg-blue-100 text-blue-800',
    Change: 'bg-green-100 text-green-800',
    Event: 'bg-purple-100 text-purple-800',
    Linkage: 'bg-amber-100 text-amber-800',
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status) => {
  const classes = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    'In Review': 'bg-blue-100 text-blue-800',
    Active: 'bg-indigo-100 text-indigo-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>
