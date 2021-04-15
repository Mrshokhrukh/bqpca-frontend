<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Additional Qualification Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ filteredApplications.length }} </span>
        <span class="mx-4">|</span>
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          Pending: {{ pendingCount }} </span>
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
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registration
                No.</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Primary
                Qualification</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Additional
                Qualification(s)</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-if="paginatedApplications.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                No applications found matching your criteria.
              </td>
            </tr>
            <tr v-for="app in paginatedApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ app.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="app.passport_photo || 'https://placehold.co/32x32/EFEFEF/AAAAAA?text=N/A'"
                    alt="Applicant photo" class="h-8 w-8 rounded-full object-cover mr-3"
                    onerror="this.src='https://placehold.co/32x32/EFEFEF/AAAAAA?text=N/A'">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ app.full_name || 'N/A' }}</div>
                    <div class="text-sm text-gray-500">{{ app.cid_no || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ app.registration_no || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <template v-if="app.user_qualifications?.some(q => q.is_primary_qualification)">
                  <div v-for="qualification in app.user_qualifications.filter(q => q.is_primary_qualification)"
                    :key="'primary-' + qualification.id">
                    <span class="text-xs text-gray-600">{{ qualification.qualification_name_display || 'N/A' }}</span>
                  </div>
                </template>
                <template v-else>
                  <div class="text-xs text-orange-500">
                    <span class="font-medium">⚠️</span> No Primary Found
                  </div>
                </template>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <template v-if="app.user_qualifications?.some(q => !q.is_primary_qualification)">
                  <div v-for="qualification in app.user_qualifications.filter(q => !q.is_primary_qualification)"
                    :key="'additional-' + qualification.id" class="mb-1 last:mb-0">
                    <span :class="getQualificationStatusClasses(qualification)" class="px-2 py-1 rounded text-xs">
                      {{ getIndividualQualificationStatus(qualification) }}
                    </span>
                    <span class="text-xs text-gray-600 ml-1">({{ qualification.qualification_name_display || 'N/A'
                      }})</span>
                  </div>
                </template>
                <template v-else>
                  N/A
                </template>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(app)">
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

    <div class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
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
            <button @click="prevPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-opacity">
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
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-opacity">
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
      <div class="sm:hidden flex-1 flex justify-between">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          Previous
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          Next
        </button>
      </div>
    </div>

    <ViewDetailsModal :isOpen="isModalOpen" :application="selectedApplication" @close="closeModal"
      @update="handleUpdate" :personnel-categories="personnelCategories"
      :personnel-subcategories="personnelSubcategories" :sectors="sectors" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiServices from '@/services/services'; // Assuming this path is correct
import ViewDetailsModal from '../modals/ViewApplicationDetailsModal.vue'; // Assuming this path is correct
import { useToast } from 'vue-toastification';

// --- Reactive State ---
const applications = ref([]); // Raw data from API
const filterStatus = ref('all'); // Filter dropdown state
const searchQuery = ref(''); // Search input state
const currentPage = ref(1); // Current page for pagination
const itemsPerPage = 10; // Number of items per page
const isModalOpen = ref(false); // Modal visibility state
const selectedApplication = ref(null); // Data for the modal
const personnelCategories = ref([]); // Master data
const personnelSubcategories = ref([]); // Master data
const sectors = ref([]); // Master data
const toast = useToast(); // Toast notification system

// --- Computed Properties ---

// Filter applications based on the criteria for this specific page
const filteredApplications = computed(() => {
  return applications.value
    // 1. CORE FILTER: Include only applications that have at least one non-primary qualification
    .filter(app => app.user_qualifications?.some(q => q.is_primary_qualification === false))
    // 2. Filter by selected status (uses getStatus which checks additional qualifications)
    .filter(app => {
      // Reset to page 1 when filters change
      // Note: This might ideally be handled by a watcher, but included here for simplicity
      // if (filterStatus.value !== 'all') currentPage.value = 1; // Reset page on status filter change

      if (filterStatus.value !== 'all') {
        return getStatus(app) === filterStatus.value;
      }
      return true; // No status filter applied
    })
    // 3. Filter by search query (checks name, CID, registration number)
    .filter(app => {
      // Reset page on search change
      // if (searchQuery.value) currentPage.value = 1; // Reset page on search

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        return (
          app.full_name?.toLowerCase().includes(query) ||
          app.cid_no?.toLowerCase().includes(query) ||
          app.registration_no?.toLowerCase().includes(query)
        );
      }
      return true; // No search query applied
    });
});

// Calculate applications to display on the current page
const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredApplications.value.slice(start, end);
});

// Calculate total number of pages needed
const totalPages = computed(() => {
  // Ensure at least 1 page even if no results
  return Math.max(1, Math.ceil(filteredApplications.value.length / itemsPerPage));
});

// Calculate the starting item number for the current page display
const paginationStart = computed(() => {
  if (filteredApplications.value.length === 0) return 0;
  return ((currentPage.value - 1) * itemsPerPage) + 1;
});

// Calculate the ending item number for the current page display
const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredApplications.value.length);
});

// Calculate count of pending applications based on the additional qualification status
const pendingCount = computed(() => {
  return filteredApplications.value.filter(app => getStatus(app) === 'Pending').length;
});

// --- Watchers ---
// Watch for changes in filters or search query to reset to page 1
watch([filterStatus, searchQuery], () => {
  currentPage.value = 1;
});


// --- Methods ---

// Determines the overall status of the application based on its *additional* qualifications
const getStatus = (app) => {
  // Find the first qualification marked as NOT primary
  const additionalQualification = app.user_qualifications?.find(q => !q.is_primary_qualification);

  if (additionalQualification) {
    // Return the status derived from this specific additional qualification's fields
    return getIndividualQualificationStatus(additionalQualification);
  }

  // Fallback if somehow no additional qualification is found (shouldn't happen with current filtering)
  console.warn(`Application ID ${app.id} has no additional qualifications despite filtering.`);
  return 'Pending';
};

// Determines the status of a SINGLE qualification object
const getIndividualQualificationStatus = (qualification) => {
  if (!qualification) return 'Pending'; // Handle null/undefined case

  const { application_review_status, physical_review_status, endorsement_decision } = qualification;

  // If any step is regretted, the overall status is Regretted
  if (application_review_status === 'Regretted' || physical_review_status === 'Regretted' || endorsement_decision === 'Regretted') {
    return 'Regretted';
  }
  // If all steps are approved, the overall status is Approved
  if (application_review_status === 'Approved' && physical_review_status === 'Approved' && endorsement_decision === 'Approved') {
    return 'Approved';
  }
  // Otherwise, it's pending at least one step
  return 'Pending';
}

// Returns CSS classes for the overall status badge based on the result of getStatus()
const getStatusClasses = (app) => {
  const status = getStatus(app); // Use the function that checks additional qualifications
  return [
    'px-3 py-1 rounded-full text-xs font-medium inline-block', // Added inline-block
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Regretted'
    }
  ];
};

// Returns CSS classes for an individual qualification status badge
const getQualificationStatusClasses = (qualification) => {
  const status = getIndividualQualificationStatus(qualification);
  return {
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-red-100 text-red-800': status === 'Regretted',
  };
};


// Formats a date string into a more readable format
const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-GB', { // Using en-GB for dd/mm/yyyy
      year: 'numeric',
      month: 'short',
      day: '2-digit' // Use 2-digit day
    });
  } catch (e) {
    console.error("Error formatting date:", date, e);
    return 'Invalid Date';
  }
};

// Fetches necessary master data (categories, subcategories, sectors)
const fetchMasterData = async () => {
  try {
    // Using specific endpoints if available, otherwise fallback or adjust as needed
    const [categoriesRes, subcategoriesRes, sectorsRes] = await Promise.allSettled([ // Use Promise.allSettled
      apiServices.getMhpcMastersPersonnelCategories ? apiServices.getMhpcMastersPersonnelCategories() : Promise.resolve({ data: { results: [] } }), // Example fallback
      apiServices.getMhpcMastersSubCategories ? apiServices.getMhpcMastersSubCategories() : Promise.resolve({ data: { results: [] } }),
      apiServices.getMhpcMastersSectors ? apiServices.getMhpcMastersSectors() : Promise.resolve({ data: { results: [] } }),
    ]);

    // Process results safely checking status
    personnelCategories.value = categoriesRes.status === 'fulfilled' ? (categoriesRes.value?.data?.results || []) : [];
    personnelSubcategories.value = subcategoriesRes.status === 'fulfilled' ? (subcategoriesRes.value?.data?.results || []) : [];
    sectors.value = sectorsRes.status === 'fulfilled' ? (sectorsRes.value?.data?.results || []) : [];

    console.log('Fetched Master Data:', {
      categories: personnelCategories.value.length,
      subcategories: personnelSubcategories.value.length,
      sectors: sectors.value.length
    });

  } catch (error) { // Catch any unexpected error during setup
    console.error('Error fetching master data:', error);
    toast.error('Failed to load master data.');
  }
};

// Fetches the list of applications from the API
const fetchApplications = async () => {
  try {
    const response = await apiServices.getMhpcNewApplications(); // Uses the same endpoint
    // Ensure the response structure is as expected
    applications.value = response?.data?.results || [];
    console.log(`Fetched ${applications.value.length} total applications.`);
  } catch (error) {
    console.error('Error fetching applications:', error);
    toast.error('Failed to load applications.');
    applications.value = []; // Reset on error
  }
};

// Fetches detailed user information and opens the modal
const viewDetails = async (application) => {
  if (!application) return;
  selectedApplication.value = { ...application, userDetails: null, isLoading: true }; // Set loading state
  isModalOpen.value = true;

  try {
    // Fetch all users to find matching user details (consider if a direct user fetch by ID/CID is possible)
    const response = await apiServices.getAllUsers();
    const users = response?.data?.results || [];
    const matchingUser = users.find(user => user.cid === application.cid_no);

    // Update selectedApplication with fetched details
    selectedApplication.value = {
      ...application,
      is_counselor: matchingUser?.is_counselor || false, // Example field
      userDetails: matchingUser, // Store the full user object
      isLoading: false, // Turn off loading state
    };

  } catch (error) {
    console.error('Error fetching user details for modal:', error);
    toast.error('Could not load full user details.');
    // Keep modal open but indicate loading failed
    selectedApplication.value = {
      ...application,
      userDetails: null, // Indicate details are missing
      isLoading: false, // Turn off loading state
      errorLoadingDetails: true // Add an error flag
    };
  }
};

// Handles the update event from the modal (refreshes data)
const handleUpdate = async () => {
  closeModal(); // Close modal first
  toast.info('Refreshing application list...');
  await fetchApplications(); // Refetch the list
  toast.success('Application list updated.');
};

// Closes the details modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

// Navigates to the previous page
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Navigates to the next page
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// --- Lifecycle Hook ---

// Fetch initial data when the component is mounted
onMounted(async () => {
  console.log('Additional Qualifications Page Mounted');
  // Use Promise.allSettled to ensure all fetches complete, even if one fails
  await Promise.allSettled([
    fetchApplications(),
    fetchMasterData()
  ]);
  console.log('Initial data fetch complete.');
});
</script>

<style scoped>
/* Add component-specific styles here if needed */
/* Ensure proper alignment and spacing */
th,
td {
  vertical-align: middle;
  /* Align cell content vertically */
}
</style>
