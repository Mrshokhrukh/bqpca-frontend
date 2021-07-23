<template>
  <div class="min-h-screen bg-gray-100">
    <div class="container mx-auto p-6">
      <!-- Dashboard Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">HEQC Dashboard</h1>
        <p class="text-gray-600 mt-1">Welcome to your HEQC administration panel.</p>
      </header>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Pending Applications Card -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Pending Applications
                </p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ pendingCount }}</p>
              </div>
              <div class="p-3 rounded-full bg-blue-100 text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 px-6 py-2 border-t border-gray-100 flex justify-between items-center"
          >
            <div class="text-sm text-green-600 font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              +4.5%
            </div>
            <span class="text-xs text-gray-500">vs Last Week</span>
          </div>
        </div>

        <!-- In Progress Card -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Applications In Progress
                </p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ inProgressCount }}</p>
              </div>
              <div class="p-3 rounded-full bg-yellow-100 text-yellow-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M6 11h.01M6 15h.01"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 px-6 py-2 border-t border-gray-100 flex justify-between items-center"
          >
            <div class="text-sm text-gray-700 font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 3a1 1 0 011-1h12a1 1 0 110 2H7a1 1 0 01-1-1zm0 7a1 1 0 011-1h12a1 1 0 110 2H7a1 1 0 01-1-1zm0 7a1 1 0 011-1h12a1 1 0 110 2H7a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              Active
            </div>
            <span class="text-xs text-gray-500">Avg. Processing: 2.3 Days</span>
          </div>
        </div>

        <!-- Completed Card -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Completed Applications
                </p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ completedCount }}</p>
              </div>
              <div class="p-3 rounded-full bg-green-100 text-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 px-6 py-2 border-t border-gray-100 flex justify-between items-center"
          >
            <div class="text-sm text-green-600 font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              98%
            </div>
            <span class="text-xs text-gray-500">Success Rate</span>
          </div>
        </div>
      </div>

      <!-- Recent Applications Table -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <span class="text-sm text-gray-600">Latest entries in the system</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Application ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Company Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submission Date
                </th>
                <!-- REMOVED VIEW COLUMN HEADER -->
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="app in applications" :key="app.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ app.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ app.companyName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    :class="{
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium': true,
                      'bg-yellow-100 text-yellow-800': app.status === 'Pending',
                      'bg-blue-100 text-blue-800': app.status === 'In Progress',
                      'bg-green-100 text-green-800': app.status === 'Completed',
                    }"
                  >
                    <span class="mr-1" v-if="app.status === 'Pending'">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 inline-block align-middle"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 5a1 1 0 00-2 0v5a1 1 0 102 0V5zm1 6a1 1 0 11-2 0 1 1 0 012 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    <span class="mr-1" v-if="app.status === 'In Progress'">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 inline-block align-middle animate-spin"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        color="currentColor"
                      >
                        <path
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20 12a8 8 0 01-8 8v4c6.627 0 12-5.373 12-12h-4zm-2-5.291A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3-7.938l-3 2.647z"
                        />
                      </svg>
                    </span>
                    <span class="mr-1" v-if="app.status === 'Completed'">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 inline-block align-middle"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </span>
                    {{ app.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(app.submissionDate) }}
                </td>
                <!-- REMOVED VIEW BUTTON CELL -->
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button class="text-sm text-gray-700 hover:text-gray-900">View All Applications</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const pendingCount = ref(0)
const inProgressCount = ref(0)
const completedCount = ref(0)
const applications = ref([])

const fetchDashboardData = async () => {
  try {
    // TODO: Implement API call to fetch dashboard data
    // Example using a mock API call (replace with your actual API call)
    // const response = await fetch('/api/dashboard');
    // const data = await response.json();

    // pendingCount.value = data.pendingCount;
    // inProgressCount.value = data.inProgressCount;
    // completedCount.value = data.completedCount;
    // applications.value = data.applications;

    //Mock data, as in the original code.
    pendingCount.value = 5
    inProgressCount.value = 3
    completedCount.value = 10
    applications.value = [
      {
        id: 'APP001',
        companyName: 'Tech Solutions Inc.',
        status: 'Pending',
        submissionDate: new Date(),
      },
      {
        id: 'APP002',
        companyName: 'Global Industries',
        status: 'In Progress',
        submissionDate: new Date(Date.now() - 86400000),
      },
      {
        id: 'APP003',
        companyName: 'Digital Ventures',
        status: 'Completed',
        submissionDate: new Date(Date.now() - 172800000),
      },
      {
        id: 'APP004',
        companyName: 'Innovation Corp',
        status: 'In Progress',
        submissionDate: new Date(Date.now() - 259200000),
      },
      {
        id: 'APP005',
        companyName: 'Pioneer Enterprises',
        status: 'Pending',
        submissionDate: new Date(Date.now() - 345600000),
      },
    ]
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
