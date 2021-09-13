<template>
  <div class=" mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-2xl font-bold text-gray-800">Accreditation Applications for Review</h3>
      <p class="mt-1 text-sm text-gray-600">The following applications have been submitted and are awaiting a decision.</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading applications...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!applications.length" class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
      <p class="text-sm text-blue-700">
        There are no new applications submitted for review at this time.
      </p>
    </div>

    <!-- Applications Table -->
    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cycle</th>
              <!-- NEW: Added Payment Status Header -->
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
              <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ app.institute_profile_name_display }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ app.accreditation_cycle_display }}</td>
              <!-- NEW: Added Payment Status Data Cell -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', paymentStatusBadgeClass(app.is_payment_complete)]">
                  {{ app.is_payment_complete ? 'Paid' : 'Pending' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', statusBadgeClass(app.status)]">
                  {{ app.status_display }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ new Date(app.updated_at).toLocaleDateString() }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openReviewModal(app.id)" class="text-blue-600 hover:text-blue-900 font-semibold">
                  Review
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- The Review Modal Component -->
    <!-- FIX: Corrected component name -->
    <InitialAccreditationApplicationModal
      :show="isModalVisible"
      :application-id="selectedApplicationId"
      @close="closeModal"
      @decision-made="handleDecision"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// FIX: Corrected import statement typo from 'Initail' to 'Initial'.
// Make sure your component file is named `InitialAccreditationApplicationModal.vue`.
import InitialAccreditationApplicationModal from './InitialAccreditationApplicationModal.vue';
import apiService from '@/services/services';

const isLoading = ref(true);
const applications = ref([]);
const isModalVisible = ref(false);
const selectedApplicationId = ref(null);

const fetchApplicationsForReview = async () => {
  isLoading.value = true;
  try {
    const response = await apiService.getAccreditationApplications();
    // Assuming the API returns an object with a 'results' array for pagination
    applications.value = response.data.results || response.data;
  } catch (error) {
    console.error("Failed to fetch applications for review:", error);
    applications.value = [];
  } finally {
    isLoading.value = false;
  }
};

const openReviewModal = (appId) => {
  selectedApplicationId.value = appId;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  selectedApplicationId.value = null;
};

const handleDecision = () => {
  closeModal();
  fetchApplicationsForReview();
};

const statusBadgeClass = (statusKey) => {
  const mapping = {
    'initial_app_submitted_heqc_review': 'bg-blue-100 text-blue-800',
    // You can add other statuses here from your JSON for different colors
    'approved_accredited': 'bg-green-100 text-green-800',
  };
  return mapping[statusKey] || 'bg-gray-100 text-gray-800';
};

// NEW: Added function for payment status badge classes
const paymentStatusBadgeClass = (isComplete) => {
  if (isComplete) {
    return 'bg-green-100 text-green-800';
  }
  return 'bg-yellow-100 text-yellow-800';
};

onMounted(() => {
  fetchApplicationsForReview();
});
</script>