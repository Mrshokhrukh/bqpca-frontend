<template>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <!-- Header Section -->
        <div class="mb-8 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p class="mt-2 text-gray-600">BQPCA Administrator Dashboard</p>
          </div>
          <div class="flex items-center space-x-4">
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              New Application
            </button>
          </div>
        </div>
  
        <!-- Quick Actions Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            v-for="action in quickActions"
            :key="action.label"
            class="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center justify-center space-y-2"
            @click="navigateTo(action.path)"
          >
            <component :is="action.icon" class="w-6 h-6 text-blue-600" />
            <span class="text-sm font-medium text-gray-700">{{ action.label }}</span>
          </button>
        </div>
  
        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- ECPF Status Card -->
          <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div class="p-6">
              <div class="flex items-center justify-between pb-2">
                <h2 class="text-xl font-semibold">ECPF Status</h2>
                <span :class="[getStatusColor(ecpfData.status), 'px-3 py-1 rounded-full text-sm font-medium']">
                  {{ ecpfData.status }}
                </span>
              </div>
              <div class="mt-4 space-y-4">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span class="text-sm text-gray-600">Expires: {{ formatDate(ecpfData.expiryDate) }}</span>
                </div>
                <button @click="goToEcpfDetails" class="w-full mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Details
                </button>
              </div>
            </div>
          </div>
  
          <!-- Applications Card -->
          <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div class="p-6">
              <div class="flex items-center justify-between pb-2">
                <h2 class="text-xl font-semibold">Recent Applications</h2>
                <span class="text-sm text-gray-500">{{ applications.length }} pending</span>
              </div>
              <div class="space-y-4">
                <div
                  v-for="app in applications"
                  :key="app.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="space-y-1">
                    <p class="text-sm font-medium text-gray-900">{{ app.type }}</p>
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-xs text-gray-500">Submitted {{ formatDate(app.dateSubmitted) }}</p>
                    </div>
                  </div>
                  <span :class="[getStatusColor(app.status), 'px-2 py-1 rounded-full text-xs font-medium']">
                    {{ app.status }}
                  </span>
                </div>
                <button @click="goToApplications" class="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                  View All Applications
                </button>
              </div>
            </div>
          </div>
  
          <!-- Notifications Card -->
          <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
            <div class="p-6">
              <div class="flex items-center justify-between pb-2">
                <h2 class="text-xl font-semibold">Notifications</h2>
                <div class="relative">
                  <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {{ notifications.length }}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
              <div class="space-y-4">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="flex space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div :class="[notification.type === 'warning' ? 'text-yellow-500' : 'text-blue-500', 'h-5 w-5']">
                    {{ notification.type === 'warning' ? '⚠️' : 'ℹ️' }}
                  </div>
                  <div class="flex-1 space-y-1">
                    <p class="text-sm text-gray-700">{{ notification.message }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(notification.date) }}</p>
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
  import { ref, onMounted } from 'vue';
  
  // Quick actions data
  const quickActions = ref([
    { 
      icon: 'DocumentIcon',
      label: 'New Application',
      path: '/new-application'
    },
    {
      icon: 'ClockIcon',
      label: 'License Renewal',
      path: '/license-renewal'
    },
    {
      icon: 'BuildingIcon',
      label: 'Institutional Linkages',
      path: '/institutional-linkages'
    },
    {
      icon: 'PencilIcon',
      label: 'Change Requests',
      path: '/change-requests'
    }
  ]);
  
  // State management using refs
  const ecpfData = ref({
    status: 'Active',
    expiryDate: '2025-12-31T00:00:00.000Z',
  });
  
  const applications = ref([
    { id: 1, type: 'License Renewal', dateSubmitted: '2024-11-20T10:00:00.000Z', status: 'In Review' },
    { id: 2, type: 'Change Request', dateSubmitted: '2024-11-25T14:00:00.000Z', status: 'Pending' }
  ]);
  
  const notifications = ref([
    { id: 1, message: 'Your License Renewal application is under review.', date: '2024-11-28T09:00:00.000Z', type: 'info' },
    { id: 2, message: 'Important announcement regarding ECPF regulations.', date: '2024-11-27T16:00:00.000Z', type: 'warning' }
  ]);
  
  // Methods
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getStatusColor = (status) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      'in review': 'bg-blue-100 text-blue-800',
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };
  
  const navigateTo = (path) => {
    console.log('Navigating to:', path);
    // Implement your navigation logic here
    // Example: router.push(path);
  };
  
  const goToEcpfDetails = () => {
    console.log('Navigating to ECPF Details');
    // Implement navigation to ECPF details page
    // Example: router.push('/ecpf-details');
  };
  
  const goToApplications = () => {
    console.log('Navigating to Applications');
    // Implement navigation to Applications page
    // Example: router.push('/applications');
  };
  
  // Load data on component mount
  const loadData = async () => {
    try {
      // Mock API calls - replace with actual API endpoints
      // You can implement your API calls here
      console.log('Loading dashboard data...');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };
  
  onMounted(() => {
    loadData();
  });
  </script>
  
  <style scoped>

  </style>