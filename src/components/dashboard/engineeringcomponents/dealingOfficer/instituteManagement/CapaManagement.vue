<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header & Search Bar -->
    <div class="top-0 z-10">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <HeaderSection @search="handleSearch" @status-filter="handleStatusFilter" />
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- View Toggle -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center">
          <label for="view-type" class="mr-3 text-gray-700 font-medium">View:</label>
          <select
            id="view-type"
            v-model="viewType"
            class="border border-gray-300 rounded-md px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="cards">Cards</option>
            <option value="table">Table</option>
          </select>
        </div>
        <button
          @click="openAddCapaModal(null)"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Add CAPA
        </button>
      </div>

      <!-- Loading State -->
      <LoadingState v-if="isLoading" />

      <!-- Error State -->
      <ErrorState v-else-if="error" :message="error" @retry="retryFetch" />

      <!-- Empty State -->
      <EmptyState v-else-if="!displayedCapas.length && !isLoading && !error" />

      <!-- Table View -->
      <div v-else-if="viewType === 'table'" class="overflow-x-auto rounded-lg shadow-md">
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
                CAPA Added
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="capa in displayedCapas"
              :key="capa.id"
              class="transition-colors duration-200 hover:bg-gray-100"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ getInstituteName(capa.institute) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ capa.teaching_center?.center_name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ capa.inspection_from_date }} - {{ capa.inspection_to_date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ truncateText(capa.observation_description, 50) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusClass(capa.status)"
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ getStatusText(capa.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(capa.created_at) || 'N/A' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CAPA Cards Grid -->
      <CapaCards
        v-else
        :institutes="displayedInstitutes"
        :institute-capas="instituteCapas"
        @add-capa="openAddCapaModal"
        @view-details="openViewDetailsModal"
        @delete-capa="deleteCapa"
        @open-view-details-modal="openViewDetailsModal"
      />

      <!-- Pagination -->
      <div class="mt-6">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Modals -->
    <AddCapaModal
      :show="showCapaModal"
      :institute-id="selectedInstituteId"
      :institute-name="selectedInstituteName"
      @close="closeCapaModal"
      @save="handleSaveCapa"
    />

    <ViewCapaDetailsModal
      :show="showViewDetailsModal"
      :capa="selectedCapaForDetails"
      :institute-name="getInstituteName(selectedCapaForDetails?.institute)"
      @close="closeViewDetailsModal"
      @edit="handleEditCapa"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import apiServices from '@/services/services'
import HeaderSection from './capaComponents/HeaderSection.vue'
import LoadingState from './capaComponents/LoadingState.vue'
import ErrorState from './capaComponents/ErrorState.vue'
import CapaCards from './capaComponents/CapaCards.vue'
import EmptyState from './capaComponents/EmptyState.vue'
import Pagination from './capaComponents/Pagination.vue'
import AddCapaModal from './capaComponents/AddCapaModal.vue'
import ViewCapaDetailsModal from './capaComponents/ViewCapaDetailsModal.vue'

// State
const institutes = ref([])
const capas = ref([])
const instituteCapas = ref({})
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(9)
const showCapaModal = ref(false)
const selectedInstituteId = ref(null)
const selectedInstituteName = ref('')
const showViewDetailsModal = ref(false)
const selectedCapaForDetails = ref(null)
const viewType = ref('cards')

// Computed Properties
const filteredCapas = computed(() => {
  let filtered = capas.value
  if (statusFilter.value) {
    filtered = filtered.filter((capa) => capa.status === statusFilter.value)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((capa) =>
      getInstituteName(capa.institute).toLowerCase().includes(query) ||
      capa.teaching_center?.center_name?.toLowerCase().includes(query) ||
      capa.observation_description?.toLowerCase().includes(query)
    )
  }
  return filtered
})

const filteredInstitutes = computed(() => {
  let filtered = institutes.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((institute) =>
      institute.name_of_institution.toLowerCase().includes(query)
    )
  }
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredCapas.value.length / itemsPerPage.value))

const displayedCapas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCapas.value.slice(start, end)
})

const displayedInstitutes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInstitutes.value.slice(start, end)
})

// Helper Functions
const getInstituteName = (instituteId) => {
  if (!instituteId) return ''
  const institute = institutes.value.find((inst) => inst.id === instituteId)
  return institute ? institute.name_of_institution : 'Unknown Institute'
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
  )
}

const getStatusText = (status) => {
  return (
    {
      P: 'Pending',
      R: 'Resolved',
      C: 'Cancelled',
    }[status] || 'Unknown'
  )
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// API Functions
const fetchInstitutes = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiServices.getEpcInstitutes()
    institutes.value = response.data.results
  } catch (err) {
    error.value = 'Failed to load institutes. Please try again later.'
    console.error('Error fetching institutes:', err)
  } finally {
    isLoading.value = false
  }
}

const fetchCapas = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiServices.getEpcCapas()
    capas.value = response.data.results
    processCapas()
  } catch (err) {
    error.value = 'Failed to load CAPAs. Please try again later.'
    console.error('Error fetching CAPAs:', err)
  } finally {
    isLoading.value = false
  }
}

const processCapas = () => {
  instituteCapas.value = {}
  const filteredCapas = statusFilter.value
    ? capas.value.filter((capa) => capa.status === statusFilter.value)
    : capas.value

  filteredCapas.forEach((capa) => {
    if (!instituteCapas.value[capa.institute]) {
      instituteCapas.value[capa.institute] = []
    }
    instituteCapas.value[capa.institute].push(capa)
  })
}

const retryFetch = () => {
  fetchInstitutes()
  fetchCapas()
}

// Modal Functions
const openAddCapaModal = (instituteId) => {
  selectedInstituteId.value = instituteId
  selectedInstituteName.value = instituteId ? getInstituteName(instituteId) : ''
  showCapaModal.value = true
}

const closeCapaModal = () => {
  showCapaModal.value = false
  selectedInstituteId.value = null
  selectedInstituteName.value = ''
}

const openViewDetailsModal = (capa) => {
  selectedCapaForDetails.value = capa
  showViewDetailsModal.value = true
}

const closeViewDetailsModal = () => {
  selectedCapaForDetails.value = null
  showViewDetailsModal.value = false
}

// CRUD Operations
const handleSaveCapa = async (capaData) => {
  try {
    await apiServices.createEpcCapa({
      ...capaData,
      institute: selectedInstituteId.value,
    })
    await fetchCapas()
    closeCapaModal()
  } catch (err) {
    console.error('Error saving CAPA:', err.response ? err.response.data : err.message)
    error.value = 'Failed to save CAPA. Please try again.'
  }
}

const handleEditCapa = async (capaData) => {
  try {
    await apiServices.updateEpcCapa(capaData.id, capaData)
    await fetchCapas()
    closeViewDetailsModal()
  } catch (err) {
    console.error('Error updating CAPA:', err)
    error.value = 'Failed to update CAPA. Please try again.'
  }
}

const deleteCapa = async (id) => {
  if (confirm('Are you sure you want to delete this CAPA?')) {
    try {
      await apiServices.deleteEpcCapa(id)
      await fetchCapas()
    } catch (err) {
      console.error('Error deleting CAPA:', err)
      error.value = 'Failed to delete CAPA. Please try again.'
    }
  }
}

// Event Handlers
const handleSearch = (query) => {
  searchQuery.value = query
}

const handleStatusFilter = (status) => {
  statusFilter.value = status
}

const handlePageChange = (newPage) => {
  currentPage.value = newPage
}

// Watchers
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
  processCapas()
})

// Lifecycle Hooks
onMounted(() => {
  fetchInstitutes()
  fetchCapas()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(-20px);
}
</style>