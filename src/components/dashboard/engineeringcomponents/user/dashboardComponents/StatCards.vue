<template>
  <div v-if="!isLoading && relevantApplications.length > 0" class="bg-white rounded-xl shadow-lg p-6">
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
        <div class="bg-blue-500 h-3 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"></div>
      </div>
      <p class="text-lg text-gray-900 mt-4">
        Total CPD Applications: <span class="font-semibold">{{ relevantApplications.length }}</span>
      </p>
    </div>

    <!-- Status Cards -->
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
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { ref, computed, onMounted } from 'vue'
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

const authStore = useAuthStore()
const selfSubmittedApps = ref([])
const participantRecords = ref([])
const resourcePersonTasks = ref([])
const isLoading = ref(true)
const apiError = ref(false)

onMounted(async () => {
  authStore.initializeAuth()
  if (!authStore.userRegistrationNo && authStore.user?.cid) {
    await authStore.fetchAndSetRegistrationNo()
  }
  await fetchAllData()
})


const fetchAllData = async () => {
  isLoading.value = true
  apiError.value = false
  try {
    const [selfSubmittedResponse, participantResponse, resourceTasksResponse] = await Promise.all([
      apiService.getEpcCpdRecords(),
      apiService.getEpcCpdTaskParticipants(),
      apiService.getEpcCpdTasks(),
    ])
    selfSubmittedApps.value = selfSubmittedResponse.data?.results || selfSubmittedResponse.data || []
    participantRecords.value = participantResponse.data?.results || participantResponse.data || []
    resourcePersonTasks.value = resourceTasksResponse.data?.results || resourceTasksResponse.data || []

  } catch (error) {
    console.error('Error fetching EPC CPD data:', error)
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}
const userCid = computed(() => authStore.user?.cid)
const registrationNo = computed(() => authStore.userRegistrationNo)
const userSelfSubmittedApps = computed(() => {
  if (!userCid.value) return []
  return selfSubmittedApps.value.filter(app => String(app.cid_no) === String(userCid.value))
})

const userParticipantRecords = computed(() => {
  if (!registrationNo.value) return []
  return participantRecords.value.filter(p => p.participant_reg_no === registrationNo.value)
})

const userResourceTasks = computed(() => {
  if (!registrationNo.value) return []
  return resourcePersonTasks.value.filter(task =>
    task.resources?.some(r => r.resource_person_reg_no === registrationNo.value)
  )
})
const relevantApplications = computed(() => {
  return [
    ...userSelfSubmittedApps.value,
    ...userParticipantRecords.value,
    ...userResourceTasks.value,
  ]
})

const totalCpdCredits = computed(() => {
  const selfCredits = userSelfSubmittedApps.value
    .filter(app => app.review_status === 'Approved')
    .reduce((sum, app) => sum + (app.cpd_credit || 0), 0)
  const participantCredits = userParticipantRecords.value
    .filter(p => p.review_status === 'Approved')
    .reduce((sum, p) => sum + (p.cpd_credits || 0), 0)
  const resourceCredits = userResourceTasks.value
    .filter(task => task.status === 'Approved')
    .reduce((sum, task) => sum + (task.credit || 0) * 2, 0)

  return selfCredits + participantCredits + resourceCredits
})

const progressPercentage = computed(() => {
  const target = 50
  if (target === 0) return 0
  const percentage = (totalCpdCredits.value / target) * 100
  return Math.min(percentage, 100)
})

const statusCounts = computed(() => {
  const counts = { Approved: 0, Pending: 0, Rejected: 0 }

  for (const record of relevantApplications.value) {
    let status = record.review_status || record.status || 'Pending'
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
