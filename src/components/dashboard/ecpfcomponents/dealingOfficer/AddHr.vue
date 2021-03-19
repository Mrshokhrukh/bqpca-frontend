<!-- HRBioDataTable.vue -->
<template>
  <div class="p-8 min-h-screen ">
    <div class=" mx-auto">
      <!-- Header with Add Buttons and Filters -->
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">HR Bio Data</h2>
        </div>
        <div class="space-x-2">
          <button @click="openAddHRModal" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
            Add HR
          </button>
        </div>
      </div>

      <!-- Filter/Search bar -->
      <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input type="text" class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by name, CID, or position...">
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Filter by ECPF</option>
              <option value="ecpf1">ECPF 1</option>
              <option value="ecpf2">ECPF 2</option>
            </select>
          </div>
          <div class="w-full md:w-1/4">
            <select class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Filter by Branch</option>
              <option value="branch1">Branch 1</option>
              <option value="branch2">Branch 2</option>
            </select>
          </div>
          <div class="w-full md:w-1/4">
            <select class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Filter by Position</option>
              <option value="Counselor">Counselor</option>
              <option value="HR">HR</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ECPF Name</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Branch ECPF</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Position</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CID</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact No.</th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="hr in hrData" :key="hr.cid" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hr.ecpfName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hr.branchEcpf || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hr.position }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hr.fullName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hr.cid }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ hr.contactNo }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="viewHR(hr)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      @click="editHR(hr)"
                      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteHR(hr)"
                      class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="hrData.length === 0">
                <td colspan="7" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No HR data available.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

<!-- HR Modal -->
      <HRBioDataModal
        :is-open="isHRModalOpen"
        @close="closeHRModal"
        :hr-data-to-edit="selectedHR"
        :modal-mode="modalMode"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HRBioDataModal from './modals/HRBioDataModal.vue';

const hrData = ref([
  { ecpfName: 'Bhutan Counseling Center', branchEcpf: 'Thimphu Branch', position: 'Counselor', fullName: 'Pema Dema', cid: '12345678901', contactNumber: '17123456' },
  { ecpfName: 'Serene Mind ECPF', branchEcpf: null, position: 'HR Manager', fullName: 'Sonam Wangchuk', cid: '98765432102', contactNumber: '17987654' },
  // ... more HR data
]);

const isHRModalOpen = ref(false);
const selectedHR = ref(null); // To store the HR data for view/edit
const modalMode = ref('add'); // To track modal mode: 'add', 'view', 'edit'

const openAddHRModal = () => {
  selectedHR.value = null; // Clear selected HR data for Add mode
  modalMode.value = 'add';
  isHRModalOpen.value = true;
};

const closeHRModal = () => {
  isHRModalOpen.value = false;
  selectedHR.value = null; // Clear selected HR data when modal is closed
};

const viewHR = (hr) => {
  selectedHR.value = hr;
  modalMode.value = 'view';
  isHRModalOpen.value = true;
  console.log('View HR:', hr);
  // Logic to view HR details (open modal or navigate to detail page)
};

const editHR = (hr) => {
  selectedHR.value = hr;
  modalMode.value = 'edit';
  isHRModalOpen.value = true;
  console.log('Edit HR:', hr);
  // Logic to edit HR details (open modal for editing)
};

const deleteHR = (hr) => {
  console.log('Delete HR:', hr);
  // Logic to delete HR record (confirmation dialog, API call)
};
</script>