<!-- UserInstitutionComplianceView.vue -->
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto">
      <!-- Header with Title -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          Non-Compliance Records for Your Institution
        </h2>
        <p class="mt-2 text-gray-600">
          Review and respond to compliance issues for your organization
        </p>
      </div>

      <!-- Filter/Search bar -->
      <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                v-model.trim="searchQuery"
                class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by category or details..."
              />
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select
              v-model="statusFilter"
              class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Action Required</option>
              <option value="inProgress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-100 rounded-full p-3">
              <svg
                class="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">{{ pendingCount }}</h3>
              <p class="text-sm text-gray-500">Action Required</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-full p-3">
              <svg
                class="h-6 w-6 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">{{ inProgressCount }}</h3>
              <p class="text-sm text-gray-500">In Progress</p>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-full p-3">
              <svg
                class="h-6 w-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">{{ resolvedCount }}</h3>
              <p class="text-sm text-gray-500">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <svg
          class="animate-spin h-8 w-8 text-blue-500"
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
      </div>

      <!-- Non-Compliance Records Cards -->
      <div v-else-if="filteredRecords.length > 0" class="space-y-4">
        <div
          v-for="record in filteredRecords"
          :key="record.id"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
        >
          <div class="p-5">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div class="flex items-center mb-2 md:mb-0">
                <span :class="getCategoryClasses(record.categoryOfIssue)" class="mr-3">
                  {{ record.categoryOfIssue }}
                </span>
                <span :class="getStatusClasses(record.status)">
                  {{ getStatusDisplay(record.status) }}
                </span>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="viewRecord(record.id)"
                  class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg shadow-sm transition-colors duration-200 flex items-center text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Details
                </button>
                <button
                  v-if="record.status !== 'resolved'"
                  @click="respondToRecord(record.id)"
                  class="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded-lg shadow-sm transition-colors duration-200 flex items-center text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  Respond
                </button>
              </div>
            </div>

            <h3 class="text-gray-800 font-medium text-lg mb-3 line-clamp-1">
              {{ record.nonComplianceDetails }}
            </h3>

            <div class="text-sm text-gray-500 mb-4">
              <strong>Corrective Measures Required:</strong>
              <p class="mt-1 line-clamp-2">{{ record.correctiveMeasuresRequired }}</p>
            </div>

            <div
              v-if="record.correctedActionReport"
              class="text-sm text-gray-600 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <strong>Your Response:</strong>
              <p class="mt-1 line-clamp-2">{{ record.correctedActionReport }}</p>
            </div>

            <div class="flex justify-between items-center mt-4 text-xs text-gray-500">
              <span v-if="record.branchEcpf"> Branch: {{ record.branchEcpf }} </span>
              <span> ID: {{ record.id }} </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-gray-300 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No non-compliance records found</h3>
        <p class="text-gray-500">
          {{
            searchQuery || statusFilter
              ? 'Try adjusting your filters to see more results'
              : 'Your institution has no non-compliance records at this time'
          }}
        </p>
      </div>

      <!-- View Non-Compliance Record Modal -->
      <div
        v-if="viewingRecord"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto p-6 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center border-b pb-3 mb-4">
            <h2 class="text-xl font-bold text-gray-800">Non-Compliance Record Details</h2>
            <button @click="closeViewRecord" class="text-gray-400 hover:text-gray-600">
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

          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <span :class="getCategoryClasses(viewingRecord.categoryOfIssue)">
                {{ viewingRecord.categoryOfIssue }}
              </span>
              <span :class="getStatusClasses(viewingRecord.status)">
                {{ getStatusDisplay(viewingRecord.status) }}
              </span>
            </div>

            <div v-if="viewingRecord.branchEcpf">
              <p class="text-sm text-gray-500">Branch</p>
              <p class="font-medium">{{ viewingRecord.branchEcpf }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Non-Compliance Details</p>
              <p class="font-medium">{{ viewingRecord.nonComplianceDetails }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Corrective Measures Required</p>
              <p class="font-medium">{{ viewingRecord.correctiveMeasuresRequired }}</p>
            </div>

            <div v-if="viewingRecord.correctedActionReport">
              <p class="text-sm text-gray-500">Your Corrective Action Report</p>
              <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p class="text-sm">{{ viewingRecord.correctedActionReport }}</p>
              </div>
            </div>

            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4">
              <h3 class="font-medium text-gray-700 mb-2">Status Timeline</h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <div class="flex-shrink-0">
                    <span
                      class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Non-compliance reported</p>
                  </div>
                </li>

                <li v-if="viewingRecord.correctedActionReport" class="flex items-start">
                  <div class="flex-shrink-0">
                    <span
                      class="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Your response submitted</p>
                  </div>
                </li>

                <li v-if="viewingRecord.status === 'resolved'" class="flex items-start">
                  <div class="flex-shrink-0">
                    <span
                      class="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Issue resolved</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              v-if="viewingRecord.status !== 'resolved'"
              @click="respondToRecord(viewingRecord.id)"
              class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 mr-3"
            >
              Respond to Issue
            </button>
            <button
              @click="closeViewRecord"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Respond to Non-Compliance Modal -->
      <div
        v-if="showResponseModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto p-6 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center border-b pb-3 mb-4">
            <h2 class="text-xl font-bold text-gray-800">Respond to Non-Compliance Issue</h2>
            <button @click="closeResponseModal" class="text-gray-400 hover:text-gray-600">
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

          <div class="space-y-4">
            <div v-if="respondingRecord">
              <div class="mb-4">
                <p class="text-sm text-gray-500 mb-1">Issue Category</p>
                <p>
                  <span :class="getCategoryClasses(respondingRecord.categoryOfIssue)">
                    {{ respondingRecord.categoryOfIssue }}
                  </span>
                </p>
              </div>

              <div class="mb-4">
                <p class="text-sm text-gray-500 mb-1">Non-Compliance Details</p>
                <div class="text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {{ respondingRecord.nonComplianceDetails }}
                </div>
              </div>

              <div class="mb-4">
                <p class="text-sm text-gray-500 mb-1">Corrective Measures Required</p>
                <div class="text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {{ respondingRecord.correctiveMeasuresRequired }}
                </div>
              </div>

              <div class="mb-4">
                <label
                  for="correctedActionReport"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Corrective Action Report*
                </label>
                <textarea
                  id="correctedActionReport"
                  v-model="responseForm.correctedActionReport"
                  rows="5"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the actions you have taken or plan to take to address this issue..."
                  required
                ></textarea>
                <p class="mt-1 text-xs text-gray-500">
                  Please provide details on how you are addressing the required corrective measures.
                </p>
              </div>

              <div class="mb-4">
                <label for="currentStatus" class="block text-sm font-medium text-gray-700 mb-1">
                  Current Status*
                </label>
                <select
                  id="currentStatus"
                  v-model="responseForm.status"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="inProgress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click="closeResponseModal"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 mr-3"
            >
              Cancel
            </button>
            <button
              @click="submitResponse"
              class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
              :disabled="!responseForm.correctedActionReport"
            >
              Submit Response
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiServices from '@/services/services' // Import your API service

// State
const searchQuery = ref('')
const statusFilter = ref('')
const nonComplianceRecords = ref([])
const viewingRecord = ref(null)
const respondingRecord = ref(null)
const showResponseModal = ref(false)
const loading = ref(true)

// Response form
const responseForm = ref({
  correctedActionReport: '',
  status: 'inProgress',
})

// Category mapping from API numbers to display strings
const categoryMap = {
  0: 'Environmental',
  1: 'Social',
  2: 'Governance',
  3: 'HR',
  4: 'Operational',
}

// Helper function to convert API data structure to component format
const mapApiRecordToComponentFormat = (apiRecord) => {
  // Extract the first detail item (if available)
  const detail = apiRecord.details && apiRecord.details.length > 0 ? apiRecord.details[0] : {}

  // Determine status based on action report and action taken values
  let status = 'pending'
  if (detail.corrected_action_report) {
    status = detail.action_taken === 1 ? 'resolved' : 'inProgress'
  }

  // Map API record to our component format
  return {
    id: apiRecord.id,
    ecpfName: apiRecord.ecpf_profile_name,
    branchEcpf: apiRecord.branch_name,
    ecpfProfileId: apiRecord.ecpf_profile,
    branchId: apiRecord.branch,
    categoryOfIssue: categoryMap[detail.category_of_issue] || 'Unknown',
    nonComplianceDetails: detail.non_compliance_details || '',
    correctiveMeasuresRequired: detail.corrective_measures_required || '',
    correctedActionReport: detail.corrected_action_report || '',
    action: detail.action || '',
    actionTaken: detail.action_taken || '',
    status: status,
    detailId: detail.id,
    nonComplianceId: detail.non_compliance,
  }
}

// Helper function to convert component format back to API structure
const mapComponentFormatToApiRecord = (componentRecord) => {
  // Find the category ID based on the category name
  const categoryId =
    Object.keys(categoryMap).find((key) => categoryMap[key] === componentRecord.categoryOfIssue) ||
    0

  // Map our component format back to API structure
  return {
    id: componentRecord.id,
    ecpf_profile_name: componentRecord.ecpfName,
    branch_name: componentRecord.branchEcpf || '',
    ecpf_profile: componentRecord.ecpfProfileId,
    branch: componentRecord.branchId,
    details: [
      {
        id: componentRecord.detailId,
        non_compliance_details: componentRecord.nonComplianceDetails,
        corrective_measures_required: componentRecord.correctiveMeasuresRequired || '',
        corrected_action_report: componentRecord.correctedActionReport || '',
        non_compliance: componentRecord.nonComplianceId,
        category_of_issue: Number(categoryId),
        action: componentRecord.action || '',
        action_taken: componentRecord.status === 'resolved' ? 1 : 0,
      },
    ],
  }
}

// Filtered Records
const filteredRecords = computed(() => {
  const search = searchQuery.value.toLowerCase()
  const status = statusFilter.value

  return nonComplianceRecords.value.filter((record) => {
    const matchesSearch =
      record.categoryOfIssue.toLowerCase().includes(search) ||
      record.nonComplianceDetails.toLowerCase().includes(search)

    const matchesStatus = !status || record.status === status

    return matchesSearch && matchesStatus
  })
})

// Counts for statistics
const pendingCount = computed(
  () => nonComplianceRecords.value.filter((record) => record.status === 'pending').length,
)

const inProgressCount = computed(
  () => nonComplianceRecords.value.filter((record) => record.status === 'inProgress').length,
)

const resolvedCount = computed(
  () => nonComplianceRecords.value.filter((record) => record.status === 'resolved').length,
)

// --- Functions ---
const fetchRecords = async () => {
  loading.value = true
  try {
    // Here we would use the user's institution ID to filter records
    // For example: getUserInstitutionRecords(userInstitutionId)
    // For now, we're using the generic endpoint
    const response = await apiServices.getEcpfNonCompliances()
    console.log('API Response:', response)

    if (Array.isArray(response.data.results)) {
      // Filter for the current user's institution only
      // In a real implementation, this filtering would likely be done on the backend
      const userEcpfProfileId = getUserEcpfProfileId() // Get the user's ECPF profile ID

      // Filter records that belong to the user's ECPF profile
      const userRecords = response.data.results.filter(
        (record) => record.ecpf_profile === userEcpfProfileId,
      )

      // Map the filtered API response to our component format
      nonComplianceRecords.value = userRecords.map(mapApiRecordToComponentFormat)
    } else {
      console.error('API response data is not an array:', response.data.results)
      nonComplianceRecords.value = []
    }
  } catch (error) {
    console.error('Error fetching non-compliance records:', error)
    nonComplianceRecords.value = []
  } finally {
    loading.value = false
  }
}

// Function to get the current user's ECPF profile ID
// This would need to be implemented based on your authentication system
const getUserEcpfProfileId = () => {
  // In a real implementation, you would get this from your auth context or user session
  // For example:
  // return authContext.userEcpfProfileId;

  // For now, as a placeholder:
  // 1. You could hardcode a value for testing
  // 2. You could retrieve it from localStorage if previously stored
  // 3. You could make an API call to get the current user's profile

  // Placeholder implementation - replace with your actual implementation
  return localStorage.getItem('userEcpfProfileId') || 1 // Default to ID 1 for testing
}

onMounted(() => {
  fetchRecords()
})

const viewRecord = (id) => {
  const record = nonComplianceRecords.value.find((r) => r.id === id)
  if (record) {
    viewingRecord.value = record
  }
}

const closeViewRecord = () => {
  viewingRecord.value = null
}

const respondToRecord = (id) => {
  const record = nonComplianceRecords.value.find((r) => r.id === id)
  if (record) {
    respondingRecord.value = record
    responseForm.value.correctedActionReport = record.correctedActionReport || ''
    responseForm.value.status = record.status === 'pending' ? 'inProgress' : record.status
    showResponseModal.value = true
    // Close the view modal if it's open
    viewingRecord.value = null
  }
}

const closeResponseModal = () => {
  showResponseModal.value = false
  respondingRecord.value = null
}

const submitResponse = async () => {
  if (!respondingRecord.value || !responseForm.value.correctedActionReport) return

  try {
    // Create a copy of the record
    const updatedRecord = { ...respondingRecord.value }

    // Update with form data
    updatedRecord.correctedActionReport = responseForm.value.correctedActionReport
    updatedRecord.status = responseForm.value.status
    updatedRecord.actionTaken = responseForm.value.status === 'resolved' ? 1 : 0

    // Convert to API format
    const apiData = mapComponentFormatToApiRecord(updatedRecord)

    // Send the update to the API
    await apiServices.updateEcpfNonCompliance(respondingRecord.value.id, apiData)

    // Update the local record
    const index = nonComplianceRecords.value.findIndex((r) => r.id === respondingRecord.value.id)
    if (index !== -1) {
      nonComplianceRecords.value[index] = updatedRecord
    }

    closeResponseModal()

    // Refresh records to get latest data
    fetchRecords()
  } catch (error) {
    console.error('Error submitting response:', error)
    // Show error message to user
  }
}

const getCategoryClasses = (category) => {
  return [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block',
    {
      'bg-blue-100 text-blue-800': category === 'Environmental',
      'bg-yellow-100 text-yellow-800': category === 'HR',
      'bg-green-100 text-green-800': category === 'Operational',
      'bg-red-100 text-red-800': category === 'Governance',
      'bg-purple-100 text-purple-800': category === 'Social',
    },
  ]
}

const getStatusClasses = (status) => {
  return [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block',
    {
      'bg-red-100 text-red-800': status === 'pending',
      'bg-blue-100 text-blue-800': status === 'inProgress',
      'bg-green-100 text-green-800': status === 'resolved',
    },
  ]
}

const getStatusDisplay = (status) => {
  switch (status) {
    case 'pending':
      return 'Action Required'
    case 'inProgress':
      return 'In Progress'
    case 'resolved':
      return 'Resolved'
    default:
      return status
  }
}
</script>
