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
      <EmptyState v-else-if="!displayedCapas.length && !isLoading && !error && viewType === 'table'" message="No CAPA records found matching your criteria." />
      <EmptyState v-else-if="!displayedInstitutes.length && !isLoading && !error && viewType === 'cards'" message="No Institutes found matching your criteria." />

      <!-- Table View -->
      <div v-else-if="viewType === 'table'" class="overflow-x-auto rounded-lg shadow-md">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg"
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
                Inspection From Date
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Inspection To Date
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Observation Description
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Root Cause
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                CAPA
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Implementation Timeline
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                Management Comment
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                DO Remarks
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
              >
                User Remarks
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
                class="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="displayedCapas.length > 0">
              <tr
                v-for="capa in displayedCapas"
                :key="capa.id"
                class="transition-colors duration-200 hover:bg-gray-100"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <!-- Relies on institute_id being present in capa object -->
                  {{ getInstituteName(capa.institute_id) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <!-- Relies on teaching_center_id being present in capa object -->
                  {{ getTeachingCenterName(capa.teaching_center_id) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(capa.inspection_from_date) || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(capa.inspection_to_date) || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-normal text-sm text-gray-500 break-words max-w-xs">
                  {{ truncateText(capa.observation_description, 50) || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-normal text-sm text-gray-500 break-words max-w-xs">
                  {{ truncateText(capa.root_cause, 50) || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-normal text-sm text-gray-500 break-words max-w-xs">
                  {{ truncateText(capa.capa, 50) || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ capa.implementation_timeline || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-normal text-sm text-gray-500 break-words max-w-xs">
                  {{ truncateText(capa.management_comment, 50) || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-normal text-sm text-gray-500 break-words max-w-xs">
                  {{ truncateText(capa.DO_remarks, 50) || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-normal text-sm text-gray-500 break-words max-w-xs">
                  {{ truncateText(capa.user_remarks, 50) || 'N/A' }}
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
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="openViewDetailsModal(capa)"
                    title="View Details"
                    class="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out p-1 rounded hover:bg-indigo-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button
                    @click="handleEditClick(capa)"
                    title="Edit CAPA"
                    class="text-yellow-600 hover:text-yellow-900 transition duration-150 ease-in-out p-1 rounded hover:bg-yellow-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button
                    @click="deleteCapa(capa.id)"
                    title="Delete CAPA"
                    class="text-red-600 hover:text-red-900 transition duration-150 ease-in-out p-1 rounded hover:bg-red-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td :colspan="14" class="text-center py-10 text-gray-500">
                No CAPA records match the current filters.
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
        :teaching-centers="teachingCenters"
        @add-capa="openAddCapaModal"
        @view-details="openViewDetailsModal"
        @delete-capa="deleteCapa"
        @open-view-details-modal="openViewDetailsModal"
      />

      <!-- Pagination -->
      <div class="mt-6" v-if="(viewType === 'table' && totalPages > 1) || (viewType === 'cards' && totalInstitutePages > 1)">
        <Pagination
          :current-page="currentPage"
          :total-pages="viewType === 'table' ? totalPages : totalInstitutePages"
          @page-change="handlePageChange"
        />
      </div>
    </div>

    <!-- Modals -->
    <AddCapaModal
      :show="showCapaModal"
      :institute-id="selectedInstituteId"
      :institute-name="selectedInstituteName"
      :capa-data="capaToEdit"
      :institutes-list="institutes"
      :teaching-centers-list="teachingCenters"
      @close="closeCapaModal"
      @save="capaToEdit ? handleUpdateCapa($event) : handleSaveCapa($event)"
    />

    <ViewCapaDetailsModal
      :show="showViewDetailsModal"
      :capa="selectedCapaForDetails"
      :institute-name="getInstituteName(selectedCapaForDetails?.institute_id)"
      :teaching-center-name="getTeachingCenterName(selectedCapaForDetails?.teaching_center_id)"
      @close="closeViewDetailsModal"
      @edit="handleEditClick"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import apiServices from '@/services/services' // Adjust path as needed
import HeaderSection from './capaComponents/HeaderSection.vue' // Adjust path
import LoadingState from './capaComponents/LoadingState.vue' // Adjust path
import ErrorState from './capaComponents/ErrorState.vue' // Adjust path
import CapaCards from './capaComponents/CapaCards.vue' // Adjust path
import EmptyState from './capaComponents/EmptyState.vue' // Adjust path
import Pagination from './capaComponents/Pagination.vue' // Adjust path
import AddCapaModal from './capaComponents/AddCapaModal.vue' // Adjust path
import ViewCapaDetailsModal from './capaComponents/ViewCapaDetailsModal.vue' // Adjust path

// --- State ---
const institutes = ref([])
const teachingCenters = ref([])
const capas = ref([])
const instituteCapas = ref({}) // Maps institute ID -> array of CAPAs
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(9) // Adjust as needed for card view pagination
const itemsPerPageTable = ref(10); // Separate items per page for table view if needed
const showCapaModal = ref(false)
const selectedInstituteId = ref(null)
const selectedInstituteName = ref('')
const showViewDetailsModal = ref(false)
const selectedCapaForDetails = ref(null)
const viewType = ref('cards') // Default view
const capaToEdit = ref(null)

// --- Computed Properties ---
const filteredCapas = computed(() => {
  let filtered = capas.value
  if (statusFilter.value) {
    filtered = filtered.filter((capa) => capa.status === statusFilter.value)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((capa) => {
      // Ensure capa has institute_id and teaching_center_id before searching them
      const instName = capa.institute_id ? getInstituteName(capa.institute_id)?.toLowerCase() : ''
      const tcName = capa.teaching_center_id ? getTeachingCenterName(capa.teaching_center_id)?.toLowerCase() : ''
      return (
        instName.includes(query) ||
        tcName.includes(query) ||
        capa.observation_description?.toLowerCase().includes(query) ||
        capa.root_cause?.toLowerCase().includes(query) ||
        capa.capa?.toLowerCase().includes(query)
      )
    })
  }
  // Add sorting if needed, e.g., by creation date descending
  // filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return filtered
})

// Filter institutes based on search query (for card view)
const filteredInstitutes = computed(() => {
  let filtered = institutes.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    // Filter institutes if their name matches OR if any of their CAPAs match
    filtered = filtered.filter((institute) => {
        const instituteNameMatch = institute.name_of_institution.toLowerCase().includes(query);
        const capasForInstitute = instituteCapas.value[institute.id] || [];
        const capaMatch = capasForInstitute.some(capa =>
            getTeachingCenterName(capa.teaching_center_id)?.toLowerCase().includes(query) ||
            capa.observation_description?.toLowerCase().includes(query) ||
            capa.root_cause?.toLowerCase().includes(query) ||
            capa.capa?.toLowerCase().includes(query)
        );
        return instituteNameMatch || capaMatch;
    });
  }
  return filtered.sort((a, b) => a.name_of_institution.localeCompare(b.name_of_institution))
})

// --- Pagination Logic ---
const totalPages = computed(() => {
  // Total pages for the TABLE view (based on filtered CAPAs)
  return Math.max(1, Math.ceil(filteredCapas.value.length / itemsPerPageTable.value))
})

const displayedCapas = computed(() => {
  // Data slice for the TABLE view
  const start = (currentPage.value - 1) * itemsPerPageTable.value
  const end = start + itemsPerPageTable.value
  return filteredCapas.value.slice(start, end)
})

const totalInstitutePages = computed(() => {
  // Total pages for the CARD view (based on filtered INSTITUTES)
  return Math.max(1, Math.ceil(filteredInstitutes.value.length / itemsPerPage.value))
})

const displayedInstitutes = computed(() => {
  // Data slice for the CARD view
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInstitutes.value.slice(start, end)
})


// --- Helper Functions ---
const getInstituteName = (instituteId) => {
  if (!instituteId) return 'N/A' // Changed from 'N/A (No Institute Linked)' for brevity
  const institute = institutes.value.find((inst) => inst.id === instituteId)
  return institute ? institute.name_of_institution : `Unknown (ID: ${instituteId})`
}

const getTeachingCenterName = (teachingCenterId) => {
  if (!teachingCenterId) return 'N/A' // Changed for brevity
  const center = teachingCenters.value.find((center) => center.id === teachingCenterId)
  // Ensure center_name exists
  return center ? (center.center_name || `Center ID: ${teachingCenterId}`) : `Unknown (ID: ${teachingCenterId})`
}


const truncateText = (text, maxLength) => {
  if (typeof text !== 'string' || !text) return 'N/A' // Handle null/undefined/non-string
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...'
  }
  return text
}

const getStatusClass = (status) => {
  return (
    {
      P: 'bg-yellow-100 text-yellow-800', // Pending
      R: 'bg-green-100 text-green-800',   // Resolved
      C: 'bg-red-100 text-red-800',     // Cancelled
      A: 'bg-blue-100 text-blue-800',   // Approved (If applicable)
      // Add other statuses as needed
    }[status] || 'bg-gray-100 text-gray-800' // Default/Unknown
  )
}

const getStatusText = (status) => {
  return (
    {
      P: 'Pending',
      R: 'Resolved',
      C: 'Cancelled',
      A: 'Approved',
       // Add other statuses as needed
    }[status] || 'Unknown'
  )
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    // Check if the date is valid after parsing
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string received:", dateString);
      return 'Invalid Date';
    }
    // Format as YYYY-MM-DD
    return date.toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format
  } catch (e) {
    console.error("Error formatting date:", dateString, e)
    return 'Invalid Date' // Return specific error message
  }
}


// --- API Functions ---
const fetchInstitutes = async () => {
  try {
    // Ensure your service method matches the actual API endpoint
    const response = await apiServices.getEpcInstitutes()
    institutes.value = response.data.results || []
  } catch (err) {
    console.error('Error fetching institutes:', err)
    // Append to existing error or set new one
    error.value = (error.value ? error.value + ' ' : '') + 'Failed to load institutes.'
  }
}

const fetchTeachingCenters = async () => {
  try {
     // Ensure your service method matches the actual API endpoint
    const response = await apiServices.getEpcTeachingCenters()
    // Make sure the transformation extracts IDs correctly
    teachingCenters.value = (response.data.results || []).map((item) => ({
      id: item.id,
      center_name: item.center_name || 'Unnamed Center', // Provide default
      institute_id: item.institute?.id || item.institute, // Handle both nested object and direct ID
      // Add other relevant fields if needed by modals or display logic
      state_dzongkhag: item.state_dzongkhag || 'N/A',
      city_gewog: item.city_gewog || 'N/A',
      center_location: item.center_location || 'N/A',
    }))
  } catch (err) {
    console.error('Error fetching teaching centers:', err)
    error.value = (error.value ? error.value + ' ' : '') + 'Failed to load teaching centers.'
  }
}


const fetchCapas = async () => {
  isLoading.value = true
  error.value = null // Reset error before fetch
  try {
    // Ensure your service method matches the actual API endpoint
    const response = await apiServices.getEpcCapas()

    // --- CRITICAL PART ---
    // This mapping relies on the backend providing 'institute_id' and 'teaching_center_id'
    // OR providing nested 'institute' and 'teaching_center' objects with an 'id' field.
    // If the backend sends `institute: null`, this needs to be fixed there.
    capas.value = (response.data.results || []).map((capa) => ({
      ...capa,
      // Prioritize direct ID if present, otherwise try nested, fallback to null
      // THIS IS WHERE THE BACKEND RESPONSE STRUCTURE MATTERS MOST
      institute_id: capa.institute_id || capa.institute?.id || null,
      teaching_center_id: capa.teaching_center_id || capa.teaching_center?.id || null,
    }));
    // --- END CRITICAL PART ---

    processCapas() // Group CAPAs by institute ID
  } catch (err) {
    error.value = 'Failed to load CAPAs. Please try again later.'
    console.error('Error fetching CAPAs:', err.response?.data || err.message || err)
    capas.value = [] // Clear data on error
    instituteCapas.value = {} // Clear grouped data
  } finally {
    isLoading.value = false
  }
}

// Group CAPAs by institute for the card view
const processCapas = () => {
  const grouped = {}
  capas.value.forEach((capa) => {
    const instituteId = capa.institute_id // Use the potentially null ID
    if (instituteId) { // Only group if an institute ID exists
      if (!grouped[instituteId]) {
        grouped[instituteId] = []
      }
      grouped[instituteId].push(capa)
    } else {
      // Log CAPAs that couldn't be grouped - indicates backend data issue
      console.warn(`CAPA ID ${capa.id} has no valid institute_id and cannot be grouped.`);
    }
  })
  instituteCapas.value = grouped
}


const retryFetch = () => {
  // Reset state before retrying
  error.value = null;
  institutes.value = [];
  teachingCenters.value = [];
  capas.value = [];
  instituteCapas.value = {};
  currentPage.value = 1;

  // Fetch all data again
  fetchAllData();
}

// Helper to fetch all initial data
const fetchAllData = async () => {
  isLoading.value = true;
  error.value = null; // Reset error
  try {
    // Use Promise.allSettled to fetch even if one fails, and report errors
    const results = await Promise.allSettled([
        fetchInstitutes(),
        fetchTeachingCenters()
    ]);

    // Check results for errors
    results.forEach(result => {
        if (result.status === 'rejected') {
            console.error("Fetch error during initial load:", result.reason);
            // Error state will be set within individual fetch functions
        }
    });

    // Only fetch CAPAs if institutes and TCs loaded (or handle partial data)
    if (!error.value) { // Fetch CAPAs only if no critical errors so far
       await fetchCapas();
    }
  } catch (err) {
     // Catch any unexpected error during Promise.allSettled or subsequent calls
     console.error("Unexpected error during fetchAllData:", err);
     error.value = "An unexpected error occurred while loading data.";
  } finally {
     isLoading.value = false; // Ensure loading is turned off
  }
};


// --- Modal Functions ---
const openAddCapaModal = (instituteIdFromCard = null) => {
  capaToEdit.value = null // Ensure we are adding, not editing
  selectedInstituteId.value = instituteIdFromCard
  selectedInstituteName.value = instituteIdFromCard ? getInstituteName(instituteIdFromCard) : ''
  showCapaModal.value = true
}

const openEditCapaModal = (capa) => {
  // Pre-populate the modal with existing data
  capaToEdit.value = { ...capa }; // Create a copy to avoid modifying original ref directly
  selectedInstituteId.value = capa.institute_id; // Set institute ID for the modal
  selectedInstituteName.value = getInstituteName(capa.institute_id); // Set institute name
  showCapaModal.value = true
}

const closeCapaModal = () => {
  showCapaModal.value = false
  selectedInstituteId.value = null
  selectedInstituteName.value = ''
  capaToEdit.value = null // Clear editing state
}

const openViewDetailsModal = (capa) => {
  selectedCapaForDetails.value = capa
  showViewDetailsModal.value = true
}

const closeViewDetailsModal = () => {
  selectedCapaForDetails.value = null // Clear selected capa
  showViewDetailsModal.value = false
}

// --- CRUD Operations ---
const handleSaveCapa = async (capaDataFromModal) => {
   // Basic validation
  if (!capaDataFromModal.institute_id) { // Check if institute ID is selected in modal
    alert("Please select an Institute.")
    return
  }
  isLoading.value = true
  error.value = null
  try {
    // Prepare payload - ensure it matches API expectations
    // Remove fields that shouldn't be sent on create (like id, created_at etc if present)
    const payload = {
      ...capaDataFromModal,
      // Ensure institute_id and teaching_center_id are correctly set from modal data
      institute: capaDataFromModal.institute_id, // Send ID as 'institute' if API expects that
      teaching_center: capaDataFromModal.teaching_center_id || null, // Send ID or null
    };
    // Clean up potentially unnecessary fields before sending
    delete payload.institute_id;
    delete payload.teaching_center_id;
    // Add any other fields API might generate automatically (like status if default is 'P')
    // payload.status = payload.status || 'P';

    await apiServices.createEpcCapa(payload)
    await fetchCapas() // Refresh data after save
    closeCapaModal()
  } catch (err) {
    console.error('Error saving CAPA:', err.response ? err.response.data : err.message)
    const errorDetail = err.response?.data ? JSON.stringify(err.response.data) : (err.message || 'Unknown error')
    error.value = `Failed to save CAPA: ${errorDetail}. Please check the details and try again.`
    // Keep modal open on error? Optional.
  } finally {
    isLoading.value = false
  }
}

const handleUpdateCapa = async (updatedCapaData) => {
  const idToUpdate = updatedCapaData.id
  if (!idToUpdate) {
    error.value = "Cannot update CAPA: Missing ID."
    console.error("CAPA object missing ID for update:", updatedCapaData);
    return
  }
  if (!updatedCapaData.institute_id) { // Check if institute ID is selected in modal
    alert("Please select an Institute.")
    return
  }
  isLoading.value = true
  error.value = null
  try {
    // Prepare payload, remove fields API generates (id, created_at, updated_at)
    const payload = { ...updatedCapaData };
    payload.institute = payload.institute_id; // Map to what API expects
    payload.teaching_center = payload.teaching_center_id || null; // Map to what API expects

    // Remove fields API likely manages or doesn't expect on update
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    delete payload.institute_id; // Remove frontend helper field
    delete payload.teaching_center_id; // Remove frontend helper field

    await apiServices.updateEpcCapa(idToUpdate, payload)
    await fetchCapas() // Refresh data
    closeCapaModal()
  } catch (err) {
    console.error(`Error updating CAPA ID ${idToUpdate}:`, err.response ? err.response.data : err.message)
    const errorDetail = err.response?.data ? JSON.stringify(err.response.data) : (err.message || 'Unknown error')
    error.value = `Failed to update CAPA: ${errorDetail}. Please check the details and try again.`
     // Keep modal open on error? Optional.
  } finally {
    isLoading.value = false
  }
}


const deleteCapa = async (id) => {
  // Add confirmation dialog
  if (!confirm('Are you sure you want to delete this CAPA record? This action cannot be undone.')) {
    return; // Stop if user cancels
  }

  isLoading.value = true
  error.value = null
  try {
    await apiServices.deleteEpcCapa(id)
    await fetchCapas() // Refresh the list after deletion

    // If the deleted item was being viewed, close the details modal
    if (selectedCapaForDetails.value?.id === id) {
      closeViewDetailsModal()
    }
  } catch (err) {
    console.error('Error deleting CAPA:', err.response?.data || err.message || err)
    const errorDetail = err.response?.data ? JSON.stringify(err.response.data) : (err.message || 'Unknown error')
    error.value = `Failed to delete CAPA: ${errorDetail}`
  } finally {
    isLoading.value = false
  }
}


// --- Event Handlers ---
const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1 // Reset pagination on new search
}

const handleStatusFilter = (status) => {
  statusFilter.value = status
  currentPage.value = 1 // Reset pagination on new filter
}

const handlePageChange = (newPage) => {
  // Check if newPage is valid before updating
  const maxPage = viewType.value === 'table' ? totalPages.value : totalInstitutePages.value;
  if (newPage >= 1 && newPage <= maxPage) {
      currentPage.value = newPage
  }
}


const handleEditClick = (capa) => {
  // If the view details modal is open for the same CAPA, close it first
  if (showViewDetailsModal.value && selectedCapaForDetails.value?.id === capa.id) {
    closeViewDetailsModal()
  }
  // Open the edit modal
  openEditCapaModal(capa)
}


// --- Watchers ---
watch([searchQuery, statusFilter], () => {
  // Reset to first page whenever search or filter changes
  if (currentPage.value !== 1) {
    currentPage.value = 1
  }
})

// Reset pagination when view type changes
watch(viewType, () => {
    currentPage.value = 1;
});


// --- Lifecycle Hooks ---
onMounted(() => {
  fetchAllData(); // Fetch all necessary data when component mounts
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
.break-words {
  word-break: break-word; /* For older browsers */
  overflow-wrap: break-word; /* Standard property */
}
.max-w-xs {
  max-width: 20rem; /* Adjust as needed */
}
/* Additional styles if needed */
</style>