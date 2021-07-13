<template>
  <div v-if="relevantApplications.length > 0" class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
      <div class="text-sm text-gray-500">
        Annual Target: <span class="font-semibold">50 points</span>
      </div>
    </div>

    <div class="mt-4">
      <!-- Progress Bar -->
      <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
        <span>Progress:</span>
        <span>{{ totalCpdCredits }}/50 points</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div
          class="bg-blue-500 h-3 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      <p class="text-lg text-gray-900 mt-4">
        Total CPD Applications: <span class="font-semibold">{{ relevantApplications.length }}</span>
      </p>
    </div>

    <!-- Status Cards -->
    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="(count, status) in statusCounts"
        :key="status"
        :class="statusCardClasses(status)"
        class="p-4 rounded-lg shadow-sm flex flex-col items-center justify-center"
      >
        <div class="text-2xl font-bold" :class="statusTextClasses(status)">{{ count || 0 }}</div>
        <div class="text-sm text-gray-600 mt-1">{{ status }}</div>
      </div>
    </div>
  </div>
  <div v-else class="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
    <div class="flex items-center justify-center mb-4">
      <div class="bg-gray-100 p-3 rounded-full">
        <component :is="resolveIcon(icon)" class="w-6 h-6 text-gray-400" />
      </div>
    </div>
    <p class="text-lg font-medium text-gray-600 mb-2">{{ title }}</p>
    <p class="text-sm text-gray-500">No CPD applications found</p>
  </div>
</template>

<script setup>
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { ref, computed, onMounted } from 'vue'
import {
  AcademicCapIcon,
  TrophyIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const applications = ref([])
const isLoading = ref(false)
const apiError = ref(false)

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'TrophyIcon',
  },
  progress: {
    // Keep for backward compatibility
    type: Number,
    required: false,
  },
  total: {
    // Keep for backward compatibility
    type: Number,
    default: null,
  },
  type: {
    // Keep for backward compatibility
    type: String,
    default: 'progress',
  },
})

const fetchApplications = async () => {
  isLoading.value = true
  apiError.value = false

  try {
    // Using EPC CPD Records API instead of MHPC
    const response = await apiService.getEpcCpdRecords()
    if (Array.isArray(response.data.results)) {
      applications.value = response.data.results
    } else if (Array.isArray(response.data)) {
      applications.value = response.data
    } else {
      applications.value = []
      console.error('API did not return an array:', response.data)
      apiError.value = true
    }
  } catch (error) {
    console.error('Error fetching EPC CPD applications:', error)
    applications.value = []
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchApplications)

const relevantApplications = computed(() => {
  if (!authStore.user || !authStore.user.cid) {
    return []
  }
  return applications.value.filter((app) => app.cid_no === authStore.user.cid)
})

const totalCpdCredits = computed(() => {
  return relevantApplications.value.reduce((total, app) => total + (app.cpd_credit || 0), 0)
})

const progressPercentage = computed(() => {
  const percentage = (totalCpdCredits.value / 50) * 100
  return Math.min(percentage, 100)
})

const statusCounts = computed(() => {
  const counts = {}
  for (const app of relevantApplications.value) {
    const status = app.review_status || 'Pending'
    counts[status] = (counts[status] || 0) + 1
  }
  return counts
})

// Helper functions for dynamic classes
const statusCardClasses = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 border border-green-200'
    case 'Pending':
      return 'bg-yellow-100 border border-yellow-200'
    case 'Regretted':
    case 'Rejected':
      return 'bg-red-100 border border-red-200'
    default:
      return 'bg-gray-100 border border-gray-200'
  }
}

const statusTextClasses = (status) => {
  switch (status) {
    case 'Approved':
      return 'text-green-600'
    case 'Pending':
      return 'text-yellow-600'
    case 'Regretted':
    case 'Rejected':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

const resolveIcon = (iconName) => {
  const icons = {
    AcademicCapIcon: AcademicCapIcon,
    TrophyIcon: TrophyIcon,
    ChartBarIcon: ChartBarIcon,
    DocumentTextIcon: DocumentTextIcon,
    Award: TrophyIcon,
    Document: DocumentTextIcon,
    Chart: ChartBarIcon,
    Academic: AcademicCapIcon,
  }

  return icons[iconName] || TrophyIcon
}
</script>
