<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track Your Counselor Application
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
                 hover:border-blue-200" placeholder="Enter CID or Work Permit number" />

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
      <div v-if="applications?.length > 0" class="space-y-6">
        <div v-for="(record, index) in applications" :key="index"
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:border-blue-200 transition-all duration-300">

          <!-- Header Section with Status -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ record.counselling_title }}</h3>
                <p class="text-gray-600 mt-1">Registration #{{ record.application }}</p>
              </div>
              <div class="flex items-center space-x-3">
                <span :class="[
                  record.review_decision === 'Approved' ? 'bg-green-100 text-green-800' :
                    record.review_decision === 'Regretted' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-700',
                  'px-4 py-2 rounded-full text-sm font-medium'
                ]">
                  {{ record.review_decision }}
                </span>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Personal Information -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                <User class="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h4>
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="flex items-start space-x-3">
                  <IdCard class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Full Name</p>
                    <p class="text-sm font-semibold text-gray-900">{{ record.full_name }}</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <CreditCard class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">CID Number</p>
                    <p class="text-sm font-semibold text-gray-900">{{ record.cid }}</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <Users class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Gender</p>
                    <p class="text-sm font-semibold text-gray-900 capitalize">{{ record.gender.toLowerCase() }}</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <Mail class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Email</p>
                    <p class="text-sm font-semibold text-gray-900">{{ record.email_address }}</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <Phone class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Contact</p>
                    <p class="text-sm font-semibold text-gray-900">{{ record.contact_no }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Counselling Details -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                <GraduationCap class="w-5 h-5 mr-2 text-blue-600" />
                Counselling Details
              </h4>
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="flex items-start space-x-3">
                  <BookOpen class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Title</p>
                    <p class="text-sm font-semibold text-gray-900">{{ record.counselling_title }}</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <FileText class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Details</p>
                    <p class="text-sm font-semibold text-gray-900">{{ record.counselling_details }}</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <ClipboardList class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Report</p>
                    <p class="text-sm font-semibold text-gray-900">{{ record.counselling_report }}</p>
                  </div>
                </div>
                <div v-if="record.review_remarks" class="flex items-start space-x-3">
                  <MessageSquare class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Review Remarks</p>
                    <p class="text-sm font-semibold text-gray-900">{{ record.review_remarks }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Attachment Section -->
          <div v-if="record.Counselling_attachments && record.Counselling_attachments.length > 0"
            class="border-t border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <FileText class="w-5 h-5 text-blue-600" />
                <span class="font-medium text-gray-900">Supporting Documents</span>
              </div>
            </div>
            <div class="mt-4 space-y-3">
              <div v-for="attachment in record.Counselling_attachments" :key="attachment.id"
                class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div class="flex items-center space-x-3">
                  <FileText class="w-5 h-5 text-red-500" />
                  <span class="text-sm text-gray-700">{{ getFileName(attachment.file) }}</span>
                </div>
                <a :href="attachment.file" target="_blank"
                  class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  <Download class="w-4 h-4 mr-1" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- No Results Message -->
      <div v-else-if="hasSearched && !apiError" class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <div class="flex flex-col items-center">
          <FileSearch class="w-16 h-16 text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-700 mb-2">No Application Found</h3>
          <p class="text-gray-500">We couldn't find any counselor application matching this CID.</p>
          <p class="text-gray-500 mt-1">Please verify your CID number and try again.</p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-else-if="apiError" class="text-center py-12 bg-red-50 rounded-xl border border-red-200">
        <div class="flex flex-col items-center">
          <AlertTriangle class="w-16 h-16 text-red-400 mb-4" />
          <h3 class="text-lg font-medium text-red-700 mb-2">Error Retrieving Data</h3>
          <p class="text-red-500">There was a problem fetching your application details.</p>
          <p class="text-red-500 mt-1">Please try again later or contact support.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiService from '@/services/services';
import {
  FileText,
  IdCard,
  User,
  Users,
  CreditCard,
  GraduationCap,
  BookOpen,
  Download,
  Search,
  Loader,
  HelpCircle,
  Trash2,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  ClipboardList,
  FileSearch,
  AlertTriangle
} from 'lucide-vue-next';

// State
const applications = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);
const hasSearched = ref(false);
const apiError = ref(false);
const recentSearches = ref([]); // Initialize as empty

const clearRecentSearches = () => {
  recentSearches.value = [];
  // Optional: Also clear from localStorage if you're persisting them
  localStorage.removeItem('recentCounselorSearches');
};

// Get file name from URL
const getFileName = (url) => {
  if (!url) return 'File';
  const parts = url.split('/');
  return parts[parts.length - 1];
};

// Methods
const fetchCounselorByCid = async () => {
  isLoading.value = true;
  apiError.value = false;

  try {
    const response = await apiService.getBmhcCounsellors();
    if (response && response.data && response.data.results) {
      // Filter by CID
      const filteredResults = response.data.results.filter(
        counselor => counselor.cid.toLowerCase() === searchQuery.value.toLowerCase()
      );
      applications.value = filteredResults;
    } else {
      applications.value = [];
    }
  } catch (error) {
    console.error('Error fetching counselor applications:', error);
    applications.value = [];
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return;

  hasSearched.value = true;
  await fetchCounselorByCid();

  // Add to recent searches (if valid and not a duplicate)
  if (searchQuery.value.trim() !== '' && !recentSearches.value.includes(searchQuery.value)) {
    recentSearches.value.unshift(searchQuery.value); // Add to the beginning
    recentSearches.value = recentSearches.value.slice(0, 5); // Limit to 5 recent searches

    // Optional: Save to localStorage for persistence
    localStorage.setItem('recentCounselorSearches', JSON.stringify(recentSearches.value));
  }
};

const setSearch = (search) => {
  searchQuery.value = search;
  handleSearch();
};

// Load recent searches from localStorage on component mount
// This could be added in an onMounted hook if needed
if (typeof localStorage !== 'undefined') {
  const savedSearches = localStorage.getItem('recentCounselorSearches');
  if (savedSearches) {
    recentSearches.value = JSON.parse(savedSearches);
  }
}
</script>