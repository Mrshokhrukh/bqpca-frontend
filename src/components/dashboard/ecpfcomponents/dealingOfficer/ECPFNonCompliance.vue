<!-- Parent Component (e.g., App.vue or NonCompliancePage.vue) -->
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="mx-auto">
      <!-- Header with Title and Add Button -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">ECPF Non-Compliance Records</h2>
        <button
          @click="openAddModal"
          class="mt-4 md:mt-0 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          Add New Record
        </button>
      </div>

      <!-- Filter/Search bar -->
      <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                v-model.trim="searchQuery"
                class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by ECPF Name, Category, or Details..."
              />
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select
              v-model="categoryFilter"
              class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option v-for="category in issueCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Non-Compliance Records Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  ECPF Name
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Details
                </th>
                <th
                  class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="record in filteredRecords"
                :key="record.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.ecpfName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span :class="getCategoryClasses(record.categoryOfIssue)">
                    {{ record.categoryOfIssue }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.nonComplianceDetails }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="viewRecord(record.id)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                      View
                    </button>
                    <button
                      @click="editRecord(record.id)"
                      class="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      @click="deleteRecord(record.id)"
                      class="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                </td>
              </tr>
              <tr v-if="filteredRecords.length === 0">
                <td
                  colspan="4"
                  class="px-6 py-8 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  <div class="flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-10 w-10 text-gray-300 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p>No non-compliance records found.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- View Non-Compliance Record Modal -->
      <div
        v-if="viewingRecord"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto p-6 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center border-b pb-3 mb-4">
            <h2 class="text-xl font-bold text-gray-800">Non-Compliance Record Details</h2>
            <button @click="closeViewRecord" class="text-gray-400 hover:text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <p class="text-sm text-gray-500">ECPF Name</p>
              <p class="font-medium">{{ viewingRecord.ecpfName }}</p>
            </div>

            <div v-if="viewingRecord.branchEcpf">
              <p class="text-sm text-gray-500">Branch ECPF</p>
              <p class="font-medium">{{ viewingRecord.branchEcpf }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Category of Issue</p>
              <p>
                <span :class="getCategoryClasses(viewingRecord.categoryOfIssue)">
                  {{ viewingRecord.categoryOfIssue }}
                </span>
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Non-Compliance Details</p>
              <p class="font-medium">{{ viewingRecord.nonComplianceDetails }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Action</p>
              <p class="font-medium">{{ viewingRecord.action }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Action Taken</p>
              <p class="font-medium">{{ viewingRecord.actionTaken }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Corrective Measures Required</p>
              <p class="font-medium">{{ viewingRecord.correctiveMeasuresRequired }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-500">Corrected Action Report</p>
              <p class="font-medium">{{ viewingRecord.correctedActionReport }}</p>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click="closeViewRecord"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- NonCompliance Modal Component -->
      <NonComplianceModal
        v-if="showModal"
        :is-open="showModal"
        :editing-record="editingRecord"
        @save-record="handleSaveRecord"
        @cancel-modal="closeModal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NonComplianceModal from './modals/NonComplianceModal.vue'
import apiServices from '@/services/services' // Import your API service

// State for Modal Visibility and Data
const showModal = ref(false)
const editingRecordId = ref(null)
const editingRecord = ref(null)
const viewingRecord = ref(null)

// Search and Filter State
const searchQuery = ref('')
const categoryFilter = ref('')
const issueCategories = ref(['Environmental', 'Social', 'Governance', 'HR', 'Operational'])

// Records from API
const nonComplianceRecords = ref([]) // Initialize as empty array

// Filtered Records Computed Property (remains the same)
const filteredRecords = computed(() => {
  const search = searchQuery.value.toLowerCase()
  const category = categoryFilter.value

  return nonComplianceRecords.value.filter((record) => {
    const matchesSearch =
      record.ecpfName.toLowerCase().includes(search) ||
      record.categoryOfIssue.toLowerCase().includes(search) ||
      record.nonComplianceDetails.toLowerCase().includes(search)

    const matchesCategory = !category || record.categoryOfIssue === category

    return matchesSearch && matchesCategory
  })
})

// --- Functions ---
const fetchRecords = async () => {
  try {
    const response = await apiServices.getEcpfNonCompliances()
    console.log('API Response:', response) // Log the entire response object
    console.log('API Response Data:', response.data.results) // Log just the data part

    if (Array.isArray(response.data.results)) {
      nonComplianceRecords.value = response.data.results
    } else {
      console.error('API response data is not an array:', response.data.results)
      nonComplianceRecords.value = [] // To prevent further errors, set it to an empty array
    }
  } catch (error) {
    console.error('Error fetching non-compliance records:', error)
    nonComplianceRecords.value = [] // Set to empty array in case of error as well
  }
}

onMounted(() => {
  fetchRecords() // Fetch records when component is mounted
})

const openAddModal = () => {
  editingRecordId.value = null
  editingRecord.value = null
  showModal.value = true
}

const editRecord = async (id) => {
  editingRecordId.value = id
  try {
    const response = await apiServices.getEcpfNonCompliance(id)
    editingRecord.value = response.data.results
    showModal.value = true
  } catch (error) {
    console.error('Error fetching record for edit:', error)
    // Handle error appropriately
  }
}

const viewRecord = async (id) => {
  try {
    const response = await apiServices.getEcpfNonCompliance(id)
    viewingRecord.value = response.data.results
  } catch (error) {
    console.error('Error fetching record for view:', error)
    // Handle error appropriately
    viewingRecord.value = null // Ensure modal closes on error
  }
}

const closeViewRecord = () => {
  viewingRecord.value = null
}

const deleteRecord = async (id) => {
  if (confirm('Are you sure you want to delete this record?')) {
    try {
      await apiServices.deleteEcpfNonCompliance(id)
      // Refresh records after successful deletion
      fetchRecords()
    } catch (error) {
      console.error('Error deleting record:', error)
      // Handle error appropriately
    }
  }
}

const handleSaveRecord = async (recordData) => {
  try {
    if (editingRecordId.value) {
      // Update existing record
      await apiServices.updateEcpfNonCompliance(editingRecordId.value, recordData)
    } else {
      // Add new record
      await apiServices.createEcpfNonCompliance(recordData)
    }
    closeModal()
    fetchRecords() // Refresh records after saving
    editingRecordId.value = null
    editingRecord.value = null
  } catch (error) {
    console.error('Error saving/updating record:', error)
    // Handle error appropriately (e.g., display error message in modal)
  }
}

const closeModal = () => {
  showModal.value = false
  editingRecordId.value = null
  editingRecord.value = null
}

const getCategoryClasses = (category) => {
  return [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap inline-block',
    {
      'bg-blue-100 text-blue-800': category === 'Environmental',
      'bg-yellow-100 text-yellow-800': category === 'HR',
      'bg-green-100 text-green-800': category === 'Operational',
      'bg-red-100 text-red-800': category === 'Governance',
      'bg-purple-100 text-purple-800': category === 'Social',
    },
  ]
}
</script>
