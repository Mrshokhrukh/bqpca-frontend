<template>
  <div class="p-4 bg-gray-50">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800">Staff Management</h2>

    <div class="mb-4 flex justify-between items-center">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search staff..."
          class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>
      <button @click="openAddStaffModal" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Staff
      </button>
    </div>

    <!-- Staff Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th @click="sortBy('name')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200">
                Name
                <span v-if="sortColumn === 'name'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="sortBy('designation')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200">
                Designation
                <span v-if="sortColumn === 'designation'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th @click="sortBy('department')" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200">
                Department
                <span v-if="sortColumn === 'department'" class="ml-1">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredStaff.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                No staff members found
              </td>
            </tr>
            <tr v-for="staff in filteredStaff" :key="staff.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ staff.name }}</div>
                <div class="text-gray-500 text-sm">{{ staff.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': staff.designation === 'Professor',
                    'bg-blue-100 text-blue-800': staff.designation === 'Lecturer',
                    'bg-purple-100 text-purple-800': staff.designation === 'Assistant Professor',
                    'bg-yellow-100 text-yellow-800': staff.designation === 'Associate Professor',
                    'bg-gray-100 text-gray-800': !['Professor', 'Lecturer', 'Assistant Professor', 'Associate Professor'].includes(staff.designation)
                  }">
                  {{ staff.designation }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ staff.department }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-3">
                  <button @click="openViewStaffModal(staff)" class="text-indigo-600 hover:text-indigo-900 transition-colors duration-150">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button @click="openEditStaffModal(staff)" class="text-blue-600 hover:text-blue-900 transition-colors duration-150">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button @click="confirmDelete(staff)" class="text-red-600 hover:text-red-900 transition-colors duration-150">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-3 flex justify-between items-center border-t border-gray-200 bg-gray-50">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ Math.min(1, filteredStaff.length) }}</span> to
          <span class="font-medium">{{ Math.min(pageSize, filteredStaff.length) }}</span> of
          <span class="font-medium">{{ filteredStaff.length }}</span> results
        </div>
        <div class="flex space-x-2">
          <button
            @click="currentPage > 1 ? currentPage-- : null"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            Previous
          </button>
          <button
            @click="currentPage < totalPages ? currentPage++ : null"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit/View Staff Modal -->
    <StaffDetailModal
      v-if="selectedStaff"
      :staff="selectedStaff"
      :mode="modalMode"
      @close="closeModal"
      @staff-updated="updateStaffList"
      @staff-added="addNewStaff"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
        <p class="text-gray-500 mb-6">Are you sure you want to delete <span class="font-semibold">{{ staffToDelete?.name }}</span>? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button @click="deleteStaff(staffToDelete)" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import StaffDetailModal from './StaffModal.vue';

// Staff data
const staffList = ref([
  { id: 1, name: 'John Doe', designation: 'Professor', department: 'Computer Science', email: 'john.doe@example.com', phone: '123-456-7890', qualifications: 'PhD' },
  { id: 2, name: 'Jane Smith', designation: 'Lecturer', department: 'Mathematics', email: 'jane.smith@example.com', phone: '987-654-3210', qualifications: 'MSc' },
  { id: 3, name: 'Robert Johnson', designation: 'Associate Professor', department: 'Physics', email: 'robert.j@example.com', phone: '456-789-0123', qualifications: 'PhD' },
  { id: 4, name: 'Emily Davis', designation: 'Assistant Professor', department: 'Biology', email: 'emily.d@example.com', phone: '789-012-3456', qualifications: 'PhD' },
  { id: 5, name: 'Michael Brown', designation: 'Professor', department: 'Chemistry', email: 'michael.b@example.com', phone: '321-654-9870', qualifications: 'PhD' },
]);

const selectedStaff = ref(null);
const modalMode = ref(null); // 'add', 'edit', 'view'
const searchQuery = ref('');
const sortColumn = ref('name');
const sortDirection = ref('asc');
const currentPage = ref(1);
const pageSize = ref(10);
const showDeleteModal = ref(false);
const staffToDelete = ref(null);

// Filter and sort staff
const filteredStaff = computed(() => {
  let result = [...staffList.value];

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(staff =>
      staff.name.toLowerCase().includes(query) ||
      staff.designation.toLowerCase().includes(query) ||
      staff.department.toLowerCase().includes(query) ||
      staff.email.toLowerCase().includes(query)
    );
  }

  // Sort by column
  result.sort((a, b) => {
    let comparison = 0;

    if (a[sortColumn.value] < b[sortColumn.value]) {
      comparison = -1;
    } else if (a[sortColumn.value] > b[sortColumn.value]) {
      comparison = 1;
    }

    return sortDirection.value === 'asc' ? comparison : -comparison;
  });

  return result;
});

const totalPages = computed(() => Math.ceil(filteredStaff.value.length / pageSize.value) || 1);

// Modal functions
const openAddStaffModal = () => {
  selectedStaff.value = { id: null, name: '', designation: '', department: '', email: '', phone: '', qualifications: '' };
  modalMode.value = 'add';
};

const openEditStaffModal = (staff) => {
  selectedStaff.value = { ...staff };
  modalMode.value = 'edit';
};

const openViewStaffModal = (staff) => {
  selectedStaff.value = { ...staff };
  modalMode.value = 'view';
};

const closeModal = () => {
  selectedStaff.value = null;
  modalMode.value = null;
};

// Staff operations
const addNewStaff = (newStaff) => {
  newStaff.id = staffList.value.length > 0 ? Math.max(...staffList.value.map(s => s.id)) + 1 : 1;
  staffList.value.push(newStaff);
  closeModal();
};

const updateStaffList = (updatedStaff) => {
  const index = staffList.value.findIndex((staff) => staff.id === updatedStaff.id);
  if (index !== -1) {
    staffList.value[index] = updatedStaff;
  }
  closeModal();
};

const confirmDelete = (staff) => {
  staffToDelete.value = staff;
  showDeleteModal.value = true;
};

const deleteStaff = (staff) => {
  if (!staff) return;

  staffList.value = staffList.value.filter(s => s.id !== staff.id);
  showDeleteModal.value = false;
  staffToDelete.value = null;
};

// Sorting function
const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};
</script>
