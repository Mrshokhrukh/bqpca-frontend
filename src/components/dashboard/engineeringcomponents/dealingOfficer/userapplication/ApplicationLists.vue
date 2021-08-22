<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Use the DOPageHeader Component -->
    <DOPageHeader title="New Applications" :description="headerDescription" :search-query="searchQuery"
      @update:searchQuery="searchQuery = $event" search-placeholder="Search by name, CID or registration number..."
      :filter-value="filterStatus" @update:filterValue="filterStatus = $event" :filter-options="statusFilterOptions" />

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
            <tr v-for="app in paginatedApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ app.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="app.passport_photo || ''" class="h-8 w-8 rounded-full object-cover mr-3"
                    alt="Applicant photo" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ app.full_name }}</div>
                    <div class="text-sm text-gray-500">{{ app.cid_no }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ app.registration_no }}
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
            <!-- Empty State for Table -->
            <tr v-if="filteredApplications.length === 0">
              <td colspan="6" class="px-6 py-16 text-center text-gray-500">
                No applications match the current filters.
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
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <!-- Pagination Numbers can be added here if needed -->
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
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
      :personnel-subcategories="personnelSubcategories" :sectors="sectors" :registration-types="registrationTypes" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
const registrationTypes = ref([])
const toast = useToast()

const statusFilterOptions = computed(() => {
  const statuses = new Set(applications.value.map(app => getStatus(app)))
  const options = Array.from(statuses).map(status => ({
    value: status,
    text: status,
  }))
  // Add the 'All' option to the beginning of the list
  return [{ value: 'all', text: 'All Statuses' }, ...options]
})

const pendingCount = computed(() => {
  return applications.value
    .filter(
      (app) =>
        app.registration_type_name !== 'Renewal' &&
        app.registration_type_name !== 'Additional Qualification' &&
        app.registration_type_name !== 'Re-Registration',
    )
    .filter((app) => getStatus(app) === 'Pending').length
})

const headerDescription = computed(() => {
  return `Total New: ${filteredApplications.value.length} | Pending Review: ${pendingCount.value}`
})

const filteredApplications = computed(() => {
  return applications.value
    .filter(
      (app) =>
        app.registration_type_name !== 'Renewal' &&
        app.registration_type_name !== 'Additional Qualification' &&
        app.registration_type_name !== 'Re-Registration',
    )
    .filter((app) => {
      if (filterStatus.value && filterStatus.value !== 'all') {
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
  return filteredApplications.value.length > 0 ? (currentPage.value - 1) * itemsPerPage + 1 : 0
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredApplications.value.length)
})

const getStatus = (app) => {
  if (!Array.isArray(app.user_qualifications) || app.user_qualifications.length === 0) {
    return 'Pending'
  }

  for (const qualification of app.user_qualifications) {
    const { application_review_status, physical_review_status, endorsement_decision } =
      qualification

    if (
      application_review_status === 'Regretted' ||
      physical_review_status === 'Regretted' ||
      endorsement_decision === 'Regretted'
    ) {
      return 'Regretted'
    }
  }

  const allApproved = app.user_qualifications.every(
    (qualification) =>
      qualification.application_review_status === 'Approved' &&
      qualification.physical_review_status === 'Approved' &&
      qualification.endorsement_decision === 'Approved',
  )

  if (allApproved) {
    return 'Approved'
  }

  return 'Pending'
}

const getStatusClasses = (app) => {
  const status = getStatus(app)
  return [
    'px-3 py-1 rounded-full text-xs font-medium',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Regretted',
    },
  ]
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const fetchMasterData = async () => {
  try {
    const [categoriesRes, subcategoriesRes, sectorsRes] = await Promise.all([
      apiServices.getEpcMastersPersonnelCategories(),
      apiServices.getEpcMastersSubCategories(),
      apiServices.getEpcMastersSectors(),
    ])

    personnelCategories.value = categoriesRes.data.results || []
    personnelSubcategories.value = subcategoriesRes.data.results || []
    sectors.value = sectorsRes.data.results || []
  } catch (error) {
    console.error('Error fetching master data:', error)
  }
}

const fetchRegistrationTypes = async () => {
  try {
    const res = await apiServices.getEpcMastersRegistrationTypes()
    registrationTypes.value = res.data.results || []
  } catch (e) {
    registrationTypes.value = []
  }
}

const fetchApplications = async () => {
  try {
    const response = await apiServices.getEpcNewApplications()
    const results = response.data.results || []
    // Sort by ID descending to show the latest applications first
    results.sort((a, b) => b.id - a.id)
    applications.value = results
  } catch (error) {
    console.error('Error fetching applications:', error)
  }
}

const viewDetails = async (application) => {
  try {

    const response = await apiServices.getAllUsers()
    const users = response.data.results || []
    const matchingUser = users.find((user) => user.cid === application.cid_no)

    selectedApplication.value = {
      ...application,
      is_counselor: matchingUser?.is_counselor || false,
      userDetails: matchingUser,
    }

    isModalOpen.value = true
  } catch (error) {
    console.error('Error fetching details:', error)

    selectedApplication.value = { ...application, is_counselor: false, userDetails: null }
    isModalOpen.value = true
  }
}

const handleUpdate = async () => {
  await fetchApplications()
  closeModal()
  toast.success('Application updated successfully')
}

const closeModal = () => {
  isModalOpen.value = false
  selectedApplication.value = null
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

onMounted(async () => {
  await Promise.all([fetchApplications(), fetchMasterData(), fetchRegistrationTypes()])
})
</script>
