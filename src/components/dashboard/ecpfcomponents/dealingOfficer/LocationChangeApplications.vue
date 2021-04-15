<!-- DealingOfficerLocationChangeTable.vue -->
<template>
  <div class="ecpf-location-change-table p-8 min-h-screen">
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
              <p class="text-xl font-bold text-gray-800">{{ locationChangeApplications.length }}</p>
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
                v-for="application in filteredLocationChangeApplications"
                :key="application.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold mr-3"
                    >
                      {{ getInitials(application.applicantName) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ application.applicantName }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ application.cid }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ application.firmName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ application.contactNo }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(application.status)">
                    {{ application.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="viewApplication(application)" class="view-button">View</button>
                    <button @click="forwardApplication(application)" class="forward-button">
                      Forward
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredLocationChangeApplications.length === 0">
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

      <!-- Pagination -->
      <div class="flex items-center justify-between py-4">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="pagination-button-mobile">Previous</button>
          <button class="pagination-button-mobile ml-3">Next</button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">1</span> to
              <span class="font-medium">{{ filteredLocationChangeApplications.length }}</span> of
              <span class="font-medium">{{ locationChangeApplications.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="pagination-nav" aria-label="Pagination">
              <button class="pagination-button-nav prev">
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
              <button aria-current="page" class="pagination-button-nav current">1</button>
              <button class="pagination-button-nav">2</button>
              <button class="pagination-button-nav next">
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

      <!--  Use the Modal Component Here -->
      <LocationChangeModal
        v-if="isModalOpen"
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
import apiServices from '@/services/services' // Import your API service

const searchQuery = ref('')
const statusFilter = ref('')
const isModalOpen = ref(false)
const selectedApplication = ref(null)
const locationChangeApplications = ref([])
const pendingCount = ref(0)
const approvedCount = ref(0)
const rejectedCount = ref(0)

onMounted(async () => {
  fetchApplications()
})

const fetchApplications = async () => {
  try {
    const response = await apiServices.getEcpfLocationChanges()
    if (response.status === 200) {
      locationChangeApplications.value = response.data.results
      updateCounts()
    } else {
      console.error(
        'Failed to fetch location change applications:',
        response.status,
        response.data.results,
      )
      alert('Failed to load applications. Please check console.')
    }
  } catch (error) {
    console.error('Error fetching location change applications:', error)
    alert('Error loading applications. Please check console.')
  }
}

const updateCounts = () => {
  pendingCount.value = locationChangeApplications.value.filter(
    (app) => app.status === 'Pending Review',
  ).length
  approvedCount.value = locationChangeApplications.value.filter(
    (app) => app.status === 'Approved',
  ).length
  rejectedCount.value = locationChangeApplications.value.filter(
    (app) => app.status === 'Rejected',
  ).length
}

const filteredLocationChangeApplications = computed(() => {
  return locationChangeApplications.value.filter((application) => {
    const searchLower = searchQuery.value.toLowerCase()
    const statusLower = statusFilter.value.toLowerCase()

    const matchesSearch =
      !searchQuery.value ||
      application.applicantName?.toLowerCase().includes(searchLower) ||
      application.firmName?.toLowerCase().includes(searchLower) ||
      application.cid?.toLowerCase().includes(searchLower)

    const matchesStatus = !statusFilter.value || application.status?.toLowerCase() === statusLower

    return matchesSearch && matchesStatus
  })
})

const getStatusClasses = (status) => {
  return [
    'status-badge',
    {
      'status-pending': status === 'Pending Review',
      'status-approved': status === 'Approved',
      'status-rejected': status === 'Rejected',
    },
  ]
}

const viewApplication = async (application) => {
  try {
    const response = await apiServices.getEcpfLocationChange(application.id)
    if (response.status === 200) {
      selectedApplication.value = response.data.results
      isModalOpen.value = true
    } else {
      console.error('Failed to fetch application details:', response.status, response.data.results)
      alert('Failed to view application details.')
    }
  } catch (error) {
    console.error('Error fetching application details:', error)
    alert('Error viewing application.')
  }
}

const forwardApplication = async (application) => {
  try {
    const response = await apiServices.patchEcpfLocationChange(application.id, {
      status: 'Forwarded',
    }) // Example status update
    if (response.status === 200) {
      alert(`Location change application for ${application.applicantName} has been forwarded.`)
      fetchApplications() // Refresh applications list
    } else {
      console.error('Failed to forward application:', response.status, response.data.results)
      alert('Failed to forward application.')
    }
  } catch (error) {
    console.error('Error forwarding application:', error)
    alert('Error forwarding application.')
  }
}

const closeModal = () => {
  isModalOpen.value = false
  selectedApplication.value = null
}

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}
</script>

<style scoped>
/* Styles remain the same as in your provided DealingOfficerLocationChangeTable.vue code */
</style>
