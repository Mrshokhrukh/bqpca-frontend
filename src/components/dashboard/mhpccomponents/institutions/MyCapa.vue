<template>
  <div class="p-4 min-h-screen">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">
      Corrective Action & Preventive Action (CAPA)
    </h2>

    <div class="mb-6 flex items-center">
      <label for="view-type" class="mr-3 text-gray-700 font-medium">View:</label>
      <select
        id="view-type"
        v-model="viewType"
        class="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="table">Table</option>
        <option value="cards">Cards</option>
      </select>
    </div>

    <!-- Table View -->
    <div v-if="viewType === 'table'" class="overflow-x-auto rounded-lg shadow-md">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg"
            >
              Facility
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
            >
              Teaching Center
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
            >
              Inspection Date
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
            >
              Observation
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="capaItem in filteredCapas"
            :key="capaItem.id"
            class="transition-colors duration-200 hover:bg-gray-100"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ capaItem.teaching_center.institute.name_of_institution }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ capaItem.teaching_center.center_name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ capaItem.inspection_from_date }} - {{ capaItem.inspection_to_date }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ truncateText(capaItem.observation_description, 50) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="getStatusClass(capaItem.status)"
                class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ getStatusText(capaItem.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button
                @click="openModal(capaItem)"
                class="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card View -->
    <div v-if="viewType === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="capaItem in filteredCapas"
        :key="capaItem.id"
        class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
      >
        <h3 class="text-xl font-semibold text-gray-800 mb-3">
          {{ capaItem.teaching_center.institute.name_of_institution }}
        </h3>
        <p class="text-gray-600 mb-2">
          <span class="font-medium">Inspection Date:</span> {{ capaItem.inspection_from_date }} -
          {{ capaItem.inspection_to_date }}
        </p>
        <p class="text-gray-600 mb-3">
          <span class="font-medium">Observation:</span>
          {{ truncateText(capaItem.observation_description, 80) }}
        </p>
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
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          View Details
        </button>
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
import apiservice from '@/services/bmhcservices'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'

const capas = ref([])
const viewType = ref('table')
const selectedCapa = ref(null)
const authStore = useAuthStore()
const toast = useToast()

const fetchCapas = async () => {
  try {
    const response = await apiservice.getMhpcCapas()
    capas.value = response.data.results
    console.log(capas.value)
  } catch (error) {
    console.error('Error fetching CAPA data:', error)
    toast.error('Failed to fetch CAPA data.') // Error toast
  }
}

onMounted(() => {
  // console.log("AuthStore User:", authStore.user); // Optional, for debugging
  fetchCapas()
})

const filteredCapas = computed(() => {
  if (!authStore.user || !authStore.user.cid) {
    return []
  }
  // Now that teaching_center and institute are nested, access CID correctly.
  return capas.value.filter(
    (capaItem) => capaItem.teaching_center?.institute?.CID === authStore.user.cid,
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
    // Use Vue.set (or in Vue 3, direct assignment is fine) for reactivity:
    capas.value[index] = updatedCapa // More concise and reactive in Vue 3
  }
  closeModal()
  toast.success('CAPA remarks submitted successfully!')
}

const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  return text
}

const getStatusClass = (status) => {
  return (
    {
      P: 'bg-yellow-100 text-yellow-800',
      R: 'bg-green-100 text-green-800',
      C: 'bg-blue-100 text-blue-800',
    }[status] || 'bg-gray-100 text-gray-800'
  ) // Use object lookup for conciseness
}

const getStatusText = (status) => {
  return (
    {
      P: 'Pending',
      R: 'Resolved',
      C: 'Cancelled',
    }[status] || 'Unknown'
  ) // Use object lookup
}
</script>
