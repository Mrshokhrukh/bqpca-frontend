<template>
  <div class="min-h-screen">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Site Visit Schedules</h1>
            <p class="text-gray-600">Monitor and track teaching center verification schedules</p>
          </div>
          <button @click="fetchSchedules" :disabled="loading"
            class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md">
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <svg v-else class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
              </path>
            </svg>
            {{ loading ? 'Refreshing...' : 'Refresh Schedules' }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && schedules.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg class="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Loading Schedules</h3>
          <p class="text-gray-500">Please wait while we fetch the latest site visit schedules...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="bg-white rounded-xl shadow-sm border border-red-200 p-8">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.5 16.5c-.77.833.192 2.5 1.732 2.5z">
              </path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Unable to Load Schedules</h3>
          <p class="text-gray-600 mb-6 max-w-md mx-auto">{{ errorMessage }}</p>
          <button @click="fetchSchedules"
            class="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:shadow-md">
            <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
              </path>
            </svg>
            Try Again
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && schedules.length === 0"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m0 0V7a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h8z">
              </path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Schedules Published</h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">
            There are currently no site visit schedules published for your teaching centers. Please
            check back later, or contact the administration if you expect a schedule to be visible.
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p class="text-sm text-blue-800">
              <strong>Note:</strong> Schedules appear here after a dealing officer sets a
              verification date and/or status, and marks it for user visibility.
            </p>
          </div>
        </div>
      </div>

      <!-- Schedules Table -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Stats Bar -->
        <div class="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-6">
              <div class="text-sm">
                <span class="font-medium text-gray-900">{{ schedules.length }}</span>
                <span class="text-gray-500">
                  published {{ schedules.length === 1 ? 'schedule' : 'schedules' }}</span>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-600">{{ verifiedCount }} Verified</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-amber-400 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-600">{{ pendingVerificationCount }} Pending/Scheduled</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-600">{{ failedVerificationCount }} Verification Failed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Training Center
                </th>
                <th scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Scheduled/Verified Date
                </th>
                <th scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Verification Status
                </th>
                <th scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Verification Remarks/Report
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="schedule in schedules" :key="schedule.id"
                class="hover:bg-gray-50 transition-colors duration-150"
                :class="getStatusRowClass(schedule.physical_verification_status)">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <span class="text-sm font-medium text-indigo-700">{{
                          schedule.center_name ? schedule.center_name.charAt(0).toUpperCase() : 'N'
                        }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ schedule.center_name || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        <span v-if="schedule.institute_details">Inst: {{ schedule.institute_details.name_of_institution
                          || 'N/A' }}</span>
                        <span v-else>Center ID: {{ schedule.id }}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{
                    getVerificationdate(schedule)
                    }}
                  </div>
                  <!-- <div class="text-sm text-gray-500">
                    {{ formatTime(schedule.physical_verification_date) }}
                  </div> -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
                    :class="getStatusBadgeClass(schedule.physical_verification_status)">
                    <svg class="mr-1.5 h-3 w-3" :class="getStatusIconClass(schedule.physical_verification_status)"
                      fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="schedule.physical_verification_status === 'VERIFIED_PV'" fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                      <path v-else-if="schedule.physical_verification_status === 'NOT_VERIFIED_PV'" fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd" />
                      <path v-else fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clip-rule="evenodd" />
                    </svg>
                    {{ formatVerificationStatus(schedule.physical_verification_status) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div v-if="schedule.physical_verification_remarks" class="text-sm text-gray-900 whitespace-pre-wrap">
                    {{ schedule.physical_verification_remarks }}
                  </div>
                  <div v-else class="text-sm text-gray-400 italic">Report/Notes pending</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer Info -->
      <div v-if="!loading && schedules.length > 0" class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="text-sm text-blue-800">
            <p class="font-medium mb-1">About Site Visit Schedules</p>
            <ul class="list-disc list-inside space-y-1">
              <li>
                <span class="font-semibold">Pending (Scheduled):</span> The site visit has been
                scheduled. The date shown is the planned date.
              </li>
              <li>
                <span class="font-semibold">In Progress:</span> The site visit is currently underway
                or being processed by the officer.
              </li>
              <li>
                <span class="font-semibold">Verified & Recommended:</span> The site visit is
                complete, and the center is recommended.
              </li>
              <li>
                <span class="font-semibold">Verification Failed:</span> The site visit is complete,
                but the center was not recommended or failed verification.
              </li>
              <li>
                <span class="font-semibold">Not Required:</span> Physical verification was deemed
                not necessary for this center.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'

const schedules = ref([])
const loading = ref(true)
const errorMessage = ref('')
const toast = useToast()
const authStore = useAuthStore()

const verifiedCount = computed(
  () => schedules.value.filter((s) => s.physical_verification_status === 'VERIFIED_PV').length
)
const pendingVerificationCount = computed(
  () =>
    schedules.value.filter(
      (s) =>
        s.physical_verification_status === 'PENDING_PV' ||
        s.physical_verification_status === 'IN_PROGRESS_PV'
    ).length
)
const failedVerificationCount = computed(
  () => schedules.value.filter((s) => s.physical_verification_status === 'NOT_VERIFIED_PV').length
)

const formatDate = (dateString) => {
  if (!dateString) return 'Date TBD'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', dateString, error)
    return 'Error in Date'
  }
}

function getVerificationdate(schedule) {
  if (schedule.physical_verification_status === 'PENDING_PV') {
    return formatDate(schedule.site_visit_schedule_date)
  }
  else {
    return formatDate(schedule.physical_verification_date)
  }
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    if (
      date.getUTCHours() === 0 &&
      date.getUTCMinutes() === 0 &&
      date.getUTCSeconds() === 0 &&
      date.getUTCMilliseconds() === 0
    ) {
      if (typeof dateString === 'string' && dateString.length === 10) {
        return '(Time not specified)'
      }
    }
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch (error) {
    console.error('Error formatting time:', dateString, error)
    return ''
  }
}

const formatVerificationStatus = (statusKey) => {
  if (!statusKey) return 'Status Unknown'
  const statusMap = {
    PENDING_PV: 'Pending (Scheduled)',
    IN_PROGRESS_PV: 'In Progress',
    VERIFIED_PV: 'Verified & Recommended',
    NOT_VERIFIED_PV: 'Verification Failed',
    NOT_REQUIRED_PV: 'Not Required',
  }
  return (
    statusMap[statusKey] ||
    String(statusKey)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
  )
}

const getStatusRowClass = (statusKey) => {
  if (statusKey === 'VERIFIED_PV') return 'bg-green-50 hover:bg-green-100'
  if (statusKey === 'NOT_VERIFIED_PV') return 'bg-red-50 hover:bg-red-100'
  if (statusKey === 'PENDING_PV' || statusKey === 'IN_PROGRESS_PV')
    return 'bg-amber-50 hover:bg-amber-100'
  return 'hover:bg-gray-50'
}

const getStatusBadgeClass = (statusKey) => {
  if (statusKey === 'VERIFIED_PV') return 'bg-green-100 text-green-800 border-green-300'
  if (statusKey === 'NOT_VERIFIED_PV') return 'bg-red-100 text-red-800 border-red-300'
  if (statusKey === 'PENDING_PV' || statusKey === 'IN_PROGRESS_PV')
    return 'bg-amber-100 text-amber-800 border-amber-300'
  if (statusKey === 'NOT_REQUIRED_PV') return 'bg-blue-100 text-blue-800 border-blue-300'
  return 'bg-gray-100 text-gray-800 border-gray-300'
}

const getStatusIconClass = (statusKey) => {
  if (statusKey === 'VERIFIED_PV') return 'text-green-500'
  if (statusKey === 'NOT_VERIFIED_PV') return 'text-red-500'
  if (statusKey === 'PENDING_PV' || statusKey === 'IN_PROGRESS_PV') return 'text-amber-500'
  if (statusKey === 'NOT_REQUIRED_PV') return 'text-blue-500'
  return 'text-gray-500'
}

const fetchSchedules = async () => {
  loading.value = true
  errorMessage.value = ''
  schedules.value = []
  const userCid = authStore.user?.cid || authStore.user?.id
  try {
    // --- FIX APPLIED HERE ---
    // Changed from `getMhpcInstituteByCid` to the correct function `getMhpcTeachingCenterByCid`
    // which fetches the list of teaching centers and their schedules.
    const response = await apiServices.getMhpcTeachingCenterByCid(userCid)

    let centersData = []
    if (response && response.data && Array.isArray(response.data.results)) {
      centersData = response.data.results
    } else if (response && response.data && Array.isArray(response.data)) {
      centersData = response.data
    } else if (response && Array.isArray(response.results)) {
      centersData = response.results
    } else if (Array.isArray(response)) {
      centersData = response
    } else {
      console.error('Unexpected API response structure for centers:', response)
      throw new Error('Invalid data format received from server for teaching centers.')
    }

    schedules.value = centersData.filter((center) => {
      const showToUser = center.send_to_user === true
      const hasDate = !!center.physical_verification_date
      const isPendingOrInProgress =
        center.physical_verification_status === 'PENDING_PV' ||
        center.physical_verification_status === 'IN_PROGRESS_PV'
      // Only show schedules that are explicitly marked to be shown to the user.
      return showToUser && (hasDate || isPendingOrInProgress)
    })

    if (schedules.value.length > 0) {
      toast.success(
        `Successfully loaded ${schedules.value.length} published schedule${schedules.value.length === 1 ? '' : 's'
        }.`
      )
    }
  } catch (error) {
    console.error('Error fetching schedules:', error)
    let msg = 'An unexpected error occurred while loading schedules.'
    if (error.response) {
      msg = `Error ${error.response.status}: ${error.response.data?.detail || error.response.statusText || 'Server error'
        }`
    } else if (error.request) {
      msg = 'No response from server. Check network or if the server is running.'
    } else {
      msg = error.message
    }
    errorMessage.value = msg
    toast.error('Failed to load schedules. ' + msg)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSchedules()
})
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>