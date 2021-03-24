<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Teaching Institutes</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ teachingCenters.length }}
        </span>
      </div>
    </div>

    <!-- Alert for Success/Error Messages -->
    <div v-if="alert.show"
      :class="`mb-4 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg v-if="alert.type === 'success'" class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd" />
          </svg>
          <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">{{ alert.message }}</p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button @click="alert.show = false" class="inline-flex rounded-md p-1.5"
              :class="alert.type === 'success' ? 'text-green-500 hover:bg-green-100' : 'text-red-500 hover:bg-red-100'">
              <span class="sr-only">Dismiss</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="teachingCenters.length === 0"
      class="bg-white p-8 text-center text-gray-500 rounded-xl shadow-sm border border-gray-100">
      <p>No teaching Institutes found</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                City
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Specialty
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="center in teachingCenters" :key="center.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ center.center_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ center.center_location }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ center.target_category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 rounded-full text-xs font-medium" :class="{
                  'bg-yellow-100 text-yellow-800': center.tc_review_decision === 'Pending',
                  'bg-green-100 text-green-800': center.tc_review_decision === 'Approved',
                  'bg-red-100 text-red-800': center.tc_review_decision === 'Regretted'
                }">
                  {{ center.tc_review_decision }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="openModal(center)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <TeachingHospitalsDetailsModal :is-open="isModalOpen" :hospital-details="selectedHospital" @close-modal="closeModal"
      @approve="handleApprove" @regret="handleRegret" />

    <!-- Confirmation Modal -->
    <div v-if="confirmModal.show" class="fixed z-20 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="confirmModal.show = false">
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ confirmModal.title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ confirmModal.message }}
                  </p>
                </div>
                <div v-if="confirmModal.action === 'regret'" class="mt-3">
                  <label for="regret-reason" class="block text-sm font-medium text-gray-700">Reason for Regret</label>
                  <textarea id="regret-reason" v-model="rejectionReason" rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Please provide a reason for regret"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="confirmAction"
              :class="`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm
                ${confirmModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`">
              {{ confirmModal.action === 'approve' ? 'Approve' : 'Regret' }}
            </button>
            <button type="button" @click="confirmModal.show = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TeachingHospitalsDetailsModal from '../modals/TeachingHospitalsDetailsModal.vue';
import apiServices from '@/services/services';

const teachingCenters = ref([]);
const isModalOpen = ref(false);
const selectedHospital = ref({});
const loading = ref(false);
const rejectionReason = ref('');

// Alert system for success/error messages
const alert = ref({
  show: false,
  type: 'success',
  message: ''
});

// Confirmation modal
const confirmModal = ref({
  show: false,
  title: '',
  message: '',
  action: '',
  centerId: null
});

onMounted(async () => {
  await fetchTeachingCenters();
});

const fetchTeachingCenters = async () => {
  try {
    loading.value = true;

    // Fetch Teaching Centers for the table
    const response = await apiServices.getEpcTeachingCenters(); // Changed to getEpcTeachingCenters

    // axios wraps response in data property
    if (response && response.data && response.data.results) {
      teachingCenters.value = response.data.results;
    } else if (response && response.results) {
      teachingCenters.value = response.results;
    } else if (Array.isArray(response)) {
      teachingCenters.value = response;
    } else if (response && Array.isArray(response.data)) {
      teachingCenters.value = response.data;
    } else {
      console.error("Unexpected API response structure:", response);
      showAlert('error', 'Failed to load teaching hospitals data');
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    showAlert('error', 'Failed to load teaching hospitals data');
  } finally {
    loading.value = false;
  }
};

const openModal = (center) => {
  selectedHospital.value = center;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedHospital.value = {}; // Clear selected hospital data when closing
};

const handleApprove = () => {
  confirmModal.value = {
    show: true,
    title: 'Approve Teaching Hospital',
    message: `Are you sure you want to approve "${selectedHospital.value.center_name}"?`,
    action: 'approve',
    centerId: selectedHospital.value.id
  };
};

const handleRegret = () => {
  confirmModal.value = {
    show: true,
    title: 'Regret Teaching Hospital',
    message: `Are you sure you want to regret "${selectedHospital.value.center_name}"?`,
    action: 'regret',
    centerId: selectedHospital.value.id
  };
  rejectionReason.value = ''; // Reset rejection reason
};

const confirmAction = async () => {
  try {
    loading.value = true;
    const id = confirmModal.value.centerId;

    if (!id) {
      throw new Error('Teaching hospital ID is missing');
    }

    const updateData = {
      tc_review_decision: confirmModal.value.action === 'approve' ? 'Approved' : 'Regretted'
    };

    // Add reason if rejecting
    if (confirmModal.value.action === 'regret') {
      if (!rejectionReason.value.trim()) {
        showAlert('error', 'Please provide a reason for regret');
        loading.value = false;
        return;
      }
      updateData.tc_reason_if_rejected = rejectionReason.value.trim();
    }

    // Update the teaching center
    await apiServices.patchEpcTeachingCenter(id, updateData); // Changed to patchEpcTeachingCenter

    // Update local data to reflect the change
    const index = teachingCenters.value.findIndex(center => center.id === id);
    if (index !== -1) {
      teachingCenters.value[index].tc_review_decision = updateData.tc_review_decision;
      if (updateData.tc_reason_if_rejected) {
        teachingCenters.value[index].tc_reason_if_rejected = updateData.tc_reason_if_rejected;
      }
    }

    // Show success message
    showAlert(
      'success',
      `Teaching hospital ${confirmModal.value.action === 'approve' ? 'approved' : 'regretted'} successfully`
    );

    // Close modals
    confirmModal.value.show = false;
    closeModal();
  } catch (error) {
    console.error('Error updating teaching hospital:', error);
    showAlert('error', `Failed to ${confirmModal.value.action} teaching hospital`);
  } finally {
    loading.value = false;
  }
};

const showAlert = (type, message) => {
  alert.value = {
    show: true,
    type,
    message
  };

  // Auto-hide alert after 5 seconds
  setTimeout(() => {
    alert.value.show = false;
  }, 5000);
};
</script>