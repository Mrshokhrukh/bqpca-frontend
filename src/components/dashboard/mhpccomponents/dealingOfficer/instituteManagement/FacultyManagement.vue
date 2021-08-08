<template>
  <div class="mx-auto p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Faculty Management</h2>
      <p class="text-gray-600">Review and manage teaching faculty details.</p>
    </div>

    <!-- Loading / Error / No Data States -->
    <div v-if="loading" class="flex justify-center items-center py-10">
      <div class="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <span class="ml-3 text-gray-600">Loading Faculty...</span>
    </div>
    <div v-else-if="error" class="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-md">
      <p class="text-red-800 font-semibold">An error occurred:</p>
      <p class="text-red-700">{{ error }}</p>
    </div>
    <div v-else-if="faculties.length === 0" class="p-4 bg-gray-100 border-l-4 border-gray-400 rounded-r-md">
      <p class="text-gray-800">No faculty members found.</p>
    </div>

    <!-- Faculty Table -->
    <div v-else class="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table class="min-w-full border-t border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">ID</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Type</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Designation</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Contact</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date of Joining</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="faculty in faculties" :key="faculty.id" class="hover:bg-blue-50 transition-colors duration-150">
            <td class="py-3 px-4 text-gray-800 font-mono text-xs">{{ faculty.faculty_id || faculty.id }}</td>
            <td class="py-3 px-4 text-gray-900 font-medium">{{ faculty.faculty_name || 'N/A' }}</td>
            <td class="py-3 px-4 text-gray-600 capitalize">{{ faculty.faculty_type || 'N/A' }}</td>
            <td class="py-3 px-4 text-gray-600">{{ faculty.designation || 'N/A' }}</td>
            <td class="py-3 px-4 text-gray-600">{{ faculty.contact_no || 'N/A' }}</td>
            <td class="py-3 px-4 text-gray-600">{{ formatDate(faculty.date_of_joining) }}</td>
            <td class="py-3 px-4 whitespace-nowrap">
              <button
                @click="openDetailsModal(faculty)"
                class="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md font-medium text-sm"
                title="View Details and Add Remarks"
              >
                View / Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Details Modal -->
    <FacultyDetailsModal
      v-if="isModalOpen && selectedFaculty"
      :isVisible="isModalOpen"
      :faculty="selectedFaculty"
      @close="closeDetailsModal"
      @update="handleFacultyUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services' // Assuming this path is correct
import FacultyDetailsModal from '../modals/FacultyDetailsModal.vue' // Child component

const toast = useToast()

// Reactive state
const faculties = ref([])
const loading = ref(true)
const error = ref(null)
const isModalOpen = ref(false)
const selectedFaculty = ref(null)

// Fetching Data
const fetchFaculties = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiServices.getMhpcTeachingFaculties()
    faculties.value = response.data.results || response.data || []
  } catch (err) {
    console.error('Error fetching faculty data:', err)
    error.value = err.response?.data?.detail || 'Failed to load faculty data. Please try again.'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// Modal Control
const openDetailsModal = (faculty) => {
  selectedFaculty.value = faculty
  isModalOpen.value = true
}

const closeDetailsModal = () => {
  isModalOpen.value = false
  selectedFaculty.value = null
}

// Handle data update from modal
const handleFacultyUpdate = (updatedFaculty) => {
  const index = faculties.value.findIndex(f => f.id === updatedFaculty.id)
  if (index !== -1) {
    faculties.value[index] = updatedFaculty
  }
  closeDetailsModal()
}

// Helper Functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Lifecycle Hook
onMounted(() => {
  fetchFaculties()
})
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>