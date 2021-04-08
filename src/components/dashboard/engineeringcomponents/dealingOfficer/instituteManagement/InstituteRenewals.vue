<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Expired EPC Registrations</h1>
      <p class="text-sm text-gray-500 mb-4">Showing institutes fetched from the main list whose validity date has passed.</p>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-2"></span> <!-- Changed color -->
          Expired Found: {{ expiredInstitutes.length }}
        </span>
         <span v-if="isLoading" class="ml-4 text-sm text-blue-600">Loading...</span>
         <span v-if="!isLoading && allFetchedInstitutes.length > expiredInstitutes.length" class="ml-4 text-sm text-gray-500">
            ({{ allFetchedInstitutes.length - expiredInstitutes.length }} non-expired institutes hidden)
         </span>
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
                Applicant Name
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Course Title
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Last Status
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Expired On (Valid Till)
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loop over the computed filtered list: expiredInstitutes -->
            <tr v-for="institute in expiredInstitutes" :key="institute.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ institute.name_of_institution }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ institute.full_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ institute.title_of_course }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(institute.review_decision)">
                  {{ institute.review_decision || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                {{ formatDate(institute.valid_till) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <!-- *** Only the View button remains *** -->
                 <button @click="openModal(institute)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    View Details
                 </button>
              </td>
            </tr>
            <!-- Message when the *filtered* (expired) list is empty -->
            <tr v-if="!isLoading && expiredInstitutes.length === 0">
              <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                No expired institute registrations found in the list.
              </td>
            </tr>
             <!-- Message specifically when loading -->
             <tr v-if="isLoading">
               <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                 Loading institute list...
               </td>
             </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination (if needed) -->
    <div v-if="!isLoading && expiredInstitutes.length > 0"
      class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div class="text-sm text-gray-600">
        Showing {{ expiredInstitutes.length }} expired results
      </div>
    </div>

    <!-- Modal - Ensure it doesn't show Approve/Regret buttons or make them conditional -->
    <InstituteRenewalApplicationDetailsModal :is-open="isModalOpen" :application-details="selectedInstitute"
      @close-modal="closeModal"
       /> <!-- Removed approve/regret event handlers from modal call -->

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import InstituteRenewalApplicationDetailsModal from '../modals/InstituteRenewalApplicationDetailsModal.vue';
import apiService from '@/services/services';

const toast = useToast();

const allFetchedInstitutes = ref([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const selectedInstitute = ref({});

// --- Computed Property for Filtering EXPIRED Institutes ---
const expiredInstitutes = computed(() => {
    // ... (filtering logic remains the same) ...
    if (!Array.isArray(allFetchedInstitutes.value)) {
        return [];
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return allFetchedInstitutes.value.filter(institute => {
        if (!institute.valid_till) return false;
        try {
            const validTillDate = new Date(institute.valid_till);
            if (isNaN(validTillDate.getTime())) return false;
            validTillDate.setHours(0,0,0,0);
            return validTillDate < today; // Is expired
        } catch {
            return false;
        }
    });
});

// Fetch institutes on component mount
onMounted(async () => {
    await fetchInstitutes();
});

const fetchInstitutes = async () => {
    isLoading.value = true;
    allFetchedInstitutes.value = [];
    try {
        // Use the endpoint for the main institute list
        const response = await apiService.getEpcInstitutes(); // Ensure this method exists and is correct
        console.log('API Response (/epc-institutes/):', response);

        let rawData = [];
        if (response?.data?.results && Array.isArray(response.data.results)) {
            rawData = response.data.results;
        } else if (response?.data && Array.isArray(response.data)){
            rawData = response.data; // Handle case where data is directly the array
        }
         else {
            console.error('Unexpected API response format from /epc-institutes/:', response);
            toast.error('Unexpected data format received from server');
        }
        allFetchedInstitutes.value = rawData;
        console.log('Stored all fetched institutes:', allFetchedInstitutes.value.length);

    } catch (error) {
        console.error('Error fetching institutes list:', error);
        toast.error(`Failed to load institute list: ${error.message}`);
        allFetchedInstitutes.value = [];
    } finally {
        isLoading.value = false;
    }
};

const openModal = (institute) => {
    selectedInstitute.value = institute;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedInstitute.value = {};
};

const formatDate = (dateString) => {
    // ... (formatDate logic remains the same) ...
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
        return 'Invalid Date';
    }
};

// --- handleApprove and handleRegret methods are no longer needed by this component's template ---
// const handleApprove = async (institute) => { ... }; // Can be removed
// const handleRegret = async (institute) => { ... }; // Can be removed

// Get status class based on the last known review_decision
const getStatusClass = (status) => {
    // ... (getStatusClass logic remains the same) ...
    switch (status) {
        case 'Approved': return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
        case 'Regretted':
        case 'Rejected': // Handle both potential values if they exist in data
            return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
        case 'Pending':
        case 'Submitted': // Handle both potential values
             return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800';
        default:
            return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800';
    }
};

</script>