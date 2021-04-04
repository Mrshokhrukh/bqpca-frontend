<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Renewal Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please review your personal details to ensure your eligibility for renewal.
      </p>
    </div>

    <!-- Pending Renewal Application Message -->
    <div v-if="healthStore.visibleMenus.hasRenewalInProgress"
      class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-6 mb-6 rounded-xl shadow-md">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <InformationCircleIcon class="h-6 w-6 text-blue-500" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-blue-800">Renewal Application In Progress</h3>
          <div class="mt-2 text-base text-blue-700">
            <p>You already have a renewal application under review by our staff. You can track the status of your
              application in the "My Applications" section.</p>
          </div>
          <div class="mt-6">
            <router-link to="/admin/user/health_certification/my_applications"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              View My Applications
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Regular Application Form (Only shown if no pending renewal) -->
    <div v-else>
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p class="mt-4 text-gray-600">Loading your application data...</p>
      </div>

      <!-- Error Message -->
      <div v-else-if="loadError" class="bg-red-50 border border-red-200 rounded-xl p-6 my-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error Loading Data</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ loadError }}</p>
            </div>
            <div class="mt-4">
              <button type="button" @click="fetchApplicationData"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form Card -->
      <div v-else class="bg-white border rounded-xl shadow-sm p-6">
        <!-- Personal Details Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">Personal Details</h3>
          <p class="mt-1 text-sm text-gray-500">Verify your personal information.</p>
        </div>

        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- CID Number -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">CID No./Identity/Work Permit No.</label>
            <input type="text" v-model="formData.cid_no" disabled
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
          </div>

          <!-- Full Name -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" v-model="formData.full_name" disabled
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
          </div>

          <!-- Gender -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <input type="text" v-model="formData.gender" disabled
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
          </div>

          <!-- Date of Birth -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input type="text" v-model="formData.date_of_birth" disabled
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
          </div>

          <!-- Contact Number -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="text" v-model="formData.contact_no" disabled
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
          </div>

          <!-- Email Address (if available) -->
          <div class="col-span-1" v-if="formData.email_address">
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="text" v-model="formData.email_address" disabled
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
          </div>

          <!-- Village/City -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Village</label>
            <input type="text" v-model="formData.village" disabled
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
          </div>

          <!-- Gewog/State -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Gewog</label>
            <input type="text" v-model="formData.gewog" disabled
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
          </div>

          <!-- Dzongkhag/Country -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Dzongkhag</label>
            <input type="text" v-model="formData.dzongkhag" disabled
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
          </div>

          <!-- Registration Details -->
          <div class="col-span-1">
            <div :class="[
              'rounded-xl p-4',
              hasExpired ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
            ]">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" :class="[
                  'h-5 w-5 mr-2',
                  hasExpired ? 'text-red-600' : 'text-blue-600'
                ]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span :class="[
                  'text-sm font-medium',
                  hasExpired ? 'text-red-900' : 'text-blue-900'
                ]">Registration Information</span>
              </div>
              <div class="mt-2 grid grid-cols-2 gap-1">
                <div>
                  <div :class="['text-sm', hasExpired ? 'text-red-700' : 'text-blue-700']">Registration Date</div>
                  <div :class="['text-sm font-medium', hasExpired ? 'text-red-900' : 'text-blue-900']">
                    {{ formatDisplayDate(formData.registration_date) }}
                  </div>
                </div>
                <div>
                  <div :class="['text-sm', hasExpired ? 'text-red-700' : 'text-blue-700']">Expiry Date</div>
                  <div :class="['text-sm font-medium', hasExpired ? 'text-red-900' : 'text-blue-900']">
                    {{ formatDisplayDate(formData.expiry_date) }}
                    <span v-if="hasExpired"
                      class="ml-1 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Expired</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Renewal Details Section -->
        <div v-if="!isSubmitting" class="border-t border-gray-200 bg-gray-50 p-6 mt-6">
          <h3 class="text-lg font-semibold text-gray-900">Renewal Confirmation</h3>
          <p class="mt-1 text-sm text-gray-500">Confirm your application details and submit for renewal.</p>

          <!-- Application Status -->
          <div class="mt-6 p-4 rounded-lg" :class="formData.is_active ? 'bg-green-50' : 'bg-yellow-50'">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2"
                :class="formData.is_active ? 'text-green-600' : 'text-yellow-600'" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium" :class="formData.is_active ? 'text-green-900' : 'text-yellow-900'">
                Application Status: {{ formData.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <p class="mt-2 text-sm" :class="formData.is_active ? 'text-green-700' : 'text-yellow-700'">
              {{ formData.is_active
                ? 'Your application is currently active. Renewing will extend the validity period.'
                : 'Your application is inactive. Renewing will activate your application and extend the validity.'
              }}
            </p>
          </div>

          <!-- Remarks Field -->
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
            <textarea v-model="remarks" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Enter any additional information or remarks for your renewal application"></textarea>
          </div>

          <!-- Declaration Checkbox -->
          <div class="mt-6">
            <div class="flex items-start space-x-3 bg-white p-4 rounded-lg">
              <input type="checkbox" v-model="declaration"
                class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label class="text-sm text-gray-700">
                I hereby declare that all the information provided is true and correct to the best of my knowledge.
                I understand that any false statements may result in the rejection of my renewal application.
              </label>
            </div>
          </div>
        </div>

        <!-- Submission Status -->
        <div v-if="isSubmitting" class="border-t border-gray-200 bg-gray-50 p-6 mt-6 text-center">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4">
          </div>
          <p class="text-gray-700">Submitting your renewal application...</p>
        </div>

        <!-- Action Buttons -->
        <div class="mt-12 flex justify-end space-x-4 p-8">
          <button @click="handleCancel" :disabled="isSubmitting"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
          <button @click="handleSubmit" :disabled="isSubmitting || !declaration"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Submit Renewal Application
          </button>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <TransitionRoot as="template" :show="showConfirmation">
        <Dialog as="div" class="relative z-50" @close="showConfirmation = false">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
            leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild as="template" enter="ease-out duration-300"
                enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                leave-from="opacity-100 translate-y-0 sm:scale-100"
                leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <DialogPanel
                  class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div class="mt-3 text-center sm:mt-5">
                      <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                        Confirm Renewal Application
                      </DialogTitle>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">
                          You are about to submit your renewal application. This action cannot be undone.
                          Are you sure you want to proceed?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button type="button"
                      class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                      @click="confirmSubmit">
                      Confirm
                    </button>
                    <button type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      @click="showConfirmation = false">
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/services';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import { useHealthCertificationStore } from '@/stores/mhpcNavigationStore';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { InformationCircleIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const healthStore = useHealthCertificationStore();

// Form data state
const formData = ref({
  cid_no: '',
  full_name: '',
  gender: '',
  date_of_birth: '',
  contact_no: '',
  email_address: '',
  village: '',
  gewog: '',
  dzongkhag: '',
  registration_date: '',
  expiry_date: '',
  id: null,
  registration_type: null,
  is_active: false,
});

// UI state
const showConfirmation = ref(false);
const isLoading = ref(true);
const isSubmitting = ref(false);
const loadError = ref('');
const hasExpired = computed(() => {
  if (!formData.value.expiry_date) return false;

  const expiryDate = new Date(formData.value.expiry_date);
  const today = new Date();

  return expiryDate < today;
});
const declaration = ref(false);
const remarks = ref('');

onMounted(async () => {
  // Initialize health store to make sure we have the latest application status
  await healthStore.initialize();

  // Only fetch application data if there's no renewal in progress
  if (!healthStore.visibleMenus.hasRenewalInProgress) {
    await fetchApplicationData();
  }
});

const fetchApplicationData = async () => {
  isLoading.value = true;
  loadError.value = '';

  try {
    // Get user ID from auth store
    const userId = authStore.userId;

    if (!userId) {
      throw new Error('User ID not found. Please log in again.');
    }

    // First try to get specific application by ID if we have one
    // This might come from a route parameter or state
    let latestApplication = null;
    const routeApplicationId = router.currentRoute.value.params.id;

    try {
      if (routeApplicationId) {
        // If we have an ID from the route, get that specific application
        const specificResponse = await apiService.getMhpcNewApplication(routeApplicationId);
        latestApplication = specificResponse.data;
      } else {
        // Otherwise get all applications
        const response = await apiService.getMhpcNewApplications();

        // Process response data
        let applications = [];
        if (Array.isArray(response.data)) {
          applications = response.data;
        } else if (response.data && Array.isArray(response.data.results)) {
          applications = response.data.results;
        }

        // Find the user's active application
        // Look for an active application first
        latestApplication = applications.find(app =>
          app.is_active === true &&
          (app.email_address === authStore.user.email || app.contact_no === authStore.user.phone)
        );

        // If no active application found, try to find any application that matches the user
        if (!latestApplication) {
          latestApplication = applications.find(app =>
            app.email_address === authStore.user.email || app.contact_no === authStore.user.phone
          );
        }
      }
    } catch (error) {
      console.error('Error fetching applications list:', error);
      // Continue to try direct API call with user info
    }

    if (!latestApplication) {
      // If we still don't have an application, show appropriate error message
      throw new Error('No existing application found. Please complete a new application first.');
    }

    console.log('Found application:', latestApplication);

    // Set the form data with the application details
    formData.value = {
      id: latestApplication.id,
      cid_no: latestApplication.cid_no || '',
      full_name: latestApplication.full_name || '',
      gender: latestApplication.gender || '',
      date_of_birth: latestApplication.date_of_birth || '',
      contact_no: latestApplication.contact_no || '',
      email_address: latestApplication.email_address || '',
      village: latestApplication.village || '',
      gewog: latestApplication.gewog || '',
      dzongkhag: latestApplication.dzongkhag || '',
      registration_date: latestApplication.registration_date || '',
      expiry_date: latestApplication.expiry_date || '',
      registration_type: latestApplication.registration_type,
      is_active: latestApplication.is_active,
    };

  } catch (error) {
    console.error('Error fetching application data:', error);
    loadError.value = error.message || 'Failed to load application data. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const formatDisplayDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.log(error)
    return dateString;
  }
};

const formatDateForAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const handleSubmit = () => {
  if (!declaration.value) {
    toast.warning('Please accept the declaration to proceed.');
    return;
  }

  showConfirmation.value = true;
};

const confirmSubmit = async () => {
  showConfirmation.value = false;
  isSubmitting.value = true;

  try {
    // Calculate new expiry date (5 years from today)
    const today = new Date();
    const newExpiryDate = new Date(today);
    newExpiryDate.setFullYear(today.getFullYear() + 5);

    // Fetch the application to get the qualification ID
    const appResponse = await apiService.getMhpcNewApplication(formData.value.id);
    const application = appResponse.data;

    // Find primary qualification
    if (!application.user_qualifications || application.user_qualifications.length === 0) {
      toast.error('No qualifications found in this application');
      isSubmitting.value = false;
      return;
    }

    const primaryQualification = application.user_qualifications.find(q => q.is_primary_qualification);
    if (!primaryQualification) {
      toast.error('Primary qualification not found');
      isSubmitting.value = false;
      return;
    }

    // Create the properly structured renewal data
    const renewalData = {
      application: formData.value.id,
      user_qualification: primaryQualification.id,
      new_expiry_date: formatDateForAPI(newExpiryDate),
      renewal_review_status: "Pending",
      renewal_review_remarks: remarks.value || "",
      renewal_endorsement_decision: "Pending"
    };

    console.log('Submitting renewal data:', renewalData);

    // Submit JSON object directly (not FormData)
    await apiService.createMhpcRenewal(renewalData);

    toast.success('Renewal application submitted successfully! It will be reviewed by our staff.');
    await healthStore.initialize();
    router.push('/admin/user/health_certification/dashboard');

  } catch (error) {
    console.error('Error submitting renewal:', error);
    toast.error(error.response?.data?.message || 'Failed to submit renewal. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/admin/user/health_certification/dashboard');
};
</script>

<style>
html,
body {
  overflow: hidden;
  height: 100%;
}

/* Make sure only one container handles scrolling */
.max-w-7xl {
  height: calc(100vh - 60px);
  /* Adjust based on your header/footer height */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* Smooth scrolling on iOS/macOS */
}

/* Safari-specific fixes */
@media not all and (min-resolution:.001dpcm) {
  @supports (-webkit-appearance:none) {
    .max-w-7xl {
      overflow-y: auto !important;
    }

    .fixed.inset-0 {
      overflow: hidden !important;
    }
  }
}
</style>
