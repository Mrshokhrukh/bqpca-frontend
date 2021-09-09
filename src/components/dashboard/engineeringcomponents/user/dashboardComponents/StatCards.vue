<template>
  <div v-if="!isLoading && relevantApplications.length > 0" class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
      <div class="text-sm text-gray-500">
        Annual Target: <span class="font-semibold">{{ CPD_ANNUAL_TARGET }} points</span>
      </div>
    </div>

    <div class="mt-4">
      <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
        <span>Progress:</span>
        <span>{{ totalCpdCredits }}/{{ CPD_ANNUAL_TARGET }} points</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3">
        <div class="bg-blue-500 h-3 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"></div>
      </div>
      <p class="text-lg text-gray-900 mt-4">
        Total CPD Applications: <span class="font-semibold">{{ relevantApplications.length }}</span>
      </p>
    </div>

    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="(count, status) in statusCounts" :key="status" :class="statusCardClasses(status)"
        class="p-4 rounded-lg shadow-sm flex flex-col items-center justify-center">
        <div class="text-2xl font-bold" :class="statusTextClasses(status)">{{ count }}</div>
        <div class="text-sm text-gray-600 mt-1">{{ status }}</div>
      </div>
    </div>
  </div>

  <div v-else-if="isLoading" class="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
    <p>Loading statistics...</p>
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
import { useEpcCpdStore } from '@/stores/epcCpdStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import {
  AcademicCapIcon,
  TrophyIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: 'TrophyIcon',
  },
})

// MODIFIED: Define the annual target as a constant for easy updates
const CPD_ANNUAL_TARGET = 30

const cpdStore = useEpcCpdStore()
const {
  cpdRecords: relevantApplications,
  isLoading,
  totalCpdCredits
} = storeToRefs(cpdStore)

const progressPercentage = computed(() => {
  if (CPD_ANNUAL_TARGET === 0) return 0
  // MODIFIED: Use the constant for calculation
  const percentage = (totalCpdCredits.value / CPD_ANNUAL_TARGET) * 100
  return Math.min(percentage, 100)
})

const statusCounts = computed(() => {
  const counts = { Approved: 0, Pending: 0, Rejected: 0 }
  for (const record of relevantApplications.value) {
    let status = record.status || 'Pending'
    if (status === 'Regretted') {
      status = 'Rejected'
    }
    if (counts.hasOwnProperty(status)) {
      counts[status]++
    }
  }
  return counts
})

const statusCardClasses = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-50 border border-green-200'
    case 'Pending':
      return 'bg-yellow-50 border border-yellow-200'
    case 'Rejected':
      return 'bg-red-50 border border-red-200'
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
    case 'Rejected':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

const resolveIcon = (iconName) => {
  const icons = {
    AcademicCapIcon, TrophyIcon, ChartBarIcon, DocumentTextIcon,
    Award: TrophyIcon, Document: DocumentTextIcon, Chart: ChartBarIcon, Academic: AcademicCapIcon,
  }
  return icons[iconName] || TrophyIcon
}
</script>
