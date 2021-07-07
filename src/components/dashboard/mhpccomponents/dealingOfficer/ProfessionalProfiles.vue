<!-- src/views/SearchRecords.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <DOPageHeader
        title="Search Records"
        description="Find and manage professional records within the system."
        :search-query="searchQuery"
        @update:searchQuery="searchQuery = $event"
        search-placeholder="Search by Name, CID/Work Permit/Passport..."
        :show-filter="false"
      />

      <!-- Filter Section (can be expanded if needed) -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Advanced Filters</h3>
          <button
            @click="resetFilters"
            class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm"
            aria-label="Reset all filters"
          >
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Reset Filters
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="p-4 bg-indigo-50 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Search Results</h3>
          <div class="text-sm text-gray-500">{{ filteredRecords.length }} record(s) found</div>
        </div>

        <div v-if="loading" class="py-12 flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p class="ml-4 text-gray-600 self-center">Loading records...</p>
        </div>

        <div v-else-if="filteredRecords.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref.</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CID/Permit</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration No.</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Officer Docs</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(record, index) in filteredRecords" :key="record.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 truncate">{{ record.full_name || 'N/A' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">{{ record.cid_no || 'N/A' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">{{ record.registration_no || 'N/A' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <div v-if="record.officer_uploaded_files && record.officer_uploaded_files.length > 0">
                    <span class="inline-flex items-center gap-x-1.5 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      <svg class="h-1.5 w-1.5 fill-blue-500" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
                      {{ record.officer_uploaded_files.length }} File(s)
                    </span>
                  </div>
                  <div v-else>
                    <span class="text-xs text-gray-400">None</span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
                    {{ record.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap flex space-x-2">
                   <button @click="viewRecord(record)" class="inline-flex items-center p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100" title="View Record">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button @click="editRecord(record)" class="inline-flex items-center p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100" title="Edit Record">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button @click="deleteRecord(record.id)" class="inline-flex items-center p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100" title="Delete Record">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="p-12 text-center">
          <h3 class="mt-2 text-lg font-medium text-gray-900">No matching records found</h3>
          <p class="mt-1 text-sm text-gray-500">No approved applications for this service type were found.</p>
        </div>
      </div>

      <UserDetailsModal
        :show-modal="showModal"
        :is-editing="isEditing"
        :selected-record="selectedRecord"
        :user-id="selectedRecord?.id"
        @close="closeModal"
        @update="fetchRecords"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiServices from '@/services/services'
import UserDetailsModal from './modals/UserDetailsModal.vue'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue'

const filters = ref({ regFrom: '', regTo: '', gender: '', serviceType: '' })
const searchQuery = ref('')
const allRecords = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const selectedRecord = ref(null)
const loading = ref(false)

const fetchRecords = async () => {
  loading.value = true
  try {
    const response = await apiServices.getMhpcNewApplications()
    const allApps = response?.data?.results || response?.data || []

    allRecords.value = allApps.filter((app) => {
      const hasQualifications = Array.isArray(app.user_qualifications) && app.user_qualifications.length > 0;
      if (!hasQualifications) {
        return false;
      }
      return app.user_qualifications.some(
        (qual) => qual.endorsement_decision === 'Approved'
      );
    });

    // +++ FIX: REFRESH MODAL DATA AFTER UPDATE +++
    // If a modal is open, find its updated data in the new list and refresh it.
    if (showModal.value && selectedRecord.value && selectedRecord.value.id) {
      const updatedRecord = allRecords.value.find(r => r.id === selectedRecord.value.id);
      if (updatedRecord) {
        // This replaces the old `selectedRecord` with the fresh one,
        // which triggers Vue to update the modal's props.
        selectedRecord.value = { ...updatedRecord };
      }
    }

  } catch (error) {
    console.error('Error fetching application records:', error)
    allRecords.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchRecords)

const filteredRecords = computed(() => {
  if (!Array.isArray(allRecords.value)) return []
  return allRecords.value.filter((record) => {
    const query = searchQuery.value.trim().toLowerCase()
    return !query ||
      (record.full_name && record.full_name.toLowerCase().includes(query)) ||
      (record.cid_no && record.cid_no.toLowerCase().includes(query))
  })
})

const resetFilters = () => {
  filters.value = { regFrom: '', regTo: '', gender: '', serviceType: '' }
  searchQuery.value = ''
}

const viewRecord = (record) => {
  selectedRecord.value = { ...record }
  isEditing.value = false
  showModal.value = true
}

const editRecord = (record) => {
  selectedRecord.value = { ...record }
  isEditing.value = true
  showModal.value = true
}

const deleteRecord = async (id) => {
  if (!id) return;
  if (confirm('Are you sure you want to delete this record?')) {
    try {
      await apiServices.deleteMhpcNewApplication(id)
      await fetchRecords()
    } catch (error) {
      console.error('Error deleting record:', error)
    }
  }
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  selectedRecord.value = null
}
</script>