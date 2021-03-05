<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track EOI Application Status
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Search by Institution Name or CID Number
      </p>
    </div>

    <!-- Search Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div class="max-w-xl mx-auto">
        <!-- Search Type Tabs -->
        <div class="flex space-x-4 mb-4">
          <button @click="searchType = 'cid'" :class="[
            'px-4 py-2 rounded-lg text-sm font-medium flex-1',
            searchType === 'cid'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
            CID Number
          </button>
          <button @click="searchType = 'institution'" :class="[
            'px-4 py-2 rounded-lg text-sm font-medium flex-1',
            searchType === 'institution'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
            Institution Name
          </button>
        </div>

        <div class="flex space-x-4">
          <input v-model="searchQuery" type="text"
            class="flex-1 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            :placeholder="searchType === 'cid' ? 'Enter CID number' : 'Enter Institution name'" />
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
    <div v-if="applications?.length > 0" class="space-y-6">
      <div v-for="application in applications" :key="application.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-blue-200 transition-colors">
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ application.name_of_institution }}
                <span :class="[
            'ml-2 px-2 py-1 text-xs rounded-full',
            getStatusColor(application.review_decision)
          ]">
                  {{ application.review_decision }}
                </span>
              </h3>
              <p class="text-sm text-gray-500 mb-4">
                CID: {{ application.CID }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">Course Details</p>
              <p class="text-sm text-gray-500">{{ application.title_of_course }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <p class="text-sm font-medium text-gray-900">Contact Details</p>
              <p class="text-sm text-gray-500">{{ application.contact_no }}</p>
              <p class="text-sm text-gray-500">{{ application.email_address }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Location</p>
              <p class="text-sm text-gray-500">
                {{ application.dzongkhag }}, {{ application.gewog }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Course Start Date</p>
              <p class="text-sm text-gray-500">
                {{ new Date(application.commencement_date).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6">
                <div>
                  <p class="text-sm font-medium text-gray-900">Program Type</p>
                  <p class="text-sm text-gray-600">
                    {{ application.type_of_programme === 'D' ? 'Diploma' : 'Bachelor' }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Duration</p>
                  <p class="text-sm text-gray-600">{{ application.course_duration }} months</p>
                </div>
                <div v-if="application.review_decision === 'Rejected'">
                  <p class="text-sm font-medium text-gray-900">Rejection Reason</p>
                  <p class="text-sm text-red-600">{{ application.reason_if_rejected }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Results Message -->
    <div v-else-if="hasSearched && !apiError" class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
      <p class="text-gray-600">No EOI applications found matching your search.</p>
    </div>
    <div v-else-if="apiError" class="text-center py-12 bg-red-100 rounded-xl border border-red-200">
      <p class="text-red-600">{{ errorMessage }}</p>
    </div>
    <div v-else class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
      <p class="text-gray-600">Enter search criteria to find EOI applications.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import bmhcService from '@/services/bmhcservices';

// State
const applications = ref([]);
const searchQuery = ref('');
const searchType = ref('cid');
const isLoading = ref(false);
const hasSearched = ref(false);
const apiError = ref(false);
const errorMessage = ref('');

// Methods
const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-green-100 text-green-700';
    case 'Rejected':
      return 'bg-red-100 text-red-700';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const fetchApplications = async () => {
  isLoading.value = true;
  apiError.value = false;
  errorMessage.value = '';

  try {
    const response = await bmhcService.getBmhcInstitutes();

    if (response && response.data && response.data.results) {
      // Filter based on search criteria
      const results = response.data.results.filter(app => {
        if (searchType.value === 'cid') {
          return app.CID.toLowerCase().includes(searchQuery.value.toLowerCase());
        } else {
          return app.name_of_institution.toLowerCase().includes(searchQuery.value.toLowerCase());
        }
      });

      applications.value = results;
    } else {
      applications.value = [];
    }
  } catch (error) {
    console.error('Error fetching EOI applications:', error);
    applications.value = [];
    apiError.value = true;
    errorMessage.value = error.response?.data?.message || 'Error fetching applications. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    errorMessage.value = 'Please enter a search term';
    return;
  }

  hasSearched.value = true;
  await fetchApplications();
};
</script>
