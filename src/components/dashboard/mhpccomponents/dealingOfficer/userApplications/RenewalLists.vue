<template>
  <div class="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
    <DOPageHeader title="Renewal Applications" :description="headerDescription" :search-query="searchQuery"
      @update:searchQuery="searchQuery = $event" search-placeholder="Search by name, CID or registration number..."
      :filter-value="filterStatus" @update:filterValue="filterStatus = $event" :filter-options="statusFilterOptions" />

    <div class="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th v-for="header in tableHeaders" :key="header"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody v-if="!isLoading" class="divide-y divide-gray-200 bg-white">
            <tr v-for="item in paginatedCombinedData" :key="item.renewal_id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                #{{ item.renewal_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 flex-shrink-0 font-semibold text-xs">
                    {{ getInitials(item) }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ item.full_name }}</div>
                    <div class="text-xs text-gray-500">{{ item.cid_no }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ item.registration_no }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(item.application_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(item.renewal_status)">
                  {{ item.renewal_status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPaymentClasses(item)">
                  {{ item.payment_status.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(item.original_expiry_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="viewDetails(item)"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg shadow-sm transition-colors duration-200 text-xs inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
              </td>
            </tr>
            <tr v-if="!isLoading && paginatedCombinedData.length === 0">
              <td :colspan="tableHeaders.length" class="px-6 py-8 text-center text-gray-500">
                No renewal applications found that match your criteria.
              </td>
            </tr>
          </tbody>
          <tbody v-if="isLoading">
            <tr>
              <td :colspan="tableHeaders.length" class="px-6 py-16 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <svg class="animate-spin h-6 w-6 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <p class="font-medium">Loading renewal application data...</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="!isLoading && totalPages > 1" class="mt-6 flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ paginationStart }}</span> to
          <span class="font-medium">{{ paginationEnd }}</span> of
          <span class="font-medium">{{ filteredData.length }}</span> results
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 bg-white">
          &laquo; Prev
        </button>
        <span class="text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 bg-white">
          Next &raquo;
        </button>
      </div>
    </div>
    <RenewalDetailsModal :is-open="isModalOpen" :renewal-data="selectedItem" @close="closeModal"
      @update="handleUpdate" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiServices from '@/services/services'
import RenewalDetailsModal from '../modals/RenewalDetailsModal.vue'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'

// --- State ---
const renewals = ref([])
const qualificationsMap = ref({}) // Use a map for efficient lookups
const filterStatus = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isModalOpen = ref(false)
const selectedItem = ref(null)
const isLoading = ref(true)
const toast = useToast()

const tableHeaders = [
  'ID',
  'Applicant',
  'Reg. No.',
  'Applied On',
  'Status',
  'Original Expiry',
  'Actions',
]

const statusFilterOptions = [
  { value: 'all', text: 'All Statuses' },
  { value: 'PENDING', text: 'Pending' },
  { value: 'APPROVED', text: 'Approved' },
  { value: 'REJECTED', text: 'Rejected' },
]

// --- Data Fetching ---
const fetchAllData = async () => {
  isLoading.value = true
  try {
    // Fetch renewals and qualifications in parallel
    const [renewalResponse, qualResponse] = await Promise.all([
      apiServices.getMhpcRenewals(),
      apiServices.getMhpcNewQualifications(), // This endpoint gives us details for each professional
    ]);

    // Process renewals
    renewals.value = renewalResponse?.data?.results ?? []

    // Process qualifications into an efficient map
    const qMap = {}
    const qualifications = qualResponse?.data?.results ?? []
    qualifications.forEach((qual) => {
      qMap[qual.id] = qual // Assuming 'qual.id' matches `renewal.user_qualification`
    })
    qualificationsMap.value = qMap
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    toast.error('Failed to load dashboard data. Please refresh the page.')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAllData)

// --- Computed Properties for Filtering and Display ---
const combinedData = computed(() => {

  return renewals.value
    .map((renewal) => {
      const qualification = qualificationsMap.value[renewal.user_qualification] || {};

      // ADDED: Check if the applicant is a counselor.
      // Adjust 'Counselor' if the category name is different in your system.
      const isCounselor = qualification.personnel_category_name?.includes('Counselor') || false

      return {
        // Data from the renewal object
        renewal_id: renewal.id,
        renewal_status: renewal.renewal_status,
        renewal_remarks: renewal.renewal_remarks,
        proposed_expiry_date: renewal.proposed_expiry_date,
        application_date: renewal.created_at,
        payment_status: renewal.payment_status,
        payment_id: renewal.payment_id,
        decision_status: renewal.renewal_status || 'N/A',
        qualification_id: qualification.id,
        full_name: qualification.applicant_name || 'N/A',
        cid_no: qualification.application?.cid_no || 'N/A',
        registration_no: qualification.registration_no || 'N/A',
        original_expiry_date: qualification.expiry_date,
        original_qualification: qualification,

        // ADDED: Pass the is_counselor flag to the modal.
        is_counselor: isCounselor,
      }
    })
    .sort((a, b) => new Date(b.application_date) - new Date(a.application_date))
})

const filteredData = computed(() => {
  return combinedData.value.filter((item) => {
    const statusMatch = filterStatus.value === 'all' || item.renewal_status === filterStatus.value
    const searchMatch =
      !searchQuery.value ||
      item.full_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.cid_no.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.registration_no.toLowerCase().includes(searchQuery.value.toLowerCase())
    return statusMatch && searchMatch
  })
})

const headerDescription = computed(() => {
  const total = combinedData.value.length
  const pending = combinedData.value.filter((item) => item.renewal_status === 'PENDING').length
  return `Total Renewals: ${total} | Pending Review: ${pending}`
})

// --- Pagination ---
const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))
const paginatedCombinedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredData.value.slice(start, end)
})
const paginationStart = computed(() =>
  filteredData.value.length ? (currentPage.value - 1) * itemsPerPage + 1 : 0,
)
const paginationEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage, filteredData.value.length),
)

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

watch([searchQuery, filterStatus], () => {
  currentPage.value = 1
})

// --- Helper & Event Handler Methods ---
const getInitials = (item) => {
  const name = item.full_name
  if (!name || name === 'N/A') return '?'
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}



const getPaymentClasses = (app) => {
  const status = app.payment_status;
  return [
    'px-3 py-1 inline-flex items-center justify-center text-xs leading-5 font-[500] rounded-full shadow-sm', // Base classes for consistency
    {
      'bg-yellow-100 text-yellow-800': status === 'pending',
      'bg-green-100 text-green-800': status === 'completed',
    },
  ]
}



const getStatusClasses = (status) => ({
  'px-2 py-1 rounded-full text-xs font-medium inline-block': true,
  'bg-yellow-100 text-yellow-800': status === 'PENDING',
  'bg-green-100 text-green-800': status === 'APPROVED',
  'bg-red-100 text-red-800': status === 'REJECTED',
  'bg-gray-100 text-gray-800': !['PENDING', 'APPROVED', 'REJECTED'].includes(status),
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return dayjs(dateString).format('MMM D, YYYY')
}

const viewDetails = (item) => {
  selectedItem.value = item
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedItem.value = null
}

const handleUpdate = async () => {
  closeModal()
  toast.success('Renewal application processed successfully!')
  await fetchAllData() // Refresh data after update
}
</script>
