// Example: RegistrationApplications.vue

<template>
  <div class="p-6 min-h-screen">
    <h2 class="text-3xl font-bold mb-8 text-gray-900">{{ title }}</h2>

    <!-- Status Filter -->
    <div class="mb-8">
      <select
        v-model="filterStatus"
        class="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>

    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full">
        <thead class="bg-gray-200">
          <tr>
            <th class="py-4 px-6 text-left text-sm font-semibold text-gray-800">Application ID</th>
            <th class="py-4 px-6 text-left text-sm font-semibold text-gray-800">Applicant Name</th>
            <th class="py-4 px-6 text-left text-sm font-semibold text-gray-800">Status</th>
            <th class="py-4 px-6 text-left text-sm font-semibold text-gray-800">Submission Date</th>
            <th class="py-4 px-6 text-left text-sm font-semibold text-gray-800">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-300">
          <tr
            v-for="app in filteredApplications"
            :key="app.id"
            class="hover:bg-gray-100 transition-colors"
          >
            <td class="py-4 px-6 text-sm text-gray-800">{{ app.id }}</td>
            <td class="py-4 px-6 text-sm text-gray-800">{{ app.fullName }}</td>
            <td class="py-4 px-6 text-sm text-gray-800">
              <span :class="statusClasses(app.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ app.status }}
              </span>
            </td>
            <td class="py-4 px-6 text-sm text-gray-800">{{ app.submissionDate }}</td>
            <td class="py-4 px-6 text-sm text-gray-800">
              <button @click="viewDetails(app)" class="text-blue-600 hover:text-blue-800 hover:underline">View</button>
              <button @click="approveApplication(app)" class="text-green-600 hover:text-green-800 hover:underline ml-2">Approve</button>
              <button @click="rejectApplication(app)" class="text-red-600 hover:text-red-800 hover:underline ml-2">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ViewDetailsModal :isOpen="isModalOpen" :application="selectedApplication" @close="isModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import services from '@/services/services'; // Adjust path as needed
import ViewDetailsModal from '../modals/ViewDetailsModal.vue'; // Adjust path as needed

const title = ref('New Applications'); // Change for each component
const applications = ref([]);
const filterStatus = ref('all');
const isModalOpen = ref(false);
const selectedApplication = ref(null);

// Fetch applications on component mount
const fetchApplications = async () => {
  try {
    const response = await services.getBhmcNewQualifications(); // Use your actual API endpoint
    console.log('API Response:', response.data);

    if (!response.data || !response.data.results || !Array.isArray(response.data.results)) {
      console.error('Invalid API response format. Expected response.data.results to be an array.');
      return;
    }

    applications.value = response.data.results.map(app => ({
      id: app.id,
      fullName: app.qualification_name,
      status: app.application_review_status,
      submissionDate: app.registration_date,
      // Add any other fields you need to display
    }));
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
};

onMounted(() => {
  fetchApplications();
});

const filteredApplications = computed(() => {
  if (filterStatus.value === 'all') {
    return applications.value;
  }
  return applications.value.filter(app => app.status === filterStatus.value);
});

const statusClasses = (status) => {
  return {
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-red-100 text-red-800': status === 'Rejected',
  };
};

const viewDetails = (application) => {
  selectedApplication.value = application;
  isModalOpen.value = true;
};

const approveApplication = async (application) => {
  if (confirm('Are you sure you want to approve this application?')) {
    try {
      const updatedApplication = { ...application, application_review_status: 'Approved' };
      await services.updateBhmcNewQualification(updatedApplication.id, updatedApplication, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const index = applications.value.findIndex(app => app.id === application.id);
      if (index !== -1) {
        applications.value[index].status = 'Approved';
      }
      alert('Application approved successfully.');
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve the application.');
    }
  }
};

const rejectApplication = async (application) => {
  if (confirm('Are you sure you want to reject this application?')) {
    try {
      const updatedApplication = { ...application, application_review_status: 'Rejected' };
      await services.updateBhmcNewQualification(updatedApplication.id, updatedApplication, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const index = applications.value.findIndex(app => app.id === application.id);
      if (index !== -1) {
        applications.value[index].status = 'Rejected';
      }

      alert('Application rejected successfully.');
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject the application.');
    }
  }
};

</script>
