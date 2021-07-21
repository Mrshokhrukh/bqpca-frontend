<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">DPR Application List</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ filteredApplications.length }}
        </span>
        <span class="mx-4">|</span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          Pending: {{ pendingApplicationsCount }}
        </span>
        <span class="mx-4">|</span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          Approved: {{ approvedApplicationsCount }}
        </span>
        <span class="mx-4">|</span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
          Regretted: {{ regrettedApplicationsCount }}
        </span>
      </div>
    </div>

    <!-- Search Input -->
    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
      <div class="relative">
        <input v-model="searchQuery" type="text" placeholder="Search by App ID or Institution Name..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center py-10 text-gray-500">Loading applications...</div>
    <div v-if="error" class="text-center py-10 text-red-600 bg-red-50 p-4 rounded-lg">
      Error loading applications: {{ error.message || error }}
    </div>

    <!-- Application Table -->
    <div v-if="!loading && !error && applications.length > 0"
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                App ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Institution Name
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Commencement Date
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                DPR Status
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="filteredApplications.length > 0">
              <tr v-for="application in filteredApplications" :key="application.id"
                class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ application.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ application.name_of_institution || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDate(application.commencement_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(application)">
                    {{ application.do_dpr_review_decision || 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-3">
                    <button @click="openApplication(application)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr v-if="!loading">
                <td colspan="5" class="text-center py-10 text-gray-500">
                  No applications found matching your search query.
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="!loading && !error && applications.length === 0" class="text-center py-10 text-gray-500">
      No applications found.
    </div>

    <!-- Modal -->
    <DprModal v-if="isModalOpen" :isOpen="isModalOpen" :application="selectedApplication" @close="closeApplication"
      @save="handleSave" @approve="onApplicationApproved" @regretted="onApplicationRejected"
      :key="selectedApplication ? `modal-${selectedApplication.id}` : 'modal-no-app'" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DprModal from '../instituteManagement/DprModal.vue'
import apiService from '@/services/services'

const applications = ref([])
const isModalOpen = ref(false)
const selectedApplication = ref(null)
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  await fetchApplications()
})

const onApplicationRejected = async () => {
  console.log('Regretted event received for DPR.')
  closeApplication()
  await fetchApplications()
}

const fetchApplications = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getEpcInstitutes()
    applications.value = Array.isArray(response?.data?.results) ? response.data.results : []
    console.log('Fetched applications:', applications.value)
  } catch (err) {
    console.error('Error fetching applications:', err)
    error.value = err
    applications.value = []
  } finally {
    loading.value = false
  }
}

const openApplication = (application) => {
  if (!application || typeof application !== 'object' || !application.id) {
    console.error('Attempted to open modal with invalid application data:', application)
    error.value = 'Cannot open details for invalid application data.'
    return
  }
  console.log('Opening application:', application)
  selectedApplication.value = application
  isModalOpen.value = true
}

const closeApplication = () => {
  isModalOpen.value = false
  selectedApplication.value = null
  console.log('Modal closed')
}

const handleSave = async () => {
  console.log('Save event received from modal. Refreshing list.')
  closeApplication()
  await fetchApplications()
}

const onApplicationApproved = async (approvedApplication) => {
  console.log('Approve event received for DPR:', approvedApplication.id)
  closeApplication()
  await fetchApplications()
}


const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (e) {
    console.error('Error formatting date:', dateString, e)
    return 'Invalid Date'
  }
}

const filteredApplications = computed(() => {
  if (!Array.isArray(applications.value)) {
    return []
  }
  return applications.value.filter((application) => {
    // Exclude applications with empty or missing dpr_name
    if (!application.dpr_name || application.dpr_name.trim() === '') return false

    const isApprovedEoi = application.review_decision === 'Approved'
    const query = searchQuery.value ? searchQuery.value.toLowerCase().trim() : ''
    const idMatch = String(application?.id || '').includes(query)
    const institutionName = (application?.name_of_institution || '').toLowerCase()
    const institutionMatch = institutionName.includes(query)
    return isApprovedEoi && (!query || idMatch || institutionMatch)
  })
})

const pendingApplicationsCount = computed(() => {
  return filteredApplications.value.filter(
    (app) => !app.do_dpr_review_decision || app.do_dpr_review_decision === 'Pending'
  ).length
})

const approvedApplicationsCount = computed(() => {
  return filteredApplications.value.filter((app) => app.do_dpr_review_decision === 'Approved').length
})

const regrettedApplicationsCount = computed(() => {
  return filteredApplications.value.filter((app) => app.do_dpr_review_decision === 'Regretted').length
})

const getStatusClasses = (application) => {
  const status = application?.do_dpr_review_decision || 'Pending'
  return [
    'px-3 py-1 rounded-full text-xs font-medium inline-block',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Regretted',
    },
  ]
}
</script>
