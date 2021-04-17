<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Application Tracking Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">CPD Application Trackings</h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Track the status of your CPD applications.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-lg text-gray-700">Loading applications...</span>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p class="font-bold">Error loading applications</p>
      <p>{{ error }}</p>
      <button
        @click="fetchApplications"
        class="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
      >
        Retry
      </button>
    </div>

    <!-- Approved Applications Notice -->
    <div
      v-if="hasApprovedApplicationsWithoutParticipants"
      class="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6"
    >
      <div class="flex items-start">
        <div class="shrink-0">
          <svg class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium">Attention: Approved CPD Applications Ready</h3>
          <div class="mt-1 text-sm">
            <p>
              You have {{ approvedApplicationsWithoutParticipants.length }} approved CPD
              application(s) that need participants. Click "Add Participants" under Actions to
              complete these applications.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && !error && applications.length === 0"
      class="bg-gray-50 rounded-xl p-8 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 mx-auto text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
      <p class="mt-1 text-gray-500">You haven't submitted any CPD applications yet.</p>
      <button
        @click="createNewApplication"
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Create New Application
      </button>
    </div>

    <!-- Search and Filter Controls -->
    <div
      v-if="!loading && !error && applications.length > 0"
      class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center"
    >
      <div class="flex items-center mb-4 sm:mb-0">
        <label for="search" class="mr-3 text-sm font-medium text-gray-700">Search:</label>
        <input
          type="text"
          id="search"
          v-model="searchTerm"
          class="block w-full sm:w-64 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          placeholder="Enter CPD title or ID"
        />
      </div>

      <div class="flex items-center">
        <label for="statusFilter" class="mr-3 text-sm font-medium text-gray-700">Status:</label>
        <select
          id="statusFilter"
          v-model="statusFilter"
          class="block w-full sm:w-auto rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="">All Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Needs Participants">Needs Participants</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Draft">Draft</option>
        </select>
      </div>
    </div>

    <!-- Application Table -->
    <div
      v-if="!loading && !error && applications.length > 0"
      class="bg-white border rounded-xl shadow-sm overflow-x-auto"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title of CPD
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Submission Date
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
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
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="application in filteredApplications"
            :key="application.id"
            :class="{ 'bg-green-50': isApprovedWithoutParticipants(application) }"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ application.id }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
              {{ application.title_of_cpd || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(application.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ application.is_cpd_approved ? 'Approved CPD' : 'New CPD' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  getStatusClass(application),
                ]"
              >
                {{ getStatusText(application) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button
                @click="viewApplication(application)"
                class="text-blue-600 hover:text-blue-900 focus:outline-none"
              >
                View
              </button>

              <button
                v-if="getStatusText(application) === 'Draft'"
                @click="editApplication(application)"
                class="text-green-600 hover:text-green-900 focus:outline-none"
              >
                Edit
              </button>

              <button
                v-if="isApprovedWithoutParticipants(application)"
                @click="addParticipants(application)"
                class="text-purple-600 hover:text-purple-900 focus:outline-none font-medium"
              >
                Add Participants
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- New Application Button -->
    <div v-if="!loading && applications.length > 0" class="mt-6 flex justify-end">
      <button
        @click="createNewApplication"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Create New Application
      </button>
    </div>

    <!-- Application View Modal -->
    <div
      v-if="showViewModal && selectedApplication"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">CPD Application Details</h2>
          <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Application Details -->
        <div class="space-y-6">
          <!-- Status Banner -->
          <div
            v-if="isApprovedWithoutParticipants(selectedApplication)"
            class="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <p>
                <strong>This application has been approved!</strong> You can now add participants to
                complete the process.
              </p>
            </div>
            <div class="mt-2 text-right">
              <button
                @click="addParticipants(selectedApplication)"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Participants
              </button>
            </div>
          </div>

          <!-- Basic Info -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-3">Basic Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Application ID</p>
                <p class="text-sm">{{ selectedApplication.id }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Status</p>
                <span
                  :class="[
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                    getStatusClass(selectedApplication),
                  ]"
                >
                  {{ getStatusText(selectedApplication) }}
                </span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Title of CPD</p>
                <p class="text-sm">{{ selectedApplication.title_of_cpd || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Type</p>
                <p class="text-sm">
                  {{ selectedApplication.is_cpd_approved ? 'Approved CPD' : 'New CPD' }}
                </p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Venue</p>
                <p class="text-sm">{{ selectedApplication.venue || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Duration</p>
                <p class="text-sm">
                  {{ formatDateRange(selectedApplication.from_date, selectedApplication.to_date) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Applicant Details -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-3">Applicant Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Registration Number</p>
                <p class="text-sm">{{ selectedApplication.registration_no || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Full Name</p>
                <p class="text-sm">{{ selectedApplication.full_name || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">CID Number</p>
                <p class="text-sm">{{ selectedApplication.cid_no || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Agency/Training Location</p>
                <p class="text-sm">{{ selectedApplication.proposed_training_location || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- CPD Details -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-3">CPD Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">CPD Credits</p>
                <p class="text-sm">{{ selectedApplication.credit || '0' }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Number of Participants</p>
                <p class="text-sm">{{ selectedApplication.number_of_participants || '0' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm font-medium text-gray-500">Objective/Expected Outcome</p>
                <p class="text-sm">{{ selectedApplication.expected_outcome || 'N/A' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-sm font-medium text-gray-500">Relevance to Profession</p>
                <p class="text-sm">{{ selectedApplication.relevance_to_topic || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Participant Section for Approved Applications -->
          <div
            v-if="selectedApplication.participants && selectedApplication.participants.length > 0"
            class="bg-gray-50 p-4 rounded-lg"
          >
            <h3 class="text-lg font-semibold mb-3">
              Participants ({{ selectedApplication.participants.length }})
            </h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Reg No
                    </th>
                    <th
                      scope="col"
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Credits
                    </th>
                    <th
                      scope="col"
                      class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(participant, index) in selectedApplication.participants" :key="index">
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {{ participant.participant_reg_no }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {{ participant.participant_name || 'N/A' }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {{ participant.cpd_credits }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      <span
                        :class="[
                          'px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full',
                          participant.review_status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : participant.review_status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800',
                        ]"
                      >
                        {{ participant.review_status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- If there are any comments from reviewers -->
          <div v-if="selectedApplication.feedback" class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-3">Reviewer Comments</h3>
            <p class="text-sm">{{ selectedApplication.feedback }}</p>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-4 mt-6">
            <button
              @click="closeViewModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              v-if="getStatusText(selectedApplication) === 'Draft'"
              @click="editApplication(selectedApplication)"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Edit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Reactive state
const applications = ref([])
const loading = ref(false)
const error = ref(null)
const searchTerm = ref('')
const statusFilter = ref('')
const showViewModal = ref(false)
const selectedApplication = ref(null)

// Computed properties for filtering applications
const filteredApplications = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  const statusTerm = statusFilter.value

  return applications.value.filter((app) => {
    // Title match
    const titleMatch = app.title_of_cpd ? app.title_of_cpd.toLowerCase().includes(term) : false

    // ID match
    const idMatch = app.id ? app.id.toString().toLowerCase().includes(term) : false

    // Status match
    let statusMatch = true
    if (statusTerm) {
      if (statusTerm === 'Needs Participants') {
        statusMatch = isApprovedWithoutParticipants(app)
      } else if (statusTerm === 'Completed') {
        statusMatch =
          app.review_status === 'Approved' && app.participants && app.participants.length > 0
      } else {
        const appStatus = getStatusText(app)
        statusMatch = appStatus === statusTerm
      }
    }

    return (titleMatch || idMatch || term === '') && statusMatch
  })
})

// Computed properties for approved applications
const approvedApplicationsWithoutParticipants = computed(() => {
  return applications.value.filter((app) => isApprovedWithoutParticipants(app))
})

const hasApprovedApplicationsWithoutParticipants = computed(() => {
  return approvedApplicationsWithoutParticipants.value.length > 0
})

// Helper function to check if an application is approved but needs participants
const isApprovedWithoutParticipants = (application) => {
  return (
    application.review_status === 'Approved' &&
    (!application.participants || application.participants.length === 0)
  )
}

// Fetch all CPD applications
const fetchApplications = async () => {
  try {
    loading.value = true
    error.value = null

    // Fetch CPD applications from the backend - single API call
    const response = await apiServicess.getMhpcCpdTask()

    // Process the response
    if (response.data && response.data.results) {
      applications.value = response.data.results
      console.log('Applications loaded:', applications.value.length)
    } else {
      error.value = 'No data received from server'
    }
  } catch (err) {
    console.error('Error fetching applications:', err)
    error.value = err.message || 'Failed to load applications'
  } finally {
    loading.value = false
  }
}

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (err) {
    console.error('Error formatting date:', err)
    return dateString
  }
}

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A'

  return `${formatDate(startDate)} to ${formatDate(endDate)}`
}

const getStatusText = (application) => {
  if (application.is_draft) {
    return 'Draft'
  }

  // Check if the application is under review (pending)
  if (!application.is_cpd_approved) {
    return 'Pending'
  }

  // If review_status is present and not pending, use it
  return 'Approved'
}

const getStatusClass = (application) => {
  const status = getStatusText(application)

  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-800'
    case 'Rejected':
      return 'bg-red-100 text-red-800'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'Draft':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// View application details
const viewApplication = (application) => {
  selectedApplication.value = application
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedApplication.value = null
}

// Edit application (navigate to edit page)
const editApplication = (application) => {
  // Hide modal if it's open
  showViewModal.value = false

  // Redirect to edit page with application ID
  router.push(
    `/admin/cme_cpd_provider/health_certification/cpd_application_details?id=${application.id}`,
  )
}

// Add participants to an approved application
const addParticipants = (application) => {
  // Close the modal if it's open
  if (showViewModal.value) {
    showViewModal.value = false
  }

  // Check if the application is actually approved
  if (application.review_status !== 'Approved') {
    toast.error(
      'This application is not yet approved. Participants can only be added to approved applications.',
    )
    return
  }

  // Navigate to the participants page with the application ID
  router.push(
    `/admin/cme_cpd_provider/health_certification/cpd_application_details?id=${application.id}&add_participants=true`,
  )
}

// Create new application (navigate to CPD provider form)
const createNewApplication = () => {
  router.push('/admin/cme_cpd_provider/health_certification/cpd_application_details')
}

// Fetch applications when component mounts
onMounted(() => {
  fetchApplications()
})
</script>
