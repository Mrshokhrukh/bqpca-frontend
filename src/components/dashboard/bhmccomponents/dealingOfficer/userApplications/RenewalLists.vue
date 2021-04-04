<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Renewal Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total Matches: {{ filteredCombinedData.length }}
        </span>
        <span class="mx-4">|</span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          Pending: {{ pendingCount }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="relative">
        <input v-model="searchQuery" type="text" placeholder="Search by name, CID or registration number..."
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
          <option value="Regretted">Regretted</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reg. No.</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Primary
                Qualification</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Renewal
                Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Original
                Expiry</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="item in paginatedCombinedData" :key="item.renewal_id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ item.renewal_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <span class="text-gray-600 text-xs">{{ getInitials(item) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ item.full_name }}</div>
                    <div class="text-sm text-gray-500">{{ item.cid_no }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.registration_no }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <template v-if="getPrimaryQualification(item)">
                  {{ getPrimaryQualification(item).qualification_name_display || 'N/A' }}
                </template>
                <template v-else>
                  N/A
                </template>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRenewalStatusClasses(item)">
                  {{ getRenewalStatus(item) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(item.expiry_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="viewDetails(item)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">View</button>
                </div>
              </td>
            </tr>
            <tr v-if="!isLoading && paginatedCombinedData.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                {{ 'No renewal applications found that match your criteria' }}
              </td>
            </tr>
            <tr v-if="isLoading">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                Loading renewal application data...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="!isLoading && filteredCombinedData.length > itemsPerPage"
      class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          Previous
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          Next
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ paginationStart }}</span>
            to
            <span class="font-medium">{{ paginationEnd }}</span>
            of
            <span class="font-medium">{{ filteredCombinedData.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <span
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <RenewalDetailsModal :is-open="isModalOpen" :application="selectedItem" @close="closeModal" @update="handleUpdate"
      :personnel-categories="personnelCategories" :personnel-subcategories="personnelSubcategories"
      :sectors="sectors" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiServices from '@/services/services'; // Adjust path if needed
import RenewalDetailsModal from '../modals/RenewalDetailsModal.vue'; // Adjust path if needed
import { useToast } from 'vue-toastification';

// --- State ---
const renewals = ref([]); // Raw data from /mhpc-renewals/
const qualificationsData = ref([]); // Raw data from /mhpc-new-qualification/
const filterStatus = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isModalOpen = ref(false);
// selectedItem holds the combined object for the modal
const selectedItem = ref(null);
const personnelCategories = ref([]);
const personnelSubcategories = ref([]);
const sectors = ref([]);
const toast = useToast();
// isLoading now tracks the combined loading state
const isLoading = ref(true);
const isFetchingRenewals = ref(false);
const isFetchingQualifications = ref(false);

// --- Watchers ---
watch([searchQuery, filterStatus], () => {
  currentPage.value = 1;
});

// Combined loading state watcher
watch([isFetchingRenewals, isFetchingQualifications], ([renewing, qualifying]) => {
  isLoading.value = renewing || qualifying;
});


// --- Computed Properties ---

// Map for quick lookup of qualification/application data by ID
const qualificationMap = computed(() => {
  const map = {};
  if (Array.isArray(qualificationsData.value)) {
    qualificationsData.value.forEach(qual => {
      if (qual && qual.id != null) {
        map[qual.id] = qual;
      }
    });
  }
  return map;
});

// 1. Combine renewal data with qualification data
const combinedData = computed(() => {
  if (!Array.isArray(renewals.value)) return [];

  return renewals.value.map(renewal => {
    const qualification = qualificationMap.value[renewal.user_qualification];
    // Create a combined object
    return {
      // Renewal fields
      renewal_id: renewal.id,
      renewal_status: renewal.renewal_endorsement_decision || 'Pending',
      new_expiry_date: renewal.new_expiry_date,
      renewal_review_status: renewal.renewal_review_status,
      renewal_review_remarks: renewal.renewal_review_remarks,
      endorsement_remarks: renewal.endorsement_remarks,
      created_at: renewal.created_at,

      // Qualification/Application fields (use defaults if lookup failed)
      // IMPORTANT: Verify these field names against your actual API response for qualificationsData
      application_id: qualification?.id ?? null,
      full_name: qualification?.full_name || 'N/A',
      cid_no: qualification?.cid_no || 'N/A',
      registration_no: qualification?.registration_no || 'N/A',
      expiry_date: qualification?.expiry_date || null, // Original expiry date
      // Assuming 'user_qualifications' is the field containing the array for display purposes
      user_qualifications: qualification?.user_qualifications || [],
      // Add other fields from 'qualification' if needed by template/modal/helpers
    };
  });
});

// 2. Filter the combined data
const filteredCombinedData = computed(() => {
  if (!Array.isArray(combinedData.value)) return [];

  return combinedData.value.filter(item => {
    // Filter by status
    if (filterStatus.value !== 'all') {
      if (item.renewal_status !== filterStatus.value) return false;
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const name = (item.full_name || '').toLowerCase();
      const cid = (item.cid_no || '').toLowerCase();
      const regNo = (item.registration_no || '').toLowerCase();

      const nameMatch = name !== 'n/a' && name.includes(query);
      const cidMatch = cid !== 'n/a' && cid.includes(query);
      const regNoMatch = regNo !== 'n/a' && regNo.includes(query);

      if (!(nameMatch || cidMatch || regNoMatch)) {
        if (query === 'n/a' && (item.full_name === 'N/A' || item.cid_no === 'N/A' || item.registration_no === 'N/A')) {
          return true;
        }
        return false;
      }
    }
    return true; // Passed filters
  });
});

// 3. Paginate the filtered data
const paginatedCombinedData = computed(() => {
  if (!Array.isArray(filteredCombinedData.value)) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCombinedData.value.slice(start, end);
});


// --- Other Computed Properties (Counts, Pagination Info) ---

const pendingCount = computed(() => {
  return filteredCombinedData.value.filter(item => item.renewal_status === 'Pending').length;
});

const totalPages = computed(() => {
  if (!Array.isArray(filteredCombinedData.value)) return 1;
  return Math.max(1, Math.ceil(filteredCombinedData.value.length / itemsPerPage));
});

const paginationStart = computed(() => {
  if (!Array.isArray(filteredCombinedData.value) || filteredCombinedData.value.length === 0) return 0;
  return ((currentPage.value - 1) * itemsPerPage) + 1;
});

const paginationEnd = computed(() => {
  if (!Array.isArray(filteredCombinedData.value)) return 0;
  return Math.min(currentPage.value * itemsPerPage, filteredCombinedData.value.length);
});


// --- Methods ---

// Helper functions operate on the 'item' (combined object)
const getPrimaryQualification = (item) => {
  if (Array.isArray(item.user_qualifications) && item.user_qualifications.length > 0) {
    return item.user_qualifications.find(q => q.is_primary_qualification);
  }
  return null;
};

const getInitials = (item) => {
  const name = item.full_name;
  if (!name || name === 'N/A') return '?';
  return name
    .split(' ')
    .map(word => word?.[0] || '')
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getRenewalStatus = (item) => {
  return item.renewal_status || 'Pending';
};

const getRenewalStatusClasses = (item) => {
  const status = getRenewalStatus(item);
  return [
    'px-3 py-1 rounded-full text-xs font-medium inline-block',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Regretted',
      'bg-gray-100 text-gray-800': !['Pending', 'Approved', 'Regretted'].includes(status)
    }
  ];
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch {
    return 'N/A';
  }
};

// Fetch Master Data
const fetchMasterData = async () => {
  try {
    const responses = await Promise.allSettled([
      apiServices.getMastersPersonnelCategories(),
      apiServices.getMastersSubCategories(),
      apiServices.getMastersSectors(),
    ]);
    if (responses[0].status === 'fulfilled' && responses[0].value.data) { personnelCategories.value = responses[0].value.data.results || responses[0].value.data || []; } else { console.error('Failed fetch personnel categories:', responses[0].reason); }
    if (responses[1].status === 'fulfilled' && responses[1].value.data) { personnelSubcategories.value = responses[1].value.data.results || responses[1].value.data || []; } else { console.error('Failed fetch personnel subcategories:', responses[1].reason); }
    if (responses[2].status === 'fulfilled' && responses[2].value.data) { sectors.value = responses[2].value.data.results || responses[2].value.data || []; } else { console.error('Failed fetch sectors:', responses[2].reason); }
  } catch (error) {
    console.error('Error fetching master data container:', error);
    toast.error('Failed to load master data');
  }
};

// Fetch Renewals
const fetchRenewals = async () => {
  isFetchingRenewals.value = true;
  renewals.value = [];
  try {
    const response = await apiServices.getMhpcRenewals();
    if (response.data && Array.isArray(response.data.results)) {
      renewals.value = response.data.results;
    } else if (Array.isArray(response.data)) {
      renewals.value = response.data;
    } else {
      console.error("Unexpected API response structure for renewals:", response.data);
      toast.error('Received invalid renewal data structure.');
    }
  } catch (error) {
    console.error('Error fetching renewals:', error);
    const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
    toast.error(`Failed to load renewal data: ${errorMsg}`);
  } finally {
    isFetchingRenewals.value = false;
  }
};

// Fetch Qualifications/Application Details
const fetchQualifications = async () => {
  isFetchingQualifications.value = true;
  qualificationsData.value = [];
  try {
    // IMPORTANT: Verify getMhpcNewQualifications fetches the needed list/details
    const response = await apiServices.getMhpcNewQualifications();
    if (response.data && Array.isArray(response.data.results)) {
      qualificationsData.value = response.data.results;
    } else if (Array.isArray(response.data)) {
      qualificationsData.value = response.data;
    } else {
      console.error("Unexpected API response structure for qualifications:", response.data);
      toast.error('Received invalid qualification data structure.');
    }
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
    toast.error(`Failed to load qualification/application details: ${errorMsg}`);
  } finally {
    isFetchingQualifications.value = false;
  }
};


// View Details passes the combined item
const viewDetails = (item) => {
  selectedItem.value = JSON.parse(JSON.stringify(item));
  isModalOpen.value = true;
};

// Handle Update needs to refetch both lists potentially
const handleUpdate = async () => {
  isLoading.value = true; // Show loading indicator during refetch
  await Promise.allSettled([
    fetchRenewals(),
    fetchQualifications()
  ]);
  closeModal();
  toast.success('Renewal application processed successfully');
  // isLoading will update via watcher
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedItem.value = null;
};

// Pagination methods
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  isLoading.value = true;
  await Promise.allSettled([
    fetchMasterData(),
    fetchRenewals(),
    fetchQualifications()
  ]);
  // isLoading will update via watcher
});
</script>

<style scoped>
/* Component-specific styles */
td .flex {
  flex-wrap: nowrap;
}
</style>
