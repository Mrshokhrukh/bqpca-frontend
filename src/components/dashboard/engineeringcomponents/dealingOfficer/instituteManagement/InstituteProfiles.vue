<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Institute Profiles</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ institutes.length }}
        </span>
        <!-- Add status indicators here if needed -->
      </div>
    </div>

    <!-- Search and Filter (if needed, implement similarly to Applications component) -->
    <!--
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="relative">
        <input type="text" placeholder="Search institutes..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div class="flex gap-4">
        <select
          class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </div>
    -->

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Institution Name
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                CID
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Dzongkhag
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="5" class="text-center py-4">Loading institutes...</td>
            </tr>
            <tr v-else-if="institutes.length === 0">
              <td colspan="5" class="text-center py-4">No institutes found.</td>
            </tr>
            <tr
              v-else
              v-for="institute in institutes"
              :key="institute.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ institute.name_of_institution }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ institute.CID }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ institute.dzongkhag }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(institute.do_dpr_review_decision)">
                  {{ getStatusText(institute.do_dpr_review_decision) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    @click="openModal(institute)"
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

    <!-- Pagination (if needed) -->
    <!--
    <div class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      </div>
    -->

    <InstituteProfileDetailsModal
      :is-open="isModalOpen"
      :institute-details="selectedInstitute"
      @close-modal="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import InstituteProfileDetailsModal from '../modals/InstituteProfileDetailsModal.vue'
import apiServices from '@/services/services'

const institutes = ref([])
const isModalOpen = ref(false)
const selectedInstitute = ref({})
const loading = ref(false)
const error = ref(null) // Add an error ref

onMounted(async () => {
  loading.value = true
  error.value = null // Reset error on each fetch
  try {
    const response = await apiServices.getEpcInstitutes()

    // Corrected access to results: response.data.results
    if (response && response.data && Array.isArray(response.data.results)) {
      institutes.value = response.data.results
      console.log('Institutes fetched successfully:', institutes.value)
    } else {
      // Handle unexpected response structure
      console.error('Unexpected API response:', response)
      error.value = 'Failed to load institutes: Invalid response format.' // Set a user-friendly error message
    }
  } catch (err) {
    console.error('Error fetching institutes:', err)
    error.value = 'Failed to load institutes. Please try again later.' // Set user friendly error
  } finally {
    loading.value = false
  }
})

const openModal = (institute) => {
  selectedInstitute.value = institute
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedInstitute.value = {}
}

const getStatusText = (decision) => {
  switch (decision) {
    case 'Approved':
      return 'Approved'
    case 'Rejected':
      return 'Rejected'
    default:
      return 'Pending'
  }
}

const getStatusClasses = (decision) => {
  const status = getStatusText(decision)
  return [
    'px-3 py-1 rounded-full text-xs font-medium',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Rejected',
    },
  ]
}
</script>
