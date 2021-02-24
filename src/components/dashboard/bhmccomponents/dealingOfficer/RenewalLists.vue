<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Renewal Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ applications.length }}
        </span>
        <span class="mx-4">|</span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          Pending: {{ pendingCount }}
        </span>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="relative">
        <input v-model="searchQuery" type="text" placeholder="Search by name or ID..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div class="flex gap-4">
        <select v-model="filterStatus"
          class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="app in paginatedApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ app.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="app.passport_photo || '/placeholder-avatar.png'"
                    class="h-8 w-8 rounded-full object-cover mr-3" @error="handleImageError">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ app.full_name }}</div>
                    <div class="text-sm text-gray-500">{{ app.email_address }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ app.registration_type?.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
            'px-3 py-1 rounded-full text-xs font-medium',
            {
              'bg-yellow-100 text-yellow-800': getStatus(app) === 'Pending',
              'bg-green-100 text-green-800': getStatus(app) === 'Approved',
              'bg-red-100 text-red-800': getStatus(app) === 'Rejected'
            }
          ]">
                  {{ getStatus(app) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(app.registration_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="viewDetails(app)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">View</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Previous
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredApplications.length) }}</span>
            of
            <span class="font-medium">{{ filteredApplications.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <ViewDetailsModal :isOpen="isModalOpen" :application="selectedApplication" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import apiServices from '@/services/services';
import ViewDetailsModal from './modals/ViewApplicationDetailsModal.vue';

const applications = ref([]);
const filterStatus = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isModalOpen = ref(false);
const selectedApplication = ref(null);

const pendingCount = computed(() => {
  return applications.value.filter(app =>
    app.user_qualifications?.[0]?.application_review_status === 'Pending'
  ).length;
});

const getStatus = (app) => {
  return app.user_qualifications?.[0]?.application_review_status || 'Pending';
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handleImageError = (event) => {
  event.target.src = '/placeholder-avatar.png';
};

// Fetch applications on component mount
const fetchApplications = async () => {
  try {
    const response = await apiServices.getBhmcNewApplications();
    console.log('API Response:', response.data);

    if (!response.data || !response.data.results || !Array.isArray(response.data.results)) {
      console.error('Invalid API response format. Expected response.data.results to be an array.');
      return;
    }

    // Assign the results directly to the applications array
    applications.value = response.data.results;

    console.log('Applications:', applications.value);

  } catch (error) {
    console.error('Error fetching applications:', error);
  }
};

onMounted(() => {
  fetchApplications();
});

const filteredApplications = computed(() => {
  let filtered = applications.value;

  // Filter by registration_type
  filtered = filtered.filter(app => app.registration_type && typeof app.registration_type === 'object' && app.registration_type.name === 'Renewal');

  // Filter by status
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(app => app.user_qualifications && app.user_qualifications.length > 0 && app.user_qualifications[0].application_review_status === filterStatus.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(app =>
      app.full_name.toLowerCase().includes(query) ||
      app.cid_no.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredApplications.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredApplications.value.length / itemsPerPage);
});

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

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};


</script>
