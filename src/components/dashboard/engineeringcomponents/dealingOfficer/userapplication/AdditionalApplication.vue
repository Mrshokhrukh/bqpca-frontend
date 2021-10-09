<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Use the DOPageHeader Component -->
    <DOPageHeader title="Additional Qualification Applications" :description="headerDescription"
      :search-query="searchQuery" @update:searchQuery="searchQuery = $event"
      search-placeholder="Search by name, CID or registration number..." :filter-value="filterStatus"
      @update:filterValue="filterStatus = $event" :filter-options="statusFilterOptions" />

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Applicant
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Registration No.
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Primary Qualification
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Additional Qualification(s)
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="paginatedApplications.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                No applications found matching your criteria.
              </td>
            </tr>
            <tr v-for="app in paginatedApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ app.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="app.passport_photo || 'https://placehold.co/32x32/EFEFEF/AAAAAA?text=N/A'"
                    alt="Applicant photo" class="h-8 w-8 rounded-full object-cover mr-3"
                    onerror="this.src='https://placehold.co/32x32/EFEFEF/AAAAAA?text=N/A'" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ app.full_name || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-500">{{ app.cid_no || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ app.registration_no || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <template v-if="app.user_qualifications?.some((q) => q.is_primary_qualification)">
                  <div v-for="qualification in app.user_qualifications.filter(
                    (q) => q.is_primary_qualification,
                  )" :key="'primary-' + qualification.id">
                    <span class="text-xs text-gray-600">{{
                      qualification.qualification_name_display || 'N/A'
                    }}</span>
                  </div>
                </template>
                <template v-else>
                  <div class="text-xs text-orange-500">
                    <span class="font-medium">⚠️</span> No Primary Found
                  </div>
                </template>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <template v-if="app.user_qualifications?.some((q) => !q.is_primary_qualification)">
                  <div v-for="qualification in app.user_qualifications.filter(
                    (q) => !q.is_primary_qualification,
                  )" :key="'additional-' + qualification.id" class="mb-1 last:mb-0">
                    <span :class="getQualificationStatusClasses(qualification)" class="px-2 py-1 rounded text-xs">
                      {{ getIndividualQualificationStatus(qualification) }}
                    </span>
                    <span class="text-xs text-gray-600 ml-1">({{ qualification.qualification_name_display || 'N/A'
                    }})</span>
                  </div>
                </template>
                <template v-else> N/A </template>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(app)">
                  {{ getStatus(app) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(app.registration_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="viewDetails(app)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
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
    <div v-if="totalPages > 1"
      class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          Previous
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
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
            <span class="font-medium">{{ filteredApplications.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-opacity">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <span
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-opacity">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ViewDetailsModal :isOpen="isModalOpen" :application="selectedApplication" @close="closeModal"
      @update="handleUpdate" :personnel-categories="personnelCategories"
      :personnel-subcategories="personnelSubcategories" :sectors="sectors" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import apiServices from '@/services/services'
import ViewDetailsModal from '../modals/ViewApplicationDetailsModal.vue'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue'
import { useToast } from 'vue-toastification'


const applications = ref([])
const filterStatus = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const isModalOpen = ref(false)
const selectedApplication = ref(null)
const personnelCategories = ref([])
const personnelSubcategories = ref([])
const sectors = ref([])
const toast = useToast()


const statusFilterOptions = ref([
  { value: 'all', text: 'All Statuses' },
  { value: 'Pending', text: 'Pending' },
  { value: 'Approved', text: 'Approved' },
  { value: 'Regretted', text: 'Regretted' },
])




const filteredApplications = computed(() => {
  return (
    applications.value
      .filter((app) => app.user_qualifications?.some((q) => q.is_primary_qualification === false))
      .filter((app) => {
        if (filterStatus.value !== 'all') {
          return getStatus(app) === filterStatus.value
        }
        return true
      })
      .filter((app) => {
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          return (
            app.full_name?.toLowerCase().includes(query) ||
            app.cid_no?.toLowerCase().includes(query) ||
            app.registration_no?.toLowerCase().includes(query)
          )
        }
        return true
      })
  )
})

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredApplications.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredApplications.value.length / itemsPerPage))
})

const paginationStart = computed(() => {
  if (filteredApplications.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredApplications.value.length)
})

const pendingCount = computed(() => {
  return filteredApplications.value.filter((app) => getStatus(app) === 'Pending').length
})

const headerDescription = computed(() => {
  return `Total: ${filteredApplications.value.length} | Pending Review: ${pendingCount.value}`
})

watch([filterStatus, searchQuery], () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
})

const getStatus = (app) => {
  const additionalQualifications =
    app.user_qualifications?.filter((q) => !q.is_primary_qualification) || []

  if (additionalQualifications.length === 0) {
    console.warn(`Application ID ${app.id} has no additional qualifications despite filtering.`)
    return 'Pending'
  }

  const isRegretted = additionalQualifications.some(
    (q) => getIndividualQualificationStatus(q) === 'Regretted',
  )
  if (isRegretted) {
    return 'Regretted'
  }
  const allApproved = additionalQualifications.every(
    (q) => getIndividualQualificationStatus(q) === 'Approved',
  )
  if (allApproved) {
    return 'Approved'
  }

  return 'Pending'
}

const getIndividualQualificationStatus = (qualification) => {
  if (!qualification) return 'Pending'

  const { application_review_status, physical_review_status, endorsement_decision } = qualification

  if (
    application_review_status === 'Regretted' ||
    physical_review_status === 'Regretted' ||
    endorsement_decision === 'Regretted'
  ) {
    return 'Regretted'
  }
  if (
    application_review_status === 'Approved' &&
    physical_review_status === 'Approved' &&
    endorsement_decision === 'Approved'
  ) {
    return 'Approved'
  }
  return 'Pending'
}

const getStatusClasses = (app) => {
  const status = getStatus(app)
  return [
    'px-3 py-1 rounded-full text-xs font-medium inline-block',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Regretted',
    },
  ]
}

const getQualificationStatusClasses = (qualification) => {
  const status = getIndividualQualificationStatus(qualification)
  return {
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-red-100 text-red-800': status === 'Regretted',
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
  } catch (e) {
    console.error('Error formatting date:', date, e)
    return 'Invalid Date'
  }
}

const fetchMasterData = async () => {
  try {
    const [categoriesRes, subcategoriesRes, sectorsRes] = await Promise.allSettled([
      apiServices.getEpcMastersPersonnelCategories
        ? apiServices.getEpcMastersPersonnelCategories()
        : Promise.resolve({ data: { results: [] } }),
      apiServices.getEpcMastersSubCategories
        ? apiServices.getEpcMastersSubCategories()
        : Promise.resolve({ data: { results: [] } }),
      apiServices.getEpcMastersSectors
        ? apiServices.getEpcMastersSectors()
        : Promise.resolve({ data: { results: [] } }),
    ])

    personnelCategories.value =
      categoriesRes.status === 'fulfilled' ? categoriesRes.value?.data?.results || [] : []
    personnelSubcategories.value =
      subcategoriesRes.status === 'fulfilled' ? subcategoriesRes.value?.data?.results || [] : []
    sectors.value = sectorsRes.status === 'fulfilled' ? sectorsRes.value?.data?.results || [] : []
  } catch (error) {
    console.error('Error fetching master data:', error)
    toast.error('Failed to load master data.')
  }
}

const fetchApplications = async () => {
  try {
    const response = await apiServices.getEpcNewApplications()
    applications.value = response?.data?.results || []
  } catch (error) {
    console.error('Error fetching applications:', error)
    toast.error('Failed to load applications.')
    applications.value = []
  }
}

const viewDetails = async (application) => {
  if (!application) return
  selectedApplication.value = { ...application, userDetails: null, isLoading: true }
  isModalOpen.value = true

  try {
    const response = await apiServices.getAllUsers()
    const users = response?.data?.results || []
    const matchingUser = users.find((user) => user.cid === application.cid_no)

    selectedApplication.value = {
      ...application,
      is_counselor: matchingUser?.is_counselor || false,
      userDetails: matchingUser,
      isLoading: false,
    }
  } catch (error) {
    console.error('Error fetching user details for modal:', error)
    toast.error('Could not load full user details.')
    selectedApplication.value = {
      ...application,
      userDetails: null,
      isLoading: false,
      errorLoadingDetails: true,
    }
  }
}

const handleUpdate = async () => {
  closeModal()
  toast.info('Refreshing application list...')
  await fetchApplications()
  toast.success('Application list updated.')
}

const closeModal = () => {
  isModalOpen.value = false
  selectedApplication.value = null
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

onMounted(async () => {
  await Promise.allSettled([fetchApplications(), fetchMasterData()])
})
</script>

<style scoped>
th,
td {
  vertical-align: middle;
}
</style>
