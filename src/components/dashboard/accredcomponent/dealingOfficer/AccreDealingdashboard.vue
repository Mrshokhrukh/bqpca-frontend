<template>
    <div class="min-h-screen bg-gray-50 p-6">
      <!-- Header Section -->

  
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Pending Applications Card -->
        <div class="bg-white rounded-xl shadow-sm p-6 transition duration-300 hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending Applications</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ pendingCount }}</p>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center">
              <span class="text-green-500 text-sm font-medium">+4.5%</span>
              <span class="text-gray-500 text-sm ml-2">from last week</span>
            </div>
          </div>
        </div>
  
        <!-- In Progress Card -->
        <div class="bg-white rounded-xl shadow-sm p-6 transition duration-300 hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">In Progress</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ inProgressCount }}</p>
            </div>
            <div class="bg-yellow-50 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center">
              <span class="text-yellow-500 text-sm font-medium">Active</span>
              <span class="text-gray-500 text-sm ml-2">processing time: 2.3 days</span>
            </div>
          </div>
        </div>
  
        <!-- Completed Card -->
        <div class="bg-white rounded-xl shadow-sm p-6 transition duration-300 hover:shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ completedCount }}</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center">
              <span class="text-green-500 text-sm font-medium">98%</span>
              <span class="text-gray-500 text-sm ml-2">success rate</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Applications Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <span class="text-sm text-gray-600">Showing latest entries</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ app.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ app.companyName }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="{
                      'px-2 py-1 text-xs font-medium rounded-full': true,
                      'bg-yellow-100 text-yellow-800': app.status === 'Pending',
                      'bg-blue-100 text-blue-800': app.status === 'In Progress',
                      'bg-green-100 text-green-800': app.status === 'Completed'
                    }"
                  >
                    {{ app.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(app.submissionDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  
  export default {
    name: 'DealingDashboard',
    setup() {
      const pendingCount = ref(0)
      const inProgressCount = ref(0)
      const completedCount = ref(0)
      const applications = ref([])
  
      const fetchDashboardData = async () => {
        try {
          // TODO: Implement API call to fetch dashboard data
          pendingCount.value = 5
          inProgressCount.value = 3
          completedCount.value = 10
          applications.value = [
            {
              id: 'APP001',
              companyName: 'Tech Solutions Inc.',
              status: 'Pending',
              submissionDate: new Date()
            },
            {
              id: 'APP002',
              companyName: 'Global Industries',
              status: 'In Progress',
              submissionDate: new Date(Date.now() - 86400000)
            },
            {
              id: 'APP003',
              companyName: 'Digital Ventures',
              status: 'Completed',
              submissionDate: new Date(Date.now() - 172800000)
            }
          ]
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
        }
      }
  
      const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
  
      onMounted(() => {
        fetchDashboardData()
      })
  
      return {
        pendingCount,
        inProgressCount,
        completedCount,
        applications,
        formatDate
      }
    }
  }
  </script>