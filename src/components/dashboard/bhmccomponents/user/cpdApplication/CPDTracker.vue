<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section (Kept as is) -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track Your CPD Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Your CPD application status.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-pulse flex flex-col items-center space-y-4">
        <div class="w-24 h-24 bg-blue-200 rounded-full"></div>
        <div class="h-6 bg-blue-300 rounded w-64"></div>
        <div class="h-4 bg-blue-200 rounded w-48"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="apiError" class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500 mb-4" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="text-xl font-semibold text-red-700 mb-2">Data Retrieval Error</h3>
      <p class="text-red-600">We couldn't fetch your CPD records. Please try again later.</p>
    </div>

    <!-- No Applications State -->
    <div v-else-if="filteredApplications.length === 0" class="bg-white shadow-lg rounded-xl p-8 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-blue-500 mb-4" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">No CPD Records</h3>
      <p class="text-gray-600">You haven't submitted any CPD applications yet.</p>
    </div>

    <!-- Applications List -->
    <transition-group v-else name="list" tag="div" class="space-y-6">
      <div v-for="(record, index) in filteredApplications" :key="index"
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl">
        <!-- Header with Vibrant Status and Credits -->
        <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-6">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ record.title_of_cpd }}</h3>
              <div class="flex items-center space-x-3">
                <span class="text-sm text-gray-600">Registration #{{ record.registration_no }}</span>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <!-- Status Badge with Dynamic Coloring -->
              <span :class="[
                record.review_status === 'Approved' ? 'bg-green-100 text-green-800' :
                  record.review_status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800',
                'px-4 py-2 rounded-full text-sm font-medium shadow-sm'
              ]">
                {{ record.review_status }}
              </span>

              <!-- Credits Badge with Standout Design -->
              <span v-if="record.review_status === 'Approved'"
                class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                {{ record.cpd_credit }} Credits
              </span>
            </div>
          </div>
        </div>

        <!-- Detailed Information Grid -->
        <div class="p-6 grid md:grid-cols-2 gap-6">
          <!-- Personal Information Section -->
          <div class="bg-gray-50 rounded-xl p-6 space-y-4">
            <h4 class="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
              <User class="w-6 h-6 mr-3 text-blue-600" />
              Personal Details
            </h4>
            <div class="space-y-3">
              <div class="flex items-center space-x-4">
                <IdCard class="w-6 h-6 text-gray-500" />
                <div>
                  <p class="text-xs text-gray-600">Full Name</p>
                  <p class="font-medium text-gray-900">{{ record.full_name }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <CreditCard class="w-6 h-6 text-gray-500" />
                <div>
                  <p class="text-xs text-gray-600">CID Number</p>
                  <p class="font-medium text-gray-900">{{ record.cid_no }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <Users class="w-6 h-6 text-gray-500" />
                <div>
                  <p class="text-xs text-gray-600">Gender</p>
                  <p class="font-medium text-gray-900 capitalize">{{ record.gender.toLowerCase() }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Details Section -->
          <div class="bg-gray-50 rounded-xl p-6 space-y-4">
            <h4 class="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
              <GraduationCap class="w-6 h-6 mr-3 text-blue-600" />
              Activity Insights
            </h4>
            <div class="space-y-3">
              <div class="flex items-center space-x-4">
                <BookOpen class="w-6 h-6 text-gray-500" />
                <div>
                  <p class="text-xs text-gray-600">Activity Type</p>
                  <p class="font-medium text-gray-900">
                    {{ record.type_of_cpd_activity || 'Not specified' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <Target class="w-6 h-6 text-gray-500" />
                <div>
                  <p class="text-xs text-gray-600">Relevance</p>
                  <p class="font-medium text-gray-900">
                    {{ record.relevance_to_profession }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <Calendar class="w-6 h-6 text-gray-500" />
                <div>
                  <p class="text-xs text-gray-600">Submission Date</p>
                  <p class="font-medium text-gray-900">
                    {{ new Date(record.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    day: 'numeric'
                    }) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Attachments Section with Modern Download Button -->
        <div class="bg-gray-100 p-6 flex items-center justify-between border-t">
          <div class="flex items-center space-x-3">
            <FileText class="w-6 h-6 text-blue-600" />
            <span class="font-medium text-gray-900">Supporting Document</span>
          </div>
          <a :href="record.attachment" target="_blank"
            class="group flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out">
            <Download class="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Download
          </a>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import apiService from '@/services/services';
import { useAuthStore } from '@/stores/authStore'; // Import Auth Store
import {
  FileText,
  IdCard,
  User,
  Users,
  CreditCard,
  Calendar,
  GraduationCap,
  BookOpen,
  Target,
  Download,
} from 'lucide-vue-next';

// State
const applications = ref([]);
const isLoading = ref(false);
const apiError = ref(false);
const authStore = useAuthStore(); // Use the auth store

// Computed Property for filtered applications
const filteredApplications = computed(() => {
  if (!authStore.user || !authStore.user.cid) {
    return []; // Return empty if user or cid is not available
  }

  return applications.value.filter(app => app.cid_no === authStore.user.cid);
});


// Methods
const fetchApplications = async () => {
  isLoading.value = true;
  apiError.value = false;

  try {
    const response = await apiService.getBmhcCpdRecords();
    // Check if the response is an array and assign it directly
    if (Array.isArray(response.data.results)) {
      applications.value = response.data.results;
    } else {
      // Handle cases where the API might return something other than an array
      applications.value = [];
      console.error("API did not return an array:", response.data);
      apiError.value = true; // Set apiError if it's not the expected format
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    applications.value = [];
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchApplications();
});

</script>

<style scoped>
/* List Transition Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
