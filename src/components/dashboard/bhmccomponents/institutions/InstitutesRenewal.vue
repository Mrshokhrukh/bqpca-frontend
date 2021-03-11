<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Institute Status
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        View and manage your institute registration status
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center my-8">
      <div class="inline-block animate-spin text-blue-600 text-3xl">⌛</div>
      <p class="ml-2 text-gray-600">Loading institute data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="apiError" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">Error Loading Institute Data</h3>
      <p>{{ errorMessage }}</p>
      <button @click="fetchInstituteData"
        class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Try Again
      </button>
    </div>

    <!-- No Institute Found -->
    <div v-else-if="!instituteData" class="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">No Institute Found</h3>
      <p>You don't have any registered institute associated with your account.</p>
      <p class="mt-2">Please register an institute first before attempting to renew.</p>
    </div>

    <!-- Institute Card -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Institute Status Header - Changes color based on expiration status -->
      <div class="p-6" :class="statusHeaderClass">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-white">{{ instituteData.name_of_institution }}</h3>
            <p class="text-white/80">
              <span>
                {{ isActive ? 'Active Registration' : 'Registration Pending' }}
              </span>
            </p>
          </div>
          <div class="bg-white/20 rounded-lg px-4 py-2 text-white">
            <p class="text-sm font-medium">ID: {{ instituteData.id }}</p>
          </div>
        </div>
      </div>

      <!-- Institute Details -->
      <div class="p-6">
        <!-- Expiration Alert -->
        <div v-if="isActive && daysUntilExpiration <= 90" class="mb-6 p-4 rounded-lg" :class="[
          daysUntilExpiration <= 30 ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-yellow-50 text-yellow-700 border border-yellow-200'
        ]">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium">
                {{
                  daysUntilExpiration <= 0 ? 'Registration Expired!' : daysUntilExpiration <= 30
                    ? 'Registration Expiring Soon!' : 'Registration Renewal Recommended' }} </h3>
                  <div class="mt-1 text-sm">
                    <p v-if="daysUntilExpiration <= 0">
                      Your institute registration has expired. Please renew immediately to maintain your registration
                      status.
                    </p>
                    <p v-else>
                      Your institute registration will expire in {{ daysUntilExpiration }} days
                      ({{ formattedExpirationDate }}). Please renew your registration to maintain your status.
                    </p>
                  </div>
            </div>
          </div>
        </div>

        <!-- Institute Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Registration Details</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Registration Status</p>
                  <p class="text-sm font-medium" :class="isActive ? 'text-green-600' : 'text-yellow-600'">
                    {{ isActive ? 'Active' : 'Pending' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid From</p>
                  <p class="text-sm font-medium text-gray-800">{{ formattedActiveDate }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid Until</p>
                  <p class="text-sm font-medium" :class="[
                    daysUntilExpiration <= 0 ? 'text-red-600' :
                      daysUntilExpiration <= 30 ? 'text-orange-600' :
                        'text-gray-800'
                  ]">
                    {{ formattedExpirationDate }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Review Decision</p>
                  <p class="text-sm font-medium" :class="{
                    'text-green-600': instituteData.do_dpr_review_decision === 'Approved',
                    'text-yellow-600': instituteData.do_dpr_review_decision === 'Pending',
                    'text-red-600': instituteData.do_dpr_review_decision === 'Rejected'
                  }">
                    {{ instituteData.do_dpr_review_decision }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Institute Information</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Contact Person</p>
                  <p class="text-sm font-medium text-gray-800">{{ instituteData.full_name }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Location</p>
                  <p class="text-sm font-medium text-gray-800">
                    {{ instituteData.dzongkhag }}, {{ instituteData.gewog }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Contact</p>
                  <p class="text-sm font-medium text-gray-800">{{ instituteData.contact_no }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Email</p>
                  <p class="text-sm font-medium text-gray-800">{{ instituteData.email_address }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Head of Institution -->
        <div class="mb-6">
          <h4 class="text-sm font-medium text-gray-500 mb-1">Head of Institution</h4>
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-xs text-gray-500">Name</p>
                <p class="text-sm font-medium text-gray-800">{{ instituteData.head_of_institution_name }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Contact</p>
                <p class="text-sm font-medium text-gray-800">{{ instituteData.head_of_institution_phone_number }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Email</p>
                <p class="text-sm font-medium text-gray-800">{{ instituteData.head_of_institution_email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Renewal Button - only show if active -->
        <div class="flex justify-end mt-8" v-if="isActive && !isRenewalInProgress">
          <button @click="openRenewalDialog"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline"
            :class="{ 'animate-pulse': daysUntilExpiration <= 30 }">
            Renew Institute Registration
          </button>
        </div>

        <!-- Renewal in progress message -->
        <div v-if="isRenewalInProgress" class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          <h4 class="font-medium">Renewal In Progress</h4>
          <p class="mt-1 text-sm">
            Your renewal application has been submitted and is currently under review.
            You will be notified once the review is complete.
          </p>
        </div>
      </div>
    </div>

    <!-- Renewal Confirmation Dialog -->
    <div v-if="showRenewalDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Institute Renewal</h3>
        <p class="mb-6 text-gray-600">
          Are you sure you want to renew your institute registration? This will start the renewal process and require
          payment.
        </p>
        <div v-if="isRenewing" class="flex items-center justify-center mb-4">
          <div class="inline-block animate-spin text-blue-600 text-xl mr-2">⌛</div>
          <p>Processing renewal...</p>
        </div>
        <div class="flex justify-end space-x-4">
          <button @click="closeRenewalDialog"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="isRenewing">
            Cancel
          </button>
          <button @click="confirmRenewal"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="isRenewing">
            Confirm Renewal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';
import bmhcService from '@/services/bmhcservices';

// State variables
const instituteData = ref(null);
const isLoading = ref(true);
const apiError = ref(false);
const errorMessage = ref('');
const showRenewalDialog = ref(false);
const isRenewing = ref(false);

// Get auth store and toast notification
const authStore = useAuthStore();
const toast = useToast();

// Get user CID from auth store
const userCid = computed(() => {
  return authStore.user?.cid || '';
});

// Format dates and calculate days until expiration
const formattedActiveDate = computed(() => {
  if (!instituteData.value?.created_at) return 'N/A';
  return new Date(instituteData.value.created_at).toLocaleDateString();
});

const formattedExpirationDate = computed(() => {
  if (!instituteData.value?.valid_till) return 'N/A';
  return new Date(instituteData.value.valid_till).toLocaleDateString();
});

const daysUntilExpiration = computed(() => {
  if (!instituteData.value?.valid_till) return 0;

  const today = new Date();
  const expirationDate = new Date(instituteData.value.valid_till);
  const timeDiff = expirationDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

const isActive = computed(() => {
  return instituteData.value?.is_active === true;
});

const isRenewalInProgress = computed(() => {
  // Renewal is in progress if the review decision is pending and not active
  return instituteData.value?.do_dpr_review_decision === 'Pending' && !isActive.value;
});

// Status header styling based on expiration
const statusHeaderClass = computed(() => {
  if (!isActive.value) {
    return 'bg-yellow-600';
  }

  if (daysUntilExpiration.value <= 0) {
    return 'bg-red-600';
  }

  if (daysUntilExpiration.value <= 30) {
    return 'bg-orange-600';
  }

  if (daysUntilExpiration.value <= 90) {
    return 'bg-yellow-600';
  }

  return 'bg-green-600';
});

// Fetch institute data based on user CID
const fetchInstituteData = async () => {
  if (!userCid.value) {
    errorMessage.value = 'User information not available. Please log in again.';
    apiError.value = true;
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  apiError.value = false;

  try {
    const response = await bmhcService.getBmhcInstitutes();

    if (response && response.data && response.data.results) {
      // Filter institutes to find one matching the user's CID
      const userInstitutes = response.data.results.filter(institute =>
        institute.CID.toLowerCase() === userCid.value.toLowerCase()
      );

      if (userInstitutes.length > 0) {
        instituteData.value = userInstitutes[0];
      } else {
        instituteData.value = null;
      }
    } else {
      errorMessage.value = 'Unable to retrieve institute data.';
      apiError.value = true;
    }
  } catch (error) {
    console.error('Error fetching institute data:', error);
    errorMessage.value = error.response?.data?.message || 'Error fetching institute data. Please try again.';
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Open renewal dialog
const openRenewalDialog = () => {
  showRenewalDialog.value = true;
};

// Close renewal dialog
const closeRenewalDialog = () => {
  showRenewalDialog.value = false;
};

// Submit renewal request
const confirmRenewal = async () => {
  if (!instituteData.value) {
    toast.error('No institute data available for renewal');
    closeRenewalDialog();
    return;
  }

  isRenewing.value = true;

  try {
    // Calculate new valid till date (current valid_till + 1 day + 12 months)
    let currentValidTill = new Date(instituteData.value.valid_till);
    let newValidTill = new Date(currentValidTill);
    newValidTill.setDate(newValidTill.getDate() + 1); // Add 1 day
    newValidTill.setMonth(newValidTill.getMonth() + 12); // Add 12 months

    // Prepare payload for PATCH request
    const renewalData = {
      do_dpr_review_decision: "Pending",
      is_payment_complete: false,
      is_active: false,
      payment_id: null,
      active_date: new Date().toISOString().split('T')[0], // Today's date
      valid_till: newValidTill.toISOString().split('T')[0] // New expiration date
    };

    // Send PATCH request to update institute
    await bmhcService.patchBmhcInstitute(instituteData.value.id, renewalData);

    // Update local data
    Object.assign(instituteData.value, renewalData);

    toast.success('Institute renewal initiated successfully!');

    // Close dialog and update UI
    closeRenewalDialog();

  } catch (error) {
    console.error('Error initiating institute renewal:', error);
    toast.error(error.response?.data?.message || 'Failed to initiate renewal. Please try again.');
  } finally {
    isRenewing.value = false;
  }
};

// Fetch institute data on component mount
onMounted(fetchInstituteData);
</script>

<style scoped>
/* Any component-specific styles */
</style>