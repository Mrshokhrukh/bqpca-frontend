<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h2 class="text-3xl font-bold mb-8 text-gray-900">Application List</h2>

    <!-- Tabs -->
    <div class="flex space-x-4 mb-8">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'px-6 py-3 rounded-lg font-medium transition-colors',
          activeTab === tab.value
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-200'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

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

    <!-- Tables for each type -->
    <div v-for="tab in tabs" :key="tab.value">
      <div v-if="activeTab === tab.value" class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full">
          <thead class="bg-gray-200">
            <tr>
              <th class="py-4 px-6 text-left text-sm font-semibold text-gray-800">Application ID</th>
              <th class="py-4 px-6 text-left text-sm font-semibold text-gray-800">Applicant Name</th>
              <th class="py-4 px-6 text-left text-sm font-semibold text-gray-800">Type</th>
              <th class="py-4 px-6 text-left text-sm font-semibold text-gray-800">Status</th>
              <th class="py-4 px-6 text-left text-sm font-semibold text-gray-800">Submission Date</th>
              <th class="py-4 px-6 text-left text-sm font-semibold text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr
              v-for="app in paginatedApplications(tab.value)"
              :key="app.id"
              class="hover:bg-gray-100 transition-colors"
            >
              <td class="py-4 px-6 text-sm text-gray-800">{{ app.id }}</td>
              <td class="py-4 px-6 text-sm text-gray-800">{{ app.fullName }}</td>
              <td class="py-4 px-6 text-sm text-gray-800">{{ getRegistrationTypeLabel(app.type) }}</td>
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
    </div>

    <!-- Pagination -->
    <div class="mt-8 flex justify-center items-center space-x-6">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-6 py-3 border rounded-lg shadow-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-sm text-gray-800">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-6 py-3 border rounded-lg shadow-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <ViewDetailsModal :isOpen="isModalOpen" :application="selectedApplication" @close="isModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import services from '@/services/services';
import ViewDetailsModal from './modals/ViewDetailsModal.vue'; // Import the modal component

const tabs = ref([
  { label: 'Registration', value: 2 },
  { label: 'Renewal', value: 1 },
  { label: 'Re-registration', value: 3 },
]);

const applications = ref([]);
const activeTab = ref(2); // Initialize activeTab to the *value* (2), not the label
const filterStatus = ref('all');
const currentPage = ref(1);
const itemsPerPage = 5;
const isModalOpen = ref(false);
const selectedApplication = ref(null);

// Fetch applications on component mount
const fetchApplications = async () => {
  try {
    const response = await services.getBhmcNewQualifications();
    console.log('API Response:', response.data); // Log the raw API response

    if (!response.data || !response.data.results || !Array.isArray(response.data.results)) {
      console.error('Invalid API response format. Expected response.data.results to be an array.');
      return;
    }


    applications.value = response.data.results.map(app => {
      const mappedApp = {
        id: app.id,
        type: app.registration_type, // Keep the original numeric type
        fullName: app.qualification_name,
        status: app.application_review_status,
        submissionDate: app.registration_date,

      };
      console.log("Mapped App", mappedApp)
      return mappedApp;
    });
    console.log('Applications:', applications.value);
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
};

// Helper function to get the label based on registration type
const getRegistrationTypeLabel = (typeValue) => {
    const tab = tabs.value.find(t => t.value === typeValue);
    return tab ? tab.label : 'Unknown';
};

onMounted(() => {
  fetchApplications();
});

const filteredApplications = (type) => {
  console.log("Filtering for type:", type, "Current applications:", applications.value);
  return applications.value.filter(app => {

    const typeMatches = app.type === type;
    const statusMatches = filterStatus.value === 'all' || app.status === filterStatus.value;
    console.log(`App ${app.id}: typeMatches=${typeMatches}, statusMatches=${statusMatches}`);
    return typeMatches && statusMatches;
  });
};

const paginatedApplications = (type) => {
  const filtered = filteredApplications(type);
  console.log("Filtered Apps for pagination", filtered)
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filtered.slice(start, end);
};

const totalPages = computed(() => {
  const filtered = filteredApplications(activeTab.value);
  return Math.ceil(filtered.length / itemsPerPage);
});

const statusClasses = (status) => {
  return {
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-red-100 text-red-800': status === 'Rejected',
  };
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
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
      application.registration_type = 'Approved';
      alert('Application approved successfully.');
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve the application.');
    }
  }
};

</script>
