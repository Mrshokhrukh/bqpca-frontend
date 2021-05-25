<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Use the DOPageHeader Component -->
    <DOPageHeader
      title="EPC Renewal Applications"
      :description="headerDescription"
      :search-query="searchQuery"
      @update:searchQuery="searchQuery = $event"
      search-placeholder="Search by name, CID or registration number..."
      :filter-value="filterStatus"
      @update:filterValue="filterStatus = $event"
      :filter-options="statusFilterOptions"
    />

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
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
                Primary Qualification
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Renewal Status
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Original Expiry
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="item in paginatedCombinedData"
              :key="item.renewal_id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ item.renewal_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    v-if="!item.passport_photo"
                    class="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0"
                  >
                    <span class="text-xs font-semibold">{{ getInitials(item) }}</span>
                  </div>
                  <img
                    v-else
                    :src="item.passport_photo"
                    @error="avatarError"
                    class="h-8 w-8 rounded-full object-cover mr-3 flex-shrink-0"
                    alt="Photo"
                  />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ item.full_name }}</div>
                    <div class="text-sm text-gray-500">{{ item.cid_no }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.registration_no }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <template v-if="getPrimaryQualification(item)">
                  {{ getPrimaryQualification(item).qualification_name_display || 'N/A' }}
                </template>
                <template v-else> N/A </template>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRenewalStatusClasses(item)">
                  {{ getRenewalStatus(item) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(item.current_registration_expiry_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    @click="viewDetails(item)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!isLoading && paginatedCombinedData.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                {{ 'No renewal applications found that match your criteria' }}
              </td>
            </tr>
            <tr v-if="isLoading">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                Loading renewal application data...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100"
    >
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ paginationStart }}</span>
            to
            <span class="font-medium">{{ paginationEnd }}</span>
            of
            <span class="font-medium">{{ filteredCombinedData.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span class="sr-only">Previous</span>
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <span
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
            >
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <span class="sr-only">Next</span>
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <RenewalDetailsModal
      :is-open="isModalOpen"
      :application="selectedItem"
      @close="closeModal"
      @update="handleUpdate"
      :personnel-categories="personnelCategories"
      :personnel-subcategories="personnelSubcategories"
      :sectors="sectors"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiServices from '@/services/services'
import RenewalDetailsModal from '../modals/RenewalDetailsModal.vue' // Ensure this path is correct
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue' // Ensure this path is correct
import { useToast } from 'vue-toastification'

// --- State ---
const renewals = ref([]) // Stores raw renewal records from API
const applications = ref([]) // Stores raw application records (used for lookup)
const filterStatus = ref('all') // Current filter status for the list
const searchQuery = ref('') // Current search query
const currentPage = ref(1) // Current page for pagination
const itemsPerPage = 10 // Number of items to display per page
const isModalOpen = ref(false) // Controls visibility of the details modal
const selectedItem = ref(null) // Holds the data for the item being viewed/edited in the modal
const personnelCategories = ref([]) // Master data
const personnelSubcategories = ref([]) // Master data
const sectors = ref([]) // Master data
const toast = useToast() // Toast notification service
const isFetchingRenewals = ref(false) // Loading state for renewals API call
const isFetchingApplications = ref(false) // Loading state for applications API call
const isLoading = ref(true) // Combined loading state for initial data fetch

// Filter options for the DOPageHeader component
const statusFilterOptions = ref([
  { value: 'all', text: 'All Statuses' },
  { value: 'Pending', text: 'Pending' },
  { value: 'Approved', text: 'Approved' },
  { value: 'Regretted', text: 'Regretted' },
])

// --- Watchers ---
// Reset to first page if search query or filter status changes
watch([searchQuery, filterStatus], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
})

// Combined loading state based on individual fetches
watch([isFetchingRenewals, isFetchingApplications], ([fetchingRenewals, fetchingApps]) => {
  isLoading.value = fetchingRenewals || fetchingApps
})

// --- Computed Properties ---

// Creates a lookup map of qualifications by their ID.
// Each qualification in the map includes its parent application's basic info.
// This allows efficient merging of renewal data with its corresponding qualification
// and parent application details in the `combinedData` computed property.
const qualificationMap = computed(() => {
  const map = {}
  if (Array.isArray(applications.value)) {
    applications.value.forEach((app) => {
      if (app.user_qualifications && app.user_qualifications.length > 0) {
        app.user_qualifications.forEach((qual) => {
          if (qual && qual.id != null) { // Ensure qualification and its ID are valid
            map[qual.id] = {
              ...qual, // Spread all qualification fields
              // Nest parent application data for easy access from the qualification context
              application_info: {
                id: app.id,
                full_name: app.full_name,
                cid_no: app.cid_no,
                registration_no: app.registration_no,
                passport_photo: app.passport_photo,
                expiry_date: app.expiry_date, // This is current_registration_expiry_date for the renewal
                registration_date: app.registration_date,
              }
            }
          }
        })
      }
    })
  }
  return map
})

// Merges raw renewal data with detailed application and qualification information.
// It uses `qualificationMap` for efficient lookups. Each item in the result
// represents a renewal augmented with related data for display.
const combinedData = computed(() => {
  if (!Array.isArray(renewals.value)) return []

  return renewals.value.map((renewal) => {
    // `renewal.user_qualification` is the ID of the EnggUserQualification record linked to this renewal.
    const qualification = qualificationMap.value[renewal.user_qualification]

    if (qualification && qualification.application_info) {
      const appInfo = qualification.application_info
      return {
        // Fields from the EnggRenewal model
        renewal_id: renewal.id, // Primary key of the renewal record
        renewal_status: renewal.renewal_endorsement_decision || 'Pending', // Display status of the renewal
        renewal_review_status: renewal.renewal_review_status,
        renewal_review_remarks: renewal.renewal_review_remarks,
        new_expiry_date: renewal.new_expiry_date, // New expiry date if renewal was processed
        endorsement_remarks: renewal.endorsement_remarks,
        created_at: renewal.created_at, // Renewal submission/creation date
        updated_at: renewal.updated_at, // Last update to the renewal record
        user_qualification: renewal.user_qualification, // ID of the linked EnggUserQualification

        // Fields from the parent EnggApplication model (via qualificationMap)
        application_id: appInfo.id,
        full_name: appInfo.full_name || 'N/A',
        cid_no: appInfo.cid_no || 'N/A',
        registration_no: appInfo.registration_no || 'N/A',
        current_registration_expiry_date: appInfo.expiry_date, // Original expiry from EnggApplication
        registration_date: appInfo.registration_date, // Original registration date from EnggApplication
        passport_photo: appInfo.passport_photo,

        // Structure to pass to the modal, mimicking an application object with qualifications
        user_qualifications: [qualification],

        ...renewal // Include all other original renewal fields
      }
    } else {
      // Fallback if the qualification associated with the renewal isn't found.
      // This might indicate data inconsistency or a deleted related record.
      console.warn(`No qualification data found for renewal ID ${renewal.id} linked to user_qualification ID ${renewal.user_qualification}. Displaying renewal data with placeholders.`)
      return {
        renewal_id: renewal.id,
        renewal_status: renewal.renewal_endorsement_decision || 'Pending',
        created_at: renewal.created_at,
        user_qualification: renewal.user_qualification,

        // Fallback application info
        application_id: null,
        full_name: 'Data Incomplete',
        cid_no: 'N/A',
        registration_no: 'N/A',
        current_registration_expiry_date: null,
        registration_date: renewal.created_at, // Use renewal creation as a fallback for submission date
        passport_photo: null,
        user_qualifications: [], // No qualification data available
        ...renewal
      }
    }
  })
})

// Applies filters (status and search query) to the `combinedData`.
const filteredCombinedData = computed(() => {
  if (!Array.isArray(combinedData.value)) return []

  return combinedData.value.filter((item) => {
    // Apply status filter
    if (filterStatus.value !== 'all') {
      if (getRenewalStatus(item) !== filterStatus.value) return false
    }

    // Apply search query filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase().trim()
      if (!query) return true // If query is empty after trim, don't filter

      const name = (item.full_name || '').toLowerCase()
      const cid = (item.cid_no || '').toLowerCase()
      const regNo = (item.registration_no || '').toLowerCase()

      // Check for "N/A" literal search if that's intended
      if (query === 'n/a') {
        return name === 'n/a' || cid === 'n/a' || regNo === 'n/a'
      }

      return (name !== 'n/a' && name.includes(query)) ||
             (cid !== 'n/a' && cid.includes(query)) ||
             (regNo !== 'n/a' && regNo.includes(query))
    }
    return true // Pass if no filters active or item matches
  })
})

// Slices the `filteredCombinedData` for the current page.
const paginatedCombinedData = computed(() => {
  if (!Array.isArray(filteredCombinedData.value)) return []
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCombinedData.value.slice(start, end)
})

const pendingCount = computed(() => {
  return filteredCombinedData.value.filter((item) => getRenewalStatus(item) === 'Pending').length
})

const headerDescription = computed(() => {
  return `Total Matches: ${filteredCombinedData.value.length} | Pending Review: ${pendingCount.value}`
})

const totalPages = computed(() => {
  if (!Array.isArray(filteredCombinedData.value)) return 1
  return Math.max(1, Math.ceil(filteredCombinedData.value.length / itemsPerPage))
})

const paginationStart = computed(() => {
  if (!Array.isArray(filteredCombinedData.value) || filteredCombinedData.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const paginationEnd = computed(() => {
  if (!Array.isArray(filteredCombinedData.value)) return 0
  return Math.min(currentPage.value * itemsPerPage, filteredCombinedData.value.length)
})

// --- Methods ---
const getPrimaryQualification = (item) => {
  // This expects 'item' to be an object from `combinedData` which has `user_qualifications` array
  if (Array.isArray(item.user_qualifications) && item.user_qualifications.length > 0) {
    // The `combinedData` already structures `user_qualifications` to contain the primary one (or first)
    // from the `qualificationMap`'s perspective.
    return item.user_qualifications[0] // Assuming the first one is the relevant one for display
  }
  return null
}

const getInitials = (item) => {
  const name = item.full_name
  if (!name || name === 'N/A' || name === 'Data Incomplete') return '?'
  return name
    .split(' ')
    .map((word) => word?.[0] || '')
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Determines the display status of a renewal item.
const getRenewalStatus = (item) => {
  // `item.renewal_status` is already derived from `renewal_endorsement_decision` in `combinedData`.
  return item.renewal_status || 'Pending'
}

// Provides CSS classes based on the renewal status for styling.
const getRenewalStatusClasses = (item) => {
  const status = getRenewalStatus(item)
  return [
    'px-3 py-1 rounded-full text-xs font-medium inline-block', // Base classes
    { // Conditional classes
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Regretted' || status === 'Rejected', // Group similar negative statuses
      'bg-gray-100 text-gray-800': !['Pending', 'Approved', 'Regretted', 'Rejected'].includes(status), // Fallback
    },
  ]
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A' // Invalid date object
    return date.toLocaleDateString('en-GB', { // Using en-GB for dd/Mon/yyyy format
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  } catch (e) {
    // Catch potential errors from Date constructor for very malformed strings
    console.error("Error formatting date:", dateString, e);
    return 'N/A'
  }
}

// Fallback for avatar image errors.
const avatarError = (event) => {
  event.target.style.display = 'none' // Hide broken image
  // Optionally, replace with a default avatar image or show initials container
}

// Fetches master data like categories, subcategories, sectors.
const fetchMasterData = async () => {
  try {
    // Using Promise.allSettled to ensure all attempts are made even if some fail.
    const responses = await Promise.allSettled([
      apiServices.getMhpcMastersPersonnelCategories
        ? apiServices.getMhpcMastersPersonnelCategories()
        : Promise.resolve({ data: null }), // Fallback if service method is optional/missing
      apiServices.getMhpcMastersSubCategories
        ? apiServices.getMhpcMastersSubCategories()
        : Promise.resolve({ data: null }),
      apiServices.getMhpcMastersSectors
        ? apiServices.getMhpcMastersSectors()
        : Promise.resolve({ data: null }),
    ])

    const processResponse = (response, targetRef, entityName) => {
      if (response.status === 'fulfilled') {
        const data = response.value?.data
        targetRef.value = data?.results || data || [] // Handle paginated or direct array responses
      } else if (response.status === 'rejected') {
        console.error(`Failed to fetch ${entityName}:`, response.reason)
        // Optionally, toast a non-blocking warning for master data fetch failure
        // toast.warning(`Could not load ${entityName} list.`);
      }
    }

    processResponse(responses[0], personnelCategories, 'Personnel Categories')
    processResponse(responses[1], personnelSubcategories, 'Personnel Subcategories')
    processResponse(responses[2], sectors, 'Sectors')
  } catch (error) {
    // This catch is for errors in Promise.allSettled setup, not individual promise rejections.
    console.error('Error in master data fetching process:', error)
    toast.error('A system error occurred while fetching master data.')
  }
}

// Fetches EPC renewal records.
const fetchRenewals = async () => {
  isFetchingRenewals.value = true
  renewals.value = [] // Clear previous data
  try {
    const response = await apiServices.getEpcRenewals()
    const results = response?.data?.results ?? response?.data ?? null // Robust handling of API response structure

    if (Array.isArray(results)) {
      renewals.value = results
    } else {
      console.error('Unexpected API response structure for EPC renewals. Expected an array.', response?.data)
      toast.error('Received invalid renewal data structure from server.')
      renewals.value = [] // Ensure it's an empty array
    }
  } catch (error) {
    console.error('Error fetching EPC renewals:', error)
    const errorMsg = error.response?.data?.detail || error.message || 'An unknown error occurred'
    toast.error(`Failed to load EPC renewal data: ${errorMsg}`)
    renewals.value = [] // Ensure it's an empty array on error
  } finally {
    isFetchingRenewals.value = false
  }
}

// Fetches EPC application records, used to build the `qualificationMap` for lookups.
const fetchApplications = async () => {
  isFetchingApplications.value = true
  applications.value = [] // Clear previous data
  try {
    const response = await apiServices.getEpcNewApplications()
    const results = response?.data?.results ?? response?.data ?? null // Robust handling

    if (Array.isArray(results)) {
      applications.value = results
    } else {
      console.error('Unexpected API response structure for EPC applications. Expected an array.', response?.data)
      toast.error('Received invalid application data structure from server.')
      applications.value = []
    }
  } catch (error) {
    console.error('Error fetching EPC applications for lookup:', error)
    const errorMsg = error.response?.data?.detail || error.message || 'An unknown error occurred'
    toast.error(`Failed to load EPC application data for lookup: ${errorMsg}`)
    applications.value = [] // Ensure it's an empty array on error
  } finally {
    isFetchingApplications.value = false
  }
}

// Opens the modal with a deep clone of the selected item.
const viewDetails = (item) => {
  // Deep clone to prevent accidental modification of the list item if modal edits directly
  selectedItem.value = JSON.parse(JSON.stringify(item))
  isModalOpen.value = true
}

// Handles the 'update' event from the modal.
const handleUpdate = async () => {
  isLoading.value = true // Show loading indicator while refetching
  // Refetch both renewals and applications data to reflect changes.
  await Promise.allSettled([fetchRenewals(), fetchApplications()])
  closeModal()
  toast.success('Renewal application successfully processed.') // General success message
}

// Closes the details modal.
const closeModal = () => {
  isModalOpen.value = false
  selectedItem.value = null // Clear selected item
}

// Pagination methods
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// --- Lifecycle Hooks ---
onMounted(async () => {
  isLoading.value = true // Set initial loading state
  // Fetch all necessary data concurrently on component mount.
  await Promise.allSettled([fetchMasterData(), fetchRenewals(), fetchApplications()])
  // isLoading will be set to false by the watcher once all fetches complete.
})

// Note: The `getRenewalApplicationStatus` function was present in the original script.
// It's not directly used by this component's template for table rendering (which uses `getRenewalStatus`).
// It's kept on the assumption it might be used by the `RenewalDetailsModal` or has another purpose.
// If confirmed unused, it can be removed.
const getRenewalApplicationStatus = (app) => {
  // For new applications, check the primary qualification's endorsement decision
  const primaryQualification = app.user_qualifications?.find((q) => q.is_primary_qualification)
  if (primaryQualification && primaryQualification.endorsement_decision) {
    return primaryQualification.endorsement_decision
  }
  // Check if there's any qualification with an endorsement decision
  if (app.user_qualifications && app.user_qualifications.length > 0) {
    const anyEndorsement = app.user_qualifications[0].endorsement_decision
    if (anyEndorsement) {
      return anyEndorsement
    }
  }
  return 'Pending' // Default for new applications
}

</script>

<style scoped>
th,
td {
  vertical-align: middle;
}
td .flex {
  flex-wrap: nowrap;
}
</style>
