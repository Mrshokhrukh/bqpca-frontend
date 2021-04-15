<!-- FILE: (e.g., components/renewals/RenewalListTable.vue - The Dealing Officer's View) -->
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Renewal Applications</h1>
      <div class="flex flex-wrap items-center text-gray-600 gap-x-4 gap-y-2">
        <span class="flex items-center"
          ><span class="w-3 h-3 rounded-full bg-blue-500 mr-2 flex-shrink-0"></span> Total:
          {{ filteredApplications.length }}</span
        >
        <span class="flex items-center"
          ><span class="w-3 h-3 rounded-full bg-green-500 mr-2 flex-shrink-0"></span> Active:
          {{ activeCount }}</span
        >
        <span class="flex items-center"
          ><span class="w-3 h-3 rounded-full bg-yellow-500 mr-2 flex-shrink-0"></span> Renewal
          Required: {{ renewalRequiredCount }}</span
        >
        <span class="flex items-center"
          ><span class="w-3 h-3 rounded-full bg-red-500 mr-2 flex-shrink-0"></span> Inactive
          (Expired): {{ inactiveCount }}</span
        >
        <span v-if="unknownExpiryCount > 0" class="flex items-center text-orange-600"
          ><span class="w-3 h-3 rounded-full bg-orange-500 mr-2 flex-shrink-0"></span> Expiry
          Unknown: {{ unknownExpiryCount }}</span
        >
      </div>
    </div>

    <!-- Filters (remain the same) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="relative">
        <input
          v-model.lazy.trim="searchQuery"
          type="text"
          placeholder="Search..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
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
      <div class="flex gap-4">
        <select
          v-model="filterStatus"
          class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Validity Statuses</option>
          <option value="Active">Active</option>
          <option value="Renewal Required">Renewal Required</option>
          <option value="Inactive (Expired)">Inactive (Expired)</option>
          <option value="Unknown">Unknown/Error</option>
        </select>
        <button
          @click="resetFilters"
          title="Reset Filters"
          class="px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0115.357-2m0 0H15"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading / Error / Table Section -->
    <div v-if="isLoading"></div>
    <div v-else-if="error"></div>
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              {/* Table Headers remain the same */}
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Applicant
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Reg. No.
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Expiry Date
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Reg. Validity
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Renewal App Status
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Submitted
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="!paginatedApplications.length">
              <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                No renewal applications found matching your criteria.
              </td>
            </tr>
            <tr
              v-for="app in paginatedApplications"
              :key="app.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                #{{ app.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    v-if="!app.passport_photo"
                    class="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-semibold text-sm flex-shrink-0"
                  >
                    {{ getInitials(app.full_name) }}
                  </div>
                  <img
                    v-else
                    :src="app.passport_photo"
                    @error="avatarError"
                    class="h-9 w-9 rounded-full object-cover mr-3 flex-shrink-0"
                    alt="Photo"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ app.full_name || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-500">{{ app.cid_no || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ app.registration_no || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDisplayDate(app.current_registration_expiry_date) }}
                <!-- Explicitly show if date is missing -->
                <span
                  v-if="!app.current_registration_expiry_date"
                  class="text-xs text-orange-500 italic"
                  >(Missing)</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getRegistrationValidityStatusClasses(getRegistrationValidityStatus(app))"
                >
                  {{ getRegistrationValidityStatus(app) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="getRenewalApplicationStatus(app) !== 'Info Missing'"
                  :class="getQualificationStatusClasses(getRenewalApplicationStatus(app))"
                  class="px-2 py-1 rounded text-xs"
                >
                  {{ getRenewalApplicationStatus(app) }}
                </span>
                <span v-else class="text-xs text-gray-400 italic">N/A</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(app.registration_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewDetails(app)"
                    title="View Application Details"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 inline-flex items-center text-xs"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between px-6 py-4 bg-white border-t"
    >
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ paginationStart }}</span> to
        <span class="font-medium">{{ paginationEnd }}</span> of
        <span class="font-medium">{{ filteredApplications.length }}</span> results
      </div>
      <div class="flex space-x-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded border"
          :class="
            currentPage === 1
              ? 'text-gray-400 border-gray-200'
              : 'text-gray-600 border-gray-300 hover:bg-gray-50'
          "
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded border"
          :class="
            currentPage === totalPages
              ? 'text-gray-400 border-gray-200'
              : 'text-gray-600 border-gray-300 hover:bg-gray-50'
          "
        >
          Next
        </button>
      </div>
    </div>

    <!-- Modal (remains the same) -->
    <ViewDetailsModal
      :isOpen="isModalOpen"
      :application="selectedApplication"
      @close="closeModal"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiServices from '@/services/services' // Adjust path if needed
import ViewDetailsModal from '../modals/ViewApplicationDetailsModal.vue' // Adjust path if needed
import { useToast } from 'vue-toastification'

// --- Constants ---
const RENEWAL_WINDOW_DAYS = 30
const ITEMS_PER_PAGE = 10
// *** IMPORTANT: Define the expected field name for expiry date from API ***
const EXPIRY_DATE_FIELD_NAME = 'current_registration_expiry_date' // <--- ADJUST THIS if your API uses a different name (e.g., 'expiry_date', 'registration_expiry')

// --- State ---
const applications = ref([])
const filterStatus = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const isModalOpen = ref(false)
const selectedApplication = ref(null)
// Removed personnelCategories, etc. assuming they are passed to modal or fetched there
const isLoading = ref(false)
const error = ref(null)
const toast = useToast()
const dataLoadWarning = ref('') // To store the expiry date warning

// --- Helper Functions (remain mostly the same) ---
const getToday = () => {
  /* ... */ const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}
const formatDate = (dateString) => {
  /* ... */ if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date)
  } catch {
    return 'Invalid Date'
  }
}
const formatDisplayDate = formatDate // Alias if needed
const getInitials = (name) => {
  /* ... */ if (!name) return '?'
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .filter((char) => char.match(/[a-zA-Z]/))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
const avatarError = (event) => {
  /* ... */ event.target.style.display = 'none'
}

// --- Core Status Logic ---
const getRegistrationValidityStatus = (app) => {
  // *** Use the defined constant for the field name ***
  const expiryDateString = app[EXPIRY_DATE_FIELD_NAME]

  if (!expiryDateString) {
    return 'Unknown' // Expiry date missing from data
  }
  // ... (rest of the date comparison logic remains the same) ...
  try {
    const today = getToday()
    const expiryDate = new Date(expiryDateString)
    expiryDate.setHours(0, 0, 0, 0)
    if (isNaN(expiryDate.getTime())) {
      return 'Invalid Date'
    }
    if (expiryDate < today) {
      return 'Inactive (Expired)'
    } else {
      const renewalStartDate = new Date(expiryDate)
      renewalStartDate.setDate(expiryDate.getDate() - RENEWAL_WINDOW_DAYS)
      renewalStartDate.setHours(0, 0, 0, 0)
      if (today >= renewalStartDate) {
        return 'Renewal Required'
      } else {
        return 'Active'
      }
    }
  } catch (e) {
    console.error('Error parsing expiry date:', expiryDateString, e)
    return 'Date Error'
  }
}

const getRenewalApplicationStatus = (app) => {
  // Status of the renewal application itself (Pending/Approved/Regretted)
  // *** ADJUST field name if needed (e.g., app.renewal_status) ***
  const primaryQualification = app.user_qualifications?.find((q) => q.is_primary_qualification)
  if (primaryQualification && primaryQualification.endorsement_decision) {
    return primaryQualification.endorsement_decision
  }
  // Fallback based on a direct status field if qualifications aren't used for renewal status
  if (app.status) {
    return app.status // Assuming a field like 'status' exists on the renewal record
  }
  return 'Info Missing'
}

// --- Styling Logic (remains the same) ---
const getRegistrationValidityStatusClasses = (status) => {
  /* ... */ return [
    'px-3 py-1 rounded-full text-xs font-semibold inline-block',
    {
      'bg-green-100 text-green-700': status === 'Active',
      'bg-yellow-100 text-yellow-700': status === 'Renewal Required',
      'bg-red-100 text-red-700': status === 'Inactive (Expired)',
      'bg-gray-100 text-gray-600': ['Unknown', 'Invalid Date', 'Date Error'].includes(status),
    },
  ]
}
const getQualificationStatusClasses = (status) => {
  /* ... */ return {
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-red-100 text-red-800': status === 'Regretted' || status === 'Rejected',
    'bg-gray-100 text-gray-700': status === 'Info Missing',
  }
}

// --- Computed Properties ---
const filteredApplications = computed(() => {
  // ... (filtering logic remains the same) ...
  let filtered = [...applications.value]
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter((app) => getRegistrationValidityStatus(app) === filterStatus.value)
  }
  const query = searchQuery.value.toLowerCase()
  if (query) {
    filtered = filtered.filter(
      (app) =>
        app.full_name?.toLowerCase().includes(query) ||
        app.cid_no?.toLowerCase().includes(query) ||
        app.registration_no?.toLowerCase().includes(query),
    )
  }
  return filtered
})
const totalPages = computed(() => Math.ceil(filteredApplications.value.length / ITEMS_PER_PAGE))
const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return filteredApplications.value.slice(start, end)
})
const paginationStart = computed(() =>
  filteredApplications.value.length === 0 ? 0 : (currentPage.value - 1) * ITEMS_PER_PAGE + 1,
)
const paginationEnd = computed(() =>
  Math.min(currentPage.value * ITEMS_PER_PAGE, filteredApplications.value.length),
)
// Counts
const activeCount = computed(
  () =>
    filteredApplications.value.filter((app) => getRegistrationValidityStatus(app) === 'Active')
      .length,
)
const inactiveCount = computed(
  () =>
    filteredApplications.value.filter(
      (app) => getRegistrationValidityStatus(app) === 'Inactive (Expired)',
    ).length,
)
const renewalRequiredCount = computed(
  () =>
    filteredApplications.value.filter(
      (app) => getRegistrationValidityStatus(app) === 'Renewal Required',
    ).length,
)
const unknownExpiryCount = computed(
  () =>
    filteredApplications.value.filter((app) => getRegistrationValidityStatus(app) === 'Unknown')
      .length,
) // Count unknowns

// --- Watchers (remain the same) ---
watch([filterStatus, searchQuery], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
})

// --- API Interaction ---
const fetchApplications = async () => {
  isLoading.value = true
  error.value = null
  dataLoadWarning.value = '' // Reset warning

  try {
    // *** ENSURE THIS IS THE CORRECT ENDPOINT FOR RENEWALS ***
    console.log('Fetching from getEpcRenewals...')
    const response = await apiServices.getEpcRenewals()

    console.log('API Response received:', response.data) // Log the raw response

    applications.value = response.data?.results || response.data || []

    // *** Check if the crucial expiry date field exists in the received data ***
    if (applications.value.length > 0) {
      // Check only the first record for efficiency, assuming structure is consistent
      const firstApp = applications.value[0]
      console.log(`Checking for field '${EXPIRY_DATE_FIELD_NAME}' in first record:`, firstApp)

      if (firstApp && Object.hasOwn(firstApp, EXPIRY_DATE_FIELD_NAME)) {
        console.log(`Field '${EXPIRY_DATE_FIELD_NAME}' found.`)
        // Further check if *some* values are null/empty even if the field exists
        const missingValues = applications.value.filter(
          (app) => !app[EXPIRY_DATE_FIELD_NAME],
        ).length
        if (missingValues > 0) {
          dataLoadWarning.value = `${missingValues} record(s) have a missing expiry date value. Validity status may be incorrect for these.`
          console.warn(dataLoadWarning.value)
          toast.warning(dataLoadWarning.value, { timeout: 7000 })
        }
      } else {
        // The field itself is missing from the API response structure
        dataLoadWarning.value = `Required field '${EXPIRY_DATE_FIELD_NAME}' is missing from the API response. Validity status cannot be calculated accurately.`
        console.error(dataLoadWarning.value)
        toast.error(dataLoadWarning.value, { timeout: 10000 }) // Use error toast
        // Display error prominently or adjust UI
        error.value = `API response structure error: Missing '${EXPIRY_DATE_FIELD_NAME}'. Contact administrator.`
      }
    } else {
      console.log('No applications returned from API.')
    }
  } catch (err) {
    console.error('Error fetching renewal applications:', err)
    const errorMsg = err.response?.data?.detail || err.message || 'An unknown error occurred.'
    error.value = `Failed to load renewal applications: ${errorMsg}`
    applications.value = []
    toast.error(`Error loading applications: ${errorMsg}`)
  } finally {
    isLoading.value = false
  }
}

// --- Modal and Actions (remain the same) ---
const viewDetails = (application) => {
  /* ... */ selectedApplication.value = {
    ...application,
    registrationValidity: getRegistrationValidityStatus(application),
    renewalApplicationStatus: getRenewalApplicationStatus(application),
  }
  isModalOpen.value = true
}
const handleUpdate = async () => {
  /* ... */ closeModal()
  toast.success('Application updated')
  await fetchApplications()
}
const closeModal = () => {
  /* ... */ isModalOpen.value = false
  selectedApplication.value = null
}
const resetFilters = () => {
  /* ... */ searchQuery.value = ''
  filterStatus.value = 'all'
  currentPage.value = 1
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// --- Lifecycle ---
onMounted(fetchApplications) // Fetch data on mount
</script>

<style scoped>
/* Optional: Add specific styles if needed */
</style>
