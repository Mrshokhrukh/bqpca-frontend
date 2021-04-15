<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Application List</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ filteredApplications.length }}
        </span>
        <span class="mx-4">|</span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          Pending: {{ pendingCount }}
        </span>
      </div>
    </div>

    <!-- Search Input -->
    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by App ID or Name..."
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
    </div>

    <!-- Application Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Application ID
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Applicant Name
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Date Submitted
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
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
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ application.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ application.full_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(application.commencement_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(application)">
                  {{ application.do_dpr_review_decision }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    @click="openApplication(application)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <DprModal
      v-if="isModalOpen"
      :isOpen="isModalOpen"
      :application="selectedApplication"
      @close="closeApplication"
      @save="saveApplication"
      @approve="onApplicationApproved"
      @reject="onApplicationRejected"
      :key="selectedApplication ? selectedApplication.id : 'no-application'"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DprModal from '../instituteManagement/DprModal.vue'
import apiService from '@/services/services' // Import your API service

const applications = ref([]) // Initialize as an empty array
const isModalOpen = ref(false)
const selectedApplication = ref(null)
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  await fetchApplications()
})

const fetchApplications = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getMhpcInstitutes() // Use apiService
    applications.value = response.data.results
    console.log(applications.value)
  } catch (err) {
    error.value = err
    console.error('Error fetching applications:', err)
  } finally {
    loading.value = false
  }
}

const openApplication = (application) => {
  console.log('Opening application:', application)
  selectedApplication.value = application // Direct Assignment
  isModalOpen.value = true
  console.log('isModalOpen:', isModalOpen.value) // ADD THIS LOG
}

const closeApplication = () => {
  isModalOpen.value = false
  selectedApplication.value = null
}

const saveApplication = async (applicationId, updatedApplication) => {
  console.log('Saving application', applicationId, 'with updates:', updatedApplication)
  try {
    await apiService.patchMhpcInstitute(applicationId, updatedApplication) // Use apiService
    // Optionally, refresh the application list after saving
    await fetchApplications()
    closeApplication()
  } catch (error) {
    console.error('Error updating application:', error)
    // Handle the error appropriately (e.g., show an error message to the user)
    error.value = error
  }
}

const onApplicationApproved = (approvedApplication) => {
  // Handle the approved application here (e.g., update the status in the list)
  const index = applications.value.findIndex((app) => app.id === approvedApplication.id)
  if (index !== -1) {
    applications.value[index] = { ...approvedApplication }
  }
  fetchApplications()
  closeApplication()
}

const onApplicationRejected = (rejectedApplication) => {
  // Handle the rejected application here (e.g., update the status in the list)
  const index = applications.value.findIndex((app) => app.id === rejectedApplication.id)
  if (index !== -1) {
    applications.value[index] = { ...rejectedApplication }
  }
  fetchApplications()
  closeApplication()
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const filteredApplications = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return applications.value.filter((application) => {
    return (
      String(application.id).includes(query) || application.full_name.toLowerCase().includes(query)
    ) // Use backend field names
  })
})

const getStatusClasses = (application) => {
  return [
    'px-3 py-1 rounded-full text-xs font-medium',
    {
      'bg-yellow-100 text-yellow-800': application.do_dpr_review_decision === 'Pending',
      'bg-green-100 text-green-800': application.do_dpr_review_decision === 'Approved',
      'bg-red-100 text-red-800': application.do_dpr_review_decision === 'Regretted',
    },
  ]
}

const pendingCount = computed(() => {
  return filteredApplications.value.filter((app) => app.do_dpr_review_decision === 'Pending').length
})
</script>
