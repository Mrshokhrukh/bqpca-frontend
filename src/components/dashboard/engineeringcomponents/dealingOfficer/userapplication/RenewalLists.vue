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
import RenewalDetailsModal from '../modals/RenewalDetailsModal.vue'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue'
import { useToast } from 'vue-toastification'

// --- State ---
const renewals = ref([])
const applications = ref([]) // Store new applications for lookup
const filterStatus = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isModalOpen = ref(false)
const selectedItem = ref(null)
const personnelCategories = ref([])
const personnelSubcategories = ref([])
const sectors = ref([])
const toast = useToast()
const isLoading = ref(true)
const isFetchingRenewals = ref(false)
const isFetchingApplications = ref(false)

// Filter options for the DOPageHeader
const statusFilterOptions = ref([
  { value: 'all', text: 'All Statuses' },
  { value: 'Pending', text: 'Pending' },
  { value: 'Approved', text: 'Approved' },
  { value: 'Regretted', text: 'Regretted' },
])

// --- Watchers ---
watch([searchQuery, filterStatus], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
})

watch([isFetchingRenewals, isFetchingApplications], ([fetchingRenewals, fetchingApps]) => {
  isLoading.value = fetchingRenewals || fetchingApps
})

// --- Computed Properties ---
// Create a lookup map of qualifications by ID for fast access
const qualificationMap = computed(() => {
  const map = {}
  if (Array.isArray(applications.value)) {
    applications.value.forEach((app) => {
      if (app.user_qualifications && app.user_qualifications.length > 0) {
        app.user_qualifications.forEach((qual) => {
          if (qual && qual.id != null) {
            map[qual.id] = {
              ...qual,
              // Include application data for easy access
              application_info: {
                id: app.id,
                full_name: app.full_name,
                cid_no: app.cid_no,
                registration_no: app.registration_no,
                passport_photo: app.passport_photo,
                expiry_date: app.expiry_date,
                registration_date: app.registration_date,
              }
            }
          }
        })
      }
    })
  }
  console.log('Qualification map created:', map)
  return map
})

const combinedData = computed(() => {
  if (!Array.isArray(renewals.value)) return []

  return renewals.value.map((renewal) => {
    console.log('Processing renewal:', renewal)

    // Find the matching qualification and application data
    const qualification = qualificationMap.value[renewal.user_qualification]
    console.log(`Qualification found for renewal ${renewal.id}:`, qualification)

    if (qualification && qualification.application_info) {
      const appInfo = qualification.application_info
      return {
        renewal_id: renewal.id,
        renewal_status: renewal.renewal_endorsement_decision || 'Pending',
        renewal_review_status: renewal.renewal_review_status,
        renewal_review_remarks: renewal.renewal_review_remarks,
        new_expiry_date: renewal.new_expiry_date,
        renewal_endorsement_decision: renewal.renewal_endorsement_decision,
        endorsement_remarks: renewal.endorsement_remarks,
        created_at: renewal.created_at,
        updated_at: renewal.updated_at,
        user_qualification: renewal.user_qualification,

        // Application info from qualification lookup
        application_id: appInfo.id,
        full_name: appInfo.full_name || 'N/A',
        cid_no: appInfo.cid_no || 'N/A',
        registration_no: appInfo.registration_no || 'N/A',
        current_registration_expiry_date: appInfo.expiry_date,
        registration_date: appInfo.registration_date,
        passport_photo: appInfo.passport_photo,

        // Include the full qualification data
        user_qualifications: [qualification],

        // Pass through all original renewal fields
        ...renewal
      }
    } else {
      // Fallback if no qualification found
      console.warn(`No qualification found for renewal ${renewal.id} with user_qualification ${renewal.user_qualification}`)
      return {
        renewal_id: renewal.id,
        renewal_status: renewal.renewal_endorsement_decision || 'Pending',
        application_id: renewal.id,
        full_name: 'N/A',
        cid_no: 'N/A',
        registration_no: 'N/A',
        current_registration_expiry_date: null,
        registration_date: renewal.created_at,
        passport_photo: null,
        user_qualifications: [],
        ...renewal
      }
    }
  })
})

const filteredCombinedData = computed(() => {
  if (!Array.isArray(combinedData.value)) return []

  return combinedData.value.filter((item) => {
    if (filterStatus.value !== 'all') {
      if (getRenewalStatus(item) !== filterStatus.value) return false
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const name = (item.full_name || '').toLowerCase()
      const cid = (item.cid_no || '').toLowerCase()
      const regNo = (item.registration_no || '').toLowerCase()

      const nameMatch = name !== 'n/a' && name.includes(query)
      const cidMatch = cid !== 'n/a' && cid.includes(query)
      const regNoMatch = regNo !== 'n/a' && regNo.includes(query)

      if (!(nameMatch || cidMatch || regNoMatch)) {
        if (
          query === 'n/a' &&
          (item.full_name === 'N/A' || item.cid_no === 'N/A' || item.registration_no === 'N/A')
        ) {
          return true
        }
        return false
      }
    }
    return true
  })
})

const paginatedCombinedData = computed(() => {
  if (!Array.isArray(filteredCombinedData.value)) return []
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCombinedData.value.slice(start, end)
})

const pendingCount = computed(() => {
  return filteredCombinedData.value.filter((item) => getRenewalStatus(item) === 'Pending').length
})

// Computed property for the header description string
const headerDescription = computed(() => {
  return `Total Matches: ${filteredCombinedData.value.length} | Pending Review: ${pendingCount.value}`
})

const totalPages = computed(() => {
  if (!Array.isArray(filteredCombinedData.value)) return 1
  return Math.max(1, Math.ceil(filteredCombinedData.value.length / itemsPerPage))
})

const paginationStart = computed(() => {
  if (!Array.isArray(filteredCombinedData.value) || filteredCombinedData.value.length === 0)
    return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const paginationEnd = computed(() => {
  if (!Array.isArray(filteredCombinedData.value)) return 0
  return Math.min(currentPage.value * itemsPerPage, filteredCombinedData.value.length)
})

// --- Methods ---
const getPrimaryQualification = (item) => {
  if (Array.isArray(item.user_qualifications) && item.user_qualifications.length > 0) {
    return item.user_qualifications.find((q) => q.is_primary_qualification)
  }
  return null
}

const getInitials = (item) => {
  const name = item.full_name
  if (!name || name === 'N/A') return '?'
  return name
    .split(' ')
    .map((word) => word?.[0] || '')
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// EPC specific renewal status logic - updated for new applications
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

  // Default to Pending for new applications
  return 'Pending'
}

const getRenewalStatus = (item) => {
  return item.renewal_status || 'Pending'
}

const getRenewalStatusClasses = (item) => {
  const status = getRenewalStatus(item)
  return [
    'px-3 py-1 rounded-full text-xs font-medium inline-block',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Regretted' || status === 'Rejected',
      'bg-gray-100 text-gray-800': !['Pending', 'Approved', 'Regretted', 'Rejected'].includes(status),
    },
  ]
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  } catch {
    return 'N/A'
  }
}

const avatarError = (event) => {
  event.target.style.display = 'none'
}

const fetchMasterData = async () => {
  try {
    const responses = await Promise.allSettled([
      apiServices.getMhpcMastersPersonnelCategories
        ? apiServices.getMhpcMastersPersonnelCategories()
        : Promise.resolve({ data: null }),
      apiServices.getMhpcMastersSubCategories
        ? apiServices.getMhpcMastersSubCategories()
        : Promise.resolve({ data: null }),
      apiServices.getMhpcMastersSectors
        ? apiServices.getMhpcMastersSectors()
        : Promise.resolve({ data: null }),
    ])

    const processResponse = (response, targetRef) => {
      if (response.status === 'fulfilled' && response.value?.data) {
        targetRef.value = response.value.data.results || response.value.data || []
      } else if (response.status === 'rejected') {
        console.error(`Failed fetch: ${response.reason}`)
      }
    }

    processResponse(responses[0], personnelCategories)
    processResponse(responses[1], personnelSubcategories)
    processResponse(responses[2], sectors)
  } catch (error) {
    console.error('Error fetching master data container:', error)
    toast.error('Failed to load master data')
  }
}

// Fetch renewals from EPC renewals endpoint
const fetchRenewals = async () => {
  isFetchingRenewals.value = true
  renewals.value = []
  try {
    console.log('Fetching from getEpcRenewals...')
    const response = await apiServices.getEpcRenewals()

    console.log('EPC Renewals API Response:', response.data)
    const results = response?.data?.results ?? response?.data ?? null
    if (Array.isArray(results)) {
      renewals.value = results
      console.log('First renewal sample:', results[0])
    } else {
      console.error('Unexpected API response structure for EPC renewals:', response?.data)
      toast.error('Received invalid renewal data structure.')
      renewals.value = []
    }
  } catch (error) {
    console.error('Error fetching EPC renewals:', error)
    const errorMsg = error.response?.data?.detail || error.message || 'Unknown error'
    toast.error(`Failed to load EPC renewal data: ${errorMsg}`)
    renewals.value = []
  } finally {
    isFetchingRenewals.value = false
  }
}

// Fetch applications to get full user/qualification data for lookup
const fetchApplications = async () => {
  isFetchingApplications.value = true
  applications.value = []
  try {
    console.log('Fetching from getEpcNewApplications for lookup data...')
    const response = await apiServices.getEpcNewApplications()

    console.log('EPC Applications API Response:', response.data)
    const results = response?.data?.results ?? response?.data ?? null
    if (Array.isArray(results)) {
      applications.value = results
      console.log('First application sample:', results[0])
    } else {
      console.error('Unexpected API response structure for EPC applications:', response?.data)
      toast.error('Received invalid application data structure.')
      applications.value = []
    }
  } catch (error) {
    console.error('Error fetching EPC applications:', error)
    const errorMsg = error.response?.data?.detail || error.message || 'Unknown error'
    toast.error(`Failed to load EPC application data: ${errorMsg}`)
    applications.value = []
  } finally {
    isFetchingApplications.value = false
  }
}

const viewDetails = (item) => {
  selectedItem.value = JSON.parse(JSON.stringify(item))
  isModalOpen.value = true
}

const handleUpdate = async () => {
  isLoading.value = true
  // Refetch both renewals and applications data after update
  await Promise.allSettled([fetchRenewals(), fetchApplications()])
  closeModal()
  toast.success('Renewal application processed successfully')
}

const closeModal = () => {
  isModalOpen.value = false
  selectedItem.value = null
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// --- Lifecycle Hooks ---
onMounted(async () => {
  isLoading.value = true
  // Fetch both renewals and applications concurrently
  await Promise.allSettled([fetchMasterData(), fetchRenewals(), fetchApplications()])
})
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
