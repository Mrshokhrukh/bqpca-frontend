<template>
  <div class="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
    <div class="mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200/80 mb-8 p-6">
        <h1 class="text-3xl font-bold text-gray-900">Initial Applications for Review</h1>
        <p class="text-gray-600 mt-1">The following applications have been submitted and are awaiting a decision.</p>
      </div>

      <!-- Table Container -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading applications...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!applications.length" class="text-center py-20 px-6">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-semibold text-gray-900">No new applications</h3>
          <p class="mt-1 text-sm text-gray-500">There are no applications awaiting review at this time.</p>
        </div>

        <!-- Applications Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Institute</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Cycle</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Payment Status</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Submitted On</th>
                <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50/70 transition-colors">
                <td class="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{{ app.institute_profile_name_display }}</td>
                <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-500">{{ app.accreditation_cycle_display }}</td>
                <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                  <span :class="['px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full', paymentStatusBadgeClass(app.is_payment_complete)]">
                    {{ app.is_payment_complete ? 'Paid' : 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                  <span :class="['px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full', statusBadgeClass(app.status)]">
                    {{ app.status_display }}
                  </span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-500">{{ new Date(app.updated_at).toLocaleDateString() }}</td>
                <td class="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openReviewModal(app.id)" class="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100">
                    Review Application
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- The Review Modal Component -->
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
