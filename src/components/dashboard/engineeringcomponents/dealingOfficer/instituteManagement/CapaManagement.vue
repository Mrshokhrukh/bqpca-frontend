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
      <!-- Add Button -->
      <div class="mb-6 flex items-center justify-end">
        <button
          @click="openAddCapaModal()"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Add CAPA
        </button>
      </div>

      <!-- States: Loading, Error, Empty -->
      <LoadingState v-if="isLoading" />
      <ErrorState v-else-if="error" :message="error" @retry="retryFetch" />
      <EmptyState
        v-else-if="!displayedCapas.length"
        message="No CAPA records found matching your criteria."
      />

      <!-- Table View -->
      <div v-else class="overflow-x-auto rounded-lg shadow-md">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Institute
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
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Created At
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
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
                {{ getTeachingCenterName(capa.teaching_center) }}
              </td>
              <td class="px-6 py-4 whitespace-normal text-sm text-gray-500 break-words max-w-xs">
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
                {{ formatDate(capa.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <!-- View Details button always visible -->
                <button
                  @click="openViewDetailsModal(capa)"
                  title="View Details"
                  class="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <!-- Only show Edit and Delete if not Resolved -->
                <template v-if="capa.status_display !== 'Resolved'">
                  <button
                    @click="handleEditClick(capa)"
                    title="Edit CAPA"
                    class="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-100 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    @click="deleteCapa(capa.id)"
                    title="Delete CAPA"
                    class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-6" v-if="totalPages > 1">
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
      :capa="capaToEdit"
      :capa-id="capaToEdit?.id"
      @close="closeCapaModal"
      @save="handleSaveCapa"
      @update="handleUpdateCapa"
    />

    <ViewCapaDetailsModal
      :show="showViewDetailsModal"
      :capa="selectedCapaForDetails"
      :institute-name="getInstituteName(selectedCapaForDetails?.institute)"
      :teaching-center-name="getTeachingCenterName(selectedCapaForDetails?.teaching_center)"
      @close="closeViewDetailsModal"
      @edit="handleEditClick"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import apiServices from '@/services/services'
import HeaderSection from './capaComponents/HeaderSection.vue'
import LoadingState from './capaComponents/LoadingState.vue'
import ErrorState from './capaComponents/ErrorState.vue'
import EmptyState from './capaComponents/EmptyState.vue'
import Pagination from './capaComponents/Pagination.vue'
import AddCapaModal from './capaComponents/AddCapaModal.vue'
import ViewCapaDetailsModal from './capaComponents/ViewCapaDetailsModal.vue'

// --- State ---
const institutes = ref([])
const teachingCenters = ref([])
const capas = ref([])
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showCapaModal = ref(false)
const selectedInstituteId = ref(null)
const selectedInstituteName = ref('')
const showViewDetailsModal = ref(false)
const selectedCapaForDetails = ref(null)
const capaToEdit = ref(null)

// --- Computed Properties ---
const filteredCapas = computed(() => {
  return capas.value
    .filter((capa) => {
      if (statusFilter.value && capa.status !== statusFilter.value) return false
      if (!searchQuery.value) return true
      const query = searchQuery.value.toLowerCase()
      const instName = getInstituteName(capa.institute)?.toLowerCase() || ''
      const tcName = getTeachingCenterName(capa.teaching_center)?.toLowerCase() || ''
      return (
        instName.includes(query) ||
        tcName.includes(query) ||
        capa.observation_description?.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

// --- Pagination Logic ---
const totalPages = computed(() => Math.max(1, Math.ceil(filteredCapas.value.length / itemsPerPage)))
const displayedCapas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredCapas.value.slice(start, start + itemsPerPage)
})

// --- Helper Functions ---
const getInstituteName = (id) =>
  institutes.value.find((inst) => inst.id === id)?.name_of_institution || `Unknown (ID: ${id})`
const getTeachingCenterName = (id) =>
  teachingCenters.value.find((center) => center.id === id)?.center_name || `Unknown (ID: ${id})`
const truncateText = (text, maxLength) =>
  !text || text.length <= maxLength ? text || 'N/A' : text.substring(0, maxLength) + '...'
const getStatusClass = (status) =>
  ({
    P: 'bg-yellow-100 text-yellow-800',
    R: 'bg-green-100 text-green-800',
    C: 'bg-red-100 text-red-800',
  })[status] || 'bg-gray-100 text-gray-800'
const getStatusText = (status) =>
  ({ P: 'Pending', R: 'Resolved', C: 'Cancelled' })[status] || 'Unknown'
const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString('en-CA') : ''

// --- API Functions ---
const fetchAllData = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [instResponse, tcResponse, capasResponse] = await Promise.all([
      apiServices.getEpcInstitutes(),
      apiServices.getEpcTeachingCenters(),
      apiServices.getEpcCapas(),
    ])
    institutes.value = instResponse.data.results || []
    teachingCenters.value = tcResponse.data.results || []

    // ✅ FIX: Normalize the CAPA data here to extract IDs from nested objects
    capas.value = (capasResponse.data.results || []).map((capa) => ({
      ...capa,
      institute: capa.institute?.id || capa.institute,
      teaching_center: capa.teaching_center?.id || capa.teaching_center,
    }))
  } catch (err) {
    console.error('Error fetching initial data:', err)
    error.value = 'Failed to load data. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const retryFetch = () => fetchAllData()

// --- Modal Functions ---
const openAddCapaModal = () => {
  capaToEdit.value = null
  selectedInstituteId.value = null
  selectedInstituteName.value = ''
  showCapaModal.value = true
}

const openEditCapaModal = (capa) => {
  capaToEdit.value = { ...capa }
  selectedInstituteId.value = capa.institute
  selectedInstituteName.value = getInstituteName(capa.institute)
  showCapaModal.value = true
}

const closeCapaModal = () => {
  showCapaModal.value = false
  capaToEdit.value = null
}

const openViewDetailsModal = (capa) => {
  selectedCapaForDetails.value = capa
  showViewDetailsModal.value = true
}

const closeViewDetailsModal = () => {
  showViewDetailsModal.value = false
}

// --- CRUD Operations ---
const handleSaveCapa = async (capaDataFromModal) => {
  const payload = {
    institute_id: capaDataFromModal.institute,
    teaching_center_id: capaDataFromModal.teaching_center,
    inspection_from_date: capaDataFromModal.inspection_from_date,
    inspection_to_date: capaDataFromModal.inspection_to_date,
    observation_description: capaDataFromModal.observation_description,
    root_cause: capaDataFromModal.root_cause,
    capa: capaDataFromModal.capa,
    implementation_timeline: capaDataFromModal.implementation_timeline,
    management_comment: capaDataFromModal.management_comment,
    remarks: capaDataFromModal.remarks,
    status: capaDataFromModal.status,
  }

  isLoading.value = true
  error.value = null
  try {
    await apiServices.createEpcCapa(payload)
    alert('CAPA saved successfully!')
    closeCapaModal()
    await fetchAllData()
  } catch (err) {
    const errorData = err.response?.data
    console.error('API Error saving CAPA:', errorData)
    let errorMessage =
      'Failed to save CAPA. ' +
      (typeof errorData === 'object' ? JSON.stringify(errorData) : err.message)
    alert(errorMessage)
    error.value = errorMessage
  } finally {
    isLoading.value = false
  }
}

const handleUpdateCapa = async (capaDataFromModal) => {
  const capaId = capaDataFromModal.id
  if (!capaId) return alert('Cannot update: CAPA ID is missing.')

  const payload = {
    institute_id: capaDataFromModal.institute,
    teaching_center_id: capaDataFromModal.teaching_center,
    inspection_from_date: capaDataFromModal.inspection_from_date,
    inspection_to_date: capaDataFromModal.inspection_to_date,
    observation_description: capaDataFromModal.observation_description,
    root_cause: capaDataFromModal.root_cause,
    capa: capaDataFromModal.capa,
    implementation_timeline: capaDataFromModal.implementation_timeline,
    management_comment: capaDataFromModal.management_comment,
    remarks: capaDataFromModal.remarks,
    status: capaDataFromModal.status,
  }

  isLoading.value = true
  error.value = null
  try {
    await apiServices.updateEpcCapa(capaId, payload)
    alert('CAPA updated successfully!')
    closeCapaModal()
    await fetchAllData()
  } catch (err) {
    const errorData = err.response?.data
    console.error('API Error updating CAPA:', errorData)
    let errorMessage =
      'Failed to update CAPA. ' +
      (typeof errorData === 'object' ? JSON.stringify(errorData) : err.message)
    alert(errorMessage)
    error.value = errorMessage
  } finally {
    isLoading.value = false
  }
}

const deleteCapa = async (id) => {
  if (!confirm('Are you sure you want to delete this CAPA record?')) return
  isLoading.value = true
  error.value = null
  try {
    await apiServices.deleteEpcCapa(id)
    alert('CAPA deleted successfully!')
    await fetchAllData()
  } catch (err) {
    console.error('Error deleting CAPA:', err)
    error.value = 'Failed to delete CAPA.'
  } finally {
    isLoading.value = false
  }
}

// --- Event Handlers & Watchers ---
const handleSearch = (query) => {
  searchQuery.value = query
}
const handleStatusFilter = (status) => {
  statusFilter.value = status
}
const handlePageChange = (newPage) => {
  currentPage.value = newPage
}
const handleEditClick = (capa) => {
  if (showViewDetailsModal.value) closeViewDetailsModal()
  openEditCapaModal(capa)
}

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchAllData()
})
</script>

<style scoped>
.max-w-xs {
  max-width: 20rem;
}

.break-words {
  overflow-wrap: break-word;
}
</style>
