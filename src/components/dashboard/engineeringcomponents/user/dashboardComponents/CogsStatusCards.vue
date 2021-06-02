<template>
  <div v-if="application" class="bg-white shadow-lg rounded-xl p-6">
    <!-- Card Header -->
    <div class="flex items-center space-x-3 mb-4">
      <div class="bg-purple-100 p-2 rounded-full">
        <FolderIcon class="w-5 h-5 text-purple-500" />
      </div>
      <h3 class="font-bold text-gray-800 text-xl">CoGS</h3>
    </div>

    <!-- Card Body -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(value, key) in displayData" :key="key" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div class="text-sm font-medium text-gray-500">{{ key }}</div>
        <!-- Dynamic Styling for Statuses -->
        <div v-if="
          key === 'Review Status' || key === 'Endorsement Decision' || key === 'Payment Complete'
        " :class="getStatusClass(value)"
          class="text-base mt-1 font-semibold inline-flex items-center px-3 py-1 rounded-full">
          {{ value }}
        </div>
        <div v-else class="text-base text-gray-900 mt-1">{{ value }}</div>
      </div>
    </div>
  </div>
  <div v-else-if="isLoading" class="bg-white shadow-lg rounded-xl p-6 text-center">
    <div class="flex items-center justify-center mb-4">
      <div class="bg-purple-100 p-3 rounded-full">
        <FolderIcon class="w-6 h-6 text-purple-400 animate-pulse" />
      </div>
    </div>
    <p class="text-gray-500">Loading CoGS data...</p>
  </div>
  <div v-else class="bg-white shadow-lg rounded-xl p-6 text-center">
    <div class="flex items-center justify-center mb-4">
      <div class="bg-gray-100 p-3 rounded-full">
        <FolderIcon class="w-6 h-6 text-gray-400" />
      </div>
    </div>
    <p class="text-lg font-medium text-gray-600 mb-2">CoGS</p>
    <p class="text-sm text-gray-500">No CoGS applications found</p>
  </div>
</template>

<script setup>
import { FolderIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'

const authStore = useAuthStore()
const applications = ref([])
const application = ref(null)
const isLoading = ref(false)
const apiError = ref(false)

const fetchApplications = async () => {
  isLoading.value = true
  apiError.value = false

  try {
    // Using EPC CoGS API instead of MHPC
    const response = await apiService.getEpcCogs()
    const allApplications = Array.isArray(response.data.results)
      ? response.data.results
      : Array.isArray(response.data)
        ? response.data
        : []

    // Filter by current user's CID
    if (authStore.user?.cid) {
      applications.value = allApplications.filter(app => app.cid_no === authStore.user.cid)
    } else {
      applications.value = []
    }

    if (applications.value.length > 0) {
      // Get the most recent application
      application.value = applications.value.sort((a, b) =>
        new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at)
      )[0]
    } else {
      application.value = null
      console.warn('No CoGS applications found for current user')
    }
  } catch (error) {
    console.error('Error fetching EPC CoGS applications:', error)
    applications.value = []
    application.value = null
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchApplications)

const displayData = computed(() => {
  if (!application.value) {
    return {}
  }

  // Handle nested objects safely
  const getNestedValue = (obj, path, fallback = 'N/A') => {
    return obj && obj[path] ? (obj[path].name || obj[path]) : fallback
  }

  return {
    'Agency': getNestedValue(application.value, 'agency'),
    'Department': getNestedValue(application.value, 'department'),
    'Workplace': getNestedValue(application.value, 'workplace'),
    'Review Status': application.value.review_status || 'Pending',
    'Endorsement Decision': application.value.endorsement_decision || 'Pending',
    'Payment Complete': application.value.is_payment_complete ? 'Yes' : 'No',
  }
})

// Helper function to determine status colors
const getStatusClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800' // Yellow for pending
    case 'Approved':
      return 'bg-green-100 text-green-800' // Green for approved
    case 'Regretted':
    case 'Rejected':
      return 'bg-red-100 text-red-800' // Red for regretted/rejected
    case 'Yes':
      return 'bg-green-100 text-green-800' // Green for Yes
    case 'No':
      return 'bg-red-100 text-red-800' // Red for No
    default:
      return 'bg-gray-100 text-gray-800' // Default color
  }
}
</script>

<style scoped>
/* No scoped styles needed, everything is handled by Tailwind */
</style>