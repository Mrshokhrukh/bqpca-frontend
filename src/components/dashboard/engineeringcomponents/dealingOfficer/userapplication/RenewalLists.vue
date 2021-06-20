<template>
  <div class="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <DOPageHeader 
      title="EPC Renewal Applications" 
      :description="headerDescription" 
      :search-query="searchQuery"
      @update:searchQuery="handleSearchUpdate" 
      search-placeholder="Search by name, CID or registration number..."
      :filter-value="filterStatus" 
      @update:filterValue="handleFilterUpdate" 
      :filter-options="statusFilterOptions" 
    />

    <!-- Main Content -->
    <div class="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Error State -->
      <div v-if="dataState.error && !dataState.isLoading" class="p-8 text-center">
        <div class="text-red-600 mb-4">
          <svg class="mx-auto h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Failed to Load Data</h3>
        <p class="text-gray-600 mb-4">{{ dataState.error?.message || 'An error occurred while loading renewal applications.' }}</p>
        <button 
          @click="retryDataFetch"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry
        </button>
      </div>

      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th 
                v-for="header in tableHeaders" 
                :key="header"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          
          <!-- Loading State -->
          <tbody v-if="dataState.isLoading">
            <tr>
              <td :colspan="tableHeaders.length" class="px-6 py-16 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <div class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                  <p class="font-medium text-lg">Loading renewal applications...</p>
                  <p class="text-sm text-gray-400 mt-1">Please wait while we fetch the latest data</p>
                </div>
              </td>
            </tr>
          </tbody>
          
          <!-- Data Rows -->
          <tbody v-else-if="paginatedData.length > 0" class="divide-y divide-gray-200 bg-white">
            <tr 
              v-for="item in paginatedData" 
              :key="`renewal-${item.renewal_id}`" 
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                #{{ item.renewal_id }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div 
                    v-if="!item.passport_photo"
                    class="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 flex-shrink-0 font-semibold text-sm"
                  >
                    {{ getInitials(item.full_name) }}
                  </div>
                  <img 
                    v-else 
                    :src="item.passport_photo" 
                    @error="handleAvatarError"
                    :alt="`${item.full_name} photo`"
                    class="h-10 w-10 rounded-full object-cover mr-3 flex-shrink-0" 
                  />
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-medium text-gray-900 truncate">{{ item.full_name }}</div>
                    <div class="text-xs text-gray-500">{{ item.cid_no }}</div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ item.registration_no }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <span class="truncate max-w-xs block" :title="item.primary_qualification">
                  {{ item.primary_qualification || 'N/A' }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(item.application_date) }}
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClasses(item.renewal_status)">
                  {{ item.renewal_status }}
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span :class="{ 'text-red-600 font-medium': isExpired(item.original_expiry_date) }">
                  {{ formatDate(item.original_expiry_date) }}
                  <span v-if="isExpired(item.original_expiry_date)" class="text-xs block">Expired</span>
                </span>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="openRenewalModal(item)"
                  :disabled="modalState.isProcessing"
                  class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg shadow-sm transition-all duration-200 text-xs inline-flex items-center focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ modalState.isProcessing ? 'Loading...' : 'View Details' }}
                </button>
              </td>
            </tr>
          </tbody>
          
          <!-- Empty State -->
          <tbody v-else>
            <tr>
              <td :colspan="tableHeaders.length" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center justify-center">
                  <svg class="h-12 w-12 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">No renewal applications found</h3>
                  <p class="text-gray-500 max-w-md">
                    {{ hasActiveFilters ? 'Try adjusting your search criteria or filters.' : 'No renewal applications have been submitted yet.' }}
                  </p>
                  <button 
                    v-if="hasActiveFilters"
                    @click="clearFilters"
                    class="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!dataState.isLoading && !dataState.error && paginationInfo.totalPages > 1" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing <span class="font-medium">{{ paginationInfo.start }}</span> to 
        <span class="font-medium">{{ paginationInfo.end }}</span> of 
        <span class="font-medium">{{ filteredData.length }}</span> results
      </div>
      
      <div class="flex items-center space-x-2">
        <button 
          @click="goToPreviousPage" 
          :disabled="paginationInfo.currentPage === 1"
          class="px-3 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
        >
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span class="text-sm px-2">
          Page {{ paginationInfo.currentPage }} of {{ paginationInfo.totalPages }}
        </span>
        
        <button 
          @click="goToNextPage" 
          :disabled="paginationInfo.currentPage === paginationInfo.totalPages"
          class="px-3 py-2 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500"
        >
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal -->
    <RenewalDetailsModal 
      :is-open="modalState.isOpen" 
      :renewal-data="modalState.selectedItem" 
      @close="closeRenewalModal" 
      @update="handleRenewalUpdate"
      @after-leave="handleModalAfterLeave"
      :personnel-categories="masterData.personnelCategories"
      :personnel-subcategories="masterData.personnelSubcategories" 
      :sectors="masterData.sectors" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, reactive, nextTick } from 'vue';
import apiServices from '@/services/services';
import RenewalDetailsModal from '../modals/RenewalDetailsModal.vue';
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue';
import { useToast } from 'vue-toastification';
import dayjs from 'dayjs';

// Constants
const ITEMS_PER_PAGE = 10;
const TABLE_HEADERS = ['ID', 'Applicant', 'Reg. No.', 'Primary Qualification', 'Applied On', 'Status', 'Original Expiry', 'Actions'];
const STATUS_FILTER_OPTIONS = [
  { value: 'all', text: 'All Statuses' },
  { value: 'Pending', text: 'Pending' },
  { value: 'Approved', text: 'Approved' },
  { value: 'Regretted', text: 'Regretted' }
];

// Services
const toast = useToast();

// Reactive state
const searchQuery = ref('');
const filterStatus = ref('all');
const currentPage = ref(1);

// Data state
const dataState = reactive({
  renewals: [],
  applicationsMap: {},
  isLoading: false,
  error: null,
  lastFetch: null
});

// Master data state
const masterData = reactive({
  personnelCategories: [],
  personnelSubcategories: [],
  sectors: [],
  isLoading: false,
  error: null
});

// Modal state
const modalState = reactive({
  isOpen: false,
  selectedItem: null,
  isProcessing: false
});

// Computed properties
const tableHeaders = computed(() => TABLE_HEADERS);
const statusFilterOptions = computed(() => STATUS_FILTER_OPTIONS);

const combinedData = computed(() => {
  if (dataState.isLoading || dataState.error || !dataState.renewals?.length) return [];
  
  return dataState.renewals.map(renewal => {
    if (!renewal?.id) return null;
    
    const qualification = dataState.applicationsMap[renewal.user_qualification] || {};
    const appInfo = qualification.application_info || {};
    
    return {
      renewal_id: renewal.id,
      renewal_status: renewal.renewal_endorsement_decision || 'Pending',
      renewal_review_status: renewal.renewal_review_status,
      renewal_review_remarks: renewal.renewal_review_remarks,
      new_expiry_date: renewal.new_expiry_date,
      endorsement_remarks: renewal.endorsement_remarks,
      application_date: renewal.created_at,
      application_id: appInfo.id,
      full_name: appInfo.full_name || 'N/A',
      cid_no: appInfo.cid_no || 'N/A',
      registration_no: appInfo.registration_no || 'N/A',
      original_expiry_date: appInfo.expiry_date,
      registration_date: appInfo.registration_date,
      passport_photo: appInfo.passport_photo,
      primary_qualification: qualification.qualification_name_display || 'N/A',
      user_qualifications: qualification.id ? [qualification] : [],
      original_renewal: renewal,
      original_qualification: qualification,
      // Additional computed fields
      payment_status: renewal.payment_status,
      payment_status_display: renewal.payment_status_display,
      payment_id: renewal.payment_id,
      renewal_fee_amount: renewal.renewal_fee_amount
    };
  }).filter(Boolean).sort((a, b) => new Date(b.application_date) - new Date(a.application_date));
});

const filteredData = computed(() => {
  let data = combinedData.value;
  
  // Apply status filter
  if (filterStatus.value !== 'all') {
    data = data.filter(item => item.renewal_status === filterStatus.value);
  }
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    data = data.filter(item => 
      item.full_name.toLowerCase().includes(query) ||
      item.cid_no.toLowerCase().includes(query) ||
      item.registration_no.toLowerCase().includes(query)
    );
  }
  
  return data;
});

const hasActiveFilters = computed(() => {
  return filterStatus.value !== 'all' || searchQuery.value.trim().length > 0;
});

const headerDescription = computed(() => {
  const total = combinedData.value.length;
  const pending = combinedData.value.filter(item => item.renewal_status === 'Pending').length;
  const approved = combinedData.value.filter(item => item.renewal_status === 'Approved').length;
  
  return `Total: ${total} | Pending: ${pending} | Approved: ${approved}`;
});

// Pagination
const paginationInfo = computed(() => {
  const totalItems = filteredData.value.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const start = totalItems ? (currentPage.value - 1) * ITEMS_PER_PAGE + 1 : 0;
  const end = Math.min(currentPage.value * ITEMS_PER_PAGE, totalItems);
  
  return {
    currentPage: currentPage.value,
    totalPages,
    totalItems,
    start,
    end
  };
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return filteredData.value.slice(start, end);
});

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return dayjs(dateString).format('MMM D, YYYY');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

const isExpired = (dateString) => {
  if (!dateString) return false;
  try {
    return dayjs(dateString).isBefore(dayjs(), 'day');
  } catch (error) {
    return false;
  }
};

const getInitials = (name) => {
  if (!name || name === 'N/A') return '?';
  try {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  } catch (error) {
    return '?';
  }
};

const getStatusBadgeClasses = (status) => {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium inline-block';
  const statusClasses = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Regretted': 'bg-red-100 text-red-800',
    'Rejected': 'bg-red-100 text-red-800'
  };
  
  return `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`;
};

const handleAvatarError = (event) => {
  // Hide broken image and let the initials div show instead
  event.target.style.display = 'none';
};

// Data fetching functions
const fetchMasterData = async () => {
  if (masterData.isLoading) return;
  
  masterData.isLoading = true;
  masterData.error = null;
  
  try {
    const [categoriesResponse, subcategoriesResponse, sectorsResponse] = await Promise.all([
      apiServices.getEpcMastersPersonnelCategories(),
      apiServices.getEpcMastersSubCategories(),
      apiServices.getEpcMastersSectors()
    ]);
    
    masterData.personnelCategories = categoriesResponse?.data?.results ?? [];
    masterData.personnelSubcategories = subcategoriesResponse?.data?.results ?? [];
    masterData.sectors = sectorsResponse?.data?.results ?? [];
  } catch (error) {
    console.error('Error fetching master data:', error);
    masterData.error = error;
    toast.error('Failed to load master data. Some features may not work correctly.');
  } finally {
    masterData.isLoading = false;
  }
};

const fetchApplicationData = async () => {
  if (dataState.isLoading) return;
  
  dataState.isLoading = true;
  dataState.error = null;
  
  try {
    const [renewalResponse, applicationsResponse] = await Promise.all([
      apiServices.getEpcRenewals(),
      apiServices.getEpcNewApplications()
    ]);
    
    // Process renewals
    dataState.renewals = renewalResponse?.data?.results ?? [];
    
    // Build applications map
    const appMap = {};
    const applications = applicationsResponse?.data?.results ?? [];
    
    applications.forEach(app => {
      if (app.user_qualifications?.length > 0) {
        app.user_qualifications.forEach(qual => {
          if (qual?.id != null) {
            appMap[qual.id] = {
              ...qual,
              application_info: {
                id: app.id,
                full_name: app.full_name,
                cid_no: app.cid_no,
                registration_no: app.registration_no,
                passport_photo: app.passport_photo,
                expiry_date: app.expiry_date,
                registration_date: app.registration_date
              }
            };
          }
        });
      }
    });
    
    dataState.applicationsMap = appMap;
    dataState.lastFetch = new Date();
    
  } catch (error) {
    console.error('Error fetching application data:', error);
    dataState.error = error;
    toast.error('Failed to load renewal applications. Please try again.');
  } finally {
    dataState.isLoading = false;
  }
};

const fetchAllData = async () => {
  await Promise.all([
    fetchMasterData(),
    fetchApplicationData()
  ]);
};

const retryDataFetch = () => {
  fetchAllData();
};

// Event handlers
let searchTimeout = null;

const handleSearchUpdate = (value) => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Debounce search updates
  searchTimeout = setTimeout(() => {
    searchQuery.value = value;
  }, 300);
};

const handleFilterUpdate = (value) => {
  filterStatus.value = value;
};

const clearFilters = () => {
  searchQuery.value = '';
  filterStatus.value = 'all';
  currentPage.value = 1;
};

const goToNextPage = () => {
  if (currentPage.value < paginationInfo.value.totalPages) {
    currentPage.value++;
  }
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Modal handlers
const openRenewalModal = (item) => {
  if (modalState.isProcessing) return;
  
  modalState.selectedItem = item;
  modalState.isOpen = true;
};

const closeRenewalModal = () => {
  if (modalState.isProcessing) return;
  
  modalState.isOpen = false;
  // Don't clear selectedItem here - let the modal transition complete first
};

const handleModalAfterLeave = () => {
  // Clear the selected item after modal transition completes
  nextTick(() => {
    modalState.selectedItem = null;
    modalState.isProcessing = false;
  });
};

const handleRenewalUpdate = async () => {
  modalState.isProcessing = true;
  
  try {
    // Show success message
    toast.success('Renewal application processed successfully!');
    
    // The modal will auto-close via the child component
    // Just refresh the data here
    await fetchApplicationData();
    
  } catch (error) {
    console.error('Error handling renewal update:', error);
    toast.error('Failed to refresh data after update.');
  } finally {
    modalState.isProcessing = false;
  }
};

// Watchers
watch([searchQuery, filterStatus], () => {
  // Reset to first page when filters change
  currentPage.value = 1;
});

// Lifecycle
onMounted(() => {
  fetchAllData();
});

onUnmounted(() => {
  // Clear search timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>

<style scoped>
/* Ensure table cells are properly aligned */
th,
td {
  vertical-align: middle;
}

/* Prevent flex items from wrapping */
td .flex {
  flex-wrap: nowrap;
}

/* Improve focus indicators */
button:focus,
select:focus,
input:focus {
  outline: none;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive table improvements */
@media (max-width: 768px) {
  .overflow-x-auto {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  }
  
  .overflow-x-auto::-webkit-scrollbar {
    height: 6px;
  }
  
  .overflow-x-auto::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
}
</style>