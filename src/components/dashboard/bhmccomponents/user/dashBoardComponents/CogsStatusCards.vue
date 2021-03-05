<template>
  <div v-if="application" class="bg-white shadow-lg rounded-xl p-6">
    <!-- Card Header -->
    <div class="flex items-center space-x-3 mb-4">
      <div class="bg-purple-100 p-2 rounded-full">
        <FolderIcon class="w-5 h-5 text-purple-500" />
      </div>
      <h3 class="font-semibold">Cogs</h3>
    </div>

    <!-- Card Body -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(value, key) in displayData" :key="key" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div class="text-sm font-medium text-gray-500">{{ key }}</div>
        <!-- Dynamic Styling for Statuses -->
        <div
          v-if="key === 'Review Status' || key === 'Endorsement Decision' || key === 'Payment Complete'"
          :class="getStatusClass(value)"
          class="text-base mt-1 font-semibold inline-flex items-center px-3 py-1 rounded-full"
        >
          {{ value }}
        </div>
        <div v-else class="text-base text-gray-900 mt-1">{{ value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FolderIcon } from '@heroicons/vue/24/outline';
import { ref, onMounted, computed } from 'vue';
import apiService from '@/services/services';

const applications = ref([]);
const application = ref(null);

const fetchApplications = async () => {
  try {
    const response = await apiService.getBmhcCogs();
    applications.value = Array.isArray(response.data.results)
      ? response.data.results
      : [];

    if (applications.value.length > 0) {
      application.value = applications.value[0]; // Use the first application
    } else {
      console.warn('No applications found');
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    applications.value = [];
  }
};

onMounted(fetchApplications);

const displayData = computed(() => {
  if (!application.value) {
    return {};
  }
  return {
    'Agency': application.value.agency.name,
    'Department': application.value.department.name,
    'Workplace': application.value.workplace.name,
    'Review Status': application.value.review_status,
    'Endorsement Decision': application.value.endorsement_decision,
    'Payment Complete': application.value.is_payment_complete ? 'Yes' : 'No',
  };
});

// Helper function to determine status colors
const getStatusClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800'; // Yellow for pending
    case 'Approved':
      return 'bg-green-100 text-green-800'; // Green for approved
    case 'Regretted':
      return 'bg-red-100 text-red-800'; // Red for regretted
    case 'Yes':
      return 'bg-green-100 text-green-800'; // Green for Yes
    case 'No':
      return 'bg-red-100 text-red-800'; // Red for No
    default:
      return 'bg-gray-100 text-gray-800'; // Default color
  }
};
</script>

<style scoped>
/* No scoped styles needed, everything is handled by Tailwind */
</style>
