<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-3">EOI Applications</h1>
      </div>
      <div>
        <button
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          @click="fetchInstitutes"
          :disabled="loading"
        >
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
          {{ loading ? 'Refreshing...' : 'Refresh Application List' }}
        </button>
      </div>
    </div>

    <!-- Search Input -->
    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by App ID or Institute Name..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="debouncedSearch"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Application Table with Loading State -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Application ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Institute Name
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Program Type
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date Submitted
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="institute in filteredEois"
              :key="institute.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ institute.CID }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ institute.full_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ institute.type_of_programme }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(institute.commencement_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(institute)">
                  {{ institute.review_decision }}
                  <span v-if="institute.review_decision === 'Rejected' && institute.reason_if_rejected">
                    (Reason: {{ institute.reason_if_rejected }})
                  </span>
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    @click="openModal(institute)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    View
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <span v-if="institute.approvalNotes">{{ institute.approvalNotes }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- EOI Application Modal with approval and rejection handlers -->
    <EoiApplicationsModal
      :isOpen="isModalOpen"
      :application="selectedInstitute"
      @close="closeModal"
      @application-updated="handleApplicationUpdated"
      :key="selectedInstitute ? selectedInstitute.id : 'no-institute'"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { RefreshCw } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
import EoiApplicationsModal from './EoiApplicationsModal.vue';
import { debounce } from 'lodash';
import apiService from '@/services/services';

const toast = useToast();

const institutes = ref([]);
const isModalOpen = ref(false);
const selectedInstitute = ref(null);
const loading = ref(false);
const searchQuery = ref('');

const fetchInstitutes = async () => {
  loading.value = true;
  try {
    const response = await apiService.getBmhcInstitutes();
    if (response && response.data && response.data.results) {
      institutes.value = response.data.results; // Extract the "results" array
    } else {
      console.error('Invalid API response:', response);
      toast.error('Failed to fetch institute applications: Invalid API response.');
    }
  } catch (error) {
    console.error('Error fetching institutes:', error);
    toast.error('Failed to fetch institute applications.');
  } finally {
    loading.value = false;
  }
};


onMounted(fetchInstitutes);

const debouncedSearch = debounce(fetchInstitutes, 300);

const openModal = (institute) => {
  selectedInstitute.value = { ...institute };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedInstitute.value = null;
};

const handleApplicationUpdated = (updatedApplication) => {
  // Update the institutes array with the new application data
  institutes.value = institutes.value.map((institute) => {
    if (institute.id === updatedApplication.id) {
      return updatedApplication; // Replace with updated data
    }
    return institute;
  });

  // Optionally, re-fetch the institutes to ensure data is up-to-date
  // fetchInstitutes();
};

const filteredEois = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return institutes.value.filter((institute) => {
    return (
      String(institute.CID).toLowerCase().includes(query) ||
      institute.full_name.toLowerCase().includes(query)
    );
  });
});

const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', date, error);
    return 'Invalid Date';
  }
};

const getStatusClasses = (institute) => {
  return [
    'px-3 py-1 rounded-full text-xs font-medium',
    {
      'bg-yellow-100 text-yellow-800': institute.review_decision === 'Pending',
      'bg-green-100 text-green-800': institute.review_decision === 'Approved',
      'bg-red-100 text-red-800': institute.review_decision === 'Rejected',
    },
  ];
};
</script>

<style scoped>
/* Tailwind styles - no need for custom styles here, Tailwind classes are used */
</style>


