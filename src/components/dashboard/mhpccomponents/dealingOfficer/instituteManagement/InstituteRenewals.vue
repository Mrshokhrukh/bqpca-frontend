<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Institute Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z"
            ></path>
          </svg>
          Total Institutes: {{ institutes.length }}
        </span>
        <span class="flex items-center ml-6">
          <svg class="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"
            ></path>
          </svg>
          Pending Action: {{ getPendingCount() }}
        </span>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Institute Name
              </th>
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
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Expiry Date
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
            <!-- Loading State -->
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">
                Loading institute applications...
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-else-if="institutes.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">
                No institute applications found.
              </td>
            </tr>
            <!-- Data Rows -->
            <tr
              v-for="institute in institutes"
              :key="institute.id"
              class="hover:bg-gray-50 transition-colors"
              v-else
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ institute.name_of_institution }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ institute.full_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(institute.review_decision, institute.valid_till)">
                  {{ getStatusText(institute.review_decision, institute.valid_till) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(institute.valid_till) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-x-2">
                  <button
                    @click="openModal(institute)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    View Details
                  </button>
                  <button
                    @click="confirmDelete(institute)"
                    class="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <InstituteRenewalApplicationDetailsModal
      :is-open="isModalOpen"
      :application-details="selectedInstitute"
      @close-modal="closeModal"
      @application-updated="handleApplicationUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import InstituteRenewalApplicationDetailsModal from '../modals/InstituteRenewalApplicationDetailsModal.vue'
import apiService from '@/services/services'

const toast = useToast()
const institutes = ref([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const selectedInstitute = ref(null)

onMounted(() => {
  fetchInstitutes()
})

const fetchInstitutes = async () => {
  isLoading.value = true
  try {
    const response = await apiService.getMhpcInstitutes()
    if (response.data && Array.isArray(response.data.results)) {
      institutes.value = response.data.results.sort((a, b) => {
        if (!a.valid_till) return 1
        if (!b.valid_till) return -1
        return new Date(a.valid_till) - new Date(b.valid_till)
      })
    } else {
      console.error('Unexpected API response format:', response)
      institutes.value = []
      toast.error('Unexpected data format received from server')
    }
  } catch (error) {
    console.error('Error fetching institutes:', error)
    toast.error('Failed to load institute applications')
    institutes.value = []
  } finally {
    isLoading.value = false
  }
}

const openModal = (institute) => {
  selectedInstitute.value = {
    id: institute.id,
    instituteName: institute.name_of_institution,
    applicantName: institute.full_name,
    renewalDate: institute.updated_at,
    expiryDate: institute.valid_till,
    review_decision: institute.review_decision,
    remarks: institute.remarks,
    reason_if_rejected: institute.reason_if_rejected,
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedInstitute.value = null
}

const handleApplicationUpdate = () => {
  closeModal()
  fetchInstitutes()
}

const confirmDelete = (institute) => {
  if (
    window.confirm(
      `Are you sure you want to delete the application for "${institute.name_of_institution}"? This action cannot be undone.`,
    )
  ) {
    deleteApplication(institute.id)
  }
}

const deleteApplication = async (instituteId) => {
  try {
    await apiService.deleteMhpcInstitute(instituteId)
    toast.success('Application deleted successfully.')
    institutes.value = institutes.value.filter((inst) => inst.id !== instituteId)
  } catch (error) {
    console.error('Error deleting application:', error)
    toast.error('Failed to delete the application. Please try again.')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const isExpired = (validTill) => {
  if (!validTill) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(validTill) < today
}

const isRenewalDueSoon = (validTill) => {
  if (!validTill) return false
  const today = new Date()
  const renewalThreshold = new Date()
  renewalThreshold.setDate(today.getDate() + 90)
  return new Date(validTill) <= renewalThreshold
}

const getStatusClass = (status, validTill) => {
  if (status === 'Pending') {
    return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
  }
  if (status === 'Approved') {
    if (isExpired(validTill)) {
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
    }
    if (isRenewalDueSoon(validTill)) {
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'
    }
    return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
  }
  return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
}

const getStatusText = (status, validTill) => {
  if (status === 'Pending') return 'Pending Renewal'
  if (status === 'Approved') {
    if (isExpired(validTill)) return 'Expired'
    if (isRenewalDueSoon(validTill)) return 'Renewal Due'
    return 'Active'
  }
  if (status === 'Rejected' || status === 'Regretted') return 'Rejected'
  return status
}

const getPendingCount = () => {
  if (!Array.isArray(institutes.value)) return 0
  return institutes.value.filter((inst) => inst.review_decision === 'Pending').length
}
</script>
