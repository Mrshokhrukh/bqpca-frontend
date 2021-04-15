<template>
  <div class="p-8 min-h-screen">
    <div class="mx-auto">
      <!-- Header with stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Total Applications</p>
              <p class="text-xl font-bold text-gray-800">{{ applications.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Pending Verification</p>
              <p class="text-xl font-bold text-gray-800">{{ pendingVerificationCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Accepted</p>
              <p class="text-xl font-bold text-gray-800">{{ acceptedCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4">
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
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Regretted</p>
              <p class="text-xl font-bold text-gray-800">{{ regrettedCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main heading -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">HEI Visit Promotional Event Applications</h2>
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
                v-model="searchQuery"
                @input="handleSearch"
                class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by ECPF name, Institute, or CID..."
              />
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select
              v-model="filterStatus"
              @change="handleFilter"
              class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Accepted">Accepted</option>
              <option value="Regretted">Regretted</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  ECPF Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Institute
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Programme Detail
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Applicant CID
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="application in filteredApplications"
                :key="application.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold mr-3"
                    >
                      {{ getInitials(application.ecpf_name) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ application.ecpf_name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ application.institute }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ application.program_detail }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ application.ecpf_cid }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(application.verification_status)">
                    {{ application.verification_status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="openModal(application)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      @click="forwardApplication(application)"
                      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      Forward
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredApplications.length === 0">
                <td
                  colspan="6"
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No applications found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination (Optional - you can implement if needed) -->
      <!-- ... pagination component here ... -->
    </div>

    <HEIVisitEventModal
      :is-open="isModalOpen"
      :application="selectedApplication"
      @close="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import HEIVisitEventModal from './modals/HEIVisitEventModal.vue' // Assuming path to your modal
import apiServices from '@/services/services' // Import your API service
import { useToast } from 'vue-toastification'

const toast = useToast()

const applications = ref([]) // Store all applications fetched from API
const isModalOpen = ref(false)
const selectedApplication = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')
const pendingVerificationCount = ref(0)
const acceptedCount = ref(0)
const regrettedCount = ref(0)

const fetchApplications = async () => {
  try {
    const response = await apiServices.getEcpfPromotionalHeiVisits()
    console.log('HeiVisit API Response Data:', response.data) // Debugging: Log API response
    applications.value = response.data
    updateStatusCounts() // Update counts after fetching applications
  } catch (error) {
    console.error('Error fetching applications:', error)
    toast.error('Failed to load applications.')
  }
}

const updateStatusCounts = () => {
  console.log('HeiVisit applications.value in updateStatusCounts:', applications.value) // Debugging
  if (!Array.isArray(applications.value)) {
    pendingVerificationCount.value = 0
    acceptedCount.value = 0
    regrettedCount.value = 0
    return // Exit early if not an array
  }
  pendingVerificationCount.value = applications.value.filter(
    (app) => app.verification_status === 'Pending Verification',
  ).length
  acceptedCount.value = applications.value.filter(
    (app) => app.verification_status === 'Accepted',
  ).length
  regrettedCount.value = applications.value.filter(
    (app) => app.verification_status === 'Regretted',
  ).length
}

const openModal = async (application) => {
  try {
    const response = await apiServices.getEcpfPromotionalHeiVisit(application.id)
    selectedApplication.value = response.data // Fetch detailed application for modal
    isModalOpen.value = true
  } catch (error) {
    console.error('Error fetching application details:', error)
    toast.error('Failed to load application details.')
  }
}

const closeModal = () => {
  isModalOpen.value = false
  selectedApplication.value = null
}

const forwardApplication = async (application) => {
  try {
    await apiServices.patchEcpfPromotionalHeiVisit(application.id, {
      verification_status: 'Forwarded',
    }) // Adjust status as per your backend
    toast.success(`Application for ${application.ecpf_name} forwarded.`)
    fetchApplications() // Refresh application list to reflect updated status
  } catch (error) {
    console.error('Error forwarding application:', error)
    toast.error('Failed to forward application.')
  }
}

const getStatusClasses = (status) => {
  return [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending Verification',
      'bg-green-100 text-green-800': status === 'Accepted',
      'bg-red-100 text-red-800': status === 'Regretted',
      // Add more status mappings as needed
    },
  ]
}

// Helper function to get initials from name (using ECPF Name here)
const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

// --- Search and Filter Logic ---
const filteredApplications = computed(() => {
  if (!Array.isArray(applications.value)) {
    // **ADD THIS CHECK**
    return [] // Return empty array if applications.value is not an array yet
  }

  let filtered = [...applications.value] // Start with all applications (now safe)

  // Filter by search query
  if (searchQuery.value) {
    const lowerQuery = searchQuery.value.toLowerCase()
    filtered = filtered.filter((app) => {
      return (
        app.ecpf_name.toLowerCase().includes(lowerQuery) ||
        app.institute.toLowerCase().includes(lowerQuery) ||
        app.ecpf_cid.toLowerCase().includes(lowerQuery)
      )
    })
  }

  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter((app) => app.verification_status === filterStatus.value)
  }

  return filtered
})

const handleSearch = () => {
  // No need to do anything here if using computed property, filtering is automatic
}

const handleFilter = () => {
  // No need to do anything here if using computed property, filtering is automatic
}

onMounted(() => {
  fetchApplications()
})
</script>
