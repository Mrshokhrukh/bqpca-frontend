<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Institute Profiles</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ institutes.length }}
        </span>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Institution Name
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                CID
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Dzongkhag
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
            <tr v-else v-for="institute in institutes" :key="institute.id" class="hover:bg-gray-50 transition-colors">
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
                  <button @click="openModal(institute)"
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
    <InstituteProfileDetailsModal :is-open="isModalOpen" :institute-details="selectedInstitute"
      @close-modal="closeModal" />
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
const error = ref(null)

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiServices.getEpcInstitutes()

    if (response && response.data && Array.isArray(response.data.results)) {
      institutes.value = response.data.results
      console.log('Institutes fetched successfully:', institutes.value)
    } else {
      console.error('Unexpected API response:', response)
      error.value = 'Failed to load institutes: Invalid response format.'
    }
  } catch (err) {
    console.error('Error fetching institutes:', err)
    error.value = 'Failed to load institutes. Please try again later.'
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
