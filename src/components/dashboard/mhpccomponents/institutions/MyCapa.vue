<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
    <InstituteHeader
      title="Corrective Action & Preventive Action (CAPA)"
      subtitle="View and manage your CAPA items"
      :show-actions="false"
    />

    <div v-if="isLoading" class="flex justify-center items-center min-h-[300px]">
      <Loader class="animate-spin text-indigo-600 w-10 h-10" />
    </div>

    <div
      v-else-if="apiError"
      class="mt-8 text-center py-16 bg-red-50 rounded-2xl border border-red-200 shadow-sm"
    >
      <p class="text-red-700 text-lg font-medium">{{ errorMessage }}</p>
      <p class="text-red-600 text-sm mt-2">
        Please try refreshing the page or contact support if the issue persists.
      </p>
    </div>

    <div v-else>
      <div class="mt-8 mb-6 flex items-center justify-end">
        <label for="view-type" class="mr-3 text-sm font-medium text-gray-700">View:</label>
        <select
          id="view-type"
          v-model="viewType"
          class="block w-auto pl-3 pr-9 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white"
        >
          <option value="table">Table</option>
          <option value="cards">Cards</option>
        </select>
      </div>

      <div v-if="filteredCapas.length > 0">
        <div
          v-if="viewType === 'table'"
          class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Facility
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Teaching Center
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Inspection Date
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Observation
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="capaItem in filteredCapas"
                  :key="capaItem.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ capaItem.teaching_center.institute.name_of_institution }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ capaItem.teaching_center.center_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ capaItem.inspection_from_date }} - {{ capaItem.inspection_to_date }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {{ capaItem.observation_description }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="getStatusClass(capaItem.status)"
                      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ getStatusText(capaItem.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="openModal(capaItem)"
                      class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-150"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-if="viewType === 'cards'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="capaItem in filteredCapas"
            :key="capaItem.id"
            class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            <div class="p-6 flex-grow">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ capaItem.teaching_center.institute.name_of_institution }}
              </h3>
              <p class="text-sm text-gray-500 mb-1">
                <span class="font-medium text-gray-700">Center:</span>
                {{ capaItem.teaching_center.center_name }}
              </p>
              <p class="text-sm text-gray-500 mb-3">
                <span class="font-medium text-gray-700">Inspection:</span>
                {{ capaItem.inspection_from_date }} to {{ capaItem.inspection_to_date }}
              </p>
              <div class="mb-3">
                <p class="text-sm font-medium text-gray-700 mb-1">Observation:</p>
                <p class="text-sm text-gray-600 leading-relaxed max-h-20 overflow-y-auto">
                  {{ capaItem.observation_description }}
                </p>
              </div>
            </div>
            <div class="p-6 border-t border-gray-100 bg-gray-50">
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-medium text-gray-700">Status:</span>
                <span
                  :class="getStatusClass(capaItem.status)"
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ getStatusText(capaItem.status) }}
                </span>
              </div>
              <button
                @click="openModal(capaItem)"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-150"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="mt-8 text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vector-effect="non-scaling-stroke"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">No CAPA items found</h3>
        <p class="mt-1 text-sm text-gray-500">
          There are currently no CAPA items assigned to your facility.
        </p>
      </div>
    </div>

    <CapaDetailModal
      v-if="selectedCapa"
      :capa="selectedCapa"
      @close="closeModal"
      @capa-updated="updateCapa"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import CapaDetailModal from './CapaModal.vue'
import apiServices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import { Loader } from 'lucide-vue-next'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'

const capas = ref([])
const viewType = ref('table')
const selectedCapa = ref(null)
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')

const authStore = useAuthStore()
const toast = useToast()

const fetchCapas = async () => {
  isLoading.value = true
  apiError.value = false
  errorMessage.value = ''

  if (!authStore.user || !authStore.user.cid) {
    errorMessage.value = 'User information not available. Please log in again.'
    apiError.value = true
    isLoading.value = false
    toast.error(errorMessage.value)
    return
  }

  try {
    const response = await apiServices.getMhpcCapas()
    if (response && response.data && Array.isArray(response.data.results)) {
      capas.value = response.data.results
    } else {
      capas.value = []
      errorMessage.value = 'Received unexpected data format from the server.'
      apiError.value = true
      toast.warning(errorMessage.value)
    }
  } catch (error) {
    capas.value = []
    apiError.value = true
    const backendError = error.response?.data?.message || error.message
    errorMessage.value = `Failed to fetch CAPA data: ${backendError}`
    toast.error('Failed to fetch CAPA data. Please try again.')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCapas)

const filteredCapas = computed(() => {
  if (!authStore.user?.cid || !Array.isArray(capas.value)) {
    return []
  }
  const userCidLower = authStore.user.cid.toLowerCase()
  return capas.value.filter(
    (capaItem) => capaItem.teaching_center?.institute?.CID?.toLowerCase() === userCidLower,
  )
})

const openModal = (capaItem) => {
  selectedCapa.value = capaItem
}

const closeModal = () => {
  selectedCapa.value = null
}

const updateCapa = (updatedCapa) => {
  const index = capas.value.findIndex((capaItem) => capaItem.id === updatedCapa.id)
  if (index !== -1) {
    capas.value[index] = { ...capas.value[index], ...updatedCapa }
  }
  closeModal()
  toast.success('CAPA remarks submitted successfully!')
  fetchCapas()
}

const getStatusClass = (status) => {
  const statusClasses = {
    P: 'bg-yellow-100 text-yellow-800',
    R: 'bg-green-100 text-green-800',
    C: 'bg-blue-100 text-blue-800',
    A: 'bg-teal-100 text-teal-800', // Assuming 'A' might mean Acknowledged or Actioned
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const statusMap = {
    P: 'Pending',
    R: 'Resolved',
    C: 'Closed', // Changed from Cancelled to Closed as it's common in CAPA
    A: 'Actioned',
  }
  return statusMap[status] || 'Unknown'
}
</script>
