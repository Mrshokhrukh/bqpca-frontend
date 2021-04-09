<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <!-- Notification System -->
    <Transition name="notification">
      <div v-if="notification.show" :class="[
        'fixed right-4 top-4 p-4 rounded-md shadow-lg flex items-center z-50 max-w-md',
        notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
          notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
            'bg-blue-50 border-l-4 border-blue-500'
      ]">
        <div :class="[
        'flex-shrink-0 w-6 h-6',
        notification.type === 'success' ? 'text-green-500' :
          notification.type === 'error' ? 'text-red-500' :
            'text-blue-500'
      ]">
          <svg v-if="notification.type === 'success'" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="notification.type === 'error'" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 :class="[
        'text-sm font-medium',
        notification.type === 'success' ? 'text-green-800' :
          notification.type === 'error' ? 'text-red-800' :
            'text-blue-800'
      ]">
            {{ notification.title }}
          </h3>
          <p :class="[
        'text-sm mt-1',
        notification.type === 'success' ? 'text-green-700' :
          notification.type === 'error' ? 'text-red-700' :
            'text-blue-700'
      ]">
            {{ notification.message }}
          </p>
        </div>
        <button @click="closeNotification" class="ml-4 text-gray-500 hover:text-gray-600">
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>

    <!-- Header Card -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Staff Management</h1>
      <div class="mt-4 text-gray-600">Manage institute staff details and records</div>
    </div>

    <!-- Search and Add Button -->
    <div class="mb-6 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:justify-between md:items-center">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        <input v-model="searchQuery" type="text" placeholder="Search staff..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
      </div>
      <button @click="openAddStaffModal"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Staff
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-16 bg-white rounded-lg shadow-sm">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading staff data...</span>
    </div>

    <!-- Empty State -->
    <div v-else-if="!isLoading && filteredStaff.length === 0 && !searchQuery"
      class="bg-white shadow-sm rounded-lg py-16 text-center border border-gray-200">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h3 class="mt-2 text-base font-medium text-gray-900">No staff members</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by adding your first staff member.</p>
      <div class="mt-6">
        <button @click="openAddStaffModal"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Staff
        </button>
      </div>
    </div>

    <!-- No Search Results -->
    <div v-else-if="!isLoading && filteredStaff.length === 0 && searchQuery"
      class="bg-white shadow-sm rounded-lg py-16 text-center border border-gray-200">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-base font-medium text-gray-900">No matching results</h3>
      <p class="mt-1 text-sm text-gray-500">
        No staff members found matching "{{ searchQuery }}".
      </p>
      <div class="mt-6">
        <button @click="searchQuery = ''"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Clear search
        </button>
      </div>
    </div>

    <!-- Staff Table -->
    <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th @click="sortBy('staff_name')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Name
                <span v-if="sortColumn === 'staff_name'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="sortBy('designation')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Designation
                <span v-if="sortColumn === 'designation'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="sortBy('date_of_joining')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Date of Joining
                <span v-if="sortColumn === 'date_of_joining'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓'
                  }}</span>
              </th>
              <th @click="sortBy('department')"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                Department
                <span v-if="sortColumn === 'department'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="staff in filteredStaff" :key="staff.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ staff.staff_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[getDesignationColor(staff.designation), 'px-2 py-1 text-xs font-medium rounded-full']">
                  {{ staff.designation }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(staff.date_of_joining) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ staff.department?.department_name || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex justify-center space-x-3">
                  <button @click="openViewStaffModal(staff)"
                    class="text-indigo-600 hover:text-indigo-900 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                      </path>
                    </svg>
                  </button>
                  <button @click="openEditStaffModal(staff)"
                    class="text-blue-600 hover:text-blue-900 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                      </path>
                    </svg>
                  </button>
                  <button @click="confirmDelete(staff)" class="text-red-600 hover:text-red-900 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                      </path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to <span class="font-medium">{{
        paginationEnd }}</span> of <span class="font-medium">{{ totalStaff }}</span> results
            </p>
          </div>
          <div class="flex">
            <button @click="fetchPreviousPage" :disabled="!hasPreviousPage"
              :class="[!hasPreviousPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50', 'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white']">
              <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
              Previous
            </button>
            <button @click="fetchNextPage" :disabled="!hasNextPage"
              :class="[!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50', 'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white']">
              Next
              <svg class="h-5 w-5 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Staff Modal -->
    <Transition name="modal-fade">
      <div v-if="isModalVisible" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 m-4 transform transition-all overflow-y-auto max-h-[90vh]"
          role="dialog" aria-labelledby="modal-title" @click.stop>

          <!-- Header with close button -->
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 id="modal-title" class="text-xl font-semibold text-gray-900">
                {{ modalMode === 'add' ? 'Add New Staff' : modalMode === 'edit' ? 'Edit Staff' : 'Staff Details' }}
              </h2>
              <p class="text-sm text-gray-500">
                {{ modalMode === 'add' ? 'Create a new staff record' : modalMode === 'edit' ? 'Update staff information'
        : 'View staff information' }}
              </p>
            </div>

            <!-- Close button -->
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form Content -->
          <form @submit.prevent="saveStaff">
            <div class="space-y-6">
              <!-- Staff Name -->
              <div>
                <label for="staff_name" class="block text-sm font-medium text-gray-700">Staff Name</label>
                <input type="text" id="staff_name" v-model="form.staff_name" :disabled="modalMode === 'view'"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <!-- Designation -->
              <div>
                <label for="designation" class="block text-sm font-medium text-gray-700">Designation</label>
                <input type="text" id="designation" v-model="form.designation" :disabled="modalMode === 'view'"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <!-- Date of Joining -->
              <div>
                <label for="date_of_joining" class="block text-sm font-medium text-gray-700">Date of Joining</label>
                <input type="date" id="date_of_joining" v-model="form.date_of_joining" :disabled="modalMode === 'view'"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>

              <!-- Department -->
              <div>
                <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
                <select id="department" v-model="form.department_id" :disabled="modalMode === 'view'"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option disabled value="">Select a department</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
                </select>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 flex justify-end space-x-3">
              <button type="button" @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {{ modalMode === 'view' ? 'Close' : 'Cancel' }}
              </button>

              <button v-if="modalMode !== 'view'" type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {{ modalMode === 'add' ? 'Add Staff' : 'Update Staff' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal-fade">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showDeleteModal = false"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-lg shadow-lg p-6 m-4 max-w-md w-full" @click.stop>
          <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
          <p class="text-gray-500 mb-6">
            Are you sure you want to delete <span class="font-semibold">{{ staffToDelete?.staff_name }}</span>?
            This action cannot be undone.
          </p>
          <div class="flex justify-end space-x-3">
            <button @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </button>
            <button @click="deleteStaff"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiServices from '@/services/services';

// State
const staffList = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const sortColumn = ref('staff_name');
const sortDirection = ref('asc');
const currentPage = ref(1);
const nextPageUrl = ref(null);
const previousPageUrl = ref(null);
const totalStaff = ref(0);
const pageSize = ref(10); // Assuming default page size, adjust if API differs

// Modal state
const isModalVisible = ref(false);
const modalMode = ref(null); // 'add', 'edit', 'view'

// --- FIX 1: Update form ref ---
const form = ref({
  id: null, // Add id for edit mode
  staff_name: '',
  designation: '',
  date_of_joining: '',
  department_id: '' // Use department_id instead of department
});

// Delete modal state
const showDeleteModal = ref(false);
const staffToDelete = ref(null);

// Departments fetching
const departments = ref([]);

const fetchDepartments = async () => {
  try {
    const response = await apiServices.getEpcInstituteDepartments();
    if (response && response.data) {
        // Adapt based on your actual API response structure for departments
        if (response.data.results && Array.isArray(response.data.results)) {
            departments.value = response.data.results.map(dept => ({
                id: dept.id,
                name: dept.department_name // Adjust if property name is different
            }));
        } else if (Array.isArray(response.data)) { // Handle if API returns a flat array
             departments.value = response.data.map(dept => ({
                id: dept.id,
                name: dept.department_name // Adjust if property name is different
            }));
        }
         else {
            console.warn('Unexpected departments API response structure:', response);
            showNotification('warning', 'Data Format', 'Received departments in unexpected format');
            departments.value = [];
         }
    } else {
      console.warn('No data in departments API response');
      departments.value = [];
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
    showNotification('error', 'Error Loading Departments', 'Failed to load department data');
    departments.value = [];
  }
};

// Call fetchDepartments when the component mounts
onMounted(() => {
  fetchStaff();
  fetchDepartments();
});

// Notification state
const notification = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  timeout: null
});

// Computed properties
const filteredStaff = computed(() => {
  // Keep existing search logic (assuming staff data from API has 'department' as ID)
  if (!searchQuery.value) return staffList.value;

  const query = searchQuery.value.toLowerCase();
  return staffList.value.filter(staff => {
    // IMPORTANT: Assuming getDepartmentName correctly looks up by ID (staff.department)
    const deptName = getDepartmentName(staff.department).toLowerCase();
    return (
      staff.staff_name.toLowerCase().includes(query) ||
      staff.designation.toLowerCase().includes(query) ||
      deptName.includes(query)
    );
  });
});


const hasNextPage = computed(() => !!nextPageUrl.value);
const hasPreviousPage = computed(() => !!previousPageUrl.value);

const paginationStart = computed(() => {
    if (totalStaff.value === 0) return 0;
    // Adjust pagination start calculation based on API response if it's not page-based
    // This example assumes page-based pagination where page size is known/estimated
    const calculatedStart = (currentPage.value - 1) * pageSize.value;
     // Ensure pageSize is updated if the API response indicates a different limit
    if(staffList.value.length > 0 && pageSize.value !== staffList.value.length) {
       // Potentially update pageSize based on results length if API limit changes?
       // Or rely on API providing total count and current page info if available
    }
    return calculatedStart;
});


const paginationEnd = computed(() => {
    if (totalStaff.value === 0) return 0;
    // Use totalStaff.value which should come from the API's 'count'
     return Math.min(paginationStart.value + pageSize.value, totalStaff.value);
    // Alternative if page size varies or isn't fixed:
    // return paginationStart.value + staffList.value.length;
});


// Methods
const fetchStaff = async (page = 1) => { // Accept page parameter
  isLoading.value = true;
  try {
    // Pass the page number to the API call
    const response = await apiServices.getEpcInstituteStaff(page);

    if (response && response.data) {
      staffList.value = response.data.results || [];
      totalStaff.value = response.data.count || 0;
      nextPageUrl.value = response.data.next;
      previousPageUrl.value = response.data.previous;

      // Update current page based on response (if not explicitly passed or inferred)
      // This part depends heavily on how your API structures pagination URLs or response data
      if (page) {
          currentPage.value = page;
      } else {
          // Try to infer from previousPageUrl if page wasn't passed
          if (previousPageUrl.value) {
              try {
                  const url = new URL(previousPageUrl.value);
                  const prevPage = url.searchParams.get('page');
                  if (prevPage) {
                      currentPage.value = parseInt(prevPage) + 1;
                  } else {
                       currentPage.value = 2; // Guess if no page param but prev exists
                  }
              } catch (e) { /* ignore URL parsing error */ }
          } else {
              currentPage.value = 1; // Assume page 1 if no previous link
          }
      }

      // Infer page size if needed (e.g., if it's not fixed)
      if (staffList.value.length > 0) {
          pageSize.value = staffList.value.length; // Update based on results returned
      }


    } else {
      showNotification('error', 'Error Loading Data', 'Failed to load staff data');
      staffList.value = [];
      totalStaff.value = 0; // Reset count on error
    }
  } catch (error) {
    console.error('Error fetching staff:', error);
    showNotification('error', 'Error Loading Data', 'Failed to connect to the server');
    staffList.value = [];
    totalStaff.value = 0; // Reset count on error
  } finally {
    isLoading.value = false;
  }
};


const fetchNextPage = async () => {
  if (!nextPageUrl.value) return;

  // Extract page number from the next URL
  let nextPage = null;
  try {
    const url = new URL(nextPageUrl.value);
    const pageParam = url.searchParams.get('page');
    if (pageParam) {
      nextPage = parseInt(pageParam);
    } else {
        // Fallback if page param missing - might need adjustment
        nextPage = currentPage.value + 1;
    }
  } catch (e) {
    console.error("Could not parse next page URL", e);
    showNotification('error', 'Pagination Error', 'Invalid next page link');
    return; // Don't proceed if URL is invalid
  }

  if (nextPage) {
    fetchStaff(nextPage); // Pass the extracted page number
  } else {
     console.warn("Could not determine next page number from URL:", nextPageUrl.value);
     // Maybe try fetching page currentPage + 1 as a guess? Or disable button?
     showNotification('warning', 'Pagination Info', 'Could not determine next page number.');
  }
};

const fetchPreviousPage = async () => {
  if (!previousPageUrl.value) return;

  // Extract page number from the previous URL
  let prevPage = null;
   try {
    const url = new URL(previousPageUrl.value);
    const pageParam = url.searchParams.get('page');
    if (pageParam) {
      prevPage = parseInt(pageParam);
    } else {
        // If 'page' param is missing but it's the first page, API might return null or omit it.
        // If previous URL exists but no 'page', it's often page 1.
         if (previousPageUrl.value && !pageParam) {
             prevPage = 1;
         } else {
            // Fallback if page param missing - might need adjustment
            prevPage = currentPage.value - 1;
         }
    }
  } catch (e) {
    console.error("Could not parse previous page URL", e);
    showNotification('error', 'Pagination Error', 'Invalid previous page link');
    return; // Don't proceed if URL is invalid
  }

   if (prevPage && prevPage > 0) {
    fetchStaff(prevPage); // Pass the extracted page number
  } else if (prevPage === 1) { // Handle explicit page 1 case
     fetchStaff(1);
  }
   else {
     console.warn("Could not determine previous page number from URL:", previousPageUrl.value);
      showNotification('warning', 'Pagination Info', 'Could not determine previous page number.');
  }
};


const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }

  staffList.value.sort((a, b) => {
    let valueA = a[column];
    let valueB = b[column];

    // Handle sorting for department name (using the ID from staff data)
    if (column === 'department') {
      valueA = getDepartmentName(valueA); // Lookup name based on ID
      valueB = getDepartmentName(valueB); // Lookup name based on ID
    }

    // Basic comparison (can be enhanced for dates, numbers)
    if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
};

const getDepartmentName = (departmentId) => {
  const department = departments.value.find(d => d.id === departmentId);
  return department ? department.department_name : 'Unknown'; // More concise fallback
};

const getDesignationColor = (designation) => {
    if (!designation) return 'bg-gray-100 text-gray-800'; // Handle null/undefined
    const designationLower = designation.toLowerCase();
    if (designationLower.includes('admin')) return 'bg-red-100 text-red-800';
    if (designationLower.includes('professor')) return 'bg-green-100 text-green-800';
    if (designationLower.includes('lecturer')) return 'bg-blue-100 text-blue-800';
    if (designationLower.includes('assistant')) return 'bg-purple-100 text-purple-800';
    if (designationLower.includes('associate')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800'; // Default fallback
};


const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    // Attempt to create a date object. Handles YYYY-MM-DD directly.
    const date = new Date(dateString);
    // Check if the date is valid after parsing
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    // Use toLocaleDateString for locale-aware formatting
    return date.toLocaleDateString(undefined, { // 'undefined' uses browser default locale
      year: 'numeric',
      month: 'short', // e.g., Apr
      day: 'numeric'
    });
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return 'Invalid Date'; // Return error indication if parsing fails
  }
};


// Modal Functions
// --- FIX 3a: Update form reset in Add Modal ---
const openAddStaffModal = () => {
  form.value = {
    id: null,
    staff_name: '',
    designation: '',
    date_of_joining: new Date().toISOString().split('T')[0], // Default to today
    department_id: '' // Reset department_id
  };
  modalMode.value = 'add';
  isModalVisible.value = true;
};

// --- FIX 3b: Update form population in Edit Modal ---
const openEditStaffModal = (staff) => {
  form.value = {
      id: staff.id,
      staff_name: staff.staff_name,
      designation: staff.designation,
      date_of_joining: staff.date_of_joining, // Assumes API returns 'YYYY-MM-DD'
      department_id: staff.department // Map staff.department (ID) to form.department_id
  };
  modalMode.value = 'edit';
  isModalVisible.value = true;
};

// --- FIX 3c: Update form population in View Modal ---
const openViewStaffModal = (staff) => {
  form.value = {
      id: staff.id,
      staff_name: staff.staff_name,
      designation: staff.designation,
      date_of_joining: staff.date_of_joining,
      department_id: staff.department // Map staff.department (ID) to form.department_id
  };
  modalMode.value = 'view';
  isModalVisible.value = true;
};

// --- FIX 3d: Update form reset in Close Modal ---
const closeModal = () => {
  isModalVisible.value = false;
  setTimeout(() => {
    form.value = {
      id: null,
      staff_name: '',
      designation: '',
      date_of_joining: '',
      department_id: '' // Reset department_id
    };
    modalMode.value = null;
  }, 300); // Wait for fade out
};


const saveStaff = async () => {
  // --- FIX 4: Update form validation ---
  if (!form.value.staff_name || !form.value.designation || !form.value.date_of_joining || !form.value.department_id) {
    showNotification('error', 'Validation Error', 'Please fill out all required fields, including Department.');
    return;
  }

  // Prepare payload - it already uses form.value which now has department_id
  const payload = { ...form.value };
    // Remove 'id' from payload if it's an add operation, backend might not expect it
    if (modalMode.value === 'add') {
        delete payload.id;
    }


  isLoading.value = true; // Consider a separate loading state for modal actions
  try {
    if (modalMode.value === 'add') {
       // Send the payload (which has department_id)
      await apiServices.createEpcInstituteStaff(payload);
      showNotification('success', 'Staff Added', `${payload.staff_name} has been added successfully.`);
    } else if (modalMode.value === 'edit') {
       // Send the payload (which has department_id) for update
      await apiServices.updateEpcInstituteStaffMember(form.value.id, payload);
      showNotification('success', 'Staff Updated', `${payload.staff_name}'s information has been updated.`);
    }

    fetchStaff(currentPage.value); // Refetch the *current* page after save
    closeModal();
  } catch (error) {
    console.error('Error saving staff:', error);
     // Attempt to parse backend error messages
     let errorMessage = 'There was an error processing your request.';
     if (error.response && error.response.data) {
         // Example: Combine field errors into a single message
         const errors = error.response.data;
         const messages = Object.entries(errors).map(([field, msgs]) =>
            `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
         );
         if (messages.length > 0) {
             errorMessage = messages.join('; ');
         }
     }
     showNotification('error', 'Save Failed', errorMessage);
  } finally {
    isLoading.value = false;
  }
};

const confirmDelete = (staff) => {
  staffToDelete.value = staff;
  showDeleteModal.value = true;
};


const deleteStaff = async () => {
  if (!staffToDelete.value) return;

  isLoading.value = true; // Consider separate loading state
  try {
    await apiServices.deleteEpcInstituteStaffMember(staffToDelete.value.id);
    showNotification('success', 'Staff Deleted', `${staffToDelete.value.staff_name} has been deleted.`);

    // Refresh staff list - fetch page 1 if the deleted item was the last on the current page
    const remainingOnPage = staffList.value.length - 1;
    if (remainingOnPage === 0 && currentPage.value > 1) {
        fetchStaff(currentPage.value - 1);
    } else {
        fetchStaff(currentPage.value);
    }

    showDeleteModal.value = false;
    staffToDelete.value = null;
  } catch (error) {
    console.error('Error deleting staff:', error);
    showNotification('error', 'Delete Failed', 'There was an error deleting the staff member.');
  } finally {
    isLoading.value = false;
  }
};

// Notification functions
const showNotification = (type, title, message, duration = 5000) => {
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout);
  }
  notification.value = { show: true, type, title, message, timeout: null };
  if (duration > 0) {
    notification.value.timeout = setTimeout(closeNotification, duration);
  }
};

const closeNotification = () => {
  notification.value.show = false;
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout);
    notification.value.timeout = null;
  }
};

// Watch search query to refetch or filter locally
watch(searchQuery, (newValue) => {
    // Decide whether to fetch from backend on search or filter locally
    // Fetching from backend is better for large datasets
    // fetchStaff(1); // Reset to page 1 when search changes - uncomment if using backend search

    // For local filtering, the computed property `filteredStaff` handles it.
    // No explicit action needed here if filtering locally, unless you want pagination reset.
     if (newValue.trim() !== '') {
         // Optional: Reset to page 1 when starting a search if pagination is local
         // currentPage.value = 1;
     } else {
         // Optional: Refetch page 1 when search is cleared if pagination was reset
         // fetchStaff(1);
     }
});


// Initial fetch
onMounted(() => {
  fetchStaff(1); // Fetch page 1 initially
  fetchDepartments();
});
</script>

<style scoped>
/* Notification Animation */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

/* Modal Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
