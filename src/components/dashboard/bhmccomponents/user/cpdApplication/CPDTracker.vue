<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track Your CPD Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Your CPD application status.
      </p>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Results Section -->
      <div v-if="filteredApplications?.length > 0" class="space-y-6">
        <div v-for="(record, index) in filteredApplications" :key="index"
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:border-blue-200 transition-all duration-300">

          <!-- Header Section with Status -->
          <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ record.title_of_cpd }}</h3>
                <p class="text-gray-600 mt-1">Registration #{{ record.registration_no }}</p>
              </div>
              <div class="flex items-center space-x-3">
                <span :class="[
        record.review_status === 'Approved' ? 'bg-green-100 text-green-800' :
          record.review_status === 'Rejected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-700',
        'px-4 py-2 rounded-full text-sm font-medium'
      ]">
                  {{ record.review_status }}
                </span>
                <span class="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  {{ record.cpd_credit }} Credits
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
                    <p class="text-sm font-semibold text-gray-900">{{ record.cid_no }}</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <Users class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Gender</p>
                    <p class="text-sm font-semibold text-gray-900 capitalize">{{ record.gender.toLowerCase() }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- CPD Activity Details -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                <GraduationCap class="w-5 h-5 mr-2 text-blue-600" />
                Activity Details
              </h4>
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="flex items-start space-x-3">
                  <BookOpen class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Activity Type</p>
                    <p class="text-sm font-semibold text-gray-900">{{ record.type_of_cpd_activity || 'Not specified' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <Target class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Relevance to Profession</p>
                    <p class="text-sm font-semibold text-gray-900">{{ record.relevance_to_profession }}</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <Calendar class="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p class="text-sm font-medium text-gray-500">Submission Date</p>
                    <p class="text-sm font-semibold text-gray-900">
                      {{ new Date(record.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Attachment Section -->
          <div class="border-t border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <FileText class="w-5 h-5 text-blue-600" />
                <span class="font-medium text-gray-900">Supporting Document</span>
              </div>
              <a :href="record.attachment" target="_blank"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download class="w-4 h-4 mr-2" />
                <span>Download</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- No Results Message -->
      <div v-if="filteredApplications.length === 0 && !isLoading && !apiError"
        class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <p class="text-gray-600">No CPD records found for your account.</p>
      </div>
      <!-- API Error Message (Optional) -->
      <div v-else-if="apiError" class="text-center py-12 bg-red-50 rounded-xl border border-red-200">
        <p class="text-red-600">An error occurred while fetching data. Please try again later.</p>
      </div>
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="mt-4 flex justify-center">
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"></span>
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"></span>
        </div>
      </div>
    </div>

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
