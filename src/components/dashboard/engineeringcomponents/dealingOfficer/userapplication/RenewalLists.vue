<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Renewal Applications</h1>
      <div class="flex flex-wrap items-center text-gray-600 gap-x-4 gap-y-2">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2 flex-shrink-0"></span>
          Total Matching: {{ filteredApplications.length }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-green-500 mr-2 flex-shrink-0"></span>
          Active: {{ activeCount }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2 flex-shrink-0"></span>
          Renewal Required: {{ renewalRequiredCount }}
        </span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-red-500 mr-2 flex-shrink-0"></span>
          Inactive (Expired): {{ inactiveCount }}
        </span>
      </div>
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <!-- Search Input -->
      <div class="relative">
        <input v-model.lazy.trim="searchQuery" type="text" placeholder="Search by name, CID or registration number..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <!-- Status Filter (for Registration Validity) -->
      <div class="flex gap-4">
        <select v-model="filterStatus"
          class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="all">All Validity Statuses</option>
          <option value="Active">Active</option>
          <option value="Renewal Required">Renewal Required</option>
          <option value="Inactive (Expired)">Inactive (Expired)</option>
          <option value="Unknown">Unknown/Error</option>
        </select>
         <button @click="resetFilters" title="Reset Filters"
            class="px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m-15.357-2a8.001 8.001 0 0115.357-2m0 0H15" />
             </svg>
         </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600 font-medium">Loading renewal applications...</p>
    </div>

    <!-- Error State -->
     <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm mb-6">
        <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
                <h3 class="text-lg font-semibold text-red-800">Error Loading Data</h3>
                <p class="text-red-700 mt-1">{{ error }}</p>
                <button @click="fetchApplications" class="mt-3 px-4 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Retry
                </button>
            </div>
        </div>
    </div>

    <!-- Table Section -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <!-- Using text-gray-600 and slightly bolder font -->
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reg. No.</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expiry Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reg. Validity</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Renewal App Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <!-- Empty State -->
             <tr v-if="!paginatedApplications.length">
                <td colspan="8" class="px-6 py-12 text-center">
                     <div class="flex flex-col items-center">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                           <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                         <p class="text-gray-500 font-medium">No renewal applications found.</p>
                         <p v-if="searchQuery || filterStatus !== 'all'" class="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
                         <button v-if="searchQuery || filterStatus !== 'all'" @click="resetFilters" class="mt-4 px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Clear Filters
                         </button>
                     </div>
                </td>
            </tr>
            <!-- Application Rows -->
            <tr v-for="app in paginatedApplications" :key="app.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                #{{ app.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                 <div class="flex items-center">
                   <!-- Avatar with Fallback -->
                   <div v-if="!app.passport_photo" class="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-semibold text-sm flex-shrink-0">
                      {{ getInitials(app.full_name) }}
                   </div>
                   <img v-else :src="app.passport_photo" @error="avatarError" class="h-9 w-9 rounded-full object-cover mr-3 flex-shrink-0" alt="Applicant Photo">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ app.full_name || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">{{ app.cid_no || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ app.registration_no || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(app.current_registration_expiry_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRegistrationValidityStatusClasses(getRegistrationValidityStatus(app))">
                  {{ getRegistrationValidityStatus(app) }}
                </span>
                <!-- Optional: Link to renew if expired -->
                <button v-if="getRegistrationValidityStatus(app) === 'Inactive (Expired)' || getRegistrationValidityStatus(app) === 'Renewal Required'"
                    @click="viewDetails(app)" title="View details to renew"
                    class="ml-2 text-xs text-blue-600 hover:underline focus:outline-none font-medium">
                    (Details)
                </button>
              </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span v-if="getRenewalApplicationStatus(app) !== 'Info Missing'" :class="getQualificationStatusClasses(getRenewalApplicationStatus(app))" class="px-2 py-1 rounded text-xs">
                    {{ getRenewalApplicationStatus(app) }}
                 </span>
                 <span v-else class="text-xs text-gray-400 italic">N/A</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(app.registration_date) }} <!-- Assuming registration_date is submission date -->
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="viewDetails(app)" title="View Application Details"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 inline-flex items-center text-xs">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  <!-- Add other action buttons if needed -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
       <div class="flex-1 flex justify-between sm:hidden">
           <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"> Previous </button>
           <button @click="nextPage" :disabled="currentPage === totalPages" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"> Next </button>
       </div>
       <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
           <div>
               <p class="text-sm text-gray-700">
                   Showing
                   <span class="font-medium">{{ paginationStart }}</span>
                   to
                   <span class="font-medium">{{ paginationEnd }}</span>
                   of
                   <span class="font-medium">{{ filteredApplications.length }}</span>
                   results
               </p>
           </div>
           <div>
               <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                   <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                       <span class="sr-only">Previous</span>
                       <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                   </button>
                    <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"> Page {{ currentPage }} of {{ totalPages }} </span>
                   <button @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                       <span class="sr-only">Next</span>
                       <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
                   </button>
               </nav>
           </div>
       </div>
    </div>

    <!-- Modal -->
    <ViewDetailsModal
        :isOpen="isModalOpen"
        :application="selectedApplication"
        @close="closeModal"
        @update="handleUpdate"
        :personnel-categories="personnelCategories"
        :personnel-subcategories="personnelSubcategories"
        :sectors="sectors" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiServices from '@/services/services'; // Adjust path if needed
import ViewDetailsModal from '../modals/ViewApplicationDetailsModal.vue'; // Adjust path if needed
import { useToast } from 'vue-toastification'; // Assuming you use vue-toastification

// --- Constants ---
const RENEWAL_WINDOW_DAYS = 30; // Renew within 30 days of expiry
const ITEMS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 300; // milliseconds for search debounce

// --- State ---
const applications = ref([]);
const filterStatus = ref('all'); // Filters by Registration Validity
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const currentPage = ref(1);
const isModalOpen = ref(false);
const selectedApplication = ref(null);
const personnelCategories = ref([]);
const personnelSubcategories = ref([]);
const sectors = ref([]);
const isLoading = ref(false);
const error = ref(null);
const toast = useToast();
let searchDebounceTimer = null;

// --- Helper Functions ---
const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
      // Attempt to create a valid date object
      const date = new Date(dateString);
      // Check if the date is valid after parsing
      if (isNaN(date.getTime())) {
          // Handle cases where dateString might be just year or invalid format
          if (/^\d{4}$/.test(dateString)) return dateString; // If only year, return it
          return 'Invalid Date';
      }
      return date.toLocaleDateString('en-GB', { // Use en-GB for dd/mm/yyyy or 'en-CA' for yyyy-mm-dd
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return 'Invalid Date';
  }
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ')
    .map(word => word.charAt(0))
    .filter(char => char.match(/[a-zA-Z]/)) // Ensure it's a letter
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const avatarError = (event) => {
    // Optional: Replace with a placeholder image or hide
    event.target.style.display = 'none';
    // Or: event.target.src = '/path/to/default/avatar.png';
};

// --- Core Status Logic ---
const getRegistrationValidityStatus = (app) => {
    // *** IMPORTANT: Adjust 'current_registration_expiry_date' if your API uses a different field name ***
    const expiryDateString = app.current_registration_expiry_date;

    if (!expiryDateString) {
        return 'Unknown'; // Expiry date missing from data
    }
    try {
        const today = getToday();
        const expiryDate = new Date(expiryDateString);
        expiryDate.setHours(0, 0, 0, 0);

        if (isNaN(expiryDate.getTime())) {
             return 'Invalid Date'; // Date string couldn't be parsed
        }

        if (expiryDate < today) {
            return 'Inactive (Expired)';
        } else {
            const renewalStartDate = new Date(expiryDate);
            renewalStartDate.setDate(expiryDate.getDate() - RENEWAL_WINDOW_DAYS);
            renewalStartDate.setHours(0,0,0,0);

            if (today >= renewalStartDate) {
                return 'Renewal Required';
            } else {
                return 'Active';
            }
        }
    } catch (e) {
        console.error("Error parsing expiry date:", expiryDateString, e);
        return 'Date Error'; // Error during date calculation
    }
};

const getRenewalApplicationStatus = (app) => {
    // This checks the status of the *renewal request itself* based on qualification endorsement
    const primaryQualification = app.user_qualifications?.find(q => q.is_primary_qualification);
    if (primaryQualification && primaryQualification.endorsement_decision) {
        return primaryQualification.endorsement_decision; // Should be 'Pending', 'Approved', 'Regretted'
    }
    // Fallback if qualification or decision is missing in the renewal data
    return 'Info Missing';
};

// --- Styling Logic ---
const getRegistrationValidityStatusClasses = (status) => {
    return [
        'px-3 py-1 rounded-full text-xs font-semibold inline-block', // Use font-semibold for better visibility
        {
            'bg-green-100 text-green-700': status === 'Active',
            'bg-yellow-100 text-yellow-700': status === 'Renewal Required',
            'bg-red-100 text-red-700': status === 'Inactive (Expired)',
            'bg-gray-100 text-gray-600': ['Unknown', 'Invalid Date', 'Date Error'].includes(status),
        }
    ];
};

const getQualificationStatusClasses = (status) => {
  // Styles for the renewal application's own status (Pending, Approved, Regretted)
  return {
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-red-100 text-red-800': status === 'Regretted',
    'bg-gray-100 text-gray-700': status === 'Info Missing' // Style for missing info case
  };
};

// --- Computed Properties ---
const filteredApplications = computed(() => {
  // Start with all fetched applications
  let filtered = [...applications.value];

  // Apply Validity Status Filter
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(app => getRegistrationValidityStatus(app) === filterStatus.value);
  }

  const query = debouncedSearchQuery.value.toLowerCase();
  if (query) {
    filtered = filtered.filter(app =>
      (app.full_name?.toLowerCase().includes(query)) ||
      (app.cid_no?.toLowerCase().includes(query)) ||
      (app.registration_no?.toLowerCase().includes(query))
    );
  }

  return filtered;
});

const totalPages = computed(() => {
  return Math.ceil(filteredApplications.value.length / ITEMS_PER_PAGE);
});

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return filteredApplications.value.slice(start, end);
});

const paginationStart = computed(() => {
  if (filteredApplications.value.length === 0) return 0;
  return ((currentPage.value - 1) * ITEMS_PER_PAGE) + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * ITEMS_PER_PAGE, filteredApplications.value.length);
});

// Counts for the header based on the *currently filtered* list
const activeCount = computed(() => {
  return filteredApplications.value.filter(app => getRegistrationValidityStatus(app) === 'Active').length;
});
const inactiveCount = computed(() => {
  return filteredApplications.value.filter(app => getRegistrationValidityStatus(app) === 'Inactive (Expired)').length;
});
const renewalRequiredCount = computed(() => {
    return filteredApplications.value.filter(app => getRegistrationValidityStatus(app) === 'Renewal Required').length;
});
// --- Watchers ---
// Reset to page 1 when filters change
watch(filterStatus, () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1;
  }
});

// Debounce search query
watch(searchQuery, (newVal) => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    debouncedSearchQuery.value = newVal;
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
  }, DEBOUNCE_DELAY);
});

// --- API Interaction ---
const fetchMasterData = async () => {
  // Assuming these don't change often, fetch once
  try {
    const [categoriesRes, subcategoriesRes, sectorsRes] = await Promise.all([
      apiServices.getMastersPersonnelCategories(),
      apiServices.getMastersSubCategories(),
      apiServices.getMastersSectors(),
    ]);
    personnelCategories.value = categoriesRes.data.results || [];
    personnelSubcategories.value = subcategoriesRes.data.results || [];
    sectors.value = sectorsRes.data.results || [];
  } catch (error) {
    console.error('Error fetching master data:', error);
    toast.error('Failed to load necessary master data.');
    // Handle master data loading failure if critical
  }
};

const fetchApplications = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // *** USE THE CORRECT RENEWALS ENDPOINT ***
    const response = await apiServices.getEpcRenewals();

    console.log("API Response from getEpcRenewals:", response.data); // DEBUG: Check response structure

    applications.value = response.data.results || response.data || [];

    // *** DEBUG: Check if the crucial expiry date field exists ***
    if (applications.value.length > 0) {
         const firstApp = applications.value[0];
         console.log("First application record:", firstApp);
         // *** REPLACE 'current_registration_expiry_date' with the ACTUAL field name from your API ***
         if (!Object.hasOwn(firstApp, 'current_registration_expiry_date')) {
             console.warn("WARNING: 'current_registration_expiry_date' field NOT FOUND in API response. Status logic will fail.");
             toast.warning("Expiry date missing from API data. Validity status may be incorrect.", { timeout: 7000 });
             error.value = "API Response is missing the required registration expiry date field."; // Show error to user
         }
     }

  } catch (err) {
    console.error('Error fetching renewal applications:', err);
    const errorMsg = err.response?.data?.detail || err.message || 'An unknown error occurred.';
    error.value = `Failed to load renewal applications: ${errorMsg}`;
    applications.value = [];
    toast.error(`Error loading applications: ${errorMsg}`);
  } finally {
      isLoading.value = false;
  }
};

// --- Modal and Actions ---
const viewDetails = (application) => {
  // Pass necessary data to the modal
  // You might fetch full user details here if needed, or rely on modal to do it
  selectedApplication.value = {
      ...application,
      // Pass calculated statuses if the modal needs them pre-calculated
      registrationValidity: getRegistrationValidityStatus(application),
      renewalApplicationStatus: getRenewalApplicationStatus(application),
  };
  isModalOpen.value = true;
};

const handleUpdate = async () => {
  // Called when modal successfully updates an application
  closeModal();
  toast.success('Application updated successfully');
  // Refetch data to show changes
  await fetchApplications();
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

const resetFilters = () => {
    searchQuery.value = '';
    filterStatus.value = 'all';
    currentPage.value = 1; // Optionally reset page
};

// --- Pagination ---
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// --- Lifecycle ---
onMounted(async () => {
  await fetchMasterData(); // Fetch master data first or in parallel
  await fetchApplications();
});

</script>

<style scoped>
/* Optional: Add specific styles if needed */
tbody tr:hover {
    background-color: #f9fafb; /* Tailwind gray-50 */
}

/* Improve focus visibility for accessibility */
select:focus, input:focus, button:focus-visible {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px var(--tw-ring-color); /* Ensure ring color is set */
    --tw-ring-color: #3b82f6; /* blue-500 */
}

/* Style disabled pagination buttons */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>