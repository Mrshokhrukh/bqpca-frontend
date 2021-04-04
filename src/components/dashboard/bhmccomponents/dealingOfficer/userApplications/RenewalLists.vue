<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Renewal Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ filteredApplications.length }}
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
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registration
                No.</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Primary
                Qualification</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Renewal
                Status</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Expiry Date
              </th>
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
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <span class="text-gray-600 text-xs">{{ getInitials(app) }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ app.full_name }}</div>
                    <div class="text-sm text-gray-500">{{ app.cid_no }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ app.registration_no || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <template v-if="getPrimaryQualification(app)">
                  {{ getPrimaryQualification(app).qualification_name_display || 'N/A' }}
                </template>
                <template v-else>
                  N/A
                </template>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getRenewalStatusClasses(app)">
                  {{ getRenewalStatus(app) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(app.expiry_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="viewDetails(app)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">View</button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedApplications.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                {{ isLoading ? 'Loading application data...' : 'No renewal applications found that match your criteria'
                }}
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
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12 1.586l-9.707 9.707a1 1 0 0 1-1.414-1.414l10.414-10.414a1 1 0 0 1 1.414 0l10.414 10.414a1 1 0 0 1-1.414 1.414L12 1.586z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12 18.414l9.707-9.707a1 1 0 0 0-1.414-1.414L12 15.586 3.707 7.293a1 1 0 0 0-1.414 1.414l9.707 9.707z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <RenewalDetailsModal :isOpen="isModalOpen" :application="selectedApplication" @close="closeModal"
      @update="handleUpdate" :personnel-categories="personnelCategories"
      :personnel-subcategories="personnelSubcategories" :sectors="sectors" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiServices from '@/services/services';
import RenewalDetailsModal from '../modals/RenewalDetailsModal.vue';
import { useToast } from 'vue-toastification';

const applications = ref([]);
const renewals = ref([]);
const filterStatus = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const isModalOpen = ref(false);
const selectedApplication = ref(null);
const personnelCategories = ref([]);
const personnelSubcategories = ref([]);
const sectors = ref([]);
const toast = useToast();
const isLoading = ref(true);

// Reset pagination when filters change
watch([searchQuery, filterStatus], () => {
  currentPage.value = 1;
});

// Map to track renewals by application ID
const renewalByApplicationMap = computed(() => {
  const map = {};
  renewals.value.forEach(renewal => {
    if (renewal.application) {
      map[renewal.application] = renewal;
    }
  });
  return map;
});

// Filter for applications that can be renewed
const filteredApplications = computed(() => {
  return applications.value
    .filter(app => {
      // Only consider applications that are of type Renewal
      return app.registration_type_name === 'Renewal';
    })
    .filter(app => {
      if (filterStatus.value !== 'all') {
        return getRenewalStatus(app) === filterStatus.value;
      }
      return true;
    })
    .filter(app => {
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        const name = (app.full_name || '').toLowerCase();
        const cid = (app.cid_no || '').toLowerCase();
        const regNo = (app.registration_no || '').toLowerCase();
        return (
          name.includes(query) ||
          cid.includes(query) ||
          regNo.includes(query)
        );
      }
      return true;
    });
});

const pendingCount = computed(() => {
  return filteredApplications.value.filter(app => getRenewalStatus(app) === 'Pending').length;
});

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredApplications.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredApplications.value.length / itemsPerPage));
});

const paginationStart = computed(() => {
  if (filteredApplications.value.length === 0) return 0;
  return ((currentPage.value - 1) * itemsPerPage) + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredApplications.value.length);
});

// Get the primary qualification from an application
const getPrimaryQualification = (app) => {
  if (app.user_qualifications && app.user_qualifications.length > 0) {
    return app.user_qualifications.find(q => q.is_primary_qualification);
  }
  return null;
};

// Generate initials for the avatar
const getInitials = (app) => {
  const name = app.full_name || '';
  if (!name) return '?';

  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Get the renewal status of an application
const getRenewalStatus = (app) => {
  const renewal = renewalByApplicationMap.value[app.id];
  if (renewal) {
    return renewal.renewal_endorsement_decision || 'Pending';
  }
  return 'Pending';
};

// Get CSS classes for renewal status
const getRenewalStatusClasses = (app) => {
  const status = getRenewalStatus(app);
  return [
    'px-3 py-1 rounded-full text-xs font-medium',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Regretted'
    }
  ];
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const fetchMasterData = async () => {
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
    toast.error('Failed to load master data');
  }
};

// Fetch applications from the correct endpoint
const fetchApplications = async () => {
  try {
    const response = await apiServices.getMhpcNewApplications();
    applications.value = response.data.results || [];

    // Log the first application for debugging
    if (applications.value.length > 0) {
      console.log('First application data:', applications.value[0]);
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    toast.error('Failed to load application data');
  }
};

// Fetch renewal data to map to applications
const fetchRenewals = async () => {
  try {
    const response = await apiServices.getMhpcRenewals();
    renewals.value = response.data.results || [];
  } catch (error) {
    console.error('Error fetching renewals:', error);
    toast.error('Failed to load renewal data');
  }
};

const viewDetails = async (application) => {
  try {
    // Find if there's an existing renewal for this application
    const existingRenewal = renewalByApplicationMap.value[application.id];

    // Make deep copy to avoid reactivity issues
    const applicationData = JSON.parse(JSON.stringify(application));

    // Add renewal data if it exists
    if (existingRenewal) {
      applicationData.renewalData = existingRenewal;
    }

    selectedApplication.value = applicationData;
    isModalOpen.value = true;
  } catch (error) {
    console.error('Error preparing application details:', error);
    toast.error('Failed to prepare application details');
  }
};

const handleUpdate = async () => {
  await Promise.all([fetchApplications(), fetchRenewals()]);
  closeModal();
  toast.success('Renewal application processed successfully');
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    // Fetch applications and renewals
    await Promise.all([fetchApplications(), fetchRenewals(), fetchMasterData()]);
  } catch (error) {
    console.error('Error initializing data:', error);
    toast.error('Failed to initialize application data');
  } finally {
    isLoading.value = false;
  }
});
</script>
