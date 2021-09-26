<template>
  <div class="min-h-screen bg-gray-50 px-6 py-10">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <InstituteHeader
        class="flex-1"
        title="Your EOI Applications"
        subtitle="View and manage all your Expression of Interest applications"
        :show-actions="false"
      />
    </div>

    <div v-if="isLoading" class="flex justify-center my-12">
      <Loader class="inline-block animate-spin text-indigo-600 w-8 h-8" />
    </div>

    <div
      v-else-if="applications?.length > 0"
      class="bg-white shadow-xl rounded-2xl overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Institution / Course
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Submitted
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Application Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Remarks / Decision
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="application in applications"
              :key="application.CID || application.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ application.name_of_institution || 'N/A' }}
                </div>
                <div class="text-xs text-gray-500">
                  Course: {{ application.title_of_course || 'N/A' }}
                </div>
                <div class="text-xs text-gray-500 mt-0.5">
                  License: {{ application.CID || 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ application.created_at ? formatDate(application.created_at, true) : 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    getApplicationStatusColor(application.application_status),
                  ]"
                >
                  {{ mapApplicationStatus(application.application_status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs break-words">
                <div v-if="application.application_status === 'EOI Rejected'" class="text-red-600">
                  Reason: {{ application.reason_if_rejected || 'Reason not specified.' }}
                </div>
                <div
                  v-else-if="application.application_status === 'EOI Approved'"
                  class="text-green-700 font-medium"
                >
                  EOI Approved.
                  {{
                    application.remarks ||
                    'You may now proceed to prepare and submit the Detailed Project Report (DPR).'
                  }}
                </div>
                <div
                  v-else-if="
                    application.application_status &&
                    application.application_status.toLowerCase().includes('pending')
                  "
                  class="text-yellow-700 font-medium"
                >
                  {{ application.remarks || 'Application is under review.' }}
                </div>
                <div
                  v-else-if="
                    application.application_status === 'DPR Submitted' ||
                    application.application_status === 'DPR Approved' ||
                    application.application_status === 'DPR Rejected'
                  "
                  class="text-blue-700 font-medium"
                >
                  {{ application.remarks || 'DPR stage in progress.' }}
                </div>
                <div v-else-if="application.remarks" class="text-gray-500">
                  {{ application.remarks }}
                </div>
                <div v-else class="text-gray-500 italic">No specific remarks.</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-else-if="!isLoading && !apiError"
      class="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xl"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-800">No EOI applications found.</h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by submitting your first Expression of Interest.
      </p>
      <div class="mt-6">
        <button @click="openEoiModal" class="btn btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          Submit Your First EOI
        </button>
      </div>
    </div>
    <div
      v-else-if="apiError"
      class="text-center py-16 bg-red-50 rounded-2xl border border-red-200 shadow-xl"
    >
      <svg
        class="mx-auto h-12 w-12 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-red-800">Error Fetching Applications</h3>
      <p class="mt-1 text-sm text-red-600">{{ errorMessage }}</p>
      <div class="mt-6">
        <button @click="fetchApplications" class="btn btn-outline">
          <!-- Added retry button -->
          Try Again
        </button>
      </div>
    </div>

    <!-- EOI Application Modal -->
    <InstituteEoiApplication
      v-model:modelValue="showEoiModal"
      @application-submitted="handleApplicationSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { Loader, PlusIcon } from 'lucide-vue-next'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue' // Adjust path
import InstituteEoiApplication from './InstituteEoiApplication.vue' // Adjust path

const applications = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const errorMessage = ref('')
const showEoiModal = ref(false)

const authStore = useAuthStore()

const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A'
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    if (includeTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }

    // For "YYYY-MM-DD" strings, ensure they are treated as UTC to avoid off-by-one errors
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number)
      const dateObj = new Date(Date.UTC(year, month - 1, day))
      if (isNaN(dateObj.getTime())) return 'Invalid Date'
      options.timeZone = 'UTC' // Format in UTC
      return new Intl.DateTimeFormat('en-US', options).format(dateObj)
    }

    // For full ISO strings or other date objects
    const dateObj = new Date(dateString)
    if (isNaN(dateObj.getTime())) return 'Invalid Date'
    return new Intl.DateTimeFormat('en-US', options).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', dateString, error)
    return 'Invalid Date'
  }
}

const mapApplicationStatus = (status) => {
  if (!status) return 'Unknown'
  const statusMap = {
    Draft: 'Draft',
    'EOI Submitted': 'EOI Submitted',
    'EOI Pending Review': 'Pending EOI Review',
    'EOI Pending Physical Verification': 'Pending Verification',
    'EOI Approved': 'EOI Approved',
    'EOI Rejected': 'EOI Rejected',
    'DPR Submitted': 'DPR Submitted',
    'DPR Pending Review': 'Pending DPR Review',
    'DPR Approved': 'DPR Approved',
    'DPR Rejected': 'DPR Rejected',
    'Payment Pending': 'Payment Pending',
    'Fully Approved': 'Accredited', // Changed for user clarity
    'Final Rejected': 'Application Rejected', // Changed for user clarity
  }
  return statusMap[status] || status
}

const getApplicationStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  const s = status.toLowerCase()

  if (s === 'eoi approved' || s === 'dpr approved' || s === 'fully approved' || s === 'accredited')
    return 'bg-green-100 text-green-800'
  if (s.includes('rejected')) return 'bg-red-100 text-red-800'
  if (s.includes('pending') || s.includes('submitted') || s.includes('draft'))
    return 'bg-yellow-100 text-yellow-800'
  if (s.includes('dpr')) return 'bg-blue-100 text-blue-800'
  return 'bg-gray-100 text-gray-800'
}

const fetchApplications = async () => {
  const userCid = authStore.user?.cid || authStore.user?.license_number
  if (!authStore.user || !authStore.user.cid) {
    errorMessage.value = 'User information not available. Please log in again.'
    apiError.value = true
    isLoading.value = false
    applications.value = []
    return
  }

  isLoading.value = true
  apiError.value = false
  errorMessage.value = ''

  try {
    const response = await apiServices.getMhpcInstituteByCid(userCid)

    if (response && response.data) {
      // Case 1: The response is a paginated list (the original expectation)
      if (Array.isArray(response.data.results)) {
        applications.value = response.data.results

        // Case 2: The response is a single object (what you're currently getting)
      } else if (response.data.id) {
        // Wrap the single object in an array
        applications.value = [response.data]

        // Case 3: Response is valid but empty/unexpected
      } else {
        applications.value = []
      }
    } else {
      applications.value = []
    }

    // You can remove the original client-side filtering and sorting
    // if the API is already returning only the correct user's data.
    // Let's assume you still want to sort:
    applications.value.sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at) : new Date(a.created_at)
      const dateB = b.updated_at ? new Date(b.updated_at) : new Date(b.created_at)
      return dateB - dateA // Newest first
    })
  } catch (error) {
    console.error('Error fetching EOI applications:', error)
    applications.value = []
    apiError.value = true
    let detail = 'An unexpected error occurred.'
    if (error.response) {
      if (error.response.data) {
        if (typeof error.response.data.detail === 'string') {
          detail = error.response.data.detail
        } else if (typeof error.response.data.message === 'string') {
          detail = error.response.data.message
        } else if (typeof error.response.data === 'string') {
          detail = error.response.data
        } else {
          // Try to extract from nested errors if any
          const firstErrorKey = Object.keys(error.response.data)[0]
          if (firstErrorKey && Array.isArray(error.response.data[firstErrorKey])) {
            detail = `${firstErrorKey}: ${error.response.data[firstErrorKey][0]}`
          }
        }
      } else if (error.response.statusText) {
        detail = error.response.statusText
      }
    } else if (error.message) {
      detail = error.message
    }
    errorMessage.value = `Failed to fetch applications: ${detail}`
  } finally {
    isLoading.value = false
  }
}

const openEoiModal = () => {
  showEoiModal.value = true
}

const handleApplicationSubmitted = () => {
  fetchApplications()
}

onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2 px-4 sm:py-2.5 sm:px-5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-outline {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}
.max-w-xs {
  max-width: 20rem; /* For remarks column */
}
.truncate {
  /* Default truncation */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
