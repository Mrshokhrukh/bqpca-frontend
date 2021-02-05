<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track Your Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Search by CID/Work Permit number or Application ID
      </p>
    </div>

    <!-- Search Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="max-w-xl mx-auto">
        <!-- Search Type Tabs -->
        <div class="flex space-x-4 mb-4">
          <button @click="searchType = 'id'" :class="[
            'px-4 py-2 rounded-lg text-sm font-medium flex-1',
            searchType === 'id'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
            CID/Work Permit Number
          </button>
          <button @click="searchType = 'application'" :class="[
            'px-4 py-2 rounded-lg text-sm font-medium flex-1',
            searchType === 'application'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
            Application ID
          </button>
        </div>

        <div class="flex space-x-4">
          <input v-model="searchQuery" type="text"
            class="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            :placeholder="searchType === 'id' ? 'Enter CID or Work Permit number' : 'Enter Application ID (e.g., c44df22e-53cf-4486-9)'" />
          <button @click="handleSearch"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            :disabled="isLoading">
            <span v-if="isLoading" class="inline-block animate-spin mr-2">⌛</span>
            {{ isLoading ? 'Searching...' : 'Search' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="filteredApplications?.length > 0" class="space-y-6">
      <div v-for="application in filteredApplications" :key="application.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-blue-200 transition-colors">
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ application.full_name }}
                <span :class="[
            'ml-2 px-2 py-1 text-xs rounded-full',
            application.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          ]">
                  {{ application.is_active ? 'Active' : 'Inactive' }}
                </span>
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                Registration No: {{ application.registration_no }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">
                {{ application.cid_holder ? 'CID' : 'Work Permit' }} Number
              </p>
              <p class="text-sm text-gray-500">{{ application.cid_no }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <p class="text-sm font-medium text-gray-900">Contact Details</p>
              <p class="text-sm text-gray-500">{{ application.contact_no }}</p>
              <p class="text-sm text-gray-500">{{ application.email_address }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Registration Date</p>
              <p class="text-sm text-gray-500">
                {{ new Date(application.registration_date).toLocaleDateString() }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Expiry Date</p>
              <p class="text-sm text-gray-500">
                {{ new Date(application.expiry_date).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div>
                  <p class="text-sm font-medium text-gray-900">Payment Status</p>
                  <p :class="[
            'text-sm',
            application.is_payment_complete
              ? 'text-green-600'
              : 'text-red-600'
          ]">
                    {{ application.is_payment_complete ? 'Completed' : 'Pending' }}
                  </p>
                </div>
                <div v-if="application.payment_id">
                  <p class="text-sm font-medium text-gray-900">Payment ID</p>
                  <p class="text-sm text-gray-500">{{ application.payment_id }}</p>
                </div>
              </div>
              <img :src="application.passport_photo" :alt="application.full_name"
                class="h-16 w-16 rounded-lg object-cover" />
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center space-x-2 mt-6">
        <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)" :class="[
            'px-4 py-2 rounded-lg text-sm font-medium',
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
          {{ page }}
        </button>
      </div>
    </div>

    <!-- No Results Message -->
    <div v-else-if="hasSearched" class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
      <p class="text-gray-600">No applications found matching your search.</p>
    </div>
    <div v-else class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
      <p class="text-gray-600">Enter search criteria to find applications.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import apiService from '@/services/services';

// State
const applications = ref([]);
const searchQuery = ref('');
const searchType = ref('id');
const isLoading = ref(false);
const hasSearched = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed
const totalPages = computed(() => {
  if (!applications.value || applications.value.length === 0) return 0;
  return Math.ceil(filteredApplications.value.length / itemsPerPage);
});

const filteredApplications = computed(() => {
  if (!searchQuery.value) {
    return [];  // Return empty array if no search query
  }

  return applications.value.filter(app => {
    if (searchType.value === 'id') {
      return app.cid_no.toLowerCase().includes(searchQuery.value.toLowerCase());
    } else {
      return app.registration_no.toLowerCase().includes(searchQuery.value.toLowerCase());
    }
  });
});

// Methods
const fetchApplications = async () => {
  isLoading.value = true;
  try {
    let response;
    if (searchType.value === 'id') {
      response = await apiService.getBhmcNewApplications(searchQuery.value);
    } else {
      response = await apiService.getBhmcNewApplications(searchQuery.value);
    }

    if (response && response.data && response.data.results) {
      applications.value = response.data.results;
    } else {
      applications.value = []; // Set to empty array if no results or invalid response
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    applications.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async () => {
  hasSearched.value = true;
  await fetchApplications();
  currentPage.value = 1;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};
</script>
