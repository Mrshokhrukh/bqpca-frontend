<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track Your Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Search your application status by CID/Work Permit Number.
      </p>
    </div>

    <!-- Search Section -->
    <div class="w-100 mx-auto mb-16">
      <div class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-8">
        <!-- Search Container -->
        <div class="relative">
          <!-- Search Icon Overlay -->
          <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-blue-500" />
          </div>

          <!-- Main Search Input -->
          <input v-model="searchQuery" type="text" class="w-full pl-12 pr-32 py-4 bg-white/70 backdrop-blur-sm rounded-xl border-2 border-blue-100
                 text-gray-900 placeholder-gray-500 text-lg
                 shadow-sm transition-all duration-200
                 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none
                 hover:border-blue-200"
            :placeholder="searchType === 'id' ? 'Enter CID or Work Permit number' : 'Enter Application ID'" />

          <!-- Search Button (Absolutely Positioned) -->
          <div class="absolute inset-y-1.5 right-1.5">
            <button @click="handleSearch" :disabled="isLoading" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg
                   shadow-sm transition-all duration-200
                   hover:bg-blue-700 hover:shadow-md
                   disabled:bg-blue-400 disabled:cursor-not-allowed
                   flex items-center space-x-2">
              <Loader v-if="isLoading" class="animate-spin w-4 h-4" />
              <span class="font-medium">{{ isLoading ? 'Searching...' : 'Search' }}</span>
            </button>
          </div>
        </div>

        <!-- Search Type Indicator -->
        <div class="mt-4 flex items-center justify-between text-sm">
          <div class="flex items-center space-x-2">
            <IdCard class="w-4 h-4 text-blue-500" />
            <span class="text-gray-600 font-medium">Searching by:</span>
            <span class="text-blue-600 font-semibold">CID/Work Permit Number</span>
          </div>

          <!-- Search Tips -->
          <div class="flex items-center text-gray-500 hover:text-gray-700 transition-colors cursor-help group relative">
            <HelpCircle class="w-4 h-4 mr-1" />
            <span>Search Tips</span>

            <!-- Tooltip -->
            <div class="absolute bottom-full right-0 mb-2 w-64 hidden group-hover:block">
              <div class="bg-gray-900 text-white p-3 rounded-lg shadow-lg text-xs">
                <ul class="space-y-1">
                  <li>• Enter your complete ID number</li>
                  <li>• Ensure there are no extra spaces</li>
                  <li>• Numbers only for Work Permit</li>
                </ul>
                <div class="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Searches (Optional) -->
        <div v-if="recentSearches?.length" class="mt-6 pt-4 border-t border-blue-100">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="text-gray-600 font-medium">Recent Searches</span>
            <button @click="clearRecentSearches" class="text-gray-400 hover:text-gray-600 transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button v-for="search in recentSearches" :key="search" @click="setSearch(search)" class="px-3 py-1 text-sm bg-white rounded-full border border-gray-200
                   text-gray-600 hover:border-blue-300 hover:text-blue-600
                   transition-colors flex items-center space-x-1">
              <Clock class="w-3 h-3" />
              <span>{{ search }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading Indicator (Optional) -->
      <div v-if="isLoading" class="mt-4 flex justify-center">
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></span>
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Results Section -->
      <div v-if="applications.length > 0" class="space-y-6">
        <div v-for="application in applications" :key="application.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <!-- Header with Registration Number and Status -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-gray-900 flex items-center">
                <span>Application #{{ application.registration_no }}</span>
                <status-badge :status="application.review_status" class="ml-3" />
              </h3>
              <p class="text-sm text-gray-600 mt-1">Submitted on {{ formatDate(application.created_at) }}</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <button v-if="application.review_status === 'Pending'"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                <Info class="w-4 h-4 mr-2" />
                Update Application
              </button>

              <button v-if="!application.is_payment_complete"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center">
                <CreditCard class="w-4 h-4 mr-2" />
                Complete Payment
              </button>
            </div>
          </div>

          <!-- Application Details Grid -->
          <div class="grid md:grid-cols-3 gap-6 p-6 bg-white">
            <!-- Personal Information Column -->
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h4>
              <div class="space-y-3">
                <detail-row icon="User" label="Full Name" :value="application.full_name" />
                <detail-row icon="IdCard" label="CID Number" :value="application.cid_no" />
                <detail-row icon="Target" label="Gender" :value="application.gender" />
              </div>
            </div>

            <!-- Contact Information Column -->
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Contact Details</h4>
              <div class="space-y-3">
                <detail-row icon="Phone" label="Contact Number" :value="application.contact_number" />
                <detail-row icon="Mail" label="Email" :value="application.email_address" />
                <detail-row icon="BookOpen" label="Workplace" :value="application.workplace || 'Not Specified'" />
              </div>
            </div>

            <!-- Application Status Column -->
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Application Status</h4>
              <div class="space-y-3">
                <detail-row icon="FileText" label="Review Status" :value="application.review_status" />
                <detail-row icon="Target" label="Endorsement" :value="application.endorsement_decision" />
                <detail-row icon="CreditCard" label="Payment"
                  :value="application.is_payment_complete ? 'Completed' : 'Pending'" />
              </div>
            </div>
          </div>

          <!-- Additional Details and Remarks -->
          <div v-if="application.review_remark" class="bg-gray-50 p-6 border-t">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Review Remarks</h4>
            <p class="text-gray-600 italic">{{ application.review_remark }}</p>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="hasSearched && !apiError" class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <p class="text-gray-600">No CoGS records found matching your search.</p>
      </div>
      <!-- API Error Message (Optional) -->
      <div v-else-if="apiError" class="text-center py-12 bg-red-50 rounded-xl border border-red-200">
        <p class="text-red-600">An error occurred while fetching data. Please try again later.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, h, defineComponent, onMounted } from 'vue';
import apiService from '@/services/services';
import {
  User,
  IdCard,
  Phone,
  Mail,
  FileText,
  Target,
  BookOpen,
  CreditCard,
  Info,
  Search,
  Loader,
  HelpCircle,
  Trash2,
  Clock
} from 'lucide-vue-next';

// State
const applications = ref([]);
const searchQuery = ref('');
const searchType = ref('id');
const isLoading = ref(false);
const hasSearched = ref(false);
const apiError = ref(false);
const recentSearches = ref([]); // Initialize as empty

// Methods
const fetchApplications = async () => {
  isLoading.value = true;
  apiError.value = false;

  try {
    const response = await apiService.getBmhcCogs();
    // Access the 'results' property of the response data.
    if (Array.isArray(response.data.results)) {
      applications.value = response.data.results;
    } else {
      applications.value = [];
      console.error("API did not return an array in results:", response.data);
      apiError.value = true; // Set apiError if the results are not as expected
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    applications.value = [];
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async () => {
  hasSearched.value = true;
  isLoading.value = true; // Set loading before fetching.
  apiError.value = false; // Reset error state

  try {
    const response = await apiService.getBmhcCogs();

    if (Array.isArray(response.data.results)) {
      // Filter the applications based on the search query.
      const searchTerm = searchQuery.value.trim().toLowerCase(); // Normalize the search term
      applications.value = response.data.results.filter(app =>
        app.cid_no.toLowerCase().includes(searchTerm) ||
        (app.registration_no && app.registration_no.toLowerCase().includes(searchTerm)) // Check registration_no too.  Add other fields as needed
      );

      // Add to recent searches (if valid and not a duplicate)
      if (searchTerm !== '' && !recentSearches.value.includes(searchTerm)) {
        recentSearches.value.unshift(searchTerm); // Add to the beginning
        recentSearches.value = recentSearches.value.slice(0, 5); // Limit to 5 recent searches
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value)); //save to localStorage
      }
    } else {
      applications.value = [];
      console.error("API did not return an array in results:", response.data);
      apiError.value = true;
    }
  } catch (error) {
    console.error('Error fetching/filtering applications:', error);
    applications.value = [];
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const StatusBadge = defineComponent({
  props: {
    status: String
  },
  render() {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };

    return h('span', {
      class: `px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${statusClasses[this.status] || ''}`
    }, this.status);
  }
});

// Detail Row Component
const DetailRow = defineComponent({
  props: {
    icon: String,
    label: String,
    value: String
  },
  render() {
    const icons = {
      User, IdCard, Phone, Mail, FileText, Target, BookOpen, CreditCard, Info
    };

    const IconComponent = icons[this.icon];

    return h('div', { class: 'flex items-center space-x-3' }, [
      h(IconComponent, { class: 'w-5 h-5 text-blue-500' }),
      h('div', [
        h('p', { class: 'text-xs text-gray-500' }, this.label),
        h('p', { class: 'text-sm text-gray-800 font-medium' }, this.value)
      ])
    ]);
  }
});

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const setSearch = (search) => {
  searchQuery.value = search;
  handleSearch();
};

onMounted(async () => {
   //load recent searches from localStorage
  const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
        recentSearches.value = JSON.parse(savedSearches);
    }
  await fetchApplications();
});

  const clearRecentSearches = () => {
  recentSearches.value = [];
  localStorage.removeItem('recentSearches'); //clear the localStorage
};
</script>
