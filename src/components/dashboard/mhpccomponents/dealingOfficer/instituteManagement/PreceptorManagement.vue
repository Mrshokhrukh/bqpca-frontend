<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900 mb-2">Clinical Preceptors</h1>
            <p class="text-sm text-gray-600">Manage and review clinical preceptor information</p>
          </div>
          <div class="text-right">
            <div
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ preceptors.length }} Total Records
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Table Section -->
    <div class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <!-- Loading State -->
      <div v-if="isLoading" class="p-12 text-center">
        <div
          class="inline-flex items-center justify-center w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-500 text-sm">Loading clinical preceptors...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="preceptors.length === 0" class="p-12 text-center">
        <svg
          class="w-12 h-12 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
          />
        </svg>
        <p class="text-gray-500 text-sm">No clinical preceptors found</p>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table Header -->
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Training Center
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Preceptor Details
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Registration & Remarks
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="centerData in combinedPreceptors"
              :key="centerData.centerName"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <!-- Training Center -->
              <td class="px-6 py-4 whitespace-nowrap align-top">
                <div class="flex items-start">
                  <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ centerData.centerName }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ centerData.preceptors.length }} preceptor{{
                        centerData.preceptors.length !== 1 ? 's' : ''
                      }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Preceptor Details -->
              <td class="px-6 py-4 align-top">
                <div class="space-y-3">
                  <div
                    v-for="preceptor in centerData.preceptors"
                    :key="preceptor.id"
                    class="border-l-2 border-gray-200 pl-3"
                  >
                    <div class="text-sm font-medium text-gray-900">
                      {{ preceptor.name }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Registration & Remarks -->
              <td class="px-6 py-4 align-top">
                <div class="space-y-3">
                  <div
                    v-for="preceptor in centerData.preceptors"
                    :key="preceptor.id"
                    class="border-l-2 border-gray-200 pl-3"
                  >
                    <div class="text-sm text-gray-900 mb-1">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        Reg: {{ preceptor.reg_no || 'N/A' }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-500 leading-relaxed">
                      <span class="font-medium">Remarks:</span>
                      {{ preceptor.officer_remarks || 'No remarks available' }}
                    </div>
                  </div>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 align-top">
                <div class="space-y-3">
                  <div
                    v-for="preceptor in centerData.preceptors"
                    :key="preceptor.id"
                    class="border-l-2 border-gray-200 pl-3"
                  >
                    <div class="flex flex-col space-y-2">
                      <button
                        @click="openDetailsModal(preceptor.id)"
                        class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                      >
                        <svg
                          class="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Details
                      </button>

                      <button
                        @click="confirmDelete(preceptor)"
                        class="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                      >
                        <svg
                          class="w-3 h-3 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Component -->
    <ClinicalPreceptorReviewModal
      :is-open="isModalOpen"
      :preceptor-id="selectedPreceptorId"
      @close-modal="closeDetailsModal"
      @preceptor-updated="handlePreceptorUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import ClinicalPreceptorReviewModal from '../modals/ClinicalPreceptorReviewModal.vue'
import apiService from '@/services/services'

const toast = useToast()
const preceptors = ref([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const selectedPreceptorId = ref(null)

// Computed property to combine preceptors into single rows per center
const combinedPreceptors = computed(() => {
  if (!preceptors.value || preceptors.value.length === 0) {
    return []
  }

  // Group preceptors by teaching center
  const groups = preceptors.value.reduce((acc, preceptor) => {
    const centerName = preceptor.teaching_center || 'Unassigned Center'
    if (!acc[centerName]) {
      acc[centerName] = []
    }
    acc[centerName].push(preceptor)
    return acc
  }, {})

  // Transform grouped object into array of objects
  return Object.keys(groups)
    .sort() // Sort center names alphabetically
    .map((centerName) => ({
      centerName: centerName,
      preceptors: groups[centerName].sort((a, b) => a.name.localeCompare(b.name)), // Sort preceptors by name
    }))
})

onMounted(() => {
  fetchPreceptors()
})

const fetchPreceptors = async () => {
  isLoading.value = true
  try {
    const response = await apiService.getMhpcClinicalPreceptors()
    if (response.data && Array.isArray(response.data.results)) {
      preceptors.value = response.data.results.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
    } else if (Array.isArray(response.data)) {
      preceptors.value = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
    } else {
      preceptors.value = []
    }
  } catch (error) {
    console.error('Error fetching clinical preceptors:', error)
    toast.error('Failed to load clinical preceptors.')
    preceptors.value = []
  } finally {
    isLoading.value = false
  }
}

const openDetailsModal = (preceptorId) => {
  selectedPreceptorId.value = preceptorId
  isModalOpen.value = true
}

const closeDetailsModal = () => {
  isModalOpen.value = false
  selectedPreceptorId.value = null
}

const handlePreceptorUpdate = () => {
  closeDetailsModal()
  fetchPreceptors()
  toast.info('Preceptor list has been updated.')
}

const confirmDelete = (preceptor) => {
  if (
    window.confirm(`Are you sure you want to delete the preceptor record for "${preceptor.name}"?`)
  ) {
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