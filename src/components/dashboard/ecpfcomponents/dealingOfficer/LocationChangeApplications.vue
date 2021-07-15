<template>
  <div class="ecpf-location-change-table p-8 min-h-screen bg-gray-50">
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
              <p class="text-xl font-bold text-gray-800">{{ applicationsWithDetails.length }}</p>
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
              <p class="text-xs font-semibold text-gray-500 uppercase">Pending</p>
              <p class="text-xl font-bold text-gray-800">{{ pendingCount }}</p>
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
              <p class="text-xs font-semibold text-gray-500 uppercase">Approved</p>
              <p class="text-xl font-bold text-gray-800">{{ approvedCount }}</p>
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
              <p class="text-xs font-semibold text-gray-500 uppercase">Rejected</p>
              <p class="text-xl font-bold text-gray-800">{{ rejectedCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main heading -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">ECPF Location Change Applications</h2>
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
                class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, CID, or firm..."
              />
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select
              v-model="statusFilter"
              class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center p-12 bg-white rounded-xl shadow-sm">
        <p class="text-gray-600">Loading application data...</p>
      </div>

      <!-- Table View -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Applicant Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  CID No.
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Firm Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Contact No.
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Application Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="application in filteredApplicationsWithDetails"
                :key="application.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-semibold mr-3"
                    >
                      {{ getInitials(application.proprietorName) }}
                    </div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ application.proprietorName }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ application.cid }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ application.ecpfName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ application.contactNo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(application.status)">{{
                    application.status
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-4">
                    <button
                      @click="viewApplication(application)"
                      class="text-indigo-600 hover:text-indigo-900 font-semibold"
                    >
                      View
                    </button>
                    <button
                      @click="forwardApplication(application)"
                      class="text-gray-500 hover:text-gray-800 font-semibold"
                    >
                      Forward
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!isLoading && filteredApplicationsWithDetails.length === 0">
                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                  No applications found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination (simplified for example) -->
      <div class="flex items-center justify-between py-4">
        <p class="text-sm text-gray-700">
          Showing <span class="font-medium">1</span> to
          <span class="font-medium">{{ filteredApplicationsWithDetails.length }}</span> of
          <span class="font-medium">{{ applicationsWithDetails.length }}</span> results
        </p>
      </div>

      <!-- Use the Modal Component Here -->
      <LocationChangeModal
        :is-open="isModalOpen"
        :application-data="selectedApplication"
        @close-modal="closeModal"
        @approve="onApprove"
        @reject="onReject"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LocationChangeModal from './modals/EcpfLocationChangeModal.vue'
import apiServices from '@/services/services'

const searchQuery = ref('')
const statusFilter = ref('')
const isLoading = ref(false)
const isModalOpen = ref(false)
const selectedApplication = ref(null)

const applicationsWithDetails = ref([])

onMounted(async () => {
  await fetchApplicationsWithDetails()
})

// ✨ NEW, EFFICIENT, AND CORRECTED FETCH LOGIC
const fetchApplicationsWithDetails = async () => {
  isLoading.value = true
  try {
    // 1. Fetch both data sources at the same time. This is faster.
    const [locationChangesResponse, profilesResponse] = await Promise.all([
      apiServices.getEcpfLocationChanges(),
      apiServices.getEcpfProfiles(), // Use the working "list" endpoint for profiles
    ])

    const locationChangeRequests = locationChangesResponse.data.results
    const allProfiles = profilesResponse.data.results

    // 2. Create a Profile Map for easy and fast lookups (ID -> Profile Object)
    const profilesMap = new Map(allProfiles.map((profile) => [profile.id, profile]))

    // 3. Combine the data
    const combinedData = locationChangeRequests.map((req) => {
      // Find the matching profile from our map
      const profile = profilesMap.get(req.ecpf_profile)

      // Handle cases where a profile might not be found
      if (!profile) {
        console.warn(
          `Profile with ID ${req.ecpf_profile} not found for location change ID ${req.id}.`,
        )
        // Return a partial object so the app doesn't crash
        return {
          id: req.id,
          new_location: req.new_location,
          new_geowg_throm: req.new_geowg_throm,
          new_dzongkhag_throm: req.new_dzongkhag_throm,
          remarks: req.remarks,
          status: req.status || 'Pending Review',
          proprietorName: 'Profile Not Found',
          cid: 'N/A',
          ecpfName: 'N/A',
          contactNo: 'N/A',
          emailAddress: 'N/A',
          currentLocation: 'N/A',
        }
      }

      // Create one clean object with all required fields
      return {
        id: req.id,
        new_location: req.new_location,
        new_geowg_throm: req.new_geowg_throm,
        new_dzongkhag_throm: req.new_dzongkhag_throm,
        remarks: req.remarks,
        status: req.status || 'Pending Review',
        proprietorName: profile.applicants_name,
        cid: profile.cid_no,
        ecpfName: profile.proposed_firm_name,
        contactNo: profile.contact_no,
        emailAddress: profile.email,
        currentLocation: profile.firm_address,
      }
    })

    applicationsWithDetails.value = combinedData
  } catch (error) {
    console.error('Error fetching comprehensive application details:', error)
    alert('Error loading applications. Please check the console.')
  } finally {
    isLoading.value = false
  }
}

// The rest of the script remains the same as it correctly uses the final data
const filteredApplicationsWithDetails = computed(() => {
  if (!applicationsWithDetails.value) return []
  return applicationsWithDetails.value.filter((application) => {
    const searchLower = searchQuery.value.toLowerCase()
    const statusLower = statusFilter.value.toLowerCase()

    const matchesSearch =
      !searchQuery.value ||
      application.proprietorName?.toLowerCase().includes(searchLower) ||
      application.ecpfName?.toLowerCase().includes(searchLower) ||
      application.cid?.includes(searchLower)

    const matchesStatus = !statusFilter.value || application.status?.toLowerCase() === statusLower

    return matchesSearch && matchesStatus
  })
})

const pendingCount = computed(
  () =>
    filteredApplicationsWithDetails.value.filter((app) => app.status === 'Pending Review').length,
)
const approvedCount = computed(
  () => filteredApplicationsWithDetails.value.filter((app) => app.status === 'Approved').length,
)
const rejectedCount = computed(
  () => filteredApplicationsWithDetails.value.filter((app) => app.status === 'Rejected').length,
)

const viewApplication = (application) => {
  selectedApplication.value = application
  isModalOpen.value = true
}

const forwardApplication = async (application) => {
  alert(`Forwarding application for ${application.proprietorName}...`)
}

const closeModal = () => {
  isModalOpen.value = false
  selectedApplication.value = null
}

const onApprove = async (payload) => {
  alert(`Application for ${selectedApplication.value.proprietorName} approved.`)
  closeModal()
  await fetchApplicationsWithDetails()
}

const onReject = async (payload) => {
  alert(`Application for ${selectedApplication.value.proprietorName} rejected.`)
  closeModal()
  await fetchApplicationsWithDetails()
}

const getInitials = (name) => {
  if (!name || name === 'Profile Not Found') return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

const getStatusClasses = (status) => {
  return [
    'px-2',
    'inline-flex',
    'text-xs',
    'leading-5',
    'font-semibold',
    'rounded-full',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending Review',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Rejected',
    },
  ]
}
</script>

<style scoped>
/* Your component styles can remain here */
</style>
