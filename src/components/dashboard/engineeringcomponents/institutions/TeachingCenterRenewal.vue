<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Teaching Center Renewal ss
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Manage and renew your teaching center registration
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center my-8">
      <div class="inline-block animate-spin text-blue-600 text-3xl">⌛</div>
      <p class="ml-2 text-gray-600">Loading teaching center data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="apiError" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">Error Loading Data</h3>
      <p>{{ errorMessage }}</p>
      <button @click="fetchData"
        class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Try Again
      </button>
    </div>

    <!-- No Teaching Centers Found -->
    <div v-else-if="!teachingCenters.length"
      class="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">No Teaching Centers Found</h3>
      <p>You don't have any registered teaching centers associated with your institute.</p>
      <p class="mt-2">Please register a teaching center first before attempting to renew.</p>
    </div>

    <!-- Teaching Centers List -->
    <div v-else>
      <!-- Teaching Center Cards -->
      <div v-for="center in teachingCenters" :key="center.id"
        class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <!-- Center Status Header -->
        <div class="p-6" :class="getStatusHeaderClass(center)">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-white">{{ center.center_name }}</h3>
              <p class="text-white/80">
                <span>
                  {{ center.is_active ? 'Active Registration' : 'Registration Pending' }}
                </span>
              </p>
            </div>
            <div class="bg-white/20 rounded-lg px-4 py-2 text-white">
              <p class="text-sm font-medium">ID: {{ center.id }}</p>
            </div>
          </div>
        </div>

        <!-- Center Details -->
        <div class="p-6">
          <!-- Expiration Alert -->
          <div v-if="center.is_active && getDaysUntilExpiration(center) <= 90" class="mb-6 p-4 rounded-lg" :class="[
            getDaysUntilExpiration(center) <= 30 ? 'bg-red-50 text-red-700 border border-red-200' :
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
                    getDaysUntilExpiration(center) <= 0 ? 'Registration Expired!' : getDaysUntilExpiration(center) <= 30
                      ? 'Registration Expiring Soon!' : 'Registration Renewal Recommended' }} </h3>
                    <div class="mt-1 text-sm">
                      <p v-if="getDaysUntilExpiration(center) <= 0">
                        Your teaching center registration has expired. Please renew immediately to maintain your
                        registration status.
                      </p>
                      <p v-else>
                        Your teaching center registration will expire in {{ getDaysUntilExpiration(center) }} days
                        ({{ formatDate(center.valid_till) }}). Please renew your registration to maintain your status.
                      </p>
                    </div>
              </div>
            </div>
          </div>

          <!-- Center Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Registration Details</h4>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-1 gap-3">
                  <div>
                    <p class="text-xs text-gray-500">Registration Status</p>
                    <p class="text-sm font-medium" :class="center.is_active ? 'text-green-600' : 'text-yellow-600'">
                      {{ center.is_active ? 'Active' : 'Pending' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Valid From</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ formatDate(center.valid_since) }}
                      <button v-if="!center.valid_since" @click="setDefaultDates(center)"
                        class="ml-2 text-xs text-blue-600 hover:text-blue-800">
                        Set Default Dates
                      </button>
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Valid Until</p>
                    <p class="text-sm font-medium" :class="[
                      !center.valid_till ? 'text-gray-800' :
                        getDaysUntilExpiration(center) <= 0 ? 'text-red-600' :
                          getDaysUntilExpiration(center) <= 30 ? 'text-orange-600' :
                            'text-gray-800'
                    ]">
                      {{ formatDate(center.valid_till) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Last Renewal</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ formatDate(center.last_renewal_date || center.valid_since) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Review Decision</p>
                    <p class="text-sm font-medium" :class="{
                      'text-green-600': center.tc_review_decision === 'Approved',
                      'text-yellow-600': center.tc_review_decision === 'Pending',
                      'text-red-600': center.tc_review_decision === 'Rejected'
                    }">
                      {{ center.tc_review_decision }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Center Information</h4>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-1 gap-3">
                  <div>
                    <p class="text-xs text-gray-500">Institute Name</p>
                    <p class="text-sm font-medium text-gray-800">{{ center.institute_name }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Location</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ center.center_location }}, {{ center.state_dzongkhag }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">City/Gewog</p>
                    <p class="text-sm font-medium text-gray-800">{{ center.city_gewog }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Target Category</p>
                    <p class="text-sm font-medium text-gray-800">{{ center.target_category }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Status (if applicable) -->
          <div v-if="center.payment_id" class="mb-6">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Payment Information</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Payment ID</p>
                  <p class="text-sm font-medium text-gray-800">{{ center.payment_id }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Payment Status</p>
                  <p class="text-sm font-medium"
                    :class="center.is_payment_complete ? 'text-green-600' : 'text-yellow-600'">
                    {{ center.is_payment_complete ? 'Completed' : 'Pending' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end mt-8 space-x-4">
            <!-- View Certificate Button - show if active -->
            <button v-if="center.is_active" @click="openCertificateDialog(center)"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Certificate
              </span>
            </button>

            <!-- Renewal Button - only show if active, not in renewal process, and within 90 days of expiration or expired -->
            <button
              v-if="center.is_active && !isRenewalInProgress(center) && (getDaysUntilExpiration(center) <= 90 || getDaysUntilExpiration(center) <= 0)"
              @click="openRenewalDialog(center)"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline"
              :class="{ 'animate-pulse': getDaysUntilExpiration(center) <= 30 }">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Renew Teaching Center
              </span>
            </button>
          </div>

          <!-- Renewal in progress message -->
          <div v-if="isRenewalInProgress(center)"
            class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
            <h4 class="font-medium">Renewal In Progress</h4>
            <p class="mt-1 text-sm">
              Your renewal application has been submitted and is currently under review.
              You will be notified once the review is complete.
            </p>
          </div>

          <!-- If rejected, show reason -->
          <div v-if="center.tc_review_decision === 'Rejected' && center.tc_reason_if_rejected"
            class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <h4 class="font-medium">Application Rejected</h4>
            <p class="mt-1 text-sm">
              Reason: {{ center.tc_reason_if_rejected }}
            </p>
            <div class="mt-3">
              <button @click="openRenewalDialog(center)"
                class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
                Apply Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Renewal Confirmation Dialog -->
    <div v-if="showRenewalDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Teaching Center Renewal Application</h3>

        <!-- Renewal Form -->
        <form @submit.prevent="confirmRenewal" class="space-y-6">
          <div v-if="selectedCenter">
            <!-- Teaching Center Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Center Name</label>
                <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
                  {{ selectedCenter.center_name }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Center Location</label>
                <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
                  {{ selectedCenter.center_location }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">City/Gewog</label>
                <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
                  {{ selectedCenter.city_gewog }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">State/Dzongkhag</label>
                <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
                  {{ selectedCenter.state_dzongkhag }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Target Category</label>
                <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
                  {{ selectedCenter.target_category }}
                </div>
              </div>
            </div>

            <!-- Attachments -->
            <div class="mb-4">
              <label for="attachments" class="block text-sm font-medium text-gray-700">
                Attachments (if any)
              </label>
              <input type="file" id="attachments" @change="handleFileUpload"
                class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              <p class="mt-1 text-sm text-gray-500">You can attach relevant documents here.</p>
              <p v-if="selectedFileName" class="mt-1 text-sm text-green-600">Selected: {{ selectedFileName }}</p>
            </div>

            <!-- Remarks -->
            <div class="mb-4">
              <label for="remarks" class="block text-sm font-medium text-gray-700">
                Remarks
              </label>
              <textarea id="remarks" v-model="renewalFormData.remarks" rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>

            <!-- Declaration -->
            <div class="flex items-start mb-4">
              <div class="flex items-center h-5">
                <input id="declaration" type="checkbox" v-model="renewalFormData.tc_declaration" required
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              </div>
              <div class="ml-3 text-sm">
                <label for="declaration" class="font-medium text-gray-700">Declaration</label>
                <p class="text-gray-500">
                  I hereby declare that the information provided is true and correct to the best of my knowledge.
                </p>
              </div>
            </div>
          </div>

          <div v-if="isRenewing" class="flex items-center justify-center mb-4">
            <div class="inline-block animate-spin text-blue-600 text-xl mr-2">⌛</div>
            <p>Processing renewal...</p>
          </div>

          <div class="flex justify-end space-x-4">
            <button type="button" @click="closeRenewalDialog"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              :disabled="isRenewing">
              Cancel
            </button>
            <button type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              :disabled="isRenewing || !renewalFormData.tc_declaration">
              Submit Renewal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Certificate Dialog -->
    <CertificateDialog v-if="showCertificateDialog" :show="showCertificateDialog" :center-data="selectedCenter"
      :cert-type="'teaching-center'" @close="closeCertificateDialog" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { useToast } from 'vue-toastification';
import apiService from '@/services/services';
import CertificateDialog from './CertificateDialog.vue';

// State variables
const teachingCenters = ref([]);
const isLoading = ref(true);
const apiError = ref(false);
const errorMessage = ref('');
const showRenewalDialog = ref(false);
const showCertificateDialog = ref(false);
const isRenewing = ref(false);
const selectedCenter = ref(null);
const selectedFile = ref(null);
const selectedFileName = ref('');

// Renewal form data
const renewalFormData = ref({
  tc_attachments: null,
  remarks: '',
  tc_declaration: false,
});

// Get toast notification
const toast = useToast();


// Format date function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'N/A';
  }
};

// Calculate days until expiration
const getDaysUntilExpiration = (center) => {
  if (!center.valid_till) return 0;

  try {
    const today = new Date();
    const expirationDate = new Date(center.valid_till);
    const timeDiff = expirationDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  } catch (e) {
    console.error('Error calculating days until expiration:', e);
    return 0;
  }
};

// Check if renewal is in progress
const isRenewalInProgress = (center) => {
  return center.tc_review_decision === 'Pending' && !center.is_active;
};

// Get status header class based on expiration
const getStatusHeaderClass = (center) => {
  if (!center.is_active) {
    return 'bg-yellow-600';
  }

  if (getDaysUntilExpiration(center) <= 0) {
    return 'bg-red-600';
  }

  if (getDaysUntilExpiration(center) <= 30) {
    return 'bg-orange-600';
  }

  if (getDaysUntilExpiration(center) <= 90) {
    return 'bg-yellow-600';
  }

  return 'bg-green-600';
};

// Function to set default dates if they're missing
const setDefaultDates = async (center) => {
  if (!center || !center.id) {
    toast.error('Teaching center data not available');
    return;
  }

  try {
    // Set default values for validity dates
    const today = new Date();
    const oneYearFromNow = new Date(today);
    oneYearFromNow.setFullYear(today.getFullYear() + 1);

    // Format dates for API
    const validSince = today.toISOString().split('T')[0];
    const validTill = oneYearFromNow.toISOString().split('T')[0];

    // Prepare payload for PATCH request
    const updateData = {
      valid_since: validSince,
      valid_till: validTill
    };

    // Send PATCH request to update teaching center
    await apiService.patchEpcTeachingCenter(center.id, updateData);

    // Update local data
    const updatedCenters = teachingCenters.value.map(c => {
      if (c.id === center.id) {
        return { ...c, valid_since: validSince, valid_till: validTill };
      }
      return c;
    });

    teachingCenters.value = updatedCenters;

    toast.success('Default dates set successfully!');

  } catch (error) {
    console.error('Error setting default dates:', error);
    toast.error(error.response?.data?.message || 'Failed to set default dates. Please try again.');
  }
};

// File upload handler
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    selectedFileName.value = file.name;
  } else {
    selectedFile.value = null;
    selectedFileName.value = '';
  }
};

// Open renewal dialog
const openRenewalDialog = (center) => {
  selectedCenter.value = center;
  renewalFormData.value = {
    tc_attachments: null,
    remarks: '',
    tc_declaration: false,
  };
  showRenewalDialog.value = true;
};

// Close renewal dialog
const closeRenewalDialog = () => {
  showRenewalDialog.value = false;
  selectedCenter.value = null;
  selectedFile.value = null;
  selectedFileName.value = '';
};

// Open certificate dialog
const openCertificateDialog = (center) => {
  selectedCenter.value = center;
  showCertificateDialog.value = true;
};

// Close certificate dialog
const closeCertificateDialog = () => {
  showCertificateDialog.value = false;
  selectedCenter.value = null;
};

// Submit renewal request
const confirmRenewal = async () => {
  if (!selectedCenter.value) {
    toast.error('No teaching center selected for renewal');
    closeRenewalDialog();
    return;
  }

  if (!renewalFormData.value.tc_declaration) {
    toast.error('Please accept the declaration');
    return;
  }

  isRenewing.value = true;

  try {
    // Calculate new valid till date (current valid_till + 1 day + 12 months)
    let currentValidTill = new Date(selectedCenter.value.valid_till || new Date());
    let newValidTill = new Date(currentValidTill);
    newValidTill.setDate(newValidTill.getDate() + 1); // Add 1 day
    newValidTill.setMonth(newValidTill.getMonth() + 12); // Add 12 months

    // Store the current valid_since as last_renewal_date
    const lastRenewalDate = selectedCenter.value.valid_since;

    // Prepare FormData for PATCH request with file upload
    const formData = new FormData();

    // Add renewal fields
    formData.append('tc_review_decision', 'Pending');
    formData.append('is_payment_complete', false);
    formData.append('is_active', false);
    formData.append('remarks', renewalFormData.value.remarks || '');
    formData.append('tc_declaration', true);

    // Store last renewal date
    formData.append('last_renewal_date', lastRenewalDate);

    // Add dates
    formData.append('valid_since', new Date().toISOString().split('T')[0]); // Today's date
    formData.append('valid_till', newValidTill.toISOString().split('T')[0]); // New expiration date

    // Add file if selected
    if (selectedFile.value) {
      formData.append('tc_attachments', selectedFile.value);
    }

    // Send PATCH request to update teaching center
    await apiService.patchEpcTeachingCenter(selectedCenter.value.id, formData);

    // Update local data
    const updatedCenters = teachingCenters.value.map(center => {
      if (center.id === selectedCenter.value.id) {
        return {
          ...center,
          tc_review_decision: 'Pending',
          is_payment_complete: false,
          is_active: false,
          valid_since: new Date().toISOString().split('T')[0],
          valid_till: newValidTill.toISOString().split('T')[0],
          last_renewal_date: center.valid_since,
          remarks: renewalFormData.value.remarks || center.remarks,
          tc_declaration: true
        };
      }
      return center;
    });

    teachingCenters.value = updatedCenters;

    toast.success('Teaching center renewal initiated successfully!');

    // Close dialog
    closeRenewalDialog();

  } catch (error) {
    console.error('Error initiating teaching center renewal:', error);
    toast.error(error.response?.data?.message || 'Failed to initiate renewal. Please try again.');
  } finally {
    isRenewing.value = false;
  }
};

// Fetch teaching centers data
const fetchData = async () => {
  isLoading.value = true;
  apiError.value = false;

  try {
    // Fetch teaching centers
    const response = await apiService.getEpcTeachingCenters();

    if (response && response.data && response.data.results) {
      teachingCenters.value = response.data.results;
    } else {
      teachingCenters.value = [];
    }
  } catch (error) {
    console.error('Error fetching teaching centers:', error);
    errorMessage.value = error.response?.data?.message || 'Error fetching teaching center data. Please try again.';
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Fetch data on component mount
onMounted(fetchData);
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
