<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Track Your Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Your CoGS application status.
      </p>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Results Section -->
      <div v-if="filteredApplications.length > 0" class="space-y-6">
        <div v-for="application in filteredApplications" :key="application.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <!-- Header with Registration Number and Status -->
          <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-6 flex items-center justify-between">
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
      <div v-if="filteredApplications.length === 0 && !isLoading && !apiError"
        class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <p class="text-gray-600">No CoGS records found for your account.</p>
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
import { ref, h, defineComponent, onMounted, computed } from 'vue';
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
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/authStore'; // Import Auth Store


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


onMounted(async () => {
  await fetchApplications();
});

</script>
