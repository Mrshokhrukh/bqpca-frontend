<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Use DOPageHeader -->
      <DOPageHeader
        title="Search Records"
        description="Find and manage professional records within the system."
        :search-query="searchQuery"
        @update:searchQuery="searchQuery = $event"
        search-placeholder="Search by Name, CID/Work Permit/Passport..."
        :show-filter="false"
      />

      <!-- Removed the old gradient header -->

      <!-- Filter Section - Remaining Filters -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Advanced Filters</h3>
          <button
            @click="resetFilters"
            class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow"
            aria-label="Reset all filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset Filters
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Registration Date Range -->
          <div class="space-y-2">
            <label for="reg-from" class="block text-sm font-medium text-gray-700"
              >Registration From</label
            >
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="reg-from"
                type="date"
                v-model="filters.regFrom"
                class="pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label for="reg-to" class="block text-sm font-medium text-gray-700"
              >Registration To</label
            >
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="reg-to"
                type="date"
                v-model="filters.regTo"
                class="pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <!-- Removed Name and CID search - Handled by DOPageHeader -->

          <!-- Gender -->
          <div class="space-y-2">
            <label for="gender-filter" class="block text-sm font-medium text-gray-700"
              >Gender</label
            >
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <!-- Gender Icon -->
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3.5 8a.5.5 0 01.5-.5h12a.5.5 0 010 1H4a.5.5 0 01-.5-.5zM8 3a.5.5 0 01.5.5v13a.5.5 0 01-1 0V3.5A.5.5 0 018 3zm4 14a.5.5 0 01-.5-.5V3.5a.5.5 0 011 0v13a.5.5 0 01-.5.5z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <select
                id="gender-filter"
                v-model="filters.gender"
                class="pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg appearance-none bg-white"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Category -->
          <div class="space-y-2">
            <label for="category-filter" class="block text-sm font-medium text-gray-700"
              >Category</label
            >
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <!-- Category Icon -->
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M2 4a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM14 4a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1V4zM3 9a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V9zM8 9a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1V9zM14 9a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1V9zM3 14a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1zM8 14a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-1zM14 14a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1z"
                  />
                </svg>
              </div>
              <select
                id="category-filter"
                v-model="filters.category"
                class="pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg appearance-none bg-white"
              >
                <option value="">All Categories</option>
                <!-- Populate dynamically if possible -->
                <option value="health_certification">Health Certification</option>
                <option value="other_category">Other Category</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Sub Category (Kept for consistency, but maybe less used) -->
          <div class="space-y-2">
            <label for="sub-category-filter" class="block text-sm font-medium text-gray-700"
              >Sub Category</label
            >
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <!-- Sub Category Icon -->
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <select
                id="sub-category-filter"
                v-model="filters.subCategory"
                class="pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg appearance-none bg-white"
              >
                <option value="">All Sub Categories</option>
                <!-- Populate dynamically -->
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Health Facility (Now uses service_type) -->
          <div class="space-y-2">
            <label for="health-facility-filter" class="block text-sm font-medium text-gray-700"
              >Service Type</label
            >
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <!-- Facility/Service Icon -->
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                  />
                </svg>
              </div>
              <select
                id="health-facility-filter"
                v-model="filters.serviceType"
                class="pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg appearance-none bg-white"
              >
                <option value="">All Service Types</option>
                <!-- Populate dynamically if possible -->
                <option value="health_certification">Health Certification</option>
                <option value="other_service">Other Service</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <!-- Results Header -->
        <div class="p-4 bg-indigo-50 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">Search Results</h3>
          <div class="text-sm text-gray-500">{{ filteredRecords.length }} record(s) found</div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="py-12 flex justify-center">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
          ></div>
          <p class="ml-4 text-gray-600 self-center">Loading records...</p>
        </div>

        <!-- Table -->
        <div v-else-if="filteredRecords.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 table-fixed">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                >
                  Ref.
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                >
                  Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                >
                  CID/Permit
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                >
                  Gender
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                >
                  Category
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                >
                  Service Type
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                >
                  Status
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(record, index) in filteredRecords"
                :key="record.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ index + 1 }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 truncate">
                  {{ record.username || 'N/A' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {{ record.cid || 'N/A' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {{ record.gender || 'N/A' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {{ (record.category || 'N/A').replace('_', ' ') }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 truncate capitalize">
                  {{ (record.service_type || 'N/A').replace('_', ' ') }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`"
                  >
                    {{ record.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap flex space-x-2">
                  <button
                    @click="viewRecord(record)"
                    class="inline-flex items-center p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200"
                    title="View Record"
                    aria-label="View record details"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
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
                  </button>
                  <button
                    @click="editRecord(record)"
                    class="inline-flex items-center p-1.5 rounded-full bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-800 transition-colors duration-200"
                    title="Edit Record"
                    aria-label="Edit record details"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    @click="deleteRecord(record.id)"
                    class="inline-flex items-center p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 transition-colors duration-200"
                    title="Delete Record"
                    aria-label="Delete this record"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">No matching records found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Try adjusting your search or advanced filters to find what you're looking for.
          </p>
          <div class="mt-6">
            <button
              @click="resetFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Modal for viewing and editing record details -->
      <UserDetailsModal
        :show-modal="showModal"
        :is-editing="isEditing"
        :selected-record="selectedRecord"
        :user-id="selectedRecord?.id"
        @close="closeModal"
        @update="fetchUsers"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiServices from '@/services/services' // Import your API service
import UserDetailsModal from './modals/UserDetailsModal.vue'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue' // Import the header

// --- State ---
const filters = ref({
  regFrom: '',
  regTo: '',
  gender: '',
  category: '',
  subCategory: '',
  serviceType: '', // Renamed from healthFacility to match API field? Check API response.
})
const searchQuery = ref('') // New state for the header search
const records = ref([])
const showModal = ref(false)
const isEditing = ref(false)
const selectedRecord = ref(null)
const loading = ref(false)

// --- API Fetching ---
const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await apiServices.getAllUsers()
    const allUsers = response?.data?.results || response?.data || [] // Get all users

    // *** ADD THIS LINE TO FILTER BY service_type ***
    // Filter the users to include only those with service_type 'health_certification'
    records.value = allUsers.filter((user) => user.service_type === 'health_certification')
    // The commented-out example below was a good starting point,
    // but we only need to filter by service_type for this specific request.
    // records.value = (response?.data?.results || response?.data || []).filter(
    //   (user) => user.role === 'user' && user.service_type === 'health_certification',
    // )
  } catch (error) {
    console.error('Error fetching users:', error)
    records.value = [] // Clear data on error
    // Consider adding a toast notification for the error
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

// --- Computed Properties ---
const filteredRecords = computed(() => {
  if (!Array.isArray(records.value)) return []

  // records.value will now only contain users with service_type: 'health_certification'
  // The existing filters will apply on top of this pre-filtered list.
  return records.value.filter((record) => {
    // Date filtering (remains the same)
    const regDate = record.registration_date ? new Date(record.registration_date) : null // Ensure field exists
    const from = filters.value.regFrom ? new Date(filters.value.regFrom) : null
    const to = filters.value.regTo ? new Date(filters.value.regTo) : null
    const isDateMatch =
      (!from || (regDate && regDate >= from)) && (!to || (regDate && regDate <= to))

    // Search Query filtering (uses new searchQuery ref)
    const query = searchQuery.value.trim().toLowerCase()
    const isSearchMatch =
      !query ||
      (record.username && record.username.toLowerCase().includes(query)) ||
      (record.cid && record.cid.toLowerCase().includes(query)) ||
      (record.permit_no && record.permit_no.toLowerCase().includes(query)) || // Example: Add other relevant fields
      (record.passport_no && record.passport_no.toLowerCase().includes(query))

    // Specific field filters (remain the same)
    const isGenderMatch =
      !filters.value.gender ||
      (record.gender && record.gender.toLowerCase() === filters.value.gender.toLowerCase())
    const isCategoryMatch =
      !filters.value.category ||
      (record.category && record.category.toLowerCase() === filters.value.category.toLowerCase())
    const isSubCategoryMatch =
      !filters.value.subCategory ||
      (record.sub_category &&
        record.sub_category.toLowerCase() === filters.value.subCategory.toLowerCase()) // Check field name
    const isServiceTypeMatch =
      !filters.value.serviceType ||
      (record.service_type &&
        record.service_type.toLowerCase() === filters.value.serviceType.toLowerCase())

    return (
      isDateMatch &&
      isSearchMatch &&
      isGenderMatch &&
      isCategoryMatch &&
      isSubCategoryMatch &&
      isServiceTypeMatch
    )
  })
})

// --- Methods ---

// Filter reset functionality
const resetFilters = () => {
  filters.value = {
    regFrom: '',
    regTo: '',
    gender: '',
    category: '',
    subCategory: '',
    serviceType: '', // Reset specific filters
  }
  searchQuery.value = '' // Reset header search query
}

const viewRecord = (record) => {
  selectedRecord.value = { ...record } // Create a shallow copy
  isEditing.value = false
  showModal.value = true
}

const editRecord = (record) => {
  selectedRecord.value = { ...record } // Create a shallow copy
  isEditing.value = true
  showModal.value = true
}

const deleteRecord = async (id) => {
  if (!id) {
    console.error('Delete failed: Record ID is missing.')
    // Show error toast notification
    return
  }
  if (confirm(`Are you sure you want to delete record ID ${id}? This action cannot be undone.`)) {
    try {
      await apiServices.deleteUser(id) // Ensure this matches your API service method
      // Optionally show success toast
      await fetchUsers() // Refresh the list after successful deletion
    } catch (error) {
      console.error('Error deleting user:', error)
      // Optionally show error toast
    }
  }
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  selectedRecord.value = null
}
</script>
