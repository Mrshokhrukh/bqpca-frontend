<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">
      Complaints Against {{ professionalName || 'Me' }}
    </h1>

    <div
      v-if="globalError"
      class="p-4 mb-4 text-sm bg-red-100 text-red-700 rounded-lg"
      role="alert"
    >
      {{ globalError }}
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <svg
        class="animate-spin h-8 w-8 text-blue-600 mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="mt-2 text-gray-600">Loading complaints...</p>
    </div>

    <div v-else>
      <div v-if="complaints.length > 0">
        <div
          class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6"
          role="alert"
        >
          <p class="font-bold">Important Notice</p>
          <p>
            You have **{{ complaints.length }} complaint{{ complaints.length === 1 ? '' : 's' }}**
            filed against you. Please review the details below. It is advisable to contact the legal
            officer at your earliest convenience to discuss resolution. Depending on the nature and
            status of these complaints, your ability to apply for new certifications or renewals may
            be affected.
          </p>
        </div>

        <div class="bg-white shadow-md rounded-lg overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Complaint ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subject
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date Filed
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
                  Incident Date
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Details & Attachment
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="complaint in complaints" :key="complaint.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ complaint.complaint_id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ complaint.subject }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(complaint.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(complaint.status)"
                  >
                    {{ complaint.status_display || complaint.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{
                    complaint.incident_datetime
                      ? formatDate(complaint.incident_datetime, true)
                      : 'N/A'
                  }}
                </td>
                <td class="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">
                  <details class="group">
                    <summary
                      class="cursor-pointer text-blue-600 hover:text-blue-800 group-open:mb-2"
                    >
                      View Grievance
                    </summary>
                    <div
                      class="text-xs p-2 bg-gray-100 rounded break-words prose prose-sm max-w-none"
                    >
                      <p
                        v-html="
                          formatGrievance(complaint.grievance_details) || 'No details provided.'
                        "
                      ></p>
                    </div>
                    <div v-if="complaint.attachment" class="mt-2">
                      <a
                        :href="complaint.attachment"
                        target="_blank"
                        class="text-blue-500 hover:underline text-xs"
                      >
                        View Attachment ({{ getFileName(complaint.attachment) }})
                      </a>
                    </div>
                  </details>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
        <p class="font-bold">No Complaints Found</p>
        <p>There are currently no complaints registered against your profile.</p>
      </div>

      <div class="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Next Steps</h2>
        <p class="text-sm text-gray-600">
          For any listed complaint,it is crucial to **contact the legal officer immediately** to
          clarify and discuss the resolution process for that specific issue.
        </p>
        <p class="text-sm text-gray-600 mt-2">
          Please be aware that unresolved serious complaints may impact your ability to apply for
          new services or renew existing certifications.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'UserComplaints' })
import { ref, onMounted } from 'vue'
import apiService from '@/services/services' // Your API service import

const complaints = ref([])
const professionalName = ref('') // This will now be populated from the backend response
const isLoading = ref(true)
const globalError = ref('')

// --- Helper Functions ---
const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A'
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    if (includeTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  } catch (e) {
    console.error('Error formatting date:', e)
    return dateString
  }
}

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  const lowerStatus = status.toLowerCase()
  if (
    lowerStatus === 'investigation' ||
    lowerStatus === 'action_pending' ||
    lowerStatus === 'action pending'
  ) {
    return 'bg-red-100 text-red-800'
  }
  if (lowerStatus === 'resolved' || lowerStatus === 'closed') {
    return 'bg-green-100 text-green-800'
  }
  if (lowerStatus === 'under_review' || lowerStatus === 'under review') {
    return 'bg-yellow-100 text-yellow-800'
  }
  return 'bg-blue-100 text-blue-800'
}

const formatGrievance = (text) => {
  if (!text) return ''
  return text.replace(/\n/g, '<br>')
}

const getFileName = (url) => {
  if (!url) return ''
  try {
    // Basic file name extraction, might need to be more robust
    const decodedUrl = decodeURIComponent(url)
    return decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1)
  } catch {
    return 'Attachment'
  }
}

// --- API Call ---
const fetchMyComplaints = async () => {
  isLoading.value = true
  globalError.value = ''
  try {
    // This call will now be filtered by the backend based on the authenticated user's email
    const response = await apiService.getComplaints()

    if (response.data && Array.isArray(response.data.results)) {
      complaints.value = response.data.results
      // professionalName now comes from the backend's `list` method
      if (response.data.professional_name) {
        professionalName.value = response.data.professional_name
      }
    } else if (Array.isArray(response.data)) {
      // Fallback if API returns just an array (less likely with ViewSet)
      complaints.value = response.data
    } else {
      console.error('Unexpected API response structure:', response.data)
      complaints.value = []
      globalError.value = 'Received an unexpected data format for complaints.'
    }
  } catch (error) {
    console.error('Error fetching complaints:', error)
    let errorMessage = 'Could not load your complaints. Please try again later.'
    if (error.response && error.response.data && error.response.data.detail) {
      errorMessage = error.response.data.detail
    } else if (error.message) {
      errorMessage = error.message
    }
    globalError.value = errorMessage
    complaints.value = []
  } finally {
    isLoading.value = false
  }
}

// --- Lifecycle Hook ---
onMounted(() => {
  fetchMyComplaints()
})
</script>

<style scoped>
/* You can add component-specific styles here if needed */
.prose p {
  margin-bottom: 0.5em;
}
.prose p:last-child {
  margin-bottom: 0;
}
</style>
