<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Institute Renewal Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ renewalApplications.length }}
        </span>
        <!-- Add status indicators here if needed -->
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Institute Name
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Renewal Date
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Expiry Date
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="app in renewalApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ app.instituteName }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(app.renewalDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(app.expiryDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="handleApprove(app)"
                    class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    Approve
                  </button>
                  <button @click="handleRegret(app)"
                    class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    Regret
                  </button>
                  <button @click="openModal(app)"
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

    <!-- Pagination (if needed) -->
    <!--
    <div class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      </div>
    -->

    <InstituteRenewalApplicationDetailsModal :is-open="isModalOpen" :application-details="selectedApplication" @close-modal="closeModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import InstituteRenewalApplicationDetailsModal from '../modals/InstituteRenewalApplicationDetailsModal.vue'; // Adjust path if needed

// Static data for renewal applications (replace with your actual data or API call later)
const renewalApplications = ref([
  {
    id: 1,
    instituteName: 'Bhutan Medical Institute',
    renewalDate: '2024-07-15',
    expiryDate: calculateExpiryDate('2024-07-15'),
    // ... other relevant details
  },
  {
    id: 2,
    instituteName: 'Royal Institute of Health',
    renewalDate: '2024-08-01',
    expiryDate: calculateExpiryDate('2024-08-01'),
    // ... other relevant details
  },
  {
    id: 3,
    instituteName: 'Eastern Medical College',
    renewalDate: '2024-08-20',
    expiryDate: calculateExpiryDate('2024-08-20'),
    // ... other relevant details
  },
]);

const isModalOpen = ref(false);
const selectedApplication = ref({});

const openModal = (application) => {
  selectedApplication.value = application;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = {}; // Clear selected application data when closing
};


function calculateExpiryDate(renewalDate) {
  const date = new Date(renewalDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
}

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handleApprove = (application) => {
  // Handle approve logic here (e.g., send API request)
  console.log('Approved Renewal Application for:', application.instituteName);
  // You might want to update the renewalApplications list or refetch data after approval
};

const handleRegret = (application) => {
  // Handle regret logic here (e.g., send API request)
  console.log('Regretted Renewal Application for:', application.instituteName);
  // You might want to update the renewalApplications list or refetch data after regret
};
</script>
