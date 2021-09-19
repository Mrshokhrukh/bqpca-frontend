<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
    <div class="mx-auto">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-200">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Accreditation Appeals</h1>
            <p class="mt-1 text-sm text-gray-500">View your past appeals or apply for a new one.</p>
          </div>
          <button
            v-if="canApplyForAppeal && !isLoading"
            @click="openApplyModal"
            class="mt-4 sm:mt-0 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 ease-in-out"
          >
            Apply for Appeal
          </button>
           <div v-if="!canApplyForAppeal && !isLoading" class="mt-4 sm:mt-0 p-2.5 bg-gray-100 text-gray-600 text-sm rounded-lg">
            No applications are currently eligible for appeal.
          </div>
        </div>

        <div class="p-6">
          <div v-if="isLoading" class="text-center py-10">
            <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-4 text-gray-600">Loading appeals...</p>
          </div>

          <div v-else-if="appeals.length === 0" class="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
            <p class="text-gray-600 font-semibold">No Appeals Found</p>
            <p class="text-sm text-gray-500 mt-1">You have not submitted any appeals yet.</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Ref.</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason for Appeal</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appeal Status</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="appeal in appeals" :key="appeal.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ appeal.application_reference_no }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ appeal.appeal_reason_display }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ new Date(appeal.created_at).toLocaleDateString() }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span v-if="appeal.status_appeal === 'draft'" class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      N/A
                    </span>
                    <span v-else-if="appeal.is_appeal_fee_paid" class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                    <span v-else class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                      Pending
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span :class="getStatusClass(appeal.status_appeal)" class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ appeal.status_appeal_display || appeal.status_appeal }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="openViewModal(appeal)" class="text-indigo-600 hover:text-indigo-900 font-semibold">View Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <AccreApplyForAppeal
      :is-visible="isApplyModalVisible"
      @close="closeApplyModal"
      @appeal-submitted="handleAppealSubmitted"
    />

    <AppealDetailsModal
      :is-visible="isViewModalVisible"
      :appeal="selectedAppeal"
      @close="closeViewModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from '@/services/services';
import { useToast } from 'vue-toastification';
import AccreApplyForAppeal from './AccreApplyForAppeal.vue';
import AppealDetailsModal from './AppealDetailsModal.vue';

const appeals = ref([]);
const isLoading = ref(true);
const toast = useToast();

const isApplyModalVisible = ref(false);
const canApplyForAppeal = ref(false);

const isViewModalVisible = ref(false);
const selectedAppeal = ref(null);

const fetchData = async () => {
  isLoading.value = true;
  try {
    const response = await apiService.getAccreditationAppeals();
    appeals.value = response.data.results || [];
    canApplyForAppeal.value = true;
  } catch (error) {
    console.error("Failed to fetch appeal data:", error);
    toast.error("Failed to load appeal information. Please try again.");
    appeals.value = [];
  } finally {
    isLoading.value = false;
  }
};

const openApplyModal = () => { isApplyModalVisible.value = true; };
const closeApplyModal = () => { isApplyModalVisible.value = false; };

const openViewModal = (appeal) => {
  selectedAppeal.value = appeal;
  isViewModalVisible.value = true;
};
const closeViewModal = () => {
  isViewModalVisible.value = false;
  selectedAppeal.value = null;
};

const handleAppealSubmitted = () => {
  closeApplyModal();
  toast.success("Your appeal has been submitted successfully!");
  fetchData();
};

const getStatusClass = (status) => {
  const classes = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review_bac: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    pending_payment: 'bg-orange-100 text-orange-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

onMounted(() => {
  fetchData();
});
</script>