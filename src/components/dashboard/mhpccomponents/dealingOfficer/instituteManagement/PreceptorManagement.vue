<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Clinical Preceptors</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z"></path></svg>
          Total Preceptors: {{ preceptors.length }}
        </span>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Preceptor Name</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registration No.</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Teaching Center</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Officer's Remarks</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading State -->
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">Loading clinical preceptors...</td>
            </tr>
            <!-- Empty State -->
            <tr v-else-if="preceptors.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">No clinical preceptors found.</td>
            </tr>
            <!-- Data Rows -->
            <tr v-for="preceptor in preceptors" :key="preceptor.id" class="hover:bg-gray-50 transition-colors" v-else>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ preceptor.name }}</div>
                <div class="text-xs text-gray-500">CID: {{ preceptor.cid }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ preceptor.reg_no || 'N/A' }}</td>

              <!-- *** FIX: Use the correct field for teaching_center *** -->
              <!-- The API returns a string 'teaching_center', not 'teaching_center_details.center_name' -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ preceptor.teaching_center || 'N/A' }}</td>

              <td class="px-6 py-4 whitespace-normal text-sm text-gray-500">
                <!-- This part is correct and will work once the backend API sends 'officer_remarks' in the list response -->
                <div
                  v-if="preceptor.officer_remarks"
                  class="max-w-xs truncate"
                  :title="preceptor.officer_remarks"
                >
                  {{ preceptor.officer_remarks }}
                </div>
                <span v-else class="text-gray-400 italic">N/A</span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-x-2">
                  <button
                    @click="openDetailsModal(preceptor.id)"
                    :disabled="isLoadingDetails"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 disabled:bg-blue-300"
                  >
                    View Details
                  </button>
                  <button
                    @click="confirmDelete(preceptor)"
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

    <!-- Modal for Viewing Details and Adding Remarks -->
    <!-- This part remains unchanged -->
    <ClinicalPreceptorDetailsModal
      :is-open="isModalOpen"
      :preceptor="selectedPreceptor"
      :is-loading="isLoadingDetails"
      @close-modal="closeDetailsModal"
      @preceptor-updated="handlePreceptorUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import ClinicalPreceptorDetailsModal from '../modals/ClinicalPreceptorReviewModal.vue'
import apiService from '@/services/services'

const toast = useToast()
const preceptors = ref([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const isLoadingDetails = ref(false)
const selectedPreceptor = ref(null)

onMounted(() => {
  fetchPreceptors()
})

const fetchPreceptors = async () => {
  isLoading.value = true
  try {
    const response = await apiService.getMhpcClinicalPreceptors()
    // *** IMPORTANT ***
    // This code assumes your backend has been updated to include 'officer_remarks' in this API response.
    if (response.data && Array.isArray(response.data.results)) {
      preceptors.value = response.data.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else {
      console.error('Unexpected API response format for preceptors:', response.data)
      preceptors.value = []
    }
  } catch (error) {
    console.error('Error fetching clinical preceptors:', error)
    toast.error('Failed to load clinical preceptors.')
  } finally {
    isLoading.value = false
  }
}

const openDetailsModal = async (preceptorId) => {
  if (isLoadingDetails.value) return;

  isLoadingDetails.value = true
  isModalOpen.value = true
  selectedPreceptor.value = null

  try {
    const response = await apiService.getMhpcClinicalPreceptor(preceptorId)
    selectedPreceptor.value = response.data

    // In the modal, you correctly show 'teaching_center_details.center_name'. This implies
    // the DETAIL endpoint returns a different structure. Let's fix that too.
    // If the detail endpoint returns `teaching_center_details` but the list returns `teaching_center`, we harmonize it.
    if (selectedPreceptor.value && !selectedPreceptor.value.teaching_center && selectedPreceptor.value.teaching_center_details) {
      selectedPreceptor.value.teaching_center = selectedPreceptor.value.teaching_center_details.center_name;
    }

  } catch (error)
 {
    console.error(`Failed to fetch details for preceptor ${preceptorId}:`, error)
    toast.error('Could not load preceptor details.')
    isModalOpen.value = false
  } finally {
    isLoadingDetails.value = false
  }
}

const closeDetailsModal = () => {
  isModalOpen.value = false
  selectedPreceptor.value = null
}

const handlePreceptorUpdate = () => {
  closeDetailsModal()
  // Refresh the list to show the newly added remark in the table.
  // This will work correctly once the API list includes the remarks field.
  fetchPreceptors()
}

const confirmDelete = (preceptor) => {
  if (window.confirm(`Are you sure you want to delete the preceptor record for "${preceptor.name}"?`)) {
    deletePreceptor(preceptor.id)
  }
}

const deletePreceptor = async (preceptorId) => {
  try {
    await apiService.deleteMhpcClinicalPreceptor(preceptorId)
    toast.success('Preceptor record deleted successfully.')
    preceptors.value = preceptors.value.filter((p) => p.id !== preceptorId)
  } catch (error) {
    console.error('Error deleting preceptor:', error)
    toast.error('Failed to delete the preceptor record.')
  }
}
</script>