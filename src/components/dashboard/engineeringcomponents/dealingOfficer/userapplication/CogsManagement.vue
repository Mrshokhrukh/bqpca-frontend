<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Enhanced Header Section with Gradient -->
      <div
        class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10 shadow-md"
      >
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Certificate of Good Standing Applications
            </h1>
            <p class="text-gray-600">Manage and review COGS applications.</p>
          </div>
          <div class="flex space-x-4">
            <div class="relative">
              <input
                v-model.trim="searchQuery"
                type="text"
                placeholder="Search by name, CID, or registration number..."
                class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80 shadow-sm"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon class="w-5 h-5" />
              </span>
            </div>
            <select
              v-model="statusFilter"
              class="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Enhanced Stats Summary (New Addition) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 mr-4">
              <ClipboardCheckIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Total Applications</p>
              <p class="text-2xl font-bold text-gray-900">{{ applications.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 mr-4">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Pending</p>
              <p class="text-2xl font-bold text-gray-900">{{ getPendingCount() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 mr-4">
              <CheckCircleIcon class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Approved</p>
              <p class="text-2xl font-bold text-gray-900">{{ getApprovedCount() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-md border-l-4 border-red-500">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 mr-4">
              <XCircleIcon class="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Rejected</p>
              <p class="text-2xl font-bold text-gray-900">{{ getRejectedCount() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State with Improved Animation -->
      <div
        v-if="isLoading"
        class="flex flex-col justify-center items-center py-16 bg-white rounded-xl shadow-md"
      >
        <Loader2Icon class="w-12 h-12 animate-spin text-blue-500 mb-4" />
        <p class="text-gray-600 font-medium">Loading applications...</p>
      </div>

      <!-- Enhanced Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 mb-6 shadow-md"
      >
        <div class="flex items-center">
          <CircleAlert class="w-8 h-8 text-red-500 mr-4" />
          <div>
            <h3 class="text-lg font-bold text-red-800">An error occurred</h3>
            <p class="text-red-700 mt-1">{{ error }}</p>
            <button
              @click="fetchData"
              class="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Data Table -->
      <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="group px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center">
                    Registration No.
                    <ArrowUpDownIcon class="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applicant Details
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Supervisor
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="application in displayedApplications"
                :key="application.id"
                class="hover:bg-blue-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">
                    {{ application.registration_no }}
                  </div>
                  <div class="text-xs text-gray-500">ID: {{ application.id }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-start">
                    <div
                      class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold"
                    >
                      {{ getInitials(application.full_name) }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ application.full_name }}
                      </div>
                      <div class="text-xs text-gray-500 mt-1">CID: {{ application.cid_no }}</div>
                      <div class="text-xs text-gray-500">{{ application.email_address }}</div>
                      <div class="text-xs text-gray-500">
                        Contact: {{ application.contact_number }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ application.supervisor_name }}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {{ application.supervisor_designation }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="space-y-2">
                    <span
                      :class="getStatusClass(application.review_status)"
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      <span
                        class="w-2 h-2 rounded-full mr-1 mt-1.5"
                        :class="getStatusDotClass(application.review_status)"
                      ></span>
                      Review: {{ application.review_status }}
                    </span>

                    <span
                      v-if="application.is_payment_complete"
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                    >
                      <span class="w-2 h-2 rounded-full bg-green-500 mr-1 mt-1.5"></span>
                      Payment Complete
                    </span>
                    <span
                      v-else
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                    >
                      <span class="w-2 h-2 rounded-full bg-yellow-500 mr-1 mt-1.5"></span>
                      Payment Pending
                    </span>

                    <span
                      :class="getStatusClass(application.endorsement_decision)"
                      class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      <span
                        class="w-2 h-2 rounded-full mr-1 mt-1.5"
                        :class="getStatusDotClass(application.endorsement_decision)"
                      ></span>
                      Endorsement: {{ application.endorsement_decision }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex flex-col space-y-2">
                    <!-- View Details Button -->
                    <button
                      @click="reviewApplication(application)"
                      class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      <EyeIcon class="h-4 w-4 mr-1" />
                      View Details
                    </button>

                    <!-- MODIFIED: Changed from "Certificate" to "View Certificate" and updated the function -->
                    <button
                      v-if="application.endorsement_decision === 'Approved'"
                      @click="viewCertificate(application)"
                      class="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      <EyeIcon class="h-4 w-4 mr-1" />
                      View Certificate
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State with Improved Visual -->
        <div v-if="!displayedApplications.length && !isLoading" class="text-center py-16">
          <div
            class="mx-auto h-24 w-24 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center mb-4"
          >
            <InboxIcon class="h-12 w-12" />
          </div>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
          <p class="mt-1 text-gray-500 max-w-md mx-auto">
            No COGS applications match your current search criteria. Try adjusting your filters or
            search terms.
          </p>
          <button
            @click="resetFilters"
            class="mt-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <!-- Enhanced Pagination -->
      <div
        v-if="totalPages > 1"
        class="mt-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-md"
      >
        <div class="text-sm text-gray-700 flex items-center">
          <span class="font-medium">Page {{ currentPage }}</span> of {{ totalPages }}
          <span class="ml-4 text-gray-500">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredApplications.length) }}
            of {{ filteredApplications.length }} applications
          </span>
        </div>
        <div class="flex space-x-2">
          <button
            @click="currentPage = 1"
            :disabled="currentPage === 1"
            class="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeftIcon class="w-5 h-5" />
          </button>
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeftIcon class="w-5 h-5 mr-1" />
            Prev
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Next
            <ChevronRightIcon class="w-5 h-5 ml-1" />
          </button>
          <button
            @click="currentPage = totalPages"
            :disabled="currentPage === totalPages"
            class="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRightIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <CogsReviewModal
      v-if="selectedApplication"
      :application="selectedApplication"
      @close="closeReviewModal"
      @update="handleUpdate"
    />

    <!-- Enhanced Confirmation Modal -->
    <CogsConfirmationModal
      v-if="showConfirmation"
      :message="confirmationMessage"
      @confirm="confirmReviewAction"
      @cancel="cancelReviewAction"
    />

    <!-- ADDED: Certificate Modal -->
    <EPCcogsCertificateModal
      :cogs-application="selectedCertificateApplication"
      :show-modal="showCertificateModal"
      @close="closeCertificateModal"
    />

    <!-- Success Toast Notification (New Addition) -->
    <div
      v-if="showSuccessToast"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center transition-all duration-300"
      :class="{
        'opacity-100 translate-y-0': showSuccessToast,
        'opacity-0 translate-y-8': !showSuccessToast,
      }"
    >
      <CheckCircleIcon class="w-5 h-5 mr-2" />
      <span>{{ toastMessage }}</span>
      <button @click="showSuccessToast = false" class="ml-4 text-white hover:text-green-200">
        <XIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Loader2Icon,
  SearchIcon,
  CircleAlert,
  InboxIcon,
  ClipboardCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  XIcon,
} from 'lucide-vue-next'
import apiServices from '@/services/services' // Adjust path if necessary
import CogsReviewModal from '../modals/CogsReviewModal.vue' // Adjust path if necessary
import CogsConfirmationModal from '../modals/CogsConfirmationModal.vue' // Adjust path if necessary
// ADDED: Import the certificate modal
import EPCcogsCertificateModal from '@/components/common/EPC/EPCcogsCertificateModal.vue'

const applications = ref([])
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10) // You can adjust items per page here
const selectedApplication = ref(null)
const showConfirmation = ref(false)
const confirmationMessage = ref('')
const showSuccessToast = ref(false)
const toastMessage = ref('')
const confirmData = ref(null)

// ADDED: Certificate modal state
const showCertificateModal = ref(false)
const selectedCertificateApplication = ref(null)

// Get counts for dashboard stats
const getPendingCount = () => {
  return applications.value.filter(
    (app) => app.review_status === 'Pending' || app.endorsement_decision === 'Pending',
  ).length
}

const getApprovedCount = () => {
  return applications.value.filter((app) => app.endorsement_decision === 'Approved').length
}

const getRejectedCount = () => {
  return applications.value.filter(
    (app) => app.review_status === 'Rejected' || app.endorsement_decision === 'Rejected',
  ).length
}

// Get initials for avatar
const getInitials = (name) => {
  if (!name) return 'N/A'
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

// Computed property for filtered applications based on search and status
const filteredApplications = computed(() => {
  let filtered = applications.value

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(
      (app) =>
        app.review_status === statusFilter.value || app.endorsement_decision === statusFilter.value,
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (app) =>
        (app.full_name && app.full_name.toLowerCase().includes(query)) ||
        (app.cid_no && app.cid_no.toLowerCase().includes(query)) ||
        (app.registration_no && app.registration_no.toLowerCase().includes(query)),
    )
  }

  return filtered
})

// Computed property for total pages based on filtered applications
const totalPages = computed(() => {
  return Math.ceil(filteredApplications.value.length / itemsPerPage.value)
})

// Computed property for applications to display on the current page
const displayedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredApplications.value.slice(start, end)
})

// Fetch data from API
const fetchData = async () => {
  isLoading.value = true
  error.value = null
  try {
    // Replace with your actual API endpoint call
    const response = await apiServices.getEpcCogs()
    // Assuming the API returns data in response.data or response.data.results
    applications.value = response.data.results || response.data || []
  } catch (err) {
    error.value = 'Failed to load applications. Please try again later.'
    console.error('Error fetching applications:', err)
    applications.value = [] // Clear applications on error
  } finally {
    isLoading.value = false
  }
}

// Get Tailwind classes for status badges
const getStatusClass = (status) => {
  const classes = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Processing: 'bg-blue-100 text-blue-800', // Example for another status
  }
  return classes[status] || 'bg-gray-100 text-gray-800' // Default/fallback style
}

// Get Tailwind classes for status dots
const getStatusDotClass = (status) => {
  const classes = {
    Pending: 'bg-yellow-500',
    Approved: 'bg-green-500',
    Rejected: 'bg-red-500',
    Processing: 'bg-blue-500',
  }
  return classes[status] || 'bg-gray-500'
}

// Reset search and filter parameters
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1 // Reset to first page
}

// Open the review modal
const reviewApplication = (application) => {
  selectedApplication.value = application
}

// MODIFIED: Changed from downloadCertificate to viewCertificate
const viewCertificate = async (application) => {
  try {
    // Optional: Fetch the latest application data to ensure we have complete information
    // You can skip this if your application data is already complete
    // const response = await apiServices.getEpcCogsById(application.id)
    // selectedCertificateApplication.value = response.data

    // Use the application data directly
    selectedCertificateApplication.value = application
    showCertificateModal.value = true

    // Show success toast
    toastMessage.value = 'Certificate loaded successfully'
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  } catch (err) {
    console.error('Error loading certificate:', err)
    error.value = 'Failed to load certificate. Please try again.'
  }
}

// ADDED: Close certificate modal function
const closeCertificateModal = () => {
  showCertificateModal.value = false
  selectedCertificateApplication.value = null
}

// Handle update event from the modal (before confirmation)
const handleUpdate = (data) => {
  // Set confirmation data and show confirmation modal
  confirmData.value = data

  const action = data.review_status || data.endorsement_decision || 'update'
  const type = data.review_status
    ? 'review'
    : data.endorsement_decision
      ? 'endorsement'
      : 'application'

  confirmationMessage.value = `Are you sure you want to ${action.toLowerCase()} this ${type}?`
  showConfirmation.value = true
}

// Confirm the action after user clicks 'Confirm' in the modal
const confirmReviewAction = async () => {
  showConfirmation.value = false
  if (!confirmData.value || !selectedApplication.value) return

  isLoading.value = true // Indicate processing
  error.value = null

  try {
    // Replace with your actual API endpoint call for patching/updating
    const response = await apiServices.patchEpcCogs(selectedApplication.value.id, confirmData.value)

    if (response.status === 200) {
      // Find and update the application in the local list
      const index = applications.value.findIndex((app) => app.id === selectedApplication.value.id)
      if (index !== -1) {
        // Create a new array with the updated item to maintain reactivity
        const updatedApp = { ...applications.value[index], ...response.data }
        const newApplications = [...applications.value]
        newApplications[index] = updatedApp
        applications.value = newApplications
      }

      // Show success toast
      const action =
        confirmData.value.review_status || confirmData.value.endorsement_decision || 'updated'
      const type = confirmData.value.review_status
        ? 'Review'
        : confirmData.value.endorsement_decision
          ? 'Endorsement'
          : 'Application'
      toastMessage.value = `${type} ${action.toLowerCase()} successfully`
      showSuccessToast.value = true
      setTimeout(() => {
        showSuccessToast.value = false
      }, 3000) // Hide toast after 3 seconds

      closeReviewModal() // Close the review modal
    } else {
      // Handle non-200 success responses if necessary
      console.error('Failed to update application, status:', response.status, response.data)
      error.value = `Failed to update application. Server responded with status ${response.status}.`
    }
  } catch (err) {
    console.error('Error updating application:', err.response?.data || err.message || err)
    error.value = `Failed to update application: ${err.response?.data?.detail || err.message || 'Please try again.'}`
    // Optionally show an error toast here
  } finally {
    isLoading.value = false
    confirmData.value = null // Clear confirmation data
  }
}

// Close the review modal
const closeReviewModal = () => {
  selectedApplication.value = null
}

// Cancel the action from the confirmation modal
const cancelReviewAction = () => {
  showConfirmation.value = false
  confirmData.value = null // Clear potentially staged data
}

// Watch for changes in search query or status filter to reset pagination
watch([searchQuery, statusFilter], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1 // Go back to page 1 when filters change
  }
})

// Fetch data when the component mounts
onMounted(fetchData)
</script>

<style scoped>
/* Optional: Add smooth transitions for hover states */
.hover\:bg-blue-50:hover {
  transition: background-color 0.2s ease-in-out;
}

/* Optional: Add box shadow transition */
.shadow-md,
.shadow-lg {
  transition: box-shadow 0.2s ease-in-out;
}

/* Optional: Add subtle hover effect to the table rows with a left border indicator */
tbody tr {
  position: relative;
  /* Needed for absolute positioning of the pseudo-element */
}

tbody tr:hover::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  /* Use top/bottom or height */
  width: 4px;
  /* Width of the indicator */
  background-color: #3b82f6;
  /* Tailwind's blue-500 */
  border-top-left-radius: 2px;
  /* Optional: slightly rounded corners */
  border-bottom-left-radius: 2px;
  transition: background-color 0.2s ease-in-out;
  /* Match hover transition */
}

/* Ensure pagination buttons have clear focus styles for accessibility */
button:focus-visible {
  outline: 2px solid #2563eb;
  /* Tailwind's blue-600 */
  outline-offset: 2px;
}

/* Smooth transition for the toast notification */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.opacity-0 {
  opacity: 0;
}

.opacity-100 {
  opacity: 1;
}

.translate-y-8 {
  transform: translateY(2rem);
}

.translate-y-0 {
  transform: translateY(0);
}
</style>
