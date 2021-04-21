<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">New Applications</h1>

      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <!-- Search and Filter Section -->
        <div class="mb-6 space-y-4">
          <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <h2 class="text-xl font-semibold text-slate-900">Applications List</h2>

            <div class="flex flex-col sm:flex-row gap-3">
              <!-- Status Filter -->
              <select
                v-model="statusFilter"
                class="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <!-- Date Filter -->
              <input
                type="date"
                v-model="dateFilter"
                class="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <!-- Clear Filters Button -->
              <button
                @click="clearFilters"
                class="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search applications by name, ID, or email..."
              class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              class="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Applications Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Application ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Applicant Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Application Type
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Submission Date
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr
                v-for="application in paginatedApplications"
                :key="application.id"
                class="hover:bg-blue-50/30 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {{ application.application_id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {{ application.applicant_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {{ application.application_type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {{ formatDate(application.submission_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(application.status)}`"
                  >
                    {{ application.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end">
                    <button
                      @click="viewApplication(application)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md mr-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredApplications.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-slate-500">
                  No applications found
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Previous
          </button>
          <span class="px-3 py-1 text-sm text-slate-600">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Application Details Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            @click="closeModal"
          ></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
            >&#8203;</span
          >

          <div
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Application Details
                  </h3>
                  <div class="mt-4 space-y-4">
                    <div v-if="selectedApplication">
                      <div class="grid grid-cols-1 gap-4">
                        <div class="border-b pb-3">
                          <p class="text-sm font-medium text-gray-500">Application ID</p>
                          <p class="mt-1 text-sm text-gray-900">
                            {{ selectedApplication.application_id }}
                          </p>
                        </div>
                        <div class="border-b pb-3">
                          <p class="text-sm font-medium text-gray-500">Applicant Name</p>
                          <p class="mt-1 text-sm text-gray-900">
                            {{ selectedApplication.applicant_name }}
                          </p>
                        </div>
                        <div class="border-b pb-3">
                          <p class="text-sm font-medium text-gray-500">Application Type</p>
                          <p class="mt-1 text-sm text-gray-900">
                            {{ selectedApplication.application_type }}
                          </p>
                        </div>
                        <div class="border-b pb-3">
                          <p class="text-sm font-medium text-gray-500">Submission Date</p>
                          <p class="mt-1 text-sm text-gray-900">
                            {{ formatDate(selectedApplication.submission_date) }}
                          </p>
                        </div>
                        <div class="border-b pb-3">
                          <p class="text-sm font-medium text-gray-500">Status</p>
                          <p class="mt-1">
                            <span
                              :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(selectedApplication.status)}`"
                            >
                              {{ selectedApplication.status }}
                            </span>
                          </p>
                        </div>
                        <div class="border-b pb-3">
                          <p class="text-sm font-medium text-gray-500">Email</p>
                          <p class="mt-1 text-sm text-gray-900">{{ selectedApplication.email }}</p>
                        </div>
                        <div class="border-b pb-3">
                          <p class="text-sm font-medium text-gray-500">Contact Number</p>
                          <p class="mt-1 text-sm text-gray-900">
                            {{ selectedApplication.contact_number }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-500">Notes</p>
                          <p class="mt-1 text-sm text-gray-900">
                            {{ selectedApplication.notes || 'No notes available' }}
                          </p>
                        </div>
                      </div>

                      <!-- Update Status Section -->
                      <div class="mt-6 border-t pt-4">
                        <h4 class="text-md font-medium text-gray-900">Update Application Status</h4>
                        <div class="mt-3 flex flex-col space-y-3">
                          <select
                            v-model="newStatus"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_review">In Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="on_hold">On Hold</option>
                          </select>
                          <textarea
                            v-model="statusNote"
                            placeholder="Add a note (optional)"
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                @click="updateApplicationStatus"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Update Status
              </button>
              <button
                @click="closeModal"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import apiServices from '@/services/services'

// State
const applications = ref([])
const searchQuery = ref('')
const statusFilter = ref('all')
const dateFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const showModal = ref(false)
const selectedApplication = ref(null)
const newStatus = ref('')
const statusNote = ref('')

// Fetch applications on component mount
onMounted(async () => {
  try {
    const response = await apiServices.getMhpcNewApplications()
    if (Array.isArray(response.data.results)) {
      applications.value = response.data.results
    } else {
      console.error('API did not return an array of results.')
      applications.value = [] // Initialize to an empty array to prevent further errors
    }
  } catch (error) {
    console.error('Error fetching applications:', error)
    applications.value = [] // Initialize to an empty array in case of error
  }
})

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'in_review':
      return 'bg-blue-100 text-blue-800'
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'on_hold':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Computed
const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    const searchMatch =
      searchQuery.value === '' ||
      app.application_id?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.applicant_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const statusMatch =
      statusFilter.value === 'all' || app.status?.toLowerCase() === statusFilter.value.toLowerCase()

    let dateMatch = true
    if (dateFilter.value) {
      const filterDate = new Date(dateFilter.value).setHours(0, 0, 0, 0)
      const appDate = new Date(app.submission_date).setHours(0, 0, 0, 0)
      dateMatch = appDate === filterDate
    }

    return searchMatch && statusMatch && dateMatch
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredApplications.value.length / itemsPerPage)
})

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredApplications.value.slice(start, end)
})

// Methods
const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  dateFilter.value = ''
}

const viewApplication = (application) => {
  selectedApplication.value = application
  newStatus.value = application.status || 'pending'
  statusNote.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedApplication.value = null
}

const updateApplicationStatus = async () => {
  if (!selectedApplication.value) return

  try {
    const updatedApplication = {
      ...selectedApplication.value,
      status: newStatus.value,
    }

    if (statusNote.value.trim()) {
      updatedApplication.notes = `${selectedApplication.value.notes ? selectedApplication.value.notes + '\n\n' : ''}[${new Date().toLocaleString()}] Status update to ${newStatus.value}: ${statusNote.value}`
    }

    const response = await apiServices.updateMhpcNewApplication(
      selectedApplication.value.id,
      updatedApplication,
    )

    // Update local state
    const index = applications.value.findIndex((app) => app.id === selectedApplication.value.id)
    if (index !== -1) {
      applications.value[index] = response.data
    }

    closeModal()
  } catch (error) {
    console.error('Error updating application status:', error)
  }
}

// Watch for filter changes to reset pagination
watch([searchQuery, statusFilter, dateFilter], () => {
  currentPage.value = 1
})
</script>

<style scoped>
/* Add any specific styles here */
</style>
