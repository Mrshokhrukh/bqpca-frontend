<template>
  <div class="application-tracking max-w-6xl mx-auto p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
    <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">Track Your Teaching Center Applications</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-8">
      <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <p class="text-gray-600 mt-2">Loading applications...</p>
    </div>

    <!-- Filters -->
    <div v-else class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <!-- Search Input -->
      <div class="relative w-full sm:w-1/3">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by center name or location"
          class="block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/50 backdrop-blur-sm"
        />
        <MagnifyingGlassIcon class="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
      <!-- Location Filters -->
      <div class="flex gap-4 w-full sm:w-auto">
        <div class="relative w-full sm:w-48">
          <select
            v-model="filterDzongkhag"
            class="block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/50 backdrop-blur-sm appearance-none"
          >
            <option value="">All Dzongkhags</option>
            <option v-for="dzongkhag in dzongkhagOptionsForCenter" :key="dzongkhag.value" :value="dzongkhag.value">
              {{ dzongkhag.label }}
            </option>
          </select>
          <ChevronDownIcon class="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div class="relative w-full sm:w-48">
          <select
            v-model="filterGewog"
            class="block w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white/50 backdrop-blur-sm appearance-none"
            :disabled="!filterDzongkhag"
          >
            <option value="">{{ filterDzongkhag ? 'All Gewogs' : 'Select Dzongkhag first' }}</option>
            <option v-for="gewog in gewogOptionsForCenter" :key="gewog.value" :value="gewog.value">
              {{ gewog.label }}
            </option>
          </select>
          <ChevronDownIcon class="absolute top-1/2 right-3 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Applications Table -->
    <div v-if="!isLoading" class="overflow-x-auto">
      <table class="min-w-full border-collapse border border-gray-200">
        <thead class="bg-gradient-to-r from-indigo-50 to-purple-50">
          <tr>
            <th class="px-6 py-3 border border-gray-200 text-left text-sm font-semibold text-gray-700">Center Name</th>
            <th class="px-6 py-3 border border-gray-200 text-left text-sm font-semibold text-gray-700">Location</th>
            <th class="px-6 py-3 border border-gray-200 text-left text-sm font-semibold text-gray-700">Status</th>
            <th class="px-6 py-3 border border-gray-200 text-left text-sm font-semibold text-gray-700">Valid Till</th>
            <th class="px-6 py-3 border border-gray-200 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in filteredApplications" :key="application.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 border border-gray-200 text-sm text-gray-700">{{ application.center_name }}</td>
            <td class="px-6 py-4 border border-gray-200 text-sm text-gray-700">{{ application.center_location }} ({{ application.state_dzongkhag }}, {{ application.city_gewog }})</td>
            <td class="px-6 py-4 border border-gray-200 text-sm">
              <span :class="statusClass(application.tc_review_decision)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ application.tc_review_decision || 'Unknown' }}
              </span>
            </td>
            <td class="px-6 py-4 border border-gray-200 text-sm text-gray-700">{{ formatDate(application.valid_till) }}</td>
            <td class="px-6 py-4 border border-gray-200 text-sm text-gray-700 flex gap-2">
              <button
                v-if="application.tc_review_decision === 'Approved'"
                @click="openAddSupervisorModal(application)"
                class="px-3 py-1 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition-colors"
              >
                Add Supervisor
              </button>
              <button
                @click="viewDetails(application)"
                class="px-3 py-1 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition-colors"
              >
                View Details
              </button>
            </td>
          </tr>
          <tr v-if="filteredApplications.length === 0">
            <td colspan="5" class="px-6 py-4 text-center text-gray-600">No applications found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Supervisor Modal -->
    <supervisor-button
      v-if="isSupervisorModalOpen"
      :application-id="selectedApplication?.id"
      @close="closeSupervisorModal"
      @submit-success="handleSupervisorSubmitSuccess"
    />

    <!-- Application Details Modal -->
    <div v-if="isDetailsModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">Application Details</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700">Center Name:</label>
            <p class="text-gray-600">{{ selectedApplication?.center_name }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700">Location:</label>
            <p class="text-gray-600">{{ selectedApplication?.center_location }} ({{ selectedApplication?.state_dzongkhag }}, {{ selectedApplication?.city_gewog }})</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700">Status:</label>
            <p :class="statusClass(selectedApplication?.tc_review_decision)" class="inline-block px-3 py-1 rounded-full text-xs font-medium">
              {{ selectedApplication?.tc_review_decision || 'Unknown' }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700">Valid Till:</label>
            <p class="text-gray-600">{{ formatDate(selectedApplication?.valid_till) }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700">Review Summary:</label>
            <p class="text-gray-600">{{ selectedApplication?.tc_review_summary || 'N/A' }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700">Remarks:</label>
            <p class="text-gray-600">{{ selectedApplication?.tc_remarks || 'N/A' }}</p>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <button
            @click="closeDetailsModal"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
import apiServices from '@/services/services';
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags';
import { useAuthStore } from '@/stores/authStore';
import SupervisorButton from './modals/SupervisorButton.vue';
const authStore = useAuthStore();
const applications = ref([]);
const searchQuery = ref('');
const filterDzongkhag = ref('');
const filterGewog = ref('');
const isSupervisorModalOpen = ref(false);
const isDetailsModalOpen = ref(false);
const selectedApplication = ref(null);
const isLoading = ref(false);

// Dzongkhag and Gewog options for filtering
const dzongkhagOptionsForCenter = computed(() => {
  return bhutanDzongkhagsGewogs.map(d => ({
    value: d.dzongkhag,
    label: d.dzongkhag,
  }));
});

const gewogOptionsForCenter = computed(() => {
  if (!filterDzongkhag.value) return [];
  const selectedDzongkhag = bhutanDzongkhagsGewogs.find(
    (d) => d.dzongkhag === filterDzongkhag.value
  );
  return selectedDzongkhag
    ? selectedDzongkhag.gewogs.map((g) => ({ value: g, label: g }))
    : [];
});

// Reset Gewog filter when Dzongkhag changes
watch(() => filterDzongkhag.value, () => {
  filterGewog.value = '';
});

// Filter applications based on search query and location
const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    const matchesSearch =
      app.center_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.center_location?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.state_dzongkhag?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      app.city_gewog?.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesDzongkhag = filterDzongkhag.value ? app.state_dzongkhag === filterDzongkhag.value : true;
    const matchesGewog = filterGewog.value ? app.city_gewog === filterGewog.value : true;
    return matchesSearch && matchesDzongkhag && matchesGewog;
  });
});

// Status styling
const statusClass = (status) => {
  return {
    'bg-green-100 text-green-700': status === 'Approved',
    'bg-yellow-100 text-yellow-700': status === 'Pending',
    'bg-red-100 text-red-700': status === 'Rejected',
    'bg-gray-100 text-gray-700': status === 'Draft' || !status,
  };
};

// Format date for display
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Fetch user applications
const fetchApplications = async () => {
  if (!authStore.userId) {
    alert('User not authenticated. Please log in.');
    return;
  }
  isLoading.value = true;
  try {
    const response = await apiServices.getMhpcTeachingCenters(authStore.userId);
    console.log('Raw API response:', response.data);
    let fetchedApplications = response.data?.results || response.data || [];

    fetchedApplications = fetchedApplications.map(app => ({
      ...app,
      tc_review_decision: app.tc_review_decision || 'Unknown',
    }));

    if (!Array.isArray(fetchedApplications)) {
      console.error('Expected an array of applications, received:', fetchedApplications);
      fetchedApplications = [];
      alert('Failed to load applications: Unexpected data format.');
    }
    applications.value = fetchedApplications;
  } catch (error) {
    console.error('Error fetching applications:', error.response?.data || error.message);
    alert('Failed to load applications. Please check the console for details and try again.');
    applications.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Open supervisor modal
const openAddSupervisorModal = (application) => {
  if (application.tc_review_decision !== 'Approved') {
    alert('Cannot add supervisor: Application is not approved.');
    return;
  }
  selectedApplication.value = application;
  isSupervisorModalOpen.value = true;
};

// Close supervisor modal
const closeSupervisorModal = () => {
  isSupervisorModalOpen.value = false;
  selectedApplication.value = null;
};

// Handle successful supervisor submission
const handleSupervisorSubmitSuccess = (message) => {
  alert(message);
  closeSupervisorModal();
};

// View application details
const viewDetails = (application) => {
  selectedApplication.value = application;
  isDetailsModalOpen.value = true;
};

// Close details modal
const closeDetailsModal = () => {
  isDetailsModalOpen.value = false;
  selectedApplication.value = null;
};

// Fetch applications on component mount
onMounted(fetchApplications);
</script>

<style scoped>
.application-tracking {
  background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,245,0.8));
}

table th, table td {
  transition: all 0.2s ease;
}

button {
  transition: all 0.2s ease;
}

select:focus, input:focus {
  transform: scale(1.02);
}
</style>